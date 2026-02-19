# Date Utilities

> Date/time utility module providing formatting, arithmetic, comparison, diff,
> and relative time.

[![JSR](https://jsr.io/badges/@dreamer/utils)](https://jsr.io/@dreamer/utils)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)

---

## Overview

Date utility functions for common date operations. Supported in both server and
client environments.

---

## Features

- **Formatting**: Custom format string (`format`), e.g. YYYY, MM, DD, HH, mm, ss
- **Arithmetic**: `addDays`, `addMonths`, `addYears`
- **Comparison**: `isBefore`, `isAfter`, `isSame`
- **Diff**: `diffDays`, `diffHours`
- **Relative time**: `fromNow`, `toNow`

---

## Installation

```bash
deno add jsr:@dreamer/utils
```

---

## Environment compatibility

- **Runtime**: Deno 2.6+ or Bun 1.3.5+
- **Server**: ✅ Supported
- **Client**: ✅ Supported (via `jsr:@dreamer/utils/client/date`)
- **Dependencies**: None (pure TypeScript)

---

## Quick start

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

// Format
const date = new Date("2024-01-01");
const formatted = format(date, "YYYY-MM-DD"); // "2024-01-01"

// Arithmetic
const tomorrow = addDays(new Date(), 1);
const nextMonth = addMonths(new Date(), 1);
const nextYear = addYears(new Date(), 1);

// Comparison
const date1 = new Date("2024-01-01");
const date2 = new Date("2024-01-02");
const before = isBefore(date1, date2); // true
const after = isAfter(date2, date1); // true
const same = isSame(date1, date1); // true

// Diff
const days = diffDays(date1, date2); // 1
const hours = diffHours(date1, date2); // 24

// Relative time
const pastDate = new Date(Date.now() - 1000 * 60 * 5); // 5 minutes ago
const relative = fromNow(pastDate); // "5 minutes ago"
const futureDate = new Date(Date.now() + 1000 * 60 * 5);
const relative2 = toNow(futureDate); // "in 5 minutes"
```

---

## API Reference

### format

Format a date with the given format string.

```typescript
function format(date: Date, formatStr: string): string;
```

**Parameters**:

- `date: Date` - Date instance
- `formatStr: string` - Format (YYYY, MM, DD, HH, mm, ss)

**Returns**: Formatted string

**Format tokens**:

- `YYYY` - 4-digit year
- `MM` - 2-digit month (zero-padded)
- `DD` - 2-digit day (zero-padded)
- `HH` - 2-digit hour (zero-padded)
- `mm` - 2-digit minute (zero-padded)
- `ss` - 2-digit second (zero-padded)

**Example**:

```typescript
const date = new Date("2024-01-01T12:30:45");
format(date, "YYYY-MM-DD"); // "2024-01-01"
format(date, "YYYY-MM-DD HH:mm:ss"); // "2024-01-01 12:30:45"
```

---

### addDays

Add days to a date.

```typescript
function addDays(date: Date, days: number): Date;
```

**Parameters**:

- `date: Date` - Date
- `days: number` - Days to add (can be negative)

**Returns**: New Date

**Example**:

```typescript
const date = new Date("2024-01-01");
const tomorrow = addDays(date, 1); // 2024-01-02
const yesterday = addDays(date, -1); // 2023-12-31
```

---

### addMonths

Add months to a date.

```typescript
function addMonths(date: Date, months: number): Date;
```

**Parameters**:

- `date: Date` - Date
- `months: number` - Months to add (can be negative)

**Returns**: New Date

**Example**:

```typescript
const date = new Date("2024-01-01");
const nextMonth = addMonths(date, 1); // 2024-02-01
const lastMonth = addMonths(date, -1); // 2023-12-01
```

---

### addYears

Add years to a date.

```typescript
function addYears(date: Date, years: number): Date;
```

**Parameters**:

- `date: Date` - Date
- `years: number` - Years to add (can be negative)

**Returns**: New Date

**Example**:

```typescript
const date = new Date("2024-01-01");
const nextYear = addYears(date, 1); // 2025-01-01
const lastYear = addYears(date, -1); // 2023-01-01
```

---

### isBefore

Whether the first date is before the second.

```typescript
function isBefore(date1: Date, date2: Date): boolean;
```

**Parameters**:

- `date1: Date` - First date
- `date2: Date` - Second date

**Returns**: true if date1 < date2

**Example**:

```typescript
const date1 = new Date("2024-01-01");
const date2 = new Date("2024-01-02");
const before = isBefore(date1, date2); // true
```

---

### isAfter

Whether the first date is after the second.

```typescript
function isAfter(date1: Date, date2: Date): boolean;
```

**Parameters**:

- `date1: Date` - First date
- `date2: Date` - Second date

**Returns**: true if date1 > date2

**Example**:

```typescript
const date1 = new Date("2024-01-02");
const date2 = new Date("2024-01-01");
const after = isAfter(date1, date2); // true
```

---

### isSame

Whether two dates are the same.

```typescript
function isSame(date1: Date, date2: Date): boolean;
```

**Parameters**:

- `date1: Date` - First date
- `date2: Date` - Second date

**Returns**: Whether they are equal

**Example**:

```typescript
const date1 = new Date("2024-01-01");
const date2 = new Date("2024-01-01");
const same = isSame(date1, date2); // true
```

---

### diffDays

Difference in days (date2 - date1).

```typescript
function diffDays(date1: Date, date2: Date): number;
```

**Parameters**:

- `date1: Date` - First date
- `date2: Date` - Second date

**Returns**: Number of days

**Example**:

```typescript
const date1 = new Date("2024-01-01");
const date2 = new Date("2024-01-02");
const days = diffDays(date1, date2); // 1
```

---

### diffHours

Difference in hours (date2 - date1).

```typescript
function diffHours(date1: Date, date2: Date): number;
```

**Parameters**:

- `date1: Date` - First date
- `date2: Date` - Second date

**Returns**: Number of hours

**Example**:

```typescript
const date1 = new Date("2024-01-01T00:00:00");
const date2 = new Date("2024-01-01T12:00:00");
const hours = diffHours(date1, date2); // 12
```

---

### fromNow

Relative time from the given date to now (e.g. "5 minutes ago").

```typescript
function fromNow(date: Date): string;
```

**Parameters**:

- `date: Date` - Date

**Returns**: Relative time string

**Example**:

```typescript
const pastDate = new Date(Date.now() - 1000 * 60 * 5);
const relative = fromNow(pastDate); // "5 minutes ago"
```

---

### toNow

Relative time from now to the given date (e.g. "in 5 minutes").

```typescript
function toNow(date: Date): string;
```

**Parameters**:

- `date: Date` - Date

**Returns**: Relative time string

**Example**:

```typescript
const futureDate = new Date(Date.now() + 1000 * 60 * 5);
const relative = toNow(futureDate); // "in 5 minutes"
```

---

## Use cases

- **Formatting**: Display dates in a given format
- **Arithmetic**: Compute future or past dates
- **Comparison**: Order and equality
- **Diff**: Time spans
- **Relative time**: "5 minutes ago", "in 2 hours"

---

## Performance

- **Time complexity**: O(1)
- **Space complexity**: O(1)

---

## Notes

- **Type-safe**: Full TypeScript support
- **Pure**: No mutation of input dates
- **Client**: Use `jsr:@dreamer/utils/client/date` in the browser

---

## See also

- [Client module](client/date.md)
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
