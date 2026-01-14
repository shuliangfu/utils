/**
 * @module @dreamer/utils/client/clipboard
 *
 * 剪贴板操作工具函数模块
 *
 * 提供浏览器环境下的剪贴板操作功能，包括复制文本、读取剪贴板内容等。
 *
 * 环境兼容性：
 * - 客户端：✅ 支持（浏览器环境，需要 HTTPS 或 localhost）
 * - 服务端：❌ 不支持
 */

/**
 * 复制文本到剪贴板
 *
 * 优先使用现代 Clipboard API，如果不支持则回退到 execCommand（兼容旧浏览器）
 * 注意：Clipboard API 需要在 HTTPS 或 localhost 环境下使用，且需要用户交互触发
 *
 * @param text 要复制的文本
 * @returns Promise，成功时 resolve，失败时 reject
 *
 * @example
 * ```typescript
 * import { copyToClipboard } from "@dreamer/utils/client/clipboard";
 *
 * // 复制文本
 * await copyToClipboard("Hello, World!");
 *
 * // 带错误处理
 * try {
 *   await copyToClipboard("Hello, World!");
 *   console.log("复制成功");
 * } catch (error) {
 *   console.error("复制失败:", error);
 * }
 * ```
 */
export async function copyToClipboard(text: string): Promise<void> {
  // 优先使用现代 Clipboard API
  const nav = globalThis.navigator;
  // 检查 clipboard 对象是否存在，并且 writeText 方法可用
  if (
    nav && "clipboard" in nav && nav.clipboard &&
    typeof nav.clipboard.writeText === "function"
  ) {
    try {
      await nav.clipboard.writeText(text);
      return;
    } catch (error) {
      // 如果 Clipboard API 失败（可能是权限问题或非安全上下文），回退到传统方法
      console.warn("Clipboard API 失败，使用回退方法:", error);
      // 继续执行，尝试使用回退方法
    }
  }

  // 回退方法：使用 document.execCommand（兼容旧浏览器）
  // 如果回退方法也失败，会抛出异常（Promise reject）
  return await fallbackCopyToClipboard(text);
}

/**
 * 回退的复制方法（使用 document.execCommand，兼容旧浏览器）
 *
 * @param text 要复制的文本
 * @returns Promise
 * @private
 */
function fallbackCopyToClipboard(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const doc = globalThis.document;
    if (!doc) {
      reject(new Error("document 对象不可用"));
      return;
    }

    // 创建一个临时的 textarea 元素
    // 注意：不能使用 display: none 或 visibility: hidden，因为某些浏览器（特别是 iOS Safari）
    // 在元素隐藏时无法正确执行 select() 和 execCommand('copy')
    // 使用 position: fixed 和负值位置将元素移出视口，但仍然在 DOM 中且可见（对浏览器而言）
    const textarea = doc.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "0";
    textarea.style.width = "2em";
    textarea.style.height = "2em";
    textarea.style.padding = "0";
    textarea.style.border = "none";
    textarea.style.outline = "none";
    textarea.style.boxShadow = "none";
    textarea.style.background = "transparent";
    textarea.style.opacity = "0";
    textarea.setAttribute("readonly", "");
    textarea.setAttribute("aria-hidden", "true");
    doc.body.appendChild(textarea);

    // 选中文本
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, text.length); // 兼容移动端

    try {
      // 执行复制命令
      // execCommand 已废弃，但为了向后兼容性仍需要使用
      // 使用类型断言避免 TypeScript 废弃警告
      const docWithExecCommand = doc as {
        execCommand?: (
          command: string,
          showUI?: boolean,
          value?: string,
        ) => boolean;
      };

      if (!docWithExecCommand.execCommand) {
        reject(new Error("浏览器不支持复制功能"));
        return;
      }

      const successful = docWithExecCommand.execCommand("copy");

      if (successful) {
        resolve();
      } else {
        reject(new Error("复制命令执行失败"));
      }
    } catch (error) {
      reject(
        error instanceof Error ? error : new Error("复制操作失败"),
      );
    } finally {
      // 确保总是移除临时元素
      if (textarea.parentNode) {
        doc.body.removeChild(textarea);
      }
    }
  });
}

/**
 * 从剪贴板读取文本
 *
 * 使用现代 Clipboard API
 *
 * @returns Promise<string>，返回剪贴板中的文本内容
 *
 * @example
 * ```typescript
 * import { readFromClipboard } from "@dreamer/utils/client/clipboard";
 *
 * // 读取剪贴板内容
 * const text = await readFromClipboard();
 * console.log("剪贴板内容:", text);
 * ```
 */
export async function readFromClipboard(): Promise<string> {
  const nav = globalThis.navigator;
  if (!nav?.clipboard?.readText) {
    throw new Error("浏览器不支持 Clipboard API 的读取功能");
  }

  try {
    return await nav.clipboard.readText();
  } catch (error) {
    throw new Error(
      `读取剪贴板失败: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}

/**
 * 检查是否支持剪贴板操作
 *
 * 检查是否支持 Clipboard API 或 execCommand（全兼容）
 *
 * @returns 是否支持剪贴板操作
 *
 * @example
 * ```typescript
 * import { isClipboardSupported } from "@dreamer/utils/client/clipboard";
 *
 * if (isClipboardSupported()) {
 *   await copyToClipboard("Hello");
 * } else {
 *   console.warn("浏览器不支持剪贴板操作");
 * }
 * ```
 */
export function isClipboardSupported(): boolean {
  const nav = globalThis.navigator;
  const doc = globalThis.document;

  // 优先检查现代 Clipboard API
  if (
    nav && "clipboard" in nav && nav.clipboard &&
    typeof nav.clipboard.writeText === "function"
  ) {
    return true;
  }

  // 回退检查 execCommand（兼容旧浏览器）
  if (doc) {
    const docWithExecCommand = doc as {
      execCommand?: (
        command: string,
        showUI?: boolean,
        value?: string,
      ) => boolean;
    };
    return typeof docWithExecCommand.execCommand === "function";
  }

  return false;
}

/**
 * 检查是否支持读取剪贴板
 *
 * @returns 是否支持读取剪贴板
 *
 * @example
 * ```typescript
 * import { isClipboardReadSupported } from "@dreamer/utils/client/clipboard";
 *
 * if (isClipboardReadSupported()) {
 *   const text = await readFromClipboard();
 * }
 * ```
 */
export function isClipboardReadSupported(): boolean {
  const nav = globalThis.navigator;
  return !!(nav?.clipboard?.readText);
}
