# @dreamer/utils/client

> 一个用于浏览器的工具函数库，提供浏览器环境下的工具函数和辅助方法

[![JSR](https://jsr.io/badges/@dreamer/utils/client)](https://jsr.io/@dreamer/utils/client)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 功能

客户端工具函数库，提供常用的工具函数和辅助方法，专为浏览器环境设计。

## 文件组织

客户端工具函数按功能模块化组织，每个功能模块一个文件，支持按需导入：

```
@dreamer/utils/client/
├── array.ts        # 数组操作
├── string.ts       # 字符串处理
├── object.ts       # 对象操作
├── date.ts         # 日期时间处理
├── number.ts       # 数字格式化
├── async.ts        # 异步工具
├── url.ts          # URL 处理
├── format.ts       # 格式化工具
└── file.ts         # 文件操作（浏览器 File API）
```

## 特性

### 数组操作（`array.ts`）

- 数组去重（`unique`、`uniqueBy`）
- 数组分组（`groupBy`、`groupByKey`）
- 数组排序（`sort`、`sortBy`）
- 数组分块（`chunk`）
- 数组扁平化（`flatten`、`flattenDeep`）
- 数组差集/交集/并集（`difference`、`intersection`、`union`）
- 数组统计（`count`、`countBy`）

### 字符串处理（`string.ts`）

- 字符串截断（`truncate`）
- 字符串格式化（`format`、`template`）
- 字符串转换（`camelCase`、`snakeCase`、`kebabCase`、`pascalCase`）
- 字符串填充（`padStart`、`padEnd`）
- 字符串清理（`trim`、`trimStart`、`trimEnd`）

### 对象操作（`object.ts`）

- 深度克隆（`deepClone`）
- 对象合并（`merge`、`deepMerge`）
- 对象路径访问（`get`、`set`、`has`、`deletePath`）
- 对象过滤（`pick`、`omit`）
- 对象比较（`isEqual`、`isDeepEqual`）

### 日期时间处理（`date.ts`）

- 日期格式化（`format`、`formatDate`、`formatTime`）
- 日期计算（`addDays`、`addMonths`、`addYears`）
- 日期比较（`isBefore`、`isAfter`、`isSame`）
- 日期差值（`diffDays`、`diffHours`）
- 相对时间（`fromNow`、`toNow`）

### 数字格式化（`number.ts`）

- 数字格式化（`format`、`formatCurrency`、`formatPercent`）
- 数字转换（`toFixed`、`toPrecision`）
- 数字范围（`clamp`、`inRange`）
- 数字舍入（`round`、`floor`、`ceil`）

### 异步工具（`async.ts`）

- 防抖（`debounce`）
- 节流（`throttle`）
- 重试（`retry`、`retryAsync`）
- 超时控制（`timeout`、`withTimeout`）
- 并发控制（`parallel`、`series`）
- Promise 工具（`sleep`、`delay`）

### URL 处理（`url.ts`）

- URL 解析（`parse`、`parseQuery`）
- URL 构建（`build`、`buildQuery`）
- URL 编码/解码（`encode`、`decode`）
- URL 合并（`join`）
- URL 验证（`isValid`）

### 格式化工具（`format.ts`）

- 文件大小格式化（`formatBytes`）
- 时间格式化（`formatDuration`）
- 数字格式化（`formatNumber`）
- 百分比格式化（`formatPercent`）

### 文件操作（`file.ts` - 客户端）

- 文件读取（`FileReader`）
  - 读取文本文件（`readAsText`）
  - 读取二进制文件（`readAsArrayBuffer`、`readAsUint8Array`）
  - 读取数据 URL（`readAsDataURL`）
- 文件写入（`FileWriter`）
  - 下载文本文件（`downloadText`）
  - 下载二进制文件（`downloadBinary`）
  - 下载 Blob（`downloadBlob`）
- 文件类型检测（`FileTypeDetector`）
  - MIME 类型检测
  - 文件扩展名检测
  - 文件签名检测（Magic Number）
- 文件流处理（`FileStream`）
  - 流式读取大文件
- 文件监控（`FileWatcher`）
  - 监听文件选择
  - 监听拖拽文件
- 文件预览（`FilePreview`）
  - 预览图片
  - 预览文本
  - 预览 PDF

## 使用场景

- 通用工具函数（字符串、数组、对象操作）
- 数据转换和格式化
- 日期时间处理
- 异步操作控制（防抖、节流、重试）
- URL 处理和解析
- 浏览器文件操作（File API）
- 辅助方法

## 安装

```bash
deno add jsr:@dreamer/utils
```

## 环境兼容性

- **浏览器环境**：✅ 支持（所有现代浏览器）
- **服务端**：❌ 不支持（部分功能需要浏览器 API）
- **依赖**：无外部依赖（基于浏览器标准 API）

## 🚀 快速开始

### 数组操作

```typescript
import { unique, groupBy, chunk, flatten, difference } from "jsr:@dreamer/utils/client/array";

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
import { deepClone, merge, get, set, pick, omit, isEqual } from "jsr:@dreamer/utils/client/object";

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
const user = { id: 1, name: "Alice", email: "alice@example.com", password: "***" };
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
import { format, addDays, diffDays, isBefore, fromNow } from "jsr:@dreamer/utils/client/date";

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
const pastDate = new Date(Date.now() - 3600000); // 1小时前
const relative = fromNow(pastDate); // "1 小时前"
```

### 异步工具

```typescript
import { debounce, throttle, retry, withTimeout, sleep } from "jsr:@dreamer/utils/client/async";

// 防抖
const debouncedSearch = debounce((query: string) => {
  console.log("搜索:", query);
}, 300);

// 节流
const throttledScroll = throttle(() => {
  console.log("滚动事件");
}, 100);

// 重试
const result = await retry(
  async () => {
    const response = await fetch("/api/data");
    if (!response.ok) throw new Error("请求失败");
    return response.json();
  },
  { maxAttempts: 3, delay: 1000 }
);

// 超时控制
const result = await withTimeout(
  fetch("/api/data"),
  5000 // 5 秒超时
);

// 延迟
await sleep(1000); // 延迟 1 秒
```

### URL 处理

```typescript
import { parse, build, parseQuery, buildQuery, encode, decode, join, isValid } from "jsr:@dreamer/utils/client/url";

// URL 解析
const parsed = parse("https://example.com/path?name=Alice&age=25#section");
console.log(parsed.hostname); // "example.com"
console.log(parsed.pathname); // "/path"

// URL 构建
const url = build({
  protocol: "https:",
  hostname: "example.com",
  pathname: "/api/users",
  search: "?page=1",
});

// 查询参数解析
const params = parseQuery("name=Alice&age=25");
console.log(params); // { name: "Alice", age: "25" }

// 查询参数构建
const query = buildQuery({ name: "Alice", age: 25 });
console.log(query); // "name=Alice&age=25"

// URL 编码/解码
const encoded = encode("Hello World"); // "Hello%20World"
const decoded = decode("Hello%20World"); // "Hello World"

// URL 合并
const fullUrl = join("https://example.com", "api", "users"); // "https://example.com/api/users"

// URL 验证
const valid = isValid("https://example.com"); // true
```

### 文件操作（客户端）

```typescript
import {
  FileReader,
  FileWriter,
  FileTypeDetector,
  FileStream,
  FileWatcher,
  FilePreview,
} from "jsr:@dreamer/utils/client/file";

// 文件读取
const fileReader = new FileReader();
const text = await fileReader.readAsText(file);
const arrayBuffer = await fileReader.readAsArrayBuffer(file);
const dataURL = await fileReader.readAsDataURL(file);
const uint8Array = await fileReader.readAsUint8Array(file);

// 文件下载
const fileWriter = new FileWriter();
await fileWriter.downloadText("data.txt", "Hello, World!");
await fileWriter.downloadBinary("data.bin", binaryData);

// 文件类型检测
const detector = new FileTypeDetector();
const type = await detector.detect(file);
console.log(type); // { mime: "image/png", ext: "png", signature: "PNG" }

// 流式读取大文件
const stream = new FileStream();
const reader = stream.createReader(file, 64 * 1024); // 64KB 块大小
for await (const chunk of reader) {
  // 处理每个块
  console.log("读取块:", chunk.length, "bytes");
}

// 文件监控
const watcher = new FileWatcher();
const input = document.querySelector('input[type="file"]');
watcher.watchInput(input, { multiple: true });

watcher.on("select", (files) => {
  console.log("选择了文件:", files);
});

// 拖拽文件
const dropZone = document.querySelector("#drop-zone");
watcher.watchDrop(dropZone);

watcher.on("drop", (files) => {
  console.log("拖拽了文件:", files);
});

// 文件预览
const preview = new FilePreview();
const imageURL = await preview.image(imageFile);
const textContent = await preview.text(textFile);
const pdfURL = await preview.pdf(pdfFile);
```

## 与服务端的区别

客户端版本和服务端版本的主要区别：

1. **文件操作**：
   - 客户端：使用浏览器 File API（`FileReader`、`Blob`、`URL.createObjectURL`）
   - 服务端：使用文件系统 API（`readFile`、`writeFile`、`watchFs`）

2. **环境限制**：
   - 客户端：只能在浏览器环境运行，无法访问文件系统
   - 服务端：可以在 Deno/Bun 环境运行，可以访问文件系统

3. **功能差异**：
   - 客户端：提供文件下载、文件预览等浏览器特有功能
   - 服务端：提供文件监控、文件流处理等系统级功能

## 注意事项

1. **浏览器兼容性**：所有功能都基于现代浏览器标准 API，不支持 IE
2. **文件大小限制**：大文件处理建议使用流式读取（`FileStream`）
3. **安全性**：文件下载功能会触发浏览器的下载行为，需要用户交互
4. **类型支持**：需要配置 TypeScript 的 `lib` 选项包含 `dom`

## 与服务端版本的关系

### 共享模块

以下模块在客户端和服务端都可以使用（客户端直接导出服务端版本）：
- `array.ts` - 数组操作
- `string.ts` - 字符串处理
- `object.ts` - 对象操作
- `date.ts` - 日期时间处理
- `number.ts` - 数字格式化
- `async.ts` - 异步工具
- `url.ts` - URL 处理
- `format.ts` - 格式化工具

这些模块都是纯 JavaScript 函数，不依赖任何运行时 API，可以在浏览器和服务端环境使用。

### 服务端专用模块

以下模块仅在服务端可用，客户端不支持：
- `lock.ts` - 分布式锁（需要 Redis）
- `system.ts` - 系统状态（需要系统 API）
- `file.ts` - 文件系统操作（需要文件系统 API）

### 客户端专用模块

以下模块仅在客户端可用：
- `client/file.ts` - 浏览器文件操作（使用 File API、Blob API）

### 设计优势

这样的设计可以：
- **减少代码重复**：共享模块只需维护一份代码
- **保持 API 一致性**：客户端和服务端使用相同的 API
- **明确功能边界**：清楚区分哪些功能在哪些环境可用

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
