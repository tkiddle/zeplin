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

    jshint: {
      all: ['<%= js.dev %>/*.js', '!<%= js.dist %>/*.js']
    },

    jasmine: {
      src: ['<%= js.dev %>/*.js', '!<%= js.dist %>/*.js'],
      options: {
        specs: 'spec/**/*Spec.js',
        helpers: 'spec/helpers/*.js',
        keepRunner: true
      }
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
    },

    watch: {
      scripts: {
        files: ['<%= js.dev %>/*.js', '!<%= js.dist %>/*.min.js'],
        tasks: ['clean', 'jshint', 'jasmine', 'concat', 'uglify'] // Run these tasks on save
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', 'watch');
  grunt.registerTask('build', ['clean', 'jshint', 'concat', 'uglify']);
};
