# require-default-value

Enforces that `t()` translation calls include a default value.

## Rule details

A missing default value renders the raw key while translations load, and hides missing keys from reviewers.

Examples of **incorrect** code:

```tsx
t("greeting.hello");
t("greeting.hello", { ns: "common" });
t(`prefix.${key}`);
i18n.t("greeting.hello");
```

Examples of **correct** code:

```tsx
t("greeting.hello", "Hello");
t("greeting.hello", { defaultValue: "Hello" });
t("greeting.hello", { defaultValue: "Hello", ns: "common" });
t("greeting.hello", options);
```

A variable as second argument is allowed, because its content can't be analyzed statically.
