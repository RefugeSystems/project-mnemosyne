var request = require("request-promise");

/**
 * 
 * 
 * @class GLabConnection
 * @constructor
 * @param {String} name
 * @param {String} fqdn
 * @param {Authentication} authentication
 * @param {Log} log
 * @param {Object} options
 */
module.exports = function(name, fqdn, authentication, log, options) {
	options = options || {};
	options.requests = options.requests || {"retries": 3};
	
	options.version = parseInt(options.version);
	options.version = isNaN(options.version) ? 3 : options.version;
	var root = fqdn + "api/v" + options.version + "/";
	var resolve, connection = this;
	
	/**
	 * Handles pushing a request to the Gitlab host.
	 * @method retrieveURL
	 * @private
	 * @param {String} url
	 * @param {Object} [options]
	 * @param {Number} [page]
	 * @return {Promise}
	 */
	var retrieveURL = function(url, options, page) {
		return new Promise(function(done, fail) {
			options = options || {};
			options.attempts = options.attempts || 0;
			options.retries = options.retries || options.requests.retries;
			
			
			if(url.length > 4 && url[0] === "h" && url[1] === "t" && url[2] === "t" && url[3] === "p") {
				
			} else {
				url = root + url;
			}
			
			var requesting = {
				"method": options.method || "GET",
				"url": url,
				"headers": {
					"accept": "application/json"
				},
				"resolveWithFullResponse": true
			};
			
			if(options.method === "POST") {
				requesting.headers["content-type"] = "application/json";
			}
			
			if(page) {
				requesting.url += requesting.url.indexOf("?") === -1 ? "?page=" + page : "&page=" + page;
			}
			
			authentication.authorize(requesting);
			
			request(requesting)
			.then(function(response) {
				// Leaving room to expand here
				response.body = JSON.parse(response.body);
				done(response);
			})
			.catch(function(failure) {
				options.attempts++;
				if(options.attempts < options.retries) {
					setTimeout(function() {
						retrieveURL(url, options, page)
						.then(done)
						.catch(fail);
					}, 5000);
				} else {
					fail(failure);
				}
			});
		});
	};

	/**
	 * Manages resolution of all pages for a request an returning all results as one array.
	 * @method retrieveURL
	 * @param {String} url
	 * @return {Promise}
	 */
	this.resolveURL = resolve = function(url, options) {
		return new Promise(function(done, fail) {
			retrieveURL(url, options)
			.then(function(response) {
				console.log("Resolving " + url);
//				console.log(response.headers.link + "\n\t>\t" + parseInt(response.headers["x-per-page"]) + " > " + parseInt(response.headers["x-total"]));
//				console.log("Resolving " + url + ":\n", response.headers);
				if(!response.headers["x-per-page"]) {
//					console.log(response.body);
				}
				
				if(response.headers.link && parseInt(response.headers["x-per-page"]) < parseInt(response.headers["x-total"])) {
					var promises = [];
					var page = 1;
					var pages = parseInt(response.headers["x-total-pages"]);
					var results = response.body;
					while(page++ < pages) {
						promises.push(retrieveURL(url, options, page));
					}
					
					Promise.all(promises)
					.then(function(responses) {
						responses.forEach(function(response) {
							results = results.concat(response.body);
						});
						done(results);
					})
					.catch(fail);
				} else {
					done(response.body);
				}
			})
			.catch(fail);
		});
	};
	
	/**
	 * 
	 * @method getProject
	 * @param {Object} identifier
	 */
	this.getProject = function(identifier) {
		return new Promise(function(done, fail) {
			var url, id = parseInt(identifier);
			if(id == identifier) {
				url = "projects/" + project;
			} else if(typeof identifier === "string") {
				url = "projects";
			} else {
				throw new Error("Unable to use passed identifier to find a project");
			}
			
			resolve(url)
			.then(function(project) {
				if(project instanceof Array) {
					for(var x=0; x<project.length; x++) {
						if(project[x].name === identifier) {
							done(project[x]);
							break;
						}
					}
					fail(new Error("Unable to find project: " + identifier));
				} else {
					done(project);
				}
			})
			.catch(fail);
		});
	};
	
	/**
	 * 
	 * @method getCommits
	 * @param {Project | Number} project
	 * @param {String} [branch]
	 */
	this.getCommits = function(project, branch) {
		if(project instanceof Object) {
			project = project.id;
		}
		
		return new Promise(function(done, fail) {
			var commits = [];
			var url = "projects/" + project + "/repository/commits?per_page=100";
			if(branch) {
				url += "&ref_name=" + branch;
			}

			commitChain(url, commits, done, fail)
		});
	};
	
	/**
	 * Internal method for resolving a request for commits
	 * @method commitChain
	 * @private
	 * @param {String} url
	 * @param {Array} commits
	 * @param {Function} finish
	 * @param {Function} failure
	 */
	var commitChain = function(url, commits, finish, failure) {
		var path = url;
		if(commits.length) {
			path += "&until=" + commits[commits.length-1].created_at;
		}
		resolve(path)
		.then(function(toAdd) {
			commits = commits.concat(toAdd);
			if(toAdd.length === 100) {
				setTimeout(function() {
					commitChain(url, commits, finish, failure);
				}, 0);
			} else {
				finish(commits);
			}
		})
		.catch(failure);
	};
};
