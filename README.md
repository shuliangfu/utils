# @dreamer/utils

> Utility function library compatible with Deno and Bun. Common utilities
> organized by module.

English | [中文 (Chinese)](./README-zh.md)

[![JSR](https://jsr.io/badges/@dreamer/utils)](https://jsr.io/@dreamer/utils)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](./LICENSE)
[![Tests](https://img.shields.io/badge/tests-244%20passed-brightgreen)](./docs/en-US/TEST_REPORT.md)

---

## 🎯 Features

Utility library with common utilities and helpers. Supports server (Deno/Bun)
and client (browser).

## File Organization

Utilities are organized by module. Each module is a separate file for
tree-shaking:

```
@dreamer/utils/
├── array.ts        # Array operations (server/client shared)
├── string.ts       # String handling (server/client shared)
├── object.ts       # Object operations (server/client shared)
├── date.ts         # Date/time handling (server/client shared)
├── number.ts       # Number formatting (server/client shared)
├── async.ts        # Async utilities (server/client shared)
├── lock.ts         # Distributed lock (server only)
├── system.ts       # System status (server only)
├── url.ts          # URL handling (server/client shared)
├── format.ts       # Format utilities (server/client shared)
├── file.ts         # File operations (server: filesystem API)
├── validator.ts    # Data validation (server/client shared)
└── client/
    ├── array.ts    # Array (re-exports server)
    ├── string.ts   # String (re-exports server)
    ├── object.ts   # Object (re-exports server)
    ├── date.ts     # Date (re-exports server)
    ├── number.ts   # Number (re-exports server)
    ├── async.ts    # Async (re-exports server)
    ├── url.ts      # URL (re-exports server)
    ├── format.ts   # Format (re-exports server)
    ├── file.ts     # File (client: browser File API)
    ├── validator.ts # Validator (re-exports server)
    ├── clipboard.ts # Clipboard (client only)
    ├── http/       # HTTP client (client only)
    │   ├── mod.ts  # Main entry
    │   ├── client.ts # HttpClient
    │   ├── cookies.ts # Cookie management
    │   ├── interceptors.ts # Interceptors
    │   ├── retry.ts # Retry logic
    │   └── types.ts # Types
    └── README.md   # Client docs
```

**Notes**:

- **Shared modules** (`array`, `string`, `object`, `date`, `number`, `async`,
  `url`, `format`, `validator`): Client re-exports server version (pure JS, no
  runtime API)
- **Server-only** (`lock`, `system`, `file`): Not available on client
- **Client-only** (`client/file`, `client/http`, `client/clipboard`):
  Browser-specific (File API, Fetch/XHR, Clipboard API)

## Characteristics

### String (`string.ts`) - [📖 Docs](./docs/string.md)

- Truncate (`truncate`)
- Format (`format`, `template`)
- Case conversion (`camelCase`, `snakeCase`, `kebabCase`, `pascalCase`)
- Padding (`padStart`, `padEnd`)
- Trimming (`trim`, `trimStart`, `trimEnd`)
- Matching (`match`, `matchAll`)
- Replace (`replace`, `replaceAll`)

### Array (`array.ts`) - [📖 Docs](./docs/array.md)

- Deduplication (`unique`, `uniqueBy`)
- Grouping (`groupBy`, `groupByKey`)
- Sorting (`sort`, `sortBy`)
- Chunking (`chunk`)
- Flattening (`flatten`, `flattenDeep`)
- Set ops (`difference`, `intersection`, `union`)
- Filtering (`filter`, `filterBy`)
- Mapping (`map`, `mapBy`)
- Finding (`find`, `findIndex`, `findLast`)
- Counting (`count`, `countBy`)

### Object (`object.ts`) - [📖 Docs](./docs/object.md)

- Deep clone (`deepClone`)
- Merge (`merge`, `deepMerge`)
- Path access (`get`, `set`, `has`, `delete`)
- Keys/values (`keys`, `values`, `entries`)
- Filtering (`pick`, `omit`)
- Transform (`mapKeys`, `mapValues`)
- Comparison (`isEqual`, `isDeepEqual`)

### Date (`date.ts`) - [📖 Docs](./docs/date.md)

- Format (`format`, `formatDate`, `formatTime`)
- Parse (`parse`, `parseDate`)
- Arithmetic (`addDays`, `addMonths`, `addYears`)
- Comparison (`isBefore`, `isAfter`, `isSame`)
- Diff (`diff`, `diffDays`, `diffHours`)
- Range (`startOf`, `endOf`)
- Relative time (`fromNow`, `toNow`)

### Number (`number.ts`) - [📖 Docs](./docs/number.md)

- Format (`format`, `formatCurrency`, `formatPercent`)
- Conversion (`toFixed`, `toPrecision`)
- Range (`clamp`, `inRange`)
- Rounding (`round`, `floor`, `ceil`)
- Validation (`isNumber`, `isInteger`, `isFloat`)

### Async (`async.ts`) - [📖 Docs](./docs/async.md)

- Debounce (`debounce`)
- Throttle (`throttle`)
- Retry (`retry`, `retryAsync`)
- Timeout (`timeout`, `withTimeout`)
- Concurrency (`parallel`, `series`, `limit`)
- Promise utils (`sleep`, `delay`)

### Distributed Lock (`lock.ts`) - [📖 Docs](./docs/lock.md)

- Acquire lock (`acquireLock`)
- Execute with lock (`withLock`)
- Lock key (`lockKey`)
- DistributedLock class

### System Status (`system.ts`) - [📖 Docs](./docs/system.md)

- Memory (`getMemoryInfo`)
- CPU (`getCpuUsage`)
- Load (`getLoadAverage`)
- System info (`getSystemInfo`)
- Disk (`getDiskUsage`)
- Full status (`getSystemStatus`)
- Format (`formatBytes`, `formatUptime`)

### URL (`url.ts`) - [📖 Docs](./docs/url.md)

- Parse (`parse`, `parseQuery`)
- Build (`build`, `buildQuery`)
- Encode/decode (`encode`, `decode`)
- Join (`join`)
- Validation (`isValid`)

### Format (`format.ts`) - [📖 Docs](./docs/format.md)

- Bytes (`formatBytes`)
- Duration (`formatDuration`)
- Number (`formatNumber`)
- Percent (`formatPercent`)

### Validator (`validator.ts`) - [📖 Docs](./docs/validator.md)

- Basic types (`string`, `number`, `boolean`, `email`, `url`)
- Object schema (`object`)
- Array (`array`)
- Custom rules (`custom`)
- Transform (`transform`)
- Default (`default`)
- Conditional (`when`)
- Error messages (`message`)
- Async validation

### File (`file.ts` - server) - [📖 Docs](./docs/file.md)

- FileManager read/write: `readText`, `readBinary`, `writeText`, `writeBinary`,
  `appendText`
- FileManager ops: `copy`, `move`, `delete`, `exists`, `stat`
- FileWatcher: watch changes, recursive, debounce
- FileTypeDetector: MIME, extension, magic number
- FileStream: stream read/write for large files
- FileCompressor: `gzip`, `gunzip`, `compress`/`decompress`

**Note**: Client file ops see [client/README.md](./src/client/README.md) and
[📖 Client file docs](./docs/client/file.md)

### Clipboard (`client/clipboard.ts`) - [📖 Docs](./docs/client/clipboard.md)

- Copy text (`copyToClipboard`)
- Read text (`readFromClipboard`)
- Support check (`isClipboardSupported`, `isClipboardReadSupported`)

## Use Cases

- General utilities (string, array, object)
- Data conversion and formatting
- Date/time handling
- Async control (debounce, throttle, retry)
- URL handling
- File operations (server and client)
- Data validation (server and client)
- HTTP client (client only)
- Clipboard (client only)
- Helpers

## Installation

```bash
deno add jsr:@dreamer/utils
```

## Compatibility

- **Runtime**: Deno 2.6+ or Bun 1.3.5
- **Bun**: 1.0+
- **Server**: ✅ Supported (Deno/Bun)
- **Client**: ✅ Supported (browser, some features limited)
- **Dependencies**:
  - Core: No external deps (pure TypeScript)
  - `system.ts`: `@dreamer/runtime-adapter`
  - `lock.ts`: Redis client (e.g. `ioredis`)

**Notes**:

- `system.ts` needs runtime permissions (system commands), not available in
  browser
- `lock.ts` needs Redis, server only
- `file.ts` compression: Deno and Bun use `npm:pako@2.1.0`

## Import

```typescript
// By module (recommended)
import { chunk, groupBy, unique } from "jsr:@dreamer/utils/array";
import { camelCase, format, truncate } from "jsr:@dreamer/utils/string";
import { deepClone, get, merge } from "jsr:@dreamer/utils/object";
import { addDays, diffDays, format } from "jsr:@dreamer/utils/date";
import { clamp, format, round } from "jsr:@dreamer/utils/number";
import { debounce, retry, throttle } from "jsr:@dreamer/utils/async";
import { acquireLock, lockKey, withLock } from "jsr:@dreamer/utils/lock";
import {
  formatBytes,
  formatUptime,
  getCpuUsage,
  getMemoryInfo,
  getSystemStatus,
} from "jsr:@dreamer/utils/system";
import { build, parse, parseQuery } from "jsr:@dreamer/utils/url";
import { formatDuration } from "jsr:@dreamer/utils/format";
import { number, object, string, validate } from "jsr:@dreamer/utils/validator";

// Or from main entry (optional, not recommended, increases bundle size)
import { deepClone, truncate, unique } from "jsr:@dreamer/utils";
```

## 📚 API Docs

### String

```typescript
import {
  camelCase,
  format,
  kebabCase,
  snakeCase,
  truncate,
} from "jsr:@dreamer/utils/string";

// Truncate
const text = "This is a long text";
const truncated = truncate(text, 10); // "This is a ..."
const truncated2 = truncate(text, 10, "..."); // Custom ellipsis

// Format
const formatted = format("Hello, {name}!", { name: "Alice" }); // "Hello, Alice!"

// Case conversion
const camel = camelCase("hello_world"); // "helloWorld"
const snake = snakeCase("helloWorld"); // "hello_world"
const kebab = kebabCase("helloWorld"); // "hello-world"
```

### Array

```typescript
import {
  chunk,
  difference,
  flatten,
  groupBy,
  unique,
} from "jsr:@dreamer/utils/array";

// Deduplication
const arr = [1, 2, 2, 3, 3, 3];
const uniqueArr = unique(arr); // [1, 2, 3]

// Deduplication by property
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 1, name: "Alice" },
];
const uniqueUsers = uniqueBy(users, "id"); // By id

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
```

### Object

```typescript
import {
  deepClone,
  get,
  isEqual,
  merge,
  omit,
  pick,
  set,
} from "jsr:@dreamer/utils/object";

// Deep clone
const obj = { a: 1, b: { c: 2 } };
const cloned = deepClone(obj); // Independent copy

// Merge
const obj1 = { a: 1, b: { c: 2 } };
const obj2 = { b: { d: 3 }, e: 4 };
const merged = merge(obj1, obj2); // { a: 1, b: { c: 2, d: 3 }, e: 4 }
const deepMerged = deepMerge(obj1, obj2); // Deep merge

// Path access
const data = { user: { name: "Alice", age: 25 } };
const name = get(data, "user.name"); // "Alice"
set(data, "user.age", 26); // Set value
const has = has(data, "user.name"); // true

// Filtering
const user = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  password: "***",
};
const picked = pick(user, ["id", "name", "email"]); // Pick fields
const omitted = omit(user, ["password"]); // Omit fields

// Comparison
const obj1 = { a: 1, b: { c: 2 } };
const obj2 = { a: 1, b: { c: 2 } };
const equal = isEqual(obj1, obj2); // true
const deepEqual = isDeepEqual(obj1, obj2); // true (deep)
```

### Date

```typescript
import {
  addDays,
  diffDays,
  format,
  fromNow,
  isBefore,
} from "jsr:@dreamer/utils/date";

// Format
const date = new Date("2024-01-01");
const formatted = format(date, "YYYY-MM-DD"); // "2024-01-01"
const formatted2 = format(date, "YYYY-MM-DD"); // "2024-01-01"

// Arithmetic
const tomorrow = addDays(new Date(), 1);
const nextMonth = addMonths(new Date(), 1);
const nextYear = addYears(new Date(), 1);

// Comparison
const date1 = new Date("2024-01-01");
const date2 = new Date("2024-01-02");
const before = isBefore(date1, date2); // true
const after = isAfter(date2, date1); // true

// Diff
const days = diffDays(date1, date2); // 1
const hours = diffHours(date1, date2); // 24

// Relative time
const relative = fromNow(new Date(Date.now() - 1000 * 60 * 5)); // "5 minutes ago"
const relative2 = toNow(new Date(Date.now() + 1000 * 60 * 5)); // "in 5 minutes"
```

### Number

```typescript
import {
  clamp,
  format,
  formatCurrency,
  formatPercent,
  round,
} from "jsr:@dreamer/utils/number";

// Format
const num = 1234567.89;
const formatted = format(num, "0,0.00"); // "1,234,567.89"
const currency = formatCurrency(num, "USD"); // "$1,234,567.89"
const percent = formatPercent(0.1234); // "12.34%"

// Range
const clamped = clamp(150, 0, 100); // 100 (clamped to 0-100)
const inRange = inRange(50, 0, 100); // true

// Rounding
const rounded = round(3.7); // 4
const floored = floor(3.7); // 3
const ceiled = ceil(3.7); // 4
```

### Async

```typescript
import {
  debounce,
  parallel,
  retry,
  sleep,
  throttle,
} from "jsr:@dreamer/utils/async";

// Debounce
const debouncedFn = debounce((value: string) => {
  console.log("Search:", value);
}, 300);

// Executes 300ms after last input
input.addEventListener("input", (e) => {
  debouncedFn(e.target.value);
});

// Throttle
const throttledFn = throttle(() => {
  console.log("Scroll event");
}, 100);

// At most once per 100ms on scroll
globalThis.addEventListener("scroll", throttledFn);

// Retry
const result = await retry(
  async () => {
    const response = await fetch("/api/data");
    if (!response.ok) throw new Error("Request failed");
    return response.json();
  },
  { maxAttempts: 3, delay: 1000 },
);

// Timeout
const result = await withTimeout(
  fetch("/api/data"),
  5000, // 5s timeout
);

// Concurrency
const results = await parallel(
  [
    () => fetch("/api/user/1"),
    () => fetch("/api/user/2"),
    () => fetch("/api/user/3"),
  ],
  { concurrency: 2 }, // max 2 concurrent
);

// Delay
await sleep(1000); // 1s delay
```

### Distributed Lock

```typescript
import { acquireLock, lockKey, withLock } from "jsr:@dreamer/utils/lock";
import { Redis } from "npm:ioredis";

const redis = new Redis("redis://localhost:6379");

// 1: Manual acquire/release
const lock = await acquireLock(redis, "lock:user:123", {
  ttl: 10, // 10s TTL
  errorMessage: "Operation in progress, please retry later",
});

if (lock) {
  try {
    await doSomething();
  } finally {
    await lock.release();
  }
}

// 2: withLock (recommended)
const result = await withLock(
  redis,
  lockKey("withdraw", "user123"), // "lock:withdraw:user123"
  async () => {
    return await processWithdrawal("user123", 1000);
  },
  {
    ttl: 10,
    errorMessage: "Withdrawal in progress, please retry later",
  },
);

// 3: No throw on fail
const lock2 = await acquireLock(redis, "lock:user:456", {
  ttl: 10,
  throwOnFail: false, // Return null instead of throw
});

if (lock2) {
  try {
    await doSomething();
  } finally {
    await lock2.release();
  }
} else {
  console.log("Operation in progress");
}
```

### System Status

```typescript
import {
  formatBytes,
  formatUptime,
  getCpuUsage,
  getDiskUsage,
  getLoadAverage,
  getMemoryInfo,
  getSystemInfo,
  getSystemStatus,
} from "jsr:@dreamer/utils/system";

// Full status
const status = await getSystemStatus();
console.log("System:", status.system);
console.log("Memory usage:", status.memory.usagePercent + "%");
console.log("CPU usage:", status.cpu.usagePercent + "%");
if (status.loadAverage) {
  console.log("Load:", status.loadAverage.load1);
}

// Memory
const memory = await getMemoryInfo();
console.log(`Total: ${formatBytes(memory.total)}`);
console.log(`Used: ${formatBytes(memory.used)}`);
console.log(`Available: ${formatBytes(memory.available)}`);
console.log(`Usage: ${memory.usagePercent}%`);

// CPU
const cpu = await getCpuUsage(200); // 200ms sample
console.log(`CPU: ${cpu.usagePercent}%`);
console.log(`User: ${cpu.userPercent}%`);
console.log(`System: ${cpu.systemPercent}%`);

// Load (Linux/macOS)
const load = await getLoadAverage();
if (load) {
  console.log(`1m: ${load.load1}`);
  console.log(`5m: ${load.load5}`);
  console.log(`15m: ${load.load15}`);
}

// System info
const system = await getSystemInfo();
console.log(`OS: ${system.os}`);
console.log(`Release: ${system.osRelease}`);
console.log(`Hostname: ${system.hostname}`);
console.log(`Arch: ${system.arch}`);
console.log(`Uptime: ${formatUptime(system.uptime)}`);

// Disk
const disk = await getDiskUsage("/");
console.log(`Total: ${formatBytes(disk.total)}`);
console.log(`Used: ${formatBytes(disk.used)}`);
console.log(`Available: ${formatBytes(disk.available)}`);
console.log(`Usage: ${disk.usagePercent}%`);

// Format helpers
console.log(formatBytes(1024)); // "1.00 KB"
console.log(formatBytes(1048576)); // "1.00 MB"
```

### File (server)

```typescript
import {
  FileCompressor,
  FileManager,
  FileStream,
  FileTypeDetector,
  FileWatcher,
} from "jsr:@dreamer/utils/file";

// Read/write
const fileManager = new FileManager();

const text = await fileManager.readText("./data.txt");
await fileManager.writeText("./output.txt", "Hello, World!");
const binary = await fileManager.readBinary("./image.png");
await fileManager.writeBinary("./output.png", binaryData);
await fileManager.appendText("./log.txt", "New log entry\n");

await fileManager.copy("./source.txt", "./dest.txt");
await fileManager.move("./old.txt", "./new.txt");
await fileManager.delete("./temp.txt");

const exists = await fileManager.exists("./file.txt");
const info = await fileManager.stat("./file.txt");
console.log(`Size: ${info.size} bytes`);

// Watch
const watcher = new FileWatcher({
  path: "./config",
  recursive: true,
  debounce: 300,
});

watcher.on("change", (event) => {
  console.log("Change:", event.path, event.type);
});

await watcher.start();
await watcher.stop();

// Type detection
const detector = new FileTypeDetector();
const type = await detector.detect("./image.png");
console.log(type); // { mime: "image/png", ext: "png", signature: "PNG" }

// Stream large files
const stream = new FileStream();
const reader = await stream.createReader("./large-file.txt");
for await (const chunk of reader) {
  console.log("Chunk:", chunk.length, "bytes");
}

// Compress
const compressor = new FileCompressor();
await compressor.gzip("./data.txt", "./data.txt.gz");
await compressor.gunzip("./data.txt.gz", "./data.txt");

const data = new TextEncoder().encode("Hello, World!");
const compressed = await compressor.compress(data);
const decompressed = await compressor.decompress(compressed);
console.log(new TextDecoder().decode(decompressed)); // "Hello, World!"
```

### URL

```typescript
import {
  build,
  buildQuery,
  join,
  parse,
  parseQuery,
} from "jsr:@dreamer/utils/url";

const url = "https://example.com/path?name=Alice&age=25";
const parsed = parse(url);
// {
//   protocol: "https:",
//   host: "example.com",
//   pathname: "/path",
//   search: "?name=Alice&age=25",
//   hash: ""
// }

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

const joined = join("https://example.com", "path", "to", "resource");
// "https://example.com/path/to/resource"
```

### Format

```typescript
import {
  formatBytes,
  formatDuration,
  formatNumber,
} from "jsr:@dreamer/utils/format";

const size = formatBytes(1024 * 1024 * 5); // "5 MB"
const size2 = formatBytes(1024 * 1024 * 5, { precision: 2 }); // "5.00 MB"

const duration = formatDuration(3661); // "1h 1m 1s"
const duration2 = formatDuration(3661, { format: "HH:mm:ss" }); // "01:01:01"

const num = formatNumber(1234567.89); // "1,234,567.89"
```

### Validator

```typescript
import {
  array,
  email,
  number,
  object,
  string,
  url,
  validate,
} from "jsr:@dreamer/utils/validator";

// Basic
const nameSchema = string().min(2).max(50).required();
const result = validate("Alice", nameSchema);
if (result.success) {
  console.log("Valid:", result.data);
} else {
  console.log("Invalid:", result.errors);
}

// Object
const userSchema = object({
  name: string().min(2).required(),
  age: number().min(18).max(100).required(),
  email: email().required(),
  website: url().optional(),
  tags: array(string()).min(1).optional(),
});

const userData = {
  name: "Alice",
  age: 25,
  email: "alice@example.com",
  website: "https://example.com",
  tags: ["developer", "designer"],
};

const userResult = validate(userData, userSchema);
if (userResult.success) {
  console.log("Valid:", userResult.data);
} else {
  userResult.errors.forEach((error) => {
    console.log(`${error.path}: ${error.message}`);
  });
}

// Custom rules
const passwordSchema = string()
  .min(8)
  .custom((value) => {
    if (!/[A-Z]/.test(value)) return "Must contain uppercase";
    if (!/[a-z]/.test(value)) return "Must contain lowercase";
    if (!/[0-9]/.test(value)) return "Must contain digit";
    return true;
  })
  .required();

// Transform and default
const configSchema = object({
  port: number().default(3000).transform((v) => Number(v)),
  debug: boolean().default(false),
  timeout: number().min(0).default(5000),
});

// Conditional
const conditionalSchema = object({
  type: string().required(),
  email: string().when("type", {
    is: "email",
    then: (schema) => schema.email().required(),
    otherwise: (schema) => schema.optional(),
  }),
});
```

### Client HTTP - [📖 Docs](./docs/client/http.md)

```typescript
import { HttpClient } from "jsr:@dreamer/utils/client/http";

const client = new HttpClient({
  baseURL: "https://api.example.com",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptors
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error instanceof Response && error.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

const response = await client.get("/users");
const users = await response.json();

const newUser = await client.post("/users", {
  name: "Alice",
  email: "alice@example.com",
});

// Upload with progress
const formData = new FormData();
formData.append("file", fileInput.files[0]);

await client.upload("/upload", formData, {
  onProgress: (progress) => {
    console.log(`Upload: ${progress.percent}%`);
  },
});

// Download with progress
const blob = await client.download("/files/document.pdf", {
  onProgress: (progress) => {
    console.log(`Download: ${progress.percent}%`);
  },
});

// Auto retry
const response = await client.get("/api/data", {
  retry: true,
  retryOptions: {
    retries: 3,
    retryDelay: 1000,
    exponentialBackoff: true,
  },
});
```

### Client Validator - [📖 Docs](./docs/client/validator.md)

```typescript
import {
  number,
  object,
  string,
  validate,
} from "jsr:@dreamer/utils/client/validator";

const schema = object({
  name: string().min(2).required(),
  age: number().min(18).required(),
});

const result = validate({ name: "Alice", age: 25 }, schema);
if (result.success) {
  console.log("Valid:", result.data);
}
```

### Clipboard - [📖 Docs](./docs/client/clipboard.md)

```typescript
import {
  copyToClipboard,
  isClipboardReadSupported,
  isClipboardSupported,
  readFromClipboard,
} from "jsr:@dreamer/utils/client/clipboard";

await copyToClipboard("Hello, World!");

try {
  await copyToClipboard("Hello, World!");
  console.log("Copied");
} catch (error) {
  console.error("Copy failed:", error);
}

const text = await readFromClipboard();
console.log("Clipboard:", text);

if (isClipboardSupported()) {
  await copyToClipboard("Hello");
} else {
  console.warn("Clipboard not supported");
}

if (isClipboardReadSupported()) {
  const text = await readFromClipboard();
} else {
  console.warn("Clipboard read not supported");
}

// Must be triggered by user interaction
button.addEventListener("click", async () => {
  try {
    await copyToClipboard("Text to copy");
    alert("Copied!");
  } catch (error) {
    alert("Copy failed, please copy manually");
  }
});
```

## File Structure

```
src/
├── array.ts        # Array utils (server/client)
├── string.ts       # String utils (server/client)
├── object.ts       # Object utils (server/client)
├── date.ts         # Date utils (server/client)
├── number.ts       # Number utils (server/client)
├── async.ts        # Async utils (server/client)
├── lock.ts         # Distributed lock (server only)
├── system.ts       # System status (server only)
├── url.ts          # URL utils (server/client)
├── format.ts       # Format utils (server/client)
├── file.ts         # File ops (server: filesystem API)
├── validator.ts    # Validation (server/client)
└── client/
    ├── array.ts    # Re-export server
    ├── string.ts   # Re-export server
    ├── object.ts   # Re-export server
    ├── date.ts     # Re-export server
    ├── number.ts   # Re-export server
    ├── async.ts    # Re-export server
    ├── url.ts      # Re-export server
    ├── format.ts   # Re-export server
    ├── file.ts     # File ops (client: browser File API)
    ├── validator.ts # Re-export server
    ├── clipboard.ts # Clipboard (client only)
    ├── http/       # HTTP client (client only)
    │   ├── mod.ts
    │   ├── client.ts
    │   ├── cookies.ts
    │   ├── interceptors.ts
    │   ├── retry.ts
    │   └── types.ts
    └── README.md
```

---

## ⚡ Performance

- **Tree-shaking**: Import by module, reduce bundle size
- **Type-safe**: Full TypeScript support
- **Pure functions**: No side effects, easy to test

---

## 📝 Notes

- Modular by feature, import only what you need
- Server/client split via `/client` subpath
- Cross-runtime: `@dreamer/runtime-adapter` for Deno/Bun
- Validator: Joi/Yup-like, server and client
- HTTP client: Fetch + XHR, interceptors, retry, progress

---

## Changelog

**[1.0.1]** - 2026-02-20

- **Fixed**: HTTP client retry infinite nesting; upload/download progress tests.
- **Changed**: Test report 244 tests (14 files), HTTP/retry/Validator sections.
- Full history: [CHANGELOG](./docs/en-US/CHANGELOG.md)

---

## 🤝 Contributing

Issues and PRs welcome!

---

## 📄 License

Apache License 2.0 - see [LICENSE](./LICENSE)

---

<div align="center">

**Made with ❤️ by Dreamer Team**

</div>
