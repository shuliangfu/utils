# Client Date 日期时间处理

> 客户端日期时间处理工具函数模块，直接导出服务端版本

[![JSR](https://jsr.io/badges/@dreamer/utils)](https://jsr.io/@dreamer/utils)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🎯 功能

客户端日期时间处理工具函数，直接导出服务端版本，所有功能与服务端完全兼容。

---

## ✨ 特性

客户端版本与服务端版本功能完全相同，包括：
- **日期格式化**：
  - 自定义格式字符串（`format`）
  - 支持 YYYY、MM、DD、HH、mm、ss 等格式
- **日期计算**：
  - 添加天数（`addDays`）
  - 添加月数（`addMonths`）
  - 添加年数（`addYears`）
- **日期比较**：
  - 判断是否在之前（`isBefore`）
  - 判断是否在之后（`isAfter`）
  - 判断是否相同（`isSame`）
- **日期差值**：
  - 计算天数差值（`diffDays`）
  - 计算小时数差值（`diffHours`）
- **相对时间**：
  - 从指定时间到现在（`fromNow`）
  - 从现在到指定时间（`toNow`）

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
  format,
  addDays,
  addMonths,
  addYears,
  isBefore,
  isAfter,
  isSame,
  diffDays,
  diffHours,
  fromNow,
  toNow,
} from "jsr:@dreamer/utils/client/date";

// 使用方式与服务端版本完全相同
const date = new Date("2024-01-01");
const formatted = format(date, "YYYY-MM-DD"); // "2024-01-01"

const tomorrow = addDays(new Date(), 1);
const relative = fromNow(new Date(Date.now() - 1000 * 60 * 5)); // "5 分钟前"
```

---

## 📚 API 文档

客户端版本的所有 API 与服务端版本完全相同，请参考 [服务端文档](../date.md)。

---

## 🎯 使用场景

- **日期格式化**：将日期格式化为指定格式
- **日期计算**：计算未来或过去的日期
- **日期比较**：判断日期的先后关系
- **日期差值**：计算两个日期之间的差值
- **相对时间**：显示相对时间（如 "5 分钟前"）

---

## 📝 备注

- **完全兼容**：客户端版本直接导出服务端版本，功能完全相同
- **类型安全**：完整的 TypeScript 类型支持
- **纯函数**：所有函数都是纯函数，无副作用
- **不可变**：所有函数都不会修改原日期对象

---

## 🔗 相关链接

- [服务端版本](../date.md)
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
