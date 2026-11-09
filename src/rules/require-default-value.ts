import type { ESTree, Rule } from "@oxlint/plugins";

type CallExpression = ESTree.CallExpression;
type Expression = ESTree.Expression;

/** Checks if a node is a `t()` or `x.t()` call. */
function isTCall(callee: Expression): boolean {
  if (callee.type === "Identifier") {
    return callee.name === "t";
  }
  return (
    callee.type === "MemberExpression" &&
    !callee.computed &&
    callee.property.type === "Identifier" &&
    callee.property.name === "t"
  );
}

/** Checks if a node is a template literal with interpolations (dynamic key). */
function isDynamicTemplateLiteral(node: Expression | undefined): boolean {
  return node !== undefined && node.type === "TemplateLiteral" && node.expressions.length > 0;
}

/** Checks if an object expression has a `defaultValue` property. */
function hasDefaultValueProperty(node: ESTree.ObjectExpression): boolean {
  return node.properties.some(
    (prop) =>
      prop.type === "Property" &&
      !prop.computed &&
      prop.key.type === "Identifier" &&
      prop.key.name === "defaultValue",
  );
}

const rule: Rule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Require a default value in i18next `t()` translation calls",
      url: "https://github.com/intility/require-i18n-default/blob/main/docs/rules/require-default-value.md",
    },
    schema: [],
    messages: {
      missingDefaultValue: "Translation function t() requires a default value as second argument",
      dynamicKey: "Dynamic translation key requires a defaultValue",
      missingDefaultValueProperty:
        "Translation options object must include a 'defaultValue' property",
    },
  },

  createOnce(context) {
    return {
      CallExpression(node: CallExpression) {
        if (!isTCall(node.callee)) return;

        const args = node.arguments;
        const firstArg = args[0];
        const isDynamicKey = isDynamicTemplateLiteral(firstArg);

        // Case 1: No second argument at all
        if (args.length < 2) {
          context.report({
            node,
            messageId: isDynamicKey ? "dynamicKey" : "missingDefaultValue",
          });
          return;
        }

        const secondArg = args[1];

        // Case 2: Second argument is a string literal - valid shorthand
        if (secondArg.type === "Literal" && typeof secondArg.value === "string") {
          return;
        }

        // Case 3: Second argument is a template literal (string default)
        if (secondArg.type === "TemplateLiteral") {
          return;
        }

        // Case 4: Second argument is an object - check for defaultValue
        if (secondArg.type === "ObjectExpression") {
          if (!hasDefaultValueProperty(secondArg)) {
            context.report({
              node,
              messageId: "missingDefaultValueProperty",
            });
          }
          return;
        }

        // Case 5: Second argument is anything else - can't analyze statically
      },
    };
  },
};

export default rule;
