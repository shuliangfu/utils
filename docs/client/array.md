# Client Array 数组操作

> 客户端数组操作工具函数模块，直接导出服务端版本

[![JSR](https://jsr.io/badges/@dreamer/utils)](https://jsr.io/@dreamer/utils)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🎯 功能

客户端数组操作工具函数，直接导出服务端版本，所有功能与服务端完全兼容。

---

## ✨ 特性

客户端版本与服务端版本功能完全相同，包括：
- **数组去重**：
  - 基础去重（`unique`）
  - 按属性去重（`uniqueBy`）
- **数组分组**：
  - 按字符串键分组（`groupBy`）
  - 按函数分组（`groupBy`）
- **数组分块**：
  - 将数组分割成指定大小的块（`chunk`）
- **数组扁平化**：
  - 一层扁平化（`flatten`）
  - 深度扁平化（`flattenDeep`）
- **集合操作**：
  - 数组差集（`difference`）
  - 数组交集（`intersection`）
  - 数组并集（`union`）
- **数组统计**：
  - 统计元素出现次数（`count`）
  - 按属性统计（`countBy`）

---

## 📦 安装

```bash
deno add jsr:@dreamer/utils
```

---

## 🌍 环境兼容性

- **运行时要求**：Deno 2.5+ 或 Bun 1.0+
- **服务端**：✅ 支持
- **客户端**：✅ 支持（浏览器环境）
- **依赖**：无外部依赖（纯 TypeScript 实现）

---

## 🚀 快速开始

```typescript
import {
  unique,
  uniqueBy,
  groupBy,
  chunk,
  flatten,
  flattenDeep,
  difference,
  intersection,
  union,
  count,
  countBy,
} from "jsr:@dreamer/utils/client/array";

// 使用方式与服务端版本完全相同
const arr = [1, 2, 2, 3, 3, 3];
const uniqueArr = unique(arr); // [1, 2, 3]

const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 1, name: "Alice" },
];
const uniqueUsers = uniqueBy(users, "id"); // 按 id 去重
```

---

## 📚 API 文档

客户端版本的所有 API 与服务端版本完全相同，请参考 [服务端文档](../array.md)。

---

## 🎯 使用场景

- **数据去重**：去除重复数据
- **数据分组**：按条件分组数据
- **数据分页**：将数组分块处理
- **数据扁平化**：处理嵌套数组
- **集合操作**：计算差集、交集、并集
- **数据统计**：统计元素出现次数

---

## 📝 备注

- **完全兼容**：客户端版本直接导出服务端版本，功能完全相同
- **类型安全**：完整的 TypeScript 类型支持
- **纯函数**：所有函数都是纯函数，无副作用
- **不可变**：所有函数都不会修改原数组

---

## 🔗 相关链接

- [服务端版本](../array.md)
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
