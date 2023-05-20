import fs from 'node:fs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const pkg = JSON.parse(fs.readFileSync('./packages/jq/package.json', 'utf-8'));

const banner = `
/*!
 * ${pkg.name} ${pkg.version} (${pkg.homepage})
 * Copyright 2018-${new Date().getFullYear()} ${pkg.author}
 * Licensed under ${pkg.license}
 */
`.trim();

// eslint-disable-next-line import/no-default-export
export default {
  input: './packages/jq/index.js',
  plugins: [nodeResolve()],
  output: [
    {
      banner,
      format: 'es',
      sourcemap: false,
      file: './packages/jq/jq.js',
    },
    {
      banner,
      format: 'es',
      sourcemap: true,
      file: './packages/jq/jq.min.js',
      plugins: [terser()],
    },
  ],
};
