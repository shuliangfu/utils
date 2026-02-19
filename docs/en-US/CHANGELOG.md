# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

---

## [1.0.1] - 2026-02-20

### Fixed

- **HTTP client retry**: Moved retry logic from `requestWithFetch` catch to
  `request()` level to prevent infinite nesting of `withRetry` when fetch always
  throws (retry tests no longer hang or OOM).
- **HTTP tests**: Upload/download progress tests now receive progress events
  (Mock XHR dispatches progress; upload test waits for listener registration).
  Retry tests moved to `http-retry.test.ts` and pass with `retryDelay: 0`.

### Changed

- **Test report**: Updated to 244 tests (14 files), added HTTP client, HTTP
  retry, Validator sections; en-US and zh-CN TEST_REPORT in sync.

---

## [1.0.0] - 2026-02-19

### Added

First stable release. Utility function library compatible with Deno and Bun.
Common utilities organized by module, supporting both server and client
environments.

#### Core

- **Cross-runtime**: Deno 2.6+ and Bun 1.3.5+, unified API via
  @dreamer/runtime-adapter
- **Tree-shaking**: Import by module, reduce bundle size
- **Type-safe**: Full TypeScript support

#### String (`string.ts`)

- Truncate, format, template
- Case conversion: camelCase, snakeCase, kebabCase, pascalCase
- Padding, trimming, matching, replace

#### Array (`array.ts`)

- Deduplication: unique, uniqueBy
- Grouping: groupBy, groupByKey
- Sorting, chunking, flattening
- Set operations: difference, intersection, union
- Filtering, mapping, finding, counting

#### Object (`object.ts`)

- Deep clone, merge, deepMerge
- Path access: get, set, has, delete
- Filtering: pick, omit
- Transform: mapKeys, mapValues
- Comparison: isEqual, isDeepEqual

#### Date (`date.ts`)

- Format, parse, arithmetic
- Comparison: isBefore, isAfter, isSame
- Diff: diffDays, diffHours
- Range: startOf, endOf
- Relative time: fromNow, toNow

#### Number (`number.ts`)

- Format, formatCurrency, formatPercent
- Range: clamp, inRange
- Rounding: round, floor, ceil
- Validation: isNumber, isInteger, isFloat

#### Async (`async.ts`)

- Debounce, throttle
- Retry: retry, retryAsync
- Timeout: timeout, withTimeout
- Concurrency: parallel, series, limit
- Promise utils: sleep, delay

#### Distributed Lock (`lock.ts` - server only)

- acquireLock, withLock, lockKey
- Redis-based distributed lock
- TTL, error message, throwOnFail

#### System Status (`system.ts` - server only)

- getMemoryInfo, getCpuUsage, getLoadAverage
- getSystemInfo, getSystemStatus, getDiskUsage
- formatBytes, formatUptime

#### URL (`url.ts`)

- Parse, parseQuery, build, buildQuery
- Encode, decode, join, isValid

#### Format (`format.ts`)

- formatBytes, formatDuration, formatNumber, formatPercent

#### Validator (`validator.ts`)

- Basic types: string, number, boolean, email, url
- Object schema, array validation
- Custom rules, transform, default, when
- Async validation support

#### File (`file.ts` - server)

- FileManager: readText, readBinary, writeText, writeBinary, appendText
- File ops: copy, move, delete, exists, stat
- FileWatcher: watch changes, recursive, debounce
- FileTypeDetector: MIME, extension, magic number
- FileStream: stream read/write for large files
- FileCompressor: gzip, gunzip, compress, decompress

#### Client Modules

- **Clipboard** (`client/clipboard.ts`): copyToClipboard, readFromClipboard,
  isClipboardSupported, isClipboardReadSupported
- **HTTP** (`client/http`): HttpClient with interceptors, retry, upload/download
  progress, cookies
- **File** (`client/file`): Browser File API integration

#### Exports

- **Server/Client shared**: array, string, object, date, number, async, url,
  format, validator
- **Server only**: lock, system, file
- **Client only**: client/file, client/http, client/clipboard
