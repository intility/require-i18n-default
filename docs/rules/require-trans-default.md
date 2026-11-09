# require-trans-default

Enforces that `<Trans>` components include a `defaults` prop.

## Rule details

The `defaults` prop provides fallback text while translations load, and gives reviewers the source text for the key.

Examples of **incorrect** code:

```tsx
<Trans i18nKey="greeting">Hello World</Trans>
<Trans i18nKey="greeting" />
```

Examples of **correct** code:

```tsx
<Trans i18nKey="greeting" defaults="Hello World">Hello World</Trans>
<Trans i18nKey="greeting" defaults={`Hello ${name}`}>Hello World</Trans>
<Trans i18nKey="greeting" defaults="Hello" />
```
