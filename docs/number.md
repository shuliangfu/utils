# Number 数字格式化

> 数字格式化工具函数模块，提供数字格式化、货币格式化、百分比格式化、范围限制、舍入等功能

[![JSR](https://jsr.io/badges/@dreamer/utils)](https://jsr.io/@dreamer/utils)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🎯 功能

数字格式化工具函数，提供常用的数字操作方法，支持服务端和客户端。

---

## ✨ 特性

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

- **运行时要求**：Deno 2.5+ 或 Bun 1.0+
- **服务端**：✅ 支持
- **客户端**：✅ 支持（通过 `jsr:@dreamer/utils/client/number`）
- **依赖**：无外部依赖（纯 TypeScript 实现）

---

## 🚀 快速开始

```typescript
import {
  format,
  formatCurrency,
  formatPercent,
  clamp,
  inRange,
  round,
  floor,
  ceil,
} from "jsr:@dreamer/utils/number";

// 数字格式化
const num = 1234567.89;
const formatted = format(num, "0,0.00"); // "1,234,567.89"

// 货币格式化
const currency = formatCurrency(num, "USD"); // "$1,234,567.89"
const currency2 = formatCurrency(num, "CNY"); // "¥1,234,567.89"

// 百分比格式化
const percent = formatPercent(0.1234); // "12.34%"

// 范围限制
const clamped = clamp(150, 0, 100); // 100
const inRange = inRange(50, 0, 100); // true

// 数字舍入
const rounded = round(3.7); // 4
const floored = floor(3.7); // 3
const ceiled = ceil(3.7); // 4
```

---

## 📚 API 文档

### format

数字格式化，将数字格式化为指定格式的字符串。

```typescript
function format(num: number, formatStr?: string): string
```

**参数**：
- `num: number` - 要格式化的数字
- `formatStr: string` - 格式字符串（默认 "0,0.00"）

**格式说明**：
- `0,0.00` - 千位分隔符，保留两位小数
- `0,0` - 千位分隔符，无小数
- `0.00` - 无千位分隔符，保留两位小数

**返回**：格式化后的字符串

**示例**：
```typescript
const num = 1234567.89;
format(num, "0,0.00"); // "1,234,567.89"
format(num, "0,0"); // "1,234,568"
format(num, "0.00"); // "1234567.89"
```

---

### formatCurrency

货币格式化，将数字格式化为货币格式。

```typescript
function formatCurrency(num: number, currency?: string): string
```

**参数**：
- `num: number` - 要格式化的数字
- `currency: string` - 货币代码（默认 "USD"）

**支持的货币**：
- `USD` - 美元 ($)
- `EUR` - 欧元 (€)
- `GBP` - 英镑 (£)
- `CNY` - 人民币 (¥)
- `JPY` - 日元 (¥)

**返回**：格式化后的货币字符串

**示例**：
```typescript
const num = 1234567.89;
formatCurrency(num, "USD"); // "$1,234,567.89"
formatCurrency(num, "CNY"); // "¥1,234,567.89"
formatCurrency(num, "EUR"); // "€1,234,567.89"
```

---

### formatPercent

百分比格式化，将小数转换为百分比字符串。

```typescript
function formatPercent(num: number): string
```

**参数**：
- `num: number` - 要格式化的数字（0-1 之间的小数）

**返回**：百分比字符串（如 "12.34%"）

**示例**：
```typescript
formatPercent(0.1234); // "12.34%"
formatPercent(0.5); // "50.00%"
formatPercent(1); // "100.00%"
```

---

### clamp

限制数字在指定范围内。

```typescript
function clamp(num: number, min: number, max: number): number
```

**参数**：
- `num: number` - 要限制的数字
- `min: number` - 最小值
- `max: number` - 最大值

**返回**：限制后的数字

**示例**：
```typescript
clamp(150, 0, 100); // 100
clamp(50, 0, 100); // 50
clamp(-10, 0, 100); // 0
```

---

### inRange

判断数字是否在指定范围内。

```typescript
function inRange(num: number, min: number, max: number): boolean
```

**参数**：
- `num: number` - 要判断的数字
- `min: number` - 最小值
- `max: number` - 最大值

**返回**：是否在范围内

**示例**：
```typescript
inRange(50, 0, 100); // true
inRange(150, 0, 100); // false
inRange(-10, 0, 100); // false
```

---

### round

四舍五入。

```typescript
const round: typeof Math.round
```

**参数**：
- `num: number` - 要舍入的数字

**返回**：四舍五入后的整数

**示例**：
```typescript
round(3.7); // 4
round(3.4); // 3
round(3.5); // 4
```

---

### floor

向下取整。

```typescript
const floor: typeof Math.floor
```

**参数**：
- `num: number` - 要取整的数字

**返回**：向下取整后的整数

**示例**：
```typescript
floor(3.7); // 3
floor(3.4); // 3
floor(-3.7); // -4
```

---

### ceil

向上取整。

```typescript
const ceil: typeof Math.ceil
```

**参数**：
- `num: number` - 要取整的数字

**返回**：向上取整后的整数

**示例**：
```typescript
ceil(3.7); // 4
ceil(3.4); // 4
ceil(-3.7); // -3
```

---

## 🎯 使用场景

- **数字格式化**：格式化显示数字
- **货币显示**：显示货币金额
- **百分比显示**：显示百分比
- **范围限制**：限制输入值在指定范围内
- **数字舍入**：对数字进行舍入处理

---

## ⚡ 性能优化

- **时间复杂度**：所有函数为 O(1)
- **空间复杂度**：所有函数为 O(1)

---

## 📝 备注

- **类型安全**：完整的 TypeScript 类型支持
- **纯函数**：所有函数都是纯函数，无副作用
- **不可变**：所有函数都不会修改原数字
- **客户端兼容**：客户端版本通过 `jsr:@dreamer/utils/client/number` 使用

---

## 🔗 相关链接

- [客户端版本](../client/number.md)
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
