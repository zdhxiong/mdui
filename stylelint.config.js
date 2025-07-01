/**
 * @see https://stylelint.io/user-guide/configure
 * @type {import('stylelint').Config}
 **/
const config = {
  extends: ['stylelint-config-standard-less'],
  rules: {
    'less/no-duplicate-variables': null,
    'no-duplicate-selectors': null,
    'font-family-no-missing-generic-family-keyword': null,
  },
};

export default config;
