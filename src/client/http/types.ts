/**
 * HTTP 客户端类型定义
 */

/**
 * HTTP 客户端配置选项
 */
export interface HttpClientOptions {
  /** 基础 URL */
  baseURL?: string;
  /** 超时时间（毫秒） */
  timeout?: number;
  /** 默认请求头 */
  headers?: HeadersInit;
  /** 凭证模式 */
  credentials?: RequestCredentials;
  /** 请求模式 */
  mode?: RequestMode;
  /** 缓存模式 */
  cache?: RequestCache;
  /** 重定向模式 */
  redirect?: RequestRedirect;
}

/**
 * 请求配置
 */
export interface RequestConfig extends RequestInit {
  /** 请求 URL（相对于 baseURL） */
  url?: string;
  /** 请求方法 */
  method?: string;
  /** 请求头 */
  headers?: HeadersInit;
  /** 请求体 */
  body?: BodyInit | null;
  /** 超时时间（毫秒，覆盖全局配置） */
  timeout?: number;
  /** 是否自动重试 */
  retry?: boolean;
  /** 重试配置 */
  retryOptions?: RetryOptions;
}

/**
 * 重试配置选项
 */
export interface RetryOptions {
  /** 重试次数（默认：0） */
  retries?: number;
  /** 重试延迟（毫秒，默认：1000） */
  retryDelay?: number;
  /** 重试条件（返回 true 表示应该重试） */
  retryCondition?: (error: Error | Response) => boolean;
  /** 是否使用指数退避（默认：false） */
  exponentialBackoff?: boolean;
}

/**
 * 上传进度回调
 */
export interface UploadProgress {
  /** 已上传字节数 */
  loaded: number;
  /** 总字节数 */
  total: number;
  /** 上传百分比 */
  percent: number;
}

/**
 * 下载进度回调
 */
export interface DownloadProgress {
  /** 已下载字节数 */
  loaded: number;
  /** 总字节数 */
  total: number;
  /** 下载百分比 */
  percent: number;
}

/**
 * 上传配置选项
 */
export interface UploadOptions extends RequestConfig {
  /** 上传开始回调 */
  onStart?: () => void;
  /** 上传进度回调 */
  onProgress?: (progress: UploadProgress) => void;
  /** 上传完成回调 */
  onComplete?: () => void;
  /** 上传错误回调 */
  onError?: (error: Error) => void;
  /** 上传取消回调 */
  onAbort?: () => void;
}

/**
 * 下载配置选项
 */
export interface DownloadOptions extends RequestConfig {
  /** 下载开始回调 */
  onStart?: () => void;
  /** 下载进度回调 */
  onProgress?: (progress: DownloadProgress) => void;
  /** 下载完成回调 */
  onComplete?: () => void;
  /** 下载错误回调 */
  onError?: (error: Error) => void;
  /** 下载取消回调 */
  onAbort?: () => void;
  /** 是否自动保存文件 */
  saveAs?: boolean;
  /** 保存文件名（如果 saveAs 为 true） */
  filename?: string;
}

/**
 * Cookie 选项（客户端）
 */
export interface ClientCookieOptions {
  /** 过期时间（秒） */
  expires?: number;
  /** 过期日期 */
  expiresDate?: Date;
  /** 域名 */
  domain?: string;
  /** 路径 */
  path?: string;
  /** 是否只在 HTTPS 下发送 */
  secure?: boolean;
  /** SameSite 策略 */
  sameSite?: "strict" | "lax" | "none";
}
