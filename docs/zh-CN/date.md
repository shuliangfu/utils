# Date 日期时间处理

> 日期时间处理工具函数模块，提供日期格式化、计算、比较、差值计算、相对时间等功能

[![JSR](https://jsr.io/badges/@dreamer/utils)](https://jsr.io/@dreamer/utils)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)

---

## 🎯 功能

日期时间处理工具函数，提供常用的日期操作方法，支持服务端和客户端。

---

## ✨ 特性

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
- **客户端**：✅ 支持（通过 `jsr:@dreamer/utils/client/date`）
- **依赖**：无外部依赖（纯 TypeScript 实现）

---

## 🚀 快速开始

```typescript
import {
  addDays,
  addMonths,
  addYears,
  diffDays,
  diffHours,
  format,
  fromNow,
  isAfter,
  isBefore,
  isSame,
  toNow,
} from "jsr:@dreamer/utils/date";

// 日期格式化
const date = new Date("2024-01-01");
const formatted = format(date, "YYYY-MM-DD"); // "2024-01-01"
const formatted2 = format(date, "YYYY年MM月DD日"); // "2024年01月01日"

// 日期计算
const tomorrow = addDays(new Date(), 1);
const nextMonth = addMonths(new Date(), 1);
const nextYear = addYears(new Date(), 1);

// 日期比较
const date1 = new Date("2024-01-01");
const date2 = new Date("2024-01-02");
const before = isBefore(date1, date2); // true
const after = isAfter(date2, date1); // true
const same = isSame(date1, date1); // true

// 日期差值
const days = diffDays(date1, date2); // 1
const hours = diffHours(date1, date2); // 24

// 相对时间
const pastDate = new Date(Date.now() - 1000 * 60 * 5); // 5分钟前
const relative = fromNow(pastDate); // "5 分钟前"
const futureDate = new Date(Date.now() + 1000 * 60 * 5); // 5分钟后
const relative2 = toNow(futureDate); // "5 分钟后"
```

---

## 📚 API 文档

### format

日期格式化，将日期格式化为指定格式的字符串。

```typescript
function format(date: Date, formatStr: string): string;
```

**参数**：

- `date: Date` - 日期对象
- `formatStr: string` - 格式字符串（支持 YYYY、MM、DD、HH、mm、ss）

**返回**：格式化后的字符串

**格式说明**：

- `YYYY` - 年份（4位）
- `MM` - 月份（2位，补零）
- `DD` - 日期（2位，补零）
- `HH` - 小时（2位，补零）
- `mm` - 分钟（2位，补零）
- `ss` - 秒（2位，补零）

**示例**：

```typescript
const date = new Date("2024-01-01T12:30:45");
format(date, "YYYY-MM-DD"); // "2024-01-01"
format(date, "YYYY-MM-DD HH:mm:ss"); // "2024-01-01 12:30:45"
format(date, "YYYY年MM月DD日"); // "2024年01月01日"
```

---

### addDays

添加天数到日期。

```typescript
function addDays(date: Date, days: number): Date;
```

**参数**：

- `date: Date` - 日期对象
- `days: number` - 要添加的天数（可为负数）

**返回**：新的日期对象

**示例**：

```typescript
const date = new Date("2024-01-01");
const tomorrow = addDays(date, 1); // 2024-01-02
const yesterday = addDays(date, -1); // 2023-12-31
```

---

### addMonths

添加月数到日期。

```typescript
function addMonths(date: Date, months: number): Date;
```

**参数**：

- `date: Date` - 日期对象
- `months: number` - 要添加的月数（可为负数）

**返回**：新的日期对象

**示例**：

```typescript
const date = new Date("2024-01-01");
const nextMonth = addMonths(date, 1); // 2024-02-01
const lastMonth = addMonths(date, -1); // 2023-12-01
```

---

### addYears

添加年数到日期。

```typescript
function addYears(date: Date, years: number): Date;
```

**参数**：

- `date: Date` - 日期对象
- `years: number` - 要添加的年数（可为负数）

**返回**：新的日期对象

**示例**：

```typescript
const date = new Date("2024-01-01");
const nextYear = addYears(date, 1); // 2025-01-01
const lastYear = addYears(date, -1); // 2023-01-01
```

---

### isBefore

判断日期是否在另一个日期之前。

```typescript
function isBefore(date1: Date, date2: Date): boolean;
```

**参数**：

- `date1: Date` - 第一个日期
- `date2: Date` - 第二个日期

**返回**：date1 是否在 date2 之前

**示例**：

```typescript
const date1 = new Date("2024-01-01");
const date2 = new Date("2024-01-02");
const before = isBefore(date1, date2); // true
```

---

### isAfter

判断日期是否在另一个日期之后。

```typescript
function isAfter(date1: Date, date2: Date): boolean;
```

**参数**：

- `date1: Date` - 第一个日期
- `date2: Date` - 第二个日期

**返回**：date1 是否在 date2 之后

**示例**：

```typescript
const date1 = new Date("2024-01-02");
const date2 = new Date("2024-01-01");
const after = isAfter(date1, date2); // true
```

---

### isSame

判断两个日期是否相同。

```typescript
function isSame(date1: Date, date2: Date): boolean;
```

**参数**：

- `date1: Date` - 第一个日期
- `date2: Date` - 第二个日期

**返回**：两个日期是否相同

**示例**：

```typescript
const date1 = new Date("2024-01-01");
const date2 = new Date("2024-01-01");
const same = isSame(date1, date2); // true
```

---

### diffDays

计算两个日期之间的天数差值。

```typescript
function diffDays(date1: Date, date2: Date): number;
```

**参数**：

- `date1: Date` - 第一个日期
- `date2: Date` - 第二个日期

**返回**：天数差值（date2 - date1）

**示例**：

```typescript
const date1 = new Date("2024-01-01");
const date2 = new Date("2024-01-02");
const days = diffDays(date1, date2); // 1
```

---

### diffHours

计算两个日期之间的小时数差值。

```typescript
function diffHours(date1: Date, date2: Date): number;
```

**参数**：

- `date1: Date` - 第一个日期
- `date2: Date` - 第二个日期

**返回**：小时数差值（date2 - date1）

**示例**：

```typescript
const date1 = new Date("2024-01-01T00:00:00");
const date2 = new Date("2024-01-01T12:00:00");
const hours = diffHours(date1, date2); // 12
```

---

### fromNow

计算从指定时间到现在的相对时间。

```typescript
function fromNow(date: Date): string;
```

**参数**：

- `date: Date` - 日期对象

**返回**：相对时间字符串（如 "5 分钟前"）

**示例**：

```typescript
const pastDate = new Date(Date.now() - 1000 * 60 * 5); // 5分钟前
const relative = fromNow(pastDate); // "5 分钟前"
```

---

### toNow

计算从现在到指定时间的相对时间。

```typescript
function toNow(date: Date): string;
```

**参数**：

- `date: Date` - 日期对象

**返回**：相对时间字符串（如 "5 分钟后"）

**示例**：

```typescript
const futureDate = new Date(Date.now() + 1000 * 60 * 5); // 5分钟后
const relative = toNow(futureDate); // "5 分钟后"
```

---

## 🎯 使用场景

- **日期格式化**：将日期格式化为指定格式
- **日期计算**：计算未来或过去的日期
- **日期比较**：判断日期的先后关系
- **日期差值**：计算两个日期之间的差值
- **相对时间**：显示相对时间（如 "5 分钟前"）

---

## ⚡ 性能优化

- **时间复杂度**：所有函数为 O(1)
- **空间复杂度**：所有函数为 O(1)

---

## 📝 备注

- **类型安全**：完整的 TypeScript 类型支持
- **纯函数**：所有函数都是纯函数，无副作用
- **不可变**：所有函数都不会修改原日期对象
- **客户端兼容**：客户端版本通过 `jsr:@dreamer/utils/client/date` 使用

---

## 🔗 相关链接

- [客户端版本](../client/date.md)
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
