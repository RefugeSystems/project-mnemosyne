var request = require("request-promise");
var xml2js = require("xml2js");
var random = require("../utility/random")
var fs = require("fs");
var Job = require("./job");

/**
 * 
 * 
 * @class JenkinsConnection
 * @constructor
 * @param {String} name
 * @param {String} fqdn
 * @param {Authentication} authentication
 * @param {Object} configuration
 */
module.exports = function(name, fqdn, authentication, configuration) {
	configuration = configuration || {};
	configuration.requests = configuration.requests || {"retries": 3};

	var parser = new xml2js.Parser();
	var builder = new xml2js.Builder();

	var root = fqdn;
	var resolve, connection = this;
	var template, jobSource;

	var ready = new Promise(function(done, fail) {
		fs.readFile("lib/jenkins/jobTemplate.xml", function(err, data) {
			console.log("Template Data Retrieved");
			if(err) {
				fail(err);
			} else {
				parser.parseString(data, function(e, result) {
					console.log("Template Data Parsed[" + !!e + "]");
					if(e) {
						fail(e);
					} else {
						/* *
						console.log("template:\n", JSON.stringify(template, null, 4));
						console.log(typeof builder.buildObject(template));
						/* */
						template = result;
						jobSource = JSON.stringify(template);
						done();
					}
				});
			}
		});
	});
	
	
	var resolve = function(url, options) {
		return new Promise(function(done, fail) {
			options = options || {};
			
			var requesting = {
				"method": options.method || "GET",
				"url": "https://" + authentication.username + ":" + authentication.password + "@" + root + url,
				"resolveWithFullResponse": true
			};
			Object.assign(requesting, options);
	//		authentication.authorize(requesting);
			if(typeof requesting.body === "object") {
				requesting.headers = requesting.headers || {};
				requesting.headers["Content-Type"] = "application/json";
				requesting.body = JSON.stringify(options.body);
			}
	
			console.log("Jenkins Request => " + url + "\n", requesting);
			request(requesting)
			.then(function(response) {
				done(response.body);
			})
			.catch(function(exception) {
				fail(exception);
			});
		})
	};

	/**
	 * 
	 * @method resolveJob
	 * @param {String} name
	 * @return {Promise | > | JenkinsJob}
	 */
	this.resolveJob = function(name) {
		return new Promise(function(done, fail) {
			connection.getJob(name)
			.then(function(job) {
				if(job) {
					done(job);
				} else {
					connection.createJob({"name":name})
					.then(done)
					.catch(fail);
				}
			})
			.catch(fail);
		});
	};

	/**
	 * 
	 * @method getJob
	 * @param {String} name
	 * @return {Promise | > | JenkinsJob}
	 */
	this.getJob = function(name) {
		return new Promise(function(done, fail) {
			resolve("job/" + name + "/config.xml")
			.then(function(response) {
				if(response) {
					parser.parseString(response, function(err, job) {
						if(err) {
							fail(err);
						} else {
							job = new Job(name, job);
							done(job);
						}
					});
				} else {
					done(null);
				}
			})
			.catch(function(fault) {
				if(fault.response.statusCode === 404) {
					done(null);
				} else {
					fail(fault.response.body);
				}
			});
		});
	};
	
	/**
	 * 
	 * @method updateJob
	 * @param {JenkinsJob} job
	 * @return {Promise | > | JenkinsJob}
	 */
	this.updateJob = function(job) {
		return new Promise(function(done, fail) {
			requesting = {};
			requesting.method = "POST";
			requesting.body = builder.buildObject(job.config).replace(/\n/g, "").replace(/\\n/g, "").trim();
			requesting.headers = {
				"Content-Type": "text/xml"
			};
			
			console.log("Update Request:\n", JSON.stringify(requesting, null, 4));
			resolve("job/" + job.name + "/config.xml", requesting)
			.then(function(response) {
				console.log("Update Response:\n", JSON.stringify(response, null, 4));
				done(job);
			})
			.catch(function(ex) {
				var error = {};
				error.xml = ex.message;
				error.code = ex.statusCode;
				fail(error);
			});
		});
	};
	
	
	this.createJob = function(options) {
		return new Promise(function(done, fail) {
			ready.then(function() {
				options = Object.assign({}, configuration, options);
				if(options.name) {
					console.log("Create Options:\n", JSON.stringify(options, null, 4));

					var job = JSON.parse(jobSource);
					var tokens = options.name.split("-");
					requesting = {};
					job["flow-definition"].authToken = [];
					job["flow-definition"].authToken.push(random.string(64));
					try {
						switch(tokens[0]) {
							case "mService":
							case "qService":
							case "jService":
								job["flow-definition"].definition[0].scm[0].userRemoteConfigs[0]["hudson.plugins.git.UserRemoteConfig"][0].url = "git@repo.it.ohio-state.edu:core-development/Pipeline-Service-Node.git";
								break;
							case "Components":
								job["flow-definition"].definition[0].scm[0].userRemoteConfigs[0]["hudson.plugins.git.UserRemoteConfig"][0].url = "git@repo.it.ohio-state.edu:core-development/Pipeline-Component.git";
								break;
							default:
								fail(new Error("Invalid Job name"));
							return;
						}
					} catch(exception) {
						console.log("?", exception);
						fail(exception);
						return;
					}

					requesting.method = "POST";
					requesting.body = builder.buildObject(job).replace(/\n/g, "").replace(/\\n/g, "").trim();
					requesting.headers = {
						"Content-Type": "text/xml"
					};

					console.log("Create Request:\n", JSON.stringify(requesting, null, 4));
					resolve("createItem?name=" + options.name, requesting)
					.then(function(response) {
						console.log("Create Response:\n", JSON.stringify(response, null, 4));
						job = new Job(options.name, job);
						done(job);
					})
					.catch(function(ex) {
						var error = {};
						error.xml = ex.message;
						error.code = ex.statusCode;
						fail(error);
					});
				} else {
					fail(new Error("No name passed for job"));
				}
			})
			.catch(fail);
		});
	};
};
