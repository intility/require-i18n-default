import { RuleTester } from "oxlint/plugins-dev";
import { describe, it } from "vite-plus/test";

import rule from "../src/rules/require-default-value.ts";

RuleTester.describe = describe;
RuleTester.it = it;

// Test cases use JSX, so parse as TSX.
const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      lang: "tsx",
    },
  },
});

ruleTester.run("require-default-value", rule, {
  valid: [
    // String default is valid shorthand
    "const text = t('greeting.hello', 'Hello');",
    // Object with defaultValue is valid
    "const text = t('greeting.hello', { defaultValue: 'Hello' });",
    // Object with both ns and defaultValue is valid
    "const text = t('greeting.hello', { defaultValue: 'Hello', ns: 'common' });",
    // Template literal key with defaultValue is valid
    "const text = t(`prefix.${key}`, { defaultValue: 'Default text' });",
    // Template literal key with string default is valid
    "const text = t(`prefix.${key}`, 'Default text');",
    // Variable as second arg is allowed, can't analyze statically
    "const text = t('greeting.hello', options);",
    // i18n.t() with default is valid
    "const text = i18n.t('greeting.hello', 'Hello');",
    // Other functions are not flagged
    "const text = translate('key');",
    // Template literal key with string default is valid
    "const text = t(`prefix.${key}`, `Default ${value}`);",
  ],
  invalid: [
    // No second argument at all
    {
      code: "const text = t('greeting.hello');",
      errors: [{ messageId: "missingDefaultValue" }],
    },
    // Object missing defaultValue
    {
      code: "const text = t('greeting.hello', { ns: 'common' });",
      errors: [{ messageId: "missingDefaultValueProperty" }],
    },
    // Dynamic template key without default gets its own message
    {
      code: "const text = t(`prefix.${key}`);",
      errors: [{ messageId: "dynamicKey" }],
    },
    // i18n.t() without default
    {
      code: "const text = i18n.t('greeting.hello');",
      errors: [{ messageId: "missingDefaultValue" }],
    },
    // Multiple violations in one file
    {
      code: "const a = t('key1');\nconst b = t('key2', { ns: 'common' });",
      errors: [{ messageId: "missingDefaultValue" }, { messageId: "missingDefaultValueProperty" }],
    },
  ],
});
