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
  var path = require('path');

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
    layoutColors: [
      'dark'
    ]
  };

  // 模块名列表
  mdui.moduleNames = [];

  // 所有 JavaScript 文件列表
  mdui.jsFiles = [];

  // jQuery 版的所有 JavaScript 文件列表
  mdui.jsJQueryFiles = [];

  for (var prop in mdui.modules) {
    if (mdui.modules.hasOwnProperty(prop)) {
      var module = mdui.modules[prop];

      // 模块名列表，modules.json 文件中除了 core_intro 和 core_outro 之外，其他都是模块名
      if (prop !== 'core_intro' && prop !== 'core_outro') {
        mdui.moduleNames.push(prop);
      }

      // 所有 JavaScript 文件列表
      if (typeof module.js !== 'undefined') {
        mdui.jsFiles = mdui.jsFiles.concat(module.js);
      }

      // jQuery 版的所有 JavaScript 文件列表
      if (typeof module.jquery !== 'undefined') {
        mdui.jsJQueryFiles = mdui.jsJQueryFiles.concat(module.jquery);
      }
    }
  }
  mdui.jsJQueryFiles = mdui.jsFiles.concat(mdui.jsJQueryFiles);

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
  function addJSIndent(file, t) {
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

    gulp.src(paths.src.root + mdui.filename + '.less')
      .pipe(less({
        globalVars:{
          globalPrimaryColors: mdui.primaryColors,
          globalPrimaryColorDegrees: mdui.primaryColorDegrees,
          globalAccentColors: mdui.accentColors,
          globalAccentColorDegrees: mdui.accentColorDegrees,
          globalLayouts: mdui.layoutColors
        }
      }))
      .pipe(header(mdui.banner, configs.header))
      .pipe(autoprefixer(configs.autoprefixer))
      .pipe(csscomb())
      .pipe(csslint())
      .pipe(gulp.dest(paths.dist.css))

      .pipe(minifyCSS(configs.minifyCSS))
      .pipe(rename(function (path) {
        path.basename = mdui.filename + '.min';
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
      .pipe(concat(mdui.filename + '.js'))
      .pipe(header(mdui.banner, configs.header))
      .pipe(jshint())
      .pipe(gulp.dest(paths.dist.js))

      .pipe(uglify())
      .pipe(header(mdui.banner, configs.header))
      .pipe(rename(function (path) {
        path.basename = mdui.filename + '.min';
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
      .pipe(concat(mdui.filename + '.jquery.js'))
      .pipe(header(mdui.banner, configs.header))
      .pipe(jshint())
      .pipe(gulp.dest(paths.dist.js))

      .pipe(uglify())
      .pipe(header(mdui.banner, configs.header))
      .pipe(rename(function (path) {
        path.basename = mdui.filename + '.jquery.min';
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

  // 自定义打包，当某一个参数不传或参数为空时，则打包所有模块
  // gulp custom -modules:material-icons,roboto -primary-colors:red,blue,indigo -accent-colors:blue,pink -color-degrees:500,600,700,a200,a400 -layout-colors:dark
  gulp.task('custom', function () {
    // 模块名列表
    var modules = [];
    // 主色名列表
    var primaryColors = [];
    // 强调色名列表
    var accentColors = [];
    // 颜色饱和度列表
    var colorDegrees = [];
    // 主色颜色饱和度列表
    var primaryColorDegrees = [];
    // 强调色颜色饱和度列表
    var accentColorDegrees = [];
    // 布局颜色列表
    var layoutColors = [];

    // 参数处理
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
        arg = arg.substring(15);
        colorDegrees = arg.split(',');
      }
      else if (arg.indexOf('-layout-colors') === 0) {
        arg = arg.substring(15);
        layoutColors = arg.split(',');
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
    if (args.length >= 8) {
      argsDeal(args[7]);
    }

    // 过滤无效的模块名，为空时自动填充全部模块名
    for (var i = 0; i < modules.length; i++) {
      if (mdui.moduleNames.indexOf(modules[i]) === -1) {
        delete modules[i];
      }
    }
    if (modules.length === 0) {
      modules = mdui.moduleNames;
    }
    // 添加依赖的模块
    for (var prop in mdui.modules) {
      if (mdui.modules.hasOwnProperty(prop)) {
        var module = mdui.modules[prop];

        if (modules.indexOf(prop) > -1 && typeof module.dependencies !== 'undefined' && module.dependencies.length > 0) {
          for (var i = 0; i < module.dependencies.length; i++) {
            if (modules.indexOf(module.dependencies[i]) < 0) {
              modules.push(module.dependencies[i]);
            }
          }
        }
      }
    }

    // 过滤无效的主色名，为空时填充所有主色名
    for (var i = 0; i < primaryColors.length; i++) {
      if (mdui.primaryColors.indexOf(primaryColors[i]) === -1) {
        delete primaryColors[i];
      }
    }
    if (primaryColors.length === 0) {
      primaryColors = mdui.primaryColors;
    }

    // 过滤无效的强调色名，为空时填充所有强调色
    for (var i = 0; i < accentColors.length; i++) {
      if (mdui.accentColors.indexOf(accentColors[i]) === -1) {
        delete accentColors[i];
      }
    }
    if (accentColors.length === 0) {
      accentColors = mdui.accentColors;
    }

    // 过滤无效的饱和度名，为空时填充所有饱和度
    for (var i = 0; i < colorDegrees.length; i++) {
      if (mdui.primaryColorDegrees.indexOf(colorDegrees[i]) === -1 && mdui.accentColorDegrees.indexOf(colorDegrees[i]) === -1) {
        delete colorDegrees[i];
      }
    }
    if (colorDegrees.length === 0) {
      colorDegrees = mdui.primaryColorDegrees.concat(mdui.accentColorDegrees);
    }
    // 主色饱和度和强调色饱和度
    for (var i = 0; i < colorDegrees.length; i++) {
      if (mdui.primaryColorDegrees.indexOf(colorDegrees[i]) > -1) {
        primaryColorDegrees.push(colorDegrees[i]);
      } else if (mdui.accentColorDegrees.indexOf(colorDegrees[i]) > -1) {
        accentColorDegrees.push(colorDegrees[i]);
      }
    }

    // 过滤无效的布局颜色，为空时填充所有布局颜色
    for (var i = 0; i < layoutColors.length; i++) {
      if (mdui.layoutColors.indexOf(layoutColors[i]) === -1) {
        delete layoutColors[i];
      }
    }
    if (layoutColors.length === 0) {
      layoutColors = mdui.layoutColors;
    }

    var moduleJs = [];
    var moduleJQuery = [];
    var moduleLess = [];

    for (var prop in mdui.modules) {
      if (mdui.modules.hasOwnProperty(prop)) {
        var module = mdui.modules[prop];

        if (modules.indexOf(prop) > -1 || prop === 'core_intro' || prop === 'core_outro') {
          if (typeof module.js !== 'undefined') {
            moduleJs = moduleJs.concat(module.js);
          }
          if (typeof module.jquery !== 'undefined') {
            moduleJQuery = moduleJQuery.concat(module.jquery);
          }
          if (typeof module.less !== 'undefined') {
            moduleLess = moduleLess.concat(module.less);
          }
        }
      }
    }
    moduleJQuery = moduleJs.concat(moduleJQuery);


    // 构建原生 JavaScript 文件
    gulp.src(moduleJs)
      .pipe(tap(function (file, t) {
        addJSIndent(file, t);
      }))
      .pipe(jscs())
      .pipe(concat(mdui.filename + '.custom.js'))
      .pipe(header(mdui.banner, configs.header))
      .pipe(jshint())
      .pipe(gulp.dest(paths.custom.js))

      .pipe(uglify())
      .pipe(header(mdui.banner, configs.header))
      .pipe(rename(function (path) {
        path.basename = mdui.filename + '.custom.min';
      }))
      .pipe(gulp.dest(paths.custom.js));

    // 构建 jQuery 版 JavaScript 文件
    gulp.src(moduleJQuery)
      .pipe(tap(function (file, t) {
        addJSIndent(file, t);
      }))
      .pipe(jscs())
      .pipe(concat(mdui.filename + '.jquery.custom.js'))
      .pipe(header(mdui.banner, configs.header))
      .pipe(jshint())
      .pipe(gulp.dest(paths.custom.js))

      .pipe(uglify())
      .pipe(header(mdui.banner, configs.header))
      .pipe(rename(function (path) {
        path.basename = mdui.filename + '.jquery.custom.min';
      }))
      .pipe(gulp.dest(paths.custom.js));

    // 构建 CSS 文件
    gulp.src(moduleLess)
      .pipe(concat(mdui.filename + '.custom.less'))
      .pipe(less({
        globalVars: {
          globalPrimaryColors: primaryColors,
          globalPrimaryColorDegrees: primaryColorDegrees,
          globalAccentColors: accentColors,
          globalAccentColorDegrees: accentColorDegrees,
          globalLayouts: mdui.layoutColors
        }
      }))
      .pipe(header(mdui.banner, configs.header))
      .pipe(autoprefixer(configs.autoprefixer))
      .pipe(csscomb())
      .pipe(csslint())
      .pipe(gulp.dest(paths.custom.css))

      .pipe(minifyCSS(configs.minifyCSS))
      .pipe(rename(function (path) {
        path.basename = mdui.filename + '.custom.min';
      }))
      .pipe(gulp.dest(paths.custom.css));
  });

})();

