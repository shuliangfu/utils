# Client File Utilities

> Client-side file handling utilities module, providing a unified interface for
> browser file operations

[![JSR](https://jsr.io/badges/@dreamer/utils)](https://jsr.io/@dreamer/utils)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)

---

## 🎯 Overview

Client-side file handling utilities for file operations in the browser
environment. Client-only support.

---

## ✨ Features

- **File reading**:
  - Text file reading (`FileReader.readAsText`)
  - Binary file reading (`FileReader.readAsArrayBuffer`, `readAsUint8Array`)
  - Data URL reading (`FileReader.readAsDataURL`)
- **File writing**:
  - Download text files (`FileWriter.downloadText`)
  - Download binary files (`FileWriter.downloadBinary`)
  - Download Blob (`FileWriter.downloadBlob`)
- **File type detection**:
  - MIME type detection (`FileTypeDetector`)
  - File extension detection
  - File signature detection (Magic Number)
- **File stream processing**:
  - Stream reading for large files (`FileStream`)
  - Customizable chunk size
- **File watching**:
  - File input listening (`FileWatcher.watchInput`)
  - Drag-and-drop file listening (`FileWatcher.watchDrop`)
- **File preview**:
  - Image preview (`FilePreview.image`)
  - Text preview (`FilePreview.text`)
  - PDF preview (`FilePreview.pdf`)

---

## 📦 Installation

```bash
deno add jsr:@dreamer/utils
```

---

## 🌍 Environment Compatibility

- **Runtime requirements**: Deno 2.6+ or Bun 1.3.5
- **Server**: ❌ Not supported (use `jsr:@dreamer/utils/file`)
- **Client**: ✅ Supported (browser environment)
- **Dependencies**: No external dependencies (based on browser standard APIs)

---

## 🚀 Quick Start

```typescript
import {
  FilePreview,
  FileReader,
  FileStream,
  FileTypeDetector,
  FileWatcher,
  FileWriter,
} from "jsr:@dreamer/utils/client/file";

// File reading
const fileReader = new FileReader();
const text = await fileReader.readAsText(file);
const arrayBuffer = await fileReader.readAsArrayBuffer(file);
const dataURL = await fileReader.readAsDataURL(file);
const uint8Array = await fileReader.readAsUint8Array(file);

// File download
const fileWriter = new FileWriter();
await fileWriter.downloadText("data.txt", "Hello, World!");
await fileWriter.downloadBinary("data.bin", binaryData);

// File type detection
const detector = new FileTypeDetector();
const type = await detector.detect(file);
console.log(type); // { mime: "image/png", ext: "png", signature: "PNG" }

// Stream reading for large files
const stream = new FileStream();
const reader = stream.createReader(file, 64 * 1024); // 64KB chunk size
for await (const chunk of reader) {
  // Process each chunk
  console.log("Read chunk:", chunk.length, "bytes");
}

// File watching
const watcher = new FileWatcher();
const input = document.querySelector('input[type="file"]');
watcher.watchInput(input, { multiple: true });

watcher.on("select", (files) => {
  console.log("Selected files:", files);
});

// Drag-and-drop files
const dropZone = document.querySelector("#drop-zone");
watcher.watchDrop(dropZone);

watcher.on("drop", (files) => {
  console.log("Dropped files:", files);
});

// File preview
const preview = new FilePreview();
const imageURL = await preview.image(imageFile);
const textContent = await preview.text(textFile);
const pdfURL = await preview.pdf(pdfFile);
```

---

## 📚 API Reference

### FileReader

File reader class that wraps the FileReader API and provides file reading
capabilities.

#### readAsText

Read a text file.

```typescript
readAsText(file: File, encoding?: string): Promise<string>
```

**Parameters**:

- `file: File` - File object
- `encoding: string` - Encoding (default "utf-8")

**Returns**: File content as string

**Example**:

```typescript
const text = await fileReader.readAsText(file);
```

#### readAsArrayBuffer

Read a binary file as ArrayBuffer.

```typescript
readAsArrayBuffer(file: File): Promise<ArrayBuffer>
```

**Parameters**:

- `file: File` - File object

**Returns**: ArrayBuffer

**Example**:

```typescript
const arrayBuffer = await fileReader.readAsArrayBuffer(file);
```

#### readAsDataURL

Read as data URL (Base64).

```typescript
readAsDataURL(file: File): Promise<string>
```

**Parameters**:

- `file: File` - File object

**Returns**: Data URL string

**Example**:

```typescript
const dataURL = await fileReader.readAsDataURL(file);
```

#### readAsUint8Array

Read a binary file as Uint8Array.

```typescript
readAsUint8Array(file: File): Promise<Uint8Array>
```

**Parameters**:

- `file: File` - File object

**Returns**: Uint8Array

**Example**:

```typescript
const uint8Array = await fileReader.readAsUint8Array(file);
```

---

### FileWriter

File writer class that provides file download capabilities.

#### downloadText

Download a text file.

```typescript
async downloadText(
  filename: string,
  content: string,
  mimeType?: string,
): Promise<void>
```

**Parameters**:

- `filename: string` - File name
- `content: string` - File content
- `mimeType: string` - MIME type (default "text/plain")

**Example**:

```typescript
await fileWriter.downloadText("data.txt", "Hello, World!");
```

#### downloadBinary

Download a binary file.

```typescript
async downloadBinary(
  filename: string,
  data: ArrayBuffer | Uint8Array,
  mimeType?: string,
): Promise<void>
```

**Parameters**:

- `filename: string` - File name
- `data: ArrayBuffer | Uint8Array` - File data
- `mimeType: string` - MIME type (default "application/octet-stream")

**Example**:

```typescript
await fileWriter.downloadBinary("data.bin", binaryData);
```

#### downloadBlob

Download a Blob.

```typescript
downloadBlob(filename: string, blob: Blob): Promise<void>
```

**Parameters**:

- `filename: string` - File name
- `blob: Blob` - Blob object

**Example**:

```typescript
const blob = new Blob([data], { type: "application/json" });
await fileWriter.downloadBlob("data.json", blob);
```

---

### FileTypeDetector

File type detector class that detects MIME type, extension, and file signature.

#### detect

Detect file type.

```typescript
async detect(file: File): Promise<FileTypeInfo>
```

**Parameters**:

- `file: File` - File object

**Returns**: File type information (FileTypeInfo)

**FileTypeInfo**:

```typescript
interface FileTypeInfo {
  mime: string; // MIME type
  ext: string; // File extension
  signature?: string; // File signature (Magic Number)
}
```

**Example**:

```typescript
const type = await detector.detect(file);
console.log(type); // { mime: "image/png", ext: "png", signature: "PNG" }
```

#### getMimeType

Get MIME type from file extension.

```typescript
getMimeType(filename: string): string
```

**Parameters**:

- `filename: string` - File name or path

**Returns**: MIME type

**Example**:

```typescript
const mime = detector.getMimeType("image.png"); // "image/png"
```

#### getExtension

Get file extension.

```typescript
getExtension(filename: string): string
```

**Parameters**:

- `filename: string` - File name or path

**Returns**: File extension (without the dot)

**Example**:

```typescript
const ext = detector.getExtension("image.png"); // "png"
```

---

### FileStream

File stream processor class that provides stream reading for large files.

#### createReader

Create a file read stream.

```typescript
createReader(file: File, chunkSize?: number): ReadableStream<Uint8Array>
```

**Parameters**:

- `file: File` - File object
- `chunkSize: number` - Chunk size in bytes per read (default 64KB)

**Returns**: Readable stream

**Example**:

```typescript
const reader = stream.createReader(file, 64 * 1024);
for await (const chunk of reader) {
  console.log("Read chunk:", chunk.length, "bytes");
}
```

---

### FileWatcher

File watcher class that listens for file selection and drag-and-drop events.

#### watchInput

Listen for file selection.

```typescript
watchInput(
  inputElement: HTMLInputElement | null,
  options?: FileWatcherOptions,
): void
```

**Parameters**:

- `inputElement: HTMLInputElement | null` - input[type="file"] element
- `options: FileWatcherOptions` - Options

**FileWatcherOptions**:

- `multiple?: boolean` - Allow multiple selection (default false)
- `accept?: string` - File type restriction (accept attribute)

**Example**:

```typescript
const input = document.querySelector('input[type="file"]');
watcher.watchInput(input, { multiple: true });
```

#### watchDrop

Listen for drag-and-drop files.

```typescript
watchDrop(element: Element | null): void
```

**Parameters**:

- `element: Element | null` - Drop zone element

**Example**:

```typescript
const dropZone = document.querySelector("#drop-zone");
watcher.watchDrop(dropZone);
```

#### on

Subscribe to events.

```typescript
on(event: "select", listener: (files: File[]) => void): void;
on(event: "drop", listener: (files: File[]) => void): void;
on(event: "error", listener: (error: Error) => void): void;
```

**Event types**:

- `select` - File selection event
- `drop` - File drop event
- `error` - Error event

**Example**:

```typescript
watcher.on("select", (files) => {
  console.log("Selected files:", files);
});

watcher.on("drop", (files) => {
  console.log("Dropped files:", files);
});
```

#### off

Remove event listener.

```typescript
off(event: "select", listener: (files: File[]) => void): void;
off(event: "drop", listener: (files: File[]) => void): void;
off(event: "error", listener: (error: Error) => void): void;
```

**Example**:

```typescript
const handler = (files: File[]) => {
  console.log("Selected files:", files);
};

watcher.on("select", handler);
watcher.off("select", handler);
```

---

### FilePreview

File preview class that provides file preview capabilities.

#### image

Preview an image.

```typescript
async image(file: File): Promise<string>
```

**Parameters**:

- `file: File` - File object (must be an image type)

**Returns**: Data URL

**Example**:

```typescript
const imageURL = await preview.image(imageFile);
const img = document.createElement("img");
img.src = imageURL;
```

#### text

Preview text.

```typescript
async text(file: File): Promise<string>
```

**Parameters**:

- `file: File` - File object

**Returns**: Text content

**Example**:

```typescript
const textContent = await preview.text(textFile);
console.log(textContent);
```

#### pdf

Preview PDF (returns Object URL).

```typescript
pdf(file: File): Promise<string>
```

**Parameters**:

- `file: File` - File object (must be a PDF type)

**Returns**: Object URL

**Example**:

```typescript
const pdfURL = await preview.pdf(pdfFile);
const iframe = document.createElement("iframe");
iframe.src = pdfURL;
```

---

## 🎯 Use Cases

- **File upload**: Read user-selected files
- **File download**: Download generated files
- **File preview**: Preview images, text, and PDFs
- **File type validation**: Validate uploaded file types
- **Large file handling**: Stream large files to avoid memory overflow
- **Drag-and-drop upload**: Support drag-and-drop file upload

---

## ⚡ Performance

- **Streaming**: Use streaming for large files to avoid loading everything into
  memory
- **Chunked reading**: Customizable chunk size for better memory usage

---

## 📝 Notes

- **Client only**: This module is client-only; use `jsr:@dreamer/utils/file` on
  the server
- **Browser APIs**: Based on browser standard APIs (FileReader, Blob,
  URL.createObjectURL)
- **Type safety**: Full TypeScript type support

---

## 🔗 Related Links

- [Server-side version](../file.md)
- [JSR package page](https://jsr.io/@dreamer/utils)

---

## 🤝 Contributing

Issues and Pull Requests are welcome!

---

## 📄 License

Apache License 2.0 - see [LICENSE](../../../LICENSE)

---

<div align="center">

**Made with ❤️ by Dreamer Team**

</div>
