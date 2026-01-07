/**
 * @fileoverview 数组工具函数测试
 */

import { describe, expect, it } from "jsr:@dreamer/test@^1.0.0-alpha.1";
import {
  chunk,
  count,
  countBy,
  difference,
  flatten,
  flattenDeep,
  groupBy,
  intersection,
  union,
  unique,
  uniqueBy,
} from "../src/array.ts";

describe("数组工具函数", () => {
  describe("unique", () => {
    it("应该去除重复元素", () => {
      expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
    });

    it("应该保持顺序", () => {
      expect(unique([3, 1, 2, 1, 3])).toEqual([3, 1, 2]);
    });
  });

  describe("uniqueBy", () => {
    it("应该按属性去重", () => {
      const arr = [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
        { id: 1, name: "Alice" },
      ];
      expect(uniqueBy(arr, "id")).toEqual([
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ]);
    });
  });

  describe("groupBy", () => {
    it("应该按字符串键分组", () => {
      const arr = [
        { type: "fruit", name: "apple" },
        { type: "fruit", name: "banana" },
        { type: "vegetable", name: "carrot" },
      ];
      const result = groupBy(arr, "type");
      expect(result.fruit.length).toBe(2);
      expect(result.vegetable.length).toBe(1);
    });

    it("应该按函数分组", () => {
      const arr = [1, 2, 3, 4, 5];
      const result = groupBy(arr, (n) => n % 2 === 0 ? "even" : "odd");
      expect(result.even).toEqual([2, 4]);
      expect(result.odd).toEqual([1, 3, 5]);
    });
  });

  describe("chunk", () => {
    it("应该将数组分块", () => {
      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    });

    it("应该处理空数组", () => {
      expect(chunk([], 2)).toEqual([]);
    });
  });

  describe("flatten", () => {
    it("应该扁平化一层", () => {
      expect(flatten([1, [2, 3], [4, 5]])).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe("flattenDeep", () => {
    it("应该深度扁平化", () => {
      expect(flattenDeep([1, [2, [3, [4]]]])).toEqual([1, 2, 3, 4]);
    });
  });

  describe("difference", () => {
    it("应该返回差集", () => {
      expect(difference([1, 2, 3], [2, 3, 4])).toEqual([1]);
    });
  });

  describe("intersection", () => {
    it("应该返回交集", () => {
      expect(intersection([1, 2, 3], [2, 3, 4])).toEqual([2, 3]);
    });
  });

  describe("union", () => {
    it("应该返回并集", () => {
      expect(union([1, 2], [2, 3])).toEqual([1, 2, 3]);
    });
  });

  describe("count", () => {
    it("应该统计元素出现次数", () => {
      expect(count([1, 2, 2, 3, 3, 3])).toEqual({
        "1": 1,
        "2": 2,
        "3": 3,
      });
    });
  });

  describe("countBy", () => {
    it("应该按属性统计", () => {
      const arr = [
        { type: "fruit", name: "apple" },
        { type: "fruit", name: "banana" },
        { type: "vegetable", name: "carrot" },
      ];
      expect(countBy(arr, "type")).toEqual({
        fruit: 2,
        vegetable: 1,
      });
    });
  });
});
