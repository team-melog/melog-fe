import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import prettierConfig from 'eslint-config-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
      '**/build/**',
      '**/out/**',
      '**/.turbo/**',
    ],
  },
  ...compat.extends(
    '@typescript-eslint/recommended',
    'prettier'
  ),
  {
    languageOptions: {
      parser: compat.parserOptions('@typescript-eslint/parser'),
    },
    plugins: {
      '@typescript-eslint': compat.plugins('@typescript-eslint/eslint-plugin'),
      prettier: compat.plugins('eslint-plugin-prettier'),
    },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/prefer-const': 'error',
    },
  },
  prettierConfig,
];

export default eslintConfig;