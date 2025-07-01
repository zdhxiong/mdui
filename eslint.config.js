import eslint from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import { configs as litConfigs } from 'eslint-plugin-lit';
import prettierPlugin from 'eslint-plugin-prettier/recommended';
import { configs as wcConfigs } from 'eslint-plugin-wc';
import tseslint from 'typescript-eslint';

const config = tseslint.config(
  {
    ignores: [
      '.DS_STORE',
      '.idea',
      '.vscode',
      '.vs',
      '.git',
      'node_modules',
      'packages/**/*.js',
      'packages/**/*.d.ts',
    ],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  importPlugin.flatConfigs.recommended,
  wcConfigs['flat/recommended'],
  litConfigs['flat/recommended'],
  {
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          // 从 monorepo 子项目查找 tsconfig.json
          project: 'packages/*/tsconfig.json',
          noWarnOnMultipleProjects: true,
          extensions: ['.js'],
        },
      },
      wc: {
        elementBaseClasses: ['LitElement'], // Recognize `LitElement` as a Custom Element base class
      },
      lit: {
        elementBaseClasses: ['MduiElement'], // Recognize `MduiElement` as a sub-class of LitElement
      },
    },
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/explicit-member-accessibility': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/member-ordering': [
        'error',
        {
          // https://typescript-eslint.io/rules/member-ordering/#default-configuration
          default: [
            // Index signature
            'signature',
            'call-signature',

            // Fields
            'public-static-field',
            'protected-static-field',
            'private-static-field',
            '#private-static-field',

            'public-decorated-field',
            'protected-decorated-field',
            'private-decorated-field',

            'public-instance-field',
            'protected-instance-field',
            'private-instance-field',
            '#private-instance-field',

            'public-abstract-field',
            'protected-abstract-field',

            // Static initialization
            'static-initialization',

            // Constructors
            'public-constructor',
            'protected-constructor',
            'private-constructor',

            'constructor',

            // Getters, Setters
            ['public-static-get', 'public-static-set'],
            ['protected-static-get', 'protected-static-set'],
            ['private-static-get', 'private-static-set'],
            ['#private-static-get', '#private-static-set'],

            ['public-decorated-get', 'public-decorated-set'],
            ['protected-decorated-get', 'protected-decorated-set'],
            ['private-decorated-get', 'private-decorated-set'],

            ['public-instance-get', 'public-instance-set'],
            ['protected-instance-get', 'protected-instance-set'],
            ['private-instance-get', 'private-instance-set'],
            ['#private-instance-get', '#private-instance-set'],

            ['public-abstract-get', 'public-abstract-set'],
            ['protected-abstract-get', 'protected-abstract-set'],

            // Methods
            'public-static-method',
            'protected-static-method',
            'private-static-method',
            '#private-static-method',

            'public-decorated-method',
            'protected-decorated-method',
            'private-decorated-method',

            'public-instance-method',
            'protected-instance-method',
            'private-instance-method',
            '#private-instance-method',

            'public-abstract-method',
            'protected-abstract-method',
          ],
        },
      ],
      'prettier/prettier': 'error',
      'grouped-accessor-pairs': ['error', 'getBeforeSet'],
      'import/no-unresolved': 'off',
      'import/extensions': [
        'error',
        'always',
        {
          checkTypeImports: true,
          pattern: { js: 'always', ts: 'never' },
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            // 不允许导入 .ts 文件
            {
              group: ['**/*.ts'],
              message:
                'Please use .js files instead of .ts files in the browser.',
            },
          ],
        },
      ],
      'import/no-default-export': 'error',
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          pathGroups: [
            {
              pattern: 'lit',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'lit/**',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@mdui/jq/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@mdui/shared/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@mdui/icons/**',
              group: 'internal',
              position: 'before',
            },
          ],
          alphabetize: {
            order: 'asc',
          },
          pathGroupsExcludedImportTypes: ['type'],
          warnOnUnassignedImports: true,
        },
      ],
    },
  },
  {
    files: ['scripts/**/*.{ts,js}', '*.{ts,js}'],
    rules: {
      'import/no-default-export': 'off',
    },
  },
  // 必须是最后一项
  prettierPlugin,
);

export default config;
