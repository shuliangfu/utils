# Client URL 处理

> 客户端 URL 处理工具函数模块，直接导出服务端版本

[![JSR](https://jsr.io/badges/@dreamer/utils)](https://jsr.io/@dreamer/utils)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🎯 功能

客户端 URL 处理工具函数，直接导出服务端版本，所有功能与服务端完全兼容。

---

## ✨ 特性

客户端版本与服务端版本功能完全相同，包括：

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
- **客户端**：✅ 支持（浏览器环境）
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
} from "jsr:@dreamer/utils/client/url";

// 使用方式与服务端版本完全相同
const url = "https://example.com/path?name=Alice&age=25";
const parsed = parse(url);

const query = parseQuery("name=Alice&age=25");
const built = build({
  protocol: "https:",
  host: "example.com",
  pathname: "/path",
});
```

---

## 📚 API 文档

客户端版本的所有 API 与服务端版本完全相同，请参考 [服务端文档](../url.md)。

---

## 🎯 使用场景

- **URL 解析**：解析 URL 获取各个部分
- **查询参数处理**：解析和构建查询参数
- **URL 构建**：动态构建 URL
- **URL 编码/解码**：处理特殊字符
- **路径合并**：合并多个路径片段
- **URL 验证**：验证 URL 格式是否正确

---

## 📝 备注

- **完全兼容**：客户端版本直接导出服务端版本，功能完全相同
- **类型安全**：完整的 TypeScript 类型支持
- **纯函数**：所有函数都是纯函数，无副作用
- **不可变**：所有函数都不会修改原字符串

---

## 🔗 相关链接

- [服务端版本](../url.md)
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
