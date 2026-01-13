/**
 * @module @dreamer/utils/file
 *
 * 文件处理工具，提供统一的文件操作接口，支持服务端文件系统操作。
 *
 * 功能特性：
 * - 文件读写：文本、二进制文件读写，追加写入，文件复制和移动
 * - 文件监控：文件/目录变化监听，支持递归监控和防抖
 * - 文件类型检测：MIME 类型检测，文件扩展名检测，文件签名检测
 * - 大文件处理：流式读取和写入，分块处理，内存优化
 * - 文件压缩/解压：gzip/gunzip 压缩和解压（Deno 和 Bun 都支持）
 *
 * @example
 * ```typescript
 * import { FileManager, FileCompressor } from "jsr:@dreamer/utils/file";
 *
 * const fileManager = new FileManager();
 *
 * // 读取文本文件
 * const text = await fileManager.readText("./data.txt");
 *
 * // 写入文本文件
 * await fileManager.writeText("./output.txt", "Hello, World!");
 *
 * // 压缩文件
 * const compressor = new FileCompressor();
 * await compressor.gzip("./data.txt", "./data.txt.gz");
 *
 * // 解压文件
 * await compressor.gunzip("./data.txt.gz", "./data.txt");
 * ```
 */

import {
  copyFile,
  create,
  type FileEvent,
  type FileInfo,
  type FileWatcher as RuntimeFileWatcher,
  open,
  readFile,
  readTextFile,
  remove,
  rename,
  stat as statFile,
  watchFs,
  writeFile,
  writeTextFile,
} from "@dreamer/runtime-adapter";

/**
 * 文件变化事件类型
 */
export type FileChangeType = "create" | "modify" | "delete";

/**
 * 文件变化事件
 */
export interface FileChangeEvent {
  /** 文件路径 */
  path: string;
  /** 变化类型 */
  type: FileChangeType;
  /** 时间戳 */
  timestamp: number;
}

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
 * 文件管理器类
 * 提供文件读写、复制、移动、删除等操作
 */
