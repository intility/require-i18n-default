# @intility/require-i18n-default

Deno lint plugin to enforce default values in i18next translation functions and components.

## Installation

Add the plugin to your `deno.json`:

```json
{
  "lint": {
    "plugins": ["jsr:@intility/require-i18n-default"],
    "rules": {
      "include": [
        "require-translation-default/require-default-value",
        "require-translation-default/require-trans-default"
      ]
    }
  }
}
```

## Rules

### `require-translation-default/require-default-value`

Ensures `t()` function calls include a default value.

```tsx
// Invalid
t('greeting.hello')
t('greeting.hello', { ns: 'common' })
t(`prefix.${key}`)
i18n.t('greeting.hello')

// Valid
t('greeting.hello', 'Hello')
t('greeting.hello', { defaultValue: 'Hello' })
t('greeting.hello', { defaultValue: 'Hello', ns: 'common' })
```

### `require-translation-default/require-trans-default`

Ensures `<Trans>` components include a `defaults` prop.

```tsx
// Invalid
<Trans i18nKey="greeting">Hello World</Trans>

// Valid
<Trans i18nKey="greeting" defaults="Hello World">Hello World</Trans>
```

## Ignoring Specific Cases

```tsx
// deno-lint-ignore require-translation-default/require-default-value
const text = t('dynamic.key');

// deno-lint-ignore require-translation-default/require-trans-default
<Trans i18nKey="key">Content</Trans>
```
