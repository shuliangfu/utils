/**
 * @module @dreamer/utils/format
 *
 * 格式化工具函数模块
 *
 * 提供文件大小格式化、时长格式化、数字格式化、百分比格式化等功能。
 */

/**
 * 格式化文件大小
 *
 * @param bytes 字节数
 * @param options 选项
 * @returns 格式化后的字符串
 */
export function formatBytes(
  bytes: number,
  options: { precision?: number; unit?: "B" | "KB" | "MB" | "GB" | "TB" } = {},
): string {
  const { precision = 0, unit } = options;

  if (unit) {
    const multipliers: Record<string, number> = {
      B: 1,
      KB: 1024,
      MB: 1024 * 1024,
      GB: 1024 * 1024 * 1024,
      TB: 1024 * 1024 * 1024 * 1024,
    };
    const value = bytes / multipliers[unit];
    return `${value.toFixed(precision)} ${unit}`;
  }

  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(precision)} ${units[unitIndex]}`;
}

/**
 * 格式化时长
 *
 * @param seconds 秒数
 * @param options 选项
 * @returns 格式化后的字符串
 */
export function formatDuration(
  seconds: number,
  options: { format?: "human" | "HH:mm:ss" } = {},
): string {
  const { format = "human" } = options;

  if (format === "HH:mm:ss") {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(hours).padStart(2, "0")}:${
      String(minutes).padStart(2, "0")
    }:${String(secs).padStart(2, "0")}`;
  }

  // 人类可读格式
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts: string[] = [];
  if (hours > 0) {
    parts.push(`${hours} 小时`);
  }
  if (minutes > 0) {
    parts.push(`${minutes} 分钟`);
  }
  if (secs > 0 || parts.length === 0) {
    parts.push(`${secs} 秒`);
  }

  return parts.join(" ");
}

/**
 * 格式化数字
 *
 * @param num 数字
 * @param options 选项
 * @returns 格式化后的字符串
 */
export function formatNumber(
  num: number,
  options: { precision?: number; separator?: string } = {},
): string {
  const { precision = 2, separator = "," } = options;
  const parts = num.toFixed(precision).split(".");
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  return parts[1] ? `${integerPart}.${parts[1]}` : integerPart;
}

/**
 * 格式化百分比
 *
 * @param num 数字（0-1 之间的小数）
 * @param precision 精度（默认 2）
 * @returns 格式化后的字符串
 */
export function formatPercent(num: number, precision: number = 2): string {
  return `${(num * 100).toFixed(precision)}%`;
}
