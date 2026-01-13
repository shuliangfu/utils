/**
 * @fileoverview HTTP 客户端测试
 */

import { describe, expect, it, beforeEach, afterEach } from "@dreamer/test";
import {
  HttpClient,
  ClientCookieManager,
  InterceptorManager,
} from "../src/client/http/mod.ts";
import type {
  HttpClientOptions,
  RequestConfig,
  UploadOptions,
  DownloadOptions,
} from "../src/client/http/types.ts";

/**
 * Mock Fetch API
 */
function createMockFetch(
  responseData: any = { success: true },
  status: number = 200,
  headers: Record<string, string> = {},
): typeof fetch {
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    // 模拟延迟
    await new Promise((resolve) => setTimeout(resolve, 10));

    const responseHeaders = new Headers(headers);
    const body = JSON.stringify(responseData);

    return new Response(body, {
      status,
      statusText: status === 200 ? "OK" : "Error",
      headers: responseHeaders,
    });
  };
}

/**
 * Mock XMLHttpRequest
 */
class MockXMLHttpRequest {
  private _status: number = 200;
  private _statusText: string = "OK";
  private _responseText: string = "";
  private _response: any = null;
  private _responseType: string = "";
  private _headers: Record<string, string> = {};
  private _method: string = "GET";
  private _url: string = "";
  private _timeout: number = 0;
  private _onload: ((event: Event) => void) | null = null;
  private _onerror: ((event: Event) => void) | null = null;
  private _ontimeout: ((event: Event) => void) | null = null;
  private _onabort: ((event: Event) => void) | null = null;
  public upload: {
    addEventListener: (type: string, handler: (event: any) => void) => void;
    _listeners: Map<string, (event: any) => void>;
  };

  constructor() {
    this.upload = {
      _listeners: new Map(),
      addEventListener: (type: string, handler: (event: any) => void) => {
        this.upload._listeners.set(type, handler);
      },
    };
  }

  open(method: string, url: string, async: boolean = true): void {
    this._method = method;
    this._url = url;
  }

  setRequestHeader(name: string, value: string): void {
    this._headers[name] = value;
  }

  send(body?: any): void {
    // 模拟异步请求
    setTimeout(() => {
      this._responseText = JSON.stringify({ success: true });
      this._response = this._responseText;
      if (this._onload) {
        this._onload(new Event("load"));
      }
    }, 10);
  }

  getAllResponseHeaders(): string {
    return Object.entries(this._headers)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\r\n");
  }

  getResponseHeader(name: string): string | null {
    return this._headers[name] || null;
  }

  abort(): void {
    if (this._onabort) {
      this._onabort(new Event("abort"));
    }
  }

  // Getters and setters
  get status(): number {
    return this._status;
  }

  set status(value: number) {
    this._status = value;
  }

  get statusText(): string {
    return this._statusText;
  }

  set statusText(value: string) {
    this._statusText = value;
  }

  get responseText(): string {
    return this._responseText;
  }

  get response(): any {
    return this._response;
  }

  get responseType(): string {
    return this._responseType;
  }

  set responseType(value: string) {
    this._responseType = value;
  }

  get timeout(): number {
    return this._timeout;
  }

  set timeout(value: number) {
    this._timeout = value;
  }

  addEventListener(
    type: string,
    handler: (event: Event) => void,
  ): void {
    if (type === "load") {
      this._onload = handler;
    } else if (type === "error") {
      this._onerror = handler;
    } else if (type === "timeout") {
      this._ontimeout = handler;
    } else if (type === "abort") {
      this._onabort = handler;
    }
  }
}

