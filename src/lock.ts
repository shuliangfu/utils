/**
 * @module @dreamer/utils/lock
 *
 * 分布式锁工具函数模块
 *
 * 提供基于 Redis 的分布式锁功能，用于防止并发操作。
 */

/**
 * Redis 客户端接口
 * 兼容 ioredis 和 node-redis 等常见 Redis 客户端
 */
export interface RedisClient {
  /** 设置键值 */
  set(key: any, value: any, ...args: any[]): Promise<string | null>;
  /** 获取值 */
  get(key: any): Promise<string | null>;
  /** 删除键 */
  del(key: any): Promise<number>;
  /** 执行 Lua 脚本 */
  eval(
    script: string,
    numKeys: number,
    ...args: (string | number)[]
  ): Promise<unknown>;
}

/**
 * 分布式锁选项
 */
export interface DistributedLockOptions {
  /** 锁的过期时间（秒），默认 30 秒 */
  ttl?: number;
  /** 获取锁失败时是否抛出错误，默认 true */
  throwOnFail?: boolean;
  /** 获取锁失败时的错误消息 */
  errorMessage?: string;
}

/**
 * 分布式锁实例
 */
export class DistributedLock {
  private redis: RedisClient;
  private key: string;
  private value: string;
  private ttl: number;
  private acquired: boolean = false;

  /**
   * 创建分布式锁实例
   *
   * @param redis Redis 客户端
   * @param key 锁的键名
   * @param value 锁的值（用于释放时验证）
   * @param ttl 锁的过期时间（秒）
   */
  constructor(
    redis: RedisClient,
    key: string,
    value: string,
    ttl: number,
  ) {
    this.redis = redis;
    this.key = key;
    this.value = value;
    this.ttl = ttl;
  }

  /**
   * 尝试获取锁
   *
   * @returns 是否成功获取锁
   */
  async acquire(): Promise<boolean> {
    if (this.acquired) {
      return true;
    }

    // 使用 SET ... EX ... NX 原子性获取锁
    const result = await this.redis.set(
      this.key,
      this.value,
      "EX",
      this.ttl,
      "NX",
    );

    this.acquired = result === "OK";
    return this.acquired;
  }

  /**
   * 释放锁
   *
   * 使用 Lua 脚本保证原子性，只有锁的值匹配时才删除
   */
  async release(): Promise<void> {
    if (!this.acquired) {
      return;
    }

    // 使用 Lua 脚本原子性释放锁
    // 只有锁的值匹配时才删除，防止误删其他进程的锁
    const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;

    try {
      await this.redis.eval(script, 1, this.key, this.value);
      this.acquired = false;
    } catch (error) {
      // 释放锁失败不影响主流程，记录日志即可
      console.error(`释放锁失败: ${this.key}`, error);
    }
  }

  /**
   * 检查锁是否已获取
   */
  isAcquired(): boolean {
    return this.acquired;
  }
}

/**
 * 获取分布式锁
 *
 * 尝试获取锁，如果失败则根据选项决定是否抛出错误。
 *
 * @param redis Redis 客户端
 * @param key 锁的键名
 * @param options 选项
 * @returns 分布式锁实例
 *
 * @example
 * ```typescript
 * import { acquireLock } from "@dreamer/utils/lock";
 * import { Redis } from "npm:ioredis";
 *
 * const redis = new Redis("redis://localhost:6379");
 *
 * // 获取锁
 * const lock = await acquireLock(redis, "lock:user:123", {
 *   ttl: 10, // 10秒过期
 * });
 *
 * if (lock) {
 *   try {
 *     // 执行需要互斥的操作
 *     await doSomething();
 *   } finally {
 *     // 释放锁
 *     await lock.release();
 *   }
 * }
 * ```
 */
export async function acquireLock(
  redis: RedisClient,
  key: string,
  options: DistributedLockOptions = {},
): Promise<DistributedLock | null> {
  const {
    ttl = 30,
    throwOnFail = true,
    errorMessage = "操作正在进行中，请稍后重试",
  } = options;

  // 生成唯一的锁值，用于释放时验证
  const value = `${Date.now()}-${Math.random()}`;

  const lock = new DistributedLock(redis, key, value, ttl);

  const acquired = await lock.acquire();

  if (!acquired) {
    if (throwOnFail) {
      throw new Error(errorMessage);
    }
    return null;
  }

  return lock;
}

/**
 * 使用分布式锁执行函数
 *
 * 自动获取和释放锁，确保函数执行期间持有锁。
 *
 * @param redis Redis 客户端
 * @param key 锁的键名
 * @param fn 要执行的函数
 * @param options 选项
 * @returns 函数执行结果
 *
 * @example
 * ```typescript
 * import { withLock } from "@dreamer/utils/lock";
 * import { Redis } from "npm:ioredis";
 *
 * const redis = new Redis("redis://localhost:6379");
 *
 * // 使用锁执行函数
 * const result = await withLock(
 *   redis,
 *   "lock:user:123",
 *   async () => {
 *     // 执行需要互斥的操作
 *     return await doSomething();
 *   },
 *   {
 *     ttl: 10, // 10秒过期
 *   }
 * );
 * ```
 */
export async function withLock<T>(
  redis: RedisClient,
  key: string,
  fn: () => Promise<T>,
  options: DistributedLockOptions = {},
): Promise<T> {
  const lock = await acquireLock(redis, key, options);

  if (!lock) {
    throw new Error(
      options.errorMessage || "操作正在进行中，请稍后重试",
    );
  }

  try {
    return await fn();
  } finally {
    await lock.release();
  }
}

/**
 * 生成锁的键名
 *
 * 辅助函数，用于生成格式化的锁键名。
 *
 * @param prefix 前缀
 * @param parts 键的组成部分
 * @returns 锁的键名
 *
 * @example
 * ```typescript
 * import { lockKey } from "@dreamer/utils/lock";
 *
 * const key = lockKey("withdraw", "user123");
 * // 返回: "lock:withdraw:user123"
 * ```
 */
export function lockKey(prefix: string, ...parts: (string | number)[]): string {
  return `lock:${prefix}:${parts.join(":")}`;
}
