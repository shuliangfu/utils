# Array Utilities

> Array utility module providing deduplication, grouping, chunking, flattening,
> set operations, and counting.

[![JSR](https://jsr.io/badges/@dreamer/utils)](https://jsr.io/@dreamer/utils)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)

---

## Overview

Array utility functions for common array operations. Supported in both server
and client environments.

---

## Features

- **Deduplication**:
  - Basic deduplication (`unique`)
  - Deduplicate by property (`uniqueBy`)
- **Grouping**:
  - Group by string key (`groupBy`)
  - Group by function (`groupBy`)
- **Chunking**:
  - Split array into fixed-size chunks (`chunk`)
- **Flattening**:
  - Flatten one level (`flatten`)
  - Flatten recursively (`flattenDeep`)
- **Set operations**:
  - Difference (`difference`)
  - Intersection (`intersection`)
  - Union (`union`)
- **Counting**:
  - Count occurrences (`count`)
  - Count by property (`countBy`)

---

## Installation

```bash
deno add jsr:@dreamer/utils
```

---

## Environment compatibility

- **Runtime**: Deno 2.6+ or Bun 1.3.5+
- **Server**: ✅ Supported
- **Client**: ✅ Supported (via `jsr:@dreamer/utils/client/array`)
- **Dependencies**: None (pure TypeScript)

---

## Quick start

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

// Deduplication
const arr = [1, 2, 2, 3, 3, 3];
const uniqueArr = unique(arr); // [1, 2, 3]

// Deduplicate object array by property
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 1, name: "Alice" },
];
const uniqueUsers = uniqueBy(users, "id"); // deduplicate by id

// Grouping
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

// Chunking
const chunked = chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]

// Flattening
const nested = [1, [2, [3, 4]]];
const flattened = flatten(nested); // [1, 2, [3, 4]]
const flattenedDeep = flattenDeep(nested); // [1, 2, 3, 4]

// Difference
const arr1 = [1, 2, 3, 4];
const arr2 = [3, 4, 5, 6];
const diff = difference(arr1, arr2); // [1, 2]

// Intersection
const inter = intersection(arr1, arr2); // [3, 4]

// Union
const uni = union(arr1, arr2); // [1, 2, 3, 4, 5, 6]

// Counting
const counts = count([1, 2, 2, 3, 3, 3]); // { "1": 1, "2": 2, "3": 3 }

// Count by property
const countByCategory = countBy(items, "category");
// { fruit: 2, vegetable: 1 }
```

---

## API Reference

### unique

Remove duplicate elements from an array.

```typescript
function unique<T>(arr: T[]): T[];
```

**Parameters**:

- `arr: T[]` - Array to deduplicate

**Returns**: Deduplicated array

**Example**:

```typescript
const arr = [1, 2, 2, 3, 3, 3];
const uniqueArr = unique(arr); // [1, 2, 3]
```

---

### uniqueBy

Remove objects with duplicate values for the given property.

```typescript
function uniqueBy<T extends Record<string, unknown>>(
  arr: T[],
  key: keyof T,
): T[];
```

**Parameters**:

- `arr: T[]` - Array of objects
- `key: keyof T` - Property key used for deduplication

**Returns**: Deduplicated array

**Example**:

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

Group array by key or function.

```typescript
function groupBy<T>(
  arr: T[],
  key: string | ((item: T) => string),
): Record<string, T[]>;
```

**Parameters**:

- `arr: T[]` - Array to group
- `key: string | ((item: T) => string)` - Group key (string or function)

**Returns**: Object with group values as keys and arrays as values

**Example**:

```typescript
const items = [
  { category: "fruit", name: "apple" },
  { category: "fruit", name: "banana" },
  { category: "vegetable", name: "carrot" },
];

// Group by string key
const grouped = groupBy(items, "category");
// {
//   fruit: [{ category: "fruit", name: "apple" }, ...],
//   vegetable: [{ category: "vegetable", name: "carrot" }]
// }

