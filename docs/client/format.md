# Client Format 格式化工具

> 客户端格式化工具函数模块，直接导出服务端版本

[![JSR](https://jsr.io/badges/@dreamer/utils)](https://jsr.io/@dreamer/utils)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🎯 功能

客户端格式化工具函数，直接导出服务端版本，所有功能与服务端完全兼容。

---

## ✨ 特性

客户端版本与服务端版本功能完全相同，包括：

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
- **客户端**：✅ 支持（浏览器环境）
- **依赖**：无外部依赖（纯 TypeScript 实现）

---

## 🚀 快速开始

```typescript
import {
  formatBytes,
  formatDuration,
  formatNumber,
  formatPercent,
} from "jsr:@dreamer/utils/client/format";

// 使用方式与服务端版本完全相同
const size = formatBytes(1024 * 1024 * 5); // "5 MB"
const duration = formatDuration(3661); // "1 小时 1 分钟 1 秒"
const num = formatNumber(1234567.89); // "1,234,567.89"
const percent = formatPercent(0.1234); // "12.34%"
```

---

## 📚 API 文档

客户端版本的所有 API 与服务端版本完全相同，请参考 [服务端文档](../format.md)。

---

## 🎯 使用场景

- **文件大小显示**：显示文件、下载大小等
- **时长显示**：显示视频时长、处理时间等
- **数字显示**：格式化大数字，提高可读性
- **百分比显示**：显示进度、比例等

---

## 📝 备注

- **完全兼容**：客户端版本直接导出服务端版本，功能完全相同
- **类型安全**：完整的 TypeScript 类型支持
- **纯函数**：所有函数都是纯函数，无副作用
- **不可变**：所有函数都不会修改原数字

---

## 🔗 相关链接

- [服务端版本](../format.md)
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
