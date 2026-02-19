# @dreamer/utils

> 一个兼容 Deno 和 Bun 的工具函数包，提供通用工具函数，按功能模块化组织

[English](./README.md) | 中文 (Chinese)

[![JSR](https://jsr.io/badges/@dreamer/utils)](https://jsr.io/@dreamer/utils)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](./LICENSE)
[![Tests](https://img.shields.io/badge/tests-150%20passed-brightgreen)](./TEST_REPORT.md)

---

## 🎯 功能

工具函数包，提供常用的工具函数和辅助方法，支持服务端（Deno/Bun）和客户端（浏览器）。

## 文件组织

工具函数按功能模块化组织，每个功能模块一个文件，支持按需导入：

```
@dreamer/utils/
├── array.ts        # 数组操作（服务端/客户端共享）
├── string.ts       # 字符串处理（服务端/客户端共享）
├── object.ts       # 对象操作（服务端/客户端共享）
├── date.ts         # 日期时间处理（服务端/客户端共享）
├── number.ts       # 数字格式化（服务端/客户端共享）
├── async.ts        # 异步工具（服务端/客户端共享）
├── lock.ts         # 分布式锁（仅服务端）
├── system.ts       # 系统状态（仅服务端）
├── url.ts          # URL 处理（服务端/客户端共享）
├── format.ts       # 格式化工具（服务端/客户端共享）
├── file.ts         # 文件操作（服务端：文件系统 API）
├── validator.ts    # 数据验证（服务端/客户端共享）
└── client/
    ├── array.ts    # 数组操作（导出服务端版本）
    ├── string.ts   # 字符串处理（导出服务端版本）
    ├── object.ts   # 对象操作（导出服务端版本）
    ├── date.ts     # 日期时间处理（导出服务端版本）
    ├── number.ts   # 数字格式化（导出服务端版本）
    ├── async.ts    # 异步工具（导出服务端版本）
    ├── url.ts      # URL 处理（导出服务端版本）
    ├── format.ts   # 格式化工具（导出服务端版本）
    ├── file.ts     # 文件操作（客户端：浏览器 File API）
    ├── validator.ts # 数据验证（导出服务端版本）
    ├── clipboard.ts # 剪贴板操作（仅客户端）
    ├── http/       # HTTP 客户端（仅客户端）
    │   ├── mod.ts  # 主入口
    │   ├── client.ts # HttpClient 类
    │   ├── cookies.ts # Cookie 管理
    │   ├── interceptors.ts # 拦截器
    │   ├── retry.ts # 重试逻辑
    │   └── types.ts # 类型定义
    └── README.md   # 客户端文档
```

**注意**：

- **共享模块**（`array`、`string`、`object`、`date`、`number`、`async`、`url`、`format`、`validator`）：客户端直接导出服务端版本（纯
  JavaScript，不依赖运行时 API）
- **服务端专用模块**（`lock`、`system`、`file`）：客户端不支持，仅服务端可用
- **客户端专用模块**（`client/file`、`client/http`、`client/clipboard`）：独立的客户端实现（使用浏览器
  File API、Fetch/XHR API 和 Clipboard API）

## 特性

### 字符串处理（`string.ts`） - [📖 详细文档](./docs/string.md)

- 字符串截断（`truncate`）
- 字符串格式化（`format`、`template`）
- 字符串转换（`camelCase`、`snakeCase`、`kebabCase`、`pascalCase`）
- 字符串填充（`padStart`、`padEnd`）
- 字符串清理（`trim`、`trimStart`、`trimEnd`）
- 字符串匹配（`match`、`matchAll`）
- 字符串替换（`replace`、`replaceAll`）

### 数组操作（`array.ts`） - [📖 详细文档](./docs/array.md)

- 数组去重（`unique`、`uniqueBy`）
- 数组分组（`groupBy`、`groupByKey`）
- 数组排序（`sort`、`sortBy`）
- 数组分块（`chunk`）
- 数组扁平化（`flatten`、`flattenDeep`）
- 数组差集/交集/并集（`difference`、`intersection`、`union`）
- 数组过滤（`filter`、`filterBy`）
- 数组映射（`map`、`mapBy`）
- 数组查找（`find`、`findIndex`、`findLast`）
- 数组统计（`count`、`countBy`）

### 对象操作（`object.ts`） - [📖 详细文档](./docs/object.md)

- 深度克隆（`deepClone`）
- 对象合并（`merge`、`deepMerge`）
- 对象路径访问（`get`、`set`、`has`、`delete`）
- 对象键值转换（`keys`、`values`、`entries`）
- 对象过滤（`pick`、`omit`）
- 对象转换（`mapKeys`、`mapValues`）
- 对象比较（`isEqual`、`isDeepEqual`）

### 日期时间处理（`date.ts`） - [📖 详细文档](./docs/date.md)

- 日期格式化（`format`、`formatDate`、`formatTime`）
- 日期解析（`parse`、`parseDate`）
- 日期计算（`addDays`、`addMonths`、`addYears`）
- 日期比较（`isBefore`、`isAfter`、`isSame`）
- 日期差值（`diff`、`diffDays`、`diffHours`）
- 日期范围（`startOf`、`endOf`）
- 相对时间（`fromNow`、`toNow`）

### 数字格式化（`number.ts`） - [📖 详细文档](./docs/number.md)

- 数字格式化（`format`、`formatCurrency`、`formatPercent`）
- 数字转换（`toFixed`、`toPrecision`）
- 数字范围（`clamp`、`inRange`）
- 数字舍入（`round`、`floor`、`ceil`）
- 数字验证（`isNumber`、`isInteger`、`isFloat`）

### 异步工具（`async.ts`） - [📖 详细文档](./docs/async.md)

- 防抖（`debounce`）
- 节流（`throttle`）
- 重试（`retry`、`retryAsync`）
- 超时控制（`timeout`、`withTimeout`）
- 并发控制（`parallel`、`series`、`limit`）
- Promise 工具（`sleep`、`delay`）

### 分布式锁（`lock.ts`） - [📖 详细文档](./docs/lock.md)

- 获取锁（`acquireLock`）
- 使用锁执行函数（`withLock`）
- 锁键名生成（`lockKey`）
- 分布式锁类（`DistributedLock`）

### 系统状态（`system.ts`） - [📖 详细文档](./docs/system.md)

- 内存信息（`getMemoryInfo`）
- CPU 使用率（`getCpuUsage`）
- 系统负载（`getLoadAverage`）
- 系统信息（`getSystemInfo`）
- 磁盘使用（`getDiskUsage`）
- 完整系统状态（`getSystemStatus`）
- 格式化工具（`formatBytes`、`formatUptime`）

### URL 处理（`url.ts`） - [📖 详细文档](./docs/url.md)

- URL 解析（`parse`、`parseQuery`）
- URL 构建（`build`、`buildQuery`）
- URL 编码/解码（`encode`、`decode`）
- URL 合并（`join`）
- URL 验证（`isValid`）

### 格式化工具（`format.ts`） - [📖 详细文档](./docs/format.md)

- 文件大小格式化（`formatBytes`）
- 时间格式化（`formatDuration`）
- 数字格式化（`formatNumber`）
- 百分比格式化（`formatPercent`）

### 数据验证（`validator.ts`） - [📖 详细文档](./docs/validator.md)

- 基础类型验证（`string`、`number`、`boolean`、`email`、`url`）
- 对象结构验证（`object`）
- 数组验证（`array`）
- 自定义验证规则（`custom`）
- 验证转换（`transform`）
- 默认值（`default`）
- 条件验证（`when`）
- 错误消息定制（`message`）
- 异步验证支持

### 文件操作（`file.ts` - 服务端） - [📖 详细文档](./docs/file.md)

- 文件读写（`FileManager`）
  - 读取文本文件（`readText`）
  - 读取二进制文件（`readBinary`）
  - 写入文本文件（`writeText`）
  - 写入二进制文件（`writeBinary`）
  - 追加写入文本文件（`appendText`）
- 文件管理（`FileManager`）
  - 复制文件（`copy`）
  - 移动文件（`move`）
  - 删除文件（`delete`）
  - 检查文件是否存在（`exists`）
  - 获取文件信息（`stat`）
- 文件监控（`FileWatcher`）
  - 监控文件/目录变化
  - 支持递归监控
  - 防抖处理
- 文件类型检测（`FileTypeDetector`）
  - MIME 类型检测
  - 文件扩展名检测
  - 文件签名检测（Magic Number）
- 文件流处理（`FileStream`）
  - 流式读取大文件
  - 流式写入大文件
- 文件压缩/解压（`FileCompressor`）
  - gzip 压缩（`gzip`）
  - gunzip 解压（`gunzip`）
  - 内存压缩/解压（`compress`/`decompress`）

**注意**：客户端文件操作请查看 [client/README.md](./src/client/README.md) 和
[📖 客户端文件文档](./docs/client/file.md)

### 剪贴板操作（`client/clipboard.ts`） - [📖 详细文档](./docs/client/clipboard.md)

- 复制文本到剪贴板（`copyToClipboard`）
- 从剪贴板读取文本（`readFromClipboard`）
- 检查是否支持剪贴板操作（`isClipboardSupported`）
- 检查是否支持读取剪贴板（`isClipboardReadSupported`）

## 使用场景

- 通用工具函数（字符串、数组、对象操作）
- 数据转换和格式化
- 日期时间处理
- 异步操作控制（防抖、节流、重试）
- URL 处理和解析
- 文件操作（服务端和客户端）
- 数据验证（服务端和客户端）
- HTTP 客户端（仅客户端）
- 剪贴板操作（仅客户端）
- 辅助方法

## 安装

```bash
deno add jsr:@dreamer/utils
```

## 环境兼容性

- **运行时要求**：Deno 2.6+ 或 Bun 1.3.5
- **Bun 版本**：要求 Bun 1.0 或更高版本
- **服务端**：✅ 支持（Deno/Bun 运行时）
- **客户端**：✅ 支持（浏览器环境，部分功能受限）
- **依赖**：
  - 核心模块：无外部依赖（纯 TypeScript 实现）
  - `system.ts` 模块：依赖 `@dreamer/runtime-adapter`（用于跨运行时兼容）
  - `lock.ts` 模块：需要 Redis 客户端（如 `ioredis`）

**注意**：

- `system.ts` 模块需要运行时权限（执行系统命令），在浏览器环境中不可用
- `lock.ts` 模块需要 Redis 连接，仅适用于服务端环境
- `file.ts` 模块的压缩功能：
  - Deno 和 Bun：都使用 `npm:pako@2.1.0`（自动安装）

## 导入方式

工具函数按功能模块化组织，支持按需导入：

```typescript
// 按模块导入（推荐）
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

// 或从主入口导入（可选，不推荐，会增加打包体积）
import { deepClone, truncate, unique } from "jsr:@dreamer/utils";
```

## 📚 API 文档

### 字符串处理

```typescript
import {
  camelCase,
  format,
  kebabCase,
  snakeCase,
  truncate,
} from "jsr:@dreamer/utils/string";

// 字符串截断
const text = "这是一段很长的文本";
const truncated = truncate(text, 10); // "这是一段很长的..."
const truncated2 = truncate(text, 10, "..."); // 自定义省略符

// 字符串格式化
const formatted = format("Hello, {name}!", { name: "Alice" }); // "Hello, Alice!"

// 字符串转换
const camel = camelCase("hello_world"); // "helloWorld"
const snake = snakeCase("helloWorld"); // "hello_world"
const kebab = kebabCase("helloWorld"); // "hello-world"
```

### 数组操作

```typescript
import {
  chunk,
  difference,
  flatten,
  groupBy,
  unique,
} from "jsr:@dreamer/utils/array";

// 数组去重
const arr = [1, 2, 2, 3, 3, 3];
const uniqueArr = unique(arr); // [1, 2, 3]

// 对象数组去重（按属性）
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 1, name: "Alice" },
];
const uniqueUsers = uniqueBy(users, "id"); // 按 id 去重

// 数组分组
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

// 数组分块
const chunked = chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]

// 数组扁平化
const nested = [1, [2, [3, 4]]];
const flattened = flatten(nested); // [1, 2, [3, 4]]
const flattenedDeep = flattenDeep(nested); // [1, 2, 3, 4]

// 数组差集
const arr1 = [1, 2, 3, 4];
const arr2 = [3, 4, 5, 6];
const diff = difference(arr1, arr2); // [1, 2]
```

### 对象操作

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

// 深度克隆
const obj = { a: 1, b: { c: 2 } };
const cloned = deepClone(obj); // 完全独立的副本

// 对象合并
const obj1 = { a: 1, b: { c: 2 } };
const obj2 = { b: { d: 3 }, e: 4 };
const merged = merge(obj1, obj2); // { a: 1, b: { c: 2, d: 3 }, e: 4 }
const deepMerged = deepMerge(obj1, obj2); // 深度合并

// 路径访问
const data = { user: { name: "Alice", age: 25 } };
const name = get(data, "user.name"); // "Alice"
set(data, "user.age", 26); // 设置值
const has = has(data, "user.name"); // true

// 对象过滤
const user = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  password: "***",
};
const picked = pick(user, ["id", "name", "email"]); // 只保留指定字段
const omitted = omit(user, ["password"]); // 排除指定字段

// 对象比较
const obj1 = { a: 1, b: { c: 2 } };
const obj2 = { a: 1, b: { c: 2 } };
const equal = isEqual(obj1, obj2); // true
const deepEqual = isDeepEqual(obj1, obj2); // true（深度比较）
```

### 日期时间处理

```typescript
import {
  addDays,
  diffDays,
  format,
  fromNow,
  isBefore,
} from "jsr:@dreamer/utils/date";

// 日期格式化
const date = new Date("2024-01-01");
const formatted = format(date, "YYYY-MM-DD"); // "2024-01-01"
const formatted2 = format(date, "YYYY年MM月DD日"); // "2024年01月01日"

// 日期计算
const tomorrow = addDays(new Date(), 1);
const nextMonth = addMonths(new Date(), 1);
const nextYear = addYears(new Date(), 1);

// 日期比较
const date1 = new Date("2024-01-01");
const date2 = new Date("2024-01-02");
const before = isBefore(date1, date2); // true
const after = isAfter(date2, date1); // true

// 日期差值
const days = diffDays(date1, date2); // 1
const hours = diffHours(date1, date2); // 24

// 相对时间
const relative = fromNow(new Date(Date.now() - 1000 * 60 * 5)); // "5 分钟前"
const relative2 = toNow(new Date(Date.now() + 1000 * 60 * 5)); // "5 分钟后"
```

### 数字格式化

```typescript
import {
  clamp,
  format,
  formatCurrency,
  formatPercent,
  round,
} from "jsr:@dreamer/utils/number";

// 数字格式化
const num = 1234567.89;
const formatted = format(num, "0,0.00"); // "1,234,567.89"
const currency = formatCurrency(num, "USD"); // "$1,234,567.89"
const percent = formatPercent(0.1234); // "12.34%"

// 数字范围
const clamped = clamp(150, 0, 100); // 100（限制在 0-100 之间）
const inRange = inRange(50, 0, 100); // true

// 数字舍入
const rounded = round(3.7); // 4
const floored = floor(3.7); // 3
const ceiled = ceil(3.7); // 4
```

### 异步工具

```typescript
import {
  debounce,
  parallel,
  retry,
  sleep,
  throttle,
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

// 延迟
await sleep(1000); // 延迟 1 秒
```

### 分布式锁

```typescript
import { acquireLock, lockKey, withLock } from "jsr:@dreamer/utils/lock";
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
  },
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

### 系统状态

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

// 获取完整系统状态
const status = await getSystemStatus();
console.log("系统信息:", status.system);
console.log("内存使用率:", status.memory.usagePercent + "%");
console.log("CPU 使用率:", status.cpu.usagePercent + "%");
if (status.loadAverage) {
  console.log("系统负载:", status.loadAverage.load1);
}

// 获取内存信息
const memory = await getMemoryInfo();
console.log(`总内存: ${formatBytes(memory.total)}`);
console.log(`已使用: ${formatBytes(memory.used)}`);
console.log(`可用内存: ${formatBytes(memory.available)}`);
console.log(`内存使用率: ${memory.usagePercent}%`);

// 获取 CPU 使用率
const cpu = await getCpuUsage(200); // 采样间隔 200ms
console.log(`CPU 使用率: ${cpu.usagePercent}%`);
console.log(`用户态: ${cpu.userPercent}%`);
console.log(`内核态: ${cpu.systemPercent}%`);

// 获取系统负载（Linux/macOS）
const load = await getLoadAverage();
if (load) {
  console.log(`1分钟负载: ${load.load1}`);
  console.log(`5分钟负载: ${load.load5}`);
  console.log(`15分钟负载: ${load.load15}`);
}

// 获取系统信息
const system = await getSystemInfo();
console.log(`操作系统: ${system.os}`);
console.log(`系统版本: ${system.osRelease}`);
console.log(`主机名: ${system.hostname}`);
console.log(`架构: ${system.arch}`);
console.log(`运行时间: ${formatUptime(system.uptime)}`);

// 获取磁盘使用信息
const disk = await getDiskUsage("/");
console.log(`总空间: ${formatBytes(disk.total)}`);
console.log(`已使用: ${formatBytes(disk.used)}`);
console.log(`可用空间: ${formatBytes(disk.available)}`);
console.log(`使用率: ${disk.usagePercent}%`);

// 格式化工具
console.log(formatBytes(1024)); // "1.00 KB"
console.log(formatBytes(1048576)); // "1.00 MB"
```

### 文件操作（服务端）

```typescript
import {
  FileCompressor,
  FileManager,
  FileStream,
  FileTypeDetector,
  FileWatcher,
} from "jsr:@dreamer/utils/file";

// 文件读写
const fileManager = new FileManager();

// 读取文本文件
const text = await fileManager.readText("./data.txt");

// 写入文本文件
await fileManager.writeText("./output.txt", "Hello, World!");

// 读取二进制文件
const binary = await fileManager.readBinary("./image.png");

// 写入二进制文件
await fileManager.writeBinary("./output.png", binaryData);

// 追加写入
await fileManager.appendText("./log.txt", "New log entry\n");

// 复制文件
await fileManager.copy("./source.txt", "./dest.txt");

// 移动文件
await fileManager.move("./old.txt", "./new.txt");

// 删除文件
await fileManager.delete("./temp.txt");

// 检查文件是否存在
const exists = await fileManager.exists("./file.txt");

// 获取文件信息
const info = await fileManager.stat("./file.txt");
console.log(`文件大小: ${info.size} bytes`);

// 文件监控
const watcher = new FileWatcher({
  path: "./config",
  recursive: true, // 递归监控
  debounce: 300, // 防抖 300ms
});

watcher.on("change", (event) => {
  console.log("文件变化:", event.path, event.type);
});

await watcher.start();
// ... 使用后停止监控
await watcher.stop();

// 文件类型检测
const detector = new FileTypeDetector();
const type = await detector.detect("./image.png");
console.log(type); // { mime: "image/png", ext: "png", signature: "PNG" }

// 流式处理大文件
const stream = new FileStream();
const reader = await stream.createReader("./large-file.txt");
for await (const chunk of reader) {
  // 处理每个块
  console.log("读取块:", chunk.length, "bytes");
}

// 文件压缩/解压
const compressor = new FileCompressor();

// gzip 压缩文件
await compressor.gzip("./data.txt", "./data.txt.gz");

// gunzip 解压文件
await compressor.gunzip("./data.txt.gz", "./data.txt");

// 内存压缩/解压
const data = new TextEncoder().encode("Hello, World!");
const compressed = await compressor.compress(data);
const decompressed = await compressor.decompress(compressed);
console.log(new TextDecoder().decode(decompressed)); // "Hello, World!"
```

### URL 处理

```typescript
import {
  build,
  buildQuery,
  join,
  parse,
  parseQuery,
} from "jsr:@dreamer/utils/url";

// URL 解析
const url = "https://example.com/path?name=Alice&age=25";
const parsed = parse(url);
// {
//   protocol: "https:",
//   host: "example.com",
//   pathname: "/path",
//   search: "?name=Alice&age=25",
//   hash: ""
// }

// 查询参数解析
const query = parseQuery("name=Alice&age=25");
// { name: "Alice", age: "25" }

// URL 构建
const built = build({
  protocol: "https:",
  host: "example.com",
  pathname: "/path",
  search: "?name=Alice&age=25",
});
// "https://example.com/path?name=Alice&age=25"

// 查询参数构建
const queryString = buildQuery({ name: "Alice", age: 25 });
// "name=Alice&age=25"

// URL 合并
const joined = join("https://example.com", "path", "to", "resource");
// "https://example.com/path/to/resource"
```

### 格式化工具

```typescript
import {
  formatBytes,
  formatDuration,
  formatNumber,
} from "jsr:@dreamer/utils/format";

// 文件大小格式化
const size = formatBytes(1024 * 1024 * 5); // "5 MB"
const size2 = formatBytes(1024 * 1024 * 5, { precision: 2 }); // "5.00 MB"

// 时长格式化
const duration = formatDuration(3661); // "1 小时 1 分钟 1 秒"
const duration2 = formatDuration(3661, { format: "HH:mm:ss" }); // "01:01:01"

// 数字格式化
const num = formatNumber(1234567.89); // "1,234,567.89"
```

### 数据验证

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

// 基础验证
const nameSchema = string().min(2).max(50).required();
const result = validate("Alice", nameSchema);
if (result.success) {
  console.log("验证通过:", result.data);
} else {
  console.log("验证失败:", result.errors);
}

// 对象验证
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
  console.log("用户数据验证通过:", userResult.data);
} else {
  userResult.errors.forEach((error) => {
    console.log(`${error.path}: ${error.message}`);
  });
}

// 自定义验证规则
const passwordSchema = string()
  .min(8)
  .custom((value) => {
    if (!/[A-Z]/.test(value)) {
      return "密码必须包含至少一个大写字母";
    }
    if (!/[a-z]/.test(value)) {
      return "密码必须包含至少一个小写字母";
    }
    if (!/[0-9]/.test(value)) {
      return "密码必须包含至少一个数字";
    }
    return true;
  })
  .required();

// 类型转换和默认值
const configSchema = object({
  port: number().default(3000).transform((v) => Number(v)),
  debug: boolean().default(false),
  timeout: number().min(0).default(5000),
});

// 条件验证
const conditionalSchema = object({
  type: string().required(),
  email: string().when("type", {
    is: "email",
    then: (schema) => schema.email().required(),
    otherwise: (schema) => schema.optional(),
  }),
});
```

### 客户端 HTTP 客户端 - [📖 详细文档](./docs/client/http.md)

```typescript
import { HttpClient } from "jsr:@dreamer/utils/client/http";

// 创建 HTTP 客户端
const client = new HttpClient({
  baseURL: "https://api.example.com",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 配置拦截器
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

// 发送请求
const response = await client.get("/users");
const users = await response.json();

// POST 请求
const newUser = await client.post("/users", {
  name: "Alice",
  email: "alice@example.com",
});

// 文件上传（支持进度）
const formData = new FormData();
formData.append("file", fileInput.files[0]);

await client.upload("/upload", formData, {
  onProgress: (progress) => {
    console.log(`上传进度: ${progress.percent}%`);
  },
});

// 文件下载（支持进度）
const blob = await client.download("/files/document.pdf", {
  onProgress: (progress) => {
    console.log(`下载进度: ${progress.percent}%`);
  },
});

// 自动重试
const response = await client.get("/api/data", {
  retry: true,
  retryOptions: {
    retries: 3,
    retryDelay: 1000,
    exponentialBackoff: true,
  },
});
```

### 客户端数据验证 - [📖 详细文档](./docs/client/validator.md)

```typescript
import {
  number,
  object,
  string,
  validate,
} from "jsr:@dreamer/utils/client/validator";

// 客户端验证与服务端完全兼容
const schema = object({
  name: string().min(2).required(),
  age: number().min(18).required(),
});

const result = validate({ name: "Alice", age: 25 }, schema);
if (result.success) {
  console.log("验证通过:", result.data);
}
```

### 剪贴板操作 - [📖 详细文档](./docs/client/clipboard.md)

```typescript
import {
  copyToClipboard,
  isClipboardReadSupported,
  isClipboardSupported,
  readFromClipboard,
} from "jsr:@dreamer/utils/client/clipboard";

// 复制文本到剪贴板
await copyToClipboard("Hello, World!");

// 带错误处理
try {
  await copyToClipboard("Hello, World!");
  console.log("复制成功");
} catch (error) {
  console.error("复制失败:", error);
}

// 从剪贴板读取文本
const text = await readFromClipboard();
console.log("剪贴板内容:", text);

// 检查是否支持剪贴板操作
if (isClipboardSupported()) {
  await copyToClipboard("Hello");
} else {
  console.warn("浏览器不支持剪贴板操作");
}

// 检查是否支持读取剪贴板
if (isClipboardReadSupported()) {
  const text = await readFromClipboard();
} else {
  console.warn("浏览器不支持读取剪贴板");
}

// 在点击事件中使用（必须由用户交互触发）
button.addEventListener("click", async () => {
  try {
    await copyToClipboard("要复制的文本");
    alert("复制成功！");
  } catch (error) {
    alert("复制失败，请手动复制");
  }
});
```

## 文件结构

```
src/
├── array.ts        # 数组操作工具（服务端/客户端共享）
├── string.ts       # 字符串处理工具（服务端/客户端共享）
├── object.ts       # 对象操作工具（服务端/客户端共享）
├── date.ts         # 日期时间处理工具（服务端/客户端共享）
├── number.ts       # 数字格式化工具（服务端/客户端共享）
├── async.ts        # 异步工具（服务端/客户端共享）
├── lock.ts         # 分布式锁（仅服务端）
├── system.ts       # 系统状态（仅服务端）
├── url.ts          # URL 处理工具（服务端/客户端共享）
├── format.ts       # 格式化工具（服务端/客户端共享）
├── file.ts         # 文件操作（服务端：文件系统 API）
├── validator.ts    # 数据验证（服务端/客户端共享）
└── client/
    ├── array.ts    # 数组操作（导出服务端版本）
    ├── string.ts   # 字符串处理（导出服务端版本）
    ├── object.ts   # 对象操作（导出服务端版本）
    ├── date.ts     # 日期时间处理（导出服务端版本）
    ├── number.ts   # 数字格式化（导出服务端版本）
    ├── async.ts    # 异步工具（导出服务端版本）
    ├── url.ts      # URL 处理（导出服务端版本）
    ├── format.ts   # 格式化工具（导出服务端版本）
    ├── file.ts     # 文件操作（客户端：浏览器 File API）
    ├── validator.ts # 数据验证（导出服务端版本）
    ├── clipboard.ts # 剪贴板操作（仅客户端）
    ├── http/       # HTTP 客户端（仅客户端）
    │   ├── mod.ts  # 主入口
    │   ├── client.ts # HttpClient 类
    │   ├── cookies.ts # Cookie 管理
    │   ├── interceptors.ts # 拦截器
    │   ├── retry.ts # 重试逻辑
    │   └── types.ts # 类型定义
    └── README.md   # 客户端文档
```

---

## ⚡ 性能优化

- **按需导入**：支持按模块导入，只导入需要的功能，减少打包体积
- **Tree-shaking**：支持 Tree-shaking，未使用的代码会被自动移除
- **类型安全**：完整的 TypeScript 类型支持，编译时类型检查
- **无副作用**：所有工具函数都是纯函数，无副作用，易于测试和优化

---

## 📝 备注

- **工具函数按功能模块化组织**：每个功能一个文件，支持按需导入
- **支持按需导入**：减少打包体积，支持 Tree-shaking
- **所有工具函数都是纯函数**：无副作用，易于测试和优化
- **完整的 TypeScript 类型支持**：编译时类型检查
- **服务端和客户端分离**：通过 `/client` 子路径明确区分服务端和客户端代码
- **代码复用**：大部分客户端模块直接导出服务端版本（纯 JavaScript 函数）
- **跨运行时兼容**：使用 `@dreamer/runtime-adapter` 实现 Deno 和 Bun 兼容性
- **数据验证**：提供类似 Joi/Yup 的验证功能，支持服务端和客户端
- **HTTP 客户端**：智能结合 Fetch 和 XHR，支持拦截器、重试、进度追踪等功能

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可证

Apache License 2.0 - 详见 [LICENSE](./LICENSE)

---

<div align="center">

**Made with ❤️ by Dreamer Team**

</div>
