/**
 * @module @dreamer/utils/number
 *
 * 数字格式化工具函数模块
 *
 * 提供数字格式化、货币格式化、百分比格式化、范围限制、舍入等功能。
 */

/**
 * 数字格式化
 *
 * @param num 数字
 * @param format 格式（如 "0,0.00"）
 * @returns 格式化后的字符串
 */
export function format(num: number, formatStr: string = "0,0.00"): string {
  // 简单的数字格式化实现
  const parts = num.toString().split(".");
  const integerPart = parts[0];
  const decimalPart = parts[1] || "";

  // 添加千位分隔符
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  if (formatStr.includes(".")) {
    const decimalPlaces = formatStr.split(".")[1]?.length || 0;
    const formattedDecimal = decimalPart.padEnd(decimalPlaces, "0").slice(
      0,
      decimalPlaces,
    );
    return formattedDecimal
      ? `${formattedInteger}.${formattedDecimal}`
      : formattedInteger;
  }

  return formattedInteger;
}

/**
 * 货币格式化
 *
 * @param num 数字
 * @param currency 货币代码（默认 "USD"）
 * @returns 格式化后的字符串
 */
export function formatCurrency(num: number, currency: string = "USD"): string {
  const symbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    CNY: "¥",
    JPY: "¥",
  };

  const symbol = symbols[currency] || currency;
  return `${symbol}${format(num, "0,0.00")}`;
}

/**
 * 百分比格式化
 *
 * @param num 数字（0-1 之间的小数）
 * @returns 格式化后的字符串
 */
export function formatPercent(num: number): string {
  return `${(num * 100).toFixed(2)}%`;
}

/**
 * 限制数字在范围内
 *
 * @param num 数字
 * @param min 最小值
 * @param max 最大值
 * @returns 限制后的数字
 */
export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

/**
 * 判断数字是否在范围内
 *
 * @param num 数字
 * @param min 最小值
 * @param max 最大值
 * @returns 是否在范围内
 */
export function inRange(num: number, min: number, max: number): boolean {
  return num >= min && num <= max;
}

/**
 * 四舍五入
 */
export const round = Math.round;

/**
 * 向下取整
 */
export const floor = Math.floor;

/**
 * 向上取整
 */
export const ceil = Math.ceil;
