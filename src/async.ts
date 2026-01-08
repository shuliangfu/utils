/**
 * @module @dreamer/utils/async
 *
 * 异步工具函数模块
 *
 * 提供防抖、节流、重试、超时控制、并发控制、延迟等功能。
 */

/**
 * 防抖函数
 *
 * @param fn 函数
 * @param delay 延迟时间（毫秒）
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: number | undefined;

  return function (this: unknown, ...args: Parameters<T>) {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay) as unknown as number;
  };
}

/**
 * 节流函数
 *
 * @param fn 函数
 * @param delay 延迟时间（毫秒）
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let lastCall = 0;

  return function (this: unknown, ...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}

/**
 * 重试选项
 */
export interface RetryOptions {
  /** 最大尝试次数 */
  maxAttempts?: number;
  /** 延迟时间（毫秒） */
  delay?: number;
  /** 延迟增长因子 */
  backoff?: number;
  /** 是否应该重试的判断函数 */
  shouldRetry?: (error: Error) => boolean;
}

/**
 * 重试异步函数
 *
 * @param fn 异步函数
 * @param options 选项
 * @returns 结果
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoff = 1,
    shouldRetry = () => true,
  } = options;

  let lastError: Error;
  let currentDelay = delay;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === maxAttempts || !shouldRetry(lastError)) {
        throw lastError;
      }

      await sleep(currentDelay);
      currentDelay *= backoff;
    }
  }

  throw lastError!;
}

/**
 * 超时控制
 *
 * @param promise Promise
 * @param timeout 超时时间（毫秒）
 * @returns 结果
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeout: number,
): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<T>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`操作超时（${timeout}ms）`));
    }, timeout);
  });

  return Promise.race([
    promise.then((result) => {
      // 如果 promise 先完成，清理定时器
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
      return result;
    }).catch((error) => {
      // 如果 promise 失败，也清理定时器
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
      throw error;
    }),
    timeoutPromise,
  ]);
}

/**
 * 并发控制选项
 */
export interface ConcurrencyOptions {
  /** 并发数 */
  concurrency?: number;
}

/**
 * 并发执行
 *
 * @param tasks 任务数组
 * @param options 选项
 * @returns 结果数组
 */
export async function parallel<T>(
  tasks: (() => Promise<T>)[],
  options: ConcurrencyOptions = {},
): Promise<T[]> {
  const { concurrency = Infinity } = options;
  const results: T[] = [];
  const executing: Promise<void>[] = [];

  for (const task of tasks) {
    const promise = task().then((result) => {
      results.push(result);
    });

    executing.push(promise);

    if (executing.length >= concurrency) {
      await Promise.race(executing);
      executing.splice(
        executing.findIndex((p) => p === promise),
        1,
      );
    }
  }

  await Promise.all(executing);
  return results;
}

/**
 * 顺序执行
 *
 * @param tasks 任务数组
 * @returns 结果数组
 */
export async function series<T>(
  tasks: (() => Promise<T>)[],
): Promise<T[]> {
  const results: T[] = [];
  for (const task of tasks) {
    results.push(await task());
  }
  return results;
}

/**
 * 延迟
 *
 * @param ms 毫秒数
 * @returns Promise
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 延迟（别名）
 */
export const delay = sleep;
