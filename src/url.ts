/**
 * @module @dreamer/utils/url
 *
 * URL 处理工具函数模块
 *
 * 提供 URL 解析、构建、查询参数处理、编码解码、合并、验证等功能。
 */

/**
 * URL 解析结果
 */
export interface ParsedURL {
  protocol: string;
  host: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  origin: string;
}

/**
 * 解析 URL
 *
 * @param url URL 字符串
 * @returns 解析后的对象
 */
export function parse(url: string): ParsedURL {
  try {
    const urlObj = new URL(url);
    return {
      protocol: urlObj.protocol,
      host: urlObj.host,
      hostname: urlObj.hostname,
      port: urlObj.port,
      pathname: urlObj.pathname,
      search: urlObj.search,
      hash: urlObj.hash,
      origin: urlObj.origin,
    };
  } catch {
    throw new Error(`无效的 URL: ${url}`);
  }
}

/**
 * 解析查询字符串
 *
 * @param query 查询字符串（如 "name=Alice&age=25"）
 * @returns 查询参数对象
 */
export function parseQuery(query: string): Record<string, string> {
  const result: Record<string, string> = {};
  const params = new URLSearchParams(query);
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  return result;
}

/**
 * URL 构建选项
 */
export interface BuildURLOptions {
  protocol?: string;
  host?: string;
  hostname?: string;
  port?: string;
  pathname?: string;
  search?: string;
  hash?: string;
}

/**
 * 构建 URL
 *
 * @param options URL 选项
 * @returns URL 字符串
 */
export function build(options: BuildURLOptions): string {
  const parts: string[] = [];

  if (options.protocol) {
    parts.push(options.protocol);
    if (!options.protocol.endsWith(":")) {
      parts.push("//");
    }
  } else {
    parts.push("https://");
  }

  if (options.host) {
    parts.push(options.host);
  } else if (options.hostname) {
    parts.push(options.hostname);
    if (options.port) {
      parts.push(`:${options.port}`);
    }
  }

  if (options.pathname) {
    if (!options.pathname.startsWith("/")) {
      parts.push("/");
    }
    parts.push(options.pathname);
  }

  if (options.search) {
    if (!options.search.startsWith("?")) {
      parts.push("?");
    }
    parts.push(options.search);
  }

  if (options.hash) {
    if (!options.hash.startsWith("#")) {
      parts.push("#");
    }
    parts.push(options.hash);
  }

  return parts.join("");
}

/**
 * 构建查询字符串
 *
 * @param params 查询参数对象
 * @returns 查询字符串
 */
export function buildQuery(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined) {
      searchParams.append(key, String(value));
    }
  }
  return searchParams.toString();
}

/**
 * URL 编码
 *
 * @param str 字符串
 * @returns 编码后的字符串
 */
export function encode(str: string): string {
  return encodeURIComponent(str);
}

/**
 * URL 解码
 *
 * @param str 编码的字符串
 * @returns 解码后的字符串
 */
export function decode(str: string): string {
  return decodeURIComponent(str);
}

/**
 * URL 合并
 *
 * @param base 基础 URL
 * @param paths 路径片段
 * @returns 合并后的 URL
 */
export function join(base: string, ...paths: string[]): string {
  let result = base.replace(/\/+$/, ""); // 移除末尾的斜杠

  for (const path of paths) {
    const cleanPath = path.replace(/^\/+/, ""); // 移除开头的斜杠
    if (cleanPath) {
      result += `/${cleanPath}`;
    }
  }

  return result;
}

/**
 * 验证 URL 是否有效
 *
 * @param url URL 字符串
 * @returns 是否有效
 */
export function isValid(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
