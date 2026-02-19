# Object Utilities

> Object utility module providing clone, merge, path access, filtering, and
> comparison.

[![JSR](https://jsr.io/badges/@dreamer/utils)](https://jsr.io/@dreamer/utils)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)

---

## Overview

Object utility functions for common object operations. Supported in both server
and client environments.

---

## Features

- **Clone**:
  - Deep clone (`deepClone`), including Date, Array, etc.
- **Merge**:
  - Shallow merge (`merge`)
  - Deep merge (`deepMerge`)
- **Path access**:
  - Get by path (`get`)
  - Set by path (`set`)
  - Check path (`has`)
  - Delete by path (`deletePath`)
- **Filtering**:
  - Pick keys (`pick`)
  - Omit keys (`omit`)
- **Comparison**:
  - Shallow equality (`isEqual`)
  - Deep equality (`isDeepEqual`)

---

## Installation

```bash
deno add jsr:@dreamer/utils
```

---

## Environment compatibility

- **Runtime**: Deno 2.6+ or Bun 1.3.5+
- **Server**: ✅ Supported
- **Client**: ✅ Supported (via `jsr:@dreamer/utils/client/object`)
- **Dependencies**: None (pure TypeScript)

---

## Quick start

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

// Deep clone
const obj = { a: 1, b: { c: 2 } };
const cloned = deepClone(obj); // fully independent copy

// Merge
const obj1 = { a: 1, b: { c: 2 } };
const obj2 = { b: { d: 3 }, e: 4 };
const merged = merge(obj1, obj2); // { a: 1, b: { d: 3 }, e: 4 }
const deepMerged = deepMerge(obj1, obj2); // { a: 1, b: { c: 2, d: 3 }, e: 4 }

// Path access
const data = { user: { name: "Alice", age: 25 } };
const name = get(data, "user.name"); // "Alice"
set(data, "user.age", 26);
const hasName = has(data, "user.name"); // true
deletePath(data, "user.age");

// Filtering
const user = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  password: "***",
};
const picked = pick(user, ["id", "name", "email"]);
const omitted = omit(user, ["password"]);

// Comparison
const a = { a: 1, b: { c: 2 } };
const b = { a: 1, b: { c: 2 } };
const equal = isEqual(a, b); // true
const deepEqual = isDeepEqual(a, b); // true
```

---

## API Reference

### deepClone

Create a deep copy of an object.

```typescript
function deepClone<T>(obj: T): T;
```

**Parameters**:

- `obj: T` - Object to clone

**Returns**: Cloned object

**Example**:

```typescript
const obj = { a: 1, b: { c: 2 } };
const cloned = deepClone(obj);
cloned.b.c = 3;
console.log(obj.b.c); // 2 (original unchanged)
```

---

### merge

Shallow merge: copy source properties into target.

```typescript
function merge<T extends Record<string, unknown>>(
  target: T,
  ...sources: Partial<T>[]
): T;
```

**Parameters**:

- `target: T` - Target object
- `...sources: Partial<T>[]` - Source objects

**Returns**: Merged object

**Example**:

```typescript
const obj1 = { a: 1, b: { c: 2 } };
const obj2 = { b: { d: 3 }, e: 4 };
const merged = merge(obj1, obj2); // { a: 1, b: { d: 3 }, e: 4 }
```

---

### deepMerge

Deep merge: recursively merge nested objects.

```typescript
function deepMerge<T extends Record<string, unknown>>(
  target: T,
  ...sources: Partial<T>[]
): T;
```

**Parameters**:

- `target: T` - Target object
- `...sources: Partial<T>[]` - Source objects

**Returns**: Deep-merged object

**Example**:

```typescript
const obj1 = { a: 1, b: { c: 2 } };
const obj2 = { b: { d: 3 }, e: 4 };
const deepMerged = deepMerge(obj1, obj2); // { a: 1, b: { c: 2, d: 3 }, e: 4 }
```

---

### get

Get value at path. Supports nested paths like `"user.name"`.

```typescript
function get<T = unknown>(
  obj: Record<string, unknown>,
  path: string,
  defaultValue?: T,
): T | undefined;
```

**Parameters**:

- `obj: Record<string, unknown>` - Object
- `path: string` - Path (e.g. `"user.name"`)
- `defaultValue?: T` - Default if path missing

**Returns**: Value at path or default

**Example**:

```typescript
const data = { user: { name: "Alice", age: 25 } };
const name = get(data, "user.name"); // "Alice"
const email = get(data, "user.email", "unknown"); // "unknown"
```

---

### set

Set value at path. Mutates the object.

```typescript
function set(
  obj: Record<string, unknown>,
  path: string,
  value: unknown,
): void;
```

**Parameters**:

- `obj: Record<string, unknown>` - Object
- `path: string` - Path (e.g. `"user.name"`)
- `value: unknown` - Value

**Returns**: void

**Example**:

```typescript
const data = { user: { name: "Alice" } };
set(data, "user.age", 25);
console.log(data.user.age); // 25
```

---

### has

Check if path exists in object.

```typescript
function has(obj: Record<string, unknown>, path: string): boolean;
```

**Parameters**:

- `obj: Record<string, unknown>` - Object
- `path: string` - Path (e.g. `"user.name"`)

**Returns**: Whether path exists

**Example**:

```typescript
const data = { user: { name: "Alice" } };
const hasName = has(data, "user.name"); // true
const hasEmail = has(data, "user.email"); // false
```

---

### deletePath

Delete value at path.

```typescript
function deletePath(
  obj: Record<string, unknown>,
  path: string,
): boolean;
```

**Parameters**:

- `obj: Record<string, unknown>` - Object
- `path: string` - Path (e.g. `"user.name"`)

**Returns**: Whether deletion succeeded

**Example**:

```typescript
const data = { user: { name: "Alice", age: 25 } };
deletePath(data, "user.age");
console.log(data.user.age); // undefined
```

---

### pick

Create object with only the specified keys.

```typescript
function pick<T extends Record<string, unknown>>(
  obj: T,
  keys: (keyof T)[],
): Partial<T>;
```

**Parameters**:

- `obj: T` - Object
- `keys: (keyof T)[]` - Keys to keep

**Returns**: New object with only those keys

**Example**:

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

Create object without the specified keys.

```typescript
function omit<T extends Record<string, unknown>>(
  obj: T,
  keys: (keyof T)[],
): Partial<T>;
```

**Parameters**:

- `obj: T` - Object
- `keys: (keyof T)[]` - Keys to omit

**Returns**: New object without those keys

**Example**:

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

Shallow equality check.

```typescript
function isEqual(obj1: unknown, obj2: unknown): boolean;
```

**Parameters**:

- `obj1: unknown` - First value
- `obj2: unknown` - Second value

**Returns**: Whether equal

**Example**:

```typescript
const obj1 = { a: 1, b: 2 };
const obj2 = { a: 1, b: 2 };
const equal = isEqual(obj1, obj2); // true
```

---

### isDeepEqual

Deep equality check.

```typescript
function isDeepEqual(obj1: unknown, obj2: unknown): boolean;
```

**Parameters**:

- `obj1: unknown` - First value
- `obj2: unknown` - Second value

**Returns**: Whether deeply equal

**Example**:

```typescript
const obj1 = { a: 1, b: { c: 2 } };
const obj2 = { a: 1, b: { c: 2 } };
const deepEqual = isDeepEqual(obj1, obj2); // true
```

---

## Use cases

- **Cloning**: Avoid reference sharing
- **Config merge**: Combine multiple configs
- **Nested access**: Safe path access
- **Filtering**: Pick or omit fields
- **Comparison**: Equality checks

---

## Performance

- **Time complexity**:
  - `deepClone`: O(n)
  - `merge`: O(n)
  - `deepMerge`: O(n)
  - `get` / `set` / `has` / `deletePath`: O(m) (m = path depth)
  - `pick`: O(k) (k = number of keys)
  - `omit`: O(n)
  - `isEqual`: O(n)
  - `isDeepEqual`: O(n)

---

## Notes

- **Type-safe**: Full TypeScript support
- **Pure where possible**: `set` and `deletePath` mutate the object
- **deepClone**: Handles Date, Array, etc.
- **Client**: Use `jsr:@dreamer/utils/client/object` in the browser

---

## See also

- [Client module](client/object.md)
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
