/**
 * @fileoverview 日期工具函数测试
 */

import { describe, expect, it } from "jsr:@dreamer/test@^1.0.0-alpha.1";
import {
  addDays,
  addMonths,
  addYears,
  diffDays,
  diffHours,
  format,
  fromNow,
  isAfter,
  isBefore,
  isSame,
  toNow,
} from "../src/date.ts";

describe("日期工具函数", () => {
  describe("format", () => {
    it("应该格式化日期", () => {
      const date = new Date(2024, 0, 1, 12, 30, 45);
      expect(format(date, "YYYY-MM-DD")).toBe("2024-01-01");
      expect(format(date, "HH:mm:ss")).toBe("12:30:45");
    });
  });

  describe("addDays", () => {
    it("应该添加天数", () => {
      const date = new Date(2024, 0, 1);
      const result = addDays(date, 5);
      expect(result.getDate()).toBe(6);
    });
  });

  describe("addMonths", () => {
    it("应该添加月数", () => {
      const date = new Date(2024, 0, 1);
      const result = addMonths(date, 2);
      expect(result.getMonth()).toBe(2);
    });
  });

  describe("addYears", () => {
    it("应该添加年数", () => {
      const date = new Date(2024, 0, 1);
      const result = addYears(date, 1);
      expect(result.getFullYear()).toBe(2025);
    });
  });

  describe("isBefore", () => {
    it("应该判断日期是否在之前", () => {
      const date1 = new Date(2024, 0, 1);
      const date2 = new Date(2024, 0, 2);
      expect(isBefore(date1, date2)).toBe(true);
    });
  });

  describe("isAfter", () => {
    it("应该判断日期是否在之后", () => {
      const date1 = new Date(2024, 0, 2);
      const date2 = new Date(2024, 0, 1);
      expect(isAfter(date1, date2)).toBe(true);
    });
  });

  describe("isSame", () => {
    it("应该判断日期是否相同", () => {
      const date1 = new Date(2024, 0, 1);
      const date2 = new Date(2024, 0, 1);
      expect(isSame(date1, date2)).toBe(true);
    });
  });

  describe("diffDays", () => {
    it("应该计算天数差", () => {
      const date1 = new Date(2024, 0, 1);
      const date2 = new Date(2024, 0, 3);
      expect(diffDays(date1, date2)).toBe(2);
    });
  });

  describe("diffHours", () => {
    it("应该计算小时数差", () => {
      const date1 = new Date(2024, 0, 1, 0, 0, 0);
      const date2 = new Date(2024, 0, 1, 5, 0, 0);
      expect(diffHours(date1, date2)).toBe(5);
    });
  });

  describe("fromNow", () => {
    it("应该返回相对时间", () => {
      const date = new Date(Date.now() - 1000 * 60 * 5); // 5分钟前
      const result = fromNow(date);
      expect(result).toContain("分钟前");
    });
  });

  describe("toNow", () => {
    it("应该返回相对时间", () => {
      const date = new Date(Date.now() + 1000 * 60 * 5); // 5分钟后
      const result = toNow(date);
      expect(result).toContain("分钟后");
    });
  });
});
