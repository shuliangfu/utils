/**
 * @module @dreamer/utils/system
 *
 * 系统状态工具函数模块
 *
 * 提供获取系统状态参数的工具方法，包括 CPU、内存、磁盘、网络等信息。
 */

import { createCommand, IS_BUN, IS_DENO } from "@dreamer/runtime-adapter";

/**
 * 内存信息
 */
export interface MemoryInfo {
  /** 总内存（字节） */
  total: number;
  /** 可用内存（字节） */
  available: number;
  /** 已使用内存（字节） */
  used: number;
  /** 内存使用率（百分比，0-100） */
  usagePercent: number;
  /** 空闲内存（字节） */
  free: number;
}

/**
 * CPU 使用信息
 */
export interface CpuUsage {
  /** 用户态时间（微秒） */
  user: number;
  /** 内核态时间（微秒） */
  system: number;
}

/**
 * CPU 使用率信息
 */
export interface CpuUsagePercent {
  /** CPU 使用率（百分比，0-100） */
  usagePercent: number;
  /** 用户态使用率（百分比，0-100） */
  userPercent: number;
  /** 内核态使用率（百分比，0-100） */
  systemPercent: number;
}

/**
 * 系统负载信息（Linux/macOS）
 */
export interface LoadAverage {
  /** 1 分钟平均负载 */
  load1: number;
  /** 5 分钟平均负载 */
  load5: number;
  /** 15 分钟平均负载 */
  load15: number;
}

/**
 * 磁盘使用信息
 */
export interface DiskUsage {
  /** 总空间（字节） */
  total: number;
  /** 已使用空间（字节） */
  used: number;
  /** 可用空间（字节） */
  available: number;
  /** 使用率（百分比，0-100） */
  usagePercent: number;
}

/**
 * 系统信息
 */
export interface SystemInfo {
  /** 操作系统类型 */
  os: "darwin" | "linux" | "windows" | "unknown";
  /** 操作系统版本 */
  osRelease: string;
  /** 主机名 */
  hostname: string;
  /** 架构 */
  arch: "x86_64" | "aarch64" | "unknown";
  /** 系统运行时间（秒） */
  uptime: number;
}

/**
 * 完整的系统状态
 */
export interface SystemStatus {
  /** 系统信息 */
  system: SystemInfo;
  /** 内存信息 */
  memory: MemoryInfo;
  /** CPU 使用率 */
  cpu: CpuUsagePercent;
  /** 系统负载（Linux/macOS） */
  loadAverage?: LoadAverage;
}

/**
 * 获取内存信息
 *
 * @returns 内存信息
 *
 * @example
 * ```typescript
 * import { getMemoryInfo } from "@dreamer/utils/system";
 *
 * const memory = await getMemoryInfo();
 * console.log(`内存使用率: ${memory.usagePercent}%`);
 * console.log(`总内存: ${formatBytes(memory.total)}`);
 * console.log(`已使用: ${formatBytes(memory.used)}`);
 * ```
 */
