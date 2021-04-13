import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const banner = `
/*!
 * mdui.jq ${pkg.version} (${pkg.homepage})
 * Copyright 2018-${new Date().getFullYear()} ${pkg.author}
 * Licensed under ${pkg.license}
 */
`.trim();

const outputOptions = {
  strict: true,
  name: 'JQ',
  banner,
};

export default {
  input: './es/index.js',
  output: [
    {
      ...outputOptions,
      format: 'es',
      sourcemap: false,
      file: './dist/jq.esm.js',
    },
    {
      ...outputOptions,
      format: 'es',
      sourcemap: true,
      file: './dist/jq.esm.min.js',
      plugins: [terser()],
    },
    {
      ...outputOptions,
      format: 'umd',
      sourcemap: false,
      file: './dist/jq.js',
    },
    {
      ...outputOptions,
      format: 'umd',
      sourcemap: true,
      file: './dist/jq.min.js',
      plugins: [terser()],
    },
  ],
};
