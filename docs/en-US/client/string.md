# Client String

> Client string utilities; re-exports the server implementation.

[![JSR](https://jsr.io/badges/@dreamer/utils)](https://jsr.io/@dreamer/utils)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)

---

## Overview

Client string utilities match the server module. Same API, re-exported for
browser.

---

## Features

Same as server: `truncate`, `format`, `camelCase`, `snakeCase`, `kebabCase`,
`pascalCase`, `padStart`, `padEnd`, `trim`, `trimStart`, `trimEnd`.

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
- **Dependencies**: None

---

## Quick start

```typescript
import {
  camelCase,
  format,
  kebabCase,
  pascalCase,
  snakeCase,
  truncate,
} from "jsr:@dreamer/utils/client/string";

const truncated = truncate("Long text here", 10);
const formatted = format("Hello, {name}!", { name: "Alice" });
const camel = camelCase("hello_world"); // "helloWorld"
```

---

## API Reference

All APIs match the server module. See [server string docs](../string.md).

---

## See also

- [Server module](../string.md)
- [JSR package](https://jsr.io/@dreamer/utils)

---

## Contributing

Issues and Pull Requests are welcome.

---

## License

Apache License 2.0 — see [LICENSE](../../../LICENSE)

---

<div align="center">**Made with ❤️ by Dreamer Team**</div>
