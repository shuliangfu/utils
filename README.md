# @dreamer/utils

一个用于 Deno 的工具函数库，提供通用工具函数，按功能模块化组织。

## 功能

工具函数库，提供常用的工具函数和辅助方法，支持服务端和客户端。

## 文件组织

工具函数按功能模块化组织，每个功能模块一个文件，支持按需导入：

```
@dreamer/utils/
├── array.ts        # 数组操作
├── string.ts       # 字符串处理
├── object.ts       # 对象操作
├── date.ts         # 日期时间处理
├── number.ts       # 数字格式化
├── async.ts        # 异步工具
├── url.ts          # URL 处理
├── format.ts       # 格式化工具
└── mod.ts          # 主入口（可选，导出所有工具）
```

## 特性

### 字符串处理（`string.ts`）

- 字符串截断（`truncate`）
- 字符串格式化（`format`、`template`）
- 字符串转换（`camelCase`、`snakeCase`、`kebabCase`、`pascalCase`）
- 字符串填充（`padStart`、`padEnd`）
- 字符串清理（`trim`、`trimStart`、`trimEnd`）
- 字符串匹配（`match`、`matchAll`）
- 字符串替换（`replace`、`replaceAll`）

### 数组操作（`array.ts`）

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

### 对象操作（`object.ts`）

- 深度克隆（`deepClone`）
- 对象合并（`merge`、`deepMerge`）
- 对象路径访问（`get`、`set`、`has`、`delete`）
- 对象键值转换（`keys`、`values`、`entries`）
- 对象过滤（`pick`、`omit`）
- 对象转换（`mapKeys`、`mapValues`）
- 对象比较（`isEqual`、`isDeepEqual`）

### 日期时间处理（`date.ts`）

- 日期格式化（`format`、`formatDate`、`formatTime`）
- 日期解析（`parse`、`parseDate`）
- 日期计算（`addDays`、`addMonths`、`addYears`）
- 日期比较（`isBefore`、`isAfter`、`isSame`）
- 日期差值（`diff`、`diffDays`、`diffHours`）
- 日期范围（`startOf`、`endOf`）
- 相对时间（`fromNow`、`toNow`）

### 数字格式化（`number.ts`）

- 数字格式化（`format`、`formatCurrency`、`formatPercent`）
- 数字转换（`toFixed`、`toPrecision`）
- 数字范围（`clamp`、`inRange`）
- 数字舍入（`round`、`floor`、`ceil`）
- 数字验证（`isNumber`、`isInteger`、`isFloat`）

### 异步工具（`async.ts`）

- 防抖（`debounce`）
- 节流（`throttle`）
- 重试（`retry`、`retryAsync`）
- 超时控制（`timeout`、`withTimeout`）
- 并发控制（`parallel`、`series`、`limit`）
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

## 使用场景

- 通用工具函数（字符串、数组、对象操作）
- 数据转换和格式化
- 日期时间处理
- 异步操作控制（防抖、节流、重试）
- URL 处理和解析
- 辅助方法

## 优先级

⭐⭐⭐⭐

## 安装

```bash
deno add jsr:@dreamer/utils
```

## 环境兼容性

- **Deno 版本**：要求 Deno 2.5 或更高版本
- **服务端**：✅ 支持（Deno 运行时）
- **客户端**：✅ 支持（浏览器环境）
- **依赖**：无外部依赖（纯 TypeScript 实现）

## 导入方式

工具函数按功能模块化组织，支持按需导入：

```typescript
// 按模块导入（推荐）
import { unique, groupBy, chunk } from "jsr:@dreamer/utils/array";
import { truncate, format, camelCase } from "jsr:@dreamer/utils/string";
import { deepClone, merge, get } from "jsr:@dreamer/utils/object";
import { format, addDays, diffDays } from "jsr:@dreamer/utils/date";
import { format, clamp, round } from "jsr:@dreamer/utils/number";
import { debounce, throttle, retry } from "jsr:@dreamer/utils/async";
import { parse, build, parseQuery } from "jsr:@dreamer/utils/url";
import { formatBytes, formatDuration } from "jsr:@dreamer/utils/format";

// 或从主入口导入（可选，不推荐，会增加打包体积）
import { unique, truncate, deepClone } from "jsr:@dreamer/utils";
```

## 示例用法

### 字符串处理

```typescript
import { truncate, format, camelCase, snakeCase, kebabCase } from "jsr:@dreamer/utils/string";

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
import { unique, groupBy, chunk, flatten, difference } from "jsr:@dreamer/utils/array";

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
import { deepClone, merge, get, set, pick, omit, isEqual } from "jsr:@dreamer/utils/object";

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
import { format, addDays, diffDays, isBefore, fromNow } from "jsr:@dreamer/utils/date";

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
import { format, formatCurrency, formatPercent, clamp, round } from "jsr:@dreamer/utils/number";

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
import { debounce, throttle, retry, sleep, parallel } from "jsr:@dreamer/utils/async";

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
  { maxAttempts: 3, delay: 1000 }
);

// 超时控制
const result = await withTimeout(
  fetch("/api/data"),
  5000 // 5 秒超时
);

// 并发控制
const results = await parallel(
  [
    () => fetch("/api/user/1"),
    () => fetch("/api/user/2"),
    () => fetch("/api/user/3"),
  ],
  { concurrency: 2 } // 最多 2 个并发
);

// 延迟
await sleep(1000); // 延迟 1 秒
```

### URL 处理

```typescript
import { parse, build, parseQuery, buildQuery, join } from "jsr:@dreamer/utils/url";

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
import { formatBytes, formatDuration, formatNumber } from "jsr:@dreamer/utils/format";

// 文件大小格式化
const size = formatBytes(1024 * 1024 * 5); // "5 MB"
const size2 = formatBytes(1024 * 1024 * 5, { precision: 2 }); // "5.00 MB"

// 时长格式化
const duration = formatDuration(3661); // "1 小时 1 分钟 1 秒"
const duration2 = formatDuration(3661, { format: "HH:mm:ss" }); // "01:01:01"

// 数字格式化
const num = formatNumber(1234567.89); // "1,234,567.89"
```

## 文件结构

```
src/
├── array.ts        # 数组操作工具
├── string.ts       # 字符串处理工具
├── object.ts       # 对象操作工具
├── date.ts         # 日期时间处理工具
├── number.ts       # 数字格式化工具
├── async.ts        # 异步工具
├── url.ts          # URL 处理工具
├── format.ts       # 格式化工具
└── mod.ts          # 主入口（可选，重新导出所有工具）
```

## 性能优化

- **按需导入**：支持按模块导入，只导入需要的功能，减少打包体积
- **Tree-shaking**：支持 Tree-shaking，未使用的代码会被自动移除
- **类型安全**：完整的 TypeScript 类型支持，编译时类型检查
- **无副作用**：所有工具函数都是纯函数，无副作用，易于测试和优化


## 备注

- 工具函数按功能模块化组织，每个功能一个文件
- 支持按需导入，减少打包体积
- 所有工具函数都是纯函数，无副作用
- 完整的 TypeScript 类型支持
- 支持服务端和客户端，API 完全一致
