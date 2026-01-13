/**
 * Cookie 管理（客户端）
 *
 * 提供浏览器环境下的 Cookie 管理功能
 */

import type { ClientCookieOptions } from "./types.ts";

/**
 * Cookie 管理器（客户端）
 * 用于浏览器环境中的 Cookie 管理
 */
export class ClientCookieManager {
  /**
   * 设置 Cookie
   *
   * @param name Cookie 名称
   * @param value Cookie 值
   * @param options Cookie 选项
   */
  set(name: string, value: string, options: ClientCookieOptions = {}): void {
    if (typeof (globalThis as any).document === "undefined") {
      throw new Error("Cookie 管理只能在浏览器环境中使用");
    }

    let cookieString = `${encodeURIComponent(name)}=${
      encodeURIComponent(value)
    }`;

    // 过期时间
    if (options.expires) {
      const expiresDate = new Date();
      expiresDate.setTime(expiresDate.getTime() + options.expires * 1000);
      cookieString += `; Expires=${expiresDate.toUTCString()}`;
    } else if (options.expiresDate) {
      cookieString += `; Expires=${options.expiresDate.toUTCString()}`;
    }

    // 域名
    if (options.domain) {
      cookieString += `; Domain=${options.domain}`;
    }

    // 路径
    if (options.path) {
      cookieString += `; Path=${options.path}`;
    } else {
      cookieString += `; Path=/`;
    }

    // Secure
    if (options.secure) {
      cookieString += `; Secure`;
    }

    // SameSite
    if (options.sameSite) {
      const sameSiteValue = options.sameSite.charAt(0).toUpperCase() +
        options.sameSite.slice(1).toLowerCase();
      cookieString += `; SameSite=${sameSiteValue}`;
    }

    (globalThis as any).document.cookie = cookieString;
  }

  /**
   * 获取 Cookie 值
   *
   * @param name Cookie 名称
   * @returns Cookie 值，如果不存在返回 undefined
   */
  get(name: string): string | undefined {
    if (typeof (globalThis as any).document === "undefined") {
      return undefined;
    }

    const cookies = (globalThis as any).document.cookie.split(";");
    for (const cookie of cookies) {
      const [cookieName, ...valueParts] = cookie.trim().split("=");
      if (cookieName === name) {
        const value = valueParts.join("=");
        try {
          return decodeURIComponent(value);
        } catch {
          return value;
        }
      }
    }

    return undefined;
  }

  /**
   * 删除 Cookie
   *
   * @param name Cookie 名称
   * @param options Cookie 选项（用于指定 domain 和 path）
   */
  remove(
    name: string,
    options: Pick<ClientCookieOptions, "domain" | "path"> = {},
  ): void {
    this.set(name, "", {
      expires: 0,
      domain: options.domain,
      path: options.path,
    });
  }

  /**
   * 获取所有 Cookie
   *
   * @returns 所有 Cookie 的键值对
   */
  getAll(): Record<string, string> {
    if (typeof (globalThis as any).document === "undefined") {
      return {};
    }

    const cookies: Record<string, string> = {};
    const cookieString = (globalThis as any).document.cookie;

    if (!cookieString) {
      return cookies;
    }

    cookieString.split(";").forEach((cookie: string) => {
      const [name, ...valueParts] = cookie.trim().split("=");
      if (name) {
        const value = valueParts.join("=");
        try {
          cookies[name] = decodeURIComponent(value);
        } catch {
          cookies[name] = value;
        }
      }
    });

    return cookies;
  }
}
