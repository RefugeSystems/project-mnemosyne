/* Block usual console prints and logging for report cleanliness.
 * These will generally be blocked by implementing jasmine spies as well
 */

module.exports = function(grunt) {
	require("load-grunt-tasks")(grunt);
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-jasmine-nodejs");
	grunt.loadNpmTasks("grunt-contrib-yuidoc");
	
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		eslint: {
			options: {
				ecmaFeatures: {
					modules: true
				},
				globals: [
					"requireSubject"
				],
				/* http://eslint.org/docs/rules/ */
				rules: {
			        eqeqeq: 0,
			        curly: 1,
			        quotes: [1, "double"],
			        "block-scoped-var": 1,
			        "no-undef": 2,
			        "semi": 1,
			        'no-unused-vars': 1
			    },
				envs: ["nodejs", "jasmine"]
			},
			target: ["app/**/*.js", "spec/unit/**/*.js", "./specs/algorithms/**", "./specs/configuration/**", "./specs/jira/**"]
		},
		watch: {
			build: {
				files: ["app/**/*.js", "specs/*/**.js"],
				tasks: ["test"]
			}
		},
		jasmine_nodejs: {
			options: {
				specNameSuffix: "spec.js",
				helperNameSuffix: "helper.js",
				useHelpers: true,
				stopOnFailure: true,
				reporters: {
	                console: {
	                    colors: true,        // (0|false)|(1|true)|2
	                    cleanStack: 1,       // (0|false)|(1|true)|2|3
	                    verbosity: 4,        // (0|false)|1|2|3|(4|true)
	                    listStyle: "indent", // "flat"|"indent"
	                    activity: false
	                },
					junit: {
						savePath : "./specs/reports",
						filePrefix: "unit",
						useDotNotation: true,
						consolidate: false
					}
				}
			},
			unit: {
				specs: ["./specs/algorithms/**", "./specs/configuration/**", "./specs/jira/**"],
				helpers: ["./specs/helpers.js"]
			}
		},
		yuidoc: {
			compile: {
				name: "<%= pkg.name %>",
				description: "<%= pkg.description %>",
				version: "<%= pkg.version %>",
				url: "<%= pkg.homepage %>",
				options: {
					paths: "./app",
					outdir: "./docs"
				}
			}
		}
	});

	grunt.registerTask("test", ["jasmine_nodejs:unit"]); 
	grunt.registerTask("test:live", ["test", "watch"]);
	grunt.registerTask("lint", ["eslint"]);
	grunt.registerTask("docs", ["yuidoc"]);
	grunt.registerTask("default", ["test:live"]);
};
