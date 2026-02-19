/**
 * @module @dreamer/validator
 *
 * @dreamer/validator 数据验证库
 *
 * 提供类型验证、对象结构验证、自定义验证规则等功能，支持服务端和客户端。
 *
 * 特性：
 * - 基础类型验证（字符串、数字、布尔、日期、邮箱、URL等）
 * - 对象结构验证（类似 Joi/Yup）
 * - 数组验证
 * - 自定义验证规则
 * - 异步验证支持
 * - 错误消息定制
 * - 验证转换
 * - 默认值
 * - 条件验证
 *
 * 环境兼容性：
 * - 服务端：✅ 支持（Deno 运行时）
 * - 客户端：✅ 支持（浏览器环境）
 *
 * @example
 * ```typescript
 * import { validate, string, number, object } from "jsr:@dreamer/validator";
 *
 * const schema = object({
 *   name: string().min(2).required(),
 *   age: number().min(18).required(),
 * });
 *
 * const result = validate({ name: "Alice", age: 25 }, schema);
 * if (result.success) {
 *   console.log("验证通过", result.data);
 * }
 * ```
 */

/**
 * 验证错误信息
 */
export interface ValidationError {
  /** 字段路径（支持嵌套，如 "user.address.city"） */
  path: string;
  /** 错误消息 */
  message: string;
  /** 字段值 */
  value: unknown;
  /** 验证规则名称 */
  rule?: string;
}

/**
 * 验证结果
 */
export interface ValidationResult<T = unknown> {
  /** 是否验证通过 */
  success: boolean;
  /** 验证后的数据（转换后的值） */
  data?: T;
  /** 错误列表 */
  errors: ValidationError[];
}

/**
 * 验证选项，用于自定义错误消息等
 * 不传或 messages 不传时使用内置默认英文消息
 */
export interface ValidateOptions {
  /**
   * 按规则名覆盖错误消息
   * 规则名示例: required, min, max, pattern, email, integer, type, transform 等
   */
  messages?: Record<string, string>;
}

/**
 * 验证器接口
 */
export interface Validator<T = unknown> {
  /** 验证值；可选传入 options 以覆盖错误消息 */
  validate(
    value: unknown,
    data?: Record<string, unknown>,
    options?: ValidateOptions,
  ): ValidationResult<T>;
  /** 异步验证 */
  validateAsync?(
    value: unknown,
    data?: Record<string, unknown>,
    options?: ValidateOptions,
  ): Promise<ValidationResult<T>>;
}

/**
 * 字符串验证器
 */
export class StringValidator implements Validator<string> {
  private rules: Array<{
    name: string;
    validate: (value: string, options?: ValidateOptions) => boolean | string;
  }> = [];
  private _required: boolean = false;
  private defaultValue?: string;
  private transformFn?: (value: unknown) => string;
  private customMessages: Map<string, string> = new Map();

  /**
   * 设置必填
   */
  required(): this {
    this._required = true;
    // 添加规则：必填字段不能为空字符串
    this.rules.push({
      name: "required",
      validate: (value, options) => {
        if (value.trim().length === 0) {
          return this.getMessage("required", "This field is required", options);
        }
        return true;
      },
    });
    return this;
  }

  /**
   * 设置可选
   */
  optional(): this {
    this._required = false;
    return this;
  }

  /**
   * 设置默认值
   */
  default(value: string): this {
    this.defaultValue = value;
    return this;
  }

  /**
   * 设置最小长度
   */
  min(length: number): this {
    this.rules.push({
      name: "min",
      validate: (value, options) => {
        if (value.length < length) {
          return this.getMessage(
            "min",
            `String length must be at least ${length} characters`,
            options,
          );
        }
        return true;
      },
    });
    return this;
  }

  /**
   * 设置最大长度
   */
  max(length: number): this {
    this.rules.push({
      name: "max",
      validate: (value, options) => {
        if (value.length > length) {
          return this.getMessage(
            "max",
            `String length must not exceed ${length} characters`,
            options,
          );
        }
        return true;
      },
    });
    return this;
  }

  /**
   * 设置正则表达式匹配
   */
  pattern(regex: RegExp): this {
    this.rules.push({
      name: "pattern",
      validate: (value, options) => {
        if (!regex.test(value)) {
          return this.getMessage("pattern", "Invalid string format", options);
        }
        return true;
      },
    });
    return this;
  }

