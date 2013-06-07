module.exports = function(grunt) {

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
	}//,
	//jshint: {
	//    beforeconcat: ['src/**/*.js'],
	//    afterconcat: ['dist/dimple.v1.js']
	//}
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-qunit');
   // grunt.loadNpmTasks('grunt-contrib-jshint');

    // Default task(s).
    grunt.registerTask('default', ['concat', 'uglify', 'connect', 'qunit']);//, 'jshint']);

};