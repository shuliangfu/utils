# Client Object 对象操作

> 客户端对象操作工具函数模块，直接导出服务端版本

[![JSR](https://jsr.io/badges/@dreamer/utils)](https://jsr.io/@dreamer/utils)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)

---

## 🎯 功能

客户端对象操作工具函数，直接导出服务端版本，所有功能与服务端完全兼容。

---

## ✨ 特性

客户端版本与服务端版本功能完全相同，包括：

- **对象克隆**：
  - 深度克隆对象（`deepClone`）
  - 支持 Date、Array 等特殊对象
- **对象合并**：
  - 浅合并（`merge`）
  - 深度合并（`deepMerge`）
- **路径访问**：
  - 获取路径值（`get`）
  - 设置路径值（`set`）
  - 检查路径是否存在（`has`）
  - 删除路径值（`deletePath`）
- **对象过滤**：
  - 选择指定属性（`pick`）
  - 排除指定属性（`omit`）
- **对象比较**：
  - 浅比较（`isEqual`）
  - 深度比较（`isDeepEqual`）

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
  deepClone,
  deepMerge,
  deletePath,
  get,
  has,
  isDeepEqual,
  isEqual,
  merge,
  omit,
  pick,
  set,
} from "jsr:@dreamer/utils/client/object";

// 使用方式与服务端版本完全相同
const obj = { a: 1, b: { c: 2 } };
const cloned = deepClone(obj); // 完全独立的副本

const data = { user: { name: "Alice", age: 25 } };
const name = get(data, "user.name"); // "Alice"
```

---

## 📚 API 文档

客户端版本的所有 API 与服务端版本完全相同，请参考 [服务端文档](../object.md)。

---

## 🎯 使用场景

- **对象克隆**：创建对象副本，避免引用问题
- **配置合并**：合并多个配置对象
- **数据访问**：安全访问嵌套对象属性
- **数据过滤**：选择或排除对象属性
- **数据比较**：比较对象是否相等

---

## 📝 备注

- **完全兼容**：客户端版本直接导出服务端版本，功能完全相同
- **类型安全**：完整的 TypeScript 类型支持
- **纯函数**：大部分函数是纯函数，`set` 和 `deletePath` 会修改原对象

---

## 🔗 相关链接

- [服务端版本](../object.md)
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
