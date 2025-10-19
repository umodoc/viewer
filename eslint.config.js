import { FlatCompat } from '@eslint/eslintrc'
import eslintJS from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort'
import eslintPluginUnusedImports from 'eslint-plugin-unused-imports'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'

const compat = new FlatCompat({
  baseDirectory: process.cwd(),
})

export default [
  eslintJS.configs.recommended,
  ...compat.extends('plugin:prettier/recommended'),
  {
    ignores: ['./dist/**', './node_modules/**'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'prefer-destructuring': 'error',
      curly: 'error',
      eqeqeq: 'error',
      'prefer-const': [
        'error',
        {
          destructuring: 'all',
        },
      ],
      'object-shorthand': 'error',
      'prefer-template': 'warn',
      'no-undef': 'off',
      'no-unused-vars': 'off',
      'no-empty': 'off',
      'spaced-comment': ['error', 'always'],
    },
  },
  // eslintFunctional.configs.externalTypescriptRecommended,
  ...pluginVue.configs['flat/recommended'],
  {
    plugins: {
      'simple-import-sort': eslintPluginSimpleImportSort,
      'unused-imports': eslintPluginUnusedImports,
    },
    languageOptions: {
      parserOptions: {
        project: './jsconfig.json',
        ecmaVersion: 2024,
        extraFileExtensions: ['.vue'],
        sourceType: 'module',
      },
    },
    rules: {
      'no-useless-escape': 'off',
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': 'error',
      'unused-imports/no-unused-imports': 'error',
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off',
      'vue/no-v-text-v-html-on-component': 'off',
    },
  },
  eslintConfigPrettier,
]
