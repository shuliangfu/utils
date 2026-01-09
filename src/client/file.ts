/**
 * @module @dreamer/utils/client/file
 *
 * 客户端文件处理工具，提供浏览器文件操作的统一接口。
 *
 * 功能特性：
 * - 文件读取：File API 封装，文本、二进制、数据 URL 读取
 * - 文件写入：Blob 创建和下载，文件下载功能
 * - 文件类型检测：MIME 类型检测，文件扩展名检测，文件签名检测
 * - 文件流式处理：ReadableStream 处理，大文件分块读取
 * - 文件监控：文件选择监听，拖拽文件监听
 * - 文件预览：图片、文本、PDF 预览
 *
 * 环境兼容性：
 * - 服务端：❌ 不支持（Deno 运行时）
 * - 客户端：✅ 支持（浏览器环境）
 *
 * @example
 * ```typescript
 * import { FileReader } from "jsr:@dreamer/utils/client/file";
 *
 * const fileReader = new FileReader();
 * const text = await fileReader.readAsText(file);
 * ```
 */

/**
 * 文件类型检测结果
 */
export interface FileTypeInfo {
  /** MIME 类型 */
  mime: string;
  /** 文件扩展名 */
  ext: string;
  /** 文件签名（Magic Number） */
  signature?: string;
}

/**
 * 文件读取器类
 * 封装 FileReader API，提供文件读取功能
 */
export class FileReader {
  /**
   * 读取文本文件
   * @param file File 对象
   * @param encoding 编码格式（默认：utf-8）
   * @returns 文件内容
   */
  readAsText(file: File, encoding: string = "utf-8"): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new globalThis.FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        reject(new Error("读取文件失败"));
      };
      reader.readAsText(file, encoding);
    });
  }

  /**
   * 读取二进制文件（ArrayBuffer）
   * @param file File 对象
   * @returns ArrayBuffer
   */
  readAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new globalThis.FileReader();
      reader.onload = () => {
        resolve(reader.result as ArrayBuffer);
      };
      reader.onerror = () => {
        reject(new Error("读取文件失败"));
      };
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * 读取数据 URL（Base64）
   * @param file File 对象
   * @returns 数据 URL 字符串
   */
  readAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new globalThis.FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        reject(new Error("读取文件失败"));
      };
      reader.readAsDataURL(file);
    });
  }

  /**
   * 读取二进制文件（Uint8Array）
   * @param file File 对象
   * @returns Uint8Array
   */
  async readAsUint8Array(file: File): Promise<Uint8Array> {
    const arrayBuffer = await this.readAsArrayBuffer(file);
    return new Uint8Array(arrayBuffer);
  }
}

/**
 * 文件写入器类
 * 提供文件下载功能
 */
export class FileWriter {
  /**
   * 下载文本文件
   * @param filename 文件名
   * @param content 文件内容
   * @param mimeType MIME 类型（默认：text/plain）
   */
  async downloadText(
    filename: string,
    content: string,
    mimeType: string = "text/plain",
  ): Promise<void> {
    const blob = new Blob([content], { type: mimeType });
    await this.downloadBlob(filename, blob);
  }

  /**
   * 下载二进制文件
   * @param filename 文件名
   * @param data ArrayBuffer 或 Uint8Array
   * @param mimeType MIME 类型（默认：application/octet-stream）
   */
  async downloadBinary(
    filename: string,
    data: ArrayBuffer | Uint8Array,
    mimeType: string = "application/octet-stream",
  ): Promise<void> {
    // 使用类型断言解决 TypeScript 类型检查问题
    const blob = new Blob([data as BlobPart], { type: mimeType });
    await this.downloadBlob(filename, blob);
  }

  /**
   * 下载 Blob
   * @param filename 文件名
   * @param blob Blob 对象
   */
  downloadBlob(filename: string, blob: Blob): Promise<void> {
    return Promise.resolve().then(() => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }
}

/**
 * 文件类型检测器类
 * 检测文件的 MIME 类型、扩展名和文件签名
 */
export class FileTypeDetector {
  /**
   * 根据文件扩展名获取 MIME 类型
   * @param filename 文件名或路径
   * @returns MIME 类型
   */
  getMimeType(filename: string): string {
    const ext = this.getExtension(filename);
    return this.getMimeTypeByExtension(ext);
  }

