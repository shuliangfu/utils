# @dreamer/utils 测试报告

> 报告生成时间：2026-02-20

## 📊 测试概览

- **测试框架**：@dreamer/test
- **测试环境**：Deno 2.6+ / Bun 1.3.5
- **测试总数**：244
- **通过**：244
- **失败**：0
- **通过率**：100%

## ✅ 测试结果汇总

| 模块        | 测试文件             | 用例数  | 通过    | 失败  | 状态   |
| ----------- | -------------------- | ------- | ------- | ----- | ------ |
| 数组操作    | `array.test.ts`      | 15      | 15      | 0     | ✅     |
| 异步工具    | `async.test.ts`      | 12      | 12      | 0     | ✅     |
| 日期/时间   | `date.test.ts`       | 12      | 12      | 0     | ✅     |
| 文件操作    | `file.test.ts`       | 38      | 38      | 0     | ✅     |
| 格式化工具  | `format.test.ts`     | 9       | 9       | 0     | ✅     |
| HTTP 客户端 | `http.test.ts`       | 61      | 61      | 0     | ✅     |
| HTTP 重试   | `http-retry.test.ts` | 4       | 4       | 0     | ✅     |
| 分布式锁    | `lock.test.ts`       | 11      | 11      | 0     | ✅     |
| 数字格式化  | `number.test.ts`     | 9       | 9       | 0     | ✅     |
| 对象操作    | `object.test.ts`     | 15      | 15      | 0     | ✅     |
| 字符串处理  | `string.test.ts`     | 23      | 23      | 0     | ✅     |
| 系统状态    | `system.test.ts`     | 9       | 9       | 0     | ✅     |
| URL 处理    | `url.test.ts`        | 13      | 13      | 0     | ✅     |
| 校验器      | `validator.test.ts`  | 13      | 13      | 0     | ✅     |
| **合计**    | **14 个文件**        | **244** | **244** | **0** | **✅** |

## 📋 详细测试覆盖

### 1. 数组操作（`array.test.ts`）- 15 个用例

#### unique / uniqueBy

- ✅ 应移除重复元素
- ✅ 应保持顺序
- ✅ 应按属性去重

#### groupBy

- ✅ 应按字符串键分组
- ✅ 应按函数分组

#### chunk

- ✅ 应分块数组
- ✅ 应处理空数组

#### flatten / flattenDeep

- ✅ 应展平一层
- ✅ 应深度展平

#### difference / intersection / union

- ✅ 应返回差集
- ✅ 应返回交集
- ✅ 应返回并集

#### count / countBy

- ✅ 应统计元素出现次数
- ✅ 应按属性统计

### 2. 字符串处理（`string.test.ts`）- 23 个用例

#### truncate

- ✅ 应截断超长字符串
- ✅ 应保持短字符串不变
- ✅ 应支持自定义省略号

#### format

- ✅ 应替换占位符
- ✅ 应处理多个占位符
- ✅ 应处理不存在的键

#### 命名转换（camelCase / snakeCase / kebabCase / pascalCase）

- ✅ camelCase：应从 kebab-case 转换
- ✅ camelCase：应从 snake_case 转换
- ✅ camelCase：应从空格分隔转换
- ✅ snakeCase：应从 camelCase 转换
- ✅ snakeCase：应从 kebab-case 转换
- ✅ kebabCase：应从 camelCase 转换
- ✅ kebabCase：应从 snake_case 转换
- ✅ pascalCase：应从 kebab-case 转换
- ✅ pascalCase：应从 snake_case 转换

#### 补位（padStart / padEnd）

- ✅ padStart：应左侧补位
- ✅ padStart：应使用默认空格补位
- ✅ padEnd：应右侧补位
- ✅ padEnd：应使用默认空格补位

#### 去空格（trim / trimStart / trimEnd）

- ✅ trim：应去除首尾空白
- ✅ trimStart：应去除首部空白
- ✅ trimEnd：应去除尾部空白

### 3. 对象操作（`object.test.ts`）- 15 个用例

