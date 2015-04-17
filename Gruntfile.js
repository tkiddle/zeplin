module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    js: {
      dev: './js/**',
      dist: './js/build',
    },

    banner: {
      body: '/*!\n' +
            ' * <%= pkg.name %>\n' +
            ' * <%= pkg.description %>\n' +
            ' * <%= pkg.url %>\n' +
            ' * <%= pkg.repository.url %>\n' +
            ' * @version <%= pkg.version %>\n' +
            ' * @author <%= pkg.author %>\n' +
            ' */\n'
    },

    clean: ['<%= js.dist %>/*.min.js'],

    watch: {
      scripts: {
        files: ['<%= js.dev %>/*.js', '!<%= js.dist %>/*.min.js'],
        tasks: ['clean', 'jshint', 'concat', 'uglify'] // Run these tasks on save
      }
    },

    jshint: {
      all: ['<%= js.dev %>/*.js', '!<%= js.dist %>/*.js']
    },

    concat: {
      distMin: {
        src: ['<%= js.dev %>/*.js', '!<%= js.dist %>/*.js'],
        dest: '<%= js.dist %>/zeplin-<%= pkg.version %>.min.js'
      },

      distNonMin: {
        src: ['<%= js.dev %>/*.js', '!<%= js.dist %>/*.js'],
        dest: '<%= js.dist %>/zeplin-<%= pkg.version %>.js'
      },

      options: {
        stripBanners: false,
        nonull: true,
        banner: '<%= banner.body %>'
      }
    },

    uglify: {
      js: {
        files: {
          '<%= js.dist %>/zeplin-<%= pkg.version %>.min.js':
          ['<%= js.dist %>/zeplin-<%= pkg.version %>.min.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', 'watch');
  grunt.registerTask('build', ['clean', 'jshint', 'concat', 'uglify']);
};
