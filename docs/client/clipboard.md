# Client Clipboard 剪贴板操作

> 剪贴板操作工具函数模块，提供浏览器环境下的剪贴板复制和读取功能

[![JSR](https://jsr.io/badges/@dreamer/utils)](https://jsr.io/@dreamer/utils)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🎯 功能

剪贴板操作工具函数，提供浏览器环境下的剪贴板操作功能，包括复制文本、读取剪贴板内容等。

---

## ✨ 特性

- **复制文本到剪贴板**：
  - 优先使用现代 Clipboard API
  - 自动回退到 execCommand（兼容旧浏览器）
  - 支持 HTTPS 和 localhost 环境
- **从剪贴板读取文本**：
  - 使用现代 Clipboard API
  - 需要用户权限
- **兼容性检测**：
  - 检查是否支持剪贴板操作
  - 检查是否支持读取剪贴板

---

## 📦 安装

```bash
deno add jsr:@dreamer/utils
```

---

## 🌍 环境兼容性

- **运行时要求**：Deno 2.6+ 或 Bun 1.3.5
- **客户端**：✅ 支持（浏览器环境，需要 HTTPS 或 localhost）
- **服务端**：❌ 不支持

**注意**：
- Clipboard API 需要在 HTTPS 或 localhost 环境下使用
- 剪贴板操作需要用户交互触发（如点击事件）
- 读取剪贴板需要用户授权

---

## 📚 API 文档

### `copyToClipboard(text: string): Promise<void>`

复制文本到剪贴板。

优先使用现代 Clipboard API，如果不支持则回退到 execCommand（兼容旧浏览器）。

**参数**：
- `text` (string): 要复制的文本

**返回**：
- `Promise<void>`: 成功时 resolve，失败时 reject

**示例**：

```typescript
import { copyToClipboard } from "jsr:@dreamer/utils/client/clipboard";

// 复制文本
await copyToClipboard("Hello, World!");

// 带错误处理
try {
  await copyToClipboard("Hello, World!");
  console.log("复制成功");
} catch (error) {
  console.error("复制失败:", error);
}

// 在点击事件中使用
button.addEventListener("click", async () => {
  try {
    await copyToClipboard("要复制的文本");
    alert("复制成功！");
  } catch (error) {
    alert("复制失败，请手动复制");
  }
});
```

---

### `readFromClipboard(): Promise<string>`

从剪贴板读取文本。

使用现代 Clipboard API，需要用户授权。

**返回**：
- `Promise<string>`: 剪贴板中的文本内容

**示例**：

```typescript
import { readFromClipboard } from "jsr:@dreamer/utils/client/clipboard";

// 读取剪贴板内容
const text = await readFromClipboard();
console.log("剪贴板内容:", text);

// 带错误处理
try {
  const text = await readFromClipboard();
  console.log("剪贴板内容:", text);
} catch (error) {
  console.error("读取失败:", error);
}

// 在点击事件中使用
button.addEventListener("click", async () => {
  try {
    const text = await readFromClipboard();
    input.value = text;
  } catch (error) {
    alert("读取剪贴板失败，请检查权限");
  }
});
```

---

### `isClipboardSupported(): boolean`

检查是否支持剪贴板操作。

检查是否支持 Clipboard API 或 execCommand（全兼容）。

**返回**：
- `boolean`: 是否支持剪贴板操作

**示例**：

```typescript
import {
  isClipboardSupported,
  copyToClipboard,
} from "jsr:@dreamer/utils/client/clipboard";

if (isClipboardSupported()) {
  await copyToClipboard("Hello");
} else {
  console.warn("浏览器不支持剪贴板操作");
}
```

---

### `isClipboardReadSupported(): boolean`

检查是否支持读取剪贴板。

**返回**：
- `boolean`: 是否支持读取剪贴板

**示例**：

```typescript
import {
  isClipboardReadSupported,
  readFromClipboard,
} from "jsr:@dreamer/utils/client/clipboard";

if (isClipboardReadSupported()) {
  const text = await readFromClipboard();
} else {
  console.warn("浏览器不支持读取剪贴板");
}
```

---

## 💡 使用场景

### 1. 复制按钮

```typescript
import { copyToClipboard } from "jsr:@dreamer/utils/client/clipboard";

const copyButton = document.getElementById("copy-btn");
const textToCopy = "要复制的文本";

copyButton.addEventListener("click", async () => {
  try {
    await copyToClipboard(textToCopy);
    // 显示成功提示
    showToast("复制成功！");
  } catch (error) {
    // 显示错误提示
    showToast("复制失败，请手动复制");
  }
});
```

### 2. 一键复制链接

```typescript
import { copyToClipboard } from "jsr:@dreamer/utils/client/clipboard";

function setupCopyLinkButton() {
  const buttons = document.querySelectorAll(".copy-link-btn");

  buttons.forEach((button) => {
    button.addEventListener("click", async () => {
      const link = button.dataset.link;
      if (link) {
        try {
          await copyToClipboard(link);
          button.textContent = "已复制！";
          setTimeout(() => {
            button.textContent = "复制链接";
          }, 2000);
        } catch (error) {
          alert("复制失败，请手动复制链接");
        }
      }
    });
  });
}
```

### 3. 从剪贴板粘贴

```typescript
import { readFromClipboard } from "jsr:@dreamer/utils/client/clipboard";

const pasteButton = document.getElementById("paste-btn");
const input = document.getElementById("input");

pasteButton.addEventListener("click", async () => {
  try {
    const text = await readFromClipboard();
    input.value = text;
    showToast("粘贴成功！");
  } catch (error) {
    showToast("读取剪贴板失败，请检查权限");
  }
});
```

### 4. 兼容性检查

```typescript
import {
  isClipboardSupported,
  isClipboardReadSupported,
  copyToClipboard,
  readFromClipboard,
} from "jsr:@dreamer/utils/client/clipboard";

// 检查复制支持
if (isClipboardSupported()) {
  // 显示复制按钮
  copyButton.style.display = "block";
  copyButton.addEventListener("click", async () => {
    await copyToClipboard("要复制的文本");
  });
} else {
  // 隐藏复制按钮或显示提示
  copyButton.style.display = "none";
  console.warn("浏览器不支持剪贴板操作");
}

// 检查读取支持
if (isClipboardReadSupported()) {
  // 显示粘贴按钮
  pasteButton.style.display = "block";
  pasteButton.addEventListener("click", async () => {
    const text = await readFromClipboard();
    input.value = text;
  });
} else {
  // 隐藏粘贴按钮
  pasteButton.style.display = "none";
}
```

---

## ⚠️ 注意事项

### 1. 安全上下文要求

Clipboard API 需要在安全上下文中使用：
- HTTPS 协议
- localhost
- 127.0.0.1

在非安全上下文中，会自动回退到 execCommand 方法。

### 2. 用户交互要求

剪贴板操作必须由用户交互触发（如点击事件），不能在页面加载时自动执行。

```typescript
// ❌ 错误：不能在页面加载时自动执行
window.addEventListener("load", async () => {
  await copyToClipboard("文本"); // 可能会失败
});

// ✅ 正确：在用户交互中执行
button.addEventListener("click", async () => {
  await copyToClipboard("文本"); // 正常工作
});
```

### 3. 权限要求

读取剪贴板需要用户授权，浏览器可能会显示权限提示。

### 4. 移动端兼容性

在移动端（特别是 iOS Safari）上，execCommand 方法可能有限制，建议使用 Clipboard API。

### 5. 错误处理

始终使用 try-catch 处理剪贴板操作，因为可能因为权限、安全上下文等原因失败。

```typescript
try {
  await copyToClipboard("文本");
} catch (error) {
  // 处理错误，可以显示提示或使用备用方案
  console.error("复制失败:", error);
  // 例如：显示一个输入框让用户手动复制
}
```

---

## 🔧 实现细节

### 复制实现

1. **优先使用 Clipboard API**：
   - 检查 `navigator.clipboard.writeText` 是否可用
   - 如果可用，直接使用 Clipboard API
   - 如果失败（权限问题或非安全上下文），回退到 execCommand

2. **回退到 execCommand**：
   - 创建一个临时的 textarea 元素
   - 设置文本内容
   - 将元素添加到 DOM（不能使用 `display: none`，某些浏览器不支持）
   - 选中文本并执行 `execCommand('copy')`
   - 移除临时元素

### 读取实现

- 使用 `navigator.clipboard.readText()`
- 需要用户授权
- 不支持回退方法（读取功能较新，旧浏览器不支持）

---

## 📝 类型定义

```typescript
/**
 * 复制文本到剪贴板
 * @param text 要复制的文本
 * @returns Promise，成功时 resolve，失败时 reject
 */
export function copyToClipboard(text: string): Promise<void>;

/**
 * 从剪贴板读取文本
 * @returns Promise<string>，返回剪贴板中的文本内容
 */
export function readFromClipboard(): Promise<string>;

/**
 * 检查是否支持剪贴板操作
 * @returns 是否支持剪贴板操作
 */
export function isClipboardSupported(): boolean;

/**
 * 检查是否支持读取剪贴板
 * @returns 是否支持读取剪贴板
 */
export function isClipboardReadSupported(): boolean;
```

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可证

MIT License - 详见 [LICENSE.md](../../LICENSE.md)

---

<div align="center">

**Made with ❤️ by Dreamer Team**

</div>