export async function getMemoryInfo(): Promise<MemoryInfo> {
  try {
    // Deno 环境
    if (IS_DENO) {
      const info = (globalThis as any).Deno.systemMemoryInfo();
      const total = info.total;
      const available = info.available;
      const used = total - available;
      const free = info.free;
      const usagePercent = total > 0 ? (used / total) * 100 : 0;

      return {
        total,
        available,
        used,
        free,
        usagePercent: Math.round(usagePercent * 100) / 100,
      };
    }

    // Bun 环境
    if (IS_BUN) {
      // Bun 目前没有直接的内存 API，可以通过系统命令获取
      try {
        const os = (globalThis as any).process?.platform;
        let command: string;
        let args: string[];

        if (os === "win32") {
          // Windows 使用 wmic
          command = "wmic";
          args = [
            "OS",
            "get",
            "TotalVisibleMemorySize,FreePhysicalMemory",
            "/format:value",
          ];
        } else if (os === "darwin") {
          // macOS 没有 free 命令，使用 vm_stat 和 sysctl 获取内存信息比较复杂
          // 这里返回默认值，不尝试获取
          return {
            total: 0,
            available: 0,
            used: 0,
            free: 0,
            usagePercent: 0,
          };
        } else {
          // Linux 使用 free 命令
          command = "free";
          args = ["-b"]; // 以字节为单位
        }

        // 如果命令是 free，执行获取内存信息
        if (command === "free" || command === "wmic") {
          const cmd = createCommand(command, {
            args,
            stdout: "piped",
            stderr: "piped",
          });

          try {
            const result = await cmd.output();

            if (result.success) {
              const output = new TextDecoder().decode(result.stdout);

              if (os === "win32") {
                // 解析 Windows wmic 输出
                const totalMatch = output.match(/TotalVisibleMemorySize=(\d+)/);
                const freeMatch = output.match(/FreePhysicalMemory=(\d+)/);

                if (totalMatch && freeMatch) {
                  const total = parseInt(totalMatch[1], 10) * 1024; // KB 转字节
                  const free = parseInt(freeMatch[1], 10) * 1024; // KB 转字节
                  const used = total - free;
                  const usagePercent = total > 0 ? (used / total) * 100 : 0;

                  return {
                    total,
                    available: free,
                    used,
                    free,
                    usagePercent: Math.round(usagePercent * 100) / 100,
                  };
                }
              } else {
                // 解析 Linux free 输出
                // free -b 输出格式：
                //               total        used        free      shared  buff/cache   available
                // Mem:    1234567890    987654321    123456789    12345678    123456789    123456789
                const lines = output.trim().split("\n");
                if (lines.length >= 2) {
                  const memLine = lines[1];
                  const parts = memLine.trim().split(/\s+/);
                  if (parts.length >= 4) {
                    const total = parseInt(parts[1], 10) || 0;
                    const used = parseInt(parts[2], 10) || 0;
                    const free = parseInt(parts[3], 10) || 0;
                    const available = parseInt(parts[6], 10) || free;
                    const usagePercent = total > 0 ? (used / total) * 100 : 0;

                    return {
                      total,
                      available,
                      used,
                      free,
                      usagePercent: Math.round(usagePercent * 100) / 100,
                    };
                  }
                }
              }
            }
          } catch {
            // 命令执行失败，静默处理
          }
        }
      } catch {
        // 静默失败，不输出警告
      }

      // Bun 环境获取失败，返回默认值
      return {
        total: 0,
        available: 0,
        used: 0,
        free: 0,
        usagePercent: 0,
      };
    }

    // 其他环境
    return {
      total: 0,
      available: 0,
      used: 0,
      free: 0,
      usagePercent: 0,
    };
  } catch (error) {
    console.error("获取内存信息失败:", error);
    return {
      total: 0,
      available: 0,
      used: 0,
      free: 0,
      usagePercent: 0,
    };
  }
}

/**
 * 获取 CPU 使用率
 *
 * 通过两次采样计算 CPU 使用率。
 *
 * @param interval 采样间隔（毫秒），默认 100ms
 * @returns CPU 使用率信息
 *
 * @example
 * ```typescript
 * import { getCpuUsage } from "@dreamer/utils/system";
 *
 * const cpu = await getCpuUsage();
 * console.log(`CPU 使用率: ${cpu.usagePercent}%`);
 * ```
 */
export async function getCpuUsage(
  interval: number = 100,
): Promise<CpuUsagePercent> {
  try {
    // Deno 环境
    if (IS_DENO) {
      const start = (globalThis as any).Deno.cpuUsage();
      await new Promise((resolve) => setTimeout(resolve, interval));
      const end = (globalThis as any).Deno.cpuUsage(start);

      const total = end.user + end.system;
      const usagePercent = total > 0 ? (total / (interval * 10000)) * 100 : 0;
      const userPercent = total > 0 ? (end.user / (interval * 10000)) * 100 : 0;
      const systemPercent = total > 0
        ? (end.system / (interval * 10000)) * 100
        : 0;

      return {
        usagePercent: Math.min(100, Math.round(usagePercent * 100) / 100),
        userPercent: Math.min(100, Math.round(userPercent * 100) / 100),
        systemPercent: Math.min(100, Math.round(systemPercent * 100) / 100),
      };
    }

    // Bun 环境
    if (IS_BUN) {
      // Bun 目前没有直接的 CPU API，可以通过系统命令获取（需要额外实现）
      // 这里返回默认值
      return {
        usagePercent: 0,
        userPercent: 0,
        systemPercent: 0,
      };
    }

    // 其他环境
    return {
      usagePercent: 0,
      userPercent: 0,
      systemPercent: 0,
    };
  } catch (error) {
    console.error("获取 CPU 使用率失败:", error);
    return {
      usagePercent: 0,
      userPercent: 0,
      systemPercent: 0,
    };
  }
}

/**
 * 获取系统负载（Linux/macOS）
 *
 * @returns 系统负载信息，Windows 返回 undefined
 *
 * @example
 * ```typescript
 * import { getLoadAverage } from "@dreamer/utils/system";
 *
 * const load = await getLoadAverage();
 * if (load) {
 *   console.log(`1分钟负载: ${load.load1}`);
 *   console.log(`5分钟负载: ${load.load5}`);
 *   console.log(`15分钟负载: ${load.load15}`);
 * }
 * ```
 */