#### deepClone

- ✅ 应深拷贝对象
- ✅ 应拷贝数组
- ✅ 应拷贝 Date

#### merge / deepMerge

- ✅ 应浅合并对象
- ✅ 应深合并对象

#### 路径操作（get / set / has / deletePath）

- ✅ get：应获取路径值
- ✅ get：应返回默认值
- ✅ set：应设置路径值
- ✅ has：应检查路径是否存在
- ✅ deletePath：应删除路径值

#### 过滤（pick / omit）

- ✅ pick：应选取指定属性
- ✅ omit：应排除指定属性

#### 比较（isEqual / isDeepEqual）

- ✅ 应浅比较对象
- ✅ 应深比较对象

### 4. 日期/时间处理（`date.test.ts`）- 12 个用例

#### format

- ✅ 应格式化日期

#### 日期运算（addDays / addMonths / addYears）

- ✅ 应增加天数
- ✅ 应增加月数
- ✅ 应增加年数

#### 日期比较（isBefore / isAfter / isSame）

- ✅ 应判断日期是否早于
- ✅ 应判断日期是否晚于
- ✅ 应判断两日期是否相同

#### 日期差（diffDays / diffHours）

- ✅ 应计算天数差
- ✅ 应计算小时差

#### 相对时间（fromNow / toNow）

- ✅ 应返回相对时间（fromNow）
- ✅ 应返回相对时间（toNow）

### 5. 数字格式化（`number.test.ts`）- 9 个用例

#### format / formatCurrency / formatPercent

- ✅ 应格式化数字
- ✅ 应格式化货币
- ✅ 应格式化百分比

#### clamp / inRange

- ✅ 应将数字限制在范围内
- ✅ 应判断数字是否在范围内

#### 取整（round / floor / ceil）

- ✅ 应四舍五入
- ✅ 应向下取整
- ✅ 应向上取整

### 6. 异步工具（`async.test.ts`）- 12 个用例

#### debounce / throttle

- ✅ 应防抖函数
- ✅ 应节流函数

#### retry

- ✅ 应重试失败操作
- ✅ 应在达到最大次数后抛出

#### withTimeout

- ✅ 应在超时时抛出
- ✅ 应在超时前完成

#### parallel

- ✅ 应并行执行任务
- ✅ 应限制并发数

#### series

- ✅ 应串行执行任务

#### sleep / delay

- ✅ 应延迟指定时间
- ✅ 应为 sleep 的别名

### 7. URL 处理（`url.test.ts`）- 13 个用例

#### parse

- ✅ 应解析 URL
- ✅ 应在无效 URL 时抛出错误

#### parseQuery

- ✅ 应解析查询字符串

#### build

- ✅ 应构建 URL

#### buildQuery

- ✅ 应构建查询字符串
- ✅ 应忽略 null 与 undefined

#### encode / decode

- ✅ 应编码字符串
- ✅ 应解码字符串

#### join

- ✅ 应拼接 URL 路径
- ✅ 应处理多余斜杠

#### isValid

- ✅ 应校验有效 URL
- ✅ 应校验无效 URL

### 8. 格式化工具（`format.test.ts`）- 9 个用例

#### formatBytes

- ✅ 应格式化字节
- ✅ 应使用指定单位
- ✅ 应使用指定精度

#### formatDuration

- ✅ 应格式化时长（人类可读）
- ✅ 应格式化时长（HH:mm:ss）

#### formatNumber

- ✅ 应格式化数字
- ✅ 应使用指定分隔符

#### formatPercent

- ✅ 应格式化百分比

### 9. 文件操作（`file.test.ts`）- 38 个用例

#### FileManager - 9 个用例

- ✅ readText/writeText：应读写文本文件
- ✅ readBinary/writeBinary：应读写二进制文件
- ✅ appendText：应追加到文本文件
- ✅ appendText：应追加到不存在文件（新建）
- ✅ copy：应复制文件
- ✅ move：应移动文件（重命名）
- ✅ exists：应检查文件是否存在
- ✅ stat：应获取文件信息
- ✅ delete：应删除文件

