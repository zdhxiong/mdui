const gulp = require('gulp');
const header = require('gulp-header');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const rollup = require('rollup');
const buble = require('rollup-plugin-buble');
const { eslint } = require('rollup-plugin-eslint');
const resolve = require('rollup-plugin-node-resolve');
const polyfill = require('rollup-plugin-polyfill');
const pkg = require('./package.json');

const banner = `
/**
 * JQ ${pkg.version} (${pkg.homepage})
 * Copyright 2018-${new Date().getFullYear()} ${pkg.author}
 * Licensed under ${pkg.license}
 */
`.trim();

async function umd() {
  const bundle = await rollup.rollup({
    input: './src/index.js',
    plugins: [
      resolve(),
      eslint(),
      buble(),
      polyfill([
        'mdn-polyfills/MouseEvent',
        'mdn-polyfills/CustomEvent',
        'promise-polyfill/src/polyfill',
      ]),
    ],
  });

  await bundle.write({
    strict: true,
    name: 'JQ',
    format: 'umd',
    file: './dist/jq.js',
    banner,
  });

  await gulp.src('./dist/jq.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(header(banner))
    .pipe(rename('jq.min.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/'));
}

async function esm() {
  const bundle = await rollup.rollup({
    input: './src/index.js',
    plugins: [
      resolve(),
      eslint(),
    ],
  });

  await bundle.write({
    strict: true,
    name: 'JQ',
    format: 'es',
    file: './dist/jq.esm.js',
    banner,
  });
}

gulp.task('build', gulp.parallel(umd, esm));
