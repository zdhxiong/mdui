(function () {
  'use strict';

  var gulp = require('gulp');
  var autoprefixer = require('gulp-autoprefixer');
  var concat = require('gulp-concat');
  var csscomb = require('gulp-csscomb');
  var csslint = require('gulp-csslint');
  var jscs = require('gulp-jscs');
  var jshint = require('gulp-jshint');
  var less = require('gulp-less');
  var minifyCSS = require('gulp-minify-css');
  var uglify = require('gulp-uglify');

  // 定义各种路径
  var paths = {
    dist: {
      root: 'dist/',
      css: 'dist/css/',
      js: 'dist/js/'
    },
    custom: {
      root: 'custom/',
      css: 'custom/css/',
      js: 'custom/js/'
    },
    src: {
      root: 'src/'
    }
  };

  var mdui = {
    filename: 'mdui',
    modules: require('./modules.json'),
    pkg: require('./package.json'),
    banner: '/*!\n' +
            ' * <%= pkg.name %> v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
            ' * Copyright 2016-<%= date.year %> <%= pkg.author %>\n' +
            ' * Licensed under <%= pkg.license %>\n' +
            ' */\n',
    customBanner: '/*!\n' +
                  ' * <%= pkg.name %> v<%= pkg.version %> - Custom Build' +
                  ' * Copyright 2016-<%= date.year %> <%= pkg.author %>\n' +
                  ' * Licensed under <%= pkg.license %>\n' +
                  ' * \n' +
                  ' * Included modules: <%= modulesList %>' +
                  ' * Included primary colors: <%= primaryColors %>' +
                  ' * Included accent colors: <%= accentColors %>' +
                  ' * Included color degrees: <%= colorDegrees %>' +
                  ' */\n',
    date: {
      year: new Date().getFullYear(),
      month: ('January February March April May June July August September October November December').split(' ')[new Date().getMonth()],
      day: new Date().getDate()
    }
  };

  // 输出当前版本号
  gulp.task('version', function () {
    console.log(mdui.pkg.version);
  });

  // 构建 CSS 文件
  gulp.task('build-css', function () {
    gulp.src(paths.src.root + 'mdui.less')
      .pipe(less({

      }))
      .pipe(gulp.dest(paths.dist.css));
  });

  // 构建 JavaScript 文件
  gulp.task('build-js', function () {

  });

  // 构建所有文件
  gulp.task('build', function () {

  });

  // 监视文件
  gulp.task('watch', function () {
    gulp.watch(paths.src.root)
  });

})();

