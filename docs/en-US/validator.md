# Validator

> Validation utility module for type checks, object schemas, custom rules,
> transform, default, and conditional validation.

[![JSR](https://jsr.io/badges/@dreamer/utils)](https://jsr.io/@dreamer/utils)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)

---

## Overview

Validation utilities similar to Joi/Yup. Supported in both server and client
environments.

---

## Features

- **Basic types**: `string`, `number`, `boolean`, `email`, `url`
- **Object**: `object` with nested schemas
- **Array**: `array` with item validator
- **Custom rules**: `custom` validator function
- **Transform**: type conversion
- **Default**: default values
- **Conditional**: `when` based on other fields
- **Messages**: custom error messages via `options.messages` or
  `.message(rule, msg)`; default messages are in English when options are not
  passed
- **Async**: `validateAsync` for async validation

---

## Custom messages (options)

You can override error messages in two ways:

1. **Per call** — pass `options.messages` to `validate()` / `validateAsync()` /
   `validateAll()`. If you do not pass `options` (or `options.messages`),
   built-in **default English** messages are used.
2. **Per schema** — call `.message(rule, message)` on a validator to set
   messages for that schema.

Message resolution order: `options.messages[rule]` → schema
`.message(rule, msg)` → default English.

**Rule names** (for `options.messages` or `.message(rule, msg)`): `required`,
`min`, `max`, `pattern`, `email`, `integer`, `type`, `transform`, `custom`, etc.

```typescript
import {
  string,
  validate,
  type ValidateOptions,
} from "jsr:@dreamer/utils/validator";

// No options: default English messages
const r1 = validate("", string().required());
// r1.errors[0].message === "This field is required"

// With options: custom messages (e.g. for i18n)
const r2 = validate("", string().required(), {
  messages: {
    required: "此字段为必填项",
    min: "最少 {min} 个字符",
  },
});

// Only override some rules
const r3 = validate("ab", string().min(5), {
  messages: { min: "至少 5 个字符" },
});
```

---

## Installation

```bash
deno add jsr:@dreamer/utils
```

---

## Environment compatibility

- **Runtime**: Deno 2.6+ or Bun 1.3.5+
- **Server**: ✅ Supported
- **Client**: ✅ Supported (via `jsr:@dreamer/utils/client/validator`)
- **Dependencies**: None (pure TypeScript)

---

## Quick start

```typescript
import {
  array,
  email,
  number,
  object,
  string,
  url,
  validate,
} from "jsr:@dreamer/utils/validator";

// Basic validation
const nameSchema = string().min(2).max(50).required();
const result = validate("Alice", nameSchema);
if (result.success) {
  console.log("Valid:", result.data);
} else {
  console.log("Errors:", result.errors);
}

// Object validation
const userSchema = object({
  name: string().min(2).required(),
  age: number().min(18).max(100).required(),
  email: email().required(),
  website: url().optional(),
  tags: array(string()).min(1).optional(),
});

const userData = {
  name: "Alice",
  age: 25,
  email: "alice@example.com",
  website: "https://example.com",
  tags: ["developer", "designer"],
};

const userResult = validate(userData, userSchema);
if (userResult.success) {
  console.log("User valid:", userResult.data);
} else {
  userResult.errors.forEach((error) => {
    console.log(`${error.path}: ${error.message}`);
  });
}

// Custom rule
const passwordSchema = string()
  .min(8)
  .custom((value) => {
    if (!/[A-Z]/.test(value)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(value)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(value)) return "Password must contain at least one digit";
    return true;
  })
  .required();

// Transform and default
const configSchema = object({
  port: number().default(3000).transform((v) => Number(v)),
  debug: boolean().default(false),
  timeout: number().min(0).default(5000),
});
```

---

## API Reference

### ValidateOptions

Optional third argument for `validate`, `validateAsync`, and `validateAll`. Used
to override error messages; if not passed, default English messages are used.

```typescript
interface ValidateOptions {
  /** Override messages by rule name (e.g. required, min, max, email, type) */
  messages?: Record<string, string>;
}
```

---

### validate

Validate a value and return the result.

```typescript
function validate<T = unknown>(
  value: unknown,
  validator: Validator<T>,
  options?: ValidateOptions,
): ValidationResult<T>;
```

**Parameters**:

- `value: unknown` - Value to validate
- `validator: Validator<T>` - Validator
- `options?: ValidateOptions` - Optional; `messages` overrides error text; omit
  for default English

**Returns**: `ValidationResult<T>`

**ValidationResult**:

```typescript
interface ValidationResult<T> {
  success: boolean;
  data?: T; // transformed value when success
  errors: ValidationError[];
}
```

**ValidationError**:

```typescript
interface ValidationError {
  path: string; // e.g. "user.address.city"
  message: string;
  value: unknown;
  rule?: string;
}
```

**Example**:

```typescript
const result = validate("Alice", string().min(2).required());
if (result.success) console.log("Valid:", result.data);
else result.errors.forEach((e) => console.log(`${e.path}: ${e.message}`));

// With custom messages
const result2 = validate("", string().required(), {
  messages: { required: "This field is required" },
});
```

---

### string

Create a string validator.

**Methods**: `required()`, `optional()`, `default(value)`, `min(length)`,
`max(length)`, `email()`, `url()`, `pattern(regex)`, `custom(fn)`,
`transform(fn)`, `message(rule, message)`

**Example**:

```typescript
const schema = string().min(2).max(50).required().message(
  "required",
  "This field is required",
);
const result = validate("Alice", schema);
```

---

### number

Create a number validator.

**Methods**: `required()`, `optional()`, `default(value)`, `min(value)`,
`max(value)`, `integer()`, `custom(fn)`, `transform(fn)`,
`message(rule, message)`

**Example**:

```typescript
const schema = number().min(18).max(100).integer().required();
const result = validate(25, schema);
```

---

### boolean

Create a boolean validator.

**Methods**: `required()`, `optional()`, `default(value)`, `custom(fn)`,
`transform(fn)`, `message(rule, message)`

**Example**:

```typescript
const schema = boolean().default(false);
const result = validate(true, schema);
```

---

### email

Email validator (extends string).

**Example**:

```typescript
const schema = email().required();
const result = validate("alice@example.com", schema);
```

---

### url

URL validator (extends string).

**Example**:

```typescript
const schema = url().required();
const result = validate("https://example.com", schema);
```

---

### object

Create an object validator.

```typescript
function object<T extends Record<string, unknown>>(
  schema: ObjectSchema<T>,
): ObjectValidator<T>;
```

**ObjectSchema**: `{ [K in keyof T]: Validator<T[K]> }`

**ObjectValidator methods**: `required()`, `optional()`,
`when(path, condition)`, `custom(fn)`, `transform(fn)`, `message(rule, message)`

**Example**:

```typescript
const schema = object({
  name: string().min(2).required(),
  age: number().min(18).required(),
  email: email().required(),
});
const result = validate(
  { name: "Alice", age: 25, email: "alice@example.com" },
  schema,
);
```

---

### array

Create an array validator.

```typescript
function array<T = unknown>(itemValidator: Validator<T>): ArrayValidator<T>;
```

**ArrayValidator methods**: `required()`, `optional()`, `min(length)`,
`max(length)`, `custom(fn)`, `transform(fn)`, `message(rule, message)`

**Example**:

```typescript
const schema = array(string()).min(1).required();
const result = validate(["item1", "item2"], schema);
```

---

### validateAsync

Validate asynchronously.

```typescript
function validateAsync<T = unknown>(
  value: unknown,
  validator: Validator<T>,
  options?: ValidateOptions,
): Promise<ValidationResult<T>>;
```

**Parameters**: `value`, `validator`, `options?` (same as `validate`)

**Returns**: Promise of validation result

**Example**:

```typescript
const result = await validateAsync(value, validator);
const result2 = await validateAsync(value, validator, {
  messages: { required: "必填" },
});
```

---

### validateAll

Collect all errors (do not stop at first error).

```typescript
function validateAll<T = unknown>(
  value: unknown,
  validator: Validator<T>,
  options?: ValidateOptions,
): ValidationResult<T>;
```

**Example**:

```typescript
// validate: stops at first error
const result1 = validate(value, schema);
// validateAll: continues and returns all errors
const result2 = validateAll(value, schema);
// With custom messages
const result3 = validateAll(value, schema, { messages: { required: "必填" } });
```

---

## Use cases

- **Form validation**: User input
- **API validation**: Request/response payloads
- **Config validation**: Config files
- **Data transform**: Validate and coerce types
- **Conditional validation**: Depend on other fields

---

## Performance

- **Short-circuit**: `validate` stops at first error
- **Full collection**: `validateAll` returns all errors
- **Transform**: Optional type conversion during validation

---

## Notes

- **Type-safe**: Full TypeScript support
- **Pure**: No side effects
- **Client**: Use `jsr:@dreamer/utils/client/validator` in the browser
- **Default messages**: Built-in messages are in English when `options` is not
  passed
- **Messages**: Override via `options.messages` (per call) or
  `.message(rule, msg)` (per schema); supports i18n

---

## See also

- [Client module](client/validator.md)
- [JSR package](https://jsr.io/@dreamer/utils)

---

## Contributing

Issues and Pull Requests are welcome.

---

## License

Apache License 2.0 — see [LICENSE](../../LICENSE)

---

<div align="center">

**Made with ❤️ by Dreamer Team**

</div>
