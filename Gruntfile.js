module.exports = function(grunt) {
    "use strict";
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        prop: {
            dist: {
                src: [
                    'templates/*.html'
                ]
            },
            options: {
                dest: '',
                tag: '{version}',
                version: 'v<%= pkg.version %>',
                header: "<!----------------------------------------------------------------->\n" +
                        "<!-- AUTOMATICALLY GENERATED CODE - PLEASE EDIT TEMPLATE INSTEAD -->\n" +
                        "<!----------------------------------------------------------------->\n"
            }
        }
    });

    // Propogate version into relevant files
    grunt.registerMultiTask('prop', 'Propagate Versions.', function() {
        var options = this.options(),
            outPath = options.dest,
            tag = options.tag,
            version = options.version,
            header = options.header;
        grunt.log.writeln("");
        grunt.log.writeln("Replacing " + tag + " with " + version);
        grunt.log.writeln("------------------------------------------------------");
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
                src = src.split(tag).join(version);
                // Write the new file
                grunt.log.writeln("Creating " + outPath + filepath.substring(filepath.lastIndexOf("/") + 1));
                grunt.file.write(outPath + filepath.substring(filepath.lastIndexOf("/") + 1), header + src);
            });
        });
    });

    // Default tasks
    grunt.registerTask('default', ['prop']);

};