# Distributed Lock

> Redis-based distributed lock utilities for preventing concurrent access to
> shared resources.

[![JSR](https://jsr.io/badges/@dreamer/utils)](https://jsr.io/@dreamer/utils)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)

---

## Overview

Distributed lock utilities using Redis. Server-only; not for browser.

---

## Features

- **Atomic acquire**: Redis SET ... EX ... NX
- **Atomic release**: Lua script; delete only when value matches
- **TTL**: Auto-expire to avoid deadlock
- **Safe release**: Delete only when lock value matches
- **withLock**: Auto acquire/release; releases on exception
- **Options**: Custom error message; optional throw on failure

---

## Installation

```bash
deno add jsr:@dreamer/utils
```

---

## Environment compatibility

- **Runtime**: Deno 2.6+ or Bun 1.3.5+
- **Server**: ✅ Supported (requires Redis client)
- **Client**: ❌ Not supported
- **Dependencies**: Redis client (e.g. `npm:ioredis`, `npm:redis`)

---

## Quick start

```typescript
import { acquireLock, lockKey, withLock } from "jsr:@dreamer/utils/lock";
import { Redis } from "npm:ioredis";

const redis = new Redis("redis://localhost:6379");

// Option 1: Manual acquire and release
const lock = await acquireLock(redis, "lock:user:123", {
  ttl: 10, // 10s TTL
  errorMessage: "Operation in progress, please try again later",
});

if (lock) {
  try {
    await doSomething();
  } finally {
    await lock.release();
  }
}

// Option 2: withLock (recommended)
const result = await withLock(
  redis,
  lockKey("withdraw", "user123"), // "lock:withdraw:user123"
  async () => {
    return await processWithdrawal("user123", 1000);
  },
  {
    ttl: 10,
    errorMessage: "Withdrawal in progress, please try again later",
  },
);

// Option 3: Do not throw on failure
const lock2 = await acquireLock(redis, "lock:user:456", {
  ttl: 10,
  throwOnFail: false,
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

---

## API Reference

### acquireLock

Acquire a distributed lock.

```typescript
function acquireLock(
  redis: RedisClient,
  key: string,
  options?: DistributedLockOptions,
): Promise<DistributedLock | null>;
```

**Parameters**:

- `redis: RedisClient` - Redis client (ioredis / node-redis compatible)
- `key: string` - Lock key
- `options`: `ttl` (seconds, default 30), `throwOnFail` (default true),
  `errorMessage`

**Returns**: Lock instance, or null if failed and `throwOnFail` is false

**Example**:

```typescript
const lock = await acquireLock(redis, "lock:user:123", {
  ttl: 10,
  errorMessage: "Operation in progress, please try again later",
});
```

---

### withLock

Run a function with a lock; lock is acquired before and released after
(including on error).

```typescript
function withLock<T>(
  redis: RedisClient,
  key: string,
  fn: () => Promise<T>,
  options?: DistributedLockOptions,
): Promise<T>;
```

**Parameters**:

- `redis: RedisClient` - Redis client
- `key: string` - Lock key
- `fn: () => Promise<T>` - Async function to run
- `options` - Same as acquireLock

**Returns**: Result of `fn`

**Example**:

```typescript
const result = await withLock(
  redis,
  "lock:withdraw:user123",
  async () => await processWithdrawal("user123", 1000),
  { ttl: 10, errorMessage: "Withdrawal in progress, please try again later" },
);
```

---

### lockKey

Build a lock key with a consistent format.

```typescript
function lockKey(prefix: string, ...parts: (string | number)[]): string;
```

**Parameters**:

- `prefix: string` - Key prefix
- `...parts` - Key parts

**Returns**: `lock:{prefix}:{parts.join(":")}`

**Example**:

```typescript
lockKey("withdraw", "user123"); // "lock:withdraw:user123"
lockKey("order", "user123", "order456"); // "lock:order:user123:order456"
```

---

### DistributedLock

Lock instance.

#### acquire

Try to acquire (used internally).

```typescript
async acquire(): Promise<boolean>
```

#### release

Release the lock. Uses Lua so only the owner can delete.

```typescript
async release(): Promise<void>
```

#### isAcquired

Whether the lock is currently held by this instance.

```typescript
isAcquired(): boolean
```

---

## Use cases

- **Concurrency**: Ensure only one process operates on a resource
- **Scheduling**: Ensure a job runs in only one process
- **Resource contention**: Limit access to shared resources
- **Idempotency**: Prevent duplicate submissions

---

## Performance

- **Atomicity**: Redis commands and Lua scripts
- **TTL**: Prevents deadlock
- **Safe release**: Value check prevents deleting others’ locks

---

## Notes

- **Server only**: Requires Redis client
- **Compatibility**: Works with ioredis and node-redis
- **Atomicity**: Acquire and release are atomic
- **Type-safe**: Full TypeScript support

---

## See also

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