  /**
   * 验证邮箱格式
   */
  email(): this {
    this.rules.push({
      name: "email",
      validate: (value, options) => {
        const emailRegex =
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (!emailRegex.test(value)) {
          return this.getMessage("email", "Invalid email format", options);
        }
        return true;
      },
    });
    return this;
  }

  /**
   * 自定义验证规则
   */
  custom(validator: (value: string) => boolean | string): this {
    this.rules.push({
      name: "custom",
      validate: validator,
    });
    return this;
  }

  /**
   * 类型转换
   */
  transform(fn: (value: unknown) => string): this {
    this.transformFn = fn;
    return this;
  }

  /**
   * 自定义错误消息
   */
  message(rule: string, message: string): this {
    this.customMessages.set(rule, message);
    return this;
  }

  /**
   * 获取错误消息：优先 options.messages[rule]，其次 schema 上 .message(rule, msg)，最后默认英文
   */
  private getMessage(
    rule: string,
    defaultMessage: string,
    options?: ValidateOptions,
  ): string {
    const fromOptions = options?.messages?.[rule];
    if (fromOptions !== undefined) return fromOptions;
    const customMessage = this.customMessages.get(rule);
    if (customMessage) return customMessage;
    return defaultMessage;
  }

  /**
   * 验证值；可传入 options.messages 覆盖错误消息，不传则使用默认英文
   */
  validate(
    value: unknown,
    _data?: Record<string, unknown>,
    options?: ValidateOptions,
  ): ValidationResult<string> {
    const errors: ValidationError[] = [];

    // 处理默认值
    if (value === undefined || value === null) {
      if (this.defaultValue !== undefined) {
        value = this.defaultValue;
      } else if (this._required) {
        errors.push({
          path: "",
          message: this.getMessage(
            "required",
            "This field is required",
            options,
          ),
          value,
          rule: "required",
        });
        return { success: false, errors };
      } else {
        return { success: true, data: undefined, errors: [] };
      }
    }

    // 类型转换
    if (this.transformFn) {
      try {
        value = this.transformFn(value);
      } catch (error) {
        const msg = options?.messages?.transform ??
          `Transform failed: ${
            error instanceof Error ? error.message : String(error)
          }`;
        errors.push({
          path: "",
          message: msg,
          value,
          rule: "transform",
        });
        return { success: false, errors };
      }
    }

    // 类型检查
    if (typeof value !== "string") {
      errors.push({
        path: "",
        message: this.getMessage("type", "Must be a string", options),
        value,
        rule: "type",
      });
      return { success: false, errors };
    }

    const stringValue = value as string;

    // 执行验证规则，传入 options 以便规则内可解析自定义消息
    for (const rule of this.rules) {
      const result = rule.validate(stringValue, options);
      if (result !== true) {
        const msg = typeof result === "string"
          ? result
          : this.getMessage("custom", "Validation failed", options);
        errors.push({
          path: "",
          message: msg,
          value: stringValue,
          rule: rule.name,
        });
        return { success: false, errors };
      }
    }

    return { success: true, data: stringValue, errors: [] };
  }
}

/**
 * 数字验证器
 */
export class NumberValidator implements Validator<number> {
  private rules: Array<{
    name: string;
    validate: (value: number, options?: ValidateOptions) => boolean | string;
  }> = [];
  private _required: boolean = false;
  private defaultValue?: number;
  private transformFn?: (value: unknown) => number;
  private customMessages: Map<string, string> = new Map();

  /**
   * 设置必填
   */
  required(): this {
    this._required = true;
    return this;
  }

  /**
   * 设置可选
   */
  optional(): this {
    this._required = false;
    return this;
  }

  /**
   * 设置默认值
   */
  default(value: number): this {
    this.defaultValue = value;
    return this;
  }

  /**
   * 设置最小值
   */
  min(value: number): this {
    this.rules.push({
      name: "min",
      validate: (num, options) => {
        if (num < value) {
          return this.getMessage("min", `Must be at least ${value}`, options);
        }
        return true;
      },
    });
    return this;
  }

  /**
   * 设置最大值
   */
  max(value: number): this {
    this.rules.push({
      name: "max",
      validate: (num, options) => {
        if (num > value) {
          return this.getMessage("max", `Must not exceed ${value}`, options);
        }
        return true;
      },
    });
    return this;
  }

