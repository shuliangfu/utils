# Validator 数据验证

> 数据验证工具模块，提供类型验证、对象结构验证、自定义验证规则等功能

[![JSR](https://jsr.io/badges/@dreamer/utils)](https://jsr.io/@dreamer/utils)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🎯 功能

数据验证工具，提供类似 Joi/Yup 的验证功能，支持服务端和客户端。

---

## ✨ 特性

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

- **运行时要求**：Deno 2.6+ 或 Bun 1.3.5
- **服务端**：✅ 支持
- **客户端**：✅ 支持（通过 `jsr:@dreamer/utils/client/validator`）
- **依赖**：无外部依赖（纯 TypeScript 实现）

---

## 🚀 快速开始

```typescript
import { validate, string, number, object, email, url } from "jsr:@dreamer/utils/validator";

// 基础验证
const nameSchema = string().min(2).max(50).required();
const result = validate("Alice", nameSchema);
if (result.success) {
  console.log("验证通过:", result.data);
} else {
  console.log("验证失败:", result.errors);
}

// 对象验证
const userSchema = object({
  name: string().min(2).required(),
  age: number().min(18).max(100).required(),
  email: email().required(),
  website: url().optional(),
  tags: array(string()).min(1).optional(),
});

const userData = {
  name: "Alice",
  age: 25,
  email: "alice@example.com",
  website: "https://example.com",
  tags: ["developer", "designer"],
};

const userResult = validate(userData, userSchema);
if (userResult.success) {
  console.log("用户数据验证通过:", userResult.data);
} else {
  userResult.errors.forEach((error) => {
    console.log(`${error.path}: ${error.message}`);
  });
}

// 自定义验证规则
const passwordSchema = string()
  .min(8)
  .custom((value) => {
    if (!/[A-Z]/.test(value)) {
      return "密码必须包含至少一个大写字母";
    }
    if (!/[a-z]/.test(value)) {
      return "密码必须包含至少一个小写字母";
    }
    if (!/[0-9]/.test(value)) {
      return "密码必须包含至少一个数字";
    }
    return true;
  })
  .required();

// 类型转换和默认值
const configSchema = object({
  port: number().default(3000).transform((v) => Number(v)),
  debug: boolean().default(false),
  timeout: number().min(0).default(5000),
});
```

---

## 📚 API 文档

### validate

验证值，返回验证结果。

```typescript
function validate<T = unknown>(
  value: unknown,
  validator: Validator<T>,
): ValidationResult<T>
```

**参数**：
- `value: unknown` - 要验证的值
- `validator: Validator<T>` - 验证器

**返回**：验证结果（ValidationResult）

**ValidationResult**：
```typescript
interface ValidationResult<T> {
  success: boolean;      // 是否验证通过
  data?: T;             // 验证后的数据（转换后的值）
  errors: ValidationError[]; // 错误列表
}
```

**ValidationError**：
```typescript
interface ValidationError {
  path: string;         // 字段路径（支持嵌套，如 "user.address.city"）
  message: string;      // 错误消息
  value: unknown;       // 字段值
  rule?: string;        // 验证规则名称
}
```

**示例**：
```typescript
const result = validate("Alice", string().min(2).required());
if (result.success) {
  console.log("验证通过:", result.data);
} else {
  result.errors.forEach((error) => {
    console.log(`${error.path}: ${error.message}`);
  });
}
```

---

### string

创建字符串验证器。

```typescript
function string(): StringValidator
```

**StringValidator 方法**：
- `required()` - 设置必填
- `optional()` - 设置可选
- `default(value: string)` - 设置默认值
- `min(length: number)` - 设置最小长度
- `max(length: number)` - 设置最大长度
- `email()` - 验证邮箱格式
- `url()` - 验证 URL 格式
- `pattern(regex: RegExp)` - 验证正则表达式
- `custom(validator: (value: string) => boolean | string)` - 自定义验证规则
- `transform(fn: (value: unknown) => string)` - 类型转换
- `message(rule: string, message: string)` - 自定义错误消息

**示例**：
```typescript
const schema = string()
  .min(2)
  .max(50)
  .required()
  .message("required", "此字段为必填项");

const result = validate("Alice", schema);
```

---

### number

创建数字验证器。

```typescript
function number(): NumberValidator
```

**NumberValidator 方法**：
- `required()` - 设置必填
- `optional()` - 设置可选
- `default(value: number)` - 设置默认值
- `min(value: number)` - 设置最小值
- `max(value: number)` - 设置最大值
- `integer()` - 验证整数
- `custom(validator: (value: number) => boolean | string)` - 自定义验证规则
- `transform(fn: (value: unknown) => number)` - 类型转换
- `message(rule: string, message: string)` - 自定义错误消息

**示例**：
```typescript
const schema = number()
  .min(18)
  .max(100)
  .integer()
  .required();

const result = validate(25, schema);
```

---

### boolean

创建布尔值验证器。

```typescript
function boolean(): BooleanValidator
```

**BooleanValidator 方法**：
- `required()` - 设置必填
- `optional()` - 设置可选
- `default(value: boolean)` - 设置默认值
- `custom(validator: (value: boolean) => boolean | string)` - 自定义验证规则
- `transform(fn: (value: unknown) => boolean)` - 类型转换
- `message(rule: string, message: string)` - 自定义错误消息

**示例**：
```typescript
const schema = boolean().default(false);

const result = validate(true, schema);
```

---

### email

创建邮箱验证器（继承自 StringValidator）。

```typescript
function email(): EmailValidator
```

**示例**：
```typescript
const schema = email().required();

const result = validate("alice@example.com", schema);
```

---

### url

创建 URL 验证器（继承自 StringValidator）。

```typescript
function url(): UrlValidator
```

**示例**：
```typescript
const schema = url().required();

const result = validate("https://example.com", schema);
```

---

### object

创建对象验证器。

```typescript
function object<T extends Record<string, unknown>>(
  schema: ObjectSchema<T>,
): ObjectValidator<T>
```

**ObjectSchema**：
```typescript
type ObjectSchema<T> = {
  [K in keyof T]: Validator<T[K]>;
};
```

**ObjectValidator 方法**：
- `required()` - 设置必填
- `optional()` - 设置可选
- `when(path: string, condition: WhenCondition)` - 条件验证
- `custom(validator: (value: T) => boolean | string)` - 自定义验证规则
- `transform(fn: (value: unknown) => T)` - 类型转换
- `message(rule: string, message: string)` - 自定义错误消息

**示例**：
```typescript
const schema = object({
  name: string().min(2).required(),
  age: number().min(18).required(),
  email: email().required(),
});

const result = validate({
  name: "Alice",
  age: 25,
  email: "alice@example.com",
}, schema);
```

---

### array

创建数组验证器。

```typescript
function array<T = unknown>(
  itemValidator: Validator<T>,
): ArrayValidator<T>
```

**ArrayValidator 方法**：
- `required()` - 设置必填
- `optional()` - 设置可选
- `min(length: number)` - 设置最小长度
- `max(length: number)` - 设置最大长度
- `custom(validator: (value: T[]) => boolean | string)` - 自定义验证规则
- `transform(fn: (value: unknown) => T[])` - 类型转换
- `message(rule: string, message: string)` - 自定义错误消息

**示例**：
```typescript
const schema = array(string()).min(1).required();

const result = validate(["item1", "item2"], schema);
```

---

### validateAsync

异步验证值。

```typescript
function validateAsync<T = unknown>(
  value: unknown,
  validator: Validator<T>,
): Promise<ValidationResult<T>>
```

**参数**：
- `value: unknown` - 要验证的值
- `validator: Validator<T>` - 验证器（必须支持异步验证）

**返回**：Promise，验证结果

**示例**：
```typescript
const result = await validateAsync(value, validator);
```

---

### validateAll

收集所有错误（不中断验证）。

```typescript
function validateAll<T = unknown>(
  value: unknown,
  validator: Validator<T>,
): ValidationResult<T>
```

**参数**：
- `value: unknown` - 要验证的值
- `validator: Validator<T>` - 验证器

**返回**：验证结果（包含所有错误）

**示例**：
```typescript
// 普通验证：遇到第一个错误就停止
const result1 = validate(value, schema);

// 收集所有错误：继续验证所有字段
const result2 = validateAll(value, schema);
```

---

## 🎯 使用场景

- **表单验证**：验证用户输入
- **API 数据验证**：验证 API 请求和响应数据
- **配置验证**：验证配置文件
- **数据转换**：验证并转换数据类型
- **条件验证**：根据其他字段值进行条件验证

---

## ⚡ 性能优化

- **短路验证**：遇到第一个错误时停止验证（`validate`）
- **完整验证**：收集所有错误（`validateAll`）
- **类型转换**：支持验证时自动转换类型

---

## 📝 备注

- **类型安全**：完整的 TypeScript 类型支持
- **纯函数**：所有验证器都是纯函数，无副作用
- **客户端兼容**：客户端版本通过 `jsr:@dreamer/utils/client/validator` 使用
- **错误消息**：支持自定义错误消息，支持国际化

---

## 🔗 相关链接

- [客户端版本](../client/validator.md)
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
