module.exports = function(grunt) {
    grunt.initConfig(
        {
            pkg: grunt.file.readJSON("package.json"),

            jshint: {
                main: {
                    src: [
                        "package.json",
                        "Gruntfile.js",
                        "src/parser-sample1.js",
                        "sample/index.js"
                    ]
                }
            },

            antlr4: {
                expression: {
                    grammar: "src/Expression.g4",
                    options: {
                        o: "dist",
                        grammarLevel: {
                            language: "JavaScript"
                        },
                        flags: [
                            "visitor",
                            "no-listener"
                        ]
                    }
                }
            },

            copy: {
                main: {
                    src: ["src/parser-sample1.js"],
                    dest: "dist/parser-sample1.js"
                }
            },

            webpack: {
                sample: {
                    mode: "none",
                    target: "node",
                    entry: __dirname + "/sample/index.js",
                    output: {
                        path: __dirname + "/work",
                        filename: "bundle.js"
                    }
                }
            }
        }
    );

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks("grunt-antlr4");
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks("grunt-webpack");

    grunt.registerTask("default", ["jshint", "antlr4", "copy", "webpack:sample"]);
};
