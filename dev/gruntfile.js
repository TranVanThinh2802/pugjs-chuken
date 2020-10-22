'use strict';

module.exports = function (grunt) {

  grunt.config.set('src', '');
  grunt.config.set('dist', '../');
  grunt.config.set('useRootPath', false);

  grunt.initConfig({

    conf: {
      src: grunt.config.get('src'),
      dist: grunt.config.get('dist')
    },

    pug: {
      html: {
        options: {
          pretty: true,
          spawn: false,
          data: {
            debug: true
          }
        },
        files: [{
          expand: true,
          cwd: '<%= conf.src %>pug',
          src: ['**/*.pug', '!_layouts/**', '!_parts/**', '!_mixins/**'],
          dest: '<%= conf.dist %>',
          ext: '.html'
        }]
      }
    },

    compass: {
      sass: {
        options: {
          spawn: false,
          sourcemap: true,
          noLineComments: true,
          outputStyle: 'expanded',
          sassDir: '<%= conf.src %>sass',
          cssDir: '<%= conf.dist %>css'
        }
      }
    },

    postcss: {
      options: {
        processors: [
          require('postcss-sorting')({
            'order': [
              'custom-properties',
              'dollar-variables',
              'declarations',
              'at-rules',
              'rules'
            ],

            'properties-order': [
              'display',
              'visibility',
              'overflow',
              'opacity',
              'list-style',
              'position',
              'top',
              'right',
              'bottom',
              'left',
              'z-index',
              'float',
              'clear',
              'transform',
              'width',
              'height',
              'margin',
              'margin-top',
              'margin-right',
              'margin-bottom',
              'margin-left',
              'padding',
              'padding-right',
              'padding-bottom',
              'padding-left',
              'border',
              'border-right',
              'border-bottom',
              'border-left',
              'border-width',
              'border-style',
              'border-color',
              'border-radius',
              'box-sizing',
              'box-shadow',
              'background',
              'background-image',
              'background-position',
              'background-size',
              'background-repeat',
              'background-attachement',
              'background-color',
              'color',
              'font',
              'font-style',
              'font-weight',
              'font-size',
              'font-family',
              'line-height',
              'letter-spacing',
              'text-decoration',
              'text-align',
              'text-indent',
              'text-transform',
              'white-space',
              'word-break',
              'word-spaciing',
              'word-wrap',
              'text-shadow',
              'table-layout',
              'border-collapse',
              'border-spacing',
              'vertical-align',
              'flex',
              'flex-grow',
              'flex-shrink',
              'flex-basis',
              'flex-flow',
              'flex-direction',
              'flex-wrap',
              'justify-content',
              'align-content',
              'align-items',
              'align-self',
              'order',
              'content',
              'outline',
              'outline-color',
              'outline-style',
              'outline-width',
              'cursor',
              'transition',
              'animation'
            ],

            'unspecified-properties-position': 'bottom'
          })
        ]
      },
      dist: {
        src: ['<%= conf.dist %>css/style.css']
      }
    },

    prettier: {
      files: {
        src: ['<%= conf.dist %>js/scripts.js']
      }
    },

    kraken: {
      options: {
        key: '0f6da8af33d4f776c01b858348f71ad0',
        secret: '8ad11721c57245df8590842addd5250fdde5d6b7',
        lossy: true
      },
      dynamic: {
        files: [{
          expand: true,
          cwd: '<%= conf.dist %>img',
          src: ['**/*.{png,jpg,jpeg,gif}'],
          dest: '<%= conf.dist %>img_min'
        }]
      }
    },

    copy: {
      js: {
        files: [{
          expand: true,
          cwd: '<%= conf.src %>js',
          src: ['*.js'],
          dest: '<%= conf.dist %>js'
        }]
      },
      svg: {
        files: [{
          expand: true,
          cwd: '<%= conf.src %>img',
          src: ['**/*.svg'],
          dest: '<%= conf.dist %>img'
        }]
      },
      fonts: {
        files: [{
          expand: true,
          cwd: '<%= conf.src %>sass/fonts',
          src: ['**/*'],
          dest: '<%= conf.dist %>css/fonts'
        }]
      }
    },

    clean: {
      options: {
        force: true
      },
      files: [
        '<%= conf.dist %>**/*.html',
        '<%= conf.dist %>css',
        '<%= conf.dist %>js',
        // '<%= conf.dist %>img',
        '!<%= conf.dist %>.git/**',
        '!<%= conf.dist %>dev/**',
        '!<%= conf.dist %>wp/**',
        '!<%= conf.dist %>node_modules/**'
      ]
    },

    browserSync: {
      dev: {
        options: {
          watchTask: true,
          server: grunt.config.get('useRootPath') ? '<%= conf.dist %>' : '<%= conf.dist %>..',
          startPath: grunt.config.get('useRootPath') ? '<%= conf.dist %>' : process.cwd().replace(/\\/g, '/').split('/').reverse()[1],
          files: ['<%= conf.dist %>**/*.{html,css,js}', '!<%= conf.src %>'],
        }
      }
    },

    watch: {
      pug: {
        files: ['<%= conf.src %>pug/**/*.pug'],
        tasks: ['pug-newer']
      },
      pugCommon: {
        files: ['<%= conf.src %>pug/_{layouts,parts}/*.pug'],
        tasks: ['pug']
      },
      sass: {
        files: ['<%= conf.src %>sass/**/*.sass'],
        tasks: ['compass']
      },
      ordercss: {
        files: ['<%= conf.src %>sass/**/*.sass'],
        tasks: ['postcss']
      },
      js: {
        files: ['<%= conf.src %>js/*.js'],
        tasks: ['copy:js', 'prettier', 'eslint']
      }
    },

    validation: {
      options: {
        reset: true,
        stoponerror: false,
        generateReport: false,
        reportpath: false
      },
      files: {
        src: [
          '<%= conf.dist %>**/*.html',
          '!<%= conf.dist %>dev/**',
          '!<%= conf.dist %>wp/**',
          '!<%= conf.dist %>node_modules/**'
        ]
      }
    },

    htmllint: {
      defaultOptions: {
        options: {
          'attr-bans': ['align', 'background', 'bgcolor', 'border', 'frameborder', 'longdesc', 'marginwidth', 'marginheight', 'scrolling', 'style'],
          'attr-name-style': 'dash',
          // 'attr-order': 'class, id, name, data-*, src, for, type, href, value, title, alt, role, aria-*',
          'attr-req-value': false,
          'doctype-first': true,
          'doctype-html5': true,
          'force': true,
          'id-class-no-ad': false,
          'id-class-style': 'dash',
          'indent-style': 'spaces',
          'indent-width': 2,
          'line-end-style': false,
          'tag-bans': ['style'],
        },
        src: [
          '<%= conf.dist %>**/*.html',
          '!<%= conf.dist %>dev/**',
          '!<%= conf.dist %>wp/**',
          '!<%= conf.dist %>node_modules/**'
        ]
      }
    },

    csslint: {
      all: {
        options: {
          'adjoining-classes': false,
          'box-model': false,
          'box-sizing': false,
          'compatible-vendor-prefixes': false,
          'display-property-grouping': false,
          'duplicate-background-images': false,
          'fallback-colors': false,
          'floats': false,
          'font-sizes': false,
          'force': true,
          'gradients': false,
          'ids': false,
          'import': 1,
          'important': false,
          'known-properties': false,
          'order-alphabetical': false,
          'outline-none': false,
          'overqualified-elements': false,
          'qualified-headings': false,
          'selector-newline': false,
          'star-property-hack': false,
          'text-indent': false,
          'unique-headings': false,
          'universal-selector': false,
          'unqualified-attributes': false,
          'vendor-prefix': 2,
          'zero-units': false
        },
        src: ['<%= conf.dist %>css/**/*.css']
      }
    },

    eslint: {
      options: {
        configFile: '.eslintrc',
        format: 'stylish',
        failOnError: false,
        fix: true
      },
      target: ['<%= conf.dist %>js/scripts.js']
    },

    fclint: {
      html: {
        options: {
          spelling: true,
          nodoublebr: true
        },
        files: {
          src: [
            '<%= conf.dist %>**/*.html',
            '!<%= conf.dist %>.git/**',
            '!<%= conf.dist %>node_modules/**',
            '!<%= conf.dist %>dev/**',
            '!<%= conf.dist %>wp/**',
            '!<%= conf.dist %>node_modules/**'
          ]
        }
      }
    },

    naming: {
      html: {
        files: {
          src: [
            '<%= conf.dist %>**/*.html',
            '!<%= conf.dist %>.git/**',
            '!<%= conf.dist %>dev/**',
            '!<%= conf.dist %>wp/**',
            '!<%= conf.dist %>node_modules/**'
          ]
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-pug');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-w3c-html-validation');
  grunt.loadNpmTasks('grunt-prettier');
  grunt.loadNpmTasks('grunt-htmllint');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-postcss');

  grunt.loadTasks('tasks');

  grunt.registerTask('pug-newer', ['newer:pug']);

  grunt.registerTask('default', [
    'clean',
    'pug',
    'compass',
    'postcss',
    'copy:js',
    'prettier',
    'copy:fonts',
    'lint',
    'browserSync',
    'watch'
  ]);

  grunt.registerTask('quick', [
    'pug',
    'compass',
    'postcss',
    'copy:js',
    'prettier',
    'eslint',
    'browserSync',
    'watch'
  ]);

  grunt.registerTask('lint', [
    'validation',
    'htmllint',
    'csslint',
    'eslint',
    'fclint'
  ]);

  grunt.registerTask('imagemin', [
    'kraken'
  ]);

};