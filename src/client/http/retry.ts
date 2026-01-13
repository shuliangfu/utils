/**
 * 重试逻辑
 *
 * 提供自动重试失败请求的功能
 */

import type { RetryOptions } from "./types.ts";

/**
 * 默认重试配置
 */
const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  retries: 0,
  retryDelay: 1000,
  retryCondition: () => true,
  exponentialBackoff: false,
};

/**
 * 执行重试逻辑
 *
 * @param fn 要执行的函数
 * @param options 重试配置选项
 * @returns 执行结果
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const config = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let lastError: Error | Response;

  for (let attempt = 0; attempt <= config.retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Response(String(error));

      // 如果是最后一次尝试，抛出错误
      if (attempt >= config.retries) {
        throw lastError;
      }

      // 检查是否应该重试
      if (!config.retryCondition(lastError)) {
        throw lastError;
      }

      // 计算延迟时间
      const delay = config.exponentialBackoff
        ? config.retryDelay * Math.pow(2, attempt)
        : config.retryDelay;

      // 等待后重试
      await sleep(delay);
    }
  }

  throw lastError!;
}

/**
 * 睡眠函数
 *
 * @param ms 毫秒数
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 默认重试条件
 * 重试网络错误和 5xx 状态码
 *
 * @param error 错误对象或响应对象
 * @returns 是否应该重试
 */
export function defaultRetryCondition(
  error: Error | Response,
): boolean {
  // 如果是网络错误
  if (error instanceof Error) {
    return true;
  }

  // 如果是 5xx 状态码，重试
  if (error instanceof Response) {
    return error.status >= 500 && error.status < 600;
  }

  return false;
}
