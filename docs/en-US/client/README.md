# @dreamer/utils/client

> Browser-oriented utility library: shared helpers and client-only modules
> (file, HTTP).

[![JSR](https://jsr.io/badges/@dreamer/utils/client)](https://jsr.io/@dreamer/utils/client)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](../../LICENSE)

---

## Overview

Client utilities for the browser: shared modules (array, string, object, date,
number, async, url, format, validator) and client-only modules (file, http).
Tree-shakeable, import by module.

---

## File layout

```
@dreamer/utils/client/
├── array.ts        # Array utilities
├── string.ts       # String utilities
├── object.ts       # Object utilities
├── date.ts         # Date utilities
├── number.ts       # Number utilities
├── async.ts        # Async utilities
├── url.ts          # URL utilities
├── format.ts       # Format utilities
├── file.ts         # File (browser File API)
├── validator.ts    # Validation
├── clipboard.ts    # Clipboard
└── http/           # HTTP client
    ├── mod.ts
    ├── client.ts
    ├── cookies.ts
    ├── interceptors.ts
    ├── retry.ts
    └── types.ts
```

---

## Features

### Array ([array.md](array.md))

- Deduplication: `unique`, `uniqueBy`
- Grouping: `groupBy`
- Chunking: `chunk`
- Flattening: `flatten`, `flattenDeep`
- Set ops: `difference`, `intersection`, `union`
- Counting: `count`, `countBy`

### String ([string.md](string.md))

- `truncate`, `format`
- Case: `camelCase`, `snakeCase`, `kebabCase`, `pascalCase`
- Padding: `padStart`, `padEnd`
- Trim: `trim`, `trimStart`, `trimEnd`

### Object ([object.md](object.md))

- `deepClone`, `merge`, `deepMerge`
- Path: `get`, `set`, `has`, `deletePath`
- Filter: `pick`, `omit`
- Compare: `isEqual`, `isDeepEqual`

### Date ([date.md](date.md))

- Format, add days/months/years
- Compare: `isBefore`, `isAfter`, `isSame`
- Diff: `diffDays`, `diffHours`
- Relative: `fromNow`, `toNow`

### Number ([number.md](number.md))

- `format`, `formatCurrency`, `formatPercent`
- `clamp`, `inRange`
- `round`, `floor`, `ceil`

### Async ([async.md](async.md))

- `debounce`, `throttle`
- `retry`, `withTimeout`
- `parallel`, `series`
- `sleep`, `delay`

### URL ([url.md](url.md))

- `parse`, `parseQuery`, `build`, `buildQuery`
- `encode`, `decode`, `join`, `isValid`

### Format ([format.md](format.md))

- `formatBytes`, `formatDuration`, `formatNumber`, `formatPercent`

### File (client) ([file.md](file.md))

- **FileReader**: `readAsText`, `readAsArrayBuffer`, `readAsUint8Array`,
  `readAsDataURL`
- **FileWriter**: `downloadText`, `downloadBinary`, `downloadBlob`
- **FileTypeDetector**: MIME, extension, signature
- **FileStream**: stream read for large files
- **FileWatcher**: watch input, drag-and-drop
- **FilePreview**: image, text, PDF preview

### Validator ([validator.md](validator.md))

- Types: `string`, `number`, `boolean`, `email`, `url`
- `object`, `array`, custom, transform, default, when, messages, async

Client validator is fully compatible with the server; use the same API in the
browser.

### HTTP ([http.md](http.md))

- Fetch for normal requests; XHR when upload/download progress is needed
- Request/response interceptors
- Retry, timeout, exponential backoff
- Upload/download with progress, Cookie manager
- GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS

---

## Use cases

- General utilities (string, array, object)
- Data transform and formatting
- Date/time handling
- Async control (debounce, throttle, retry)
- URL parse/build
- Browser file operations (File API)
- Validation (forms, API payloads)
- HTTP client (API calls, upload/download)

---

## Installation

```bash
deno add jsr:@dreamer/utils
```

---

## Environment

- **Browser**: ✅ Supported (modern browsers)
- **Server**: ❌ Not supported for client-only features (some need browser APIs)
- **Dependencies**: None (browser standard APIs)

---

## Quick start

### Array

```typescript
import {
  chunk,
  difference,
  flatten,
  groupBy,
  unique,
  uniqueBy,
} from "jsr:@dreamer/utils/client/array";

const arr = [1, 2, 2, 3, 3, 3];
const uniqueArr = unique(arr); // [1, 2, 3]

const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 1, name: "Alice" },
];
const uniqueUsers = uniqueBy(users, "id");

const items = [
  { category: "fruit", name: "apple" },
  { category: "fruit", name: "banana" },
  { category: "vegetable", name: "carrot" },
];
const grouped = groupBy(items, "category");
const chunked = chunk([1, 2, 3, 4, 5], 2);
const nested = [1, [2, [3, 4]]];
const flattened = flatten(nested);
const flattenedDeep = flattenDeep(nested);
const arr1 = [1, 2, 3, 4];
const arr2 = [3, 4, 5, 6];
const diff = difference(arr1, arr2); // [1, 2]
```

### Object

```typescript
import {
  deepClone,
  deepMerge,
  get,
  has,
  isDeepEqual,
  isEqual,
  merge,
  omit,
  pick,
  set,
} from "jsr:@dreamer/utils/client/object";

const obj = { a: 1, b: { c: 2 } };
const cloned = deepClone(obj);

const obj1 = { a: 1, b: { c: 2 } };
const obj2 = { b: { d: 3 }, e: 4 };
const merged = merge(obj1, obj2);
const deepMerged = deepMerge(obj1, obj2);

const data = { user: { name: "Alice", age: 25 } };
const name = get(data, "user.name"); // "Alice"
set(data, "user.age", 26);
const hasName = has(data, "user.name"); // true

const user = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  password: "***",
};
const picked = pick(user, ["id", "name", "email"]);
const omitted = omit(user, ["password"]);

const equal = isEqual(obj1, obj2);
const deepEqual = isDeepEqual(obj1, obj2);
```

### Date

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
} from "jsr:@dreamer/utils/client/date";

const date = new Date("2024-01-01");
const formatted = format(date, "YYYY-MM-DD");
const tomorrow = addDays(new Date(), 1);
const nextMonth = addMonths(new Date(), 1);
const nextYear = addYears(new Date(), 1);
const date1 = new Date("2024-01-01");
const date2 = new Date("2024-01-02");
const before = isBefore(date1, date2);
const after = isAfter(date2, date1);
const days = diffDays(date1, date2);
const hours = diffHours(date1, date2);
const pastDate = new Date(Date.now() - 3600000);
const relative = fromNow(pastDate);
```

### Async

```typescript
import {
  debounce,
  retry,
  sleep,
  throttle,
  withTimeout,
} from "jsr:@dreamer/utils/client/async";

const debouncedSearch = debounce(
  (query: string) => console.log("Search:", query),
  300,
);
const throttledScroll = throttle(() => console.log("Scroll"), 100);

const result = await retry(
  async () => {
    const response = await fetch("/api/data");
    if (!response.ok) throw new Error("Request failed");
    return response.json();
  },
  { maxAttempts: 3, delay: 1000 },
);

const result2 = await withTimeout(fetch("/api/data"), 5000);
await sleep(1000);
```

### URL

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
} from "jsr:@dreamer/utils/client/url";

const parsed = parse("https://example.com/path?name=Alice&age=25#section");
const url = build({
  protocol: "https:",
  hostname: "example.com",
  pathname: "/api/users",
  search: "?page=1",
});
const params = parseQuery("name=Alice&age=25");
const query = buildQuery({ name: "Alice", age: 25 });
const encoded = encode("Hello World");
const decoded = decode("Hello%20World");
const fullUrl = join("https://example.com", "api", "users");
const valid = isValid("https://example.com");
```

### File (client)

```typescript
import {
  FilePreview,
  FileReader,
  FileStream,
  FileTypeDetector,
  FileWatcher,
  FileWriter,
} from "jsr:@dreamer/utils/client/file";

const fileReader = new FileReader();
const text = await fileReader.readAsText(file);
const arrayBuffer = await fileReader.readAsArrayBuffer(file);
const dataURL = await fileReader.readAsDataURL(file);
const uint8Array = await fileReader.readAsUint8Array(file);

const fileWriter = new FileWriter();
await fileWriter.downloadText("data.txt", "Hello, World!");
await fileWriter.downloadBinary("data.bin", binaryData);

const detector = new FileTypeDetector();
const type = await detector.detect(file);

const stream = new FileStream();
const reader = stream.createReader(file, 64 * 1024);
for await (const chunk of reader) {
  console.log("Chunk:", chunk.length, "bytes");
}

const watcher = new FileWatcher();
const input = document.querySelector('input[type="file"]');
watcher.watchInput(input, { multiple: true });
watcher.on("select", (files) => console.log("Selected:", files));

const dropZone = document.querySelector("#drop-zone");
watcher.watchDrop(dropZone);
watcher.on("drop", (files) => console.log("Dropped:", files));

const preview = new FilePreview();
const imageURL = await preview.image(imageFile);
const textContent = await preview.text(textFile);
const pdfURL = await preview.pdf(pdfFile);
```

### Validator

```typescript
import {
  email,
  number,
  object,
  string,
  url,
  validate,
} from "jsr:@dreamer/utils/client/validator";

const nameSchema = string().min(2).max(50).required();
const result = validate("Alice", nameSchema);

const formSchema = object({
  name: string().min(2).required(),
  age: number().min(18).max(100).required(),
  email: email().required(),
  website: url().optional(),
});
const formData = {
  name: "Alice",
  age: 25,
  email: "alice@example.com",
  website: "https://example.com",
};
const formResult = validate(formData, formSchema);

const passwordSchema = string()
  .min(8)
  .custom((value) => {
    if (!/[A-Z]/.test(value)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(value)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(value)) return "Password must contain at least one digit";
    return true;
  })
  .required();
```

### HTTP client

```typescript
import { HttpClient } from "jsr:@dreamer/utils/client/http";

const client = new HttpClient({
  baseURL: "https://api.example.com",
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.set("Authorization", `Bearer ${token}`);
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error instanceof Response && error.status === 401) {
      globalThis.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

const response = await client.get("/users");
const users = await response.json();

await client.post("/users", { name: "Alice", email: "alice@example.com" });

const formData = new FormData();
formData.append("file", fileInput.files[0]);
await client.upload("/upload", formData, {
  onStart: () => console.log("Upload started"),
  onProgress: (progress) => console.log(`Progress: ${progress.percent}%`),
  onComplete: () => console.log("Upload complete"),
});

const blob = await client.download("/files/document.pdf", {
  onStart: () => console.log("Download started"),
  onProgress: (progress) => console.log(`Progress: ${progress.percent}%`),
  onComplete: () => console.log("Download complete"),
});

await client.get("/api/data", {
  retry: true,
  retryOptions: { retries: 3, retryDelay: 1000, exponentialBackoff: true },
});

client.cookies.set("session", "abc123", {
  expires: 7 * 24 * 60 * 60,
  path: "/",
  secure: true,
});
const session = client.cookies.get("session");
```

---

## Client vs server

1. **File**
   - Client: browser File API (`FileReader`, `Blob`, `URL.createObjectURL`)
   - Server: file system API (`readFile`, `writeFile`, `watchFs`)

2. **Environment**
   - Client: browser only; no file system access
   - Server: Deno/Bun; file system access

3. **Features**
   - Client: download, preview, etc.
   - Server: file watch, stream I/O, etc.

---

## Notes

1. **Browser support**: Modern browser APIs only; no IE.
2. **Large files**: Prefer `FileStream` for streaming.
3. **Security**: Download triggers browser download; may require user gesture.
4. **TypeScript**: Include `dom` in `lib` for types.

---

## Module relationship

### Shared (client re-exports server)

- `array.ts`, `string.ts`, `object.ts`, `date.ts`, `number.ts`, `async.ts`,
  `url.ts`, `format.ts`, `validator.ts`

Pure helpers; no runtime-specific APIs; same code on client and server.

### Server-only

- `lock.ts` (Redis)
- `system.ts` (system APIs)
- `file.ts` (file system)

### Client-only

- `client/file.ts` (File API, Blob)
- `client/http/` (Fetch, XHR)
- `client/clipboard.ts` (Clipboard API)

### Benefits

- Single implementation for shared modules
- Same API on client and server
- Clear split between client-only and server-only features

---

## Contributing

Issues and Pull Requests are welcome.

---

## License

Apache License 2.0 — see [LICENSE](../../../LICENSE)

---

<div align="center">**Made with ❤️ by Dreamer Team**</div>
