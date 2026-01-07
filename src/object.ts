/**
 * @module @dreamer/utils/object
 *
 * 对象操作工具函数模块
 *
 * 提供对象克隆、合并、路径访问、过滤、比较等功能。
 */

/**
 * 深度克隆
 *
 * @param obj 对象
 * @returns 克隆后的对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }

  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item)) as unknown as T;
  }

  if (typeof obj === "object") {
    const cloned = {} as Record<string, unknown>;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cloned[key] = deepClone((obj as Record<string, unknown>)[key]);
      }
    }
    return cloned as T;
  }

  return obj;
}

/**
 * 对象合并（浅合并）
 *
 * @param target 目标对象
 * @param sources 源对象
 * @returns 合并后的对象
 */
export function merge<T extends Record<string, unknown>>(
  target: T,
  ...sources: Partial<T>[]
): T {
  return Object.assign({}, target, ...sources);
}

/**
 * 深度合并
 *
 * @param target 目标对象
 * @param sources 源对象
 * @returns 合并后的对象
 */
export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  ...sources: Partial<T>[]
): T {
  const result = { ...target } as T;
  for (const source of sources) {
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        const sourceValue = source[key];
        const targetValue = result[key];

        if (
          sourceValue &&
          typeof sourceValue === "object" &&
          !Array.isArray(sourceValue) &&
          targetValue &&
          typeof targetValue === "object" &&
          !Array.isArray(targetValue)
        ) {
          (result as Record<string, unknown>)[key] = deepMerge(
            targetValue as Record<string, unknown>,
            sourceValue as Record<string, unknown>,
          );
        } else {
          (result as Record<string, unknown>)[key] = sourceValue;
        }
      }
    }
  }
  return result;
}

/**
 * 获取对象路径值
 *
 * @param obj 对象
 * @param path 路径（如 "user.name"）
 * @param defaultValue 默认值
 * @returns 值
 */
export function get<T = unknown>(
  obj: Record<string, unknown>,
  path: string,
  defaultValue?: T,
): T | undefined {
  const keys = path.split(".");
  let result: unknown = obj;
  for (const key of keys) {
    if (result === null || result === undefined) {
      return defaultValue;
    }
    result = (result as Record<string, unknown>)[key];
  }
  return (result as T) ?? defaultValue;
}

/**
 * 设置对象路径值
 *
 * @param obj 对象
 * @param path 路径（如 "user.name"）
 * @param value 值
 */
export function set(
  obj: Record<string, unknown>,
  path: string,
  value: unknown,
): void {
  const keys = path.split(".");
  const lastKey = keys.pop()!;
  let current: Record<string, unknown> = obj;

  for (const key of keys) {
    if (
      !(key in current) || typeof current[key] !== "object" ||
      current[key] === null
    ) {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }

  current[lastKey] = value;
}

/**
 * 检查对象路径是否存在
 *
 * @param obj 对象
 * @param path 路径
 * @returns 是否存在
 */
export function has(obj: Record<string, unknown>, path: string): boolean {
  const keys = path.split(".");
  let current: unknown = obj;

  for (const key of keys) {
    if (
      current === null || current === undefined || typeof current !== "object"
    ) {
      return false;
    }
    if (!(key in current)) {
      return false;
    }
    current = (current as Record<string, unknown>)[key];
  }

  return true;
}

/**
 * 删除对象路径值
 *
 * @param obj 对象
 * @param path 路径
 * @returns 是否删除成功
 */
export function deletePath(
  obj: Record<string, unknown>,
  path: string,
): boolean {
  const keys = path.split(".");
  const lastKey = keys.pop()!;
  let current: Record<string, unknown> = obj;

  for (const key of keys) {
    if (
      !(key in current) || typeof current[key] !== "object" ||
      current[key] === null
    ) {
      return false;
    }
    current = current[key] as Record<string, unknown>;
  }

  if (lastKey in current) {
    delete current[lastKey];
    return true;
  }

  return false;
}

/**
 * 选择对象属性
 *
 * @param obj 对象
 * @param keys 属性键数组
 * @returns 新对象（只包含指定属性）
 */
export function pick<T extends Record<string, unknown>>(
  obj: T,
  keys: (keyof T)[],
): Partial<T> {
  const result = {} as Partial<T>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * 排除对象属性
 *
 * @param obj 对象
 * @param keys 属性键数组
 * @returns 新对象（排除指定属性）
 */
export function omit<T extends Record<string, unknown>>(
  obj: T,
  keys: (keyof T)[],
): Partial<T> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}

/**
 * 对象比较（浅比较）
 *
 * @param obj1 对象1
 * @param obj2 对象2
 * @returns 是否相等
 */
export function isEqual(obj1: unknown, obj2: unknown): boolean {
  if (obj1 === obj2) {
    return true;
  }

  if (
    obj1 === null || obj2 === null || typeof obj1 !== "object" ||
    typeof obj2 !== "object"
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (!keys2.includes(key)) {
      return false;
    }
    if (
      (obj1 as Record<string, unknown>)[key] !==
        (obj2 as Record<string, unknown>)[key]
    ) {
      return false;
    }
  }

  return true;
}

/**
 * 对象深度比较
 *
 * @param obj1 对象1
 * @param obj2 对象2
 * @returns 是否相等
 */
export function isDeepEqual(obj1: unknown, obj2: unknown): boolean {
  if (obj1 === obj2) {
    return true;
  }

  if (
    obj1 === null || obj2 === null || typeof obj1 !== "object" ||
    typeof obj2 !== "object"
  ) {
    return false;
  }

  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) {
      return false;
    }
    for (let i = 0; i < obj1.length; i++) {
      if (!isDeepEqual(obj1[i], obj2[i])) {
        return false;
      }
    }
    return true;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (!keys2.includes(key)) {
      return false;
    }
    if (
      !isDeepEqual(
        (obj1 as Record<string, unknown>)[key],
        (obj2 as Record<string, unknown>)[key],
      )
    ) {
      return false;
    }
  }

  return true;
}
