const { src, dest, parallel } = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const header = require('gulp-header');
const less = require('gulp-less');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const pkg = require('./package.json');

const banner = `
/*!
 * mdui ${pkg.version} (${pkg.homepage})
 * Copyright 2016-${new Date().getFullYear()} ${pkg.author}
 * Licensed under ${pkg.license}
 */
`.trim();

function css() {
  return src('./src/index.less')
  .pipe(sourcemaps.init())
  .pipe(less())
  .pipe(header(banner))
  .pipe(autoprefixer())
  .pipe(rename('mdui.css'))
  .pipe(sourcemaps.write('./'))
  .pipe(dest('./dist/css'));
}

function cssMin() {
  return src('./src/index.less')
  .pipe(sourcemaps.init())
  .pipe(less())
  .pipe(header(banner))
  .pipe(autoprefixer())
  .pipe(cleanCSS({ compatibility: 'ie11' }))
  .pipe(rename('mdui.min.css'))
  .pipe(sourcemaps.write('./'))
  .pipe(dest('./dist/css'));
}

exports.default = parallel(css, cssMin);
