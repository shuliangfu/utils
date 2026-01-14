export * from "../object.ts";

/**
 * @module @dreamer/utils/client/object
 *
 * 客户端对象操作工具函数模块
 *
 * 提供客户端常用的对象操作工具函数，包括类型转换、动态属性访问等。
 */

/**
 * 将对象转换为 Record<string, unknown> 类型
 *
 * 用于类型安全的动态属性访问
 *
 * @param obj 对象
 * @returns Record<string, unknown> 类型的对象
 *
 * @example
 * ```typescript
 * const ctx = { path: "/", method: "GET" };
 * const record = toRecord(ctx);
 * record.customProperty = "value"; // 类型安全
 * ```
 */
export function toRecord<T extends Record<string, unknown>>(
  obj: T,
): Record<string, unknown> {
  return obj as Record<string, unknown>;
}

/**
 * 安全地获取对象的动态属性
 *
 * @param obj 对象
 * @param key 属性键
 * @param defaultValue 默认值（可选）
 * @returns 属性值或默认值
 *
 * @example
 * ```typescript
 * const ctx = { path: "/", method: "GET" };
 * const css = getProperty<string>(ctx, "tailwindCSS", "");
 * ```
 */
export function getProperty<T = unknown>(
  obj: Record<string, unknown>,
  key: string,
  defaultValue?: T,
): T | undefined {
  return (obj[key] as T) ?? defaultValue;
}

/**
 * 安全地设置对象的动态属性
 *
 * @param obj 对象
 * @param key 属性键
 * @param value 属性值
 *
 * @example
 * ```typescript
 * const ctx = { path: "/", method: "GET" };
 * setProperty(ctx, "tailwindCSS", "body { margin: 0; }");
 * ```
 */
export function setProperty(
  obj: Record<string, unknown>,
  key: string,
  value: unknown,
): void {
  obj[key] = value;
}

/**
 * 检查对象是否具有指定属性
 *
 * @param obj 对象
 * @param key 属性键
 * @returns 是否存在
 *
 * @example
 * ```typescript
 * const ctx = { path: "/", method: "GET" };
 * if (hasProperty(ctx, "tailwindCSS")) {
 *   const css = getProperty<string>(ctx, "tailwindCSS");
 * }
 * ```
 */
export function hasProperty(
  obj: Record<string, unknown>,
  key: string,
): boolean {
  return key in obj;
}

/**
 * 删除对象的指定属性
 *
 * @param obj 对象
 * @param key 属性键
 * @returns 是否删除成功
 *
 * @example
 * ```typescript
 * const ctx = { path: "/", method: "GET", temp: "value" };
 * deleteProperty(ctx, "temp");
 * ```
 */
export function deleteProperty(
  obj: Record<string, unknown>,
  key: string,
): boolean {
  if (key in obj) {
    delete obj[key];
    return true;
  }
  return false;
}

/**
 * 类型安全的类型断言工具
 *
 * 将对象断言为指定类型，用于类型转换
 *
 * @param obj 对象
 * @returns 断言后的对象
 *
 * @example
 * ```typescript
 * const unknownObj: unknown = { name: "test" };
 * const record = asRecord(unknownObj);
 * ```
 */
export function asRecord(obj: unknown): Record<string, unknown> {
  return obj as Record<string, unknown>;
}

/**
 * 类型安全的类型断言工具（带类型参数）
 *
 * @param obj 对象
 * @returns 断言后的对象
 *
 * @example
 * ```typescript
 * const ctx = { path: "/" };
 * const css = asType<string>(ctx.tailwindCSS);
 * ```
 */
export function asType<T>(obj: unknown): T {
  return obj as T;
}
