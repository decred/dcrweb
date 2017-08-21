'use strict'

var connect = require('connect')
var serveStatic = require('serve-static')

var srcHtmlDocuments = ['src/**/*.html'];

var BUILD_ENV = process.env.BUILD_ENV || 'production';

module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-angular-gettext-generate-html')
  grunt.loadNpmTasks('grunt-angular-gettext')
  grunt.loadNpmTasks('grunt-contrib-connect')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-replace');

  grunt.initConfig({
    nggettext_extract: {
      pot: {
        files: {
          'src/i18n/po/template.pot': srcHtmlDocuments
        }
      }
    },

    replace: {
      dist: {
        options: {
          variables: {
            packageJson: require('./package.json')
          }
        },
        files: [
          {expand: true, flatten: false, cwd: 'src/', src: ['**/*.html'], dest: '.tmp/'}
        ]
      }
    },

    gt_generate_html: {
      l10n: {
        po: [ 'src/i18n/po/*.po' ],
        source: [
          {
            dest: 'build/{Language}',
            options: {
              'cwd': '.tmp/'
            },
            src: ['**/*.html']
          }
        ]
      }
    },

    nggettext_compile: {
      all: {
        options: {
          module: 'dcrweb'
        },
        files: {
          'build/content/js/translations.js': ['i18n/po/*.po']
        }
      }
    },

    watch: {
      options: {
      },
      gettext: {
        files: [
          'src/i18n/po/*.po',
          'src/i18n/po/*.pot'
        ],
        tasks: ['gt_generate_html', 'nggettext_compile']
      },
      assets: {
        files: ['src/**/*', 'www-root/content/**'],
        tasks: ['default'],
        options: {
          livereload: true,
        },
      }
    },

    connect: {
      server: {
        options: {
          port: 8080,
          keepalive: true,
          livereload: true,
          open: true,
          hostname: '*',
          base: ['www-root', 'build' ]
        }
      }
    },

    copy: {
      main: {
        files: [
          {src: ['src/i18n/languagemap.'+ BUILD_ENV + '.txt'], dest: 'build/languagemap.txt'},
          {expand: true, cwd: 'www-root/', src: ['**'], dest: 'build/', dot: true}
        ],
      },
    },

    clean: ['build', '.tmp']
  })

  grunt.registerTask('serve', [
    'connect:server',
    'watch'
  ]);

  grunt.registerTask('build', ['replace', 'gt_generate_html', 'copy:main'])
  grunt.registerTask('default', ['build'])

}
