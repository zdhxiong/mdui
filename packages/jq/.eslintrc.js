// https://eslint.org/docs/user-guide/configuring

module.exports = {
  env: {
    es6: true,
    browser: true
  },
  extends: 'airbnb-base',
  plugins: [
    "import",
  ],
  rules: {
    'func-names': 0,
    'no-param-reassign': 0,
  }
};
