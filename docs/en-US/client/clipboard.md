# Client Clipboard

> Clipboard utilities for copy and read in the browser.

[![JSR](https://jsr.io/badges/@dreamer/utils)](https://jsr.io/@dreamer/utils)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)

---

## Overview

Clipboard utilities for browser: copy text to clipboard, read text from
clipboard, and capability detection.

---

## Features

- **Copy**: Prefer modern Clipboard API; fallback to execCommand for older
  browsers. Works in HTTPS and localhost.
- **Read**: Modern Clipboard API; requires user permission.
- **Detection**: `isClipboardSupported`, `isClipboardReadSupported`.

---

## Installation

```bash
deno add jsr:@dreamer/utils
```

---

## Environment

- **Runtime**: Deno 2.6+ or Bun 1.3.5+
- **Client**: ✅ Supported (browser; HTTPS or localhost)
- **Server**: ❌ Not supported

**Notes**:

- Clipboard API requires a secure context (HTTPS or localhost).
- Clipboard operations must be triggered by user gesture (e.g. click).
- Reading clipboard may require user permission.

---

## API Reference

### copyToClipboard(text: string): Promise<void>

Copy text to the clipboard. Uses Clipboard API when available; otherwise falls
back to execCommand.

**Parameters**: `text` (string) — text to copy.

**Returns**: `Promise<void>` — resolves on success, rejects on failure.

**Example**:

```typescript
import { copyToClipboard } from "jsr:@dreamer/utils/client/clipboard";

await copyToClipboard("Hello, World!");

try {
  await copyToClipboard("Hello, World!");
  console.log("Copied");
} catch (error) {
  console.error("Copy failed:", error);
}

button.addEventListener("click", async () => {
  try {
    await copyToClipboard("Text to copy");
    alert("Copied!");
  } catch (error) {
    alert("Copy failed, please copy manually");
  }
});
```

---

### readFromClipboard(): Promise<string>

Read text from the clipboard. Uses Clipboard API; requires user permission.

**Returns**: `Promise<string>` — clipboard text.

**Example**:

```typescript
import { readFromClipboard } from "jsr:@dreamer/utils/client/clipboard";

const text = await readFromClipboard();
console.log("Clipboard:", text);

button.addEventListener("click", async () => {
  try {
    const text = await readFromClipboard();
    input.value = text;
  } catch (error) {
    alert("Failed to read clipboard");
  }
});
```

---

### isClipboardSupported(): boolean

Check if copy is supported (Clipboard API or execCommand).

**Returns**: `boolean`.

**Example**:

```typescript
import {
  copyToClipboard,
  isClipboardSupported,
} from "jsr:@dreamer/utils/client/clipboard";

if (isClipboardSupported()) {
  await copyToClipboard("Hello");
} else {
  console.warn("Clipboard not supported");
}
```

---

### isClipboardReadSupported(): boolean

Check if reading clipboard is supported.

**Returns**: `boolean`.

**Example**:

```typescript
import {
  isClipboardReadSupported,
  readFromClipboard,
} from "jsr:@dreamer/utils/client/clipboard";

if (isClipboardReadSupported()) {
  const text = await readFromClipboard();
} else {
  console.warn("Clipboard read not supported");
}
```

---

## Use cases

- Copy button: copy text on click.
- Copy link: one-click copy URL.
- Paste: read clipboard into an input on button click.
- Feature detection: show/hide copy or paste UI based on support.

---

## Notes

### Secure context

Clipboard API requires HTTPS, localhost, or 127.0.0.1. In non-secure contexts
the implementation falls back to execCommand where possible.

### User gesture

Clipboard operations must be triggered by user interaction (e.g. click), not on
load.

```typescript
// ❌ Wrong: do not run on load
window.addEventListener("load", async () => {
  await copyToClipboard("text"); // may fail
});

// ✅ Right: run on user action
button.addEventListener("click", async () => {
  await copyToClipboard("text");
});
```

### Permission

Reading the clipboard may prompt the user for permission.

### Mobile

On mobile (e.g. iOS Safari), execCommand may be limited; prefer Clipboard API
when available.

### Error handling

Always use try/catch; operations can fail due to permission or context.

```typescript
try {
  await copyToClipboard("text");
} catch (error) {
  console.error("Copy failed:", error);
  // e.g. show a fallback or manual copy UI
}
```

---

## Implementation details

**Copy**: Prefer `navigator.clipboard.writeText`; if unavailable or denied, fall
back to creating a temporary textarea, selecting it, and
`document.execCommand('copy')`, then remove the element.

**Read**: Use `navigator.clipboard.readText()`. No fallback for older browsers.

---

## Type definitions

```typescript
export function copyToClipboard(text: string): Promise<void>;
export function readFromClipboard(): Promise<string>;
export function isClipboardSupported(): boolean;
export function isClipboardReadSupported(): boolean;
```

---

## Contributing

Issues and Pull Requests are welcome.

---

## License

Apache License 2.0 — see [LICENSE](../../../LICENSE)

---

<div align="center">**Made with ❤️ by Dreamer Team**</div>