export async function getLoadAverage(): Promise<LoadAverage | undefined> {
  try {
    // Deno 环境
    if (IS_DENO) {
      try {
        const load = (globalThis as any).Deno.loadavg();
        if (load && load.length >= 3) {
          return {
            load1: load[0],
            load5: load[1],
            load15: load[2],
          };
        }
      } catch {
        // loadavg 在 Windows 上不可用
        return undefined;
      }
    }

    // Bun 环境
    if (IS_BUN) {
      // Bun 目前没有直接的 loadavg API，可以通过系统命令获取
      try {
        const os = (globalThis as any).process?.platform;
        if (os !== "win32") {
          // Linux/macOS 使用 uptime 命令
          const cmd = createCommand("uptime", {
            stdout: "piped",
            stderr: "piped",
          });

          try {
            const result = await cmd.output();
            if (result.success) {
              const output = new TextDecoder().decode(result.stdout);
              // 解析 uptime 输出：load average: 0.52, 0.58, 0.59
              const match = output.match(
                /load average:\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)/,
              );
              if (match) {
                return {
                  load1: parseFloat(match[1]),
                  load5: parseFloat(match[2]),
                  load15: parseFloat(match[3]),
                };
              }
            }
          } catch {
            // 命令执行失败，静默处理
          }
        }
      } catch (error) {
        console.warn("Bun 环境获取系统负载失败:", error);
      }
      return undefined;
    }

    return undefined;
  } catch (error) {
    console.error("获取系统负载失败:", error);
    return undefined;
  }
}

/**
 * 获取系统信息
 *
 * @returns 系统信息
 *
 * @example
 * ```typescript
 * import { getSystemInfo } from "@dreamer/utils/system";
 *
 * const info = await getSystemInfo();
 * console.log(`操作系统: ${info.os}`);
 * console.log(`主机名: ${info.hostname}`);
 * console.log(`运行时间: ${info.uptime} 秒`);
 * ```
 */
export async function getSystemInfo(): Promise<SystemInfo> {
  try {
    let os: "darwin" | "linux" | "windows" | "unknown" = "unknown";
    let osRelease = "";
    let hostname = "";
    let arch: "x86_64" | "aarch64" | "unknown" = "unknown";
    let uptime = 0;

    // Deno 环境
    if (IS_DENO) {
      const build = (globalThis as any).Deno.build;
      os = build.os === "darwin"
        ? "darwin"
        : build.os === "linux"
        ? "linux"
        : build.os === "windows"
        ? "windows"
        : "unknown";
      arch = build.arch === "x86_64"
        ? "x86_64"
        : build.arch === "aarch64"
        ? "aarch64"
        : "unknown";

      try {
        osRelease = (globalThis as any).Deno.osRelease();
      } catch {
        osRelease = "unknown";
      }

      try {
        hostname = (globalThis as any).Deno.hostname();
      } catch {
        hostname = "unknown";
      }

      // Deno 没有直接的 uptime API，尝试通过系统命令获取
      try {
        const osType = build.os;
        let command: string;
        let args: string[];

        if (osType === "windows") {
          // Windows 使用 wmic
          command = "wmic";
          args = ["os", "get", "LastBootUpTime", "/format:value"];
        } else {
          // Linux/macOS 使用 uptime 命令
          command = "uptime";
          args = ["-s"]; // -s 显示系统启动时间
        }

        const cmd = createCommand(command, {
          args,
          stdout: "piped",
          stderr: "piped",
        });

        try {
          const result = await cmd.output();
          if (result.success) {
            const output = new TextDecoder().decode(result.stdout).trim();
            if (osType === "windows") {
              // 解析 Windows wmic 输出
              const match = output.match(/LastBootUpTime=(\d{14})/);
              if (match) {
                // 格式：YYYYMMDDHHmmss
                const bootTime = match[1];
                const year = parseInt(bootTime.substring(0, 4), 10);
                const month = parseInt(bootTime.substring(4, 6), 10) - 1;
                const day = parseInt(bootTime.substring(6, 8), 10);
                const hour = parseInt(bootTime.substring(8, 10), 10);
                const minute = parseInt(bootTime.substring(10, 12), 10);
                const second = parseInt(bootTime.substring(12, 14), 10);
                const bootDate = new Date(
                  year,
                  month,
                  day,
                  hour,
                  minute,
                  second,
                );
                uptime = Math.floor((Date.now() - bootDate.getTime()) / 1000);
              }
            } else {
              // Linux/macOS: 解析 uptime -s 输出（格式：YYYY-MM-DD HH:MM:SS）
              const bootDate = new Date(output);
              if (!isNaN(bootDate.getTime())) {
                uptime = Math.floor((Date.now() - bootDate.getTime()) / 1000);
              }
            }
          }
        } catch {
          // 获取失败，保持默认值 0
          uptime = 0;
        }
      } catch {
        // 获取失败，保持默认值 0
        uptime = 0;
      }
    }

    // Bun 环境
    if (IS_BUN) {
      const platform = (globalThis as any).process?.platform;
      os = platform === "darwin"
        ? "darwin"
        : platform === "linux"
        ? "linux"
        : platform === "win32"
        ? "windows"
        : "unknown";

      try {
        osRelease = (globalThis as any).process?.platform || "unknown";
        hostname = (globalThis as any).os?.hostname() || "unknown";
        uptime = (globalThis as any).process?.uptime() || 0;
      } catch {
        osRelease = "unknown";
        hostname = "unknown";
        uptime = 0;
      }

      // Bun 获取架构信息
      try {
        const processArch = (globalThis as any).process?.arch;
        arch = processArch === "x64" || processArch === "x86_64"
          ? "x86_64"
          : processArch === "arm64" || processArch === "aarch64"
          ? "aarch64"
          : "unknown";
      } catch {
        arch = "unknown";
      }
    }

    return {
      os,
      osRelease,
      hostname,
      arch,
      uptime,
    };
  } catch (error) {
    console.error("获取系统信息失败:", error);
    return {
      os: "unknown",
      osRelease: "unknown",
      hostname: "unknown",
      arch: "unknown",
      uptime: 0,
    };
  }
}