  /**
   * 设置整数
   */
  integer(): this {
    this.rules.push({
      name: "integer",
      validate: (num, options) => {
        if (!Number.isInteger(num)) {
          return this.getMessage("integer", "Must be an integer", options);
        }
        return true;
      },
    });
    return this;
  }

  /**
   * 自定义验证规则
   */
  custom(validator: (value: number) => boolean | string): this {
    this.rules.push({
      name: "custom",
      validate: validator,
    });
    return this;
  }

  /**
   * 类型转换
   */
  transform(fn: (value: unknown) => number): this {
    this.transformFn = fn;
    return this;
  }

  /**
   * 自定义错误消息
   */
  message(rule: string, message: string): this {
    this.customMessages.set(rule, message);
    return this;
  }

  /**
   * 获取错误消息：优先 options.messages[rule]，其次 schema 上 .message(rule, msg)，最后默认英文
   */
  private getMessage(
    rule: string,
    defaultMessage: string,
    options?: ValidateOptions,
  ): string {
    const fromOptions = options?.messages?.[rule];
    if (fromOptions !== undefined) return fromOptions;
    const customMessage = this.customMessages.get(rule);
    if (customMessage) return customMessage;
    return defaultMessage;
  }

  /**
   * 验证值；可传入 options.messages 覆盖错误消息，不传则使用默认英文
   */
  validate(
    value: unknown,
    _data?: Record<string, unknown>,
    options?: ValidateOptions,
  ): ValidationResult<number> {
    const errors: ValidationError[] = [];

    // 处理默认值
    if (value === undefined || value === null) {
      if (this.defaultValue !== undefined) {
        value = this.defaultValue;
      } else if (this._required) {
        errors.push({
          path: "",
          message: this.getMessage(
            "required",
            "This field is required",
            options,
          ),
          value,
          rule: "required",
        });
        return { success: false, errors };
      } else {
        return { success: true, data: undefined, errors: [] };
      }
    }

    // 类型转换
    if (this.transformFn) {
      try {
        value = this.transformFn(value);
      } catch (error) {
        const msg = options?.messages?.transform ??
          `Transform failed: ${
            error instanceof Error ? error.message : String(error)
          }`;
        errors.push({
          path: "",
          message: msg,
          value,
          rule: "transform",
        });
        return { success: false, errors };
      }
    }

    // 类型检查
    if (typeof value !== "number" || isNaN(value)) {
      errors.push({
        path: "",
        message: this.getMessage("type", "Must be a number", options),
        value,
        rule: "type",
      });
      return { success: false, errors };
    }

    const numberValue = value as number;

    // 执行验证规则
    for (const rule of this.rules) {
      const result = rule.validate(numberValue, options);
      if (result !== true) {
        errors.push({
          path: "",
          message: typeof result === "string"
            ? result
            : this.getMessage("custom", "Validation failed", options),
          value: numberValue,
          rule: rule.name,
        });
        return { success: false, errors };
      }
    }

    return { success: true, data: numberValue, errors: [] };
  }
}

/**
 * 布尔值验证器
 */
export class BooleanValidator implements Validator<boolean> {
  private _required: boolean = false;
  private defaultValue?: boolean;
  private transformFn?: (value: unknown) => boolean;

  /**
   * 设置必填
   */
  required(): this {
    this._required = true;
    return this;
  }

  /**
   * 设置可选
   */
  optional(): this {
    this._required = false;
    return this;
  }

  /**
   * 设置默认值
   */
  default(value: boolean): this {
    this.defaultValue = value;
    return this;
  }

  /**
   * 类型转换
   */
  transform(fn: (value: unknown) => boolean): this {
    this.transformFn = fn;
    return this;
  }

  /**
   * 验证值；可传入 options.messages 覆盖错误消息，不传则使用默认英文
   */
  validate(
    value: unknown,
    _data?: Record<string, unknown>,
    options?: ValidateOptions,
  ): ValidationResult<boolean> {
    const errors: ValidationError[] = [];
    const msg = (rule: string, def: string) => options?.messages?.[rule] ?? def;

    // 处理默认值
    if (value === undefined || value === null) {
      if (this.defaultValue !== undefined) {
        value = this.defaultValue;
      } else if (this._required) {
        errors.push({
          path: "",
          message: msg("required", "This field is required"),
          value,
          rule: "required",
        });
        return { success: false, errors };
      } else {
        return { success: true, data: undefined, errors: [] };
      }
    }

    // 类型转换
    if (this.transformFn) {
      try {
        value = this.transformFn(value);
      } catch (error) {
        errors.push({
          path: "",
          message: msg(
            "transform",
            `Transform failed: ${
              error instanceof Error ? error.message : String(error)
            }`,
          ),
          value,
          rule: "transform",
        });
        return { success: false, errors };
      }
    }

    // 类型检查
    if (typeof value !== "boolean") {
      errors.push({
        path: "",
        message: msg("type", "Must be a boolean"),
        value,
        rule: "type",
      });
      return { success: false, errors };
    }

    return { success: true, data: value as boolean, errors: [] };
  }
}

