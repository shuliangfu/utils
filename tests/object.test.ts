/**
 * @fileoverview 对象工具函数测试
 */

import { describe, expect, it } from "jsr:@dreamer/test@^1.0.0-alpha.1";
import {
  deepClone,
  deepMerge,
  deletePath,
  get,
  has,
  isDeepEqual,
  isEqual,
  merge,
  omit,
  pick,
  set,
} from "../src/object.ts";

describe("对象工具函数", () => {
  describe("deepClone", () => {
    it("应该深度克隆对象", () => {
      const obj = { a: 1, b: { c: 2 } };
      const cloned = deepClone(obj);
      expect(cloned).toEqual(obj);
      expect(cloned === obj).toBeFalsy();
      expect(cloned.b === obj.b).toBeFalsy();
    });

    it("应该克隆数组", () => {
      const arr = [1, [2, 3]];
      const cloned = deepClone(arr);
      expect(cloned).toEqual(arr);
      expect(cloned === arr).toBeFalsy();
    });

    it("应该克隆日期", () => {
      const date = new Date();
      const cloned = deepClone(date);
      expect(cloned.getTime()).toBe(date.getTime());
      expect(cloned === date).toBeFalsy();
    });
  });

  describe("merge", () => {
    it("应该浅合并对象", () => {
      const target = { a: 1, b: 2 };
      const source = { b: 3, c: 4 };
      expect(merge(target, source)).toEqual({ a: 1, b: 3, c: 4 });
    });
  });

  describe("deepMerge", () => {
    it("应该深度合并对象", () => {
      const target: Record<string, unknown> = { a: 1, b: { c: 2 } };
      const source: Record<string, unknown> = { b: { d: 3 } };
      expect(deepMerge(target, source)).toEqual({ a: 1, b: { c: 2, d: 3 } });
    });
  });

  describe("get", () => {
    it("应该获取路径值", () => {
      const obj = { user: { name: "Alice" } };
      expect(get(obj, "user.name")).toBe("Alice");
    });

    it("应该返回默认值", () => {
      const obj = { user: { name: "Alice" } };
      expect(get(obj, "user.age", 25)).toBe(25);
    });
  });

  describe("set", () => {
    it("应该设置路径值", () => {
      const obj: Record<string, unknown> = {};
      set(obj, "user.name", "Alice");
      expect(obj.user).toEqual({ name: "Alice" });
    });
  });

  describe("has", () => {
    it("应该检查路径是否存在", () => {
      const obj = { user: { name: "Alice" } };
      expect(has(obj, "user.name")).toBe(true);
      expect(has(obj, "user.age")).toBe(false);
    });
  });

  describe("deletePath", () => {
    it("应该删除路径值", () => {
      const obj: Record<string, unknown> = { user: { name: "Alice" } };
      expect(deletePath(obj, "user.name")).toBe(true);
      expect(obj.user).toEqual({});
    });
  });

  describe("pick", () => {
    it("应该选择指定属性", () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(pick(obj, ["a", "b"])).toEqual({ a: 1, b: 2 });
    });
  });

  describe("omit", () => {
    it("应该排除指定属性", () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(omit(obj, ["a"])).toEqual({ b: 2, c: 3 });
    });
  });

  describe("isEqual", () => {
    it("应该浅比较对象", () => {
      expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
      expect(isEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })).toBe(
        false,
      );
    });
  });

  describe("isDeepEqual", () => {
    it("应该深度比较对象", () => {
      expect(isDeepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })).toBe(
        true,
      );
      expect(isDeepEqual([1, [2, 3]], [1, [2, 3]])).toBe(true);
    });
  });
});
