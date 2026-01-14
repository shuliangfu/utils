# Lock 分布式锁

> 分布式锁工具函数模块，提供基于 Redis 的分布式锁功能，用于防止并发操作

[![JSR](https://jsr.io/badges/@dreamer/utils)](https://jsr.io/@dreamer/utils)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🎯 功能

分布式锁工具，提供基于 Redis 的分布式锁功能，用于防止并发操作，仅支持服务端。

---

## ✨ 特性

- **原子性获取锁**：
  - 使用 Redis SET ... EX ... NX 命令
  - 保证原子性操作
- **原子性释放锁**：
  - 使用 Lua 脚本保证原子性
  - 只有锁的值匹配时才删除
- **自动过期**：
  - 支持 TTL，防止死锁
- **安全释放**：
  - 只有锁的值匹配时才删除，防止误删
- **自动管理**：
  - `withLock` 自动获取和释放锁
  - 异常时自动释放
- **错误处理**：
  - 支持自定义错误消息
  - 支持获取锁失败时不抛出错误

---

## 📦 安装

```bash
deno add jsr:@dreamer/utils
```

---

## 🌍 环境兼容性

- **运行时要求**：Deno 2.6+ 或 Bun 1.3.5
- **服务端**：✅ 支持（需要 Redis 客户端）
- **客户端**：❌ 不支持
- **依赖**：需要 Redis 客户端（如 `npm:ioredis` 或 `npm:redis`）

---

## 🚀 快速开始

```typescript
import { acquireLock, withLock, lockKey } from "jsr:@dreamer/utils/lock";
import { Redis } from "npm:ioredis";

const redis = new Redis("redis://localhost:6379");

// 方式1：手动获取和释放锁
const lock = await acquireLock(redis, "lock:user:123", {
  ttl: 10, // 10秒过期
  errorMessage: "操作正在进行中，请稍后重试",
});

if (lock) {
  try {
    // 执行需要互斥的操作
    await doSomething();
  } finally {
    // 释放锁
    await lock.release();
  }
}

// 方式2：使用 withLock 自动管理锁（推荐）
const result = await withLock(
  redis,
  lockKey("withdraw", "user123"), // 生成锁键名: "lock:withdraw:user123"
  async () => {
    // 执行需要互斥的操作
    return await processWithdrawal("user123", 1000);
  },
  {
    ttl: 10, // 10秒过期
    errorMessage: "提现操作正在进行中，请稍后重试",
  }
);

// 方式3：获取锁失败时不抛出错误
const lock2 = await acquireLock(redis, "lock:user:456", {
  ttl: 10,
  throwOnFail: false, // 失败时不抛出错误，返回 null
});

if (lock2) {
  // 成功获取锁
  try {
    await doSomething();
  } finally {
    await lock2.release();
  }
} else {
  // 锁已被占用
  console.log("操作正在进行中");
}
```

---

## 📚 API 文档

### acquireLock

获取分布式锁。

```typescript
function acquireLock(
  redis: RedisClient,
  key: string,
  options?: DistributedLockOptions,
): Promise<DistributedLock | null>
```

**参数**：
- `redis: RedisClient` - Redis 客户端（兼容 ioredis 和 node-redis）
- `key: string` - 锁的键名
- `options: DistributedLockOptions` - 选项

**DistributedLockOptions**：
- `ttl?: number` - 锁的过期时间（秒，默认 30）
- `throwOnFail?: boolean` - 获取锁失败时是否抛出错误（默认 true）
- `errorMessage?: string` - 获取锁失败时的错误消息

**返回**：分布式锁实例，如果获取失败且 `throwOnFail` 为 false，返回 null

**示例**：
```typescript
const lock = await acquireLock(redis, "lock:user:123", {
  ttl: 10,
  errorMessage: "操作正在进行中，请稍后重试",
});
```

---

### withLock

使用锁执行函数，自动获取和释放锁。

```typescript
function withLock<T>(
  redis: RedisClient,
  key: string,
  fn: () => Promise<T>,
  options?: DistributedLockOptions,
): Promise<T>
```

**参数**：
- `redis: RedisClient` - Redis 客户端
- `key: string` - 锁的键名
- `fn: () => Promise<T>` - 要执行的函数
- `options: DistributedLockOptions` - 选项

**返回**：函数执行结果

**示例**：
```typescript
const result = await withLock(
  redis,
  "lock:withdraw:user123",
  async () => {
    return await processWithdrawal("user123", 1000);
  },
  {
    ttl: 10,
    errorMessage: "提现操作正在进行中，请稍后重试",
  }
);
```

---

### lockKey

生成锁键名，统一锁键名格式。

```typescript
function lockKey(prefix: string, ...parts: (string | number)[]): string
```

**参数**：
- `prefix: string` - 前缀
- `...parts: (string | number)[]` - 键名部分

**返回**：格式化的锁键名（格式：`lock:{prefix}:{parts.join(":")}`）

**示例**：
```typescript
const key = lockKey("withdraw", "user123"); // "lock:withdraw:user123"
const key2 = lockKey("order", "user123", "order456"); // "lock:order:user123:order456"
```

---

### DistributedLock

分布式锁类，提供锁的获取和释放功能。

#### acquire

尝试获取锁。

```typescript
async acquire(): Promise<boolean>
```

**返回**：是否成功获取锁

#### release

释放锁。

```typescript
async release(): Promise<void>
```

**注意**：使用 Lua 脚本保证原子性，只有锁的值匹配时才删除。

#### isAcquired

检查锁是否已获取。

```typescript
isAcquired(): boolean
```

**返回**：是否已获取锁

---

## 🎯 使用场景

- **防止并发操作**：防止同一资源被多个进程同时操作
- **分布式任务调度**：确保任务只被一个进程执行
- **资源竞争控制**：控制对共享资源的访问
- **防止重复操作**：防止用户重复提交

---

## ⚡ 性能优化

- **原子性操作**：使用 Redis 原子命令和 Lua 脚本
- **自动过期**：TTL 防止死锁
- **安全释放**：只有锁的值匹配时才删除，防止误删

---

## 📝 备注

- **仅服务端**：此模块仅支持服务端，需要 Redis 客户端
- **Redis 客户端**：兼容 ioredis 和 node-redis 等常见 Redis 客户端
- **原子性保证**：使用 Redis 原子命令和 Lua 脚本保证原子性
- **死锁防护**：TTL 自动过期，防止死锁
- **类型安全**：完整的 TypeScript 类型支持

---

## 🔗 相关链接

- [JSR 包页面](https://jsr.io/@dreamer/utils)

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可证

MIT License - 详见 [LICENSE.md](../../LICENSE.md)

---

<div align="center">

**Made with ❤️ by Dreamer Team**

</div>
