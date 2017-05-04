/**
 * gulp clean-css         删除 dist/css 目录下的文件
 * gulp clean-js          删除 dist/js 目录下的文件
 * gulp clean-custom      删除 custom 目录下的文件
 * gulp version           输出当前版本号
 * gulp build-css         打包 CSS 文件
 * gulp build-js          打包 JS 文件
 * gulp build             打包所有文件
 * gulp test-js-gulpfile  检查 gulpfile.js 文件的代码规范
 * gulp custom            定制打包
 * gulp build-jq          仅打包 jq 库
 * gulp test              测试
 */

;(function () {
  'use strict';

  // 引入 gulp 模块
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
  var copy = require('gulp-copy');
  var zip = require('gulp-zip');

  // 定义一些常用函数
  var $ = {

    /**
     * 是否是数组
     * @param value
     * @returns {boolean}
     */
    isArray: function (value) {
      return Object.prototype.toString.apply(value) === '[object Array]';
    },

    /**
     * 循环数组或对象
     * @param obj
     * @param callback
     */
    each: function (obj, callback) {
      var i;
      var prop;
      if (!obj) {
        return;
      }

      if ($.isArray(obj)) {
        // Array
        for (i = 0; i < obj.length; i++) {
          callback(i, obj[i]);
        }
      } else {
        // Object
        for (prop in obj) {
          if (obj.hasOwnProperty(prop)) {
            callback(prop, obj[prop]);
          }
        }
      }
    },

    /**
     * 过滤数组中的重复元素
     * @param arr
     * @returns {Array}
     */
    unique: function (arr) {
      var unique = [];
      for (var i = 0; i < arr.length; i++) {
        if (unique.indexOf(arr[i]) === -1) {
          unique.push(arr[i]);
        }
      }

      return unique;
    },

    /**
     * 过滤数组中的空元素
     * @param arr
     * @returns {Array}
     */
    cleanEmpty: function (arr) {
      var result = [];
      for (var i = 0; i < arr.length; i++) {
        if (typeof arr[i] !== 'undefined') {
          result.push(arr[i]);
        }
      }

      return result;
    },

    /**
     * 数组中是否包含指定元素
     * @param arr
     * @param needle
     * @returns {boolean}
     */
    contains: function (arr, needle) {
      return arr.indexOf(needle) > -1;
    },

  };

  // 定义各种路径
  var paths = {
    dist: {
      root: 'dist/',
      css: 'dist/css/',
      js: 'dist/js/',
      fonts: 'dist/fonts/',
      icons: 'dist/icons/',
    },
    custom: {
      root: 'custom/',
      css: 'custom/css/',
      js: 'custom/js/',
      fonts: 'custom/fonts/',
      icons: 'custom/icons/',
    },
    src: {
      root: 'src/',
    },
  };

  var mdui = {
    filename: 'mdui',
    modules: require('./modules.json'),
    pkg: require('./package.json'),
    distBanner: '/*!\n' +
            ' * <%= pkg.name %> v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
            ' * Copyright 2016-<%= date.year %> <%= pkg.author %>\n' +
            ' * Licensed under <%= pkg.license %>\n' +
            ' */\n',
    customBanner: '/*!\n' +
                  ' * <%= pkg.name %> v<%= pkg.version %> (<%= pkg.homepage %>) - Custom Build\n' +
                  ' * Copyright 2016-<%= date.year %> <%= pkg.author %>\n' +
                  ' * Licensed under <%= pkg.license %>\n' +
                  ' * \n' +
                  ' * Included modules:          <%= customModules %>\n' +
                  ' * Included primary colors:   <%= customPrimaryColors %>\n' +
                  ' * Included accent colors:    <%= customAccentColors %>\n' +
                  ' * Included color degrees:    <%= customColorDegrees %>\n' +
                  ' * Included layout:           <%= customLayoutDark %>\n' +
                  ' */\n',
    date: {
      year: new Date().getFullYear(),
      month: ('January February March April May June ' +
              'July August September October November December')
              .split(' ')[new Date().getMonth()],
      day: new Date().getDate(),
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
      'yellow',
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
      '900',
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
      'yellow',
    ],

    // 强调色饱和度
    accentColorDegrees: [
      'a100',
      'a200',
      'a400',
      'a700',
    ],

    // 布局主题
    layoutColors: [
      'dark',
    ],
  };

  mdui.moduleNames = [];      // 模块名列表
  mdui.jsFiles = [];          // 所有 JavaScript 文件列表

  // 必须的模块名
  mdui.moduleNamesRequire = ['core_intro', 'core_outro', 'jq', 'global'];

  $.each(mdui.modules, function (prop, module) {

    // 模块名列表
    if (!$.contains(mdui.moduleNamesRequire, prop)) {
      mdui.moduleNames.push(prop);
    }

    // 所有 JavaScript 文件列表
    if (typeof module.js !== 'undefined') {
      mdui.jsFiles = mdui.jsFiles.concat(module.js);
    }
  });

  // 插件的配置
  var configs = {
    autoprefixer: {
      browsers: [
        'last 2 versions',
        '> 1%',
        'Chrome >= 30',
        'Firefox >= 30',
        'ie >= 10',
        'Safari >= 8',
      ],
    },
    minifyCSS: {
      advanced: false,
      aggressiveMerging: false,
    },
    header: {
      pkg: mdui.pkg,
      date: mdui.date,
    },
  };

  // str 字符串是否以 needle 字符串结尾
  function endWith(str, needle) {
    return str.slice(-needle.length) === needle;
  }

  // JavaScript 文件添加缩进
  function addJSIndent(file, t, onlyJQ) {
    var addIndent = onlyJQ ? '' : '  ';
    var filepath = file.path.replace(/\\/g, '/');
    if (
      endWith(filepath, '/global/js/wrap_start.js') ||
      endWith(filepath, '/global/js/wrap_end.js')
    ) {
      addIndent = '';
    } else if (
      endWith(filepath, '/jq/js/function.js') ||
      endWith(filepath, '/jq/js/ajax.js') ||
      endWith(filepath, '/jq/js/core.js') ||
      endWith(filepath, '/jq/js/data.js') ||
      endWith(filepath, '/jq/js/event.js') ||
      endWith(filepath, '/jq/js/queue.js')
    ) {
      addIndent = onlyJQ ? '  ' : '    ';
    }

    if (addIndent !== '') {
      var fileLines = fs.readFileSync(file.path).toString().split('\n');
      var newFileContents = '';
      $.each(fileLines, function (i, fileLine) {
        newFileContents +=
          (fileLine ? addIndent : '') +
          fileLine +
          (i === fileLines.length ? '' : '\n');
      });

      file.contents = new Buffer(newFileContents);
    }
  }

  // 删除 dist 目录下的 CSS 文件
  gulp.task('clean-css', function (cb) {
    return del([paths.dist.css + '**/*'], cb);
  });

  // 删除 dist 目录下的 JavaScript 文件
  gulp.task('clean-js', function (cb) {
    return del([paths.dist.js + '**/*'], cb);
  });

  // 删除 custom 目录下的文件
  gulp.task('clean-custom', function (cb) {
    return del([paths.custom.root + '**/*'], cb);
  });

  /**
   * ===========================================================================
   * ************   tasks   ************
   * ===========================================================================
   */

  /**
   * 输出当前版本号
   */
  gulp.task('version', function () {
    console.log(mdui.pkg.version);
  });

  /**
   * 构建 CSS 文件
   */
  gulp.task('build-css', ['clean-css'], function (cb) {

    gulp.src(paths.src.root + mdui.filename + '.less')
      .pipe(less({
        modifyVars: {
          globalPrimaryColors: mdui.primaryColors,
          globalPrimaryColorDegrees: mdui.primaryColorDegrees,
          globalAccentColors: mdui.accentColors,
          globalAccentColorDegrees: mdui.accentColorDegrees,
          globalLayoutDark: true,
        },
      }))
      .pipe(header(mdui.distBanner, configs.header))
      .pipe(autoprefixer(configs.autoprefixer))
      .pipe(csscomb())
      .pipe(csslint())
      .pipe(csslint.formatter())
      .pipe(gulp.dest(paths.dist.css))

      .pipe(minifyCSS(configs.minifyCSS))
      .pipe(rename(function (path) {
        path.basename = mdui.filename + '.min';
      }))
      .pipe(gulp.dest(paths.dist.css))
      .on('end', function () {
        cb();
      });
  });

  /**
   * 构建 JavaScript 文件
   */
  gulp.task('build-js', ['clean-js'], function (cb) {
    gulp.src(mdui.jsFiles)
      .pipe(jscs())
      .pipe(jscs.reporter())
      .pipe(tap(function (file, t) {
        addJSIndent(file, t);
      }))
      .pipe(concat(mdui.filename + '.js'))
      .pipe(header(mdui.distBanner, configs.header))
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(gulp.dest(paths.dist.js))

      .pipe(uglify())
      .pipe(header(mdui.distBanner, configs.header))
      .pipe(rename(function (path) {
        path.basename = mdui.filename + '.min';
      }))
      .pipe(gulp.dest(paths.dist.js))
      .on('end', function () {
        cb();
      });
  });

  // 检查 gulpfile 的代码规范
  gulp.task('test-js-gulpfile', function (cb) {
    gulp.src('gulpfile.js')
      .pipe(jscs())
      .pipe(jscs.reporter())
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .on('end', function () {
        cb();
      });
  });

  // 构建所有文件，并压缩成 zip 文件
  gulp.task('build', ['build-css', 'build-js'], function (cb) {
    gulp.src('dist/**/*')
      .pipe(zip('mdui-v' + mdui.pkg.version + '.zip'))
      .pipe(gulp.dest('./'))
      .on('end', function () {
        cb();
      });
  });

  // 测试
  gulp.task('test', ['build']);

  // 监视文件
  gulp.task('watch', function () {
    gulp.watch(paths.src.root + '**/*.less', ['build-css']);
    gulp.watch(paths.src.root + '**/*.js', ['build-js']);
  });

  /**
   * 自定义打包，当某一个参数不传或参数为空时，则打包所有模块
   * gulp custom
   * -modules:material-icons,roboto
   * -primary-colors:red,blue,indigo
   * -accent-colors:blue,pink
   * -color-degrees:500,600,700,a200,a400
   * -layout-dark
   */
  gulp.task('custom', ['clean-custom'], function () {
    // 模块名列表
    var customModules = [];

    // 主色名列表
    var customPrimaryColors = [];

    // 强调色名列表
    var customAccentColors = [];

    // 颜色饱和度列表
    var customColorDegrees = [];

    // 主色颜色饱和度列表
    var customPrimaryColorDegrees = [];

    // 强调色颜色饱和度列表
    var customAccentColorDegrees = [];

    // 是否包含深色布局主题
    var customLayoutDark = false;

    // 参数处理
    var argsDeal = function (arg) {
      arg = arg.replace(/ /g, '').replace(/,,/g, ',');

      if (arg.indexOf('-modules') === 0) {
        customModules = arg.substring(9).split(',');
      } else if (arg.indexOf('-primary-colors') === 0) {
        customPrimaryColors = arg.substring(16).split(',');
      } else if (arg.indexOf('-accent-colors') === 0) {
        customAccentColors = arg.substring(15).split(',');
      } else if (arg.indexOf('-color-degrees') === 0) {
        customColorDegrees = arg.substring(15).split(',');
      } else if (arg.indexOf('-layout-dark') === 0) {
        customLayoutDark = true;
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
    $.each(customModules, function (i, customModule) {
      if (!$.contains(mdui.moduleNames, customModule)) {
        delete customModules[i];
      }
    });

    customModules = $.unique($.cleanEmpty(customModules));
    if (customModules.length === 0) {
      customModules = mdui.moduleNames;
    }

    // 添加依赖的模块
    $.each(mdui.modules, function (prop, module) {
      if (
        $.contains(customModules, prop) &&
        typeof module.dependencies !== 'undefined' &&
        module.dependencies.length > 0
      ) {
        $.each(module.dependencies, function (j, dependencie) {
          if (!$.contains(customModules, dependencie)) {
            customModules.push(dependencie);
          }
        });
      }
    });

    // 过滤无效的主色名，为空时填充所有主色名
    $.each(customPrimaryColors, function (i, customPrimaryColor) {
      if (!$.contains(mdui.primaryColors, customPrimaryColor)) {
        delete customPrimaryColors[i];
      }
    });

    customPrimaryColors = $.unique($.cleanEmpty(customPrimaryColors));
    if (customPrimaryColors.length === 0) {
      customPrimaryColors = mdui.primaryColors;
    }

    // 过滤无效的强调色名，为空时填充所有强调色
    $.each(customAccentColors, function (i, customAccentColor) {
      if (!$.contains(mdui.accentColors, customAccentColor)) {
        delete customAccentColors[i];
      }
    });

    customAccentColors = $.unique($.cleanEmpty(customAccentColors));
    if (customAccentColors.length === 0) {
      customAccentColors = mdui.accentColors;
    }

    // 过滤无效的饱和度名，为空时填充所有饱和度
    $.each(customColorDegrees, function (i, customColorDegree) {
      if (
        !$.contains(mdui.primaryColorDegrees, customColorDegree) &&
        !$.contains(mdui.accentColorDegrees, customColorDegree)
      ) {
        delete customColorDegrees[i];
      }
    });

    customColorDegrees = $.unique($.cleanEmpty(customColorDegrees));
    if (customColorDegrees.length === 0) {
      customColorDegrees = mdui.primaryColorDegrees.concat(mdui.accentColorDegrees);
    }

    // 主色饱和度 和 强调色饱和度
    $.each(customColorDegrees, function (i, customColorDegree) {
      if ($.contains(mdui.primaryColorDegrees, customColorDegree)) {
        customPrimaryColorDegrees.push(customColorDegree);
      } else if ($.contains(mdui.accentColorDegrees, customColorDegree)) {
        customAccentColorDegrees.push(customColorDegree);
      }
    });

    var moduleJs = [];
    var moduleLess = [];

    $.each(mdui.modules, function (prop, module) {

      if ($.contains(customModules, prop) || mdui.moduleNamesRequire.indexOf(prop) > -1) {
        if (typeof module.js !== 'undefined') {
          moduleJs = moduleJs.concat(module.js);
        }

        if (typeof module.less !== 'undefined') {
          moduleLess = moduleLess.concat(module.less);
        }
      }

    });

    var customBannerOptions = function () {
      return {
        pkg: mdui.pkg,
        date: mdui.date,
        customModules: customModules.join(','),
        customPrimaryColors: customPrimaryColors.join(','),
        customAccentColors: customAccentColors.join(','),
        customColorDegrees: customColorDegrees.join(','),
        customLayoutDark: customLayoutDark ? 'dark' : '',
      };
    };

    // 构建 JavaScript 文件
    gulp.src(moduleJs)
      .pipe(jscs())
      .pipe(jscs.reporter())
      .pipe(tap(function (file, t) {
        addJSIndent(file, t, false);
      }))
      .pipe(concat(mdui.filename + '.custom.js'))
      .pipe(header(mdui.customBanner, customBannerOptions()))
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(gulp.dest(paths.custom.js))

      .pipe(uglify())
      .pipe(header(mdui.customBanner, customBannerOptions()))
      .pipe(rename(function (path) {
        path.basename = mdui.filename + '.custom.min';
      }))
      .pipe(gulp.dest(paths.custom.js));

    // 构建 CSS 文件
    gulp.src(moduleLess)
      .pipe(concat(mdui.filename + '.custom.less'))
      .pipe(less({
        paths: [path.join(__dirname, 'less', 'includes')],
        modifyVars: {
          globalPrimaryColors: customPrimaryColors,
          globalPrimaryColorDegrees: customPrimaryColorDegrees,
          globalAccentColors: customAccentColors,
          globalAccentColorDegrees: customAccentColorDegrees,
          globalLayoutDark: customLayoutDark,
        },
      }))
      .pipe(header(mdui.customBanner, customBannerOptions()))
      .pipe(autoprefixer(configs.autoprefixer))
      .pipe(csscomb())
      .pipe(csslint())
      .pipe(csslint.formatter())
      .pipe(gulp.dest(paths.custom.css))

      .pipe(minifyCSS(configs.minifyCSS))
      .pipe(rename(function (path) {
        path.basename = mdui.filename + '.custom.min';
      }))
      .pipe(gulp.dest(paths.custom.css));

    // 复制 fonts、icons 目录
    if ($.contains(customModules, 'roboto')) {
      gulp.src(paths.dist.fonts + 'roboto/**/*')
        .pipe(copy(paths.custom.root, {
          prefix: 1,
        }));
    }

    if ($.contains(customModules, 'material-icons')) {
      gulp.src(paths.dist.icons + 'material-icons/**/*')
        .pipe(copy(paths.custom.root, {
          prefix: 1,
        }));
    }

  });

  /**
   * 打包生成 jq.js
   */
  gulp.task('build-jq', function (cb) {
    gulp.src(mdui.modules.jq.js)
      .pipe(jscs())
      .pipe(jscs.reporter())
      .pipe(tap(function (file, t) {
        addJSIndent(file, t, true);
      }))
      .pipe(concat('jq.js'))
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(gulp.dest(paths.dist.js))

      .pipe(uglify())
      .pipe(rename(function (path) {
        path.basename = 'jq.min';
      }))
      .pipe(gulp.dest(paths.dist.js))
      .on('end', function () {
        cb();
      })
  });

})();
