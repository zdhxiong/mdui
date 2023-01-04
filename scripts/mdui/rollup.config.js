import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import { visualizer } from 'rollup-plugin-visualizer';
import pkg from '../../packages/mdui/package.json';

const banner = `
/*!
 * ${pkg.name} ${pkg.version} (${pkg.homepage})
 * Copyright 2016-${new Date().getFullYear()} ${pkg.author}
 * Licensed under ${pkg.license}
 */
`.trim();

// eslint-disable-next-line import/no-default-export
export default [
  {
    input: './packages/mdui/index.js',
    plugins: [nodeResolve(), visualizer()],
    output: [
      {
        banner,
        format: 'es',
        sourcemap: true,
        file: './packages/mdui/mdui.js',
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
