# Format 格式化工具

> 格式化工具函数模块，提供文件大小格式化、时长格式化、数字格式化、百分比格式化等功能

[![JSR](https://jsr.io/badges/@dreamer/utils)](https://jsr.io/@dreamer/utils)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)

---

## 🎯 功能

格式化工具函数，提供常用的格式化操作方法，支持服务端和客户端。

---

## ✨ 特性

- **文件大小格式化**：
  - 自动选择合适单位（`formatBytes`）
  - 支持自定义单位和精度
- **时长格式化**：
  - 人类可读格式（`formatDuration`）
  - 时间格式（HH:mm:ss）
- **数字格式化**：
  - 添加千位分隔符（`formatNumber`）
  - 支持自定义分隔符和精度
- **百分比格式化**：
  - 小数转百分比（`formatPercent`）
  - 支持自定义精度

---

## 📦 安装

```bash
deno add jsr:@dreamer/utils
```

---

## 🌍 环境兼容性

- **运行时要求**：Deno 2.6+ 或 Bun 1.3.5
- **服务端**：✅ 支持
- **客户端**：✅ 支持（通过 `jsr:@dreamer/utils/client/format`）
- **依赖**：无外部依赖（纯 TypeScript 实现）

---

## 🚀 快速开始

```typescript
import {
  formatBytes,
  formatDuration,
  formatNumber,
  formatPercent,
} from "jsr:@dreamer/utils/format";

// 文件大小格式化
const size = formatBytes(1024 * 1024 * 5); // "5 MB"
const size2 = formatBytes(1024 * 1024 * 5, { precision: 2 }); // "5.00 MB"
const size3 = formatBytes(1024 * 1024 * 5, { unit: "KB" }); // "5120.00 KB"

// 时长格式化
const duration = formatDuration(3661); // "1 小时 1 分钟 1 秒"
const duration2 = formatDuration(3661, { format: "HH:mm:ss" }); // "01:01:01"

// 数字格式化
const num = formatNumber(1234567.89); // "1,234,567.89"
const num2 = formatNumber(1234567.89, { precision: 0 }); // "1,234,568"
const num3 = formatNumber(1234567.89, { separator: "." }); // "1.234.567.89"

// 百分比格式化
const percent = formatPercent(0.1234); // "12.34%"
const percent2 = formatPercent(0.1234, 1); // "12.3%"
```

---

## 📚 API 文档

### formatBytes

格式化文件大小，将字节数转换为人类可读的格式。

```typescript
function formatBytes(
  bytes: number,
  options?: { precision?: number; unit?: "B" | "KB" | "MB" | "GB" | "TB" },
): string;
```

**参数**：

- `bytes: number` - 字节数
- `options: object` - 选项
  - `precision?: number` - 精度（小数位数，默认 0）
  - `unit?: "B" | "KB" | "MB" | "GB" | "TB"` -
    指定单位（可选，不指定则自动选择）

**返回**：格式化后的字符串

**示例**：

```typescript
formatBytes(1024); // "1 KB"
formatBytes(1024 * 1024); // "1 MB"
formatBytes(1024 * 1024 * 5); // "5 MB"
formatBytes(1024 * 1024 * 5, { precision: 2 }); // "5.00 MB"
formatBytes(1024 * 1024 * 5, { unit: "KB" }); // "5120.00 KB"
```

---

### formatDuration

格式化时长，将秒数转换为人类可读的格式或时间格式。

```typescript
function formatDuration(
  seconds: number,
  options?: { format?: "human" | "HH:mm:ss" },
): string;
```

**参数**：

- `seconds: number` - 秒数
- `options: object` - 选项
  - `format?: "human" | "HH:mm:ss"` - 格式类型（默认 "human"）

**返回**：格式化后的字符串

**格式说明**：

- `human` - 人类可读格式（如 "1 小时 1 分钟 1 秒"）
- `HH:mm:ss` - 时间格式（如 "01:01:01"）

**示例**：

```typescript
formatDuration(3661); // "1 小时 1 分钟 1 秒"
formatDuration(3661, { format: "HH:mm:ss" }); // "01:01:01"
formatDuration(60); // "1 分钟"
formatDuration(30); // "30 秒"
```

---

### formatNumber

格式化数字，添加千位分隔符。

```typescript
function formatNumber(
  num: number,
  options?: { precision?: number; separator?: string },
): string;
```

**参数**：

- `num: number` - 要格式化的数字
- `options: object` - 选项
  - `precision?: number` - 精度（小数位数，默认 2）
  - `separator?: string` - 分隔符（默认 ","）

**返回**：格式化后的字符串

**示例**：

```typescript
formatNumber(1234567.89); // "1,234,567.89"
formatNumber(1234567.89, { precision: 0 }); // "1,234,568"
formatNumber(1234567.89, { separator: "." }); // "1.234.567.89"
formatNumber(1234567.89, { precision: 1, separator: " " }); // "1 234 567.9"
```

---

### formatPercent

格式化百分比，将小数转换为百分比字符串。

```typescript
function formatPercent(num: number, precision?: number): string;
```

**参数**：

- `num: number` - 要格式化的数字（0-1 之间的小数）
- `precision?: number` - 精度（小数位数，默认 2）

**返回**：百分比字符串

**示例**：

```typescript
formatPercent(0.1234); // "12.34%"
formatPercent(0.1234, 1); // "12.3%"
formatPercent(0.5); // "50.00%"
formatPercent(1); // "100.00%"
```

---

## 🎯 使用场景

- **文件大小显示**：显示文件、下载大小等
- **时长显示**：显示视频时长、处理时间等
- **数字显示**：格式化大数字，提高可读性
- **百分比显示**：显示进度、比例等

---

## ⚡ 性能优化

- **时间复杂度**：所有函数为 O(1)
- **空间复杂度**：所有函数为 O(1)

---

## 📝 备注

- **类型安全**：完整的 TypeScript 类型支持
- **纯函数**：所有函数都是纯函数，无副作用
- **不可变**：所有函数都不会修改原数字
- **客户端兼容**：客户端版本通过 `jsr:@dreamer/utils/client/format` 使用

---

## 🔗 相关链接

- [客户端版本](../client/format.md)
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
