import antfu from '@antfu/eslint-config'

export default antfu(
  {
    typescript: false,
    ignores: [
      '.github',
      '.vscode',
      'node_modules',
      'dist',
    ],
  },
  {
    rules: {
      'jsdoc/check-param-names': 'off',
      'jsdoc/check-types': 'off',
      'jsdoc/require-returns-description': 'off',

      'antfu/consistent-list-newline': 'off',
      'antfu/top-level-function': 'off',

      'import/default': 'off',
      'import/order': 'off',

      'node/prefer-global/process': 'off',

      'no-console': 'off',
      'curly': 'off',
      'eqeqeq': 'off',
      'no-unused-vars': 'off',
      'unused-imports/no-unused-vars': 'off',
      'no-debugger': 'off',
      'no-restricted-syntax': 'off',
      'no-new': 'off',
      'prefer-promise-reject-errors': 'off',
      'no-unused-expressions': 'off',
      'sort-imports': 'off',
      'no-useless-constructor': 'off',

      'unicorn/consistent-function-scoping': 'off',
      'regexp/no-unused-capturing-group': 'off',
      'regexp/no-dupe-disjunctions': 'off',
      'perfectionist/sort-imports': 'off',
    },
  },
)
