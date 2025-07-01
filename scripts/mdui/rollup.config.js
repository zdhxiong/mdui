import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import { defineConfig } from 'rollup';
import { visualizer } from 'rollup-plugin-visualizer';
import pkg from '../../packages/mdui/package.json' with { type: 'json' };

const banner = `
/*!
 * ${pkg.name} ${pkg.version} (${pkg.homepage})
 * Copyright 2016-${new Date().getFullYear()} ${pkg.author}
 * Licensed under ${pkg.license}
 */
`.trim();

/**
 * 使用 rollup --config rollup.config.ts --configPlugin typescript 时报错，暂时使用 js 文件
 */
export default defineConfig({
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
});
