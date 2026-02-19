# Object 对象操作

> 对象操作工具函数模块，提供对象克隆、合并、路径访问、过滤、比较等功能

[![JSR](https://jsr.io/badges/@dreamer/utils)](https://jsr.io/@dreamer/utils)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)

---

## 🎯 功能

对象操作工具函数，提供常用的对象操作方法，支持服务端和客户端。

---

## ✨ 特性

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
- **客户端**：✅ 支持（通过 `jsr:@dreamer/utils/client/object`）
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
} from "jsr:@dreamer/utils/object";

// 深度克隆
const obj = { a: 1, b: { c: 2 } };
const cloned = deepClone(obj); // 完全独立的副本

// 对象合并
const obj1 = { a: 1, b: { c: 2 } };
const obj2 = { b: { d: 3 }, e: 4 };
const merged = merge(obj1, obj2); // { a: 1, b: { d: 3 }, e: 4 }
const deepMerged = deepMerge(obj1, obj2); // { a: 1, b: { c: 2, d: 3 }, e: 4 }

// 路径访问
const data = { user: { name: "Alice", age: 25 } };
const name = get(data, "user.name"); // "Alice"
set(data, "user.age", 26); // 设置值
const hasName = has(data, "user.name"); // true
deletePath(data, "user.age"); // 删除路径

// 对象过滤
const user = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  password: "***",
};
const picked = pick(user, ["id", "name", "email"]); // 只保留指定字段
const omitted = omit(user, ["password"]); // 排除指定字段

