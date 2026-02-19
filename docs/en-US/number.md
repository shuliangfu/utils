# Number Utilities

> Number utility module providing formatting, currency, percent, range, and
> rounding.

[![JSR](https://jsr.io/badges/@dreamer/utils)](https://jsr.io/@dreamer/utils)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)

---

## Overview

Number utility functions for formatting and numeric operations. Supported in
both server and client environments.

---

## Features

- **Formatting**: Custom format string (`format`), thousands separator
- **Currency**: `formatCurrency` (USD, EUR, GBP, CNY, JPY, etc.)
- **Percent**: `formatPercent` (decimal to percent string)
- **Range**: `clamp`, `inRange`
- **Rounding**: `round`, `floor`, `ceil`

---

## Installation

```bash
deno add jsr:@dreamer/utils
```

---

## Environment compatibility

- **Runtime**: Deno 2.6+ or Bun 1.3.5+
- **Server**: ✅ Supported
- **Client**: ✅ Supported (via `jsr:@dreamer/utils/client/number`)
- **Dependencies**: None (pure TypeScript)

---

## Quick start

```typescript
import {
  ceil,
  clamp,
  floor,
  format,
  formatCurrency,
  formatPercent,
  inRange,
  round,
} from "jsr:@dreamer/utils/number";

// Format
const num = 1234567.89;
const formatted = format(num, "0,0.00"); // "1,234,567.89"

// Currency
const currency = formatCurrency(num, "USD"); // "$1,234,567.89"
const currency2 = formatCurrency(num, "CNY"); // "¥1,234,567.89"

// Percent
const percent = formatPercent(0.1234); // "12.34%"

// Range
const clamped = clamp(150, 0, 100); // 100
const inRangeResult = inRange(50, 0, 100); // true

// Rounding
const rounded = round(3.7); // 4
const floored = floor(3.7); // 3
const ceiled = ceil(3.7); // 4
```

---

## API Reference

### format

Format number with optional format string.

```typescript
function format(num: number, formatStr?: string): string;
```

**Parameters**:

- `num: number` - Number to format
- `formatStr: string` - Format (default `"0,0.00"`)

**Format**:

- `0,0.00` - Thousands separator, 2 decimals
- `0,0` - Thousands separator, no decimals
- `0.00` - No thousands, 2 decimals

**Returns**: Formatted string

**Example**:

```typescript
const num = 1234567.89;
format(num, "0,0.00"); // "1,234,567.89"
format(num, "0,0"); // "1,234,568"
format(num, "0.00"); // "1234567.89"
```

---

### formatCurrency

Format number as currency.

```typescript
function formatCurrency(num: number, currency?: string): string;
```

**Parameters**:

- `num: number` - Number to format
- `currency: string` - Currency code (default `"USD"`)

**Supported**: USD ($), EUR (€), GBP (£), CNY (¥), JPY (¥)

**Returns**: Formatted currency string

**Example**:

```typescript
const num = 1234567.89;
formatCurrency(num, "USD"); // "$1,234,567.89"
formatCurrency(num, "CNY"); // "¥1,234,567.89"
formatCurrency(num, "EUR"); // "€1,234,567.89"
```

---

### formatPercent

Convert decimal to percent string.

```typescript
function formatPercent(num: number): string;
```

**Parameters**:

- `num: number` - Decimal (0–1)

**Returns**: Percent string (e.g. `"12.34%"`)

**Example**:

```typescript
formatPercent(0.1234); // "12.34%"
formatPercent(0.5); // "50.00%"
formatPercent(1); // "100.00%"
```

---

### clamp

Clamp number to [min, max].

```typescript
function clamp(num: number, min: number, max: number): number;
```

**Parameters**:

- `num: number` - Value
- `min: number` - Minimum
- `max: number` - Maximum

**Returns**: Clamped number

**Example**:

```typescript
clamp(150, 0, 100); // 100
clamp(50, 0, 100); // 50
clamp(-10, 0, 100); // 0
```

---

### inRange

Whether number is in [min, max].

```typescript
function inRange(num: number, min: number, max: number): boolean;
```

**Parameters**:

- `num: number` - Value
- `min: number` - Minimum
- `max: number` - Maximum

**Returns**: true if min <= num <= max

**Example**:

```typescript
inRange(50, 0, 100); // true
inRange(150, 0, 100); // false
inRange(-10, 0, 100); // false
```

---

### round

Round to nearest integer.

```typescript
const round: typeof Math.round;
```

**Parameters**:

- `num: number` - Number to round

**Returns**: Rounded integer

**Example**:

```typescript
round(3.7); // 4
round(3.4); // 3
round(3.5); // 4
```

---

### floor

Round down.

```typescript
const floor: typeof Math.floor;
```

**Parameters**:

- `num: number` - Number

**Returns**: Floored integer

**Example**:

```typescript
floor(3.7); // 3
floor(3.4); // 3
floor(-3.7); // -4
```

---

### ceil

Round up.

```typescript
const ceil: typeof Math.ceil;
```

**Parameters**:

- `num: number` - Number

**Returns**: Ceiled integer

**Example**:

```typescript
ceil(3.7); // 4
ceil(3.4); // 4
ceil(-3.7); // -3
```

---

## Use cases

- **Display**: Formatted numbers
- **Currency**: Amounts
- **Percent**: Ratios and progress
- **Validation**: Clamp user input
- **Rounding**: Integer or fixed precision

---

## Performance

- **Time complexity**: O(1)
- **Space complexity**: O(1)

---

## Notes

- **Type-safe**: Full TypeScript support
- **Pure**: No side effects
- **Client**: Use `jsr:@dreamer/utils/client/number` in the browser

---

## See also

- [Client module](client/number.md)
- [JSR package](https://jsr.io/@dreamer/utils)

---

## Contributing

Issues and Pull Requests are welcome.

---

## License

Apache License 2.0 — see [LICENSE](../../LICENSE)

---

<div align="center">

**Made with ❤️ by Dreamer Team**

</div>
