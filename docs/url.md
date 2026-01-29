# URL 处理

> URL 处理工具函数模块，提供 URL
> 解析、构建、查询参数处理、编码解码、合并、验证等功能

[![JSR](https://jsr.io/badges/@dreamer/utils)](https://jsr.io/@dreamer/utils)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🎯 功能

URL 处理工具函数，提供常用的 URL 操作方法，支持服务端和客户端。

---

## ✨ 特性

- **URL 解析**：
  - 解析 URL 获取各个部分（`parse`）
  - 返回 protocol、host、pathname、search 等
- **查询参数解析**：
  - 解析查询字符串（`parseQuery`）
  - 返回参数对象
- **URL 构建**：
  - 根据选项构建 URL（`build`）
- **查询参数构建**：
  - 将对象转换为查询字符串（`buildQuery`）
  - 自动忽略 null 和 undefined
- **URL 编码/解码**：
  - URL 编码（`encode`）
  - URL 解码（`decode`）
- **URL 合并**：
  - 合并多个路径片段（`join`）
  - 自动处理多余的斜杠
- **URL 验证**：
  - 验证 URL 是否有效（`isValid`）

---

## 📦 安装

```bash
deno add jsr:@dreamer/utils
```

---

## 🌍 环境兼容性

- **运行时要求**：Deno 2.6+ 或 Bun 1.3.5
- **服务端**：✅ 支持
- **客户端**：✅ 支持（通过 `jsr:@dreamer/utils/client/url`）
- **依赖**：无外部依赖（纯 TypeScript 实现）

---

## 🚀 快速开始

```typescript
import {
  build,
  buildQuery,
  decode,
  encode,
  isValid,
  join,
  parse,
  parseQuery,
} from "jsr:@dreamer/utils/url";

// URL 解析
const url = "https://example.com/path?name=Alice&age=25";
const parsed = parse(url);
// {
//   protocol: "https:",
//   host: "example.com",
//   hostname: "example.com",
//   port: "",
//   pathname: "/path",
//   search: "?name=Alice&age=25",
//   hash: "",
//   origin: "https://example.com"
// }

// 查询参数解析
const query = parseQuery("name=Alice&age=25");
// { name: "Alice", age: "25" }

// URL 构建
const built = build({
  protocol: "https:",
  host: "example.com",
  pathname: "/path",
  search: "?name=Alice&age=25",
});
// "https://example.com/path?name=Alice&age=25"

// 查询参数构建
const queryString = buildQuery({ name: "Alice", age: 25 });
// "name=Alice&age=25"

// URL 编码/解码
const encoded = encode("Hello World"); // "Hello%20World"
const decoded = decode("Hello%20World"); // "Hello World"

// URL 合并
const joined = join("https://example.com", "path", "to", "resource");
// "https://example.com/path/to/resource"

// URL 验证
const valid = isValid("https://example.com"); // true
const invalid = isValid("not-a-url"); // false
```

---

## 📚 API 文档

### parse

解析 URL，返回解析后的对象。

```typescript
function parse(url: string): ParsedURL;
```

**参数**：

- `url: string` - URL 字符串

**返回**：解析后的对象（ParsedURL）

**ParsedURL 接口**：

```typescript
interface ParsedURL {
  protocol: string; // 协议（如 "https:"）
  host: string; // 主机（如 "example.com:8080"）
  hostname: string; // 主机名（如 "example.com"）
  port: string; // 端口（如 "8080"）
  pathname: string; // 路径（如 "/path/to/resource"）
  search: string; // 查询字符串（如 "?name=Alice"）
  hash: string; // 哈希（如 "#section"）
  origin: string; // 源（如 "https://example.com"）
}
```

**示例**：

```typescript
const parsed = parse("https://example.com:8080/path?name=Alice#section");
console.log(parsed.hostname); // "example.com"
console.log(parsed.port); // "8080"
console.log(parsed.pathname); // "/path"
```

---

### parseQuery

解析查询字符串，返回查询参数对象。

```typescript
function parseQuery(query: string): Record<string, string>;
```

**参数**：

- `query: string` - 查询字符串（如 "name=Alice&age=25"）

**返回**：查询参数对象

**示例**：

```typescript
const params = parseQuery("name=Alice&age=25");
// { name: "Alice", age: "25" }
```

---

### build

构建 URL，根据选项构建 URL 字符串。

```typescript
function build(options: BuildURLOptions): string;
```

**参数**：

- `options: BuildURLOptions` - URL 选项

**BuildURLOptions 接口**：

```typescript
interface BuildURLOptions {
  protocol?: string; // 协议（如 "https:"）
  host?: string; // 主机（如 "example.com:8080"）
  hostname?: string; // 主机名（如 "example.com"）
  port?: string; // 端口（如 "8080"）
  pathname?: string; // 路径（如 "/path"）
  search?: string; // 查询字符串（如 "?name=Alice"）
  hash?: string; // 哈希（如 "#section"）
}
```

**返回**：构建后的 URL 字符串

**示例**：

```typescript
const url = build({
  protocol: "https:",
  hostname: "example.com",
  pathname: "/api/users",
  search: "?page=1",
});
// "https://example.com/api/users?page=1"
```

---

### buildQuery

构建查询字符串，将对象转换为查询字符串。

```typescript
function buildQuery(params: Record<string, unknown>): string;
```

**参数**：

- `params: Record<string, unknown>` - 查询参数对象

**返回**：查询字符串

**示例**：

```typescript
const query = buildQuery({ name: "Alice", age: 25 });
// "name=Alice&age=25"

// null 和 undefined 会被忽略
const query2 = buildQuery({ name: "Alice", age: null, email: undefined });
// "name=Alice"
```

---

### encode

URL 编码，将字符串编码为 URL 安全格式。

```typescript
function encode(str: string): string;
```

**参数**：

- `str: string` - 要编码的字符串

**返回**：编码后的字符串

**示例**：

```typescript
const encoded = encode("Hello World"); // "Hello%20World"
const encoded2 = encode("你好"); // "%E4%BD%A0%E5%A5%BD"
```

---

### decode

URL 解码，将 URL 编码的字符串解码。

```typescript
function decode(str: string): string;
```

**参数**：

- `str: string` - 要解码的字符串

**返回**：解码后的字符串

**示例**：

```typescript
const decoded = decode("Hello%20World"); // "Hello World"
const decoded2 = decode("%E4%BD%A0%E5%A5%BD"); // "你好"
```

---

### join

合并 URL 路径，将多个路径片段合并为一个 URL。

```typescript
function join(base: string, ...paths: string[]): string;
```

**参数**：

- `base: string` - 基础 URL
- `...paths: string[]` - 路径片段

**返回**：合并后的 URL

**示例**：

```typescript
const url = join("https://example.com", "api", "users", "123");
// "https://example.com/api/users/123"

// 自动处理多余的斜杠
const url2 = join("https://example.com/", "/api/", "/users/");
// "https://example.com/api/users"
```

---

### isValid

验证 URL 是否有效。

```typescript
function isValid(url: string): boolean;
```

**参数**：

- `url: string` - URL 字符串

**返回**：是否有效

**示例**：

```typescript
isValid("https://example.com"); // true
isValid("http://example.com"); // true
isValid("not-a-url"); // false
isValid("ftp://example.com"); // true
```

---

## 🎯 使用场景

- **URL 解析**：解析 URL 获取各个部分
- **查询参数处理**：解析和构建查询参数
- **URL 构建**：动态构建 URL
- **URL 编码/解码**：处理特殊字符
- **路径合并**：合并多个路径片段
- **URL 验证**：验证 URL 格式是否正确

---

## ⚡ 性能优化

- **时间复杂度**：所有函数为 O(n)，其中 n 为字符串长度
- **空间复杂度**：大部分函数为 O(n)

---

## 📝 备注

- **类型安全**：完整的 TypeScript 类型支持
- **纯函数**：所有函数都是纯函数，无副作用
- **不可变**：所有函数都不会修改原字符串
- **客户端兼容**：客户端版本通过 `jsr:@dreamer/utils/client/url` 使用

---

## 🔗 相关链接

- [客户端版本](../client/url.md)
- [JSR 包页面](https://jsr.io/@dreamer/utils)

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
