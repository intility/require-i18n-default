import { assertEquals } from "@std/assert";
import plugin from "./plugin.ts";

// ============================================
// Rule: require-default-value (t function)
// ============================================

Deno.test("require-default-value - t() with no arguments reports violation", () => {
  const diagnostics = Deno.lint.runPlugin(
    plugin,
    "component.tsx",
    "const text = t('greeting.hello');",
  );

  assertEquals(diagnostics.length, 1);
  assertEquals(diagnostics[0].id, "require-translation-default/require-default-value");
  assertEquals(
    diagnostics[0].message,
    "Translation function t() requires a default value as second argument",
  );
});

Deno.test("require-default-value - t() with string default is valid", () => {
  const diagnostics = Deno.lint.runPlugin(
    plugin,
    "component.tsx",
    "const text = t('greeting.hello', 'Hello');",
  );

  assertEquals(diagnostics.length, 0);
});

Deno.test("require-default-value - t() with object containing defaultValue is valid", () => {
  const diagnostics = Deno.lint.runPlugin(
    plugin,
    "component.tsx",
    "const text = t('greeting.hello', { defaultValue: 'Hello' });",
  );

  assertEquals(diagnostics.length, 0);
});

Deno.test("require-default-value - t() with object missing defaultValue reports violation", () => {
  const diagnostics = Deno.lint.runPlugin(
    plugin,
    "component.tsx",
    "const text = t('greeting.hello', { ns: 'common' });",
  );

  assertEquals(diagnostics.length, 1);
  assertEquals(
    diagnostics[0].message,
    "Translation options object must include a 'defaultValue' property",
  );
});

Deno.test("require-default-value - t() with object containing both ns and defaultValue is valid", () => {
  const diagnostics = Deno.lint.runPlugin(
    plugin,
    "component.tsx",
    "const text = t('greeting.hello', { defaultValue: 'Hello', ns: 'common' });",
  );

  assertEquals(diagnostics.length, 0);
});

Deno.test("require-default-value - t() with template literal key and no default reports violation", () => {
  const diagnostics = Deno.lint.runPlugin(
    plugin,
    "component.tsx",
    "const text = t(`prefix.${key}`);",
  );

  assertEquals(diagnostics.length, 1);
  assertEquals(
    diagnostics[0].message,
    "Dynamic translation key requires a defaultValue",
  );
});

Deno.test("require-default-value - t() with template literal key and defaultValue is valid", () => {
  const diagnostics = Deno.lint.runPlugin(
    plugin,
    "component.tsx",
    "const text = t(`prefix.${key}`, { defaultValue: 'Default text' });",
  );

  assertEquals(diagnostics.length, 0);
});

Deno.test("require-default-value - t() with template literal key and string default is valid", () => {
  const diagnostics = Deno.lint.runPlugin(
    plugin,
    "component.tsx",
    "const text = t(`prefix.${key}`, 'Default text');",
  );

  assertEquals(diagnostics.length, 0);
});

Deno.test("require-default-value - t() with variable as second arg is allowed", () => {
  const diagnostics = Deno.lint.runPlugin(
    plugin,
    "component.tsx",
    "const text = t('greeting.hello', options);",
  );

  assertEquals(diagnostics.length, 0);
});

Deno.test("require-default-value - i18n.t() with no default reports violation", () => {
  const diagnostics = Deno.lint.runPlugin(
    plugin,
    "component.tsx",
    "const text = i18n.t('greeting.hello');",
  );

  assertEquals(diagnostics.length, 1);
  assertEquals(diagnostics[0].id, "require-translation-default/require-default-value");
});

Deno.test("require-default-value - i18n.t() with default is valid", () => {
  const diagnostics = Deno.lint.runPlugin(
    plugin,
    "component.tsx",
    "const text = i18n.t('greeting.hello', 'Hello');",
  );

  assertEquals(diagnostics.length, 0);
});

Deno.test("require-default-value - does not flag other functions", () => {
  const diagnostics = Deno.lint.runPlugin(
    plugin,
    "component.tsx",
    "const text = translate('key');",
  );

  assertEquals(diagnostics.length, 0);
});

// ============================================
// Rule: require-trans-default (Trans component)
// ============================================

Deno.test("require-trans-default - Trans without defaults prop reports violation", () => {
  const diagnostics = Deno.lint.runPlugin(
    plugin,
    "component.tsx",
    '<Trans i18nKey="greeting">Hello World</Trans>',
  );

  assertEquals(diagnostics.length, 1);
  assertEquals(diagnostics[0].id, "require-translation-default/require-trans-default");
  assertEquals(
    diagnostics[0].message,
    '<Trans> component requires a "defaults" prop for fallback text',
  );
});

Deno.test("require-trans-default - Trans with defaults prop is valid", () => {
  const diagnostics = Deno.lint.runPlugin(
    plugin,
    "component.tsx",
    '<Trans i18nKey="greeting" defaults="Hello World">Hello World</Trans>',
  );

  assertEquals(diagnostics.length, 0);
});

Deno.test("require-trans-default - Trans with defaults as JSX expression is valid", () => {
  const diagnostics = Deno.lint.runPlugin(
    plugin,
    "component.tsx",
    '<Trans i18nKey="greeting" defaults={`Hello ${name}`}>Hello World</Trans>',
  );

  assertEquals(diagnostics.length, 0);
});

Deno.test("require-trans-default - Self-closing Trans without defaults reports violation", () => {
  const diagnostics = Deno.lint.runPlugin(
    plugin,
    "component.tsx",
    '<Trans i18nKey="greeting" />',
  );

  assertEquals(diagnostics.length, 1);
});

Deno.test("require-trans-default - Self-closing Trans with defaults is valid", () => {
  const diagnostics = Deno.lint.runPlugin(
    plugin,
    "component.tsx",
    '<Trans i18nKey="greeting" defaults="Hello" />',
  );

  assertEquals(diagnostics.length, 0);
});

Deno.test("require-trans-default - does not flag other JSX components", () => {
  const diagnostics = Deno.lint.runPlugin(
    plugin,
    "component.tsx",
    '<Translation i18nKey="key">Content</Translation>',
  );

  assertEquals(diagnostics.length, 0);
});

// ============================================
// Integration: Multiple violations in one file
// ============================================

Deno.test("detects multiple violations in a single file", () => {
  const code = `
    const a = t('key1');
    const b = t('key2', { ns: 'common' });
    const c = <Trans i18nKey="key3">Text</Trans>;
  `;

  const diagnostics = Deno.lint.runPlugin(plugin, "component.tsx", code);

  assertEquals(diagnostics.length, 3);
});

Deno.test("allows valid patterns in a single file", () => {
  const code = `
    const a = t('key1', 'Default');
    const b = t('key2', { defaultValue: 'Default', ns: 'common' });
    const c = <Trans i18nKey="key3" defaults="Text">Text</Trans>;
  `;

  const diagnostics = Deno.lint.runPlugin(plugin, "component.tsx", code);

  assertEquals(diagnostics.length, 0);
});
