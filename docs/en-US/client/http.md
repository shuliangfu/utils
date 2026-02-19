# Client HTTP

> HTTP client for the browser, combining Fetch and XMLHttpRequest for full
> request support and progress tracking.

[![JSR](https://jsr.io/badges/@dreamer/utils)](https://jsr.io/@dreamer/utils)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)

---

## Overview

HTTP client for browser: uses Fetch by default and XMLHttpRequest when
upload/download progress is needed. Client-only.

---

## Features

- **Request strategy**: Normal requests use Fetch; upload/download with progress
  use XHR.
- **Interceptors**: Request (e.g. add auth) and response (e.g. error handling);
  multiple interceptors; eject support.
- **Retry & timeout**: Configurable retries, delay, condition, exponential
  backoff.
- **Upload/Download**: FormData/File upload, Blob download, progress callbacks.
- **Cookies**: Send/receive cookies; `ClientCookieManager` for get/set/remove;
  domain, path, secure, sameSite.
- **Methods**: GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS.

---

## Installation

```bash
deno add jsr:@dreamer/utils
```

---

## Environment

- **Runtime**: Deno 2.6+ or browser-capable runtime
- **Server**: ❌ Not supported (use server HTTP library)
- **Client**: ✅ Supported (browser)
- **Dependencies**: None (pure TypeScript)

---

## Quick start

```typescript
import { HttpClient } from "jsr:@dreamer/utils/client/http";

const client = new HttpClient({
  baseURL: "https://api.example.com",
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.set("Authorization", `Bearer ${token}`);
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error instanceof Response && error.status === 401) {
      globalThis.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

const response = await client.get("/users");
const users = await response.json();

await client.post("/users", { name: "Alice", email: "alice@example.com" });

const formData = new FormData();
formData.append("file", fileInput.files[0]);
await client.upload("/upload", formData, {
  onStart: () => console.log("Upload started"),
  onProgress: (progress) => console.log(`Progress: ${progress.percent}%`),
  onComplete: () => console.log("Upload complete"),
});

const blob = await client.download("/files/document.pdf", {
  onStart: () => console.log("Download started"),
  onProgress: (progress) => console.log(`Progress: ${progress.percent}%`),
  onComplete: () => console.log("Download complete"),
});

await client.get("/api/data", {
  retry: true,
  retryOptions: { retries: 3, retryDelay: 1000, exponentialBackoff: true },
});
```

---

## API Reference

### HttpClient

HTTP client class.

#### Constructor

```typescript
new HttpClient(options?: HttpClientOptions)
```

**HttpClientOptions**:

- `baseURL?: string` - Base URL
- `timeout?: number` - Timeout in ms (0 = no timeout)
- `headers?: HeadersInit` - Default headers
- `credentials?: RequestCredentials` - Default "same-origin"
- `mode?: RequestMode` - Default "cors"
- `cache?: RequestCache` - Default "default"
- `redirect?: RequestRedirect` - Default "follow"

**Example**:

```typescript
const client = new HttpClient({
  baseURL: "https://api.example.com",
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});
```

#### HTTP methods

- **get**: `async get(url: string, config?: RequestConfig): Promise<Response>`
- **post**:
  `async post(url: string, data?: BodyInit | null, config?: RequestConfig): Promise<Response>`
- **put**:
  `async put(url: string, data?: BodyInit | null, config?: RequestConfig): Promise<Response>`
- **delete**:
  `async delete(url: string, config?: RequestConfig): Promise<Response>`
- **patch**:
  `async patch(url: string, data?: BodyInit | null, config?: RequestConfig): Promise<Response>`
- **head**: `async head(url: string, config?: RequestConfig): Promise<Response>`
- **options**:
  `async options(url: string, config?: RequestConfig): Promise<Response>`

**Example**:

```typescript
const response = await client.get("/users");
const users = await response.json();

await client.post("/users", { name: "Alice", email: "alice@example.com" });
```

---

#### upload

Upload file with progress.

```typescript
async upload(
  url: string,
  data: FormData | File,
  uploadOptions?: UploadOptions,
): Promise<Response>
```

**Parameters**: `url`, `data` (FormData or File), `uploadOptions`

**UploadOptions**: `onStart?`, `onProgress?(progress: UploadProgress)`,
`onComplete?`, `onError?`, `onAbort?`

**UploadProgress**: `loaded`, `total`, `percent`

**Example**:

```typescript
await client.upload("/upload", formData, {
  onStart: () => console.log("Upload started"),
  onProgress: (progress) => console.log(`${progress.percent}%`),
  onComplete: () => console.log("Upload complete"),
});
```

---

#### download

Download file with progress.

```typescript
async download(url: string, options?: DownloadOptions): Promise<Blob>
```

**Parameters**: `url`, `options`

**DownloadOptions**: `onStart?`, `onProgress?(progress: DownloadProgress)`,
`onComplete?`, `onError?`, `onAbort?`

**DownloadProgress**: `loaded`, `total`, `percent`

**Returns**: Blob

**Example**:

```typescript
const blob = await client.download("/files/document.pdf", {
  onStart: () => console.log("Download started"),
  onProgress: (progress) => console.log(`${progress.percent}%`),
  onComplete: () => console.log("Download complete"),
});

const url = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = "document.pdf";
a.click();
URL.revokeObjectURL(url);
```

---

#### interceptors

Interceptor manager.

**Request**:

```typescript
client.interceptors.request.use(
  fulfilled: RequestInterceptor,
  rejected?: RequestErrorInterceptor,
): number
```

**Response**:

```typescript
client.interceptors.response.use(
  fulfilled: ResponseInterceptor,
  rejected?: ResponseErrorInterceptor,
): number
```

**Example**:

```typescript
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.set("Authorization", `Bearer ${token}`);
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error instanceof Response && error.status === 401) {
      globalThis.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
```

---

#### cookies

Cookie manager.

- **set**:
  `set(name: string, value: string, options?: ClientCookieOptions): void`
- **get**: `get(name: string): string | undefined`
- **remove**:
  `remove(name: string, options?: Pick<ClientCookieOptions, "domain" | "path">): void`
- **getAll**: `getAll(): Record<string, string>`

**Example**:

```typescript
client.cookies.set("token", "abc123", {
  expires: 7 * 24 * 60 * 60, // 7 days
  path: "/",
  secure: true,
  sameSite: "strict",
});

const token = client.cookies.get("token");
client.cookies.remove("token", { path: "/" });
```

---

### InterceptorManager

Manages request and response interceptors.

- **use**: Register request interceptor; returns id.
- **useResponse**: Register response interceptor; returns id.
- **ejectRequest(id)**: Remove request interceptor.
- **ejectResponse(id)**: Remove response interceptor.

---

### ClientCookieManager

Cookie manager for the browser.

- **set(name, value, options?)**: `ClientCookieOptions`: `expires?` (seconds),
  `expiresDate?`, `domain?`, `path?`, `secure?`, `sameSite?` ("strict" | "lax" |
  "none")
- **get(name)**: string | undefined
- **remove(name, options?)**: options: `domain`, `path`
- **getAll()**: Record<string, string>

---

## Use cases

- API requests to backend
- File upload with progress
- File download with progress
- Auth via interceptors
- Centralized error handling in response interceptor
- Cookie management

---

## Performance

- Fetch vs XHR chosen automatically for best behavior
- Request cache config supported

---

## Notes

- **Client only**: Use a server HTTP library on the server
- **Unified interface**: All methods return standard `Response`
  (Fetch-compatible)
- **Type-safe**: Full TypeScript support
- **No external deps**: Pure TypeScript

---

## See also

- [JSR package](https://jsr.io/@dreamer/utils)

---

## Contributing

Issues and Pull Requests are welcome.

---

## License

Apache License 2.0 — see [LICENSE](../../../LICENSE)

---

<div align="center">**Made with ❤️ by Dreamer Team**</div>
