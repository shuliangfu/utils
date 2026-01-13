/**
 * HTTP 客户端类
 *
 * 提供完整的 HTTP 客户端功能（拦截器、重试、超时等）
 */

import { ClientCookieManager } from "./cookies.ts"
import { InterceptorManager } from "./interceptors.ts"
import { defaultRetryCondition, withRetry } from "./retry.ts"
import type {
  DownloadOptions,
  HttpClientOptions,
  RequestConfig,
  UploadOptions,
} from "./types.ts"

/**
 * HTTP 客户端类
 *
 * 提供完整的 HTTP 客户端功能，包括：
 * - 请求/响应拦截器
 * - 自动重试
 * - 超时控制
 * - Cookie 管理
 * - 文件上传/下载
 */
export class HttpClient {
  private _options: Required<Omit<HttpClientOptions, "baseURL">> & {
    baseURL?: string;
  };
  public interceptors: {
    request: InterceptorManager;
    response: InterceptorManager;
  };
  public cookies: ClientCookieManager;

  /**
   * 创建 HTTP 客户端实例
   *
   * @param options 客户端配置选项
   */
  constructor(options: HttpClientOptions = {}) {
    this._options = {
      baseURL: options.baseURL,
      timeout: options.timeout ?? 0, // 0 表示不设置超时
      headers: options.headers || {},
      credentials: options.credentials || "same-origin",
      mode: options.mode || "cors",
      cache: options.cache || "default",
      redirect: options.redirect || "follow",
    };

    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager(),
    };