/**
 * 获取磁盘使用信息
 *
 * 获取指定路径的磁盘使用情况。
 * 注意：此功能需要通过系统命令获取，在某些环境下可能不可用。
 *
 * @param path 路径，默认为当前工作目录
 * @returns 磁盘使用信息
 *
 * @example
 * ```typescript
 * import { getDiskUsage } from "@dreamer/utils/system";
 *
 * const disk = await getDiskUsage("/");
 * console.log(`磁盘使用率: ${disk.usagePercent}%`);
 * console.log(`总空间: ${formatBytes(disk.total)}`);
 * console.log(`已使用: ${formatBytes(disk.used)}`);
 * ```
 */
export async function getDiskUsage(
  path: string = ".",
): Promise<DiskUsage> {
  try {
    // 获取操作系统类型
    let osType: string;
    if (IS_DENO) {
      osType = (globalThis as any).Deno.build.os;
    } else if (IS_BUN) {
      osType = (globalThis as any).process?.platform || "unknown";
      if (osType === "win32") osType = "windows";
    } else {
      return {
        total: 0,
        used: 0,
        available: 0,
        usagePercent: 0,
      };
    }

    try {
      // 使用系统命令获取磁盘使用情况
      let command: string;
      let args: string[];

      if (osType === "windows") {
        // Windows 使用 wmic
        const drive = path.charAt(0).toUpperCase();
        command = "wmic";
        args = [
          "logicaldisk",
          "where",
          `DeviceID="${drive}:"`,
          "get",
          "Size,FreeSpace",
          "/format:value",
        ];
      } else {
        // Linux/macOS 使用 df
        // macOS 不支持 -B1，使用 -k 然后乘以 1024
        command = "df";
        if (osType === "darwin") {
          args = ["-k", path]; // macOS 使用 -k（KB）
        } else {
          args = ["-B1", path]; // Linux 使用 -B1（字节）
        }
      }

      const cmd = createCommand(command, {
        args,
        stdout: "piped",
        stderr: "piped",
      });

      try {
        const result = await cmd.output();

        if (!result.success) {
          const error = new TextDecoder().decode(result.stderr);
          console.warn("获取磁盘使用信息失败:", error);
          return {
            total: 0,
            used: 0,
            available: 0,
            usagePercent: 0,
          };
        }

        const output = new TextDecoder().decode(result.stdout);

        if (osType === "windows") {
          // 解析 Windows wmic 输出
          const sizeMatch = output.match(/Size=(\d+)/);
          const freeMatch = output.match(/FreeSpace=(\d+)/);

          if (sizeMatch && freeMatch) {
            const total = parseInt(sizeMatch[1], 10);
            const free = parseInt(freeMatch[1], 10);
            const used = total - free;
            const usagePercent = total > 0 ? (used / total) * 100 : 0;

            return {
              total,
              used,
              available: free,
              usagePercent: Math.round(usagePercent * 100) / 100,
            };
          }
        } else {
          // 解析 Linux/macOS df 输出
          // Linux df -B1 输出格式：
          // Filesystem     1B-blocks         Used    Available Use% Mounted on
          // /dev/disk1s1   1234567890    987654321    246913569  80% /
          // macOS df -k 输出格式（KB）：
          // Filesystem  1024-blocks     Used   Available Capacity iused      ifree %iused  Mounted on
          // /dev/disk1s1   1234567890  987654321   246913569    80%  1234567  1234567   50%   /
          const lines = output.trim().split("\n");
          if (lines.length >= 2) {
            const parts = lines[1].trim().split(/\s+/);
            if (parts.length >= 4) {
              // macOS 使用 -k，需要乘以 1024；Linux 使用 -B1，已经是字节
              const multiplier = osType === "darwin" ? 1024 : 1;
              const total = (parseInt(parts[1], 10) || 0) * multiplier;
              const used = (parseInt(parts[2], 10) || 0) * multiplier;
              const available = (parseInt(parts[3], 10) || 0) * multiplier;
              const usagePercent = total > 0 ? (used / total) * 100 : 0;

              return {
                total,
                used,
                available,
                usagePercent: Math.round(usagePercent * 100) / 100,
              };
            }
          }
        }
      } catch {
        // 命令执行失败，静默处理
      }
    } catch (error) {
      console.warn("获取磁盘使用信息失败:", error);
    }

    return {
      total: 0,
      used: 0,
      available: 0,
      usagePercent: 0,
    };
  } catch (error) {
    console.error("获取磁盘使用信息失败:", error);
    return {
      total: 0,
      used: 0,
      available: 0,
      usagePercent: 0,
    };
  }
}