  /**
   * 根据扩展名获取 MIME 类型
   * @param ext 文件扩展名
   * @returns MIME 类型
   */
  private getMimeTypeByExtension(ext: string): string {
    const mimeTypes: Record<string, string> = {
      // 文本类型
      txt: "text/plain",
      html: "text/html",
      htm: "text/html",
      css: "text/css",
      js: "application/javascript",
      json: "application/json",
      xml: "application/xml",
      csv: "text/csv",
      md: "text/markdown",
      // 图片类型
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
      svg: "image/svg+xml",
      ico: "image/x-icon",
      bmp: "image/bmp",
      // 音频类型
      mp3: "audio/mpeg",
      wav: "audio/wav",
      ogg: "audio/ogg",
      // 视频类型
      mp4: "video/mp4",
      webm: "video/webm",
      avi: "video/x-msvideo",
      // 文档类型
      pdf: "application/pdf",
      doc: "application/msword",
      docx:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      xls: "application/vnd.ms-excel",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ppt: "application/vnd.ms-powerpoint",
      pptx:
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      // 压缩类型
      zip: "application/zip",
      gz: "application/gzip",
      tar: "application/x-tar",
      rar: "application/x-rar-compressed",
      "7z": "application/x-7z-compressed",
    };

    return mimeTypes[ext.toLowerCase()] || "application/octet-stream";
  }

  /**
   * 获取文件扩展名
   * @param filename 文件名或路径
   * @returns 文件扩展名（不含点号）
   */
  getExtension(filename: string): string {
    const parts = filename.split(".");
    if (parts.length < 2) {
      return "";
    }
    return parts[parts.length - 1].toLowerCase();
  }

  /**
   * 检测文件类型（通过文件签名）
   * @param file File 对象
   * @returns 文件类型信息
   */
  async detect(file: File): Promise<FileTypeInfo> {
    // 首先根据扩展名获取 MIME 类型
    const ext = this.getExtension(file.name);
    const mimeByExt = this.getMimeTypeByExtension(ext);

    try {
      // 读取文件的前几个字节来检测文件签名
      const slice = file.slice(0, 16);
      const arrayBuffer = await slice.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);

      // 检测文件签名（Magic Number）
      const signature = this.detectSignature(buffer);
      const mimeBySignature = signature
        ? this.getMimeTypeBySignature(signature)
        : null;

      return {
        mime: mimeBySignature || mimeByExt || file.type ||
          "application/octet-stream",
        ext,
        signature,
      };
    } catch (_error) {
      // 如果读取失败，返回基于扩展名和文件类型的类型
      return {
        mime: mimeByExt || file.type || "application/octet-stream",
        ext,
      };
    }
  }

  /**
   * 检测文件签名（Magic Number）
   * @param buffer 文件前几个字节
   * @returns 文件签名标识
   */
  private detectSignature(buffer: Uint8Array): string | undefined {
    // 常见文件签名
    const signatures: Array<[Uint8Array, string]> = [
      // PNG
      [
        new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]),
        "PNG",
      ],
      // JPEG
      [new Uint8Array([0xFF, 0xD8, 0xFF]), "JPEG"],
      // GIF
      [new Uint8Array([0x47, 0x49, 0x46, 0x38]), "GIF"],
      // PDF
      [new Uint8Array([0x25, 0x50, 0x44, 0x46]), "PDF"],
      // ZIP
      [new Uint8Array([0x50, 0x4B, 0x03, 0x04]), "ZIP"],
      // GZIP
      [new Uint8Array([0x1F, 0x8B]), "GZIP"],
    ];

    for (const [signature, name] of signatures) {
      if (this.matchesSignature(buffer, signature)) {
        return name;
      }
    }

    return undefined;
  }

  /**
   * 检查缓冲区是否匹配签名
   * @param buffer 文件缓冲区
   * @param signature 签名字节
   * @returns 是否匹配
   */
  private matchesSignature(
    buffer: Uint8Array,
    signature: Uint8Array,
  ): boolean {
    if (buffer.length < signature.length) {
      return false;
    }
    for (let i = 0; i < signature.length; i++) {
      if (buffer[i] !== signature[i]) {
        return false;
      }
    }
    return true;
  }

  /**
   * 根据文件签名获取 MIME 类型
   * @param signature 文件签名
   * @returns MIME 类型
   */
  private getMimeTypeBySignature(signature: string): string {
    const signatureMap: Record<string, string> = {
      PNG: "image/png",
      JPEG: "image/jpeg",
      GIF: "image/gif",
      PDF: "application/pdf",
      ZIP: "application/zip",
      GZIP: "application/gzip",
    };

    return signatureMap[signature] || "application/octet-stream";
  }
}

/**
 * 文件流处理器类
 * 提供大文件的流式读取功能
 */