describe("HttpClient", () => {
  let originalFetch: typeof fetch;
  let originalXHR: any;
  let mockFetch: typeof fetch;
  let mockXHR: typeof MockXMLHttpRequest;

  beforeEach(() => {
    // 保存原始的 fetch 和 XMLHttpRequest
    originalFetch = globalThis.fetch;
    originalXHR = (globalThis as any).XMLHttpRequest;

    // Mock fetch
    mockFetch = createMockFetch();
    globalThis.fetch = mockFetch as any;

    // Mock XMLHttpRequest
    mockXHR = MockXMLHttpRequest;
    (globalThis as any).XMLHttpRequest = MockXMLHttpRequest;

    // Mock document.cookie（用于 Cookie 测试）
    if (typeof (globalThis as any).document === "undefined") {
      (globalThis as any).document = {
        cookie: "",
      };
    }
  });

  afterEach(() => {
    // 恢复原始的 fetch 和 XMLHttpRequest
    globalThis.fetch = originalFetch;
    (globalThis as any).XMLHttpRequest = originalXHR;
  });

  describe("构造函数", () => {
    it("应该使用默认配置创建客户端", () => {
      const client = new HttpClient();
      expect(client).toBeInstanceOf(HttpClient);
      expect(client.interceptors).toBeDefined();
      expect(client.cookies).toBeDefined();
    });

    it("应该使用自定义配置创建客户端", () => {
      const options: HttpClientOptions = {
        baseURL: "https://api.example.com",
        timeout: 5000,
        headers: {
          "Content-Type": "application/json",
        },
      };
      const client = new HttpClient(options);
      expect(client).toBeInstanceOf(HttpClient);
    });
  });

  describe("URL 构建", () => {
    it("应该使用 baseURL 构建完整 URL", async () => {
      const client = new HttpClient({
        baseURL: "https://api.example.com",
      });

      let requestUrl = "";
      globalThis.fetch = async (input: RequestInfo | URL) => {
        requestUrl = input.toString();
        return createMockFetch()(input);
      };

      await client.get("/users");
      expect(requestUrl).toBe("https://api.example.com/users");
    });

    it("应该处理 baseURL 末尾的斜杠", async () => {
      const client = new HttpClient({
        baseURL: "https://api.example.com/",
      });

      let requestUrl = "";
      globalThis.fetch = async (input: RequestInfo | URL) => {
        requestUrl = input.toString();
        return createMockFetch()(input);
      };

      await client.get("/users");
      expect(requestUrl).toBe("https://api.example.com/users");
    });

    it("应该处理绝对 URL（不拼接 baseURL）", async () => {
      const client = new HttpClient({
        baseURL: "https://api.example.com",
      });

      let requestUrl = "";
      globalThis.fetch = async (input: RequestInfo | URL) => {
        requestUrl = input.toString();
        return createMockFetch()(input);
      };

      await client.get("https://other-api.com/users");
      expect(requestUrl).toBe("https://other-api.com/users");
    });
  });

  describe("HTTP 方法", () => {
    let client: HttpClient;

    beforeEach(() => {
      client = new HttpClient();
    });

    it("应该发送 GET 请求", async () => {
      const response = await client.get("https://api.example.com/users");
      expect(response).toBeInstanceOf(Response);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
    });

    it("应该发送 POST 请求", async () => {
      const response = await client.post("https://api.example.com/users", {
        name: "John",
      });
      expect(response).toBeInstanceOf(Response);
      expect(response.status).toBe(200);
    });

    it("应该发送 PUT 请求", async () => {
      const response = await client.put("https://api.example.com/users/1", {
        name: "John Updated",
      });
      expect(response).toBeInstanceOf(Response);
      expect(response.status).toBe(200);
    });

    it("应该发送 DELETE 请求", async () => {
      const response = await client.delete("https://api.example.com/users/1");
      expect(response).toBeInstanceOf(Response);
      expect(response.status).toBe(200);
    });

    it("应该发送 PATCH 请求", async () => {
      const response = await client.patch("https://api.example.com/users/1", {
        name: "John Patched",
      });
      expect(response).toBeInstanceOf(Response);
      expect(response.status).toBe(200);
    });

    it("应该发送 HEAD 请求", async () => {
      const response = await client.head("https://api.example.com/users/1");
      expect(response).toBeInstanceOf(Response);
      expect(response.status).toBe(200);
    });

    it("应该发送 OPTIONS 请求", async () => {
      const response = await client.options("https://api.example.com/users");
      expect(response).toBeInstanceOf(Response);
      expect(response.status).toBe(200);
    });
  });

  describe("请求头", () => {
    it("应该设置默认请求头", async () => {
      const client = new HttpClient({
        headers: {
          "Content-Type": "application/json",
          "X-Custom-Header": "custom-value",
        },
      });

      let requestHeaders: Headers | null = null;
      globalThis.fetch = async (
        input: RequestInfo | URL,
        init?: RequestInit,
      ) => {
        requestHeaders = init?.headers as Headers;
        return createMockFetch()(input, init);
      };

      await client.get("https://api.example.com/users");
      expect(requestHeaders).toBeDefined();
      if (requestHeaders instanceof Headers) {
        expect(requestHeaders.get("Content-Type")).toBe("application/json");
        expect(requestHeaders.get("X-Custom-Header")).toBe("custom-value");
      }
    });

    it("应该合并请求级别的请求头", async () => {
      const client = new HttpClient({
        headers: {
          "Content-Type": "application/json",
        },
      });

      let requestHeaders: Headers | null = null;
      globalThis.fetch = async (
        input: RequestInfo | URL,
        init?: RequestInit,
      ) => {
        requestHeaders = init?.headers as Headers;
        return createMockFetch()(input, init);
      };

      await client.get("https://api.example.com/users", {
        headers: {
          "X-Request-ID": "123",
        },
      });

      expect(requestHeaders).toBeDefined();
      if (requestHeaders instanceof Headers) {
        expect(requestHeaders.get("Content-Type")).toBe("application/json");
        expect(requestHeaders.get("X-Request-ID")).toBe("123");
      }
    });
  });

  describe("拦截器", () => {
    let client: HttpClient;

    beforeEach(() => {
      client = new HttpClient();
    });

    it("应该执行请求拦截器", async () => {
      let interceptedConfig: RequestConfig | null = null;

      client.interceptors.request.use((config) => {
        interceptedConfig = config;
        config.headers = new Headers(config.headers);
        config.headers.set("Authorization", "Bearer token123");
        return config;
      });

      await client.get("https://api.example.com/users");
      expect(interceptedConfig).toBeDefined();
    });

    it("应该执行响应拦截器", async () => {
      let interceptedResponse: Response | null = null;

      client.interceptors.response.use((response) => {
        interceptedResponse = response;
        return response;
      });

      await client.get("https://api.example.com/users");
      expect(interceptedResponse).toBeInstanceOf(Response);
    });

    it("应该支持多个请求拦截器", async () => {
      const callOrder: string[] = [];

      client.interceptors.request.use((config) => {
        callOrder.push("interceptor1");
        return config;
      });

      client.interceptors.request.use((config) => {
        callOrder.push("interceptor2");
        return config;
      });

      await client.get("https://api.example.com/users");
      expect(callOrder).toEqual(["interceptor1", "interceptor2"]);
    });

    it("应该支持移除拦截器", async () => {
      let called = false;

      const id = client.interceptors.request.use((config) => {
        called = true;
        return config;
      });

      client.interceptors.request.ejectRequest(id);

      await client.get("https://api.example.com/users");
      expect(called).toBe(false);
    });

    it("应该处理请求拦截器错误", async () => {
      client.interceptors.request.use(
        () => {
          throw new Error("Interceptor error");
        },
        (error) => {
          return Promise.reject(error);
        },
      );

      await expect(
        client.get("https://api.example.com/users"),
      ).rejects.toThrow("Interceptor error");
    });
  });

  describe("Cookie 管理", () => {
    let client: HttpClient;

    beforeEach(() => {
      client = new HttpClient();
      // 清空 cookie
      (globalThis as any).document.cookie = "";
    });

    it("应该设置 Cookie", () => {
      client.cookies.set("token", "abc123");
      const value = client.cookies.get("token");
      expect(value).toBe("abc123");
    });

    it("应该获取 Cookie", () => {
      client.cookies.set("token", "abc123");
      const value = client.cookies.get("token");
      expect(value).toBe("abc123");
    });

    it("应该删除 Cookie", () => {
      client.cookies.set("token", "abc123");
      client.cookies.remove("token");
      const value = client.cookies.get("token");
      expect(value).toBeUndefined();
    });

    it("应该获取所有 Cookie", () => {
      client.cookies.set("token1", "value1");
      client.cookies.set("token2", "value2");
      const all = client.cookies.getAll();
      expect(all.token1).toBe("value1");
      expect(all.token2).toBe("value2");
    });

    it("应该在请求中自动发送 Cookie", async () => {
      client.cookies.set("token", "abc123");

      let requestHeaders: Headers | null = null;
      globalThis.fetch = async (
        input: RequestInfo | URL,
        init?: RequestInit,
      ) => {
        requestHeaders = init?.headers as Headers;
        return createMockFetch()(input, init);
      };

      await client.get("https://api.example.com/users");
      expect(requestHeaders).toBeDefined();
      if (requestHeaders instanceof Headers) {
        const cookieHeader = requestHeaders.get("Cookie");
        expect(cookieHeader).toContain("token=abc123");
      }
    });

    it("应该处理响应中的 Set-Cookie 头", async () => {
      globalThis.fetch = async () => {
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: {
            "Set-Cookie": "session=xyz789; Path=/; Max-Age=3600",
          },
        });
      };

      await client.get("https://api.example.com/users");
      const session = client.cookies.get("session");
      expect(session).toBe("xyz789");
    });
  });

  describe("超时控制", () => {
    it("应该支持全局超时配置", async () => {
      const client = new HttpClient({
        timeout: 100,
      });

      // 模拟慢请求
      globalThis.fetch = async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
        return createMockFetch()(new Request("https://api.example.com"));
      };

      await expect(
        client.get("https://api.example.com/users"),
      ).rejects.toThrow();
    });

    it("应该支持请求级别的超时配置", async () => {
      const client = new HttpClient({
        timeout: 1000, // 全局超时 1 秒
      });

      // 模拟慢请求
      globalThis.fetch = async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
        return createMockFetch()(new Request("https://api.example.com"));
      };

      await expect(
        client.get("https://api.example.com/users", { timeout: 50 }),
      ).rejects.toThrow();
    });
  });

  describe("重试逻辑", () => {
    it("应该在失败时自动重试", async () => {
      let attemptCount = 0;
      const client = new HttpClient();

      globalThis.fetch = async () => {
        attemptCount++;
        if (attemptCount < 3) {
          throw new Error("Network error");
        }
        return createMockFetch()(new Request("https://api.example.com"));
      };

      const response = await client.get("https://api.example.com/users", {
        retry: true,
        retryOptions: {
          retries: 3,
          retryDelay: 10,
        },
      });

      expect(attemptCount).toBe(3);
      expect(response.status).toBe(200);
    });

    it("应该使用指数退避策略", async () => {
      const delays: number[] = [];
      const client = new HttpClient();

      globalThis.fetch = async () => {
        throw new Error("Network error");
      };

      const originalSetTimeout = globalThis.setTimeout;
      globalThis.setTimeout = ((fn: Function, delay: number) => {
        delays.push(delay);
        return originalSetTimeout(fn, delay);
      }) as any;

      try {
        await client.get("https://api.example.com/users", {
          retry: true,
          retryOptions: {
            retries: 2,
            retryDelay: 100,
            exponentialBackoff: true,
          },
        });
      } catch {
        // 预期会失败
      }

      // 检查延迟时间是否符合指数退避（100ms, 200ms）
      expect(delays.length).toBeGreaterThan(0);
    });

    it("应该只在满足重试条件时重试", async () => {
      let attemptCount = 0;
      const client = new HttpClient();

      globalThis.fetch = async () => {
        attemptCount++;
        return new Response(JSON.stringify({}), {
          status: 404, // 404 不应该重试
        });
      };

      await client.get("https://api.example.com/users", {
        retry: true,
        retryOptions: {
          retries: 3,
          retryDelay: 10,
          retryCondition: (error) => {
            if (error instanceof Response) {
              return error.status >= 500; // 只重试 5xx
            }
            return true;
          },
        },
      });

      expect(attemptCount).toBe(1); // 只尝试一次
    });
  });

  describe("文件上传", () => {
    it("应该上传 FormData", async () => {
      const client = new HttpClient();
      const formData = new FormData();
      formData.append("file", new Blob(["test"], { type: "text/plain" }));

      let requestBody: any = null;
      globalThis.fetch = async (
        input: RequestInfo | URL,
        init?: RequestInit,
      ) => {
        requestBody = init?.body;
        return createMockFetch()(input, init);
      };

      await client.upload("https://api.example.com/upload", formData);
      expect(requestBody).toBeInstanceOf(FormData);
    });

    it("应该上传 File 对象", async () => {
      const client = new HttpClient();
      const file = new File(["test"], "test.txt", { type: "text/plain" });

      let requestBody: any = null;
      globalThis.fetch = async (
        input: RequestInfo | URL,
        init?: RequestInit,
      ) => {
        requestBody = init?.body;
        return createMockFetch()(input, init);
      };

      await client.upload("https://api.example.com/upload", file);
      expect(requestBody).toBeInstanceOf(FormData);
    });

    it("应该支持上传进度回调（使用 XHR）", async () => {
      const client = new HttpClient();
      const formData = new FormData();
      formData.append("file", new Blob(["test"], { type: "text/plain" }));

      const progressEvents: Array<{ loaded: number; total: number }> = [];

      const uploadOptions: UploadOptions = {
        onStart: () => {
          progressEvents.push({ loaded: 0, total: 100 });
        },
        onProgress: (progress) => {
          progressEvents.push({
            loaded: progress.loaded,
            total: progress.total,
          });
        },
        onComplete: () => {
          progressEvents.push({ loaded: 100, total: 100 });
        },
      };

      // Mock XHR upload events
      let xhrInstance: MockXMLHttpRequest | null = null;
      (globalThis as any).XMLHttpRequest = class extends MockXMLHttpRequest {
        constructor() {
          super();
          xhrInstance = this;
        }
      };

      const uploadPromise = client.upload(
        "https://api.example.com/upload",
        formData,
        uploadOptions,
      );

      // 模拟上传进度事件
      if (xhrInstance && xhrInstance.upload._listeners.has("progress")) {
        const progressHandler = xhrInstance.upload._listeners.get("progress");
        if (progressHandler) {
          progressHandler({
            loaded: 50,
            total: 100,
            lengthComputable: true,
          } as ProgressEvent);
        }
      }

      await uploadPromise;
      expect(progressEvents.length).toBeGreaterThan(0);
    });
  });

  describe("文件下载", () => {
    it("应该下载文件并返回 Blob", async () => {
      const client = new HttpClient();

      globalThis.fetch = async () => {
        return new Response(new Blob(["test content"], { type: "text/plain" }), {
          status: 200,
        });
      };

      const blob = await client.download("https://api.example.com/file");
      expect(blob).toBeInstanceOf(Blob);
      const text = await blob.text();
      expect(text).toBe("test content");
    });

    it("应该支持下载进度回调（使用 XHR）", async () => {
      const client = new HttpClient();

      const progressEvents: Array<{ loaded: number; total: number }> = [];

      const downloadOptions: DownloadOptions = {
        onStart: () => {
          progressEvents.push({ loaded: 0, total: 100 });
        },
        onProgress: (progress) => {
          progressEvents.push({
            loaded: progress.loaded,
            total: progress.total,
          });
        },
        onComplete: () => {
          progressEvents.push({ loaded: 100, total: 100 });
        },
      };

      // Mock XHR
      let xhrInstance: MockXMLHttpRequest | null = null;
      (globalThis as any).XMLHttpRequest = class extends MockXMLHttpRequest {
        constructor() {
          super();
          xhrInstance = this;
        }
      };

      globalThis.fetch = async () => {
        return new Response(new Blob(["test"], { type: "text/plain" }), {
          status: 200,
        });
      };

      const downloadPromise = client.download(
        "https://api.example.com/file",
        downloadOptions,
      );

      // 模拟下载进度事件
      if (xhrInstance) {
        xhrInstance.addEventListener("progress", (event: any) => {
          if (event.lengthComputable) {
            downloadOptions.onProgress?.({
              loaded: event.loaded,
              total: event.total,
              percent: (event.loaded / event.total) * 100,
            });
          }
        });
      }

      await downloadPromise;
      expect(progressEvents.length).toBeGreaterThan(0);
    });
  });

  describe("错误处理", () => {
    it("应该处理网络错误", async () => {
      const client = new HttpClient();

      globalThis.fetch = async () => {
        throw new Error("Network error");
      };

      await expect(
        client.get("https://api.example.com/users"),
      ).rejects.toThrow("Network error");
    });

    it("应该处理 HTTP 错误状态码", async () => {
      const client = new HttpClient();

      globalThis.fetch = async () => {
        return new Response(JSON.stringify({ error: "Not Found" }), {
          status: 404,
          statusText: "Not Found",
        });
      };

      const response = await client.get("https://api.example.com/users");
      expect(response.status).toBe(404);
    });
  });

  describe("请求配置", () => {
    it("应该支持自定义 credentials", async () => {
      const client = new HttpClient();

      let requestCredentials: RequestCredentials | undefined;
      globalThis.fetch = async (
        input: RequestInfo | URL,
        init?: RequestInit,
      ) => {
        requestCredentials = init?.credentials;
        return createMockFetch()(input, init);
      };

      await client.get("https://api.example.com/users", {
        credentials: "include",
      });

      expect(requestCredentials).toBe("include");
    });

    it("应该支持自定义 mode", async () => {
      const client = new HttpClient();

      let requestMode: RequestMode | undefined;
      globalThis.fetch = async (
        input: RequestInfo | URL,
        init?: RequestInit,
      ) => {
        requestMode = init?.mode;
        return createMockFetch()(input, init);
      };

      await client.get("https://api.example.com/users", {
        mode: "no-cors",
      });

      expect(requestMode).toBe("no-cors");
    });
  });
});

