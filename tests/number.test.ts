/**
 * @fileoverview 数字工具函数测试
 */

import { describe, expect, it } from "jsr:@dreamer/test@^1.0.0-alpha.1";
import {
  ceil,
  clamp,
  floor,
  format,
  formatCurrency,
  formatPercent,
  inRange,
  round,
} from "../src/number.ts";

describe("数字工具函数", () => {
  describe("format", () => {
    it("应该格式化数字", () => {
      expect(format(1234.56, "0,0.00")).toBe("1,234.56");
      expect(format(1234, "0,0")).toBe("1,234");
    });
  });

  describe("formatCurrency", () => {
    it("应该格式化货币", () => {
      expect(formatCurrency(1234.56, "USD")).toBe("$1,234.56");
      expect(formatCurrency(1234.56, "CNY")).toBe("¥1,234.56");
    });
  });

  describe("formatPercent", () => {
    it("应该格式化百分比", () => {
      expect(formatPercent(0.1234)).toBe("12.34%");
    });
  });

  describe("clamp", () => {
    it("应该限制数字在范围内", () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });
  });

  describe("inRange", () => {
    it("应该判断数字是否在范围内", () => {
      expect(inRange(5, 0, 10)).toBe(true);
      expect(inRange(-5, 0, 10)).toBe(false);
      expect(inRange(15, 0, 10)).toBe(false);
    });
  });

  describe("round", () => {
    it("应该四舍五入", () => {
      expect(round(3.7)).toBe(4);
      expect(round(3.2)).toBe(3);
    });
  });

  describe("floor", () => {
    it("应该向下取整", () => {
      expect(floor(3.7)).toBe(3);
      expect(floor(3.2)).toBe(3);
    });
  });

  describe("ceil", () => {
    it("应该向上取整", () => {
      expect(ceil(3.7)).toBe(4);
      expect(ceil(3.2)).toBe(4);
    });
  });
});