/**
 * 邮箱验证器
 */
export class EmailValidator extends StringValidator {
  constructor() {
    super();
    this.pattern(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    );
  }
}

/**
 * URL 验证器
 */
export class UrlValidator extends StringValidator {
  constructor() {
    super();
    this.custom((value) => {
      try {
        new URL(value);
        return true;
      } catch {
        return "Invalid URL format";
      }
    });
  }
}

/**
 * 对象验证器模式
 */
export type ObjectSchema<T = Record<string, unknown>> = {
  [K in keyof T]: Validator<T[K]>;
};

/**
 * 对象验证器
 */
export class ObjectValidator<
  T extends Record<string, unknown> = Record<string, unknown>,
> implements Validator<T> {
  private schema: ObjectSchema<T>;
  private _required: boolean = false;

  constructor(schema: ObjectSchema<T>) {
    this.schema = schema;
  }

  /**
   * 设置必填
   */
  required(): this {
    this._required = true;
    return this;
  }

  /**
   * 设置可选
   */
  optional(): this {
    this._required = false;
    return this;
  }

  /**
   * 验证值；可传入 options.messages 覆盖错误消息，不传则使用默认英文
   */
  validate(
    value: unknown,
    _data?: Record<string, unknown>,
    options?: ValidateOptions,
  ): ValidationResult<T> {
    const errors: ValidationError[] = [];
    const msg = (rule: string, def: string) => options?.messages?.[rule] ?? def;

    // 处理 undefined/null
    if (value === undefined || value === null) {
      if (this._required) {
        errors.push({
          path: "",
          message: msg("required", "This field is required"),
          value,
          rule: "required",
        });
        return { success: false, errors };
      } else {
        return { success: true, data: undefined, errors: [] };
      }
    }

    // 类型检查
    if (typeof value !== "object" || Array.isArray(value) || value === null) {
      errors.push({
        path: "",
        message: msg("type", "Must be an object"),
        value,
        rule: "type",
      });
      return { success: false, errors };
    }

    const obj = value as Record<string, unknown>;
    const result: Record<string, unknown> = {};
    let hasError = false;

    // 验证每个字段，将 options 向下传递
    for (const [key, validator] of Object.entries(this.schema)) {
      const fieldValue = obj[key];
      const fieldResult = validator.validate(fieldValue, obj, options);

      if (fieldResult.success) {
        if (fieldResult.data !== undefined) {
          result[key] = fieldResult.data;
        }
      } else {
        hasError = true;
        // 添加字段路径前缀
        for (const error of fieldResult.errors) {
          errors.push({
            path: error.path ? `${key}.${error.path}` : key,
            message: error.message,
            value: error.value,
            rule: error.rule,
          });
        }
      }
    }

    if (hasError) {
      return { success: false, errors };
    }

    return { success: true, data: result as T, errors: [] };
  }
}

/**
 * 数组验证器
 */
export class ArrayValidator<T = unknown> implements Validator<T[]> {
  private itemValidator: Validator<T>;
  private minLength?: number;
  private maxLength?: number;
  private _required: boolean = false;

  constructor(itemValidator: Validator<T>) {
    this.itemValidator = itemValidator;
  }

  /**
   * 设置必填
   */
  required(): this {
    this._required = true;
    return this;
  }

  /**
   * 设置可选
   */
  optional(): this {
    this._required = false;
    return this;
  }

  /**
   * 设置最小长度
   */
  min(length: number): this {
    this.minLength = length;
    return this;
  }

  /**
   * 设置最大长度
   */
  max(length: number): this {
    this.maxLength = length;
    return this;
  }

