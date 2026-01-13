# Client HTTP 客户端

> 客户端 HTTP 客户端库，结合 Fetch 和 XMLHttpRequest 的优势，提供完整的 HTTP 请求功能

[![JSR](https://jsr.io/badges/@dreamer/utils)](https://jsr.io/@dreamer/utils)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🎯 功能

HTTP 客户端库，用于浏览器环境中的 HTTP 请求。智能结合 Fetch API 和 XMLHttpRequest 的优势，提供最佳性能和功能体验，仅支持客户端。

---

## ✨ 特性

- **智能请求方式选择**：
  - 普通请求：自动使用 Fetch API（更现代，性能更好）
  - 需要上传/下载进度：自动使用 XMLHttpRequest（支持进度追踪）
- **请求/响应拦截器**：
  - 请求拦截器（修改请求配置、添加认证信息等）
  - 响应拦截器（处理响应数据、错误处理等）
  - 支持多个拦截器
  - 支持移除拦截器
- **自动重试和超时控制**：
  - 自动重试失败请求
  - 请求超时控制
  - 可配置重试次数、延迟和条件
  - 支持指数退避策略
- **文件上传/下载**：
  - 文件上传支持（FormData、File）
  - 文件下载支持（Blob）
  - 上传/下载进度追踪
  - 支持上传/下载事件回调
- **Cookie 管理**：
  - 自动处理 Cookie（发送和接收）
  - Cookie 设置和获取（`ClientCookieManager`）
  - Cookie 过期处理
  - 支持 Cookie 选项（domain、path、secure、sameSite）
- **完整的 HTTP 方法支持**：
  - GET、POST、PUT、DELETE、PATCH、HEAD、OPTIONS

---

## 📦 安装

```bash
deno add jsr:@dreamer/utils
```

---

## 🌍 环境兼容性

- **运行时要求**：Deno 2.5+ 或支持浏览器环境的运行时
- **服务端**：❌ 不支持（使用服务端 HTTP 库）
- **客户端**：✅ 支持（浏览器环境）
- **依赖**：无外部依赖（纯 TypeScript 实现）

---

## 🚀 快速开始

```typescript
import { HttpClient } from "jsr:@dreamer/utils/client/http";

// 创建 HTTP 客户端
const client = new HttpClient({
  baseURL: "https://api.example.com",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 配置拦截器
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error instanceof Response && error.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// 发送请求
const response = await client.get("/users");
const users = await response.json();

// POST 请求
const newUser = await client.post("/users", {
  name: "Alice",
  email: "alice@example.com",
});

// 文件上传（支持进度）
const formData = new FormData();
formData.append("file", fileInput.files[0]);

await client.upload("/upload", formData, {
  onStart: () => console.log("开始上传"),
  onProgress: (progress) => {
    console.log(`上传进度: ${progress.percent}%`);
  },
  onComplete: () => console.log("上传完成"),
});

// 文件下载（支持进度）
const blob = await client.download("/files/document.pdf", {
  onStart: () => console.log("开始下载"),
  onProgress: (progress) => {
    console.log(`下载进度: ${progress.percent}%`);
  },
  onComplete: () => console.log("下载完成"),
});

// 自动重试
const response = await client.get("/api/data", {
  retry: true,
  retryOptions: {
    retries: 3,
    retryDelay: 1000,
    exponentialBackoff: true,
  },
});
```

---

## 📚 API 文档

### HttpClient

HTTP 客户端类，提供完整的 HTTP 请求功能。

#### 构造函数

```typescript
new HttpClient(options?: HttpClientOptions)
```

**HttpClientOptions**：
- `baseURL?: string` - 基础 URL
- `timeout?: number` - 超时时间（毫秒，默认 0 表示不设置超时）
- `headers?: HeadersInit` - 默认请求头
- `credentials?: RequestCredentials` - 凭证模式（默认 "same-origin"）
- `mode?: RequestMode` - 请求模式（默认 "cors"）
- `cache?: RequestCache` - 缓存模式（默认 "default"）
- `redirect?: RequestRedirect` - 重定向模式（默认 "follow"）

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

##### get

发送 GET 请求。

```typescript
async get(url: string, config?: RequestConfig): Promise<Response>
```

**示例**：
```typescript
const response = await client.get("/users");
const users = await response.json();
```

##### post

发送 POST 请求。

```typescript
async post(
  url: string,
  data?: BodyInit | null,
  config?: RequestConfig,
): Promise<Response>
```

**示例**：
```typescript
const response = await client.post("/users", {
  name: "Alice",
  email: "alice@example.com",
});
```

##### put

发送 PUT 请求。

```typescript
async put(
  url: string,
  data?: BodyInit | null,
  config?: RequestConfig,
): Promise<Response>
```

##### delete

发送 DELETE 请求。

```typescript
async delete(url: string, config?: RequestConfig): Promise<Response>
```

##### patch

发送 PATCH 请求。

```typescript
async patch(
  url: string,
  data?: BodyInit | null,
  config?: RequestConfig,
): Promise<Response>
```

##### head

发送 HEAD 请求。

```typescript
async head(url: string, config?: RequestConfig): Promise<Response>
```

##### options

发送 OPTIONS 请求。

```typescript
async options(url: string, config?: RequestConfig): Promise<Response>
```

---

#### upload

上传文件（支持进度）。

```typescript
async upload(
  url: string,
  data: FormData | File,
  uploadOptions?: UploadOptions,
): Promise<Response>
```

**参数**：
- `url: string` - 请求 URL
- `data: FormData | File` - 文件数据
- `uploadOptions: UploadOptions` - 上传选项

**UploadOptions**：
- `onStart?: () => void` - 上传开始回调
- `onProgress?: (progress: UploadProgress) => void` - 上传进度回调
- `onComplete?: () => void` - 上传完成回调
- `onError?: (error: Error) => void` - 上传错误回调
- `onAbort?: () => void` - 上传取消回调

**UploadProgress**：
- `loaded: number` - 已上传字节数
- `total: number` - 总字节数
- `percent: number` - 上传百分比

**示例**：
```typescript
const formData = new FormData();
formData.append("file", fileInput.files[0]);

await client.upload("/upload", formData, {
  onStart: () => console.log("开始上传"),
  onProgress: (progress) => {
    console.log(`上传进度: ${progress.percent}%`);
  },
  onComplete: () => console.log("上传完成"),
});
```

---

#### download

下载文件（支持进度）。

```typescript
async download(
  url: string,
  options?: DownloadOptions,
): Promise<Blob>
```

**参数**：
- `url: string` - 请求 URL
- `options: DownloadOptions` - 下载选项

**DownloadOptions**：
- `onStart?: () => void` - 下载开始回调
- `onProgress?: (progress: DownloadProgress) => void` - 下载进度回调
- `onComplete?: () => void` - 下载完成回调
- `onError?: (error: Error) => void` - 下载错误回调
- `onAbort?: () => void` - 下载取消回调

**DownloadProgress**：
- `loaded: number` - 已下载字节数
- `total: number` - 总字节数
- `percent: number` - 下载百分比

**返回**：Blob 对象

**示例**：
```typescript
const blob = await client.download("/files/document.pdf", {
  onStart: () => console.log("开始下载"),
  onProgress: (progress) => {
    console.log(`下载进度: ${progress.percent}%`);
  },
  onComplete: () => console.log("下载完成"),
});

// 创建下载链接
const url = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = "document.pdf";
a.click();
URL.revokeObjectURL(url);
```

---

#### interceptors

拦截器管理器。

**请求拦截器**：
```typescript
client.interceptors.request.use(
  fulfilled: RequestInterceptor,
  rejected?: RequestErrorInterceptor,
): number
```

**响应拦截器**：
```typescript
client.interceptors.response.use(
  fulfilled: ResponseInterceptor,
  rejected?: ResponseErrorInterceptor,
): number
```

**示例**：
```typescript
// 请求拦截器
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

// 响应拦截器
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error instanceof Response && error.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

---

#### cookies

Cookie 管理器。

**set**

设置 Cookie。

```typescript
set(name: string, value: string, options?: ClientCookieOptions): void
```

**get**

获取 Cookie。

```typescript
get(name: string): string | undefined
```

**remove**

删除 Cookie。

```typescript
remove(name: string, options?: Pick<ClientCookieOptions, "domain" | "path">): void
```

**getAll**

获取所有 Cookie。

```typescript
getAll(): Record<string, string>
```

**示例**：
```typescript
client.cookies.set("token", "abc123", {
  expires: 7 * 24 * 60 * 60, // 7 天
  path: "/",
  secure: true,
  sameSite: "strict",
});

const token = client.cookies.get("token");
client.cookies.remove("token", { path: "/" });
```

---

### InterceptorManager

拦截器管理器类，管理请求和响应拦截器。

#### use

注册请求拦截器。

```typescript
use(
  fulfilled: RequestInterceptor,
  rejected?: RequestErrorInterceptor,
): number
```

#### useResponse

注册响应拦截器。

```typescript
useResponse(
  fulfilled: ResponseInterceptor,
  rejected?: ResponseErrorInterceptor,
): number
```

#### ejectRequest

移除请求拦截器。

```typescript
ejectRequest(id: number): void
```

#### ejectResponse

移除响应拦截器。

```typescript
ejectResponse(id: number): void
```

---

### ClientCookieManager

Cookie 管理器类，提供浏览器环境下的 Cookie 管理功能。

#### set

设置 Cookie。

```typescript
set(name: string, value: string, options?: ClientCookieOptions): void
```

**ClientCookieOptions**：
- `expires?: number` - 过期时间（秒）
- `expiresDate?: Date` - 过期日期
- `domain?: string` - 域名
- `path?: string` - 路径
- `secure?: boolean` - 是否只在 HTTPS 下发送
- `sameSite?: "strict" | "lax" | "none"` - SameSite 策略

#### get

获取 Cookie。

```typescript
get(name: string): string | undefined
```

#### remove

删除 Cookie。

```typescript
remove(
  name: string,
  options?: Pick<ClientCookieOptions, "domain" | "path">,
): void
```

#### getAll

获取所有 Cookie。

```typescript
getAll(): Record<string, string>
```

---

## 🎯 使用场景

- **API 请求**：发送 HTTP 请求到后端 API
- **文件上传**：上传文件，支持进度追踪
- **文件下载**：下载文件，支持进度追踪
- **认证管理**：通过拦截器自动添加认证信息
- **错误处理**：通过响应拦截器统一处理错误
- **Cookie 管理**：管理浏览器 Cookie

---

## ⚡ 性能优化

- **智能选择**：根据需求自动选择 Fetch 或 XHR，获得最佳性能
- **批量操作**：支持批量请求
- **请求缓存**：支持请求缓存配置

---

## 📝 备注

- **仅客户端**：此模块仅支持客户端，服务端请使用服务端 HTTP 库
- **智能选择**：HttpClient 会根据请求需求自动选择 Fetch 或 XHR
- **统一接口**：所有请求方法返回标准的 `Response` 对象，兼容 Fetch API
- **类型安全**：完整的 TypeScript 类型支持
- **无外部依赖**：纯 TypeScript 实现，不依赖任何外部库

---

## 🔗 相关链接

- [JSR 包页面](https://jsr.io/@dreamer/utils)

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可证

MIT License - 详见 [LICENSE.md](../../../LICENSE.md)

---

<div align="center">

**Made with ❤️ by Dreamer Team**

</div>
