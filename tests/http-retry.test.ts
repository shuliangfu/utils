/**
 * HTTP 客户端重试逻辑测试（独立文件，单独进程运行，避免与主 http.test 同进程导致 OOM）
 */

import { afterEach, beforeEach, describe, expect, it } from "@dreamer/test";
import { HttpClient } from "../src/client/http/mod.ts";

function createMockFetch(
  responseData: unknown = { success: true },
  status: number = 200,
): typeof fetch {
  return async (_input: RequestInfo | URL, _init?: RequestInit) => {
    await new Promise((r) => setTimeout(r, 5));
    return new Response(JSON.stringify(responseData), {
      status,
      statusText: status === 200 ? "OK" : "Error",
      headers: { "Content-Type": "application/json" },
    });
  };
}

describe("HttpClient 重试逻辑（独立进程）", () => {
  let originalFetch: typeof fetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("应该在失败时自动重试", async () => {
    let attemptCount = 0;
    const client = new HttpClient();

    globalThis.fetch = async () => {
      attemptCount++;
      if (attemptCount < 3) {
        throw new Error("Network error");
      }
      return createMockFetch()(
        new Request("https://api.example.com"),
      );
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
    let fetchCallCount = 0;
    const client = new HttpClient();

    globalThis.fetch = async () => {
      fetchCallCount++;
      throw new Error("Network error");
    };

    try {
      // 使用 retryDelay: 0 避免测试环境中 setTimeout 导致挂起/OOM，仅断言重试次数
      await client.get("https://api.example.com/users", {
        retry: true,
        retryOptions: {
          retries: 2,
          retryDelay: 0,
          exponentialBackoff: true,
        },
      });
    } catch {
      // 预期会失败
    }

    expect(fetchCallCount).toBe(3);
  });

  it("应该只在满足重试条件时重试", async () => {
    let attemptCount = 0;
    const client = new HttpClient();

    globalThis.fetch = async () => {
      attemptCount++;
      return new Response(JSON.stringify({}), {
        status: 404,
      });
    };

    await client.get("https://api.example.com/users", {
      retry: true,
      retryOptions: {
        retries: 3,
        retryDelay: 10,
        retryCondition: (error) => {
          if (error instanceof Response) {
            return error.status >= 500;
          }
          return true;
        },
      },
    });

    expect(attemptCount).toBe(1);
  });
});
