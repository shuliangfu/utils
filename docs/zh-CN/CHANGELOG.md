# 变更日志

本项目的所有重要变更均记录于此。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

---

## [1.0.0] - 2026-02-20

### 新增

首个稳定版本。兼容 Deno 与 Bun
的工具函数库，按模块组织常用工具，支持服务端与客户端环境。

#### 核心

- **跨运行时**：Deno 2.6+ 与 Bun 1.3.5+，通过 @dreamer/runtime-adapter 统一 API
- **Tree-shaking**：按模块按需导入，减小打包体积
- **类型安全**：完整 TypeScript 支持

#### 字符串（`string.ts`）

- 截断、格式化、模板
- 大小写转换：camelCase、snakeCase、kebabCase、pascalCase
- 填充、修剪、匹配、替换

#### 数组（`array.ts`）

- 去重：unique、uniqueBy
- 分组：groupBy、groupByKey
- 排序、分块、扁平化
- 集合运算：difference、intersection、union
- 过滤、映射、查找、计数

#### 对象（`object.ts`）

- 深拷贝、合并、深合并
- 路径访问：get、set、has、delete
- 过滤：pick、omit
- 转换：mapKeys、mapValues
- 比较：isEqual、isDeepEqual

#### 日期（`date.ts`）

- 格式化、解析、运算
- 比较：isBefore、isAfter、isSame
- 差值：diffDays、diffHours
- 范围：startOf、endOf
- 相对时间：fromNow、toNow

#### 数字（`number.ts`）

- format、formatCurrency、formatPercent
- 范围：clamp、inRange
- 取整：round、floor、ceil
- 校验：isNumber、isInteger、isFloat

#### 异步（`async.ts`）

- 防抖、节流
- 重试：retry、retryAsync
- 超时：timeout、withTimeout
- 并发：parallel、series、limit
- Promise 工具：sleep、delay

#### 分布式锁（`lock.ts`，仅服务端）

- acquireLock、withLock、lockKey
- 基于 Redis 的分布式锁
- TTL、错误信息、throwOnFail

#### 系统状态（`system.ts`，仅服务端）

- getMemoryInfo、getCpuUsage、getLoadAverage
- getSystemInfo、getSystemStatus、getDiskUsage
- formatBytes、formatUptime

#### URL（`url.ts`）

- 解析、parseQuery、构建、buildQuery
- 编码、解码、拼接、isValid

#### 格式化（`format.ts`）

- formatBytes、formatDuration、formatNumber、formatPercent

#### 校验器（`validator.ts`）

- 基础类型：string、number、boolean、email、url
- 对象 schema、数组校验
- 自定义规则、transform、default、when
- 支持异步校验

#### 文件（`file.ts`，仅服务端）

- FileManager：readText、readBinary、writeText、writeBinary、appendText
- 文件操作：copy、move、delete、exists、stat
- FileWatcher：监听变更、递归、防抖
- FileTypeDetector：MIME、扩展名、魔数
- FileStream：大文件流式读写
- FileCompressor：gzip、gunzip、compress、decompress

#### 客户端模块

- **剪贴板**（`client/clipboard.ts`）：copyToClipboard、readFromClipboard、isClipboardSupported、isClipboardReadSupported
- **HTTP**（`client/http`）：HttpClient，支持拦截器、重试、上传/下载进度、Cookie
- **文件**（`client/file`）：浏览器 File API 集成

#### 导出说明

- **服务端/客户端共用**：array、string、object、date、number、async、url、format、validator
- **仅服务端**：lock、system、file
- **仅客户端**：client/file、client/http、client/clipboard
