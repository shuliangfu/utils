# System Status

> System status utilities for CPU, memory, disk, load average, and related info.

[![JSR](https://jsr.io/badges/@dreamer/utils)](https://jsr.io/@dreamer/utils)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)

---

## Overview

System status utilities for CPU, memory, disk, load average, and system info.
Server-only.

---

## Features

- **Memory**: `getMemoryInfo` — total, used, available, usage percent
- **CPU**: `getCpuUsage` — user/system percent, configurable sample interval
- **Load average**: `getLoadAverage` — 1/5/15 min (Linux/macOS)
- **System info**: `getSystemInfo` — OS, release, hostname, arch, uptime
- **Disk**: `getDiskUsage` — total, used, available, usage percent
- **Full status**: `getSystemStatus` — aggregates the above
- **Format**: `formatBytes`, `formatUptime`

---

## Installation

```bash
deno add jsr:@dreamer/utils
```

---

## Environment compatibility

- **Runtime**: Deno 2.6+ or Bun 1.3.5+
- **Server**: ✅ Supported (requires system permissions)
- **Client**: ❌ Not supported
- **Dependencies**: `@dreamer/runtime-adapter` for cross-runtime

**Permissions**:

- Deno: `--allow-sys` and `--allow-run`
- Bun: system permissions

---

## Quick start

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

// Full system status
const status = await getSystemStatus();
console.log("System:", status.system);
console.log("Memory usage:", status.memory.usagePercent + "%");
console.log("CPU usage:", status.cpu.usagePercent + "%");
if (status.loadAverage) console.log("Load:", status.loadAverage.load1);

// Memory
const memory = await getMemoryInfo();
console.log(`Total: ${formatBytes(memory.total)}`);
console.log(`Used: ${formatBytes(memory.used)}`);
console.log(`Available: ${formatBytes(memory.available)}`);
console.log(`Usage: ${memory.usagePercent}%`);

// CPU (sample interval 200ms)
const cpu = await getCpuUsage(200);
console.log(`CPU: ${cpu.usagePercent}%`);
console.log(`User: ${cpu.userPercent}%`);
console.log(`System: ${cpu.systemPercent}%`);

// Load average (Linux/macOS)
const load = await getLoadAverage();
if (load) {
  console.log(`1m: ${load.load1}, 5m: ${load.load5}, 15m: ${load.load15}`);
}

// System info
const system = await getSystemInfo();
console.log(`OS: ${system.os}`);
console.log(`Release: ${system.osRelease}`);
console.log(`Hostname: ${system.hostname}`);
console.log(`Arch: ${system.arch}`);
console.log(`Uptime: ${formatUptime(system.uptime)}`);

// Disk
const disk = await getDiskUsage("/");
console.log(`Total: ${formatBytes(disk.total)}`);
console.log(`Used: ${formatBytes(disk.used)}`);
console.log(`Available: ${formatBytes(disk.available)}`);
console.log(`Usage: ${disk.usagePercent}%`);

// Format helpers
console.log(formatBytes(1024)); // "1.00 KB"
console.log(formatUptime(3661)); // "1 hour 1 minute 1 second"
```

---

## API Reference

### getSystemStatus

Get full system status.

```typescript
function getSystemStatus(): Promise<SystemStatus>;
```

**Returns**: `SystemStatus` — `system`, `memory`, `cpu`, `loadAverage?`

**Example**:

```typescript
const status = await getSystemStatus();
console.log(status.system);
console.log(status.memory.usagePercent + "%");
```

---

### getMemoryInfo

Get memory usage.

```typescript
function getMemoryInfo(): Promise<MemoryInfo>;
```

**Returns**: `MemoryInfo` — `total`, `available`, `used`, `usagePercent`, `free`
(bytes)

**Example**:

```typescript
const memory = await getMemoryInfo();
console.log(formatBytes(memory.total));
console.log(memory.usagePercent + "%");
```

---

### getCpuUsage

Get CPU usage percent.

```typescript
function getCpuUsage(sampleInterval?: number): Promise<CpuUsagePercent>;
```

**Parameters**: `sampleInterval?: number` — ms (default 200)

**Returns**: `CpuUsagePercent` — `usagePercent`, `userPercent`, `systemPercent`

**Example**:

```typescript
const cpu = await getCpuUsage(200);
console.log(cpu.usagePercent + "%");
```

---

### getLoadAverage

Get load average (Linux/macOS).

```typescript
function getLoadAverage(): Promise<LoadAverage | null>;
```

**Returns**: `LoadAverage` — `load1`, `load5`, `load15`; or null if unsupported

**Example**:

```typescript
const load = await getLoadAverage();
if (load) console.log(load.load1, load.load5, load.load15);
```

---

### getSystemInfo

Get system info.

```typescript
function getSystemInfo(): Promise<SystemInfo>;
```

**Returns**: `SystemInfo` — `os`, `osRelease`, `hostname`, `arch`, `uptime`
(seconds)

**Example**:

```typescript
const system = await getSystemInfo();
console.log(system.os, system.hostname);
console.log(formatUptime(system.uptime));
```

---

### getDiskUsage

Get disk usage for a path.

```typescript
function getDiskUsage(path?: string): Promise<DiskUsage>;
```

**Parameters**: `path?: string` — default `"/"`

**Returns**: `DiskUsage` — `total`, `used`, `available`, `usagePercent` (bytes)

**Example**:

```typescript
const disk = await getDiskUsage("/");
console.log(formatBytes(disk.total));
console.log(disk.usagePercent + "%");
```

---

### formatBytes

Format byte count.

```typescript
function formatBytes(bytes: number, decimals?: number): string;
```

**Parameters**: `bytes`, `decimals?` (default 2)

**Returns**: e.g. `"1.00 KB"`, `"1.00 MB"`

**Example**: `formatBytes(1024)` → `"1.00 KB"`

---

### formatUptime

Format uptime in seconds to human string.

```typescript
function formatUptime(seconds: number): string;
```

**Parameters**: `seconds: number`

**Returns**: e.g. `"1 hour 1 minute 1 second"`

**Example**: `formatUptime(3661)` → `"1 hour 1 minute 1 second"`

---

## Use cases

- **Monitoring**: Server resource usage
- **Performance**: Identify bottlenecks
- **Alerts**: High usage alerts
- **Dashboard**: System info display

---

## Performance

- **Async**: All APIs are async and non-blocking
- **Errors**: Permission errors return defaults where possible

---

## Notes

- **Server only**: Requires system permissions
- **Deno**: Needs `--allow-sys` and `--allow-run`
- **Cross-platform**: Linux, macOS, Windows (some features may be limited)
- **Type-safe**: Full TypeScript support

---

## See also

- [JSR package](https://jsr.io/@dreamer/utils)

---

## Contributing

Issues and Pull Requests are welcome.

---

## License

Apache License 2.0 — see [LICENSE](../../LICENSE)

---

<div align="center">

**Made with ❤️ by Dreamer Team**

</div>