export class FileStream {
  /**
   * 创建文件读取流
   * @param file File 对象
   * @param chunkSize 每次读取的块大小（字节，默认：64KB）
   * @returns ReadableStream
   */
  createReader(
    file: File,
    chunkSize: number = 64 * 1024,
  ): ReadableStream<Uint8Array> {
    let offset = 0;

    return new ReadableStream({
      async pull(controller) {
        if (offset >= file.size) {
          controller.close();
          return;
        }

        const chunk = file.slice(offset, offset + chunkSize);
        const arrayBuffer = await chunk.arrayBuffer();
        controller.enqueue(new Uint8Array(arrayBuffer));
        offset += chunkSize;
      },
    });
  }
}

/**
 * 文件监控器配置选项
 */
export interface FileWatcherOptions {
  /** 是否支持多选（默认：false） */
  multiple?: boolean;
  /** 文件类型限制（accept 属性） */
  accept?: string;
}

/**
 * 文件监控器类
 * 监听文件选择和拖拽事件
 */
/**
 * 事件监听器类型
 */
type EventListener = ((files: File[]) => void) | ((error: Error) => void);

export class FileWatcher {
  private listeners: Map<string, Set<EventListener>> = new Map();

  /**
   * 监听文件选择
   * @param inputElement input[type="file"] 元素
   * @param options 选项
   */
  watchInput(
    inputElement: HTMLInputElement | null,
    options?: FileWatcherOptions,
  ): void {
    if (!inputElement) {
      return;
    }

    if (options?.multiple !== undefined) {
      inputElement.multiple = options.multiple;
    }
    if (options?.accept) {
      inputElement.accept = options.accept;
    }

    inputElement.addEventListener("change", (e: Event) => {
      const target = e.target as HTMLInputElement;
      const files = target.files ? Array.from(target.files) : [];
      this.emit("select", files);
    });
  }

  /**
   * 监听拖拽文件
   * @param element 拖拽区域元素
   */
  watchDrop(element: Element | null): void {
    if (!element) {
      return;
    }

    element.addEventListener("dragover", (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    });

    element.addEventListener("drop", (e: Event) => {
      e.preventDefault();
      e.stopPropagation();

      const dataTransfer = (e as DragEvent).dataTransfer;
      if (dataTransfer?.files) {
        const files = Array.from(dataTransfer.files);
        this.emit("drop", files);
      }
    });
  }

  /**
   * 监听事件
   * @param event 事件类型
   * @param listener 事件监听器
   */
  on(event: "select", listener: (files: File[]) => void): void;
  on(event: "drop", listener: (files: File[]) => void): void;
  on(event: "error", listener: (error: Error) => void): void;
  on(event: string, listener: EventListener): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);
  }

  /**
   * 移除事件监听器
   * @param event 事件类型
   * @param listener 事件监听器
   */
  off(event: "select", listener: (files: File[]) => void): void;
  off(event: "drop", listener: (files: File[]) => void): void;
  off(event: "error", listener: (error: Error) => void): void;
  off(event: string, listener: EventListener): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.delete(listener);
    }
  }

  /**
   * 触发事件
   * @param event 事件类型
   * @param data 事件数据
   */
  private emit(event: "select", data: File[]): void;
  private emit(event: "drop", data: File[]): void;
  private emit(event: "error", data: Error): void;
  private emit(event: string, data: any): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      for (const listener of listeners) {
        try {
          listener(data);
        } catch (error) {
          this.emit(
            "error",
            error instanceof Error ? error : new Error(String(error)),
          );
        }
      }
    }
  }
}

/**
 * 文件预览器类
 * 提供文件预览功能
 */
export class FilePreview {
  private fileReader = new FileReader();

  /**
   * 预览图片
   * @param file File 对象
   * @returns 数据 URL
   */
  async image(file: File): Promise<string> {
    if (!file.type.startsWith("image/")) {
      throw new Error("文件不是图片类型");
    }
    return await this.fileReader.readAsDataURL(file);
  }

  /**
   * 预览文本
   * @param file File 对象
   * @returns 文本内容
   */
  async text(file: File): Promise<string> {
    return await this.fileReader.readAsText(file);
  }

  /**
   * 预览 PDF（返回 Object URL）
   * @param file File 对象
   * @returns Object URL
   */
  pdf(file: File): Promise<string> {
    if (file.type !== "application/pdf") {
      return Promise.reject(new Error("文件不是 PDF 类型"));
    }
    return Promise.resolve(URL.createObjectURL(file));
  }
}
