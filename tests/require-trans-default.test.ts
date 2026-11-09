import { RuleTester } from "oxlint/plugins-dev";
import { describe, it } from "vite-plus/test";

import rule from "../src/rules/require-trans-default.ts";

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

ruleTester.run("require-trans-default", rule, {
  valid: [
    // Defaults prop is present
    '<Trans i18nKey="greeting" defaults="Hello World">Hello World</Trans>',
    // Defaults as JSX expression is present
    '<Trans i18nKey="greeting" defaults={`Hello ${name}`}>Hello World</Trans>',
    // Self-closing with defaults
    '<Trans i18nKey="greeting" defaults="Hello" />',
    // Other JSX components are not flagged
    '<Translation i18nKey="key">Content</Translation>',
  ],
  invalid: [
    // Missing defaults prop
    {
      code: '<Trans i18nKey="greeting">Hello World</Trans>',
      errors: [{ messageId: "missingDefaults" }],
    },
    // Self-closing without defaults
    {
      code: '<Trans i18nKey="greeting" />',
      errors: [{ messageId: "missingDefaults" }],
    },
    // Two violations in one file
    {
      code: 'const a = <Trans i18nKey="key1">Text</Trans>;\nconst b = <Trans i18nKey="key2" />;',
      errors: [{ messageId: "missingDefaults" }, { messageId: "missingDefaults" }],
    },
  ],
});