export class FileManager {
  /**
   * 读取文本文件
   * @param path 文件路径
   * @param encoding 编码格式（默认：utf-8）
   * @returns 文件内容
   */
  async readText(path: string, encoding = "utf-8"): Promise<string> {
    try {
      return await readTextFile(path, encoding);
    } catch (error) {
      throw new Error(
        `读取文件失败: ${path}, ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  /**
   * 读取二进制文件
   * @param path 文件路径
   * @returns 文件内容（Uint8Array）
   */
  async readBinary(path: string): Promise<Uint8Array> {
    try {
      return await readFile(path);
    } catch (error) {
      throw new Error(
        `读取文件失败: ${path}, ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  /**
   * 写入文本文件
   * @param path 文件路径
   * @param content 文件内容
   * @param encoding 编码格式（默认：utf-8）
   */
  async writeText(
    path: string,
    content: string,
    _encoding = "utf-8",
  ): Promise<void> {
    try {
      await writeTextFile(path, content);
    } catch (error) {
      throw new Error(
        `写入文件失败: ${path}, ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  /**
   * 写入二进制文件
   * @param path 文件路径
   * @param data 文件内容（Uint8Array）
   */
  async writeBinary(path: string, data: Uint8Array): Promise<void> {
    try {
      await writeFile(path, data);
    } catch (error) {
      throw new Error(
        `写入文件失败: ${path}, ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  /**
   * 追加写入文本文件
   * @param path 文件路径
   * @param content 要追加的内容
   * @param encoding 编码格式（默认：utf-8）
   */
  async appendText(
    path: string,
    content: string,
    _encoding = "utf-8",
  ): Promise<void> {
    try {
      // runtime-adapter 的 writeTextFile 不支持 append，需要先读取现有内容
      let existingContent = "";
      try {
        existingContent = await readTextFile(path);
      } catch {
        // 文件不存在，忽略错误
      }
      await writeTextFile(path, existingContent + content);
    } catch (error) {
      throw new Error(
        `追加写入文件失败: ${path}, ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  /**
   * 复制文件
   * @param source 源文件路径
   * @param dest 目标文件路径
   */
  async copy(source: string, dest: string): Promise<void> {
    try {
      await copyFile(source, dest);
    } catch (error) {
      throw new Error(
        `复制文件失败: ${source} -> ${dest}, ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  /**
   * 移动文件（重命名）
   * @param source 源文件路径
   * @param dest 目标文件路径
   */
  async move(source: string, dest: string): Promise<void> {
    try {
      await rename(source, dest);
    } catch (error) {
      throw new Error(
        `移动文件失败: ${source} -> ${dest}, ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  /**
   * 删除文件
   * @param path 文件路径
   */
  async delete(path: string): Promise<void> {
    try {
      await remove(path);
    } catch (error) {
      throw new Error(
        `删除文件失败: ${path}, ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  /**
   * 检查文件是否存在
   * @param path 文件路径
   * @returns 是否存在
   */
  async exists(path: string): Promise<boolean> {
    try {
      await statFile(path);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 获取文件信息
   * @param path 文件路径
   * @returns 文件信息
   */
  async stat(path: string): Promise<FileInfo> {
    try {
      return await statFile(path);
    } catch (error) {
      throw new Error(
        `获取文件信息失败: ${path}, ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }
}

/**
 * 文件监控器配置选项
 */
export interface FileWatcherOptions {
  /** 要监控的路径（文件或目录） */
  path: string;
  /** 是否递归监控子目录（默认：false） */
  recursive?: boolean;
  /** 防抖延迟（毫秒，默认：300） */
  debounce?: number;
}

/**
 * 文件监控器类
 * 监控文件/目录的变化，支持防抖和递归监控
 */
export class FileWatcher {
  private options: Required<FileWatcherOptions>;
  private watcher: RuntimeFileWatcher | null = null;
  private debounceTimer: number | null = null;
  private listeners: Map<string, Set<(event: FileChangeEvent) => void>> =
    new Map();
  private isRunning = false;

  constructor(options: FileWatcherOptions) {
    this.options = {
      path: options.path,
      recursive: options.recursive || false,
      debounce: options.debounce || 300,
    };
  }

  /**
   * 监听文件变化事件
   * @param event 事件类型（'change' | 'error'）
   * @param listener 事件监听器
   */
  on(
    event: "change",
    listener: (event: FileChangeEvent) => void,
  ): void;
  on(event: "error", listener: (error: Error) => void): void;
  on(
    event: string,
    listener: ((event: FileChangeEvent) => void) | ((error: Error) => void),
  ): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener as any);
  }

  /**
   * 移除事件监听器
   * @param event 事件类型
   * @param listener 事件监听器
   */
  off(
    event: "change",
    listener: (event: FileChangeEvent) => void,
  ): void;
  off(event: "error", listener: (error: Error) => void): void;
  off(
    event: string,
    listener: ((event: FileChangeEvent) => void) | ((error: Error) => void),
  ): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.delete(listener as any);
    }
  }

  /**
   * 触发事件
   * @param event 事件类型
   * @param data 事件数据
   */
  private emit(event: "change", data: FileChangeEvent): void;
  private emit(event: "error", data: Error): void;
  private emit(event: string, data: any): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      for (const listener of listeners) {
        try {
          listener(data);
        } catch (error) {
          // 如果监听器抛出错误，触发 error 事件
          this.emit(
            "error",
            error instanceof Error ? error : new Error(String(error)),
          );
        }
      }
    }
  }

  /**
   * 开始监控
   */
  start(): Promise<void> {
    if (this.isRunning) {
      return Promise.resolve();
    }

    try {
      this.watcher = watchFs(this.options.path, {
        recursive: this.options.recursive,
      });

      this.isRunning = true;

      // 异步处理文件变化事件
      (async () => {
        for await (const event of this.watcher!) {
          this.handleFileEvent(event);
        }
      })().catch((error) => {
        this.emit(
          "error",
          error instanceof Error ? error : new Error(String(error)),
        );
      });

      return Promise.resolve();
    } catch (error) {
      this.isRunning = false;
      return Promise.reject(
        new Error(
          `启动文件监控失败: ${
            error instanceof Error ? error.message : String(error)
          }`,
        ),
      );
    }
  }

  /**
   * 处理文件变化事件（带防抖）
   * @param event 文件变化事件
   */
  private handleFileEvent(event: FileEvent): void {
    // 清除之前的防抖定时器
    if (this.debounceTimer !== null) {
      clearTimeout(this.debounceTimer);
    }

    // 设置新的防抖定时器
    this.debounceTimer = setTimeout(() => {
      for (const path of event.paths) {
        let changeType: FileChangeType;

        // 根据事件类型确定变化类型
        if (event.kind === "create") {
          changeType = "create";
        } else if (event.kind === "modify") {
          changeType = "modify";
        } else if (event.kind === "remove") {
          changeType = "delete";
        } else {
          continue; // 忽略其他类型
        }

        const changeEvent: FileChangeEvent = {
          path,
          type: changeType,
          timestamp: Date.now(),
        };

        this.emit("change", changeEvent);
      }

      this.debounceTimer = null;
    }, this.options.debounce) as unknown as number;
  }

  /**
   * 停止监控
   */
  stop(): Promise<void> {
    if (!this.isRunning) {
      return Promise.resolve();
    }

    // 清除防抖定时器
    if (this.debounceTimer !== null) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }

    // 关闭监控器
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
    }

    this.isRunning = false;
    return Promise.resolve();
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
   * @param path 文件路径
   * @returns 文件类型信息
   */
  async detect(path: string): Promise<FileTypeInfo> {
    // 首先根据扩展名获取 MIME 类型
    const ext = this.getExtension(path);
    const mimeByExt = this.getMimeTypeByExtension(ext);

    try {
      // 读取文件的前几个字节来检测文件签名
      const fullData = await readFile(path);
      const buffer = fullData.slice(0, 16);

      if (buffer.length < 4) {
        // 文件太小，无法检测签名
        return {
          mime: mimeByExt,
          ext,
        };
      }

      // 检测文件签名（Magic Number）
      const signature = this.detectSignature(buffer);
      const mimeBySignature = signature
        ? this.getMimeTypeBySignature(signature)
        : null;

      return {
        mime: mimeBySignature || mimeByExt,
        ext,
        signature,
      };
    } catch (_error) {
      // 如果读取失败，返回基于扩展名的类型
      return {
        mime: mimeByExt,
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
      [new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]), "PNG"],
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
  private matchesSignature(buffer: Uint8Array, signature: Uint8Array): boolean {
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
 * 提供大文件的流式读写功能
 */
export class FileStream {
  /**
   * 创建文件读取流
   * @param path 文件路径
   * @param chunkSize 每次读取的块大小（字节，默认：64KB）
   * @returns ReadableStream
   */
  async createReader(
    path: string,
    chunkSize: number = 64 * 1024,
  ): Promise<ReadableStream<Uint8Array>> {
    try {
      const file = await open(path, { read: true });
      const reader = file.readable.getReader();
      let buffer = new Uint8Array(0);

      return new ReadableStream({
        async pull(controller) {
          try {
            // 如果缓冲区为空，从文件流中读取数据
            if (buffer.length === 0) {
              const result = await reader.read();
              if (result.done) {
                // 文件读取完成
                try {
                  file.close();
                } catch {
                  // 文件可能已经关闭，忽略错误
                }
                controller.close();
                return;
              }
              // 确保 buffer 是 Uint8Array 类型
              buffer = new Uint8Array(result.value);
            }

            // 按照 chunkSize 分块发送数据
            if (buffer.length <= chunkSize) {
              controller.enqueue(buffer);
              buffer = new Uint8Array(0);
            } else {
              controller.enqueue(buffer.slice(0, chunkSize));
              buffer = buffer.slice(chunkSize);
            }
          } catch (error) {
            try {
              file.close();
            } catch {
              // 文件可能已经关闭，忽略错误
            }
            controller.error(error);
          }
        },
        cancel() {
          try {
            file.close();
          } catch {
            // 文件可能已经关闭，忽略错误
          }
        },
      });
    } catch (error) {
      throw new Error(
        `创建文件读取流失败: ${path}, ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  /**
   * 创建文件写入流
   * @param path 文件路径
   * @returns WritableStream
   */
  async createWriter(path: string): Promise<WritableStream<Uint8Array>> {
    try {
      const file = await create(path);
      const writer = file.writable.getWriter();

      return new WritableStream({
        async write(chunk) {
          await writer.write(chunk);
        },
        async close() {
          await writer.close();
          try {
            file.close();
          } catch {
            // 文件可能已经关闭，忽略错误
          }
        },
        async abort(error) {
          await writer.abort(error);
          try {
            file.close();
          } catch {
            // 文件可能已经关闭，忽略错误
          }
        },
      });
    } catch (error) {
      throw new Error(
        `创建文件写入流失败: ${path}, ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }
}

/**
 * 压缩选项
 */
export interface CompressionOptions {
  /** 压缩级别（1-9，默认：6，仅适用于 gzip） */
  level?: number;
}

/**
 * 文件压缩器类
 * 提供文件压缩和解压功能，支持 gzip/gunzip
 */
export class FileCompressor {
  /**
   * 使用 gzip 压缩文件
   * @param sourcePath 源文件路径
   * @param destPath 目标文件路径（压缩后的文件）
   * @param options 压缩选项
   */
  async gzip(
    sourcePath: string,
    destPath: string,
    options?: CompressionOptions,
  ): Promise<void> {
    try {
      const data = await readFile(sourcePath);
      const compressed = await this.compressGzip(data, options);
      await writeFile(destPath, compressed);
    } catch (error) {
      throw new Error(
        `gzip 压缩失败: ${sourcePath} -> ${destPath}, ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  /**
   * 使用 gunzip 解压文件
   * @param sourcePath 源文件路径（压缩文件）
   * @param destPath 目标文件路径（解压后的文件）
   */
  async gunzip(sourcePath: string, destPath: string): Promise<void> {
    try {
      const compressed = await readFile(sourcePath);
      const decompressed = await this.decompressGzip(compressed);
      await writeFile(destPath, decompressed);
    } catch (error) {
      throw new Error(
        `gunzip 解压失败: ${sourcePath} -> ${destPath}, ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  /**
   * 压缩数据（gzip）
   * @param data 要压缩的数据
   * @param options 压缩选项
   * @returns 压缩后的数据
   */
  private async compressGzip(
    data: Uint8Array,
    options?: CompressionOptions,
  ): Promise<Uint8Array> {
    // Deno 和 Bun 都使用 pako 库进行 gzip 压缩
    const { gzip } = await import("pako");
    return gzip(data, {
      level: options?.level ?? 6,
    });
  }

  /**
   * 解压数据（gunzip）
   * @param compressed 压缩的数据
   * @returns 解压后的数据
   */
  private async decompressGzip(
    compressed: Uint8Array,
  ): Promise<Uint8Array> {
    // Deno 和 Bun 都使用 pako 库进行 gunzip 解压
    const { ungzip } = await import("pako");
    return ungzip(compressed);
  }

  /**
   * 压缩数据（gzip，内存操作）
   * @param data 要压缩的数据
   * @param options 压缩选项
   * @returns 压缩后的数据
   */
  async compress(
    data: Uint8Array,
    options?: CompressionOptions,
  ): Promise<Uint8Array> {
    return await this.compressGzip(data, options);
  }

  /**
   * 解压数据（gunzip，内存操作）
   * @param compressed 压缩的数据
   * @returns 解压后的数据
   */
  async decompress(compressed: Uint8Array): Promise<Uint8Array> {
    return await this.decompressGzip(compressed);
  }
}
