import fs from 'node:fs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import { visualizer } from 'rollup-plugin-visualizer';

const pkg = JSON.parse(
  fs.readFileSync('./packages/mdui/package.json', 'utf-8'),
);

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
    input: './packages/mdui/mdui.js',
    plugins: [nodeResolve(), visualizer()],
    output: [
      {
        banner,
        format: 'es',
        file: './packages/mdui/mdui.esm.js',
        plugins: [
          terser({
            format: {
              comments: /zdhxiong/,
            },
          }),
        ],
      },
      {
        name: 'mdui',
        banner,
        format: 'umd',
        file: './packages/mdui/mdui.global.js',
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
