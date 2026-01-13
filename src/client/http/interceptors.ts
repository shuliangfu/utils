/**
 * 拦截器系统
 *
 * 提供请求拦截器和响应拦截器功能
 */

import type { RequestConfig } from "./types.ts";

/**
 * 请求拦截器函数类型
 */
export type RequestInterceptor = (
  config: RequestConfig,
) => RequestConfig | Promise<RequestConfig>;

/**
 * 请求错误拦截器函数类型
 */
export type RequestErrorInterceptor = (error: Error) => Promise<never>;

/**
 * 响应拦截器函数类型
 */
export type ResponseInterceptor = (
  response: Response,
) => Response | Promise<Response>;

/**
 * 响应错误拦截器函数类型
 */
export type ResponseErrorInterceptor = (error: Error) => Promise<never>;

/**
 * 拦截器注册信息
 */
interface InterceptorRegistration<T> {
  fulfilled: T;
  rejected?: (error: Error) => Promise<never>;
}

/**
 * 拦截器管理器
 */
export class InterceptorManager {
  private requestInterceptors: InterceptorRegistration<RequestInterceptor>[] =
    [];
  private responseInterceptors: InterceptorRegistration<ResponseInterceptor>[] =
    [];

  /**
   * 注册请求拦截器
   *
   * @param fulfilled 请求拦截器函数
   * @param rejected 请求错误拦截器函数（可选）
   * @returns 拦截器 ID（用于移除）
   */
  use(
    fulfilled: RequestInterceptor,
    rejected?: RequestErrorInterceptor,
  ): number {
    this.requestInterceptors.push({ fulfilled, rejected });
    return this.requestInterceptors.length - 1;
  }

  /**
   * 注册响应拦截器
   *
   * @param fulfilled 响应拦截器函数
   * @param rejected 响应错误拦截器函数（可选）
   * @returns 拦截器 ID（用于移除）
   */
  useResponse(
    fulfilled: ResponseInterceptor,
    rejected?: ResponseErrorInterceptor,
  ): number {
    this.responseInterceptors.push({ fulfilled, rejected });
    return this.responseInterceptors.length - 1;
  }

  /**
   * 移除请求拦截器
   *
   * @param id 拦截器 ID
   */
  ejectRequest(id: number): void {
    if (this.requestInterceptors[id]) {
      this.requestInterceptors[id] = null as any;
    }
  }

  /**
   * 移除响应拦截器
   *
   * @param id 拦截器 ID
   */
  ejectResponse(id: number): void {
    if (this.responseInterceptors[id]) {
      this.responseInterceptors[id] = null as any;
    }
  }

  /**
   * 执行请求拦截器链
   *
   * @param config 请求配置
   * @returns 处理后的请求配置
   */
  async executeRequest(config: RequestConfig): Promise<RequestConfig> {
    let currentConfig = config;

    for (const interceptor of this.requestInterceptors) {
      if (!interceptor) {
        continue;
      }

      try {
        currentConfig = await interceptor.fulfilled(currentConfig);
      } catch (error) {
        if (interceptor.rejected) {
          return await interceptor.rejected(
            error instanceof Error ? error : new Error(String(error)),
          );
        }
        throw error;
      }
    }

    return currentConfig;
  }

  /**
   * 执行响应拦截器链
   *
   * @param response 响应对象
   * @returns 处理后的响应对象
   */
  async executeResponse(response: Response): Promise<Response> {
    let currentResponse = response;

    for (const interceptor of this.responseInterceptors) {
      if (!interceptor) {
        continue;
      }

      try {
        currentResponse = await interceptor.fulfilled(currentResponse);
      } catch (error) {
        if (interceptor.rejected) {
          return await interceptor.rejected(
            error instanceof Error ? error : new Error(String(error)),
          );
        }
        throw error;
      }
    }

    return currentResponse;
  }

  /**
   * 清空所有拦截器
   */
  clear(): void {
    this.requestInterceptors = [];
    this.responseInterceptors = [];
  }
}
