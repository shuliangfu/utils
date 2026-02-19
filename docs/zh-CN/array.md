# Array 数组操作

> 数组操作工具函数模块，提供数组去重、分组、分块、扁平化、集合操作、统计等功能

[![JSR](https://jsr.io/badges/@dreamer/utils)](https://jsr.io/@dreamer/utils)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)

---

## 🎯 功能

数组操作工具函数，提供常用的数组操作方法，支持服务端和客户端。

---

## ✨ 特性

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

- **运行时要求**：Deno 2.6+ 或 Bun 1.3.5
- **服务端**：✅ 支持
- **客户端**：✅ 支持（通过 `jsr:@dreamer/utils/client/array`）
- **依赖**：无外部依赖（纯 TypeScript 实现）

---

## 🚀 快速开始

```typescript
import {
  chunk,
  count,
  countBy,
  difference,
  flatten,
  flattenDeep,
  groupBy,
  intersection,
  union,
  unique,
  uniqueBy,
} from "jsr:@dreamer/utils/array";

// 数组去重
const arr = [1, 2, 2, 3, 3, 3];
const uniqueArr = unique(arr); // [1, 2, 3]

// 对象数组去重（按属性）
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 1, name: "Alice" },
];
const uniqueUsers = uniqueBy(users, "id"); // 按 id 去重

// 数组分组
const items = [
  { category: "fruit", name: "apple" },
  { category: "fruit", name: "banana" },
  { category: "vegetable", name: "carrot" },
];
const grouped = groupBy(items, "category");
// {
//   fruit: [{ category: "fruit", name: "apple" }, ...],
//   vegetable: [{ category: "vegetable", name: "carrot" }]
// }

// 数组分块
const chunked = chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]

// 数组扁平化
const nested = [1, [2, [3, 4]]];
const flattened = flatten(nested); // [1, 2, [3, 4]]
const flattenedDeep = flattenDeep(nested); // [1, 2, 3, 4]

// 数组差集
const arr1 = [1, 2, 3, 4];
const arr2 = [3, 4, 5, 6];
const diff = difference(arr1, arr2); // [1, 2]

// 数组交集
const inter = intersection(arr1, arr2); // [3, 4]

// 数组并集
const uni = union(arr1, arr2); // [1, 2, 3, 4, 5, 6]

// 数组统计
const counts = count([1, 2, 2, 3, 3, 3]); // { "1": 1, "2": 2, "3": 3 }

// 按属性统计
const countByCategory = countBy(items, "category");
// { fruit: 2, vegetable: 1 }
```

---

## 📚 API 文档

### unique

数组去重，去除重复元素。

```typescript
function unique<T>(arr: T[]): T[];
```

**参数**：

- `arr: T[]` - 要去重的数组

**返回**：去重后的数组

**示例**：

```typescript
const arr = [1, 2, 2, 3, 3, 3];
const uniqueArr = unique(arr); // [1, 2, 3]
```

---

### uniqueBy

按属性去重，去除指定属性值重复的对象。

```typescript
function uniqueBy<T extends Record<string, unknown>>(
  arr: T[],
  key: keyof T,
): T[];
```

**参数**：

- `arr: T[]` - 对象数组
- `key: keyof T` - 用于去重的属性键

**返回**：去重后的数组

**示例**：

```typescript
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 1, name: "Alice" },
];
const uniqueUsers = uniqueBy(users, "id");
// [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }]
```

---

### groupBy

数组分组，按指定键或函数将数组分组。

```typescript
function groupBy<T>(
  arr: T[],
  key: string | ((item: T) => string),
): Record<string, T[]>;
```

**参数**：

- `arr: T[]` - 要分组的数组
- `key: string | ((item: T) => string)` - 分组键（字符串或函数）

**返回**：分组后的对象，键为分组值，值为该组的数组

**示例**：

```typescript
const items = [
  { category: "fruit", name: "apple" },
  { category: "fruit", name: "banana" },
  { category: "vegetable", name: "carrot" },
];

// 按字符串键分组
const grouped = groupBy(items, "category");
// {
//   fruit: [{ category: "fruit", name: "apple" }, ...],
//   vegetable: [{ category: "vegetable", name: "carrot" }]
// }

// 按函数分组
const groupedByLength = groupBy(items, (item) => item.name.length.toString());
```

---

### chunk

数组分块，将数组分割成指定大小的块。

```typescript
function chunk<T>(arr: T[], size: number): T[][];
```

**参数**：

- `arr: T[]` - 要分块的数组
- `size: number` - 块大小

**返回**：分块后的二维数组

**示例**：

```typescript
const arr = [1, 2, 3, 4, 5];
const chunked = chunk(arr, 2); // [[1, 2], [3, 4], [5]]
```

---

### flatten

数组扁平化（一层），将嵌套数组扁平化一层。

```typescript
function flatten<T>(arr: (T | T[])[]): T[];
```

**参数**：

- `arr: (T | T[])[]` - 要扁平化的数组

**返回**：扁平化后的数组

**示例**：

```typescript
const nested = [1, [2, 3], [4, 5]];
const flattened = flatten(nested); // [1, 2, 3, 4, 5]
```

---

### flattenDeep

数组深度扁平化，递归扁平化所有层级。

```typescript
function flattenDeep<T>(arr: unknown[]): T[];
```

**参数**：

- `arr: unknown[]` - 要扁平化的数组

**返回**：完全扁平化后的数组

**示例**：

```typescript
const nested = [1, [2, [3, 4]]];
const flattened = flattenDeep(nested); // [1, 2, 3, 4]
```

---

### difference

数组差集，返回在第一个数组中但不在第二个数组中的元素。

```typescript
function difference<T>(arr1: T[], arr2: T[]): T[];
```

**参数**：

- `arr1: T[]` - 第一个数组
- `arr2: T[]` - 第二个数组

**返回**：差集数组

**示例**：

```typescript
const arr1 = [1, 2, 3, 4];
const arr2 = [3, 4, 5, 6];
const diff = difference(arr1, arr2); // [1, 2]
```

---

### intersection

数组交集，返回同时在两个数组中的元素。

```typescript
function intersection<T>(arr1: T[], arr2: T[]): T[];
```

**参数**：

- `arr1: T[]` - 第一个数组
- `arr2: T[]` - 第二个数组

**返回**：交集数组

**示例**：

```typescript
const arr1 = [1, 2, 3, 4];
const arr2 = [3, 4, 5, 6];
const inter = intersection(arr1, arr2); // [3, 4]
```

---

### union

数组并集，返回两个数组的所有唯一元素。

```typescript
function union<T>(arr1: T[], arr2: T[]): T[];
```

**参数**：

- `arr1: T[]` - 第一个数组
- `arr2: T[]` - 第二个数组

**返回**：并集数组

**示例**：

```typescript
const arr1 = [1, 2, 3];
const arr2 = [3, 4, 5];
const uni = union(arr1, arr2); // [1, 2, 3, 4, 5]
```

---

### count

数组统计，统计数组中每个元素出现的次数。

```typescript
function count<T>(arr: T[]): Record<string, number>;
```

**参数**：

- `arr: T[]` - 要统计的数组

**返回**：统计结果对象，键为元素值（字符串），值为出现次数

**示例**：

```typescript
const arr = [1, 2, 2, 3, 3, 3];
const counts = count(arr); // { "1": 1, "2": 2, "3": 3 }
```

---

### countBy

按属性统计，统计数组中每个属性值的出现次数。

```typescript
function countBy<T extends Record<string, unknown>>(
  arr: T[],
  key: keyof T,
): Record<string, number>;
```

**参数**：

- `arr: T[]` - 对象数组
- `key: keyof T` - 用于统计的属性键

**返回**：统计结果对象，键为属性值（字符串），值为出现次数

**示例**：

```typescript
const items = [
  { category: "fruit", name: "apple" },
  { category: "fruit", name: "banana" },
  { category: "vegetable", name: "carrot" },
];
const countByCategory = countBy(items, "category");
// { fruit: 2, vegetable: 1 }
```

---

## 🎯 使用场景

- **数据去重**：去除重复数据
- **数据分组**：按条件分组数据
- **数据分页**：将数组分块处理
- **数据扁平化**：处理嵌套数组
- **集合操作**：计算差集、交集、并集
- **数据统计**：统计元素出现次数

---

## ⚡ 性能优化

- **时间复杂度**：
  - `unique`: O(n)
  - `uniqueBy`: O(n)
  - `groupBy`: O(n)
  - `chunk`: O(n)
  - `flatten`: O(n)
  - `flattenDeep`: O(n)
  - `difference`: O(n*m)
  - `intersection`: O(n*m)
  - `union`: O(n+m)
  - `count`: O(n)
  - `countBy`: O(n)

- **空间复杂度**：大部分函数为 O(n)，`flattenDeep` 为 O(n)（递归栈）

---

## 📝 备注

- **类型安全**：完整的 TypeScript 类型支持
- **纯函数**：所有函数都是纯函数，无副作用
- **不可变**：所有函数都不会修改原数组
- **客户端兼容**：客户端版本通过 `jsr:@dreamer/utils/client/array` 使用

---

## 🔗 相关链接

- [客户端版本](../client/array.md)
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
