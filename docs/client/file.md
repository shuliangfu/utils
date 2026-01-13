# Client File 文件操作

> 客户端文件处理工具模块，提供浏览器文件操作的统一接口

[![JSR](https://jsr.io/badges/@dreamer/utils)](https://jsr.io/@dreamer/utils)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🎯 功能

客户端文件处理工具，提供浏览器环境下的文件操作功能，仅支持客户端。

---

## ✨ 特性

- **文件读取**：
  - 文本文件读取（`FileReader.readAsText`）
  - 二进制文件读取（`FileReader.readAsArrayBuffer`、`readAsUint8Array`）
  - 数据 URL 读取（`FileReader.readAsDataURL`）
- **文件写入**：
  - 下载文本文件（`FileWriter.downloadText`）
  - 下载二进制文件（`FileWriter.downloadBinary`）
  - 下载 Blob（`FileWriter.downloadBlob`）
- **文件类型检测**：
  - MIME 类型检测（`FileTypeDetector`）
  - 文件扩展名检测
  - 文件签名检测（Magic Number）
- **文件流处理**：
  - 流式读取大文件（`FileStream`）
  - 支持自定义块大小
- **文件监控**：
  - 文件选择监听（`FileWatcher.watchInput`）
  - 拖拽文件监听（`FileWatcher.watchDrop`）
- **文件预览**：
  - 预览图片（`FilePreview.image`）
  - 预览文本（`FilePreview.text`）
  - 预览 PDF（`FilePreview.pdf`）

---

## 📦 安装

```bash
deno add jsr:@dreamer/utils
```

---

## 🌍 环境兼容性

- **运行时要求**：Deno 2.5+ 或 Bun 1.0+
- **服务端**：❌ 不支持（使用 `jsr:@dreamer/utils/file`）
- **客户端**：✅ 支持（浏览器环境）
- **依赖**：无外部依赖（基于浏览器标准 API）

---

## 🚀 快速开始

```typescript
import {
  FileReader,
  FileWriter,
  FileTypeDetector,
  FileStream,
  FileWatcher,
  FilePreview,
} from "jsr:@dreamer/utils/client/file";

// 文件读取
const fileReader = new FileReader();
const text = await fileReader.readAsText(file);
const arrayBuffer = await fileReader.readAsArrayBuffer(file);
const dataURL = await fileReader.readAsDataURL(file);
const uint8Array = await fileReader.readAsUint8Array(file);

// 文件下载
const fileWriter = new FileWriter();
await fileWriter.downloadText("data.txt", "Hello, World!");
await fileWriter.downloadBinary("data.bin", binaryData);

// 文件类型检测
const detector = new FileTypeDetector();
const type = await detector.detect(file);
console.log(type); // { mime: "image/png", ext: "png", signature: "PNG" }

// 流式读取大文件
const stream = new FileStream();
const reader = stream.createReader(file, 64 * 1024); // 64KB 块大小
for await (const chunk of reader) {
  // 处理每个块
  console.log("读取块:", chunk.length, "bytes");
}

// 文件监控
const watcher = new FileWatcher();
const input = document.querySelector('input[type="file"]');
watcher.watchInput(input, { multiple: true });

watcher.on("select", (files) => {
  console.log("选择了文件:", files);
});

// 拖拽文件
const dropZone = document.querySelector("#drop-zone");
watcher.watchDrop(dropZone);

watcher.on("drop", (files) => {
  console.log("拖拽了文件:", files);
});

// 文件预览
const preview = new FilePreview();
const imageURL = await preview.image(imageFile);
const textContent = await preview.text(textFile);
const pdfURL = await preview.pdf(pdfFile);
```

---

## 📚 API 文档

### FileReader

文件读取器类，封装 FileReader API，提供文件读取功能。

#### readAsText

读取文本文件。

```typescript
readAsText(file: File, encoding?: string): Promise<string>
```

**参数**：
- `file: File` - File 对象
- `encoding: string` - 编码格式（默认 "utf-8"）

**返回**：文件内容

**示例**：
```typescript
const text = await fileReader.readAsText(file);
```

#### readAsArrayBuffer

读取二进制文件（ArrayBuffer）。

```typescript
readAsArrayBuffer(file: File): Promise<ArrayBuffer>
```

**参数**：
- `file: File` - File 对象

**返回**：ArrayBuffer

**示例**：
```typescript
const arrayBuffer = await fileReader.readAsArrayBuffer(file);
```

#### readAsDataURL

读取数据 URL（Base64）。

```typescript
readAsDataURL(file: File): Promise<string>
```

**参数**：
- `file: File` - File 对象

**返回**：数据 URL 字符串

**示例**：
```typescript
const dataURL = await fileReader.readAsDataURL(file);
```

#### readAsUint8Array

读取二进制文件（Uint8Array）。

```typescript
readAsUint8Array(file: File): Promise<Uint8Array>
```

**参数**：
- `file: File` - File 对象

**返回**：Uint8Array

**示例**：
```typescript
const uint8Array = await fileReader.readAsUint8Array(file);
```

---

### FileWriter

文件写入器类，提供文件下载功能。

#### downloadText

下载文本文件。

```typescript
async downloadText(
  filename: string,
  content: string,
  mimeType?: string,
): Promise<void>
```

**参数**：
- `filename: string` - 文件名
- `content: string` - 文件内容
- `mimeType: string` - MIME 类型（默认 "text/plain"）

**示例**：
```typescript
await fileWriter.downloadText("data.txt", "Hello, World!");
```

#### downloadBinary

下载二进制文件。

```typescript
async downloadBinary(
  filename: string,
  data: ArrayBuffer | Uint8Array,
  mimeType?: string,
): Promise<void>
```

**参数**：
- `filename: string` - 文件名
- `data: ArrayBuffer | Uint8Array` - 文件数据
- `mimeType: string` - MIME 类型（默认 "application/octet-stream"）

**示例**：
```typescript
await fileWriter.downloadBinary("data.bin", binaryData);
```

#### downloadBlob

下载 Blob。

```typescript
downloadBlob(filename: string, blob: Blob): Promise<void>
```

**参数**：
- `filename: string` - 文件名
- `blob: Blob` - Blob 对象

**示例**：
```typescript
const blob = new Blob([data], { type: "application/json" });
await fileWriter.downloadBlob("data.json", blob);
```

---

### FileTypeDetector

文件类型检测器类，检测文件的 MIME 类型、扩展名和文件签名。

#### detect

检测文件类型。

```typescript
async detect(file: File): Promise<FileTypeInfo>
```

**参数**：
- `file: File` - File 对象

**返回**：文件类型信息（FileTypeInfo）

**FileTypeInfo**：
```typescript
interface FileTypeInfo {
  mime: string;      // MIME 类型
  ext: string;       // 文件扩展名
  signature?: string; // 文件签名（Magic Number）
}
```

**示例**：
```typescript
const type = await detector.detect(file);
console.log(type); // { mime: "image/png", ext: "png", signature: "PNG" }
```

#### getMimeType

根据文件扩展名获取 MIME 类型。

```typescript
getMimeType(filename: string): string
```

**参数**：
- `filename: string` - 文件名或路径

**返回**：MIME 类型

**示例**：
```typescript
const mime = detector.getMimeType("image.png"); // "image/png"
```

#### getExtension

获取文件扩展名。

```typescript
getExtension(filename: string): string
```

**参数**：
- `filename: string` - 文件名或路径

**返回**：文件扩展名（不含点号）

**示例**：
```typescript
const ext = detector.getExtension("image.png"); // "png"
```

---

### FileStream

文件流处理器类，提供大文件的流式读取功能。

#### createReader

创建文件读取流。

```typescript
createReader(file: File, chunkSize?: number): ReadableStream<Uint8Array>
```

**参数**：
- `file: File` - File 对象
- `chunkSize: number` - 每次读取的块大小（字节，默认 64KB）

**返回**：可读流

**示例**：
```typescript
const reader = stream.createReader(file, 64 * 1024);
for await (const chunk of reader) {
  console.log("读取块:", chunk.length, "bytes");
}
```

---

### FileWatcher

文件监控器类，监听文件选择和拖拽事件。

#### watchInput

监听文件选择。

```typescript
watchInput(
  inputElement: HTMLInputElement | null,
  options?: FileWatcherOptions,
): void
```

**参数**：
- `inputElement: HTMLInputElement | null` - input[type="file"] 元素
- `options: FileWatcherOptions` - 选项

**FileWatcherOptions**：
- `multiple?: boolean` - 是否支持多选（默认 false）
- `accept?: string` - 文件类型限制（accept 属性）

**示例**：
```typescript
const input = document.querySelector('input[type="file"]');
watcher.watchInput(input, { multiple: true });
```

#### watchDrop

监听拖拽文件。

```typescript
watchDrop(element: Element | null): void
```

**参数**：
- `element: Element | null` - 拖拽区域元素

**示例**：
```typescript
const dropZone = document.querySelector("#drop-zone");
watcher.watchDrop(dropZone);
```

#### on

监听事件。

```typescript
on(event: "select", listener: (files: File[]) => void): void;
on(event: "drop", listener: (files: File[]) => void): void;
on(event: "error", listener: (error: Error) => void): void;
```

**事件类型**：
- `select` - 文件选择事件
- `drop` - 文件拖拽事件
- `error` - 错误事件

**示例**：
```typescript
watcher.on("select", (files) => {
  console.log("选择了文件:", files);
});

watcher.on("drop", (files) => {
  console.log("拖拽了文件:", files);
});
```

#### off

移除事件监听器。

```typescript
off(event: "select", listener: (files: File[]) => void): void;
off(event: "drop", listener: (files: File[]) => void): void;
off(event: "error", listener: (error: Error) => void): void;
```

**示例**：
```typescript
const handler = (files: File[]) => {
  console.log("选择了文件:", files);
};

watcher.on("select", handler);
watcher.off("select", handler);
```

---

### FilePreview

文件预览器类，提供文件预览功能。

#### image

预览图片。

```typescript
async image(file: File): Promise<string>
```

**参数**：
- `file: File` - File 对象（必须是图片类型）

**返回**：数据 URL

**示例**：
```typescript
const imageURL = await preview.image(imageFile);
const img = document.createElement("img");
img.src = imageURL;
```

#### text

预览文本。

```typescript
async text(file: File): Promise<string>
```

**参数**：
- `file: File` - File 对象

**返回**：文本内容

**示例**：
```typescript
const textContent = await preview.text(textFile);
console.log(textContent);
```

#### pdf

预览 PDF（返回 Object URL）。

```typescript
pdf(file: File): Promise<string>
```

**参数**：
- `file: File` - File 对象（必须是 PDF 类型）

**返回**：Object URL

**示例**：
```typescript
const pdfURL = await preview.pdf(pdfFile);
const iframe = document.createElement("iframe");
iframe.src = pdfURL;
```

---

## 🎯 使用场景

- **文件上传**：读取用户选择的文件
- **文件下载**：下载生成的文件
- **文件预览**：预览图片、文本、PDF
- **文件类型验证**：验证上传文件类型
- **大文件处理**：流式处理大文件，避免内存溢出
- **拖拽上传**：支持拖拽文件上传

---

## ⚡ 性能优化

- **流式处理**：大文件使用流式处理，避免一次性加载到内存
- **分块读取**：支持自定义块大小，优化内存使用

---

## 📝 备注

- **仅客户端**：此模块仅支持客户端，服务端请使用 `jsr:@dreamer/utils/file`
- **浏览器 API**：基于浏览器标准 API（FileReader、Blob、URL.createObjectURL）
- **类型安全**：完整的 TypeScript 类型支持

---

## 🔗 相关链接

- [服务端版本](../file.md)
- [JSR 包页面](https://jsr.io/@dreamer/utils)

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可证

MIT License - 详见 [LICENSE.md](../../../LICENSE.md)

---

<div align="center">

**Made with ❤️ by Dreamer Team**

</div>
