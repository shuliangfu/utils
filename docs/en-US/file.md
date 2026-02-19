# File Utilities

> File utilities for read/write, watch, type detection, streaming, and
> compression. Server-only.

[![JSR](https://jsr.io/badges/@dreamer/utils)](https://jsr.io/@dreamer/utils)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)

---

## Overview

File utilities: read/write, copy/move/delete, watch, type detection, stream,
compress/decompress. Server-only.

---

## Features

- **Read/write**: `readText`, `writeText`, `readBinary`, `writeBinary`,
  `appendText`
- **Ops**: `copy`, `move`, `delete`, `exists`, `stat`
- **Watch**: `FileWatcher` — recursive, debounce
- **Type**: `FileTypeDetector` — MIME, extension, magic number
- **Stream**: `FileStream` — stream read/write for large files
- **Compress**: `FileCompressor` — gzip/gunzip, compress/decompress (Deno & Bun)

---

## Installation

```bash
deno add jsr:@dreamer/utils
```

---

## Environment compatibility

- **Runtime**: Deno 2.6+ or Bun 1.3.5+
- **Server**: ✅ Supported (file system permissions)
- **Client**: ❌ Not supported (use `jsr:@dreamer/utils/client/file` for
  browser)
- **Dependencies**: `@dreamer/runtime-adapter`; compression uses
  `npm:pako@2.1.0`

---

## Quick start

```typescript
import {
  FileCompressor,
  FileManager,
  FileStream,
  FileTypeDetector,
  FileWatcher,
} from "jsr:@dreamer/utils/file";

const fileManager = new FileManager();

// Text
const text = await fileManager.readText("./data.txt");
await fileManager.writeText("./output.txt", "Hello, World!");
await fileManager.appendText("./log.txt", "New log entry\n");

// Binary
const binary = await fileManager.readBinary("./image.png");
await fileManager.writeBinary("./output.png", binaryData);

// Ops
await fileManager.copy("./source.txt", "./dest.txt");
await fileManager.move("./old.txt", "./new.txt");
await fileManager.delete("./temp.txt");
const exists = await fileManager.exists("./file.txt");
const info = await fileManager.stat("./file.txt");
console.log("Size:", info.size);

// Watch
const watcher = new FileWatcher({
  path: "./config",
  recursive: true,
  debounce: 300,
});
watcher.on("change", (event) => {
  console.log("Change:", event.path, event.type);
});
await watcher.start();
// ...
await watcher.stop();

// Type detection
const detector = new FileTypeDetector();
const type = await detector.detect("./image.png");
console.log(type); // { mime: "image/png", ext: "png", signature: "PNG" }

// Stream (large files)
const stream = new FileStream();
const reader = await stream.createReader("./large-file.txt");
for await (const chunk of reader) {
  console.log("Chunk:", chunk.length, "bytes");
}

// Compress
const compressor = new FileCompressor();
await compressor.gzip("./data.txt", "./data.txt.gz");
await compressor.gunzip("./data.txt.gz", "./data.txt");
const data = new TextEncoder().encode("Hello, World!");
const compressed = await compressor.compress(data);
const decompressed = await compressor.decompress(compressed);
console.log(new TextDecoder().decode(decompressed)); // "Hello, World!"
```

---

## API Reference

### FileManager

File manager: read, write, copy, move, delete, exists, stat.

#### readText

Read text file.

```typescript
async readText(path: string, encoding?: string): Promise<string>
```

**Parameters**: `path`, `encoding?` (default `"utf-8"`). **Returns**: File
content.

**Example**: `const text = await fileManager.readText("./data.txt");`

#### readBinary

Read binary file.

```typescript
async readBinary(path: string): Promise<Uint8Array>
```

**Parameters**: `path`. **Returns**: `Uint8Array`.

**Example**: `const binary = await fileManager.readBinary("./image.png");`

#### writeText

Write text file.

```typescript
async writeText(path: string, content: string, encoding?: string): Promise<void>
```

**Parameters**: `path`, `content`, `encoding?` (default `"utf-8"`).

**Example**: `await fileManager.writeText("./output.txt", "Hello, World!");`

#### writeBinary

Write binary file.

```typescript
async writeBinary(path: string, data: Uint8Array): Promise<void>
```

**Parameters**: `path`, `data`.

**Example**: `await fileManager.writeBinary("./output.png", binaryData);`

#### appendText

Append to text file.

```typescript
async appendText(path: string, content: string, encoding?: string): Promise<void>
```

**Parameters**: `path`, `content`, `encoding?`.

**Example**: `await fileManager.appendText("./log.txt", "New log entry\n");`

#### copy

Copy file.

```typescript
async copy(source: string, dest: string): Promise<void>
```

**Example**: `await fileManager.copy("./source.txt", "./dest.txt");`

#### move

Move (rename) file.

```typescript
async move(source: string, dest: string): Promise<void>
```

**Example**: `await fileManager.move("./old.txt", "./new.txt");`

#### delete

Delete file.

```typescript
async delete(path: string): Promise<void>
```

**Example**: `await fileManager.delete("./temp.txt");`

#### exists

Check if file exists.

```typescript
async exists(path: string): Promise<boolean>
```

**Example**: `const exists = await fileManager.exists("./file.txt");`

#### stat

Get file info.

```typescript
async stat(path: string): Promise<FileInfo>
```

**Returns**: `FileInfo` (includes `size`). **Example**:
`const info = await fileManager.stat("./file.txt");`

---

### FileWatcher

Watch file/directory changes.

**Constructor**: `new FileWatcher(options: FileWatcherOptions)`

**FileWatcherOptions**: `path: string`, `recursive?: boolean` (default false),
`debounce?: number` (default 300 ms)

#### on

Listen to change events.

```typescript
on(event: "change", handler: (event: FileChangeEvent) => void): void
```

**FileChangeEvent**: `path: string`, `type: "create" | "modify" | "delete"`,
`timestamp: number`

**Example**:
`watcher.on("change", (event) => console.log(event.path, event.type));`

#### start / stop

```typescript
async start(): Promise<void>
async stop(): Promise<void>
```

---

### FileTypeDetector

Detect MIME, extension, and signature.

#### detect

```typescript
async detect(path: string): Promise<FileTypeInfo>
```

**Returns**: `FileTypeInfo` — `mime`, `ext`, `signature?`

**Example**: `const type = await detector.detect("./image.png");` →
`{ mime: "image/png", ext: "png", signature: "PNG" }`

---

### FileStream

Stream read/write for large files.

#### createReader

Create readable stream.

```typescript
async createReader(path: string, chunkSize?: number): Promise<ReadableStream<Uint8Array>>
```

**Parameters**: `path`, `chunkSize?` (default 64KB).

**Example**:
`const reader = await stream.createReader("./large-file.txt"); for await (const chunk of reader) { ... }`

#### createWriter

Create writable stream.

```typescript
async createWriter(path: string): Promise<WritableStream<Uint8Array>>
```

**Example**:
`const writer = await stream.createWriter("./output.txt"); await writer.write(...); await writer.close();`

---

### FileCompressor

Compress/decompress (gzip and in-memory).

#### gzip

Compress file to gzip.

```typescript
async gzip(source: string, dest: string, level?: number): Promise<void>
```

**Parameters**: `source`, `dest`, `level?` (1–9, default 6). **Example**:
`await compressor.gzip("./data.txt", "./data.txt.gz");`

#### gunzip

Decompress gzip file.

```typescript
async gunzip(source: string, dest: string): Promise<void>
```

**Example**: `await compressor.gunzip("./data.txt.gz", "./data.txt");`

#### compress

Compress in memory.

```typescript
async compress(data: Uint8Array, level?: number): Promise<Uint8Array>
```

**Parameters**: `data`, `level?` (1–9, default 6). **Returns**: Compressed
bytes.

**Example**: `const compressed = await compressor.compress(data);`

#### decompress

Decompress in memory.

```typescript
async decompress(data: Uint8Array): Promise<Uint8Array>
```

**Returns**: Decompressed bytes. **Example**:
`const decompressed = await compressor.decompress(compressed);`

---

## Use cases

- **Read/write**: Config files, logs
- **Management**: Copy, move, delete
- **Watch**: Config reload on change
- **Type detection**: Validate uploads
- **Large files**: Stream to avoid OOM
- **Compression**: Logs, backups

---

## Performance

- **Streaming**: Use streams for large files
- **Debounce**: Watch uses debounce to reduce events
- **Compression**: Configurable level for speed vs ratio

---

## Notes

- **Server only**: For browser use `jsr:@dreamer/utils/client/file`
- **Permissions**: Requires file system access
- **Compression**: Uses `npm:pako@2.1.0` (Deno & Bun)
- **Type-safe**: Full TypeScript support

---

## See also

- [Client module](client/file.md)
- [JSR package](https://jsr.io/@dreamer/utils)

---

## Contributing

Issues and Pull Requests are welcome.

---

## License

Apache License 2.0 — see [LICENSE](../../LICENSE)

---

<div align="center">

**Made with ❤️ by Dreamer Team**

</div>
