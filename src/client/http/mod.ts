/**
 * @module @dreamer/utils/client/http
 *
 * @dreamer/utils/client/http HTTP 客户端库
 *
 * 提供完整的 HTTP 客户端功能，包括：
 * - 请求/响应拦截器
 * - 自动重试和超时控制
 * - 文件上传/下载
 * - Cookie 管理
 *
 * 环境兼容性：
 * - 客户端：✅ 支持（浏览器环境）
 * - 服务端：❌ 不支持（使用服务端 HTTP 库）
 *
 * @example
 * ```typescript
 * import { HttpClient } from "@dreamer/utils/client/http";
 *
 * const client = new HttpClient({
 *   baseURL: "https://api.example.com",
 *   timeout: 5000,
 * });
 *
 * // 配置拦截器
 * client.interceptors.request.use((config) => {
 *   config.headers.set("Authorization", `Bearer ${token}`);
 *   return config;
 * });
 *
 * // 发送请求
 * const response = await client.get("/users");
 * const users = await response.json();
 * ```
 */

// 导出核心类
export { HttpClient } from "./client.ts";
export { ClientCookieManager } from "./cookies.ts";
export { InterceptorManager } from "./interceptors.ts";

// 导出类型
export type {
  ClientCookieOptions,
  DownloadOptions,
  DownloadProgress,
  HttpClientOptions,
  RequestConfig,
  RetryOptions,
  UploadOptions,
  UploadProgress,
} from "./types.ts";

// 导出工具函数
export { defaultRetryCondition, withRetry } from "./retry.ts";
