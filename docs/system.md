# System 系统状态

> 系统状态工具函数模块，提供获取系统状态参数的工具方法，包括
> CPU、内存、磁盘、网络等信息

[![JSR](https://jsr.io/badges/@dreamer/utils)](https://jsr.io/@dreamer/utils)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🎯 功能

系统状态工具，提供获取系统状态参数的方法，包括
CPU、内存、磁盘、网络等信息，仅支持服务端。

---

## ✨ 特性

- **内存信息**：
  - 获取内存使用情况（`getMemoryInfo`）
  - 总内存、已使用、可用内存
  - 内存使用率
- **CPU 使用率**：
  - 获取 CPU 使用率（`getCpuUsage`）
  - 用户态和内核态使用率
  - 支持采样间隔配置
- **系统负载**：
  - 获取系统负载（`getLoadAverage`）
  - 1分钟、5分钟、15分钟平均负载
  - Linux/macOS 支持
- **系统信息**：
  - 获取系统信息（`getSystemInfo`）
  - 操作系统类型、版本、主机名、架构
  - 系统运行时间
- **磁盘使用**：
  - 获取磁盘使用情况（`getDiskUsage`）
  - 总空间、已使用、可用空间
  - 使用率
- **完整系统状态**：
  - 获取完整系统状态（`getSystemStatus`）
  - 包含所有系统信息
- **格式化工具**：
  - 格式化字节数（`formatBytes`）
  - 格式化运行时间（`formatUptime`）

---

## 📦 安装

```bash
deno add jsr:@dreamer/utils
```

---

## 🌍 环境兼容性

- **运行时要求**：Deno 2.6+ 或 Bun 1.3.5
- **服务端**：✅ 支持（需要系统权限）
- **客户端**：❌ 不支持
- **依赖**：依赖 `@dreamer/runtime-adapter`（用于跨运行时兼容）

**权限要求**：

- Deno：需要 `--allow-sys` 和 `--allow-run` 权限
- Bun：需要系统权限

---

## 🚀 快速开始

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
console.log(formatUptime(3661)); // "1 小时 1 分钟 1 秒"
```

---

## 📚 API 文档

### getSystemStatus

获取完整系统状态。

```typescript
function getSystemStatus(): Promise<SystemStatus>;
```

**返回**：完整的系统状态

**SystemStatus**：

```typescript
interface SystemStatus {
  system: SystemInfo; // 系统信息
  memory: MemoryInfo; // 内存信息
  cpu: CpuUsagePercent; // CPU 使用率
  loadAverage?: LoadAverage; // 系统负载（Linux/macOS）
}
```

**示例**：

```typescript
const status = await getSystemStatus();
console.log("系统信息:", status.system);
console.log("内存使用率:", status.memory.usagePercent + "%");
console.log("CPU 使用率:", status.cpu.usagePercent + "%");
```

---

### getMemoryInfo

获取内存信息。

```typescript
function getMemoryInfo(): Promise<MemoryInfo>;
```

**返回**：内存信息

**MemoryInfo**：

```typescript
interface MemoryInfo {
  total: number; // 总内存（字节）
  available: number; // 可用内存（字节）
  used: number; // 已使用内存（字节）
  usagePercent: number; // 内存使用率（百分比，0-100）
  free: number; // 空闲内存（字节）
}
```

**示例**：

```typescript
const memory = await getMemoryInfo();
console.log(`总内存: ${formatBytes(memory.total)}`);
console.log(`已使用: ${formatBytes(memory.used)}`);
console.log(`内存使用率: ${memory.usagePercent}%`);
```

---

### getCpuUsage

获取 CPU 使用率。

```typescript
function getCpuUsage(sampleInterval?: number): Promise<CpuUsagePercent>;
```

**参数**：

- `sampleInterval?: number` - 采样间隔（毫秒，默认 200）

**返回**：CPU 使用率信息

**CpuUsagePercent**：

```typescript
interface CpuUsagePercent {
  usagePercent: number; // CPU 使用率（百分比，0-100）
  userPercent: number; // 用户态使用率（百分比，0-100）
  systemPercent: number; // 内核态使用率（百分比，0-100）
}
```

**示例**：

```typescript
const cpu = await getCpuUsage(200); // 采样间隔 200ms
console.log(`CPU 使用率: ${cpu.usagePercent}%`);
console.log(`用户态: ${cpu.userPercent}%`);
console.log(`内核态: ${cpu.systemPercent}%`);
```

---

### getLoadAverage

获取系统负载（Linux/macOS）。

```typescript
function getLoadAverage(): Promise<LoadAverage | null>;
```

**返回**：系统负载信息，如果系统不支持则返回 null

**LoadAverage**：

```typescript
interface LoadAverage {
  load1: number; // 1 分钟平均负载
  load5: number; // 5 分钟平均负载
  load15: number; // 15 分钟平均负载
}
```

**示例**：

```typescript
const load = await getLoadAverage();
if (load) {
  console.log(`1分钟负载: ${load.load1}`);
  console.log(`5分钟负载: ${load.load5}`);
  console.log(`15分钟负载: ${load.load15}`);
}
```

---

### getSystemInfo

获取系统信息。

```typescript
function getSystemInfo(): Promise<SystemInfo>;
```

**返回**：系统信息

**SystemInfo**：

```typescript
interface SystemInfo {
  os: "darwin" | "linux" | "windows" | "unknown"; // 操作系统类型
  osRelease: string; // 操作系统版本
  hostname: string; // 主机名
  arch: "x86_64" | "aarch64" | "unknown"; // 架构
  uptime: number; // 系统运行时间（秒）
}
```

**示例**：

```typescript
const system = await getSystemInfo();
console.log(`操作系统: ${system.os}`);
console.log(`系统版本: ${system.osRelease}`);
console.log(`主机名: ${system.hostname}`);
console.log(`架构: ${system.arch}`);
console.log(`运行时间: ${formatUptime(system.uptime)}`);
```

---

### getDiskUsage

获取磁盘使用信息。

```typescript
function getDiskUsage(path?: string): Promise<DiskUsage>;
```

**参数**：

- `path?: string` - 路径（默认 "/"）

**返回**：磁盘使用信息

**DiskUsage**：

```typescript
interface DiskUsage {
  total: number; // 总空间（字节）
  used: number; // 已使用空间（字节）
  available: number; // 可用空间（字节）
  usagePercent: number; // 使用率（百分比，0-100）
}
```

**示例**：

```typescript
const disk = await getDiskUsage("/");
console.log(`总空间: ${formatBytes(disk.total)}`);
console.log(`已使用: ${formatBytes(disk.used)}`);
console.log(`可用空间: ${formatBytes(disk.available)}`);
console.log(`使用率: ${disk.usagePercent}%`);
```

---

### formatBytes

格式化字节数。

```typescript
function formatBytes(bytes: number, decimals?: number): string;
```

**参数**：

- `bytes: number` - 字节数
- `decimals?: number` - 小数位数（默认 2）

**返回**：格式化后的字符串（如 "1.00 KB"）

**示例**：

```typescript
formatBytes(1024); // "1.00 KB"
formatBytes(1048576); // "1.00 MB"
formatBytes(1073741824); // "1.00 GB"
```

---

### formatUptime

格式化运行时间。

```typescript
function formatUptime(seconds: number): string;
```

**参数**：

- `seconds: number` - 秒数

**返回**：格式化后的字符串（如 "1 小时 1 分钟 1 秒"）

**示例**：

```typescript
formatUptime(3661); // "1 小时 1 分钟 1 秒"
formatUptime(60); // "1 分钟"
formatUptime(30); // "30 秒"
```

---

## 🎯 使用场景

- **系统监控**：监控服务器资源使用情况
- **性能分析**：分析系统性能瓶颈
- **资源告警**：当资源使用率过高时发出告警
- **系统信息展示**：显示系统基本信息

---

## ⚡ 性能优化

- **异步操作**：所有操作都是异步的，不阻塞主线程
- **错误处理**：权限错误时返回默认值，不中断程序

---

## 📝 备注

- **仅服务端**：此模块仅支持服务端，需要系统权限
- **权限要求**：Deno 需要 `--allow-sys` 和 `--allow-run` 权限
- **跨平台**：支持 Linux、macOS、Windows（部分功能可能不可用）
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
