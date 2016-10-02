module.exports = function (grunt) {

  'use strict';

  grunt.initConfig({

    // Metadata
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' +
            ' * mdui v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
            ' * Copyright 2016-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' * Licensed under <%= pkg.license %>\n' +
            ' */\n',

    // Less 编译
    less: {
      core: {
        src: 'src/mdui.less',
        dest: 'dist/css/<%= pkg.name %>.css'
      }
    },

    // CSS 代码检查
    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      dist: [
        '<%= less.core.dest %>'
      ]
    },

    // CSS 自动加前缀
    autoprefixer: {
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
    },

    // CSS 属性排序
    csscomb: {
      options: {
        config: '.csscomb.json'
      },
      dist: {
        files: {
          '<%= less.core.dest %>': ['<%= less.core.dest %>']
        }
      }
    },

    // CSS 压缩
    cssmin: {
      minifyCore: {
        src: 'dist/css/<%= pkg.name %>.css',
        dest: 'dist/css/<%= pkg.name %>.min.css'
      }
    },

    // JavaScript 语法检查
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      core: {
        src: ['dist/js/<%= pkg.name %>.js', 'dist/js/<%= pkg.name %>.jquery.js']
      }
    },

    // JavaScript 代码风格检查
    jscs: {
      options: {
        config: '.jscsrc'
      },
      core: {
        src: 'src/**/*.js'
      }
    },

    // JavaScript 文件合并
    concat: {
      options: {
        banner: '<%= banner %>\n',

        // 文件添加缩进
        process: function (src, filepath) {
          var addIndent = '  ';
          var newFileContent = '';

          if (filepath === 'src/global/js/wrap_start.js' || filepath === 'src/global/js/wrap_end.js') {
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
      mdui: {
        src: [
          'src/global/js/wrap_start.js',

          // DOM
          'src/global/js/dom.js',

          // GLOBAL
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
      }
    },

    // JavaScript 代码压缩
    uglify: {
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
    },

    // 监视器
    watch: {
      css: {
        files: [
          'src/**/*.less'
        ],
        tasks: ['less', 'autoprefixer', 'csscomb', 'csslint']
      },
      scripts: {
        files: [
          'src/**/*.js'
        ],
        tasks: ['concat']
      }
    }
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

  // 输出当前版本
  grunt.registerTask('version', '输出当前版本', function () {
    grunt.log.writeln('当前版本为: ' + grunt.config.get('pkg').version);
  });

  // 构建 JavaScript 文件
  grunt.registerTask('build-js', '构建 JavaScript 文件', ['jscs', 'concat', 'uglify', 'jshint']);

  // 构建 CSS 文件
  grunt.registerTask('build-css', '构建 CSS 文件', ['less', 'autoprefixer', 'csscomb', 'cssmin', 'csslint']);

  // 构建所有文件
  grunt.registerTask('build', '构建所有文件', ['build-css', 'build-js']);
};