// Group by function
const groupedByLength = groupBy(items, (item) => item.name.length.toString());
```

---

### chunk

Split array into chunks of the given size.

```typescript
function chunk<T>(arr: T[], size: number): T[][];
```

**Parameters**:

- `arr: T[]` - Array to chunk
- `size: number` - Chunk size

**Returns**: Array of chunks

**Example**:

```typescript
const arr = [1, 2, 3, 4, 5];
const chunked = chunk(arr, 2); // [[1, 2], [3, 4], [5]]
```

---

### flatten

Flatten nested array by one level.

```typescript
function flatten<T>(arr: (T | T[])[]): T[];
```

**Parameters**:

- `arr: (T | T[])[]` - Array to flatten

**Returns**: Flattened array

**Example**:

```typescript
const nested = [1, [2, 3], [4, 5]];
const flattened = flatten(nested); // [1, 2, 3, 4, 5]
```

---

### flattenDeep

Recursively flatten all levels of a nested array.

```typescript
function flattenDeep<T>(arr: unknown[]): T[];
```

**Parameters**:

- `arr: unknown[]` - Array to flatten

**Returns**: Fully flattened array

**Example**:

```typescript
const nested = [1, [2, [3, 4]]];
const flattened = flattenDeep(nested); // [1, 2, 3, 4]
```

---

### difference

Return elements in the first array that are not in the second.

```typescript
function difference<T>(arr1: T[], arr2: T[]): T[];
```

**Parameters**:

- `arr1: T[]` - First array
- `arr2: T[]` - Second array

**Returns**: Difference array

**Example**:

```typescript
const arr1 = [1, 2, 3, 4];
const arr2 = [3, 4, 5, 6];
const diff = difference(arr1, arr2); // [1, 2]
```

---

### intersection

Return elements that appear in both arrays.

```typescript
function intersection<T>(arr1: T[], arr2: T[]): T[];
```

**Parameters**:

- `arr1: T[]` - First array
- `arr2: T[]` - Second array

**Returns**: Intersection array

**Example**:

```typescript
const arr1 = [1, 2, 3, 4];
const arr2 = [3, 4, 5, 6];
const inter = intersection(arr1, arr2); // [3, 4]
```

---

### union

Return all unique elements from both arrays.

```typescript
function union<T>(arr1: T[], arr2: T[]): T[];
```

**Parameters**:

- `arr1: T[]` - First array
- `arr2: T[]` - Second array

**Returns**: Union array

**Example**:

```typescript
const arr1 = [1, 2, 3];
const arr2 = [3, 4, 5];
const uni = union(arr1, arr2); // [1, 2, 3, 4, 5]
```

---

### count

Count occurrences of each element in the array.

```typescript
function count<T>(arr: T[]): Record<string, number>;
```

**Parameters**:

- `arr: T[]` - Array to count

**Returns**: Object with element (as string) keys and occurrence counts as
values

**Example**:

```typescript
const arr = [1, 2, 2, 3, 3, 3];
const counts = count(arr); // { "1": 1, "2": 2, "3": 3 }
```

---

### countBy

Count occurrences of each value of the given property.

```typescript
function countBy<T extends Record<string, unknown>>(
  arr: T[],
  key: keyof T,
): Record<string, number>;
```

**Parameters**:

- `arr: T[]` - Array of objects
- `key: keyof T` - Property key to count by

**Returns**: Object with property values (as strings) as keys and counts as
values

**Example**:

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

## Use cases

- **Deduplication**: Remove duplicate data
- **Grouping**: Group data by condition
- **Pagination**: Process array in chunks
- **Flattening**: Handle nested arrays
- **Set operations**: Difference, intersection, union
- **Statistics**: Count element occurrences

---

## Performance

- **Time complexity**:
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

- **Space complexity**: Most functions O(n); `flattenDeep` O(n) (including
  recursion stack)

---

## Notes

- **Type-safe**: Full TypeScript support
- **Pure functions**: No side effects
- **Immutable**: Original array is never mutated
- **Client**: Use `jsr:@dreamer/utils/client/array` in the browser

---

## See also

- [Client module](client/array.md)
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
