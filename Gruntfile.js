module.exports = function(grunt) {
    "use strict";
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            dist: {
                src: [
                    "src/begin.js",
                    "src/objects/axis/begin.js",
                    "src/objects/axis/methods/*.js",
                    "src/objects/axis/end.js",
                    "src/objects/chart/begin.js",
                    "src/objects/chart/methods/*.js",
                    "src/objects/chart/end.js",
                    "src/objects/color/begin.js",
                    "src/objects/color/end.js",
                    "src/objects/eventArgs/begin.js",
                    "src/objects/eventArgs/end.js",
                    "src/objects/legend/begin.js",
                    "src/objects/legend/methods/*.js",
                    "src/objects/legend/end.js",
                    "src/objects/series/begin.js",
                    "src/objects/series/methods/*.js",
                    "src/objects/series/end.js",
                    "src/objects/storyboard/begin.js",
                    "src/objects/storyboard/methods/*.js",
                    "src/objects/storyboard/end.js",
                    "src/objects/aggregateMethod/*.js",
                    "src/objects/plot/*.js",
                    "src/methods/*.js",
                    "src/end.js"
                ],
                dest: 'dist/<%= pkg.name %>.v1.js'
            }
        },
        uglify: {
            dist: {
                files: {
                    'dist/<%= pkg.name %>.v1.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },
        connect: {
            server: {
                options: {
                    port: 3001,
                    base: '.'
                }
            }
        },
        qunit: {
            all: {
                options: {
                    urls: [
                        'http://localhost:3001/test/methods/_getOrderedList.html'
                    ]
                }
            }
        },
        jslint: {
            files: [
                'Gruntfile.js',
                'dist/dimple.v1.js'
            ],
            directives: {
                browser: true,
                nomen: true,
                predef: [
                    'd3',
                    'module'
                ]
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-jslint');

    // Default tasks
    grunt.registerTask('default', ['concat', 'jslint', 'uglify', 'connect', 'qunit']);

};