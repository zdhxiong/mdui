import { playwrightLauncher } from '@web/test-runner-playwright';
import { fromRollup } from '@web/dev-server-rollup';
import commonjs from '@rollup/plugin-commonjs';

// bug: https://github.com/modernweb-dev/web/issues/1700

export default {
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
