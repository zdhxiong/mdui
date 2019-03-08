const gulp = require('gulp');
const rollup = require('gulp-better-rollup');
const header = require('gulp-header');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const buble = require('rollup-plugin-buble');
const { eslint } = require('rollup-plugin-eslint');
const resolve = require('rollup-plugin-node-resolve');
const pkg = require('./package.json');

const banner = `
/**
 * JQ ${pkg.version} (${pkg.homepage})
 * Copyright 2018-${new Date().getFullYear()} ${pkg.author}
 * Licensed under ${pkg.license}
 */
`.trim();

function compile(cb) {
  gulp.src('./src/index.js')
    .pipe(rollup({
      plugins: [resolve(), eslint(), buble()],
    }, {
      name: 'JQ',
      format: 'umd',
      file: 'jq.js',
      banner,
    }))
    .pipe(gulp.dest('./dist/'))
    .on('end', cb);
}

function compress(cb) {
  gulp.src('./dist/jq.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(header(banner))
    .pipe(rename('jq.min.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/'))
    .on('end', cb);
}

gulp.task('build', gulp.series(compile, compress));
