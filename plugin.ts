/**
 * Deno lint plugin to enforce default values in i18next translation functions.
 *
 * This plugin provides two rules:
 * - `require-default-value`: Ensures `t()` function calls have default values
 * - `require-trans-default`: Ensures `<Trans>` components have a `defaults` prop
 *
 * ## Installation
 *
 * Add the plugin to your `deno.json`:
 *
 * ```json
 * {
 *   "lint": {
 *     "plugins": ["jsr:@intility/require-i18n-default"],
 *     "rules": {
 *       "include": [
 *         "require-translation-default/require-default-value",
 *         "require-translation-default/require-trans-default"
 *       ]
 *     }
 *   }
 * }
 * ```
 *
 * ## Usage
 *
 * ### Rule: require-default-value
 *
 * ```tsx
 * // ❌ Error: No default value provided
 * t('greeting.hello')
 * t('greeting.hello', { ns: 'common' })
 * t(`prefix.${key}`)
 *
 * // ✅ Good: Default value provided
 * t('greeting.hello', 'Hello')
 * t('greeting.hello', { defaultValue: 'Hello' })
 * t('greeting.hello', { defaultValue: 'Hello', ns: 'common' })
 * ```
 *
 * ### Rule: require-trans-default
 *
 * ```tsx
 * // ❌ Error: Missing defaults prop
 * <Trans i18nKey="greeting">Hello World</Trans>
 *
 * // ✅ Good: defaults prop provided
 * <Trans i18nKey="greeting" defaults="Hello World">Hello World</Trans>
 * ```
 *
 * ## Ignoring Specific Cases
 *
 * ```tsx
 * // deno-lint-ignore require-translation-default/require-default-value
 * const text = t('dynamic.key');
 * ```
 *
 * @module
 */

// deno-lint-ignore no-explicit-any
type Node = any;

/**
 * Checks if a node is a template literal with interpolations (dynamic key)
 */
function isDynamicTemplateLiteral(node: Node): boolean {
  return node?.type === "TemplateLiteral" && node.expressions?.length > 0;
}

/**
 * Checks if an object expression has a defaultValue property
 */
function hasDefaultValueProperty(node: Node): boolean {
  if (node?.type !== "ObjectExpression") return false;

  return node.properties?.some(
    (prop: Node) =>
      prop.type === "Property" &&
      prop.key?.type === "Identifier" &&
      prop.key.name === "defaultValue"
  );
}

/**
 * Deno lint plugin that enforces default values in i18next translations.
 */
const plugin: Deno.lint.Plugin = {
  name: "require-translation-default",
  rules: {
    /**
     * Ensures t() function calls include a default value.
     */
    "require-default-value": {
      create(context) {
        // Handler for t() calls
        const handleTCall = (node: Node) => {
          const args = node.arguments;
          const firstArg = args?.[0];
          const isDynamicKey = isDynamicTemplateLiteral(firstArg);

          // Case 1: No second argument at all
          if (!args || args.length < 2) {
            context.report({
              node,
              message: isDynamicKey
                ? "Dynamic translation key requires a defaultValue"
                : "Translation function t() requires a default value as second argument",
            });
            return;
          }

          const secondArg = args[1];

          // Case 2: Second argument is a string literal - valid shorthand
          if (
            secondArg.type === "Literal" &&
            typeof secondArg.value === "string"
          ) {
            return; // Valid: t('key', 'default')
          }

          // Case 3: Second argument is a template literal (string default)
          if (secondArg.type === "TemplateLiteral") {
            return; // Valid: t('key', `default ${value}`)
          }

          // Case 4: Second argument is an object - check for defaultValue
          if (secondArg.type === "ObjectExpression") {
            if (!hasDefaultValueProperty(secondArg)) {
              context.report({
                node,
                message:
                  "Translation options object must include a 'defaultValue' property",
              });
            }
            return;
          }

          // Case 5: Second argument is a variable/identifier - can't analyze statically
          // Allow it unless the first arg is a dynamic key
          if (secondArg.type === "Identifier") {
            return; // Allow: t('key', options) - can't know what's in options
          }
        };

        return {
          // Match t() calls
          'CallExpression[callee.name="t"]': handleTCall,
          // Match i18n.t() calls
          'CallExpression[callee.property.name="t"]': handleTCall,
        };
      },
    },

    /**
     * Ensures <Trans> components include a `defaults` prop.
     */
    "require-trans-default": {
      create(context) {
        return {
          'JSXOpeningElement[name.name="Trans"]'(node: Node) {
            const hasDefaultsProp = node.attributes?.some(
              (attr: Node) =>
                attr.type === "JSXAttribute" &&
                attr.name?.type === "JSXIdentifier" &&
                attr.name.name === "defaults"
            );

            if (!hasDefaultsProp) {
              context.report({
                node,
                message:
                  '<Trans> component requires a "defaults" prop for fallback text',
              });
            }
          },
        };
      },
    },
  },
};

export default plugin;
