const rollup = require('rollup');
const { eslint } = require('rollup-plugin-eslint');
const buble = require('rollup-plugin-buble');
const typescript = require('rollup-plugin-typescript');
const serverFactory = require('spa-server');

async function test() {
  await rollup.watch({
    input: './test/index.ts',
    output: [{
      strict: true,
      name: 'JQTest',
      format: 'umd',
      file: './test/dist.js',
    }],
    plugins: [
      eslint({
        fix: true,
      }),
      typescript({
        module: "ES6",
        target: "ES6"
      }),
      buble(),
    ],
    watch: {
      include: './test/unit/**/*'
    }
  });

  const server = serverFactory.create({
    path: './',
  });

  server.start();

  console.log('打开 http://127.0.0.1:8888/test/jq.html 开始测试');
}

test();
