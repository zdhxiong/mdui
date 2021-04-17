import { terser } from 'rollup-plugin-terser';
import pkg from '../../packages/jq/package.json';

const banner = `
/*!
 * ${pkg.name} ${pkg.version} (${pkg.homepage})
 * Copyright 2018-${new Date().getFullYear()} ${pkg.author}
 * Licensed under ${pkg.license}
 */
`.trim();

export default {
  input: './packages/jq/es/index.js',
  output: [
    {
      banner,
      format: 'es',
      sourcemap: false,
      file: './packages/jq/dist/jq.esm.js',
    },
    {
      banner,
      format: 'es',
      sourcemap: true,
      file: './packages/jq/dist/jq.esm.min.js',
      plugins: [terser()],
    },
  ],
};
