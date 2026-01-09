/**
 * @fileoverview 分布式锁工具函数测试
 */

import {
  afterEach,
  assertRejects,
  beforeEach,
  describe,
  expect,
  it,
} from "@dreamer/test";
import {
  acquireLock,
  lockKey,
  type RedisClient,
  withLock,
} from "../src/lock.ts";

/**
 * 模拟 Redis 客户端（用于测试）
 */
class MockRedisClient implements RedisClient {
  private data: Map<string, string> = new Map();

  async set(key: any, value: any, ...args: any[]): Promise<string | null> {
    // 检查是否有 NX 参数
    const hasNX = args.includes("NX");
    if (hasNX && this.data.has(key)) {
      return null; // 键已存在，返回 null
    }

    this.data.set(key, value);
    return "OK";
  }

  async get(key: any): Promise<string | null> {
    return this.data.get(key) || null;
  }

  async del(key: any): Promise<number> {
    if (this.data.has(key)) {
      this.data.delete(key);
      return 1;
    }
    return 0;
  }

  async eval(
    script: string,
    numKeys: number,
    ...args: (string | number)[]
  ): Promise<unknown> {
    // 简化的 Lua 脚本执行（仅用于测试）
    const key = args[0] as string;
    const value = args[1] as string;

    if (this.data.get(key) === value) {
      this.data.delete(key);
      return 1;
    }
    return 0;
  }

  // 辅助方法：清空数据
  clear(): void {
    this.data.clear();
  }
}

describe("分布式锁工具函数", () => {
  let redis: MockRedisClient;

  beforeEach(() => {
    redis = new MockRedisClient();
  });

  afterEach(() => {
    redis.clear();
  });

  describe("lockKey", () => {
    it("应该生成格式化的锁键名", () => {
      expect(lockKey("test", "user123")).toBe("lock:test:user123");
      expect(lockKey("withdraw", "user456", "order789")).toBe(
        "lock:withdraw:user456:order789",
      );
      expect(lockKey("transfer", 123, 456)).toBe("lock:transfer:123:456");
    });
  });

  describe("acquireLock", () => {
    it("应该成功获取锁", async () => {
      const lock = await acquireLock(redis, "test:lock", {
        ttl: 10,
      });

      expect(lock).toBeDefined();
      expect(lock?.isAcquired()).toBe(true);
    });

    it("应该失败获取已存在的锁", async () => {
      // 先获取一次锁
      const lock1 = await acquireLock(redis, "test:lock", {
        ttl: 10,
      });
      expect(lock1).toBeDefined();

      // 再次尝试获取同一个锁（应该失败）
      const lock2 = await acquireLock(redis, "test:lock", {
        ttl: 10,
        throwOnFail: false,
      });

      expect(lock2).toBeNull();
    });

    it("应该在获取锁失败时抛出错误（默认）", async () => {
      // 先获取一次锁
      await acquireLock(redis, "test:lock", { ttl: 10 });

      // 再次尝试获取（应该抛出错误）
      await assertRejects(
        () => acquireLock(redis, "test:lock", { ttl: 10 }),
        Error,
      );
    });

    it("应该使用自定义错误消息", async () => {
      // 先获取一次锁
      await acquireLock(redis, "test:lock", { ttl: 10 });

      // 再次尝试获取（应该抛出自定义错误）
      let error: Error | null = null;
      try {
        await acquireLock(redis, "test:lock", {
          ttl: 10,
          errorMessage: "自定义错误消息",
        });
      } catch (e) {
        error = e as Error;
      }
      expect(error).toBeTruthy();
      expect(error?.message).toBe("自定义错误消息");
    });
  });

  describe("DistributedLock", () => {
    it("应该能够释放锁", async () => {
      const lock = await acquireLock(redis, "test:lock", {
        ttl: 10,
      });

      expect(lock).toBeDefined();
      expect(lock?.isAcquired()).toBe(true);

      await lock?.release();
      expect(lock?.isAcquired()).toBe(false);

      // 释放后应该可以再次获取
      const lock2 = await acquireLock(redis, "test:lock", {
        ttl: 10,
      });
      expect(lock2).toBeDefined();
    });
  });

  describe("withLock", () => {
    it("应该自动获取和释放锁", async () => {
      let executed = false;

      await withLock(
        redis,
        "test:lock",
        async () => {
          executed = true;
          return "result";
        },
        { ttl: 10 },
      );

      expect(executed).toBe(true);

      // 锁应该已释放，可以再次获取
      const lock = await acquireLock(redis, "test:lock", {
        ttl: 10,
      });
      expect(lock).toBeDefined();
    });

    it("应该返回函数执行结果", async () => {
      const result = await withLock(
        redis,
        "test:lock",
        async () => {
          return "test-result";
        },
        { ttl: 10 },
      );

      expect(result).toBe("test-result");
    });

    it("应该在函数抛出错误时也释放锁", async () => {
      let error: Error | null = null;
      try {
        await withLock(
          redis,
          "test:lock",
          async () => {
            throw new Error("测试错误");
          },
          { ttl: 10 },
        );
      } catch (e) {
        error = e as Error;
      }
      expect(error).toBeTruthy();
      expect(error?.message).toBe("测试错误");

      // 锁应该已释放，可以再次获取
      const lock = await acquireLock(redis, "test:lock", {
        ttl: 10,
      });
      expect(lock).toBeDefined();
    });

    it("应该在获取锁失败时抛出错误", async () => {
      // 先获取一次锁
      await acquireLock(redis, "test:lock", { ttl: 10 });

      // 再次尝试获取（应该抛出错误）
      let error: Error | null = null;
      try {
        await withLock(
          redis,
          "test:lock",
          async () => {
            return "should not execute";
          },
          { ttl: 10 },
        );
      } catch (e) {
        error = e as Error;
      }
      expect(error).toBeTruthy();
    });
  });
});
