(function () {
  'use strict';

  var gulp = require('gulp');
  var rename = require('gulp-rename');
  var header = require('gulp-header');
  var autoprefixer = require('gulp-autoprefixer');
  var concat = require('gulp-concat');
  var csscomb = require('gulp-csscomb');
  var csslint = require('gulp-csslint');
  var jscs = require('gulp-jscs');
  var jshint = require('gulp-jshint');
  var less = require('gulp-less');
  var minifyCSS = require('gulp-minify-css');
  var uglify = require('gulp-uglify');
  var del = require('del');
  var tap = require('gulp-tap');
  var fs = require('fs');

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
    },

    // 默认模块
    defaultModules: [
      'material-icons',
      'roboto',
      'typo',
      'divider',
      'media',
      'ripple',
      'textfield',
      'button',
      'fab',
      'grid',
      'appbar',
      'card',
      'grid_list',
      'drawer',
      'dialog',
      'shadow',
      'tooltip',
      'snackbar',
      'chip'
    ],
    // 主色颜色名
    primaryColors: [
      'amber',
      'blue',
      'blue-grey',
      'brown',
      'cyan',
      'deep-orange',
      'deep-purple',
      'green',
      'grey',
      'indigo',
      'light-blue',
      'light-green',
      'lime',
      'orange',
      'pink',
      'purple',
      'red',
      'teal',
      'yellow'
    ],
    // 主色饱和度
    primaryColorDegrees: [
      '50',
      '100',
      '200',
      '300',
      '400',
      '500',
      '600',
      '700',
      '800',
      '900'
    ],
    // 强调色颜色名
    accentColors: [
      'amber',
      'blue',
      'cyan',
      'deep-orange',
      'deep-purple',
      'green',
      'indigo',
      'light-blue',
      'light-green',
      'lime',
      'orange',
      'pink',
      'purple',
      'red',
      'teal',
      'yellow'
    ],
    // 强调色饱和度
    accentColorDegrees: [
      'a100',
      'a200',
      'a400',
      'a700'
    ],
    // 布局主题
    layout: [
      'dark'
    ]
  };

  // 模块名
  mdui.moduleNames = (function () {
    var moduleNames = [];
  })();

  // JavaScript 文件列表
  mdui.jsFiles = (function () {
    var jsFiles = [];
    for (var prop in mdui.modules) {
      if (mdui.modules.hasOwnProperty(prop)) {
        var module = mdui.modules[prop];
        if (typeof module.js !== 'undefined') {
          for (var i = 0; i < module.js.length; i++) {
            jsFiles.push(module.js[i]);
          }
        }
      }
    }
    return jsFiles;
  })();

  // jQuery 版 JavaScript 文件列表
  mdui.jsJQueryFiles = (function () {
    var jsFiles = mdui.jsFiles.concat();

    for (var prop in mdui.modules) {
      if (mdui.modules.hasOwnProperty(prop)) {
        var module = mdui.modules[prop];
        if (typeof module.jquery !== 'undefined') {
          for (var i = 0; i < module.jquery.length; i++) {
            jsFiles.push(module.jquery[i]);
          }
        }
      }
    }

    return jsFiles;
  })();

  // 插件的配置
  var configs = {
    autoprefixer: {
      browsers: [
        'last 2 versions',
        '> 1%',
        'Chrome >= 30',
        'Firefox >= 30',
        'ie >= 10',
        'Safari >= 8'
      ]
    },
    minifyCSS: {
      advanced: false,
      aggressiveMerging: false
    },
    header: {
      pkg: mdui.pkg,
      date: mdui.date
    }
  };

  // JavaScript 文件添加缩进
  function addJSIndent (file, t) {
    var addIndent = '  ';
    var filename = file.path.replace(file.base, '');
    if (filename === 'wrap_start.js' || filename === 'wrap_end.js' || filename.slice(-'jquery.js'.length) === 'jquery.js') {
      addIndent = '';
    }
    if (addIndent !== '') {
      var fileLines = fs.readFileSync(file.path).toString().split('\n');
      var newFileContents = '';
      for (var i = 0; i < fileLines.length; i++) {
        newFileContents += addIndent + fileLines[i] + (i === fileLines.length ? '' : '\n');
      }
      file.contents = new Buffer(newFileContents);
    }
  }

  // 删除 CSS 文件
  gulp.task('clean-css', function (cb) {
    return del([paths.dist.css + '**/*'], cb);
  });

  // 删除 JavaScript 文件
  gulp.task('clean-js', function (cb) {
    return del([paths.dist.js + '**/*'], cb);
  });

  // 删除 CSS 和 JavaScript 文件
  gulp.task('clean', ['clean-css', 'clean-js']);

  // 输出当前版本号
  gulp.task('version', function () {
    console.log(mdui.pkg.version);
  });

  // 构建 CSS 文件
  gulp.task('build-css', ['clean-css'], function (cb) {

    gulp.src(paths.src.root + 'mdui.less')
      .pipe(less({
        globalVars:{
          globalPrimaryColors: mdui.primaryColors,
          globalPrimaryColorDegrees: mdui.primaryColorDegrees,
          globalAccentColors: mdui.accentColors,
          globalAccentColorDegrees: mdui.accentColorDegrees,
          globalLayouts: mdui.layout
        }
      }))
      .pipe(header(mdui.banner, configs.header))
      .pipe(autoprefixer(configs.autoprefixer))
      .pipe(csscomb())
      .pipe(csslint())
      .pipe(gulp.dest(paths.dist.css))

      .pipe(minifyCSS(configs.minifyCSS))
      .pipe(rename(function (path) {
        path.basename = 'mdui.min';
      }))
      .pipe(gulp.dest(paths.dist.css));
  });

  // 构建原生 JavaScript 文件
  gulp.task('build-js-native', ['clean-js'], function (cb) {
    gulp.src(mdui.jsFiles)
      .pipe(tap(function (file, t) {
        addJSIndent(file, t);
      }))
      .pipe(jscs())
      .pipe(concat('mdui.js'))
      .pipe(header(mdui.banner, configs.header))
      .pipe(jshint())
      .pipe(gulp.dest(paths.dist.js))

      .pipe(uglify())
      .pipe(header(mdui.banner, configs.header))
      .pipe(rename(function (path) {
        path.basename = 'mdui.min';
      }))
      .pipe(gulp.dest(paths.dist.js));
  });

  // 构建 jQuery 版文件
  gulp.task('build-js-jquery', ['clean-js'], function (cb) {
    gulp.src(mdui.jsJQueryFiles)
      .pipe(tap(function (file, t) {
        addJSIndent(file, t);
      }))
      .pipe(jscs())
      .pipe(concat('mdui.jquery.js'))
      .pipe(header(mdui.banner, configs.header))
      .pipe(jshint())
      .pipe(gulp.dest(paths.dist.js))

      .pipe(uglify())
      .pipe(header(mdui.banner, configs.header))
      .pipe(rename(function (path) {
        path.basename = 'mdui.jquery.min';
      }))
      .pipe(gulp.dest(paths.dist.js));
  });

  // 构建 JavaScript 文件
  gulp.task('build-js', ['build-js-native', 'build-js-jquery']);

  // 构建所有文件
  gulp.task('build', ['build-css', 'build-js']);

  // 监视文件
  gulp.task('watch', function () {
    gulp.watch(paths.src.root + '**/*.less', ['build-css']);
    gulp.watch(paths.src.root + '**/*.js', ['build-js']);
  });

  // 自定义打包
  // gulp custom -modules:material-icons,roboto -primary-colors:red,blue,indigo -accent-colors:blue,pink -color-degrees:500,600,700,a200,a400
  gulp.task('custom', function () {
    var modules = [];
    var primaryColors = [];
    var accentColors = [];
    var colorDegrees = [];

    var argsDeal = function (arg) {
      arg = arg.replace(/ /g, '').replace(/,,/g, ',');

      if (arg.indexOf('-modules') === 0) {
        arg = arg.substring(9);
        modules = arg.split(',');
      }
      else if (arg.indexOf('-primary-colors') === 0) {
        arg = arg.substring(16);
        primaryColors = arg.split(',');
      }
      else if (arg.indexOf('-accent-colors') === 0) {
        arg = arg.substring(15);
        accentColors = arg.split(',');
      }
      else if (arg.indexOf('-color-degrees') === 0) {
        arg = arg.substr(15);
        colorDegrees = arg.split(',');
      }
    };

    var args = process.argv;
    if (args.length >= 4) {
      argsDeal(args[3]);
    }
    if (args.length >= 5) {
      argsDeal(args[4]);
    }
    if (args.length >= 6) {
      argsDeal(args[5]);
    }
    if (args.length >= 7) {
      argsDeal(args[6]);
    }




  });

})();