/**
 * 获取完整的系统状态
 *
 * 一次性获取所有系统状态信息。
 *
 * @param cpuInterval CPU 采样间隔（毫秒），默认 100ms
 * @returns 完整的系统状态
 *
 * @example
 * ```typescript
 * import { getSystemStatus } from "@dreamer/utils/system";
 *
 * const status = await getSystemStatus();
 * console.log("系统信息:", status.system);
 * console.log("内存使用率:", status.memory.usagePercent + "%");
 * console.log("CPU 使用率:", status.cpu.usagePercent + "%");
 * ```
 */
export async function getSystemStatus(
  cpuInterval: number = 100,
): Promise<SystemStatus> {
  const [system, memory, cpu, loadAverage] = await Promise.all([
    getSystemInfo(),
    getMemoryInfo(),
    getCpuUsage(cpuInterval),
    getLoadAverage(),
  ]);

  return {
    system,
    memory,
    cpu,
    loadAverage,
  };
}

/**
 * 格式化字节数
 *
 * 将字节数转换为人类可读的格式（B, KB, MB, GB, TB）。
 *
 * @param bytes 字节数
 * @param decimals 小数位数，默认 2
 * @returns 格式化后的字符串
 *
 * @example
 * ```typescript
 * import { formatBytes } from "@dreamer/utils/system";
 *
 * console.log(formatBytes(1024)); // "1.00 KB"
 * console.log(formatBytes(1048576)); // "1.00 MB"
 * ```
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);

  // 如果 decimals 为 0，直接返回整数；否则使用 toFixed 并保留小数
  const formatted = dm === 0 ? Math.round(value).toString() : value.toFixed(dm);

  return formatted + " " + sizes[i];
}

/**
 * 格式化运行时间
 *
 * 将秒数转换为人类可读的运行时间格式。
 *
 * @param seconds 秒数
 * @returns 格式化后的字符串
 *
 * @example
 * ```typescript
 * import { formatUptime } from "@dreamer/utils/system";
 *
 * console.log(formatUptime(3661)); // "1 小时 1 分钟 1 秒"
 * ```
 */
export function formatUptime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} 秒`;
  }

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts: string[] = [];

  if (days > 0) parts.push(`${days} 天`);
  if (hours > 0 || days > 0) parts.push(`${hours} 小时`);
  if (minutes > 0 || hours > 0 || days > 0) parts.push(`${minutes} 分钟`);
  // 如果有其他部分，即使秒数为 0 也显示；如果只有秒数，则只在秒数 > 0 时显示
  if (parts.length > 0 || secs > 0) {
    parts.push(`${secs} 秒`);
  }

  return parts.join(" ");
}
