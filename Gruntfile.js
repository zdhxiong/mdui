module.exports = function (grunt) {

  grunt.initConfig({

    //less 编译
    less: {
      development: {
        files: {
          "dist/css/mdui.css": "src/less/mdui.less"
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
      app: {
        src: [
          'src/js/wrap_start.js',

          // GLOBAL
          'src/js/init.js',
          'src/js/support.js',
          'src/js/device.js',
          'src/js/color.js',
          'src/js/util.js',
          'src/js/global.js',

          // PLUGINS
          'src/js/ripple.js',
          'src/js/fab.js',
          'src/js/drawer.js',
          'src/js/dialog.js',
          'src/js/dialog/dialog.js',
          'src/js/dialog/alert.js',
          'src/js/dialog/confirm.js',
          'src/js/dialog/prompt.js',

          'src/js/wrap_end.js'
        ],
        dest: 'dist/js/mdui.js'
      }
    },

    //美化 js
    jsbeautifier: {
      files: [
        'dist/js/mdui.js'
      ]
    },

    //压缩 js
    uglify: {
      app: {
        files: {
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
          'src/less/**/*.less'
        ],
        tasks: ['less', 'autoprefixer']
      },
      scripts: {
        files: [
          'src/js/**/*.js'
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