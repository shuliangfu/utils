/**
 * @module @dreamer/utils/date
 *
 * 日期时间处理工具函数模块
 *
 * 提供日期格式化、计算、比较、差值计算、相对时间等功能。
 */

/**
 * 日期格式化
 *
 * @param date 日期
 * @param format 格式（如 "YYYY-MM-DD"）
 * @returns 格式化后的字符串
 */
export function format(date: Date, formatStr: string): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return formatStr
    .replace(/YYYY/g, String(year))
    .replace(/MM/g, month)
    .replace(/DD/g, day)
    .replace(/HH/g, hours)
    .replace(/mm/g, minutes)
    .replace(/ss/g, seconds);
}

/**
 * 添加天数
 *
 * @param date 日期
 * @param days 天数
 * @returns 新日期
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * 添加月数
 *
 * @param date 日期
 * @param months 月数
 * @returns 新日期
 */
export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

/**
 * 添加年数
 *
 * @param date 日期
 * @param years 年数
 * @returns 新日期
 */
export function addYears(date: Date, years: number): Date {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
}

/**
 * 判断日期是否在另一个日期之前
 *
 * @param date1 日期1
 * @param date2 日期2
 * @returns 是否在之前
 */
export function isBefore(date1: Date, date2: Date): boolean {
  return date1.getTime() < date2.getTime();
}

/**
 * 判断日期是否在另一个日期之后
 *
 * @param date1 日期1
 * @param date2 日期2
 * @returns 是否在之后
 */
export function isAfter(date1: Date, date2: Date): boolean {
  return date1.getTime() > date2.getTime();
}

/**
 * 判断两个日期是否相同
 *
 * @param date1 日期1
 * @param date2 日期2
 * @returns 是否相同
 */
export function isSame(date1: Date, date2: Date): boolean {
  return date1.getTime() === date2.getTime();
}

/**
 * 计算日期差值（天数）
 *
 * @param date1 日期1
 * @param date2 日期2
 * @returns 天数差值
 */
export function diffDays(date1: Date, date2: Date): number {
  const diff = date2.getTime() - date1.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * 计算日期差值（小时数）
 *
 * @param date1 日期1
 * @param date2 日期2
 * @returns 小时数差值
 */
export function diffHours(date1: Date, date2: Date): number {
  const diff = date2.getTime() - date1.getTime();
  return Math.floor(diff / (1000 * 60 * 60));
}

/**
 * 相对时间（从指定时间到现在）
 *
 * @param date 日期
 * @returns 相对时间字符串
 */
export function fromNow(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} 天前`;
  }
  if (hours > 0) {
    return `${hours} 小时前`;
  }
  if (minutes > 0) {
    return `${minutes} 分钟前`;
  }
  return `${seconds} 秒前`;
}

/**
 * 相对时间（从现在到指定时间）
 *
 * @param date 日期
 * @returns 相对时间字符串
 */
export function toNow(date: Date): string {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const seconds = Math.floor(Math.abs(diff) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} 天后`;
  }
  if (hours > 0) {
    return `${hours} 小时后`;
  }
  if (minutes > 0) {
    return `${minutes} 分钟后`;
  }
  return `${seconds} 秒后`;
}
