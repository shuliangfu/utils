# Client Array

> Client array utilities; re-exports the server implementation.

[![JSR](https://jsr.io/badges/@dreamer/utils)](https://jsr.io/@dreamer/utils)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)

---

## Overview

Client array utilities are the same as the server module: same API, re-exported
for browser use.

---

## Features

Same as server: `unique`, `uniqueBy`, `groupBy`, `chunk`, `flatten`,
`flattenDeep`, `difference`, `intersection`, `union`, `count`, `countBy`.

---

## Installation

```bash
deno add jsr:@dreamer/utils
```

---

## Environment

- **Runtime**: Deno 2.6+ or Bun 1.3.5+
- **Server**: ✅ Supported
- **Client**: ✅ Supported (browser)
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
} from "jsr:@dreamer/utils/client/array";

// Same usage as server
const arr = [1, 2, 2, 3, 3, 3];
const uniqueArr = unique(arr); // [1, 2, 3]

const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 1, name: "Alice" },
];
const uniqueUsers = uniqueBy(users, "id");
```

---

## API Reference

All APIs match the server module. See [server array docs](../array.md).

---

## Use cases

Deduplication, grouping, chunking, flattening, set operations, counting.

---

## Notes

- **Compatibility**: Same API as server
- **Type-safe**: Full TypeScript support
- **Pure**: No side effects, no mutation

---

## See also

- [Server module](../array.md)
- [JSR package](https://jsr.io/@dreamer/utils)

---

## Contributing

Issues and Pull Requests are welcome.

---

## License

Apache License 2.0 — see [LICENSE](../../../LICENSE)

---

<div align="center">

**Made with ❤️ by Dreamer Team**

</div>
