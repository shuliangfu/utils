# String Utilities

> String utility module providing truncation, formatting, case conversion,
> padding, and trimming.

[![JSR](https://jsr.io/badges/@dreamer/utils)](https://jsr.io/@dreamer/utils)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)

---

## Overview

String utility functions for common string operations. Supported in both server
and client environments.

---

## Features

- **Truncation**:
  - Truncate with optional suffix (`truncate`)
- **Formatting**:
  - Placeholder substitution (`format`)
- **Case conversion**:
  - camelCase, snake_case, kebab-case, PascalCase
- **Padding**:
  - `padStart`, `padEnd`
- **Trimming**:
  - `trim`, `trimStart`, `trimEnd`

---

## Installation

```bash
deno add jsr:@dreamer/utils
```

---

## Environment compatibility

- **Runtime**: Deno 2.6+ or Bun 1.3.5+
- **Server**: ✅ Supported
- **Client**: ✅ Supported (via `jsr:@dreamer/utils/client/string`)
- **Dependencies**: None (pure TypeScript)

---

## Quick start

```typescript
import {
  camelCase,
  format,
  kebabCase,
  padEnd,
  padStart,
  pascalCase,
  snakeCase,
  trim,
  trimEnd,
  trimStart,
  truncate,
} from "jsr:@dreamer/utils/string";

// Truncation
const text = "This is a very long text";
const truncated = truncate(text, 10); // "This is a ..."
const truncated2 = truncate(text, 10, "..."); // custom suffix

// Formatting
const formatted = format("Hello, {name}!", { name: "Alice" }); // "Hello, Alice!"

// Case conversion
const camel = camelCase("hello_world"); // "helloWorld"
const snake = snakeCase("helloWorld"); // "hello_world"
const kebab = kebabCase("helloWorld"); // "hello-world"
const pascal = pascalCase("hello_world"); // "HelloWorld"

// Padding
const padded = padStart("5", 3, "0"); // "005"
const padded2 = padEnd("5", 3, "0"); // "500"

// Trimming
const cleaned = trim("  hello world  "); // "hello world"
const cleaned2 = trimStart("  hello world  "); // "hello world  "
const cleaned3 = trimEnd("  hello world  "); // "  hello world"
```

---

## API Reference

### truncate

Truncate string to a maximum length and append suffix when truncated.

```typescript
function truncate(str: string, length: number, suffix?: string): string;
```

**Parameters**:

- `str: string` - String to truncate
- `length: number` - Maximum length
- `suffix: string` - Suffix when truncated (default `"..."`)

**Returns**: Truncated string

**Example**:

```typescript
const text = "This is a very long text";
const truncated = truncate(text, 10); // "This is a ..."
```

---

### format

Replace placeholders in a template with values from an object.

```typescript
function format(template: string, data: Record<string, unknown>): string;
```

**Parameters**:

- `template: string` - Template string (e.g. `"Hello, {name}!"`)
- `data: Record<string, unknown>` - Data object

**Returns**: Formatted string

**Example**:

```typescript
const formatted = format("Hello, {name}!", { name: "Alice" }); // "Hello, Alice!"
```

---

### camelCase

Convert to camelCase.

```typescript
function camelCase(str: string): string;
```

**Parameters**:

- `str: string` - String to convert

**Returns**: camelCase string

**Example**:

```typescript
const camel = camelCase("hello_world"); // "helloWorld"
const camel2 = camelCase("hello-world"); // "helloWorld"
const camel3 = camelCase("hello world"); // "helloWorld"
```

---

### snakeCase

Convert to snake_case.

```typescript
function snakeCase(str: string): string;
```

**Parameters**:

- `str: string` - String to convert

**Returns**: snake_case string

**Example**:

```typescript
const snake = snakeCase("helloWorld"); // "hello_world"
const snake2 = snakeCase("hello-world"); // "hello_world"
```

---

### kebabCase

Convert to kebab-case.

```typescript
function kebabCase(str: string): string;
```

**Parameters**:

- `str: string` - String to convert

**Returns**: kebab-case string

**Example**:

```typescript
const kebab = kebabCase("helloWorld"); // "hello-world"
const kebab2 = kebabCase("hello_world"); // "hello-world"
```

---

### pascalCase

Convert to PascalCase.

```typescript
function pascalCase(str: string): string;
```

**Parameters**:

- `str: string` - String to convert

**Returns**: PascalCase string

**Example**:

```typescript
const pascal = pascalCase("hello_world"); // "HelloWorld"
const pascal2 = pascalCase("hello-world"); // "HelloWorld"
```

---

### padStart

Pad string on the left to reach target length.

```typescript
function padStart(str: string, length: number, padString?: string): string;
```

**Parameters**:

- `str: string` - String to pad
- `length: number` - Target length
- `padString: string` - Pad character (default space)

**Returns**: Padded string

**Example**:

```typescript
const padded = padStart("5", 3, "0"); // "005"
const padded2 = padStart("hello", 10); // "     hello"
```

---

### padEnd

Pad string on the right to reach target length.

```typescript
function padEnd(str: string, length: number, padString?: string): string;
```

**Parameters**:

- `str: string` - String to pad
- `length: number` - Target length
- `padString: string` - Pad character (default space)

**Returns**: Padded string

**Example**:

```typescript
const padded = padEnd("5", 3, "0"); // "500"
const padded2 = padEnd("hello", 10); // "hello     "
```

---

### trim

Remove leading and trailing whitespace.

```typescript
function trim(str: string): string;
```

**Parameters**:

- `str: string` - String to trim

**Returns**: Trimmed string

**Example**:

```typescript
const cleaned = trim("  hello world  "); // "hello world"
```

---

### trimStart

Remove leading whitespace.

```typescript
function trimStart(str: string): string;
```

**Parameters**:

- `str: string` - String to trim

**Returns**: Trimmed string

**Example**:

```typescript
const cleaned = trimStart("  hello world  "); // "hello world  "
```

---

### trimEnd

Remove trailing whitespace.

```typescript
function trimEnd(str: string): string;
```

**Parameters**:

- `str: string` - String to trim

**Returns**: Trimmed string

**Example**:

```typescript
const cleaned = trimEnd("  hello world  "); // "  hello world"
```

---

## Use cases

- **Text truncation**: Summaries and previews
- **Templates**: Dynamic text generation
- **Naming**: Convert between naming conventions
- **Formatting**: Padding and alignment
- **Cleaning**: Remove whitespace

---

## Performance

- **Time complexity**: O(n) where n is string length
- **Space complexity**: O(n) for most; O(1) for some

---

## Notes

- **Type-safe**: Full TypeScript support
- **Pure functions**: No side effects
- **Immutable**: Original string is never mutated
- **Client**: Use `jsr:@dreamer/utils/client/string` in the browser

---

## See also

- [Client module](client/string.md)
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