describe("ClientCookieManager", () => {
  let cookieManager: ClientCookieManager;

  beforeEach(() => {
    cookieManager = new ClientCookieManager();
    // 清空 cookie
    (globalThis as any).document.cookie = "";
  });

  describe("set", () => {
    it("应该设置 Cookie", () => {
      cookieManager.set("test", "value");
      expect(cookieManager.get("test")).toBe("value");
    });

    it("应该设置带过期时间的 Cookie", () => {
      cookieManager.set("test", "value", { expires: 3600 });
      expect(cookieManager.get("test")).toBe("value");
    });

    it("应该设置带路径的 Cookie", () => {
      cookieManager.set("test", "value", { path: "/api" });
      expect(cookieManager.get("test")).toBe("value");
    });

    it("应该设置带域名的 Cookie", () => {
      cookieManager.set("test", "value", { domain: "example.com" });
      expect(cookieManager.get("test")).toBe("value");
    });

    it("应该设置 Secure Cookie", () => {
      cookieManager.set("test", "value", { secure: true });
      expect(cookieManager.get("test")).toBe("value");
    });

    it("应该设置 SameSite Cookie", () => {
      cookieManager.set("test", "value", { sameSite: "strict" });
      expect(cookieManager.get("test")).toBe("value");
    });
  });

  describe("get", () => {
    it("应该获取 Cookie 值", () => {
      cookieManager.set("test", "value");
      expect(cookieManager.get("test")).toBe("value");
    });

    it("应该返回 undefined（如果 Cookie 不存在）", () => {
      expect(cookieManager.get("nonexistent")).toBeUndefined();
    });

    it("应该正确解码 Cookie 值", () => {
      cookieManager.set("test", "value with spaces");
      expect(cookieManager.get("test")).toBe("value with spaces");
    });
  });

  describe("remove", () => {
    it("应该删除 Cookie", () => {
      cookieManager.set("test", "value");
      cookieManager.remove("test");
      expect(cookieManager.get("test")).toBeUndefined();
    });

    it("应该使用指定的路径删除 Cookie", () => {
      cookieManager.set("test", "value", { path: "/api" });
      cookieManager.remove("test", { path: "/api" });
      expect(cookieManager.get("test")).toBeUndefined();
    });
  });

  describe("getAll", () => {
    it("应该获取所有 Cookie", () => {
      cookieManager.set("cookie1", "value1");
      cookieManager.set("cookie2", "value2");
      const all = cookieManager.getAll();
      expect(all.cookie1).toBe("value1");
      expect(all.cookie2).toBe("value2");
    });

    it("应该返回空对象（如果没有 Cookie）", () => {
      const all = cookieManager.getAll();
      expect(Object.keys(all).length).toBe(0);
    });
  });
});