#### FileWatcher - 3 个用例

- ✅ 应监听文件变更事件
- ✅ 应支持移除监听器
- ✅ 应开始与停止监听

#### FileTypeDetector - 5 个用例

- ✅ 应获取文件扩展名
- ✅ 应按扩展名获取 MIME 类型
- ✅ 应识别 PNG 文件类型
- ✅ 应识别 JPEG 文件类型
- ✅ 应按扩展名识别未知签名文件

#### FileStream - 2 个用例

- ✅ 应创建文件读流
- ✅ 应创建文件写流

#### FileCompressor - 13 个用例

**gzip/gunzip（文件操作）**

- ✅ 应压缩并解压文件
- ✅ 应支持自定义压缩级别

**compress/decompress（内存）**

- ✅ 应压缩并解压数据（内存）
- ✅ 应支持自定义压缩级别（内存）
- ✅ 应处理空数据
- ✅ 应处理二进制数据

**错误处理**

- ✅ 源文件不存在时应抛出（gzip）
- ✅ 压缩文件不存在时应抛出（gunzip）
- ✅ 无效数据解压时应抛出或返回错误

**压缩级别**

- ✅ 应支持全部压缩级别（1-9）
- ✅ 应使用默认压缩级别（6）

**完整性**

- ✅ 应压缩并解压大文件（约 100KB）
- ✅ 应压缩并解压含特殊字符文件（CJK、emoji、换行等）

### 10. 系统状态（`system.test.ts`）- 9 个用例

- ✅ 应获取内存信息
- ✅ 应获取 CPU 使用率
- ✅ 应获取系统负载（若可用）
- ✅ 应获取系统信息
- ✅ 应获取磁盘使用情况
- ✅ 应获取完整系统状态
- ✅ 应格式化字节
- ✅ 应格式化运行时间

**说明**：部分系统状态测试需要 Deno 的 `--allow-sys` 与 `--allow-run`
权限。测试会捕获权限错误并验证错误处理。

### 11. 分布式锁（`lock.test.ts`）- 11 个用例

#### lockKey

- ✅ 应生成格式化的锁键名

#### acquireLock

- ✅ 应成功获取锁
- ✅ 应无法获取已存在的锁
- ✅ 获取失败时应抛出（默认）
- ✅ 应支持自定义错误信息

#### DistributedLock

- ✅ 应释放锁

#### withLock

- ✅ 应自动获取并释放锁
- ✅ 应返回函数结果
- ✅ 函数报错时应释放锁
- ✅ 获取失败时应抛出

### 12. HTTP 客户端（`http.test.ts`）- 61 个用例

#### HttpClient

- ✅ 构造函数、URL 构建、HTTP 方法（GET/POST/PUT/DELETE/PATCH/HEAD/OPTIONS）
- ✅ 请求头、拦截器（请求/响应）、Cookie 管理
- ✅ 超时、文件上传（FormData/File、进度）、文件下载（Blob、进度）
- ✅ 错误处理、请求配置（credentials、mode）

#### ClientCookieManager

- ✅ set / get / remove / getAll（含空值、编码等边界情况）

#### InterceptorManager

- ✅ 请求/响应拦截器：注册、执行、移除、清空、错误处理

### 13. HTTP 重试（`http-retry.test.ts`）- 4 个用例

- ✅ 失败时应重试（固定重试次数）
- ✅ 应使用指数退避策略
- ✅ 仅当满足重试条件时才重试（如 404 不重试）

### 14. 校验器（`validator.test.ts`）- 13 个用例

#### string / number / object

- ✅ 字符串校验（必填、最小/最大长度、邮箱）
- ✅ 数字校验（最小/最大值）
- ✅ 对象结构校验

#### options.messages

- ✅ 默认消息、自定义消息、部分覆盖

## 🔍 测试覆盖分析

### 功能覆盖

