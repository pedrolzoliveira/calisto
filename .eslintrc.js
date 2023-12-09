module.exports = {
  env: {
    es2021: true,
    node: true
  },
  plugins: [
    '@stylistic/js'
  ],
  extends: ['standard-with-typescript', 'plugin:tailwindcss/recommended'],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json'
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/space-before-function-paren': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/restrict-plus-operands': 'off',
    '@typescript-eslint/array-type': 'off',
    curly: 'off',
    '@typescript-eslint/no-confusing-void-expression': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    semi: 'off',
    '@typescript-eslint/semi': 'off',
    '@stylistic/js/semi': ['error', 'always']
  }
};
