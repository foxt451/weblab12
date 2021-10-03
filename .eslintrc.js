module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['metarhia'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'arrow-parens': 'off',
    'no-undef': 'off',
  },
};