| 模块        | 覆盖    | 说明                                 |
| ----------- | ------- | ------------------------------------ |
| 数组操作    | ✅ 100% | 主要数组方法                         |
| 异步工具    | ✅ 100% | 防抖、节流、重试、超时、并发         |
| 日期/时间   | ✅ 100% | 格式化、运算、比较、差值、相对时间   |
| 文件操作    | ✅ 100% | 读写、监听、类型检测、流、压缩       |
| 格式化工具  | ✅ 100% | 字节、时长、数字、百分比             |
| HTTP 客户端 | ✅ 100% | Fetch/XHR、拦截器、Cookie、上传/下载 |
| HTTP 重试   | ✅ 100% | 失败重试、指数退避、条件重试         |
| 分布式锁    | ✅ 100% | 获取、释放、自动管理                 |
| 数字格式化  | ✅ 100% | 格式化、范围、取整                   |
| 对象操作    | ✅ 100% | 克隆、合并、路径操作、过滤、比较     |
| 字符串处理  | ✅ 100% | 转换、格式化、去空格                 |
| 系统状态    | ✅ 100% | 内存、CPU、负载、磁盘、系统信息      |
| URL 处理    | ✅ 100% | 解析、构建、编码、校验               |
| 校验器      | ✅ 100% | 字符串/数字/对象规则；自定义消息     |

### 边界情况覆盖

- ✅ 空数据/数组/对象处理
- ✅ 无效输入错误处理
- ✅ 文件不存在错误处理
- ✅ 压缩/解压错误处理
- ✅ 特殊字符（CJK、emoji）
- ✅ 大文件处理（100KB+）
- ✅ 二进制数据处理

### 跨运行时兼容

- ✅ **Deno 2.6+**：全部通过
- ✅ **Bun 1.3.5**：全部通过（使用 pako）

## 🚀 运行测试

### Deno

```bash
# 运行全部测试
deno test --allow-read --allow-write --allow-env --allow-net --allow-sys --allow-run

# 运行指定测试文件
deno test tests/file.test.ts --allow-read --allow-write --allow-env
```

### Bun

```bash
# 运行全部测试
bun test

# 运行指定测试文件
bun test tests/file.test.ts
```

## 📝 测试环境

- **Deno**：2.5+
- **Bun**：1.0+
- **测试框架**：@dreamer/test
- **压缩库**：pako@2.1.0 (npm)

## ✨ FileCompressor 测试

文件压缩/解压共 **13 个用例**，全部通过：

1. **文件压缩/解压**（2 个用例）
   - 基本文件压缩与解压
   - 自定义压缩级别

2. **内存压缩/解压**（4 个用例）
   - 基本内存压缩与解压
   - 自定义压缩级别
   - 空数据处理
   - 二进制数据处理

3. **错误处理**（3 个用例）
   - 源文件不存在
   - 压缩文件不存在
   - 无效数据解压

4. **压缩级别**（2 个用例）
   - 支持全部级别（1-9）
   - 默认级别（6）

5. **完整性**（2 个用例）
   - 大文件压缩/解压
   - 含特殊字符文件压缩/解压

## 🎯 测试质量

- **覆盖**：100%（所有模块均有测试）
- **边界情况**：覆盖充分
- **错误处理**：完整覆盖
- **跨运行时**：Deno 与 Bun 均通过
- **性能**：包含大文件与并发测试

## 📌 说明

1. **系统状态测试**：部分需要 Deno 的
   `--allow-sys`、`--allow-run`，测试会正确捕获并验证权限错误。
2. **文件监听测试**：可能耗时较长（防抖延迟）。
3. **压缩**：使用 `npm:pako@2.1.0`，Deno 与 Bun 均支持。

## ✅ 结论

**244 个测试用例**全部通过，**100%** 覆盖。所有模块均经过充分测试，包括 HTTP
客户端、重试、校验器与 FileCompressor，可用于生产环境。

---

**报告生成时间**：2026-02-20 **测试框架**：@dreamer/test **压缩库**：pako@2.1.0
