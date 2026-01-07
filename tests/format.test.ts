/**
 * @fileoverview 格式化工具函数测试
 */

import { describe, expect, it } from "jsr:@dreamer/test@^1.0.0-alpha.1";
import {
  formatBytes,
  formatDuration,
  formatNumber,
  formatPercent,
} from "../src/format.ts";

describe("格式化工具函数", () => {
  describe("formatBytes", () => {
    it("应该格式化字节数", () => {
      expect(formatBytes(1024)).toBe("1 KB");
      expect(formatBytes(1024 * 1024)).toBe("1 MB");
      expect(formatBytes(1024 * 1024 * 1024)).toBe("1 GB");
    });

    it("应该使用指定单位", () => {
      expect(formatBytes(1024, { unit: "KB" })).toBe("1 KB");
      expect(formatBytes(1024 * 1024, { unit: "MB" })).toBe("1 MB");
    });

    it("应该使用指定精度", () => {
      expect(formatBytes(1536, { precision: 2 })).toBe("1.50 KB");
    });
  });

  describe("formatDuration", () => {
    it("应该格式化时长（人类可读）", () => {
      expect(formatDuration(3661)).toContain("小时");
      expect(formatDuration(61)).toContain("分钟");
      expect(formatDuration(30)).toContain("秒");
    });

    it("应该格式化时长（HH:mm:ss）", () => {
      expect(formatDuration(3661, { format: "HH:mm:ss" })).toBe("01:01:01");
      expect(formatDuration(61, { format: "HH:mm:ss" })).toBe("00:01:01");
    });
  });

  describe("formatNumber", () => {
    it("应该格式化数字", () => {
      expect(formatNumber(1234.56)).toBe("1,234.56");
      expect(formatNumber(1234.56, { precision: 1 })).toBe("1,234.6");
    });

    it("应该使用指定分隔符", () => {
      expect(formatNumber(1234.56, { separator: " " })).toBe("1 234.56");
    });
  });

  describe("formatPercent", () => {
    it("应该格式化百分比", () => {
      expect(formatPercent(0.1234)).toBe("12.34%");
      expect(formatPercent(0.1234, 1)).toBe("12.3%");
    });
  });
});
