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
                    entry: __dirname + "/src/parser-sample1-bundle.js",
                    output: {
                        path: __dirname + "/dist",
                        filename: "parser-sample1-bundle.js"
                    },
                    externals: {
                        jquery: "jQuery",
                        "antlr4/index": "antlr4"
                    }
                },
                antlr4: {
                    mode: "none",
                    target: "node",
                    entry: __dirname + "/src/antlr4-bundle.js",
                    output: {
                        path: __dirname + "/dist",
                        filename: "antlr4-bundle.js"
                    }
                }
            }
        }
    );

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks("grunt-antlr4");
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks("grunt-webpack");

    grunt.registerTask("default", ["jshint", "antlr4", "copy", "webpack:sample", "webpack:antlr4"]);
};
