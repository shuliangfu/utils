# Format Utilities

> Format utility module for bytes, duration, number, and percent formatting.

[![JSR](https://jsr.io/badges/@dreamer/utils)](https://jsr.io/@dreamer/utils)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)

---

## Overview

Format utility functions for bytes, duration, number, and percent. Supported in
both server and client environments.

---

## Features

- **Bytes**: `formatBytes` — auto unit (B/KB/MB/GB/TB), optional precision and
  fixed unit
- **Duration**: `formatDuration` — human-readable or HH:mm:ss
- **Number**: `formatNumber` — thousands separator, configurable precision and
  separator
- **Percent**: `formatPercent` — decimal to percent string, optional precision

---

## Installation

```bash
deno add jsr:@dreamer/utils
```

---

## Environment compatibility

- **Runtime**: Deno 2.6+ or Bun 1.3.5+
- **Server**: ✅ Supported
- **Client**: ✅ Supported (via `jsr:@dreamer/utils/client/format`)
- **Dependencies**: None (pure TypeScript)

---

## Quick start

```typescript
import {
  formatBytes,
  formatDuration,
  formatNumber,
  formatPercent,
} from "jsr:@dreamer/utils/format";

// Bytes
const size = formatBytes(1024 * 1024 * 5); // "5 MB"
const size2 = formatBytes(1024 * 1024 * 5, { precision: 2 }); // "5.00 MB"
const size3 = formatBytes(1024 * 1024 * 5, { unit: "KB" }); // "5120.00 KB"

// Duration
const duration = formatDuration(3661); // "1 hour 1 minute 1 second"
const duration2 = formatDuration(3661, { format: "HH:mm:ss" }); // "01:01:01"

// Number
const num = formatNumber(1234567.89); // "1,234,567.89"
const num2 = formatNumber(1234567.89, { precision: 0 }); // "1,234,568"
const num3 = formatNumber(1234567.89, { separator: "." }); // "1.234.567.89"

// Percent
const percent = formatPercent(0.1234); // "12.34%"
const percent2 = formatPercent(0.1234, 1); // "12.3%"
```

---

## API Reference

### formatBytes

Format byte count to human-readable string.

```typescript
function formatBytes(
  bytes: number,
  options?: { precision?: number; unit?: "B" | "KB" | "MB" | "GB" | "TB" },
): string;
```

**Parameters**:

- `bytes: number` - Byte count
- `options.precision` - Decimal places (default 0)
- `options.unit` - Force unit (optional; otherwise auto)

**Returns**: Formatted string

**Example**:

```typescript
formatBytes(1024); // "1 KB"
formatBytes(1024 * 1024); // "1 MB"
formatBytes(1024 * 1024 * 5, { precision: 2 }); // "5.00 MB"
formatBytes(1024 * 1024 * 5, { unit: "KB" }); // "5120.00 KB"
```

---

### formatDuration

Format seconds as human-readable or HH:mm:ss.

```typescript
function formatDuration(
  seconds: number,
  options?: { format?: "human" | "HH:mm:ss" },
): string;
```

**Parameters**:

- `seconds: number` - Seconds
- `options.format` - `"human"` (default) or `"HH:mm:ss"`

**Returns**: Formatted string

**Example**:

```typescript
formatDuration(3661); // "1 hour 1 minute 1 second"
formatDuration(3661, { format: "HH:mm:ss" }); // "01:01:01"
formatDuration(60); // "1 minute"
formatDuration(30); // "30 seconds"
```

---

### formatNumber

Format number with thousands separator.

```typescript
function formatNumber(
  num: number,
  options?: { precision?: number; separator?: string },
): string;
```

**Parameters**:

- `num: number` - Number to format
- `options.precision` - Decimal places (default 2)
- `options.separator` - Thousands separator (default `","`)

**Returns**: Formatted string

**Example**:

```typescript
formatNumber(1234567.89); // "1,234,567.89"
formatNumber(1234567.89, { precision: 0 }); // "1,234,568"
formatNumber(1234567.89, { separator: "." }); // "1.234.567.89"
```

---

### formatPercent

Format decimal as percent string.

```typescript
function formatPercent(num: number, precision?: number): string;
```

**Parameters**:

- `num: number` - Decimal (0–1)
- `precision` - Decimal places (default 2)

**Returns**: Percent string (e.g. `"12.34%"`)

**Example**:

```typescript
formatPercent(0.1234); // "12.34%"
formatPercent(0.1234, 1); // "12.3%"
formatPercent(0.5); // "50.00%"
formatPercent(1); // "100.00%"
```

---

## Use cases

- **File size**: Display file or download size
- **Duration**: Video length, processing time
- **Numbers**: Large number readability
- **Percent**: Progress, ratios

---

## Performance

- **Time complexity**: O(1)
- **Space complexity**: O(1)

---

## Notes

- **Type-safe**: Full TypeScript support
- **Pure**: No side effects
- **Client**: Use `jsr:@dreamer/utils/client/format` in the browser

---

## See also

- [Client module](client/format.md)
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
