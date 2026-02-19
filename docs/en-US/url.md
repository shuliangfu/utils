# URL Utilities

> URL utility module for parsing, building, query params, encode/decode, join,
> and validation.

[![JSR](https://jsr.io/badges/@dreamer/utils)](https://jsr.io/@dreamer/utils)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)

---

## Overview

URL utility functions for common URL operations. Supported in both server and
client environments.

---

## Features

- **Parsing**: `parse` — protocol, host, pathname, search, etc.
- **Query**: `parseQuery` (string → object), `buildQuery` (object → string);
  null/undefined omitted
- **Build**: `build` from options
- **Encode/decode**: `encode`, `decode`
- **Join**: `join` — merge path segments, normalize slashes
- **Validation**: `isValid`

---

## Installation

```bash
deno add jsr:@dreamer/utils
```

---

## Environment compatibility

- **Runtime**: Deno 2.6+ or Bun 1.3.5+
- **Server**: ✅ Supported
- **Client**: ✅ Supported (via `jsr:@dreamer/utils/client/url`)
- **Dependencies**: None (pure TypeScript)

---

## Quick start

```typescript
import {
  build,
  buildQuery,
  decode,
  encode,
  isValid,
  join,
  parse,
  parseQuery,
} from "jsr:@dreamer/utils/url";

// Parse
const url = "https://example.com/path?name=Alice&age=25";
const parsed = parse(url);
// { protocol: "https:", host: "example.com", pathname: "/path", search: "?name=Alice&age=25", ... }

// Query
const query = parseQuery("name=Alice&age=25");
// { name: "Alice", age: "25" }

const built = build({
  protocol: "https:",
  host: "example.com",
  pathname: "/path",
  search: "?name=Alice&age=25",
});
// "https://example.com/path?name=Alice&age=25"

const queryString = buildQuery({ name: "Alice", age: 25 });
// "name=Alice&age=25"

// Encode/decode
const encoded = encode("Hello World"); // "Hello%20World"
const decoded = decode("Hello%20World"); // "Hello World"

// Join
const joined = join("https://example.com", "path", "to", "resource");
// "https://example.com/path/to/resource"

// Validation
const valid = isValid("https://example.com"); // true
const invalid = isValid("not-a-url"); // false
```

---

## API Reference

### parse

Parse URL string into an object.

```typescript
function parse(url: string): ParsedURL;
```

**Parameters**:

- `url: string` - URL string

**Returns**: Parsed object (ParsedURL)

**ParsedURL**: `protocol`, `host`, `hostname`, `port`, `pathname`, `search`,
`hash`, `origin`

**Example**:

```typescript
const parsed = parse("https://example.com:8080/path?name=Alice#section");
console.log(parsed.hostname); // "example.com"
console.log(parsed.port); // "8080"
```

---

### parseQuery

Parse query string into a record.

```typescript
function parseQuery(query: string): Record<string, string>;
```

**Parameters**:

- `query: string` - Query string (e.g. `"name=Alice&age=25"`)

**Returns**: Key-value object

**Example**:

```typescript
const params = parseQuery("name=Alice&age=25");
// { name: "Alice", age: "25" }
```

---

### build

Build URL from options.

```typescript
function build(options: BuildURLOptions): string;
```

**Parameters**:

- `options: BuildURLOptions` - protocol, host, hostname, port, pathname, search,
  hash

**Returns**: URL string

**Example**:

```typescript
const url = build({
  protocol: "https:",
  hostname: "example.com",
  pathname: "/api/users",
  search: "?page=1",
});
// "https://example.com/api/users?page=1"
```

---

### buildQuery

Build query string from object. Omits null and undefined.

```typescript
function buildQuery(params: Record<string, unknown>): string;
```

**Parameters**:

- `params: Record<string, unknown>` - Query params

**Returns**: Query string

**Example**:

```typescript
const query = buildQuery({ name: "Alice", age: 25 });
// "name=Alice&age=25"
const query2 = buildQuery({ name: "Alice", age: null, email: undefined });
// "name=Alice"
```

---

### encode

URL-encode a string.

```typescript
function encode(str: string): string;
```

**Parameters**: `str: string`

**Returns**: Encoded string

**Example**: `encode("Hello World")` → `"Hello%20World"`

---

### decode

URL-decode a string.

```typescript
function decode(str: string): string;
```

**Parameters**: `str: string`

**Returns**: Decoded string

**Example**: `decode("Hello%20World")` → `"Hello World"`

---

### join

Join base URL with path segments. Normalizes slashes.

```typescript
function join(base: string, ...paths: string[]): string;
```

**Parameters**:

- `base: string` - Base URL
- `...paths: string[]` - Path segments

**Returns**: Joined URL

**Example**:

```typescript
const url = join("https://example.com", "api", "users", "123");
// "https://example.com/api/users/123"
const url2 = join("https://example.com/", "/api/", "/users/");
// "https://example.com/api/users"
```

---

### isValid

Check if string is a valid URL.

```typescript
function isValid(url: string): boolean;
```

**Parameters**: `url: string`

**Returns**: true if valid

**Example**:

```typescript
isValid("https://example.com"); // true
isValid("not-a-url"); // false
```

---

## Use cases

- **Parsing**: Extract URL parts
- **Query**: Parse and build query params
- **Building**: Dynamic URLs
- **Encode/decode**: Special characters
- **Join**: Path composition
- **Validation**: URL format check

---

## Performance

- **Time complexity**: O(n) (n = string length)
- **Space complexity**: O(n) for most

---

## Notes

- **Type-safe**: Full TypeScript support
- **Pure**: No side effects, no mutation
- **Client**: Use `jsr:@dreamer/utils/client/url` in the browser

---

## See also

- [Client module](client/url.md)
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
