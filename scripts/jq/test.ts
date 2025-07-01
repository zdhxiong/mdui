import commonjs from '@rollup/plugin-commonjs';
import { fromRollup } from '@web/dev-server-rollup';
import { startTestRunner } from '@web/test-runner';
import { playwrightLauncher } from '@web/test-runner-playwright';

startTestRunner({
  config: {
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
    plugins: [
      fromRollup(commonjs)({
        strictRequires: 'auto',
      }),
    ],
  },
  readCliArgs: false,
  readFileConfig: false,
}).catch((err) => {
  console.error(err);
});
