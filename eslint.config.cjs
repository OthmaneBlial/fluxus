const js = require('@eslint/js');
const parser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');

module.exports = [
  { ignores: ['dist/**', 'node_modules/**', 'coverage/**'] },
  {
    files: ['**/*.{js,cjs,mjs,ts,mts}'],
    rules: js.configs.recommended.rules,
  },
  {
    files: ['**/*.{ts,mts}'],
    languageOptions: { parser },
    plugins: { '@typescript-eslint': tsPlugin },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      'no-undef': 'off', // TypeScript checks names, including imported types.
      '@typescript-eslint/no-explicit-any': 'off', // Public API types are tightened in roadmap 2.2.
    },
  },
  {
    files: ['bench/**/*.mjs'],
    languageOptions: { globals: { global: 'readonly', process: 'readonly', console: 'readonly' } },
  },
  {
    files: ['eslint.config.cjs'],
    languageOptions: { globals: { require: 'readonly', module: 'readonly' } },
  },
];