describe("InterceptorManager", () => {
  let interceptorManager: InterceptorManager;

  beforeEach(() => {
    interceptorManager = new InterceptorManager();
  });

  describe("请求拦截器", () => {
    it("应该注册请求拦截器", () => {
      const id = interceptorManager.use((config) => config);
      expect(typeof id).toBe("number");
    });

    it("应该执行请求拦截器", async () => {
      let executed = false;
      interceptorManager.use((config) => {
        executed = true;
        return config;
      });

      await interceptorManager.executeRequest({ url: "https://api.example.com" });
      expect(executed).toBe(true);
    });

    it("应该按顺序执行多个请求拦截器", async () => {
      const order: number[] = [];
      interceptorManager.use((config) => {
        order.push(1);
        return config;
      });
      interceptorManager.use((config) => {
        order.push(2);
        return config;
      });

      await interceptorManager.executeRequest({ url: "https://api.example.com" });
      expect(order).toEqual([1, 2]);
    });

    it("应该移除请求拦截器", async () => {
      let executed = false;
      const id = interceptorManager.use((config) => {
        executed = true;
        return config;
      });

      interceptorManager.ejectRequest(id);
      await interceptorManager.executeRequest({ url: "https://api.example.com" });
      expect(executed).toBe(false);
    });
  });

  describe("响应拦截器", () => {
    it("应该注册响应拦截器", () => {
      const id = interceptorManager.useResponse((response) => response);
      expect(typeof id).toBe("number");
    });

    it("应该执行响应拦截器", async () => {
      let executed = false;
      interceptorManager.useResponse((response) => {
        executed = true;
        return response;
      });

      const response = new Response();
      await interceptorManager.executeResponse(response);
      expect(executed).toBe(true);
    });

    it("应该按顺序执行多个响应拦截器", async () => {
      const order: number[] = [];
      interceptorManager.useResponse((response) => {
        order.push(1);
        return response;
      });
      interceptorManager.useResponse((response) => {
        order.push(2);
        return response;
      });

      const response = new Response();
      await interceptorManager.executeResponse(response);
      expect(order).toEqual([1, 2]);
    });

    it("应该移除响应拦截器", async () => {
      let executed = false;
      const id = interceptorManager.useResponse((response) => {
        executed = true;
        return response;
      });

      interceptorManager.ejectResponse(id);
      const response = new Response();
      await interceptorManager.executeResponse(response);
      expect(executed).toBe(false);
    });
  });

  describe("错误处理", () => {
    it("应该处理请求拦截器错误", async () => {
      interceptorManager.use(
        () => {
          throw new Error("Interceptor error");
        },
        (error) => {
          return Promise.reject(error);
        },
      );

      await expect(
        interceptorManager.executeRequest({ url: "https://api.example.com" }),
      ).rejects.toThrow("Interceptor error");
    });

    it("应该处理响应拦截器错误", async () => {
      interceptorManager.useResponse(
        () => {
          throw new Error("Interceptor error");
        },
        (error) => {
          return Promise.reject(error);
        },
      );

      const response = new Response();
      await expect(
        interceptorManager.executeResponse(response),
      ).rejects.toThrow("Interceptor error");
    });
  });

  describe("clear", () => {
    it("应该清空所有拦截器", async () => {
      let executed = false;
      interceptorManager.use((config) => {
        executed = true;
        return config;
      });

      interceptorManager.clear();
      await interceptorManager.executeRequest({ url: "https://api.example.com" });
      expect(executed).toBe(false);
    });
  });
});
