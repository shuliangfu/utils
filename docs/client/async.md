# Client Async 异步工具

> 客户端异步工具函数模块，直接导出服务端版本

[![JSR](https://jsr.io/badges/@dreamer/utils)](https://jsr.io/@dreamer/utils)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🎯 功能

客户端异步工具函数，直接导出服务端版本，所有功能与服务端完全兼容。

---

## ✨ 特性

客户端版本与服务端版本功能完全相同，包括：
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
- **客户端**：✅ 支持（浏览器环境）
- **依赖**：无外部依赖（纯 TypeScript 实现）

---

## 🚀 快速开始

```typescript
import {
  debounce,
  throttle,
  retry,
  withTimeout,
  parallel,
  series,
  sleep,
  delay,
} from "jsr:@dreamer/utils/client/async";

// 使用方式与服务端版本完全相同
const debouncedFn = debounce((value: string) => {
  console.log("搜索:", value);
}, 300);

const throttledFn = throttle(() => {
  console.log("滚动事件");
}, 100);

const result = await retry(
  async () => {
    const response = await fetch("/api/data");
    if (!response.ok) throw new Error("请求失败");
    return response.json();
  },
  { maxAttempts: 3, delay: 1000 }
);
```

---

## 📚 API 文档

客户端版本的所有 API 与服务端版本完全相同，请参考 [服务端文档](../async.md)。

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

## 📝 备注

- **完全兼容**：客户端版本直接导出服务端版本，功能完全相同
- **类型安全**：完整的 TypeScript 类型支持
- **纯函数**：所有函数都是纯函数，无副作用

---

## 🔗 相关链接

- [服务端版本](../async.md)
- [JSR 包页面](https://jsr.io/@dreamer/utils)

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可证

MIT License - 详见 [LICENSE.md](../../../LICENSE.md)

---

<div align="center">

**Made with ❤️ by Dreamer Team**

</div>
