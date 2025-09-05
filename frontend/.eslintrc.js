module.exports = {
  extends: [
    'react-app',
    'react-app/jest',
  ],
  rules: {
    'prefer-const': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
  env: {
    browser: true,
    es6: true,
    node: true,
  },
};
