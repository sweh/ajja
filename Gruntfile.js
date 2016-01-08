module.exports = function (grunt) {
    "use strict";
    require('load-grunt-tasks')(grunt);

    grunt.config.init({
        jasmine : {
            jsform: {
                src : [
                    'src/helpers.js',
                    'src/templates.js',
                    'src/jsform.js',
                    'src/container.js'
                ],
                options : {
                    specs : 'tests/**/*.js',
                    vendor: 'lib/bower.js',
                    styles: 'bower_components/bootstrap/dist/css/bootstrap.css',
                },
            }
        },
        connect: {
            server: {
                options: {
                    port: 8888,
                    keepalive: true,
                    base: {
                        path: '.',
                        options: {
                            index: '_SpecRunner.html'
                        }
                    },
                    open: true
                }
            }
        },
        jshint: {
            all: [
                'Gruntfile.js',
                'src/helpers.js',
                'src/container.js',
                'src/jsform.js',
                'tests/*.js'
            ],
        },
        bower: {
            install: {
                options: {
                    copy: false
                }
            },
            dev: {
                dest: 'lib',
                keepExpandedHierarchy: true,
                options: {
                    expand: true,
                }
            }
        },
        bower_concat: {
            all: {
                dest: 'lib/bower.js'
            },
        },
        handlebars: {
            compile: {
                options: {
                    namespace: "gocept.jsform.templates",
                    processName: function (filePath) {
                        return filePath.split('/')[1].replace('.hbs', '');
                    }
                },
                files: {
                    "src/templates.js": "templates/*.hbs",
                }
            }
        }
    });
    grunt.registerTask('default', [
        'bower:dev',
        'bower_concat:all',
        'jshint:all',
        'handlebars:compile'
    ]);
    grunt.registerTask('test', [
        'jasmine:jsform:build',
        'connect',
    ]);
};
