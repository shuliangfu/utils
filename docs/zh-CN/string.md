# String 字符串处理

> 字符串处理工具函数模块，提供字符串截断、格式化、转换、填充、清理等功能

[![JSR](https://jsr.io/badges/@dreamer/utils)](https://jsr.io/@dreamer/utils)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)

---

## 🎯 功能

字符串处理工具函数，提供常用的字符串操作方法，支持服务端和客户端。

---

## ✨ 特性

- **字符串截断**：
  - 截断超过长度的字符串（`truncate`）
  - 自定义省略符
- **字符串格式化**：
  - 使用占位符替换（`format`）
- **命名转换**：
  - 驼峰命名（`camelCase`）
  - 蛇形命名（`snakeCase`）
  - 短横线命名（`kebabCase`）
  - 帕斯卡命名（`pascalCase`）
- **字符串填充**：
  - 左侧填充（`padStart`）
  - 右侧填充（`padEnd`）
- **字符串清理**：
  - 去除首尾空白（`trim`）
  - 去除左侧空白（`trimStart`）
  - 去除右侧空白（`trimEnd`）

---

## 📦 安装

```bash
deno add jsr:@dreamer/utils
```

---

## 🌍 环境兼容性

- **运行时要求**：Deno 2.6+ 或 Bun 1.3.5
- **服务端**：✅ 支持
- **客户端**：✅ 支持（通过 `jsr:@dreamer/utils/client/string`）
- **依赖**：无外部依赖（纯 TypeScript 实现）

---

## 🚀 快速开始

```typescript
import {
  camelCase,
  format,
  kebabCase,
  padEnd,
  padStart,
  pascalCase,
  snakeCase,
  trim,
  trimEnd,
  trimStart,
  truncate,
} from "jsr:@dreamer/utils/string";

// 字符串截断
const text = "这是一段很长的文本";
const truncated = truncate(text, 10); // "这是一段很长的..."
const truncated2 = truncate(text, 10, "..."); // 自定义省略符

// 字符串格式化
const formatted = format("Hello, {name}!", { name: "Alice" }); // "Hello, Alice!"

// 命名转换
const camel = camelCase("hello_world"); // "helloWorld"
const snake = snakeCase("helloWorld"); // "hello_world"
const kebab = kebabCase("helloWorld"); // "hello-world"
const pascal = pascalCase("hello_world"); // "HelloWorld"

// 字符串填充
const padded = padStart("5", 3, "0"); // "005"
const padded2 = padEnd("5", 3, "0"); // "500"

// 字符串清理
const cleaned = trim("  hello world  "); // "hello world"
const cleaned2 = trimStart("  hello world  "); // "hello world  "
const cleaned3 = trimEnd("  hello world  "); // "  hello world"
```

---

## 📚 API 文档

### truncate

截断字符串，超过指定长度时添加省略符。

```typescript
function truncate(str: string, length: number, suffix?: string): string;
```

**参数**：

- `str: string` - 要截断的字符串
- `length: number` - 最大长度
- `suffix: string` - 省略符（默认 "..."）

**返回**：截断后的字符串

**示例**：

```typescript
const text = "这是一段很长的文本";
const truncated = truncate(text, 10); // "这是一段很长的..."
```

---

### format

字符串格式化，使用占位符替换。

```typescript
function format(template: string, data: Record<string, unknown>): string;
```

**参数**：

- `template: string` - 模板字符串（如 "Hello, {name}!"）
- `data: Record<string, unknown>` - 数据对象

**返回**：格式化后的字符串

**示例**：

```typescript
const formatted = format("Hello, {name}!", { name: "Alice" }); // "Hello, Alice!"
```

---

### camelCase

转换为驼峰命名（camelCase）。

```typescript
function camelCase(str: string): string;
```

**参数**：

- `str: string` - 要转换的字符串

**返回**：驼峰命名

**示例**：

```typescript
const camel = camelCase("hello_world"); // "helloWorld"
const camel2 = camelCase("hello-world"); // "helloWorld"
const camel3 = camelCase("hello world"); // "helloWorld"
```

---

### snakeCase

转换为蛇形命名（snake_case）。

```typescript
function snakeCase(str: string): string;
```

**参数**：

- `str: string` - 要转换的字符串

**返回**：蛇形命名

**示例**：

```typescript
const snake = snakeCase("helloWorld"); // "hello_world"
const snake2 = snakeCase("hello-world"); // "hello_world"
```

---

### kebabCase

转换为短横线命名（kebab-case）。

```typescript
function kebabCase(str: string): string;
```

**参数**：

- `str: string` - 要转换的字符串

**返回**：短横线命名

**示例**：

```typescript
const kebab = kebabCase("helloWorld"); // "hello-world"
const kebab2 = kebabCase("hello_world"); // "hello-world"
```

---

### pascalCase

转换为帕斯卡命名（PascalCase）。

```typescript
function pascalCase(str: string): string;
```

**参数**：

- `str: string` - 要转换的字符串

**返回**：帕斯卡命名

**示例**：

```typescript
const pascal = pascalCase("hello_world"); // "HelloWorld"
const pascal2 = pascalCase("hello-world"); // "HelloWorld"
```

---

### padStart

字符串左侧填充。

```typescript
function padStart(str: string, length: number, padString?: string): string;
```

**参数**：

- `str: string` - 要填充的字符串
- `length: number` - 目标长度
- `padString: string` - 填充字符（默认空格）

**返回**：填充后的字符串

**示例**：

```typescript
const padded = padStart("5", 3, "0"); // "005"
const padded2 = padStart("hello", 10); // "     hello"
```

---

### padEnd

字符串右侧填充。

```typescript
function padEnd(str: string, length: number, padString?: string): string;
```

**参数**：

- `str: string` - 要填充的字符串
- `length: number` - 目标长度
- `padString: string` - 填充字符（默认空格）

**返回**：填充后的字符串

**示例**：

```typescript
const padded = padEnd("5", 3, "0"); // "500"
const padded2 = padEnd("hello", 10); // "hello     "
```

---

### trim

去除首尾空白字符。

```typescript
function trim(str: string): string;
```

**参数**：

- `str: string` - 要处理的字符串

**返回**：处理后的字符串

**示例**：

```typescript
const cleaned = trim("  hello world  "); // "hello world"
```

---

### trimStart

去除左侧空白字符。

```typescript
function trimStart(str: string): string;
```

**参数**：

- `str: string` - 要处理的字符串

**返回**：处理后的字符串

**示例**：

```typescript
const cleaned = trimStart("  hello world  "); // "hello world  "
```

---

### trimEnd

去除右侧空白字符。

```typescript
function trimEnd(str: string): string;
```

**参数**：

- `str: string` - 要处理的字符串

**返回**：处理后的字符串

**示例**：

```typescript
const cleaned = trimEnd("  hello world  "); // "  hello world"
```

---

## 🎯 使用场景

- **文本截断**：显示长文本的摘要
- **模板替换**：动态生成文本内容
- **命名转换**：在不同命名规范间转换
- **字符串格式化**：填充、对齐等格式化操作
- **数据清理**：去除空白字符

---

## ⚡ 性能优化

- **时间复杂度**：所有函数为 O(n)，其中 n 为字符串长度
- **空间复杂度**：大部分函数为 O(n)，部分函数为 O(1)

---

## 📝 备注

- **类型安全**：完整的 TypeScript 类型支持
- **纯函数**：所有函数都是纯函数，无副作用
- **不可变**：所有函数都不会修改原字符串
- **客户端兼容**：客户端版本通过 `jsr:@dreamer/utils/client/string` 使用

---

## 🔗 相关链接

- [客户端版本](../client/string.md)
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
