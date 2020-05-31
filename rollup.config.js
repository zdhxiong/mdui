import { uglify } from 'rollup-plugin-uglify';
import buble from '@rollup/plugin-buble';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import polyfill from 'rollup-plugin-polyfill';
import tsconfig from './src/tsconfig.json';
import pkg from './package.json';

delete tsconfig.compilerOptions.declaration;
delete tsconfig.compilerOptions.declarationDir;
delete tsconfig.compilerOptions.outDir;

const banner = `
/*!
 * mdui ${pkg.version} (${pkg.homepage})
 * Copyright 2016-${new Date().getFullYear()} ${pkg.author}
 * Licensed under ${pkg.license}
 */
`.trim();

export default [
  // 编译测 ES6 模块化文件
  {
    input: './src/index.ts',
    output: {
      strict: true,
      name: 'mdui',
      banner,
      sourcemap: true,
      format: 'es',
      file: './dist/js/mdui.esm.js',
    },
    plugins: [resolve(), typescript(tsconfig.compilerOptions)],
  },

  // 编译成 umd 文件
  {
    input: './src/index.ts',
    output: {
      strict: true,
      name: 'mdui',
      banner,
      sourcemap: true,
      format: 'umd',
      file: './dist/js/mdui.js',
    },
    plugins: [
      resolve(),
      typescript(tsconfig.compilerOptions),
      buble(),
      polyfill([
        'mdn-polyfills/MouseEvent',
        'mdn-polyfills/CustomEvent',
        'promise-polyfill/src/polyfill',
      ]),
    ],
  },

  // 编译成 umd 文件，并压缩
  {
    input: './src/index.ts',
    output: {
      strict: true,
      name: 'mdui',
      banner,
      sourcemap: true,
      format: 'umd',
      file: './dist/js/mdui.min.js',
    },
    plugins: [
      resolve(),
      typescript(tsconfig.compilerOptions),
      buble(),
      polyfill([
        'mdn-polyfills/MouseEvent',
        'mdn-polyfills/CustomEvent',
        'promise-polyfill/src/polyfill',
      ]),
      uglify({
        output: {
          preamble: banner,
        },
      }),
    ],
  },
];