// 对象比较
const obj1 = { a: 1, b: { c: 2 } };
const obj2 = { a: 1, b: { c: 2 } };
const equal = isEqual(obj1, obj2); // true
const deepEqual = isDeepEqual(obj1, obj2); // true（深度比较）
```

---

## 📚 API 文档

### deepClone

深度克隆对象，创建完全独立的副本。

```typescript
function deepClone<T>(obj: T): T;
```

**参数**：

- `obj: T` - 要克隆的对象

**返回**：克隆后的对象

**示例**：

```typescript
const obj = { a: 1, b: { c: 2 } };
const cloned = deepClone(obj);
cloned.b.c = 3;
console.log(obj.b.c); // 2（原对象未改变）
```

---

### merge

对象合并（浅合并），将源对象的属性合并到目标对象。

```typescript
function merge<T extends Record<string, unknown>>(
  target: T,
  ...sources: Partial<T>[]
): T;
```

**参数**：

- `target: T` - 目标对象
- `...sources: Partial<T>[]` - 源对象（可多个）

**返回**：合并后的对象

**示例**：

```typescript
const obj1 = { a: 1, b: { c: 2 } };
const obj2 = { b: { d: 3 }, e: 4 };
const merged = merge(obj1, obj2); // { a: 1, b: { d: 3 }, e: 4 }
```

---

### deepMerge

深度合并对象，递归合并嵌套对象。

```typescript
function deepMerge<T extends Record<string, unknown>>(
  target: T,
  ...sources: Partial<T>[]
): T;
```

**参数**：

- `target: T` - 目标对象
- `...sources: Partial<T>[]` - 源对象（可多个）

**返回**：深度合并后的对象

**示例**：

```typescript
const obj1 = { a: 1, b: { c: 2 } };
const obj2 = { b: { d: 3 }, e: 4 };
const deepMerged = deepMerge(obj1, obj2); // { a: 1, b: { c: 2, d: 3 }, e: 4 }
```

---

### get

获取对象路径值，支持嵌套路径访问。

```typescript
function get<T = unknown>(
  obj: Record<string, unknown>,
  path: string,
  defaultValue?: T,
): T | undefined;
```

**参数**：

- `obj: Record<string, unknown>` - 对象
- `path: string` - 路径（如 "user.name"）
- `defaultValue?: T` - 默认值（可选）

**返回**：路径值或默认值

**示例**：

```typescript
const data = { user: { name: "Alice", age: 25 } };
const name = get(data, "user.name"); // "Alice"
const email = get(data, "user.email", "unknown"); // "unknown"
```

---

### set

设置对象路径值，支持嵌套路径设置。

```typescript
function set(
  obj: Record<string, unknown>,
  path: string,
  value: unknown,
): void;
```

**参数**：

- `obj: Record<string, unknown>` - 对象
- `path: string` - 路径（如 "user.name"）
- `value: unknown` - 值

**返回**：无（直接修改原对象）

**示例**：

```typescript
const data = { user: { name: "Alice" } };
set(data, "user.age", 25);
console.log(data.user.age); // 25
```

---

### has

检查对象路径是否存在。

```typescript
function has(obj: Record<string, unknown>, path: string): boolean;
```

**参数**：

- `obj: Record<string, unknown>` - 对象
- `path: string` - 路径（如 "user.name"）

**返回**：路径是否存在

**示例**：

```typescript
const data = { user: { name: "Alice" } };
const hasName = has(data, "user.name"); // true
const hasEmail = has(data, "user.email"); // false
```

---

### deletePath

删除对象路径值。

```typescript
function deletePath(
  obj: Record<string, unknown>,
  path: string,
): boolean;
```

**参数**：

- `obj: Record<string, unknown>` - 对象
- `path: string` - 路径（如 "user.name"）

**返回**：是否删除成功

**示例**：

```typescript
const data = { user: { name: "Alice", age: 25 } };
deletePath(data, "user.age");
console.log(data.user.age); // undefined
```

---

### pick

选择对象中的指定属性，返回新对象。

```typescript
function pick<T extends Record<string, unknown>>(
  obj: T,
  keys: (keyof T)[],
): Partial<T>;
```

**参数**：

- `obj: T` - 对象
- `keys: (keyof T)[]` - 要选择的属性键数组

**返回**：包含指定属性的新对象

**示例**：

```typescript
const user = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  password: "***",
};
const picked = pick(user, ["id", "name", "email"]);
// { id: 1, name: "Alice", email: "alice@example.com" }
```

---

### omit

排除对象中的指定属性，返回新对象。

```typescript
function omit<T extends Record<string, unknown>>(
  obj: T,
  keys: (keyof T)[],
): Partial<T>;
```

**参数**：

- `obj: T` - 对象
- `keys: (keyof T)[]` - 要排除的属性键数组

**返回**：排除指定属性后的新对象

**示例**：

```typescript
const user = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  password: "***",
};
const omitted = omit(user, ["password"]);
// { id: 1, name: "Alice", email: "alice@example.com" }
```

---

### isEqual

浅比较两个对象是否相等。

```typescript
function isEqual(obj1: unknown, obj2: unknown): boolean;
```

**参数**：

- `obj1: unknown` - 第一个对象
- `obj2: unknown` - 第二个对象

**返回**：是否相等

**示例**：

```typescript
const obj1 = { a: 1, b: 2 };
const obj2 = { a: 1, b: 2 };
const equal = isEqual(obj1, obj2); // true
```

---

### isDeepEqual

深度比较两个对象是否相等。

```typescript
function isDeepEqual(obj1: unknown, obj2: unknown): boolean;
```

**参数**：

- `obj1: unknown` - 第一个对象
- `obj2: unknown` - 第二个对象

**返回**：是否深度相等

**示例**：

```typescript
const obj1 = { a: 1, b: { c: 2 } };
const obj2 = { a: 1, b: { c: 2 } };
const deepEqual = isDeepEqual(obj1, obj2); // true
```

---

## 🎯 使用场景

- **对象克隆**：创建对象副本，避免引用问题
- **配置合并**：合并多个配置对象
- **数据访问**：安全访问嵌套对象属性
- **数据过滤**：选择或排除对象属性
- **数据比较**：比较对象是否相等

---

## ⚡ 性能优化

- **时间复杂度**：
  - `deepClone`: O(n)
  - `merge`: O(n)
  - `deepMerge`: O(n)
  - `get`: O(m)（m 为路径深度）
  - `set`: O(m)
  - `has`: O(m)
  - `deletePath`: O(m)
  - `pick`: O(k)（k 为键数量）
  - `omit`: O(n)
  - `isEqual`: O(n)
  - `isDeepEqual`: O(n)

---

## 📝 备注

- **类型安全**：完整的 TypeScript 类型支持
- **纯函数**：大部分函数是纯函数，`set` 和 `deletePath` 会修改原对象
- **深度克隆**：`deepClone` 支持 Date、Array 等特殊对象
- **客户端兼容**：客户端版本通过 `jsr:@dreamer/utils/client/object` 使用

---

## 🔗 相关链接

- [客户端版本](../client/object.md)
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
