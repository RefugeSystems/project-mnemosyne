/* Block usual console prints and logging for report cleanliness.
 * These will generally be blocked by implementing jasmine spies as well
 */

module.exports = function(grunt) {
	require("load-grunt-tasks")(grunt);
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-jasmine-nodejs");
	grunt.loadNpmTasks("grunt-contrib-yuidoc");
	grunt.loadNpmTasks("gruntify-eslint");

	var rules = {
		strict: {
			/* Programatic Fixes */
			"eqeqeq": 0,
			"curly": 2,
			"quotes": [2, "double"],
			"block-scoped-var": 2,
			"no-undef": 2,
			"semi": 2,
			"indent": [2, "tab"],
			"no-mixed-spaces-and-tabs": 2,
			"new-parens": 2,
			"keyword-spacing": [2, {
					"before": true,
					"after": false
				}
			],
			"key-spacing": [2, {}
			],
			"comma-spacing": 2,
			"comma-dangle": 2,
			"brace-style": 2,
			"no-trailing-spaces": 2,
			"object-curly-newline": [2, {
					"minProperties": 2
				}
			],
			"object-property-newline": 2,
			"space-before-blocks": 2,
			"space-before-function-paren": [2, "never"],
			"space-in-parens": 2,
			"switch-colon-spacing": 2,

			/* Manual Fixes */
			"max-depth": 2,
			"no-unused-vars": [1, {
					varsIgnorePattern: "^drop"
				}
			],

			/* Warnings */
			"camelcase": 1,
			"require-jsdoc": 1
		},
		loose: {
			eqeqeq: 0,
			curly: 1,
			quotes: [1, "double"],
			"block-scoped-var": 1,
			"no-undef": 2,
			"semi": 1,
			'no-unused-vars': 1
		}
	};
	
	var gruntConfiguration = {
		pkg: grunt.file.readJSON("package.json"),
		eslint: {
			options: {
				ecmaFeatures: {
					modules: true
				},
				globals: [
					"requireSubject",
					"require",
					"module",
					"Promise",
					"console",
					"process"
				],
				/* http://eslint.org/docs/rules/ */
				rules: rules.loose,
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
					paths: "./lib",
					outdir: "./docs"
				}
			}
		}
	}
	
	if(process.argv.indexOf("format") !== -1) {
		gruntConfiguration.eslint.options.rules = rules.strict;
		gruntConfiguration.eslint.options.fix = true;
	}
	
	grunt.initConfig(gruntConfiguration);

	grunt.registerTask("test", ["jasmine_nodejs:unit"]); 
	grunt.registerTask("test:live", ["test", "watch"]);
	grunt.registerTask("lint", ["eslint"]);
	grunt.registerTask("docs", ["yuidoc"]);
	grunt.registerTask("default", ["test:live"]);
	
	grunt.registerTask("format", [""]);
};
