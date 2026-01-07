/**
 * @module @dreamer/utils/string
 *
 * 字符串处理工具函数模块
 *
 * 提供字符串截断、格式化、转换、填充、清理等功能。
 */

/**
 * 截断字符串
 *
 * @param str 字符串
 * @param length 最大长度
 * @param suffix 省略符（默认 "..."）
 * @returns 截断后的字符串
 */
export function truncate(str: string, length: number, suffix: string = "..."): string {
  if (str.length <= length) {
    return str;
  }
  return str.slice(0, length) + suffix;
}

/**
 * 字符串格式化（使用占位符）
 *
 * @param template 模板字符串（如 "Hello, {name}!"）
 * @param data 数据对象
 * @returns 格式化后的字符串
 */
export function format(template: string, data: Record<string, unknown>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return String(data[key] ?? match);
  });
}

/**
 * 转换为驼峰命名
 *
 * @param str 字符串
 * @returns 驼峰命名
 */
export function camelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^[A-Z]/, (c) => c.toLowerCase());
}

/**
 * 转换为蛇形命名
 *
 * @param str 字符串
 * @returns 蛇形命名
 */
export function snakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, "_$1")
    .toLowerCase()
    .replace(/^_/, "")
    .replace(/[-_\s]+/g, "_");
}

/**
 * 转换为短横线命名
 *
 * @param str 字符串
 * @returns 短横线命名
 */
export function kebabCase(str: string): string {
  return str
    .replace(/([A-Z])/g, "-$1")
    .toLowerCase()
    .replace(/^-/, "")
    .replace(/[-_\s]+/g, "-");
}

/**
 * 转换为帕斯卡命名
 *
 * @param str 字符串
 * @returns 帕斯卡命名
 */
export function pascalCase(str: string): string {
  const camel = camelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

/**
 * 字符串填充（左侧）
 *
 * @param str 字符串
 * @param length 目标长度
 * @param padString 填充字符（默认空格）
 * @returns 填充后的字符串
 */
export function padStart(str: string, length: number, padString: string = " "): string {
  return str.padStart(length, padString);
}

/**
 * 字符串填充（右侧）
 *
 * @param str 字符串
 * @param length 目标长度
 * @param padString 填充字符（默认空格）
 * @returns 填充后的字符串
 */
export function padEnd(str: string, length: number, padString: string = " "): string {
  return str.padEnd(length, padString);
}

/**
 * 去除首尾空白字符
 *
 * @param str 字符串
 * @returns 处理后的字符串
 */
export function trim(str: string): string {
  return str.trim();
}

/**
 * 去除左侧空白字符
 *
 * @param str 字符串
 * @returns 处理后的字符串
 */
export function trimStart(str: string): string {
  return str.trimStart();
}

/**
 * 去除右侧空白字符
 *
 * @param str 字符串
 * @returns 处理后的字符串
 */
export function trimEnd(str: string): string {
  return str.trimEnd();
}
