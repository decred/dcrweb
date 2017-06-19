'use strict'

var connect = require('connect')
var serveStatic = require('serve-static')

var srcHtmlDocuments = ['src/**/*.html'];

module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-angular-gettext-generate-html')
  grunt.loadNpmTasks('grunt-angular-gettext')
  grunt.loadNpmTasks('grunt-contrib-connect')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.initConfig({
    nggettext_extract: {
      pot: {
        files: {
          'src/i18n/po/template.pot': srcHtmlDocuments
        }
      }
    },

    gt_generate_html: {
      l10n: {
        po: [ 'src/i18n/po/*.po' ],
        source: [
          {
            dest: 'build/{Language}',
            options: {
              'cwd': 'src/'
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
          {expand: true, cwd: 'www-root/', src: ['**'], dest: 'build/', dot: true}
        ],
      },
    },

    clean: ['build']
  })

  grunt.registerTask('serve', [
    'connect:server',
    'watch'
  ]);

  grunt.registerTask('default', ['gt_generate_html', 'copy:main'])

}
