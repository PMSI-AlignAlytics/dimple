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
                dest: 'dist/<%= pkg.name %>.v<%= pkg.version %>.js'
            }
        },
        uglify: {
            dist: {
                files: {
                    'dist/<%= pkg.name %>.v<%= pkg.version %>.min.js': ['<%= concat.dist.dest %>']
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
                        'http://localhost:3001/test/methods/_getOrderedList.html',
                        'http://localhost:3001/test/methods/_rollUp.html',
                        'http://localhost:3001/test/methods/newSvg.html'
                    ]
                }
            }
        },
        jslint: {
            files: [
                'Gruntfile.js',
                'dist/<%= pkg.name %>.v<%= pkg.version %>.js'
            ],
            directives: {
                browser: true,
                nomen: true,
                predef: [
                    'd3',
                    'module',
                    'console'
                ]
            }
        },
        prop: {
            dist: {
                src: [
                    'examples/templates/*.html'
                ]
            },
            options: {
                dest: 'examples/',
                tag: '{version}',
                version: 'v<%= pkg.version %>'
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-jslint');

    // Propogate version into relevant files
    grunt.registerMultiTask('prop', 'Propagate Versions.', function() {
        var options = this.options(),
            outPath = options.dest,
            tag = options.tag,
            version = options.version;
        // Iterate over all src-dest file pairs.
        this.files.forEach(function(f) {
            f.src.filter(function(filepath) {
                var result = true;
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('File "' + filepath + '" not found.');
                    result = false;
                }
                return result;
            }).map(function(filepath) {
                // Read file source.
                var src = grunt.file.read(filepath);
                // Replace the version
                src = src.replace(tag, version);
                // Write the new file
                grunt.file.write(outPath + filepath.substring(filepath.lastIndexOf("/") + 1), src);
            });
        });
    });

    // Default tasks
    grunt.registerTask('default', ['concat', 'jslint', 'uglify', 'connect', 'qunit', 'prop']);

};