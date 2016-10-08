module.exports = function (grunt) {

  'use strict';

  // 定义各种路径
  var path = {
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

  // 定义模块及依赖
  var modules = grunt.file.readJSON('modules.json');

  var mdui = {
    filename: 'mdui',
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' +
            ' * <%= mdui.pkg.name %> v<%= mdui.pkg.version %> (<%= mdui.pkg.homepage %>)\n' +
            ' * Copyright 2016-<%= grunt.template.today("yyyy") %> <%= mdui.pkg.author %>\n' +
            ' * Licensed under <%= mdui.pkg.license %>\n' +
            ' */\n',
    customBanner: '/*!\n' +
                  ' * <%= mdui.pkg.name %> v<%= mdui.pkg.version %> - Custom Build' +
                  ' * Copyright 2016-<%= grunt.template.today("yyyy") %> <%= mdui.pkg.author %>\n' +
                  ' * Licensed under <%= mdui.pkg.license %>\n' +
                  ' * \n' +
                  ' * Included modules: <%= modulesList %>' +
                  ' * Included primary colors: <%= primaryColors %>' +
                  ' * Included accent colors: <%= accentColors %>' +
                  ' * Included color degrees: <%= colorDegrees %>'
  };

  // 所有的 js 文件
  mdui.jsFiles = [];
  for (var prop in modules) {
    if (modules.hasOwnProperty(prop)) {
      for (var i = 0; i < modules[prop].js.length; i++) {
        if (typeof modules[prop].path === 'undefined') {
          mdui.jsFiles.push(modules[prop].js[i]);
        } else {
          mdui.jsFiles.push(modules[prop].path + 'js/' + modules[prop].js[i]);
        }
      }
    }
  }

  // 所有的 less 文件
  mdui.lessFiles = [];
  for (var prop in modules) {
    if (modules.hasOwnProperty(prop)) {
      for (var i = 0; i < modules[prop].less.length; i++) {
        if (typeof modules[prop].path === 'undefined') {
          mdui.lessFiles.push(modules[prop].less[i]);
        } else {
          mdui.lessFiles.push(modules[prop].path + 'less/' + modules[prop].less[i]);
        }
      }
    }
  }

  /**
   * 主色的颜色名
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
   * 主色的颜色饱和度
   * @type {string[]}
   */
  var primaryColorDegrees = [
    '50', '100', '200', '300', '400', '500', '600', '700', '800', '900'
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

  /**
   * 强调色的颜色饱和度
   * @type {string[]}
   */
  var accentColorDegrees = [
    'a100', 'a200', 'a400', 'a700'
  ];

  var tasks = {};

  /**
   * Less
   */
  tasks.less = {
    core: {
      options: {
        modifyVars: {

        }
      },
      src: mdui.lessFiles,
      dest: path.dist.css + '<%= mdui.filename %>.css'
    }
  };

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
      src: ['<%= less.core.dest %>']
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
          cwd: path.dist.css,
          src: ['*.css', '**/*.css', '!*.min.css'],
          dest: path.dist.css,
          ext: '.min.css'
        }
      ]
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
      src: path.src.root + '**/*.js'
    }
  };

  /**
   * concat
   */
  tasks.concat = {

    mdui: {
      options: {
        banner: '<%= mdui.banner %>\n',

        // 文件添加缩进
        process: function (src, filepath) {
          var addIndent = '  ';
          var newFileContent = '';

          if (
            filepath === path.src.root + 'global/js/wrap_start.js' ||
            filepath === path.src.root + 'global/js/wrap_end.js'
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

      src: mdui.jsFiles,
      dest: path.dist.js + '<%= mdui.filename %>.js'
    },

    mduiJquery: {
      src: [
        path.dist.js + '<%= mdui.filename %>.js',

        path.src.root + 'fab/js/fab.jquery.js',
        path.src.root + 'drawer/js/drawer.jquery.js',
        path.src.root + 'dialog/js/dialog.jquery.js'
      ],
      dest: path.dist.js + '<%= mdui.filename %>.jquery.js'
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
      dest: path.dist.js + '<%= mdui.filename %>.min.js'
    },
    mduiJquery: {
      src: '<%= concat.mduiJquery.dest %>',
      dest: path.dist.js + '<%= mdui.filename %>.jquery.min.js'
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
      src: [path.dist.js + '<%= mdui.filename %>.js', path.dist.js + '<%= mdui.filename %>.jquery.js']
    }
  };

  /**
   * clean
   */
  tasks.clean = {
    css: [path.dist.css],
    js: [path.dist.js]
  };

  /**
   * watch
   */
  tasks.watch = {
    css: {
      files: [
        path.src.root + '**/*.less'
      ],
      tasks: ['clean:css', 'less', 'autoprefixer', 'csscomb', 'csslint']
    },
    scripts: {
      files: [
        path.src.root + '**/*.js'
      ],
      tasks: ['clean:js', 'concat:mdui', 'concat:mduiJquery']
    }
  };

  /**
   * 初始化
   */
  grunt.initConfig({
    mdui          : mdui,
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
  // grunt version
  grunt.registerTask('version', '输出当前版本', function () {
    grunt.log.writeln('当前版本为: ' + mdui.pkg.version);
  });

  // 构建 JavaScript 文件
  // grunt build-js
  grunt.registerTask('build-js', '构建 JavaScript 文件', ['clean:js', 'jscs', 'concat:mdui', 'concat:mduiJquery', 'uglify', 'jshint']);

  // 构建 CSS 文件
  // grunt build-css
  grunt.registerTask('build-css', '构建 CSS 文件', ['clean:css', 'less', 'autoprefixer', 'csscomb', 'cssmin', 'csslint']);

  // 构建所有文件
  // grunt build
  grunt.registerTask('build', '构建所有文件', ['build-css', 'build-js']);

  // 自定义构建
  // grunt custom:module--button,appbar,grid:primary--blue,red:accent--pink:degree--500,600,700,a200,a400:layout--dark
  /*grunt.registerTask('custom', '定制', function () {
    var paramsLength = arguments.length;
    if (!paramsLength) {
      grunt.log.writeln('缺少参数');
      return;
    }

    var custom = {};

    for (var i = 0; i < paramsLength; i++) {
      var params = arguments[i].split('--');
      custom[params[0]] = params[1].split(',');
    }


  });*/
};
