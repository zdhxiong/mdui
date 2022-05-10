import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import pkg from '../../packages/components/package.json';

const banner = `
/*!
 * mdui ${pkg.version} (${pkg.homepage})
 * Copyright 2016-${new Date().getFullYear()} ${pkg.author}
 * Licensed under ${pkg.license}
 */
`.trim();

// eslint-disable-next-line import/no-default-export
export default [
  {
    input: './packages/components/index.js',
    plugins: [nodeResolve()],
    output: [
      {
        banner,
        format: 'es',
        sourcemap: false,
        file: './packages/components/mdui.js',
      },
      {
        banner,
        format: 'es',
        sourcemap: true,
        file: './packages/components/mdui.min.js',
        plugins: [
          terser({
            format: {
              comments: /zdhxiong/,
            },
          }),
        ],
      },
    ],
  },
];
