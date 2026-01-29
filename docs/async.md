# Async 异步工具

> 异步工具函数模块，提供防抖、节流、重试、超时控制、并发控制、延迟等功能

[![JSR](https://jsr.io/badges/@dreamer/utils)](https://jsr.io/@dreamer/utils)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🎯 功能

异步工具函数，提供常用的异步操作方法，支持服务端和客户端。

---

## ✨ 特性

- **防抖**：
  - 在指定时间内只执行最后一次调用（`debounce`）
- **节流**：
  - 在指定时间内最多执行一次（`throttle`）
- **重试**：
  - 自动重试失败的操作（`retry`）
  - 支持指数退避策略
  - 自定义重试条件
- **超时控制**：
  - 为 Promise 添加超时限制（`withTimeout`）
- **并发控制**：
  - 并发执行多个任务（`parallel`）
  - 限制并发数
  - 顺序执行任务（`series`）
- **延迟**：
  - 延迟指定时间（`sleep`、`delay`）

---

## 📦 安装

```bash
deno add jsr:@dreamer/utils
```

---

## 🌍 环境兼容性

- **运行时要求**：Deno 2.6+ 或 Bun 1.3.5
- **服务端**：✅ 支持
- **客户端**：✅ 支持（通过 `jsr:@dreamer/utils/client/async`）
- **依赖**：无外部依赖（纯 TypeScript 实现）

---

## 🚀 快速开始

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

// 防抖
const debouncedFn = debounce((value: string) => {
  console.log("搜索:", value);
}, 300);

// 用户输入时，300ms 内不再输入才执行
input.addEventListener("input", (e) => {
  debouncedFn(e.target.value);
});

// 节流
const throttledFn = throttle(() => {
  console.log("滚动事件");
}, 100);

// 滚动时，每 100ms 最多执行一次
window.addEventListener("scroll", throttledFn);

// 重试
const result = await retry(
  async () => {
    const response = await fetch("/api/data");
    if (!response.ok) throw new Error("请求失败");
    return response.json();
  },
  { maxAttempts: 3, delay: 1000 },
);

// 超时控制
const result = await withTimeout(
  fetch("/api/data"),
  5000, // 5 秒超时
);

// 并发控制
const results = await parallel(
  [
    () => fetch("/api/user/1"),
    () => fetch("/api/user/2"),
    () => fetch("/api/user/3"),
  ],
  { concurrency: 2 }, // 最多 2 个并发
);

// 顺序执行
const results = await series([
  () => fetch("/api/step1"),
  () => fetch("/api/step2"),
  () => fetch("/api/step3"),
]);

// 延迟
await sleep(1000); // 延迟 1 秒
await delay(1000); // 延迟 1 秒（sleep 的别名）
```

---

## 📚 API 文档

### debounce

防抖函数，在指定时间内只执行最后一次调用。

```typescript
function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void;
```

**参数**：

- `fn: T` - 要防抖的函数
- `delay: number` - 延迟时间（毫秒）

**返回**：防抖后的函数

**示例**：

```typescript
const debouncedSearch = debounce((query: string) => {
  console.log("搜索:", query);
}, 300);

// 快速输入时，只会在停止输入 300ms 后执行
debouncedSearch("a");
debouncedSearch("ab");
debouncedSearch("abc"); // 只有这次会执行
```

---

### throttle

节流函数，在指定时间内最多执行一次。

```typescript
function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void;
```

**参数**：

- `fn: T` - 要节流的函数
- `delay: number` - 延迟时间（毫秒）

**返回**：节流后的函数

**示例**：

```typescript
const throttledScroll = throttle(() => {
  console.log("滚动事件");
}, 100);

// 滚动时，每 100ms 最多执行一次
window.addEventListener("scroll", throttledScroll);
```

---

### retry

重试异步函数，失败时自动重试。

```typescript
function retry<T>(
  fn: () => Promise<T>,
  options?: RetryOptions,
): Promise<T>;
```

**参数**：

- `fn: () => Promise<T>` - 要重试的异步函数
- `options: RetryOptions` - 重试选项

**RetryOptions**：

- `maxAttempts?: number` - 最大尝试次数（默认 3）
- `delay?: number` - 延迟时间（毫秒，默认 1000）
- `backoff?: number` - 延迟增长因子（默认 1）
- `shouldRetry?: (error: Error) => boolean` - 是否应该重试的判断函数

**返回**：Promise，成功时返回结果，失败时抛出错误

**示例**：

```typescript
const result = await retry(
  async () => {
    const response = await fetch("/api/data");
    if (!response.ok) throw new Error("请求失败");
    return response.json();
  },
  {
    maxAttempts: 3,
    delay: 1000,
    backoff: 2, // 延迟时间每次翻倍：1s, 2s, 4s
    shouldRetry: (error) => {
      // 只在网络错误时重试
      return error.message.includes("网络");
    },
  },
);
```

---

### withTimeout

超时控制，为 Promise 添加超时限制。

```typescript
function withTimeout<T>(
  promise: Promise<T>,
  timeout: number,
): Promise<T>;
```

**参数**：

- `promise: Promise<T>` - 要控制的 Promise
- `timeout: number` - 超时时间（毫秒）

**返回**：Promise，超时时抛出错误

**示例**：

```typescript
try {
  const result = await withTimeout(
    fetch("/api/data"),
    5000, // 5 秒超时
  );
} catch (error) {
  if (error.message.includes("超时")) {
    console.log("请求超时");
  }
}
```

---

### parallel

并发执行多个异步函数，支持限制并发数。

```typescript
function parallel<T>(
  tasks: (() => Promise<T>)[],
  options?: ConcurrencyOptions,
): Promise<T[]>;
```

**参数**：

- `tasks: (() => Promise<T>)[]` - 异步函数数组
- `options: ConcurrencyOptions` - 并发选项

**ConcurrencyOptions**：

- `concurrency?: number` - 并发数（默认不限制）

**返回**：Promise，返回所有任务的结果数组

**示例**：

```typescript
const results = await parallel(
  [
    () => fetch("/api/user/1").then((r) => r.json()),
    () => fetch("/api/user/2").then((r) => r.json()),
    () => fetch("/api/user/3").then((r) => r.json()),
  ],
  { concurrency: 2 }, // 最多 2 个并发
);
```

---

### series

顺序执行多个异步函数。

```typescript
function series<T>(
  tasks: (() => Promise<T>)[],
): Promise<T[]>;
```

**参数**：

- `tasks: (() => Promise<T>)[]` - 异步函数数组

**返回**：Promise，返回所有任务的结果数组

**示例**：

```typescript
const results = await series([
  () => fetch("/api/step1").then((r) => r.json()),
  () => fetch("/api/step2").then((r) => r.json()),
  () => fetch("/api/step3").then((r) => r.json()),
]);
// 按顺序执行，前一个完成后才执行下一个
```

---

### sleep

延迟指定时间。

```typescript
function sleep(ms: number): Promise<void>;
```

**参数**：

- `ms: number` - 延迟时间（毫秒）

**返回**：Promise，延迟完成后 resolve

**示例**：

```typescript
await sleep(1000); // 延迟 1 秒
console.log("1 秒后");
```

---

### delay

延迟指定时间（sleep 的别名）。

```typescript
function delay(ms: number): Promise<void>;
```

**参数**：

- `ms: number` - 延迟时间（毫秒）

**返回**：Promise，延迟完成后 resolve

**示例**：

```typescript
await delay(1000); // 延迟 1 秒
```

---

## 🎯 使用场景

- **防抖**：搜索输入、窗口 resize 事件
- **节流**：滚动事件、鼠标移动事件
- **重试**：网络请求失败重试
- **超时控制**：限制请求时间
- **并发控制**：批量处理数据，限制并发数
- **顺序执行**：需要按顺序执行的任务
- **延迟**：定时任务、动画延迟

---

## ⚡ 性能优化

- **防抖和节流**：减少函数执行次数，提高性能
- **并发控制**：避免过多并发请求，保护服务器资源
- **超时控制**：避免长时间等待，及时释放资源

---

## 📝 备注

- **类型安全**：完整的 TypeScript 类型支持
- **纯函数**：所有函数都是纯函数，无副作用
- **客户端兼容**：客户端版本通过 `jsr:@dreamer/utils/client/async` 使用

---

## 🔗 相关链接

- [客户端版本](../client/async.md)
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
