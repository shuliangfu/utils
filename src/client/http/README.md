# @dreamer/http/client

> 一个用于浏览器的 HTTP 客户端库，结合 Fetch 和 XMLHttpRequest 的优势，提供完整的 HTTP 请求功能

[![JSR](https://jsr.io/badges/@dreamer/http/client)](https://jsr.io/@dreamer/http/client)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](../../../LICENSE.md)

---

## 🎯 功能

HTTP 客户端库，用于浏览器环境中的 HTTP 请求。智能结合 Fetch API 和 XMLHttpRequest 的优势，提供最佳性能和功能体验。

## ✨ 特性

- **智能请求方式选择**：
  - 普通请求：自动使用 Fetch API（更现代，性能更好）
  - 需要上传/下载进度：自动使用 XMLHttpRequest（支持进度追踪）
- **请求/响应拦截器**：
  - 请求拦截器（修改请求配置、添加认证信息等）
  - 响应拦截器（处理响应数据、错误处理等）
- **自动重试和超时控制**：
  - 自动重试失败请求
  - 请求超时控制
  - 可配置重试次数、延迟和条件
  - 支持指数退避策略
- **文件上传/下载**：
  - 文件上传支持（FormData、File）
  - 文件下载支持（Blob）
  - 上传/下载进度追踪
- **Cookie 管理**：
  - 自动处理 Cookie（发送和接收）
  - Cookie 设置和获取
  - Cookie 过期处理
- **完整的 HTTP 方法支持**：
  - GET、POST、PUT、DELETE、PATCH、HEAD、OPTIONS

## 📦 安装

```bash
deno add jsr:@dreamer/http/client
```

## 🌍 环境兼容性

- **运行时要求**：Deno 2.6+ 或支持浏览器环境的运行时
- **环境**：✅ 支持（浏览器环境）
- **服务端**：❌ 不支持（使用服务端 HTTP 库）
- **依赖**：无外部依赖（纯 TypeScript 实现）

---

## 🚀 快速开始

### 基础 HTTP 客户端

```typescript
import { HttpClient } from "@dreamer/http/client";

// 创建 HTTP 客户端
const client = new HttpClient({
  baseURL: "https://api.example.com",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 发送 GET 请求
const response = await client.get("/users");
const users = await response.json();
```

### 配置拦截器

```typescript
// 请求拦截器
client.interceptors.request.use((config) => {
  // 添加认证 token
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

// 响应拦截器
client.interceptors.response.use(
  (response) => {
    // 处理成功响应
    return response;
  },
  (error) => {
    // 处理错误
    if (error instanceof Response && error.status === 401) {
      // 处理未授权，跳转到登录页
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

---

## 📚 API 文档

### HttpClient 类

#### 构造函数

```typescript
new HttpClient(options?: HttpClientOptions)
```

**参数**：
- `options.baseURL`：基础 URL（可选）
- `options.timeout`：超时时间（毫秒，默认：0 表示不设置超时）
- `options.headers`：默认请求头（可选）
- `options.credentials`：凭证模式（默认：`"same-origin"`）
- `options.mode`：请求模式（默认：`"cors"`）
- `options.cache`：缓存模式（默认：`"default"`）
- `options.redirect`：重定向模式（默认：`"follow"`）

**示例**：
```typescript
const client = new HttpClient({
  baseURL: "https://api.example.com",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});
```

#### HTTP 方法

##### GET 请求

```typescript
client.get(url: string, config?: RequestConfig): Promise<Response>
```

**示例**：
```typescript
const response = await client.get("/users");
const users = await response.json();
```

##### POST 请求

```typescript
client.post(url: string, data?: BodyInit | null, config?: RequestConfig): Promise<Response>
```

**示例**：
```typescript
const response = await client.post("/users", {
  name: "John",
  email: "john@example.com",
});
```

##### PUT 请求

```typescript
client.put(url: string, data?: BodyInit | null, config?: RequestConfig): Promise<Response>
```

**示例**：
```typescript
const response = await client.put("/users/1", {
  name: "John Updated",
});
```

##### DELETE 请求

```typescript
client.delete(url: string, config?: RequestConfig): Promise<Response>
```

**示例**：
```typescript
const response = await client.delete("/users/1");
```

##### PATCH 请求

```typescript
client.patch(url: string, data?: BodyInit | null, config?: RequestConfig): Promise<Response>
```

**示例**：
```typescript
const response = await client.patch("/users/1", {
  name: "John Patched",
});
```

##### HEAD 请求

```typescript
client.head(url: string, config?: RequestConfig): Promise<Response>
```

**示例**：
```typescript
const response = await client.head("/users/1");
console.log(response.headers.get("Content-Length"));
```

##### OPTIONS 请求

```typescript
client.options(url: string, config?: RequestConfig): Promise<Response>
```

**示例**：
```typescript
const response = await client.options("/users");
```

#### 文件上传

```typescript
client.upload(url: string, data: FormData | File, options?: UploadOptions): Promise<Response>
```

**特性**：
- 自动使用 XMLHttpRequest（支持上传进度）
- 支持 FormData 和 File 对象
- 自动追踪上传进度

**示例**：
```typescript
// 上传单个文件
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];

const formData = new FormData();
formData.append("file", file);

const response = await client.upload("/upload", formData, {
  onStart: () => {
    console.log("开始上传");
  },
  onProgress: (progress) => {
    console.log(`上传进度: ${progress.percent.toFixed(2)}%`);
    console.log(`已上传: ${progress.loaded} / ${progress.total} 字节`);
  },
  onComplete: () => {
    console.log("上传完成");
  },
  onError: (error) => {
    console.error("上传错误:", error);
  },
});

// 或者直接上传 File 对象
const response2 = await client.upload("/upload", file, {
  onProgress: (progress) => {
    updateProgressBar(progress.percent);
  },
});
```

#### 文件下载

```typescript
client.download(url: string, options?: DownloadOptions): Promise<Blob>
```

**特性**：
- 自动使用 XMLHttpRequest（支持下载进度）
- 返回 Blob 对象
- 自动追踪下载进度

**示例**：
```typescript
// 下载文件
const blob = await client.download("/files/document.pdf", {
  onStart: () => {
    console.log("开始下载");
  },
  onProgress: (progress) => {
    console.log(`下载进度: ${progress.percent.toFixed(2)}%`);
    console.log(`已下载: ${progress.loaded} / ${progress.total} 字节`);
  },
  onComplete: () => {
    console.log("下载完成");
  },
  onError: (error) => {
    console.error("下载错误:", error);
  },
});

// 创建下载链接
const url = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = "document.pdf";
a.click();
URL.revokeObjectURL(url);
```

### 拦截器

#### 请求拦截器

```typescript
client.interceptors.request.use(
  fulfilled: RequestInterceptor,
  rejected?: RequestErrorInterceptor
): number
```

**示例**：
```typescript
// 添加认证 token
const requestId = client.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

// 移除拦截器
client.interceptors.request.ejectRequest(requestId);
```

#### 响应拦截器

```typescript
client.interceptors.response.use(
  fulfilled: ResponseInterceptor,
  rejected?: ResponseErrorInterceptor
): number
```

**示例**：
```typescript
// 统一错误处理
client.interceptors.response.use(
  (response) => {
    // 处理成功响应
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    throw new Error(`Request failed with status ${response.status}`);
  },
  (error) => {
    // 处理错误
    console.error("请求错误:", error);
    return Promise.reject(error);
  }
);
```

### Cookie 管理

```typescript
// 设置 Cookie
client.cookies.set("token", "abc123", {
  expires: 7 * 24 * 60 * 60, // 7 天（秒）
  path: "/",
  secure: true,
  sameSite: "strict",
});

// 获取 Cookie
const token = client.cookies.get("token");

// 获取所有 Cookie
const allCookies = client.cookies.getAll();

// 删除 Cookie
client.cookies.remove("token", { path: "/" });
```

### 自动重试

```typescript
// 配置重试
const response = await client.get("/api/data", {
  retry: true,
  retryOptions: {
    retries: 3, // 重试 3 次
    retryDelay: 1000, // 延迟 1 秒
    exponentialBackoff: true, // 使用指数退避
    retryCondition: (error) => {
      // 只在网络错误或 5xx 状态码时重试
      if (error instanceof Error) {
        return true; // 网络错误
      }
      if (error instanceof Response) {
        return error.status >= 500 && error.status < 600;
      }
      return false;
    },
  },
});
```

### 超时控制

```typescript
// 全局超时配置
const client = new HttpClient({
  timeout: 5000, // 5 秒超时
});

// 单次请求超时配置
const response = await client.get("/api/data", {
  timeout: 10000, // 10 秒超时（覆盖全局配置）
});
```

---

## 🎨 设计特点

### 智能请求方式选择

HttpClient 会根据请求需求自动选择最佳的请求方式：

1. **使用 Fetch API**（默认）：
   - 普通请求（GET、POST 等）
   - 不需要进度追踪或事件回调
   - 更现代、性能更好

2. **使用 XMLHttpRequest**（自动切换）：
   - 需要上传进度或事件（`onProgress`、`onStart`、`onComplete` 等）
   - 需要下载进度或事件（`onProgress`、`onStart`、`onComplete` 等）
   - 更准确的进度追踪和完整的事件支持

**优势**：
- 普通请求享受 Fetch API 的现代特性和性能
- 需要进度时自动使用 XHR，无需手动切换
- 统一的 API 接口，返回标准的 Response 对象

### 结合 Fetch 和 XHR 的优势

| 特性 | Fetch API | XMLHttpRequest | HttpClient |
|------|-----------|----------------|------------|
| Promise 支持 | ✅ | ❌ | ✅ |
| 上传进度 | ❌ | ✅ | ✅ |
| 下载进度 | ⚠️（流式） | ✅ | ✅ |
| 超时控制 | ⚠️（AbortController） | ✅ | ✅ |
| 现代 API | ✅ | ❌ | ✅ |
| 错误处理 | ✅ | ⚠️ | ✅ |

---

## 📖 使用示例

### 完整的 API 客户端示例

```typescript
import { HttpClient } from "@dreamer/http/client";

class ApiClient {
  private client: HttpClient;

  constructor() {
    this.client = new HttpClient({
      baseURL: "https://api.example.com",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // 请求拦截器：添加认证 token
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
      }
      return config;
    });

    // 响应拦截器：统一错误处理
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error instanceof Response) {
          if (error.status === 401) {
            // Token 过期，清除并跳转登录
            localStorage.removeItem("token");
            window.location.href = "/login";
          } else if (error.status >= 500) {
            // 服务器错误，显示错误提示
            console.error("服务器错误:", await error.text());
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // 获取用户列表
  async getUsers() {
    const response = await this.client.get("/users");
    return await response.json();
  }

  // 创建用户
  async createUser(userData: { name: string; email: string }) {
    const response = await this.client.post("/users", userData);
    return await response.json();
  }

  // 上传头像
  async uploadAvatar(userId: string, file: File) {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await this.client.upload(
      `/users/${userId}/avatar`,
      formData,
      {
        onStart: () => console.log("开始上传头像"),
        onProgress: (progress) => {
          console.log(`上传进度: ${progress.percent}%`);
        },
        onComplete: () => console.log("头像上传完成"),
      }
    );
    return await response.json();
  }
}

// 使用
const api = new ApiClient();
const users = await api.getUsers();
```

### 文件上传示例

```typescript
// HTML
// <input type="file" id="fileInput" />
// <button id="uploadBtn">上传</button>
// <progress id="progressBar" value="0" max="100"></progress>

const fileInput = document.getElementById("fileInput") as HTMLInputElement;
const uploadBtn = document.getElementById("uploadBtn") as HTMLButtonElement;
const progressBar = document.getElementById("progressBar") as HTMLProgressElement;

uploadBtn.addEventListener("click", async () => {
  const file = fileInput.files?.[0];
  if (!file) {
    alert("请选择文件");
    return;
  }

  try {
    const response = await client.upload("/upload", file, {
      onStart: () => {
        console.log("开始上传");
        uploadBtn.disabled = true;
      },
      onProgress: (progress) => {
        progressBar.value = progress.percent;
        console.log(`上传进度: ${progress.percent.toFixed(2)}%`);
      },
      onComplete: () => {
        console.log("上传完成");
        uploadBtn.disabled = false;
      },
      onError: (error) => {
        console.error("上传失败:", error);
        uploadBtn.disabled = false;
      },
    });

    const result = await response.json();
    console.log("上传成功:", result);
  } catch (error) {
    console.error("上传失败:", error);
  }
});
```

### 文件下载示例

```typescript
async function downloadFile(url: string, filename: string) {
  try {
    const blob = await client.download(url, {
      onStart: () => {
        console.log("开始下载");
      },
      onProgress: (progress) => {
        console.log(`下载进度: ${progress.percent.toFixed(2)}%`);
        // 更新 UI
        updateDownloadProgress(progress.percent);
      },
      onComplete: () => {
        console.log("下载完成");
      },
      onError: (error) => {
        console.error("下载失败:", error);
      },
    });

    // 创建下载链接
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("下载失败:", error);
  }
}
```

### 带重试的请求示例

```typescript
// 自动重试失败的请求
const response = await client.get("/api/data", {
  retry: true,
  retryOptions: {
    retries: 3,
    retryDelay: 1000,
    exponentialBackoff: true, // 指数退避：1s, 2s, 4s
    retryCondition: (error) => {
      // 只在网络错误或 5xx 状态码时重试
      if (error instanceof Error) {
        return true;
      }
      if (error instanceof Response) {
        return error.status >= 500;
      }
      return false;
    },
  },
});
```

---

## 🔧 类型定义

### HttpClientOptions

```typescript
interface HttpClientOptions {
  baseURL?: string;
  timeout?: number;
  headers?: HeadersInit;
  credentials?: RequestCredentials;
  mode?: RequestMode;
  cache?: RequestCache;
  redirect?: RequestRedirect;
}
```

### RequestConfig

```typescript
interface RequestConfig extends RequestInit {
  url?: string;
  method?: string;
  headers?: HeadersInit;
  body?: BodyInit | null;
  timeout?: number;
  retry?: boolean;
  retryOptions?: RetryOptions;
}
```

### RetryOptions

```typescript
interface RetryOptions {
  retries?: number;
  retryDelay?: number;
  retryCondition?: (error: Error | Response) => boolean;
  exponentialBackoff?: boolean;
}
```

### UploadOptions

```typescript
interface UploadOptions extends RequestConfig {
  onStart?: () => void;
  onProgress?: (progress: UploadProgress) => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
  onAbort?: () => void;
}

interface UploadProgress {
  loaded: number;
  total: number;
  percent: number;
}
```

### DownloadOptions

```typescript
interface DownloadOptions extends RequestConfig {
  onStart?: () => void;
  onProgress?: (progress: DownloadProgress) => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
  onAbort?: () => void;
  saveAs?: boolean;
  filename?: string;
}

interface DownloadProgress {
  loaded: number;
  total: number;
  percent: number;
}
```

### ClientCookieOptions

```typescript
interface ClientCookieOptions {
  expires?: number; // 秒
  expiresDate?: Date;
  domain?: string;
  path?: string;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
}
```

---

## 📝 备注

- **智能选择**：HttpClient 会根据请求需求自动选择 Fetch 或 XHR，无需手动指定
- **统一接口**：所有请求方法返回标准的 `Response` 对象，兼容 Fetch API
- **类型安全**：完整的 TypeScript 类型支持
- **无外部依赖**：纯 TypeScript 实现，不依赖任何外部库
- **浏览器专用**：仅支持浏览器环境，服务端请使用服务端 HTTP 库

---

## 🔗 相关链接

- [服务端 HTTP 文档](../../README.md)
- [JSR 包页面](https://jsr.io/@dreamer/http/client)

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可证

MIT License - 详见 [LICENSE.md](../../LICENSE.md)

---

<div align="center">

**Made with ❤️ by Dreamer Team**

</div>
