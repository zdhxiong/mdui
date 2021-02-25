import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import alias from '@rollup/plugin-alias';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import copy from 'rollup-plugin-copy';
import pkg from './package.json';

const banner = `
/*!
 * mdui ${pkg.version} (${pkg.homepage})
 * Copyright 2016-${new Date().getFullYear()} ${pkg.author}
 * Licensed under ${pkg.license}
 */
`.trim();

export default [
  {
    input: './es/index.js',
    output: {
      strict: true,
      name: 'mdui',
      banner,
      sourcemap: true,
      format: 'es',
      file: './dist/mdui.js',
    },
    plugins: [
      alias({
        entries: [{
          find: 'lit-html/lib/shady-render.js',
          replacement: 'node_modules/lit-html/lit-html.js'
        }]
      }),
      minifyHTML(),
      copy({
        targets: [
          {
            src: 'es/styles/custom_properties.css',
            dest: 'dist',
            transform: contents => banner + contents.toString()
          }
        ]
      }),
      resolve(),
      terser({
        format: {
          comments: /zdhxiong/
        }
      })
    ]
  }
]
