const rollup = require('rollup');
const { eslint } = require('rollup-plugin-eslint');
const { uglify } = require('rollup-plugin-uglify');
const buble = require('rollup-plugin-buble');
const typescript = require('rollup-plugin-typescript');
const polyfill = require('rollup-plugin-polyfill');
const tsconfig = require('./src/tsconfig.json');
const pkg = require('./package.json');

const banner = `
/*!
 * mdui.jq ${pkg.version} (${pkg.homepage})
 * Copyright 2018-${new Date().getFullYear()} ${pkg.author}
 * Licensed under ${pkg.license}
 */
`.trim();

const input = './src/index.ts';

const plugins = [
  eslint({
    fix: true,
  }),
  typescript(tsconfig.compilerOptions),
];

const outputOptions = {
  strict: true,
  name: 'JQ',
  banner,
};

// 编译成 ES6 模块化文件
async function buildEsm() {
  const bundle = await rollup.rollup({ input, plugins });

  await bundle.write(Object.assign({}, outputOptions, {
    format: 'es',
    file: './dist/jq.esm.js',
  }));
}

// 编译成 umd 文件
async function buildUmd() {
  plugins.push(
    buble(),
    polyfill([
      'mdn-polyfills/MouseEvent',
      'mdn-polyfills/CustomEvent',
      'promise-polyfill/src/polyfill',
    ]),
  );

  const bundle = await rollup.rollup({ input, plugins });

  await bundle.write(Object.assign({}, outputOptions, {
    format: 'umd',
    file: './dist/jq.js',
  }));
}

// 编译成 umd 文件，并压缩
async function buildUmdUglify() {
  plugins.push(
    uglify({
      output: {
        preamble: banner,
      }
    })
  );

  const bundle = await rollup.rollup({ input, plugins });

  await bundle.write(Object.assign({}, outputOptions, {
    sourcemap: true,
    format: 'umd',
    file: './dist/jq.min.js',
  }));
}

async function build() {
  await buildEsm();
  await buildUmd();
  await buildUmdUglify();
}

build();
