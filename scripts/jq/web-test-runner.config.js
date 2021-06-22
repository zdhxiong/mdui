const { playwrightLauncher } = require('@web/test-runner-playwright');
const { fromRollup } = require('@web/dev-server-rollup');
const commonjs = require('@rollup/plugin-commonjs');

module.exports = {
  files: 'packages/jq/__test__/**/*.test.js',
  // 打开下面两项，在浏览器中手动测试
  // manual: true,
  // open: true,
  nodeResolve: true,
  coverage: true,
  coverageConfig: {
    report: true,
    reportDir: 'packages/jq/coverage',
  },
  testRunnerHtml: (testFramework) =>
    `<html>
      <body>
        <script type="module" src="${testFramework}"></script>
        <div id="frame"></div>
      </body>
    </html>`,
  browsers: [
    playwrightLauncher({ product: 'chromium' }),
    playwrightLauncher({ product: 'firefox' }),
    playwrightLauncher({ product: 'webkit' }),
  ],
  plugins: [fromRollup(commonjs)()],
};
