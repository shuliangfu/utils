/**
 * @fileoverview 字符串工具函数测试
 */

import { describe, expect, it } from "jsr:@dreamer/test@^1.0.0-alpha.1";
import {
  camelCase,
  format,
  kebabCase,
  padEnd,
  padStart,
  pascalCase,
  snakeCase,
  trim,
  trimEnd,
  trimStart,
  truncate,
} from "../src/string.ts";

describe("字符串工具函数", () => {
  describe("truncate", () => {
    it("应该截断超过长度的字符串", () => {
      expect(truncate("Hello World", 5)).toBe("Hello...");
    });

    it("应该保持短字符串不变", () => {
      expect(truncate("Hi", 5)).toBe("Hi");
    });

    it("应该使用自定义省略符", () => {
      expect(truncate("Hello World", 5, "…")).toBe("Hello…");
    });
  });

  describe("format", () => {
    it("应该替换占位符", () => {
      expect(format("Hello, {name}!", { name: "World" })).toBe("Hello, World!");
    });

    it("应该处理多个占位符", () => {
      expect(format("{greeting}, {name}!", { greeting: "Hi", name: "Alice" }))
        .toBe("Hi, Alice!");
    });

    it("应该处理不存在的键", () => {
      expect(format("Hello, {name}!", {})).toBe("Hello, {name}!");
    });
  });

  describe("camelCase", () => {
    it("应该转换短横线命名", () => {
      expect(camelCase("hello-world")).toBe("helloWorld");
    });

    it("应该转换下划线命名", () => {
      expect(camelCase("hello_world")).toBe("helloWorld");
    });

    it("应该转换空格分隔", () => {
      expect(camelCase("hello world")).toBe("helloWorld");
    });
  });

  describe("snakeCase", () => {
    it("应该转换驼峰命名", () => {
      expect(snakeCase("helloWorld")).toBe("hello_world");
    });

    it("应该转换短横线命名", () => {
      expect(snakeCase("hello-world")).toBe("hello_world");
    });
  });

  describe("kebabCase", () => {
    it("应该转换驼峰命名", () => {
      expect(kebabCase("helloWorld")).toBe("hello-world");
    });

    it("应该转换下划线命名", () => {
      expect(kebabCase("hello_world")).toBe("hello-world");
    });
  });

  describe("pascalCase", () => {
    it("应该转换短横线命名", () => {
      expect(pascalCase("hello-world")).toBe("HelloWorld");
    });

    it("应该转换下划线命名", () => {
      expect(pascalCase("hello_world")).toBe("HelloWorld");
    });
  });

  describe("padStart", () => {
    it("应该左侧填充", () => {
      expect(padStart("5", 3, "0")).toBe("005");
    });

    it("应该使用默认空格填充", () => {
      expect(padStart("5", 3)).toBe("  5");
    });
  });

  describe("padEnd", () => {
    it("应该右侧填充", () => {
      expect(padEnd("5", 3, "0")).toBe("500");
    });

    it("应该使用默认空格填充", () => {
      expect(padEnd("5", 3)).toBe("5  ");
    });
  });

  describe("trim", () => {
    it("应该去除首尾空白", () => {
      expect(trim("  hello  ")).toBe("hello");
    });
  });

  describe("trimStart", () => {
    it("应该去除左侧空白", () => {
      expect(trimStart("  hello  ")).toBe("hello  ");
    });
  });

  describe("trimEnd", () => {
    it("应该去除右侧空白", () => {
      expect(trimEnd("  hello  ")).toBe("  hello");
    });
  });
});
