module.exports = function (grunt) {

  grunt.initConfig({

    //less 编译
    less: {
      development: {
        files: {
          "dist/css/mdui.css": "src/mdui.less"
        }
      }
    },

    //css 压缩
    cssmin: {
      target: {
        files: {
          'dist/css/mdui.min.css': ['dist/css/mdui.css']
        }
      }
    },

    //js 语法检查
    jshint: {
      options: {
        eqeqeq: true,
        trailing: true,
        ignores: [
          'src/js/jquery.2.2.4.js'
        ]
      },
      files: [
        'src/js/**/*.js'
      ]
    },

    //js 文件合并
    concat: {
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
        dest: 'dist/js/mdui.js'
      },
      mdui_jquery: {
        src: [
          'dist/js/mdui.js',

          'src/fab/js/fab.jquery.js',
          'src/drawer/js/drawer.jquery.js',
          'src/dialog/js/dialog.jquery.js'
        ],
        dest: 'dist/js/mdui.jquery.js'
      }
    },

    //美化 js
    jsbeautifier: {
      options: {
        js: {
          indentSize: 2
        }
      },
      files: [
        'dist/js/mdui.js',
        'dist/js/mdui.jquery.js'
      ]
    },

    //压缩 js
    uglify: {
      app: {
        files: {
          'dist/js/mdui.jquery.mini.js': ['dist/js/mdui.jquery.js'],
          'dist/js/mdui.min.js': ['dist/js/mdui.js']
        }
      }
    },

    //css 自动加前缀
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
      dist: {
        src: ['dist/css/mdui.css']
      }
    },

    //监视器
    watch: {
      css: {
        files: [
          'src/**/*.less'
        ],
        tasks: ['less', 'autoprefixer']
      },
      scripts: {
        files: [
          'src/**/*.js'
        ],
        tasks: ['jshint', 'concat', 'jsbeautifier']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-zip');
  grunt.loadNpmTasks("grunt-jsbeautifier");
  grunt.loadNpmTasks("grunt-autoprefixer");

  //开发环境
  grunt.registerTask('dev', ['less', 'autoprefixer', 'jshint', 'concat', 'jsbeautifier']);

  //发布
  grunt.registerTask('build', ['less', 'autoprefixer', 'cssmin', 'jshint', 'concat', 'jsbeautifier', 'uglify']);
};