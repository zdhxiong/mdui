module.exports = function (grunt) {

  'use strict';

  /**
   * 转驼峰法
   * @param string
   * @returns {string|void|XML}
   */
  var toCamelCase = function (string) {
    return string.toLowerCase().replace(/-(.)/g, function (match, group1) {
      return group1.toUpperCase();
    });
  };

  /**
   * 主色调的颜色名
   * @type {string[]}
   */
  var primaryColors = [
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
  ];

  /**
   * 强调色的颜色名
   * @type {string[]}
   */
  var accentColors = [
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
  ];

  var tasks = {};

  /**
   * Less
   */
  tasks.less = (function () {

    // 核心文件
    var lessTask = {
      core: {
        src: 'src/mdui.less',
        dest: 'dist/css/<%= pkg.name %>.css'
      }
    };

    // 主色
    for (var i = 0; i < primaryColors.length; i++) {
      lessTask[toCamelCase('primary-' + primaryColors[i])] = {
        options: {
          modifyVars: {
            colorName: primaryColors[i]
          }
        },
        src: 'src/color-primary.less',
        dest: 'dist/css/color-primary/<%= pkg.name %>-primary-' + primaryColors[i] + '.css'
      }
    }

    // 强调色
    for (var i = 0; i < accentColors.length; i++) {
      lessTask[toCamelCase('accent-' + accentColors[i])] = {
        options: {
          modifyVars: {
            colorName: accentColors[i]
          }
        },
        src: 'src/color-accent.less',
        dest: 'dist/css/color-accent/<%= pkg.name %>-accent-' + accentColors[i] + '.css'
      }
    }

    // 深色主题
    lessTask.dark = {
      src: 'src/layout-dark.less',
      dest: 'dist/css/<%= pkg.name %>-dark.css'
    };

    return lessTask;

  })();

  /**
   * csslint
   */
  tasks.csslint = {
    options: {
      csslintrc: '.csslintrc'
    },
    dist: [
      '<%= less.core.dest %>'
    ]
  };

  /**
   * autoprefixer
   */
  tasks.autoprefixer = {
    options: {
      browsers: [
        'last 2 versions',
        '> 1%',
        'Chrome >= 30',
        'Firefox >= 30',
        'ie >= 10',
        'Safari >= 8'
      ]
    },
    mdui: {
      src: ['dist/css/<%= pkg.name %>.css']
    }
  };

  /**
   * csscomb
   */
  tasks.csscomb = {
    options: {
      config: '.csscomb.json'
    },
    dist: {
      files: {
        '<%= less.core.dest %>': ['<%= less.core.dest %>']
      }
    }
  };

  /**
   * cssmin
   */
  tasks.cssmin = {
    minifyCore: {
      files: [
        {
          expand: true,
          cwd: 'dist/css',
          src: ['*.css', '**/*.css', '!*.min.css'],
          dest: 'dist/css',
          ext: '.min.css'
        }
      ]
    }
  };

  /**
   * jshint
   */
  tasks.jshint = {
    options: {
      jshintrc: '.jshintrc'
    },
    core: {
      src: ['dist/js/<%= pkg.name %>.js', 'dist/js/<%= pkg.name %>.jquery.js']
    }
  };

  /**
   * jscs
   */
  tasks.jscs = {
    options: {
      config: '.jscsrc'
    },
    core: {
      src: 'src/**/*.js'
    }
  };

  /**
   * concat
   */
  tasks.concat = {

    mdui: {
      options: {
        banner: '<%= banner %>\n',

        // 文件添加缩进
        process: function (src, filepath) {
          var addIndent = '  ';
          var newFileContent = '';

          if (
            filepath === 'src/global/js/wrap_start.js' ||
            filepath === 'src/global/js/wrap_end.js'
          ) {
            return src;
          }

          var fileLines = src.split('\n');
          for (var i = 0; i < fileLines.length; i++) {
            var lineFeed = (i === fileLines.length ? '' : '\n');
            if (fileLines[i].replace(' ', '') === '') {
              newFileContent += lineFeed;
            } else {
              newFileContent += addIndent + fileLines[i] + lineFeed;
            }
          }

          return newFileContent;
        }
      },

      src: [
        'src/global/js/wrap_start.js',
        // GLOBAL
        'src/global/js/dom.js',
        'src/global/js/support.js',
        'src/color/js/color.js',
        'src/global/js/global.js',
        // PLUGINS
        'src/ripple/js/ripple.js',
        'src/textfield/js/textfield.js',
        'src/fab/js/fab.js',
        'src/fab/js/fab.data.js',
        'src/drawer/js/drawer.js',
        'src/drawer/js/drawer.data.js',
        'src/dialog/js/dialog.js',
        'src/dialog/js/dialog.data.js',
        'src/dialog/js/dialog.dialog.js',
        'src/dialog/js/dialog.alert.js',
        'src/dialog/js/dialog.confirm.js',
        'src/dialog/js/dialog.prompt.js',
        'src/tooltip/js/tooltip.js',
        'src/tooltip/js/tooltip.data.js',
        'src/snackbar/js/snackbar.js',

        'src/global/js/wrap_end.js'
      ],
      dest: 'dist/js/<%= pkg.name %>.js'
    },

    mduiJquery: {
      src: [
        'dist/js/<%= pkg.name %>.js',

        'src/fab/js/fab.jquery.js',
        'src/drawer/js/drawer.jquery.js',
        'src/dialog/js/dialog.jquery.js'
      ],
      dest: 'dist/js/<%= pkg.name %>.jquery.js'
    },

    cssAll: {
      src: [
        'dist/css/<%= pkg.name %>.css',
        'dist/css/color-primary/*.css',
        'dist/css/color-accent/*.css',
        'dist/css/<%= pkg.name %>-dark.css'
      ],
      dest: 'dist/css/<%= pkg.name %>-all.css'
    }
  };

  /**
   * uglify
   */
  tasks.uglify = {
    options: {
      compress: {
        warnings: false
      },
      mangle: true,
      preserveComments: /^!|@preserve|@license|@cc_on/i
    },
    mdui: {
      src: '<%= concat.mdui.dest %>',
      dest: 'dist/js/<%= pkg.name %>.min.js'
    },
    mduiJquery: {
      src: '<%= concat.mduiJquery.dest %>',
      dest: 'dist/js/<%= pkg.name %>.jquery.min.js'
    }
  };

  /**
   * clean
   */
  tasks.clean = {
    css: ['dist/css'],
    js: ['dist/js']
  };

  /**
   * watch
   */
  tasks.watch = {
    css: {
      files: [
        'src/**/*.less'
      ],
      tasks: ['clean:css', 'less', 'autoprefixer', 'csscomb', 'concat:cssAll', 'csslint']
    },
    scripts: {
      files: [
        'src/**/*.js'
      ],
      tasks: ['clean:js', 'concat:mdui', 'concat:mduiJquery']
    }
  };

  /**
   * 初始化
   */
  grunt.initConfig({

    // Metadata
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' +
            ' * mdui v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
            ' * Copyright 2016-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' * Licensed under <%= pkg.license %>\n' +
            ' */\n',

    less          : tasks.less,         // Less 编译
    csslint       : tasks.csslint,      // CSS 代码检查
    autoprefixer  : tasks.autoprefixer, // CSS 自动加前缀
    csscomb       : tasks.csscomb,      // CSS 属性排序
    cssmin        : tasks.cssmin,       // CSS 压缩
    jshint        : tasks.jshint,       // JavaScript 语法检查
    jscs          : tasks.jscs,         // JavaScript 代码风格检查
    concat        : tasks.concat,       // JavaScript 文件合并
    uglify        : tasks.uglify,       // JavaScript 代码压缩
    clean         : tasks.clean,        // 删除文件
    watch         : tasks.watch         // 监视器

  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-csscomb');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // 输出当前版本
  grunt.registerTask('version', '输出当前版本', function () {
    grunt.log.writeln('当前版本为: ' + grunt.config.get('pkg').version);
  });

  // 构建 JavaScript 文件
  grunt.registerTask('build-js', '构建 JavaScript 文件', ['clean:js', 'jscs', 'concat:mdui', 'concat:mduiJquery', 'uglify', 'jshint']);

  // 构建 CSS 文件
  grunt.registerTask('build-css', '构建 CSS 文件', ['clean:css', 'less', 'autoprefixer', 'csscomb', 'concat:cssAll', 'cssmin', 'csslint']);

  // 构建所有文件
  grunt.registerTask('build', '构建所有文件', ['build-css', 'build-js']);
};
