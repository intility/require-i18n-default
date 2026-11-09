import type { ESTree, Rule } from "@oxlint/plugins";

type JSXOpeningElement = ESTree.JSXOpeningElement;
type JSXAttribute = ESTree.JSXAttribute;

const rule: Rule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Require a `defaults` prop on i18next `<Trans>` components",
      url: "https://github.com/intility/require-i18n-default/blob/main/docs/rules/require-trans-default.md",
    },
    schema: [],
    messages: {
      missingDefaults: '<Trans> component requires a "defaults" prop for fallback text',
    },
  },

  createOnce(context) {
    return {
      JSXOpeningElement(node: JSXOpeningElement) {
        if (node.name.type !== "JSXIdentifier" || node.name.name !== "Trans") {
          return;
        }

        const hasDefaultsProp = node.attributes.some(
          (attribute): attribute is JSXAttribute =>
            attribute.type === "JSXAttribute" &&
            attribute.name.type === "JSXIdentifier" &&
            attribute.name.name === "defaults",
        );

        if (!hasDefaultsProp) {
          context.report({ node, messageId: "missingDefaults" });
        }
      },
    };
  },
};

export default rule;
