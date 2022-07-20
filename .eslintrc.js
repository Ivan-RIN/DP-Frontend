module.exports = {
  root: true,

  env: {
    node: true,
    es6: true,
    browser: true,
  },

  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'template-curly-spacing': 'off',
    indent: [0],
    'no-tabs': ["warn", { allowIndentationTabs: true }],
    'no-mixed-spaces-and-tabs': ["warn", "smart-tabs"],
    'max-len': ["error", { "code": 120 }],
    'no-shadow': ["error", { "allow": ["state"] }],
    'no-plusplus': ["error", { "allowForLoopAfterthoughts": true }],
    'no-labels': "off",
    "prefer-destructuring": "off",
    "arrow-body-style": "off",
    "no-param-reassign": "off",
  },

  parserOptions: {
    parser: 'babel-eslint',
  },
};
