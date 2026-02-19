# File 文件操作

> 文件处理工具模块，提供统一的文件操作接口，支持服务端文件系统操作

[![JSR](https://jsr.io/badges/@dreamer/utils)](https://jsr.io/@dreamer/utils)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)

---

## 🎯 功能

文件处理工具，提供文件读写、监控、类型检测、流处理、压缩/解压等功能，仅支持服务端。

---

## ✨ 特性

- **文件读写**：
  - 文本文件读写（`readText`、`writeText`）
  - 二进制文件读写（`readBinary`、`writeBinary`）
  - 追加写入（`appendText`）
- **文件管理**：
  - 复制文件（`copy`）
  - 移动文件（`move`）
  - 删除文件（`delete`）
  - 检查文件是否存在（`exists`）
  - 获取文件信息（`stat`）
- **文件监控**：
  - 文件/目录变化监听（`FileWatcher`）
  - 支持递归监控
  - 防抖处理
- **文件类型检测**：
  - MIME 类型检测（`FileTypeDetector`）
  - 文件扩展名检测
  - 文件签名检测（Magic Number）
- **文件流处理**：
  - 流式读取大文件（`FileStream`）
  - 流式写入大文件
  - 分块处理，内存优化
- **文件压缩/解压**：
  - gzip 压缩（`gzip`）
  - gunzip 解压（`gunzip`）
  - 内存压缩/解压（`compress`/`decompress`）
  - Deno 和 Bun 都支持

---

## 📦 安装

```bash
deno add jsr:@dreamer/utils
```

---

## 🌍 环境兼容性

- **运行时要求**：Deno 2.6+ 或 Bun 1.3.5
- **服务端**：✅ 支持（需要文件系统权限）
- **客户端**：❌ 不支持（使用 `jsr:@dreamer/utils/client/file`）
- **依赖**：
  - 核心功能：依赖 `@dreamer/runtime-adapter`
  - 压缩功能：使用 `npm:pako@2.1.0`（Deno 和 Bun 都支持）

---

## 🚀 快速开始

```typescript
import {
  FileCompressor,
  FileManager,
  FileStream,
  FileTypeDetector,
  FileWatcher,
} from "jsr:@dreamer/utils/file";

// 文件读写
const fileManager = new FileManager();

// 读取文本文件
const text = await fileManager.readText("./data.txt");

// 写入文本文件
await fileManager.writeText("./output.txt", "Hello, World!");

// 读取二进制文件
const binary = await fileManager.readBinary("./image.png");

// 写入二进制文件
await fileManager.writeBinary("./output.png", binaryData);

// 追加写入
await fileManager.appendText("./log.txt", "New log entry\n");

// 复制文件
await fileManager.copy("./source.txt", "./dest.txt");

// 移动文件
await fileManager.move("./old.txt", "./new.txt");

// 删除文件
await fileManager.delete("./temp.txt");

// 检查文件是否存在
const exists = await fileManager.exists("./file.txt");

// 获取文件信息
const info = await fileManager.stat("./file.txt");
console.log(`文件大小: ${info.size} bytes`);

// 文件监控
const watcher = new FileWatcher({
  path: "./config",
  recursive: true, // 递归监控
  debounce: 300, // 防抖 300ms
});

watcher.on("change", (event) => {
  console.log("文件变化:", event.path, event.type);
});

await watcher.start();
// ... 使用后停止监控
await watcher.stop();

// 文件类型检测
const detector = new FileTypeDetector();
const type = await detector.detect("./image.png");
console.log(type); // { mime: "image/png", ext: "png", signature: "PNG" }

// 流式处理大文件
const stream = new FileStream();
const reader = await stream.createReader("./large-file.txt");
for await (const chunk of reader) {
  // 处理每个块
  console.log("读取块:", chunk.length, "bytes");
}

// 文件压缩/解压
const compressor = new FileCompressor();

// gzip 压缩文件
await compressor.gzip("./data.txt", "./data.txt.gz");

// gunzip 解压文件
await compressor.gunzip("./data.txt.gz", "./data.txt");

// 内存压缩/解压
const data = new TextEncoder().encode("Hello, World!");
const compressed = await compressor.compress(data);
const decompressed = await compressor.decompress(compressed);
console.log(new TextDecoder().decode(decompressed)); // "Hello, World!"
```

---

## 📚 API 文档

### FileManager

文件管理器类，提供文件读写、复制、移动、删除等操作。

#### readText

读取文本文件。

```typescript
async readText(path: string, encoding?: string): Promise<string>
```

**参数**：

- `path: string` - 文件路径
- `encoding: string` - 编码格式（默认 "utf-8"）

**返回**：文件内容

**示例**：

```typescript
const text = await fileManager.readText("./data.txt");
```

#### readBinary

读取二进制文件。

```typescript
async readBinary(path: string): Promise<Uint8Array>
```

**参数**：

- `path: string` - 文件路径

**返回**：文件内容（Uint8Array）

**示例**：

```typescript
const binary = await fileManager.readBinary("./image.png");
```

#### writeText

写入文本文件。

```typescript
async writeText(path: string, content: string, encoding?: string): Promise<void>
```

**参数**：

- `path: string` - 文件路径
- `content: string` - 文件内容
- `encoding: string` - 编码格式（默认 "utf-8"）

**示例**：

```typescript
await fileManager.writeText("./output.txt", "Hello, World!");
```

#### writeBinary

写入二进制文件。

```typescript
async writeBinary(path: string, data: Uint8Array): Promise<void>
```

**参数**：

- `path: string` - 文件路径
- `data: Uint8Array` - 文件内容

**示例**：

```typescript
await fileManager.writeBinary("./output.png", binaryData);
```

#### appendText

追加写入文本文件。

```typescript
async appendText(path: string, content: string, encoding?: string): Promise<void>
```

**参数**：

- `path: string` - 文件路径
- `content: string` - 要追加的内容
- `encoding: string` - 编码格式（默认 "utf-8"）

**示例**：

```typescript
await fileManager.appendText("./log.txt", "New log entry\n");
```

#### copy

复制文件。

```typescript
async copy(source: string, dest: string): Promise<void>
```

**参数**：

- `source: string` - 源文件路径
- `dest: string` - 目标文件路径

**示例**：

```typescript
await fileManager.copy("./source.txt", "./dest.txt");
```

#### move

移动文件（重命名）。

```typescript
async move(source: string, dest: string): Promise<void>
```

**参数**：

- `source: string` - 源文件路径
- `dest: string` - 目标文件路径

**示例**：

```typescript
await fileManager.move("./old.txt", "./new.txt");
```

#### delete

删除文件。

```typescript
async delete(path: string): Promise<void>
```

**参数**：

- `path: string` - 文件路径

**示例**：

```typescript
await fileManager.delete("./temp.txt");
```

#### exists

检查文件是否存在。

```typescript
async exists(path: string): Promise<boolean>
```

**参数**：

- `path: string` - 文件路径

**返回**：是否存在

**示例**：

```typescript
const exists = await fileManager.exists("./file.txt");
```

#### stat

获取文件信息。

```typescript
async stat(path: string): Promise<FileInfo>
```

**参数**：

- `path: string` - 文件路径

**返回**：文件信息（FileInfo）

**示例**：

```typescript
const info = await fileManager.stat("./file.txt");
console.log(`文件大小: ${info.size} bytes`);
```

---

### FileWatcher

文件监控类，监控文件/目录变化。

#### 构造函数

```typescript
new FileWatcher(options: FileWatcherOptions)
```

**FileWatcherOptions**：

- `path: string` - 要监控的路径
- `recursive?: boolean` - 是否递归监控（默认 false）
- `debounce?: number` - 防抖时间（毫秒，默认 300）

#### on

监听文件变化事件。

```typescript
on(event: "change", handler: (event: FileChangeEvent) => void): void
```

**事件类型**：

- `change` - 文件变化事件

**FileChangeEvent**：

- `path: string` - 文件路径
- `type: "create" | "modify" | "delete"` - 变化类型
- `timestamp: number` - 时间戳

**示例**：

```typescript
watcher.on("change", (event) => {
  console.log("文件变化:", event.path, event.type);
});
```

#### start

开始监控。

```typescript
async start(): Promise<void>
```

#### stop

停止监控。

```typescript
async stop(): Promise<void>
```

---

### FileTypeDetector

文件类型检测类，检测文件的 MIME 类型、扩展名和签名。

#### detect

检测文件类型。

```typescript
async detect(path: string): Promise<FileTypeInfo>
```

**参数**：

- `path: string` - 文件路径

**返回**：文件类型信息（FileTypeInfo）

**FileTypeInfo**：

- `mime: string` - MIME 类型
- `ext: string` - 文件扩展名
- `signature?: string` - 文件签名（Magic Number）

**示例**：

```typescript
const type = await detector.detect("./image.png");
// { mime: "image/png", ext: "png", signature: "PNG" }
```

---

### FileStream

文件流处理类，用于流式读取和写入大文件。

#### createReader

创建文件读取流。

```typescript
async createReader(path: string, chunkSize?: number): Promise<ReadableStream<Uint8Array>>
```

**参数**：

- `path: string` - 文件路径
- `chunkSize?: number` - 块大小（字节，默认 64KB）

**返回**：可读流

**示例**：

```typescript
const reader = await stream.createReader("./large-file.txt");
for await (const chunk of reader) {
  console.log("读取块:", chunk.length, "bytes");
}
```

#### createWriter

创建文件写入流。

```typescript
async createWriter(path: string): Promise<WritableStream<Uint8Array>>
```

**参数**：

- `path: string` - 文件路径

**返回**：可写流

**示例**：

```typescript
const writer = await stream.createWriter("./output.txt");
await writer.write(new TextEncoder().encode("Hello"));
await writer.close();
```

---

### FileCompressor

文件压缩/解压类，支持 gzip 压缩和解压。

#### gzip

压缩文件。

```typescript
async gzip(source: string, dest: string, level?: number): Promise<void>
```

**参数**：

- `source: string` - 源文件路径
- `dest: string` - 目标文件路径
- `level?: number` - 压缩级别（1-9，默认 6）

**示例**：

```typescript
await compressor.gzip("./data.txt", "./data.txt.gz");
```

#### gunzip

解压文件。

```typescript
async gunzip(source: string, dest: string): Promise<void>
```

**参数**：

- `source: string` - 压缩文件路径
- `dest: string` - 目标文件路径

**示例**：

```typescript
await compressor.gunzip("./data.txt.gz", "./data.txt");
```

#### compress

内存压缩数据。

```typescript
async compress(data: Uint8Array, level?: number): Promise<Uint8Array>
```

**参数**：

- `data: Uint8Array` - 要压缩的数据
- `level?: number` - 压缩级别（1-9，默认 6）

**返回**：压缩后的数据

**示例**：

```typescript
const data = new TextEncoder().encode("Hello, World!");
const compressed = await compressor.compress(data);
```

#### decompress

内存解压数据。

```typescript
async decompress(data: Uint8Array): Promise<Uint8Array>
```

**参数**：

- `data: Uint8Array` - 要解压的数据

**返回**：解压后的数据

**示例**：

```typescript
const decompressed = await compressor.decompress(compressed);
```

---

## 🎯 使用场景

- **文件读写**：读取配置文件、写入日志文件
- **文件管理**：文件复制、移动、删除
- **文件监控**：监控配置文件变化、自动重载
- **文件类型检测**：验证上传文件类型
- **大文件处理**：流式处理大文件，避免内存溢出
- **文件压缩**：压缩日志文件、备份文件

---

## ⚡ 性能优化

- **流式处理**：大文件使用流式处理，避免一次性加载到内存
- **防抖处理**：文件监控使用防抖，减少事件触发频率
- **压缩优化**：支持自定义压缩级别，平衡压缩率和速度

---

## 📝 备注

- **仅服务端**：此模块仅支持服务端，客户端请使用
  `jsr:@dreamer/utils/client/file`
- **文件权限**：需要文件系统读写权限
- **压缩依赖**：压缩功能使用 `npm:pako@2.1.0`，Deno 和 Bun 都支持
- **类型安全**：完整的 TypeScript 类型支持

---

## 🔗 相关链接

- [客户端版本](../client/file.md)
- [JSR 包页面](https://jsr.io/@dreamer/utils)

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可证

Apache License 2.0 - 详见 [LICENSE](../../LICENSE)

---

<div align="center">

**Made with ❤️ by Dreamer Team**

</div>
