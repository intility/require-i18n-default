import { definePlugin } from "@oxlint/plugins";

import requireDefaultValue from "./rules/require-default-value.ts";
import requireTransDefault from "./rules/require-trans-default.ts";

const i18nDefault = definePlugin({
  meta: {
    name: "i18n-default",
  },
  rules: {
    "require-default-value": requireDefaultValue,
    "require-trans-default": requireTransDefault,
  },
});

export default i18nDefault;
