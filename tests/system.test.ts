/**
 * @fileoverview 系统状态工具函数测试
 */

import { describe, expect, it } from "@dreamer/test";
import {
  formatBytes,
  formatUptime,
  getCpuUsage,
  getDiskUsage,
  getLoadAverage,
  getMemoryInfo,
  getSystemInfo,
  getSystemStatus,
} from "../src/system.ts";

describe("系统状态工具函数", () => {
  describe("getMemoryInfo", () => {
    it("应该获取内存信息", async () => {
      const memory = await getMemoryInfo();
      expect(memory).toBeDefined();
      expect(typeof memory.total).toBe("number");
      expect(typeof memory.used).toBe("number");
      expect(typeof memory.available).toBe("number");
      expect(typeof memory.free).toBe("number");
      expect(typeof memory.usagePercent).toBe("number");
      expect(memory.usagePercent).toBeGreaterThanOrEqual(0);
      expect(memory.usagePercent).toBeLessThanOrEqual(100);
    });
  });

  describe("getCpuUsage", () => {
    it("应该获取 CPU 使用率", async () => {
      const cpu = await getCpuUsage(100);
      expect(cpu).toBeDefined();
      expect(typeof cpu.usagePercent).toBe("number");
      expect(typeof cpu.userPercent).toBe("number");
      expect(typeof cpu.systemPercent).toBe("number");
      expect(cpu.usagePercent).toBeGreaterThanOrEqual(0);
      expect(cpu.usagePercent).toBeLessThanOrEqual(100);
      expect(cpu.userPercent).toBeGreaterThanOrEqual(0);
      expect(cpu.userPercent).toBeLessThanOrEqual(100);
      expect(cpu.systemPercent).toBeGreaterThanOrEqual(0);
      expect(cpu.systemPercent).toBeLessThanOrEqual(100);
    });
  });

  describe("getLoadAverage", () => {
    it("应该获取系统负载（如果可用）", async () => {
      const load = await getLoadAverage();
      // 系统负载在 Windows 上不可用，可能返回 undefined
      if (load) {
        expect(typeof load.load1).toBe("number");
        expect(typeof load.load5).toBe("number");
        expect(typeof load.load15).toBe("number");
        expect(load.load1).toBeGreaterThanOrEqual(0);
        expect(load.load5).toBeGreaterThanOrEqual(0);
        expect(load.load15).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe("getSystemInfo", () => {
    it("应该获取系统信息", async () => {
      const system = await getSystemInfo();
      expect(system).toBeDefined();
      expect(typeof system.os).toBe("string");
      expect(["darwin", "linux", "windows", "unknown"]).toContain(system.os);
      expect(typeof system.osRelease).toBe("string");
      expect(typeof system.hostname).toBe("string");
      expect(typeof system.arch).toBe("string");
      expect(["x86_64", "aarch64", "unknown"]).toContain(system.arch);
      expect(typeof system.uptime).toBe("number");
      expect(system.uptime).toBeGreaterThanOrEqual(0);
    });
  });

  describe("getDiskUsage", () => {
    it("应该获取磁盘使用信息", async () => {
      const disk = await getDiskUsage(".");
      expect(disk).toBeDefined();
      expect(typeof disk.total).toBe("number");
      expect(typeof disk.used).toBe("number");
      expect(typeof disk.available).toBe("number");
      expect(typeof disk.usagePercent).toBe("number");
      expect(disk.usagePercent).toBeGreaterThanOrEqual(0);
      expect(disk.usagePercent).toBeLessThanOrEqual(100);
    });
  });

  describe("getSystemStatus", () => {
    it("应该获取完整系统状态", async () => {
      const status = await getSystemStatus();
      expect(status).toBeDefined();
      expect(status.system).toBeDefined();
      expect(status.memory).toBeDefined();
      expect(status.cpu).toBeDefined();
      // loadAverage 可能为 undefined（Windows）
      if (status.loadAverage) {
        expect(status.loadAverage.load1).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe("formatBytes", () => {
    it("应该格式化字节数", () => {
      expect(formatBytes(0)).toBe("0 B");
      expect(formatBytes(1024)).toBe("1.00 KB");
      expect(formatBytes(1048576)).toBe("1.00 MB");
      expect(formatBytes(1073741824)).toBe("1.00 GB");
      expect(formatBytes(1024, 0)).toBe("1 KB");
      expect(formatBytes(1536, 1)).toBe("1.5 KB");
    });
  });

  describe("formatUptime", () => {
    it("应该格式化运行时间", () => {
      expect(formatUptime(0)).toBe("0 秒");
      expect(formatUptime(30)).toBe("30 秒");
      expect(formatUptime(60)).toBe("1 分钟 0 秒");
      expect(formatUptime(90)).toBe("1 分钟 30 秒");
      expect(formatUptime(3600)).toBe("1 小时 0 分钟 0 秒");
      expect(formatUptime(3661)).toBe("1 小时 1 分钟 1 秒");
      expect(formatUptime(86400)).toBe("1 天 0 小时 0 分钟 0 秒");
      expect(formatUptime(90061)).toBe("1 天 1 小时 1 分钟 1 秒");
    });
  });
});
