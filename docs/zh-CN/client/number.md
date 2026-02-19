# Client Number 数字格式化

> 客户端数字格式化工具函数模块，直接导出服务端版本

[![JSR](https://jsr.io/badges/@dreamer/utils)](https://jsr.io/@dreamer/utils)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)

---

## 🎯 功能

客户端数字格式化工具函数，直接导出服务端版本，所有功能与服务端完全兼容。

---

## ✨ 特性

客户端版本与服务端版本功能完全相同，包括：

- **数字格式化**：
  - 自定义格式字符串（`format`）
  - 千位分隔符
- **货币格式化**：
  - 支持多种货币（`formatCurrency`）
  - USD、EUR、GBP、CNY、JPY 等
- **百分比格式化**：
  - 小数转百分比（`formatPercent`）
- **范围限制**：
  - 限制数字在范围内（`clamp`）
  - 判断数字是否在范围内（`inRange`）
- **数字舍入**：
  - 四舍五入（`round`）
  - 向下取整（`floor`）
  - 向上取整（`ceil`）

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
  ceil,
  clamp,
  floor,
  format,
  formatCurrency,
  formatPercent,
  inRange,
  round,
} from "jsr:@dreamer/utils/client/number";

// 使用方式与服务端版本完全相同
const num = 1234567.89;
const formatted = format(num, "0,0.00"); // "1,234,567.89"

const currency = formatCurrency(num, "USD"); // "$1,234,567.89"
const percent = formatPercent(0.1234); // "12.34%"
```

---

## 📚 API 文档

客户端版本的所有 API 与服务端版本完全相同，请参考 [服务端文档](../number.md)。

---

## 🎯 使用场景

- **数字格式化**：格式化显示数字
- **货币显示**：显示货币金额
- **百分比显示**：显示百分比
- **范围限制**：限制输入值在指定范围内
- **数字舍入**：对数字进行舍入处理

---

## 📝 备注

- **完全兼容**：客户端版本直接导出服务端版本，功能完全相同
- **类型安全**：完整的 TypeScript 类型支持
- **纯函数**：所有函数都是纯函数，无副作用
- **不可变**：所有函数都不会修改原数字

---

## 🔗 相关链接

- [服务端版本](../number.md)
- [JSR 包页面](https://jsr.io/@dreamer/utils)

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可证

Apache License 2.0 - 详见 [LICENSE](../../../LICENSE)

---

<div align="center">

**Made with ❤️ by Dreamer Team**

</div>