    this.cookies = new ClientCookieManager();
  }

  /**
   * 构建完整 URL
   *
   * @param url 请求 URL
   * @returns 完整 URL
   */
  private buildURL(url: string): string {
    if (!this._options.baseURL) {
      return url;
    }

    // 如果 url 是绝对 URL，直接返回
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    // 拼接 baseURL 和 url
    const baseURL = this._options.baseURL.endsWith("/")
      ? this._options.baseURL.slice(0, -1)
      : this._options.baseURL;
    const path = url.startsWith("/") ? url : `/${url}`;

    return `${baseURL}${path}`;
  }

  /**
   * 构建请求配置
   *
   * @param config 请求配置
   * @returns 处理后的请求配置
   */
  private buildRequestConfig(config: RequestConfig): RequestInit {
    const headers = new Headers(this._options.headers);

    // 合并请求头
    if (config.headers) {
      const configHeaders = new Headers(config.headers);
      configHeaders.forEach((value, key) => {
        headers.set(key, value);
      });
    }

    // 自动添加 Cookie
    const allCookies = this.cookies.getAll();
    const cookieHeader = Object.entries(allCookies)
      .map(([name, value]) => `${name}=${value}`)
      .join("; ");
    if (cookieHeader) {
      headers.set("Cookie", cookieHeader);
    }

    return {
      method: config.method || "GET",
      headers,
      body: config.body,
      credentials: config.credentials || this._options.credentials,
      mode: config.mode || this._options.mode,
      cache: config.cache || this._options.cache,
      redirect: config.redirect || this._options.redirect,
    };
  }

  /**
   * 处理超时
   *
   * @param promise 要执行的 Promise
   * @param timeout 超时时间（毫秒）
   * @returns 带超时的 Promise
   */
  private withTimeout<T>(
    promise: Promise<T>,
    timeout: number,
  ): Promise<T> {
    if (timeout <= 0) {
      return promise;
    }

    return Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Request timeout after ${timeout}ms`));
        }, timeout);
      }),
    ]);
  }

  /**
   * 判断是否应该使用 XMLHttpRequest
   *
   * 使用 XHR 的场景：
   * 1. 需要上传进度或事件（FormData 且有 onProgress、onStart、onComplete 等）
   * 2. 需要下载进度或事件（有 onProgress、onStart、onComplete 等）
   *
   * @param config 请求配置
   * @returns 是否使用 XHR
   */
  private shouldUseXHR(config: RequestConfig): boolean {
    // 浏览器环境才支持 XHR
    if (typeof (globalThis as any).XMLHttpRequest === "undefined") {
      return false;
    }

    const uploadOptions = config as UploadOptions;
    const downloadOptions = config as DownloadOptions;
    const isFormData = config.body instanceof FormData;

    // 检查是否有上传相关回调
    const hasUploadCallbacks = isFormData && (
      uploadOptions.onStart !== undefined ||
      uploadOptions.onProgress !== undefined ||
      uploadOptions.onComplete !== undefined ||
      uploadOptions.onError !== undefined ||
      uploadOptions.onAbort !== undefined
    );

    // 检查是否有下载相关回调
    const hasDownloadCallbacks = downloadOptions.onStart !== undefined ||
      downloadOptions.onProgress !== undefined ||
      downloadOptions.onComplete !== undefined ||
      downloadOptions.onError !== undefined ||
      downloadOptions.onAbort !== undefined;

    // 如果有上传或下载回调，使用 XHR
    return hasUploadCallbacks || hasDownloadCallbacks;
  }

  /**
   * 使用 Fetch API 发送请求
   *
   * @param url 请求 URL
   * @param config 请求配置
   * @returns 响应对象
   */
  private async requestWithFetch(
    url: string,
    config: RequestConfig,
  ): Promise<Response> {
    const requestInit = this.buildRequestConfig(config);
    const timeout = config.timeout ?? this._options.timeout;

    // 使用 AbortController 实现超时
    let abortController: AbortController | null = null;
    let timeoutId: number | null = null;

    if (timeout > 0) {
      abortController = new AbortController();
      timeoutId = setTimeout(() => {
        abortController!.abort();
      }, timeout);
    }

    try {
      const response = await fetch(url, {
        ...requestInit,
        signal: abortController?.signal,
      });

      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }

      // 处理 Cookie
      this.handleResponseCookies(response);

      return response;
    } catch (error) {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }

      // 如果是超时错误，检查是否需要重试
      if (config.retry !== false && config.retryOptions) {
        return await withRetry(
          () => this.requestWithFetch(url, config),
          {
            ...config.retryOptions,
            retryCondition: (err) => {
              if (
                err instanceof Error &&
                (err.name === "AbortError" || err.message.includes("timeout"))
              ) {
                return true;
              }
              return config.retryOptions?.retryCondition
                ? config.retryOptions.retryCondition(err)
                : defaultRetryCondition(err);
            },
          },
        );
      }

      throw error;
    }
  }

  /**
   * 使用 XMLHttpRequest 发送请求
   *
   * 优势：
   * - 支持上传进度
   * - 支持下载进度
   * - 原生超时支持
   * - 更好的错误处理
   *
   * @param url 请求 URL
   * @param config 请求配置
   * @returns 响应对象
   */
  private requestWithXHR(
    url: string,
    config: RequestConfig,
  ): Promise<Response> {
    return new Promise((resolve, reject) => {
      const xhr = new (globalThis as any).XMLHttpRequest();
      const timeout = config.timeout ?? this._options.timeout;

      // 设置超时（XHR 原生支持）
      if (timeout > 0) {
        xhr.timeout = timeout;
      }

      // 上传事件（XHR 独有功能）
      const uploadOptions = config as UploadOptions;
      if (xhr.upload) {
        // 上传开始
        if (uploadOptions.onStart) {
          xhr.upload.addEventListener("loadstart", () => {
            uploadOptions.onStart!();
          });
        }

        // 上传进度
        if (uploadOptions.onProgress) {
          xhr.upload.addEventListener("progress", (event: ProgressEvent) => {
            if (event.lengthComputable) {
              uploadOptions.onProgress!({
                loaded: event.loaded,
                total: event.total,
                percent: (event.loaded / event.total) * 100,
              });
            }
          });
        }

        // 上传完成
        if (uploadOptions.onComplete) {
          xhr.upload.addEventListener("load", () => {
            uploadOptions.onComplete!();
          });
        }

        // 上传错误
        if (uploadOptions.onError) {
          xhr.upload.addEventListener("error", () => {
            uploadOptions.onError!(
              new Error("Upload error occurred"),
            );
          });
        }

        // 上传取消
        if (uploadOptions.onAbort) {
          xhr.upload.addEventListener("abort", () => {
            uploadOptions.onAbort!();
          });
        }
      }

      // 下载事件
      const downloadOptions = config as DownloadOptions;

      // 下载开始
      if (downloadOptions.onStart) {
        xhr.addEventListener("loadstart", () => {
          downloadOptions.onStart!();
        });
      }

      // 下载进度
      if (downloadOptions.onProgress) {
        xhr.addEventListener("progress", (event: ProgressEvent) => {
          if (event.lengthComputable) {
            downloadOptions.onProgress!({
              loaded: event.loaded,
              total: event.total,
              percent: (event.loaded / event.total) * 100,
            });
          }
        });
      }

      // 下载完成
      if (downloadOptions.onComplete) {
        xhr.addEventListener("load", () => {
          downloadOptions.onComplete!();
        });
      }

      // 下载错误
      if (downloadOptions.onError) {
        xhr.addEventListener("error", () => {
          downloadOptions.onError!(
            new Error("Download error occurred"),
          );
        });
      }

      // 下载取消
      if (downloadOptions.onAbort) {
        xhr.addEventListener("abort", () => {
          downloadOptions.onAbort!();
        });
      }

      // 请求完成
      xhr.addEventListener("load", () => {
        // 处理 Cookie
        this.handleResponseCookiesFromXHR(xhr);

        // 构建 Response 对象（兼容 Fetch API）
        const response = this.createResponseFromXHR(xhr);

        // 执行响应拦截器
        this.interceptors.response.executeResponse(response)
          .then(resolve)
          .catch(reject);
      });

      // 请求错误
      xhr.addEventListener("error", () => {
        reject(new Error("Network error"));
      });

      // 超时
      xhr.addEventListener("timeout", () => {
        reject(new Error(`Request timeout after ${timeout}ms`));
      });

      // 中止
      xhr.addEventListener("abort", () => {
        reject(new Error("Request aborted"));
      });

      // 打开请求
      xhr.open(
        (config.method || "GET").toUpperCase(),
        url,
        true, // 异步
      );

      // 设置请求头
      const requestInit = this.buildRequestConfig(config);
      if (requestInit.headers) {
        const headers = new Headers(requestInit.headers);
        headers.forEach((value, key) => {
          // XHR 会自动设置 Content-Type（对于 FormData），不要手动设置
          if (
            !(config.body instanceof FormData) ||
            key.toLowerCase() !== "content-type"
          ) {
            xhr.setRequestHeader(key, value);
          }
        });
      }

      // 设置响应类型
      if (downloadOptions.onProgress) {
        xhr.responseType = "arraybuffer"; // 用于进度追踪
      }

      // 发送请求
      xhr.send(config.body as any);
    });
  }

  /**
   * 从 XHR 创建 Response 对象
   *
   * @param xhr XMLHttpRequest 对象
   * @returns Response 对象
   */
  private createResponseFromXHR(xhr: any): Response {
    // 解析响应头
    const headers = new Headers();
    const headerString = xhr.getAllResponseHeaders();
    if (headerString) {
      headerString.trim().split("\r\n").forEach((line: string) => {
        const [name, ...valueParts] = line.split(":");
        if (name && valueParts.length > 0) {
          headers.set(name.trim(), valueParts.join(":").trim());
        }
      });
    }

    // 构建响应体
    let body: BodyInit;
    if (xhr.responseType === "arraybuffer" && xhr.response) {
      body = xhr.response;
    } else if (xhr.responseText !== null) {
      body = xhr.responseText;
    } else {
      body = new Blob();
    }

    return new Response(body, {
      status: xhr.status,
      statusText: xhr.statusText,
      headers,
    });
  }

  /**
   * 处理响应中的 Cookie（Fetch API）
   *
   * @param response 响应对象
   */
  private handleResponseCookies(response: Response): void {
    const setCookieHeader = response.headers.get("Set-Cookie");
    if (setCookieHeader) {
      this.parseAndSetCookies(setCookieHeader);
    }
  }

  /**
   * 处理响应中的 Cookie（XMLHttpRequest）
   *
   * @param xhr XMLHttpRequest 对象
   */
  private handleResponseCookiesFromXHR(xhr: any): void {
    const setCookieHeader = xhr.getResponseHeader("Set-Cookie");
    if (setCookieHeader) {
      this.parseAndSetCookies(setCookieHeader);
    }
  }

  /**
   * 解析并设置 Cookie
   *
   * @param setCookieHeader Set-Cookie 头值
   */
  private parseAndSetCookies(setCookieHeader: string): void {
    // 简单的 Cookie 解析（实际应该更复杂，处理过期时间等）
    const cookies = setCookieHeader.split(",");
    for (const cookie of cookies) {
      const [nameValue, ...attributes] = cookie.split(";");
      const [name, value] = nameValue.split("=");
      if (name && value) {
        // 解析属性
        const cookieOptions: any = {};
        for (const attr of attributes) {
          const [key, val] = attr.trim().split("=");
          const lowerKey = key.toLowerCase();
          if (lowerKey === "expires" && val) {
            cookieOptions.expiresDate = new Date(val);
          } else if (lowerKey === "max-age" && val) {
            cookieOptions.expires = parseInt(val, 10);
          } else if (lowerKey === "domain" && val) {
            cookieOptions.domain = val;
          } else if (lowerKey === "path" && val) {
            cookieOptions.path = val;
          } else if (lowerKey === "secure") {
            cookieOptions.secure = true;
          } else if (lowerKey === "samesite" && val) {
            cookieOptions.sameSite = val.toLowerCase();
          }
        }

        this.cookies.set(name.trim(), value.trim(), cookieOptions);
      }
    }
  }

  /**
   * 发送请求
   *
   * @param config 请求配置
   * @returns 响应对象
   */
  private async request(config: RequestConfig): Promise<Response> {
    // 执行请求拦截器
    const interceptedConfig = await this.interceptors.request.executeRequest(
      config,
    );

    // 构建 URL
    const url = this.buildURL(interceptedConfig.url || "");

    // 判断使用 Fetch 还是 XHR
    if (this.shouldUseXHR(interceptedConfig)) {
      // 使用 XHR（支持上传/下载进度）
      return await this.requestWithXHR(url, interceptedConfig);
    } else {
      // 使用 Fetch（更现代，性能更好）
      const response = await this.requestWithFetch(url, interceptedConfig);
      // 执行响应拦截器
      return await this.interceptors.response.executeResponse(response);
    }
  }

  /**
   * GET 请求
   *
   * @param url 请求 URL
   * @param config 请求配置
   * @returns 响应对象
   */
  async get(url: string, config: RequestConfig = {}): Promise<Response> {
    return await this.request({ ...config, url, method: "GET" });
  }

  /**
   * POST 请求
   *
   * @param url 请求 URL
   * @param data 请求体数据
   * @param config 请求配置
   * @returns 响应对象
   */
  async post(
    url: string,
    data?: BodyInit | null,
    config: RequestConfig = {},
  ): Promise<Response> {
    return await this.request({ ...config, url, method: "POST", body: data });
  }

  /**
   * PUT 请求
   *
   * @param url 请求 URL
   * @param data 请求体数据
   * @param config 请求配置
   * @returns 响应对象
   */
  async put(
    url: string,
    data?: BodyInit | null,
    config: RequestConfig = {},
  ): Promise<Response> {
    return await this.request({ ...config, url, method: "PUT", body: data });
  }

  /**
   * DELETE 请求
   *
   * @param url 请求 URL
   * @param config 请求配置
   * @returns 响应对象
   */
  async delete(url: string, config: RequestConfig = {}): Promise<Response> {
    return await this.request({ ...config, url, method: "DELETE" });
  }

  /**
   * PATCH 请求
   *
   * @param url 请求 URL
   * @param data 请求体数据
   * @param config 请求配置
   * @returns 响应对象
   */
  async patch(
    url: string,
    data?: BodyInit | null,
    config: RequestConfig = {},
  ): Promise<Response> {
    return await this.request({ ...config, url, method: "PATCH", body: data });
  }

  /**
   * HEAD 请求
   *
   * @param url 请求 URL
   * @param config 请求配置
   * @returns 响应对象
   */
  async head(url: string, config: RequestConfig = {}): Promise<Response> {
    return await this.request({ ...config, url, method: "HEAD" });
  }

  /**
   * OPTIONS 请求
   *
   * @param url 请求 URL
   * @param config 请求配置
   * @returns 响应对象
   */
  async options(
    url: string,
    config: RequestConfig = {},
  ): Promise<Response> {
    return await this.request({ ...config, url, method: "OPTIONS" });
  }

  /**
   * 上传文件
   *
   * 自动选择最佳实现：
   * - 如果有上传进度回调，使用 XMLHttpRequest（支持上传进度）
   * - 否则使用 Fetch API（更现代，性能更好）
   *
   * @param url 请求 URL
   * @param data 文件数据（FormData 或 File）
   * @param uploadOptions 上传配置选项
   * @returns 响应对象
   */
  async upload(
    url: string,
    data: FormData | File,
    uploadOptions: UploadOptions = {},
  ): Promise<Response> {
    // 如果是 File，转换为 FormData
    let formData: FormData;
    if (data instanceof File) {
      formData = new FormData();
      formData.append("file", data);
    } else {
      formData = data;
    }

    // 使用统一的 request 方法，会自动选择 Fetch 或 XHR
    return await this.request({
      ...uploadOptions,
      url,
      method: "POST",
      body: formData,
    });
  }

  /**
   * 下载文件
   *
   * 自动选择最佳实现：
   * - 如果有下载进度回调，使用 XMLHttpRequest（更准确的进度）
   * - 否则使用 Fetch API（流式处理，性能更好）
   *
   * @param url 请求 URL
   * @param options 下载配置选项
   * @returns Blob 对象
   */
  async download(
    url: string,
    options: DownloadOptions = {},
  ): Promise<Blob> {
    // 如果有下载进度，使用 XHR（更准确）
    if (options.onProgress) {
      const response = await this.get(url, options);
      return await response.blob();
    }

    // 否则使用 Fetch 流式处理（性能更好）
    const response = await this.get(url, options);

    // 如果服务器支持流式传输，使用流式下载
    if (response.body) {
      const reader = response.body.getReader();
      const chunks: BlobPart[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        if (value) {
          chunks.push(value);
        }
      }

      return new Blob(chunks);
    }

    return await response.blob();
  }
}
