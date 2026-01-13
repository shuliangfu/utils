# Client Validator 数据验证

> 客户端数据验证工具模块，直接导出服务端版本

[![JSR](https://jsr.io/badges/@dreamer/utils)](https://jsr.io/@dreamer/utils)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🎯 功能

客户端数据验证工具，直接导出服务端版本，所有功能与服务端完全兼容。

---

## ✨ 特性

客户端版本与服务端版本功能完全相同，包括：
- **基础类型验证**：
  - 字符串验证（`string`）
  - 数字验证（`number`）
  - 布尔值验证（`boolean`）
  - 邮箱验证（`email`）
  - URL 验证（`url`）
- **对象结构验证**：
  - 对象结构验证（`object`）
  - 支持嵌套对象
- **数组验证**：
  - 数组验证（`array`）
  - 支持数组元素验证
- **自定义验证规则**：
  - 自定义验证函数（`custom`）
- **验证转换**：
  - 类型转换（`transform`）
- **默认值**：
  - 设置默认值（`default`）
- **条件验证**：
  - 根据其他字段值进行条件验证（`when`）
- **错误消息定制**：
  - 自定义错误消息（`message`）
  - 支持国际化
- **异步验证支持**：
  - 异步验证（`validateAsync`）

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
import { validate, string, number, object, email, url } from "jsr:@dreamer/utils/client/validator";

// 使用方式与服务端版本完全相同
const nameSchema = string().min(2).max(50).required();
const result = validate("Alice", nameSchema);

// 对象验证（表单验证）
const formSchema = object({
  name: string().min(2).required(),
  age: number().min(18).max(100).required(),
  email: email().required(),
  website: url().optional(),
});

const formData = {
  name: "Alice",
  age: 25,
  email: "alice@example.com",
  website: "https://example.com",
};

const formResult = validate(formData, formSchema);
if (formResult.success) {
  console.log("表单验证通过:", formResult.data);
} else {
  formResult.errors.forEach((error) => {
    console.log(`${error.path}: ${error.message}`);
  });
}
```

---

## 📚 API 文档

客户端版本的所有 API 与服务端版本完全相同，请参考 [服务端文档](../validator.md)。

---

## 🎯 使用场景

- **表单验证**：验证用户输入
- **API 数据验证**：验证 API 请求和响应数据
- **配置验证**：验证配置文件
- **数据转换**：验证并转换数据类型
- **条件验证**：根据其他字段值进行条件验证

---

## 📝 备注

- **完全兼容**：客户端版本直接导出服务端版本，功能完全相同
- **类型安全**：完整的 TypeScript 类型支持
- **纯函数**：所有验证器都是纯函数，无副作用
- **错误消息**：支持自定义错误消息，支持国际化

---

## 🔗 相关链接

- [服务端版本](../validator.md)
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
