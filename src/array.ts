/**
 * @module @dreamer/utils/array
 *
 * 数组操作工具函数模块
 *
 * 提供数组去重、分组、分块、扁平化、集合操作、统计等功能。
 */

/**
 * 数组去重
 *
 * @param arr 数组
 * @returns 去重后的数组
 */
export function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

/**
 * 按属性去重
 *
 * @param arr 对象数组
 * @param key 属性键
 * @returns 去重后的数组
 */
export function uniqueBy<T extends Record<string, unknown>>(
  arr: T[],
  key: keyof T,
): T[] {
  const seen = new Set();
  return arr.filter((item) => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
}

/**
 * 数组分组
 *
 * @param arr 数组
 * @param key 分组键（字符串或函数）
 * @returns 分组后的对象
 */
export function groupBy<T>(
  arr: T[],
  key: string | ((item: T) => string),
): Record<string, T[]> {
  const result: Record<string, T[]> = {};
  for (const item of arr) {
    const groupKey = typeof key === "function"
      ? key(item)
      : String((item as Record<string, unknown>)[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
  }
  return result;
}

/**
 * 数组分块
 *
 * @param arr 数组
 * @param size 块大小
 * @returns 分块后的数组
 */
export function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

/**
 * 数组扁平化（一层）
 *
 * @param arr 数组
 * @returns 扁平化后的数组
 */
export function flatten<T>(arr: (T | T[])[]): T[] {
  return arr.flat(1) as T[];
}

/**
 * 数组深度扁平化
 *
 * @param arr 数组
 * @returns 扁平化后的数组
 */
export function flattenDeep<T>(arr: unknown[]): T[] {
  const result: T[] = [];
  for (const item of arr) {
    if (Array.isArray(item)) {
      result.push(...flattenDeep<T>(item));
    } else {
      result.push(item as T);
    }
  }
  return result;
}

/**
 * 数组差集
 *
 * @param arr1 数组1
 * @param arr2 数组2
 * @returns 差集（arr1 中有但 arr2 中没有的元素）
 */
export function difference<T>(arr1: T[], arr2: T[]): T[] {
  const set2 = new Set(arr2);
  return arr1.filter((item) => !set2.has(item));
}

/**
 * 数组交集
 *
 * @param arr1 数组1
 * @param arr2 数组2
 * @returns 交集
 */
export function intersection<T>(arr1: T[], arr2: T[]): T[] {
  const set2 = new Set(arr2);
  return arr1.filter((item) => set2.has(item));
}

/**
 * 数组并集
 *
 * @param arr1 数组1
 * @param arr2 数组2
 * @returns 并集
 */
export function union<T>(arr1: T[], arr2: T[]): T[] {
  return unique([...arr1, ...arr2]);
}

/**
 * 数组统计
 *
 * @param arr 数组
 * @returns 元素出现次数
 */
export function count<T>(arr: T[]): Record<string, number> {
  const result: Record<string, number> = {};
  for (const item of arr) {
    const key = String(item);
    result[key] = (result[key] || 0) + 1;
  }
  return result;
}

/**
 * 按属性统计
 *
 * @param arr 对象数组
 * @param key 属性键
 * @returns 属性值出现次数
 */
export function countBy<T extends Record<string, unknown>>(
  arr: T[],
  key: keyof T,
): Record<string, number> {
  const result: Record<string, number> = {};
  for (const item of arr) {
    const value = String(item[key]);
    result[value] = (result[value] || 0) + 1;
  }
  return result;
}
