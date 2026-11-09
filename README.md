<h1 align="center">
  <img src="https://avatars.githubusercontent.com/u/35199565" width="124px"/><br/>
  @intility/oxlint-plugin-require-i18n-default
</h1>

<p align="center">
Oxlint plugin to enforce default values in i18next translation functions and components.
</p>

## Installation

```sh
pnpm add -D @intility/oxlint-plugin-require-i18n-default
```

Add the plugin and rules to your `.oxlintrc.json`:

```json
{
  "jsPlugins": ["@intility/oxlint-plugin-require-i18n-default"],
  "rules": {
    "i18n-default/require-default-value": "error",
    "i18n-default/require-trans-default": "error"
  }
}
```

Or with `oxlint.config.ts`:

```ts
import { defineConfig } from "oxlint";

export default defineConfig({
  jsPlugins: ["@intility/oxlint-plugin-require-i18n-default"],
  rules: {
    "i18n-default/require-default-value": "error",
    "i18n-default/require-trans-default": "error",
  },
});
```

For Vite+ projects, use the `lint` block in `vite.config.ts` instead:

```ts
import { defineConfig } from "vite-plus";

export default defineConfig({
  lint: {
    jsPlugins: ["@intility/oxlint-plugin-require-i18n-default"],
    rules: {
      "i18n-default/require-default-value": "error",
      "i18n-default/require-trans-default": "error",
    },
  },
});
```

## Rules

### `i18n-default/require-default-value`

Ensures `t()` function calls include a default value.

```tsx
// Invalid
t("greeting.hello");
t("greeting.hello", { ns: "common" });
t(`prefix.${key}`);
i18n.t("greeting.hello");

// Valid
t("greeting.hello", "Hello");
t("greeting.hello", { defaultValue: "Hello" });
t("greeting.hello", { defaultValue: "Hello", ns: "common" });
t("greeting.hello", options);
```

### `i18n-default/require-trans-default`

Ensures `<Trans>` components include a `defaults` prop.

```tsx
// Invalid
<Trans i18nKey="greeting">Hello World</Trans>

// Valid
<Trans i18nKey="greeting" defaults="Hello World">Hello World</Trans>
```

## Ignoring specific cases

```tsx
// oxlint-disable i18n-default/require-default-value
const text = t("dynamic.key");

// oxlint-disable i18n-default/require-trans-default
<Trans i18nKey="key">Content</Trans>;
```

## Note

The Oxlint JS plugin API is in alpha. Pin the `oxlint` version in projects that use this plugin.
