# Async Utilities

> Async utility module providing debounce, throttle, retry, timeout, concurrency
> control, and delay.

[![JSR](https://jsr.io/badges/@dreamer/utils)](https://jsr.io/@dreamer/utils)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)

---

## Overview

Async utility functions for debouncing, throttling, retry, timeout, and
concurrency. Supported in both server and client environments.

---

## Features

- **Debounce**: Execute only the last call within a time window (`debounce`)
- **Throttle**: Execute at most once per time window (`throttle`)
- **Retry**: Auto-retry failed async work (`retry`), optional backoff and custom
  condition
- **Timeout**: Wrap a Promise with a timeout (`withTimeout`)
- **Concurrency**: `parallel` (with optional concurrency limit), `series`
- **Delay**: `sleep`, `delay`

---

## Installation

```bash
deno add jsr:@dreamer/utils
```

---

## Environment compatibility

- **Runtime**: Deno 2.6+ or Bun 1.3.5+
- **Server**: ✅ Supported
- **Client**: ✅ Supported (via `jsr:@dreamer/utils/client/async`)
- **Dependencies**: None (pure TypeScript)

---

## Quick start

```typescript
import {
  debounce,
  delay,
  parallel,
  retry,
  series,
  sleep,
  throttle,
  withTimeout,
} from "jsr:@dreamer/utils/async";

// Debounce
const debouncedFn = debounce((value: string) => {
  console.log("Search:", value);
}, 300);
input.addEventListener("input", (e) => {
  debouncedFn((e.target as HTMLInputElement).value);
});

// Throttle
const throttledFn = throttle(() => {
  console.log("Scroll");
}, 100);
window.addEventListener("scroll", throttledFn);

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
  5000, // 5s
);

// Parallel with concurrency
const results = await parallel(
  [
    () => fetch("/api/user/1"),
    () => fetch("/api/user/2"),
    () => fetch("/api/user/3"),
  ],
  { concurrency: 2 },
);

// Series
const results = await series([
  () => fetch("/api/step1"),
  () => fetch("/api/step2"),
  () => fetch("/api/step3"),
]);

// Delay
await sleep(1000);
await delay(1000); // alias for sleep
```

---

## API Reference

### debounce

Return a function that runs only after `delay` ms of no further calls.

```typescript
function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void;
```

**Parameters**:

- `fn: T` - Function to debounce
- `delay: number` - Delay in ms

**Returns**: Debounced function

**Example**:

```typescript
const debouncedSearch = debounce((query: string) => {
  console.log("Search:", query);
}, 300);
debouncedSearch("a");
debouncedSearch("ab");
debouncedSearch("abc"); // only this run executes
```

---

### throttle

Return a function that runs at most once per `delay` ms.

```typescript
function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void;
```

**Parameters**:

- `fn: T` - Function to throttle
- `delay: number` - Interval in ms

**Returns**: Throttled function

**Example**:

```typescript
const throttledScroll = throttle(() => {
  console.log("Scroll");
}, 100);
window.addEventListener("scroll", throttledScroll);
```

---

### retry

Retry an async function on failure.

```typescript
function retry<T>(
  fn: () => Promise<T>,
  options?: RetryOptions,
): Promise<T>;
```

**Parameters**:

- `fn: () => Promise<T>` - Async function to retry
- `options: RetryOptions` - Optional config

**RetryOptions**:

- `maxAttempts?: number` - Max attempts (default 3)
- `delay?: number` - Delay in ms (default 1000)
- `backoff?: number` - Multiplier for delay each attempt (default 1)
- `shouldRetry?: (error: Error) => boolean` - Whether to retry on this error

**Returns**: Promise that resolves with result or throws after all retries

**Example**:

```typescript
const result = await retry(
  async () => {
    const response = await fetch("/api/data");
    if (!response.ok) throw new Error("Request failed");
    return response.json();
  },
  {
    maxAttempts: 3,
    delay: 1000,
    backoff: 2,
    shouldRetry: (error) => error.message.includes("network"),
  },
);
```

---

### withTimeout

Reject if the promise does not settle within `timeout` ms.

```typescript
function withTimeout<T>(
  promise: Promise<T>,
  timeout: number,
): Promise<T>;
```

**Parameters**:

- `promise: Promise<T>` - Promise to wrap
- `timeout: number` - Timeout in ms

**Returns**: Same promise; rejects on timeout

**Example**:

```typescript
try {
  const result = await withTimeout(
    fetch("/api/data"),
    5000,
  );
} catch (error) {
  if (String(error).includes("timeout")) {
    console.log("Request timed out");
  }
}
```

---

### parallel

Run async functions in parallel, with optional concurrency limit.

```typescript
function parallel<T>(
  tasks: (() => Promise<T>)[],
  options?: ConcurrencyOptions,
): Promise<T[]>;
```

**Parameters**:

- `tasks: (() => Promise<T>)[]` - Array of async functions
- `options: ConcurrencyOptions` - Optional: `concurrency?: number`

**Returns**: Promise of array of results

**Example**:

```typescript
const results = await parallel(
  [
    () => fetch("/api/user/1").then((r) => r.json()),
    () => fetch("/api/user/2").then((r) => r.json()),
    () => fetch("/api/user/3").then((r) => r.json()),
  ],
  { concurrency: 2 },
);
```

---

### series

Run async functions one after another.

```typescript
function series<T>(
  tasks: (() => Promise<T>)[],
): Promise<T[]>;
```

**Parameters**:

- `tasks: (() => Promise<T>)[]` - Array of async functions

**Returns**: Promise of array of results

**Example**:

```typescript
const results = await series([
  () => fetch("/api/step1").then((r) => r.json()),
  () => fetch("/api/step2").then((r) => r.json()),
  () => fetch("/api/step3").then((r) => r.json()),
]);
```

---

### sleep

Resolve after `ms` milliseconds.

```typescript
function sleep(ms: number): Promise<void>;
```

**Parameters**:

- `ms: number` - Delay in ms

**Returns**: Promise that resolves after delay

**Example**:

```typescript
await sleep(1000);
console.log("1 second later");
```

---

### delay

Alias for `sleep`.

```typescript
function delay(ms: number): Promise<void>;
```

**Parameters**:

- `ms: number` - Delay in ms

**Returns**: Promise that resolves after delay

**Example**:

```typescript
await delay(1000);
```

---

## Use cases

- **Debounce**: Search input, resize
- **Throttle**: Scroll, mousemove
- **Retry**: Failed network requests
- **Timeout**: Avoid hanging requests
- **Parallel**: Batch work with limited concurrency
- **Series**: Sequential steps
- **Delay**: Timers, animations

---

## Performance

- **Debounce/throttle**: Fewer executions, less load
- **Concurrency**: Protects server and client resources
- **Timeout**: Frees resources when slow

---

## Notes

- **Type-safe**: Full TypeScript support
- **Client**: Use `jsr:@dreamer/utils/client/async` in the browser

---

## See also

- [Client module](client/async.md)
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