  /**
   * 验证值；可传入 options.messages 覆盖错误消息，不传则使用默认英文
   */
  validate(
    value: unknown,
    _data?: Record<string, unknown>,
    options?: ValidateOptions,
  ): ValidationResult<T[]> {
    const errors: ValidationError[] = [];
    const msg = (rule: string, def: string) => options?.messages?.[rule] ?? def;

    // 处理 undefined/null
    if (value === undefined || value === null) {
      if (this._required) {
        errors.push({
          path: "",
          message: msg("required", "This field is required"),
          value,
          rule: "required",
        });
        return { success: false, errors };
      } else {
        return { success: true, data: undefined, errors: [] };
      }
    }

    // 类型检查
    if (!Array.isArray(value)) {
      errors.push({
        path: "",
        message: msg("type", "Must be an array"),
        value,
        rule: "type",
      });
      return { success: false, errors };
    }

    const arr = value as unknown[];

    // 长度验证
    if (this.minLength !== undefined && arr.length < this.minLength) {
      errors.push({
        path: "",
        message: msg(
          "min",
          `Array length must be at least ${this.minLength} elements`,
        ),
        value: arr,
        rule: "min",
      });
      return { success: false, errors };
    }

    if (this.maxLength !== undefined && arr.length > this.maxLength) {
      errors.push({
        path: "",
        message: msg(
          "max",
          `Array length must not exceed ${this.maxLength} elements`,
        ),
        value: arr,
        rule: "max",
      });
      return { success: false, errors };
    }

    // 验证每个元素，将 options 向下传递
    const result: T[] = [];
    let hasError = false;

    for (let i = 0; i < arr.length; i++) {
      const itemResult = this.itemValidator.validate(arr[i], {}, options);
      if (itemResult.success) {
        if (itemResult.data !== undefined) {
          result.push(itemResult.data);
        }
      } else {
        hasError = true;
        // 添加索引路径
        for (const error of itemResult.errors) {
          errors.push({
            path: error.path ? `[${i}].${error.path}` : `[${i}]`,
            message: error.message,
            value: error.value,
            rule: error.rule,
          });
        }
      }
    }

    if (hasError) {
      return { success: false, errors };
    }

    return { success: true, data: result, errors: [] };
  }
}

/**
 * 创建字符串验证器
 */
export function string(): StringValidator {
  return new StringValidator();
}

/**
 * 创建数字验证器
 */
export function number(): NumberValidator {
  return new NumberValidator();
}

/**
 * 创建布尔值验证器
 */
export function boolean(): BooleanValidator {
  return new BooleanValidator();
}

/**
 * 创建邮箱验证器
 */
export function email(): EmailValidator {
  return new EmailValidator();
}

/**
 * 创建 URL 验证器
 */
export function url(): UrlValidator {
  return new UrlValidator();
}

/**
 * 创建对象验证器
 */
export function object<
  T extends Record<string, unknown> = Record<string, unknown>,
>(
  schema: ObjectSchema<T>,
): ObjectValidator<T> {
  return new ObjectValidator<T>(schema);
}

/**
 * 创建数组验证器
 */
export function array<T = unknown>(
  itemValidator: Validator<T>,
): ArrayValidator<T> {
  return new ArrayValidator<T>(itemValidator);
}

/**
 * 验证值
 *
 * @param value 要验证的值
 * @param validator 验证器
 * @param options 可选：messages 为规则名到错误文案的映射，不传则使用内置默认英文消息
 * @returns 验证结果
 */
export function validate<T = unknown>(
  value: unknown,
  validator: Validator<T>,
  options?: ValidateOptions,
): ValidationResult<T> {
  return validator.validate(value, undefined, options);
}

/**
 * 异步验证值
 *
 * @param value 要验证的值
 * @param validator 验证器（必须支持异步验证）
 * @param options 可选：同 validate 的 options
 * @returns 验证结果
 */
export async function validateAsync<T = unknown>(
  value: unknown,
  validator: Validator<T>,
  options?: ValidateOptions,
): Promise<ValidationResult<T>> {
  if (validator.validateAsync) {
    return await validator.validateAsync(value, undefined, options);
  }
  return validator.validate(value, undefined, options);
}

/**
 * 收集所有错误（不中断验证）
 *
 * @param value 要验证的值
 * @param validator 验证器
 * @param options 可选：同 validate 的 options
 * @returns 验证结果（包含所有错误）
 */
export function validateAll<T = unknown>(
  value: unknown,
  validator: Validator<T>,
  options?: ValidateOptions,
): ValidationResult<T> {
  return validator.validate(value, undefined, options);
}
