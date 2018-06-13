var request = require("request-promise");

/**
 * 
 * @class GITLabConnection
 * @constructor
 * @param {String} name
 * @param {String} fqdn
 * @param {Authentication} authentication
 * @param {Object} configuration
 */
module.exports = function(name, fqdn, authentication, configuration) {
	configuration = configuration || {};
	configuration.requests = configuration.requests || {"retries": 3};
	
	configuration.version = parseInt(configuration.version);
	configuration.version = isNaN(configuration.version) ? 3 : configuration.version;
	var root = fqdn + "api/v" + configuration.version + "/";
	var resolve, connection = this;
	var deploymentKeys = [];
	
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
		options = options || {};
		options.requests = options.requests || {};
		options = Object.assign({}, configuration, options);
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
			if(options.body) {
				if(typeof options.body === "string") {
					requesting.body = options.body;
				} else {
					requesting.body = JSON.stringify(options.body);
				}
			}
			
			if(page) {
				requesting.url += requesting.url.indexOf("?") === -1 ? "?page=" + page : "&page=" + page;
			}
			
			authentication.authorize(requesting);
			
//			console.log("Gitlab Request:\n", JSON.stringify(requesting, null, 4));
			
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
	 * 
	 * @method addDeployKey
	 * @param {Number} id
	 * @return {Array | > | Number} Current deployment key array.
	 */
	this.addDeployKey = function(id) {
		if(deploymentKeys.indexOf(id) === -1) {
			deploymentKeys.push(id);
		}
		return Object.assign([], deploymentKeys);
	};
	
	/**
	 * 
	 * @method removeDeployKey
	 * @param {Number} id
	 * @return {Array | > | Number} Current deployment key array.
	 */
	this.removeDeployKey = function(id) {
		var index = deploymentKeys.indexOf(id);
		if(index !== -1) {
			deploymentKeys.splice(index, 1);
		}
		return Object.assign([], deploymentKeys);
	};
	
	/**
	 * Manages resolution of all pages for a request an returning all results as one array.
	 * @method retrieveURL
	 * @param {String} url
	 * @return {Promise}
	 */
	this.resolveURL = resolve = function(url, options) {
		options = options || {};
		options.requests = options.requests || {};
		options = Object.assign({}, configuration, options);
		return new Promise(function(done, fail) {
			retrieveURL(url, options)
			.then(function(response) {
//				console.log("Resolving " + url);
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
			.catch(function(fault) {
				console.log("Failed Resolving " + url + " [" + fault.statusCode + "]:\n", fault.body);
				fail(fault);
			});
		});
	};
	
	/**
	 * 
	 * @method getProject
	 * @param {Object} identifier
	 * @return {Promise} 
	 */
	this.getProject = function(identifier) {
		return new Promise(function(done, fail) {
			var url, id = parseInt(identifier);
			if(identifier === undefined) {
				url = "projects";
			} else if(id == identifier) {
				url = "projects/" + project;
			} else if(typeof identifier === "string") {
				url = "projects"; // TODO
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
	 * @method getProjectDeployKeys
	 * @param {Project} project
	 * @return {Promise} 
	 */
	this.getProjectDeployKeys = function(project) {
		return new Promise(function(done, fail) {
			resolve("projects/" + project.id + "/deploy_keys")
			.then(function(response) {
				project.deploymentKeys = response || [];
				done(project);
			})
			.catch(fail);
		});
	};
	
	/**
	 * 
	 * @method 
	 * @param {String | Number} identifier Name or ID for the key to enable
	 * @param {Boolean} failable When true, requesting a key that isn't available in the Project will fail
	 * 		the Promise. Otherwise the requested key is simply ignored.
	 * @return {Function | > | Promise | > | Project}
	 */
	this.enableProjectDeployKey = function(identifier, failable) {
		return function(project) {
			return new Promise(function(done, fail) {
				var requesting;
				
				if(typeof identifier === "string") {
					project.deploymentKeys.forEach(function(key) {
						if(key.name === identifier) {
							identifier = key.id;
						}
					});
				}
				
//				if(enable === 0 || enable) {
					enable = "projects/" + project.id + "/deploy_keys/" + identifier + "/enable";
					requesting = {};
					requesting.method = "POST";
					resolve(enable, requesting)
					.then(function() {
						done(project);
					})
					.catch(function(fault) {
						if(failable || fault.responseCode !== 404) {
							fail(fault);
						} else {
							done(project);
						}
					});
//				} else {
//					if(failable) {
//						fail(new Error("Key not found"));
//					} else {
//						done(project);
//					}
//				}
			});
		};
	};
	
	/**
	 * 
	 * @method 
	 * @param {Number} identifier ID for the key to delete
	 * @param {Boolean} failable When true, requesting a key that isn't available in the Project will fail
	 * 		the Promise. Otherwise the requested key is simply ignored.
	 * @return {Function | > | Promise | > | Project}
	 */
	this.deleteProjectDeployKey = function(identifier, failable) {
		return function(project) {
			return new Promise(function(done, fail) {
				var requesting = {};
				requesting.method = "DELETE";
				resolve("projects/" + project.id + "/deploy_keys/" + identifier, requesting)
				.then(function() {
					done(project);
				})
				.catch(function(fault) {
					if(failable || fault.responseCode !== 404) {
						fail(fault);
					} else {
						done(project);
					}
				});
			});
		};
	};
	
	/**
	 * 
	 * @method enableSystemProjectDeployKeys
	 * @param {Project} project
	 * @return {Promise | > | Project}
	 */
	this.enableSystemProjectDeployKeys = function(project) {
		return new Promise(function(done, fail) {
			var enabling = [];
			deploymentKeys.forEach(function(key) {
				enabling.push(connection.enableProjectDeployKey(key)(project));
			});
			Promise.all(enabling)
			.then(function() {
				done(project);
			})
			.catch(fail);
		});
	};
	
	/**
	 * 
	 * @method addProjectWebhook
	 * @param {Project} project
	 * @param {String} url Webhook URL
	 * @param {Object} [conditions]
	 * @return {Promise | > | Project}
	 */
	this.addProjectWebhook = function(project, url, conditions) {
		return new Promise(function(done, fail) {
			connection.getProjectWebhooks(project)
			.then(cleanHook(url))
			.then(addWebhook(url, conditions))
			.then(done)
			.catch(fail);
		});
	};
	
	/**
	 * Written to be added to a Promise chain for a project.
	 * 
	 * Deletes any webhook matching the passed URL and finishes when complete.
	 * @method cleanHook
	 * @private
	 * @param {String} url
	 * @return {Promise | > | Project}
	 */
	var cleanHook = function(url) {
		return function(project) {
			return new Promise(function(done, fail) {
				var waiting = [];
				project.webhooks.forEach(function(webhook) {
					if(webhook.url === url) {
						waiting.push(deleteWebhook(project, webhook));
					}
				});
				Promise.all(waiting)
				.then(function() {
					done(project);
				})
				.catch(fail);
			});
		};
	};
	
	/**
	 * 
	 * @method getProjectWebhooks
	 * @param {Project} project
	 * @return {Promise | > | Project}
	 */
	var getProjectWebhooks = this.getProjectWebhooks = function(project) {
		return new Promise(function(done, fail) {
			resolve("projects/" + project.id + "/hooks")
			.then(function(response) {
				console.log("Response:", response);
				project.webhooks = response.body || response;
				done(project);
			})
			.catch(function(fault) {
				fail(fault);
			});
		});
	};
	
	/**
	 * Written to be added to a Promise chain for a project.
	 * @method addWebhook
	 * @private
	 * @param {String} url
	 * @param {Object} [conditions]
	 * @return {Promise | > | Project}
	 */
	var addWebhook = function(url, conditions) {
		return function(project) {
			return new Promise(function(done, fail) {
				var requesting = {};
				requesting.method = "POST";
				requesting.body = {
					"id": project.id,
					"url": url
				};
				Object.assign(requesting.body, conditions);
				console.log("Make Hook:\n", JSON.stringify(requesting, null, 4));
				
				resolve("projects/" + project.id + "/hooks", requesting)
				.then(function(response) {
					console.log("Response:", response.message);
					done(project);
				})
				.catch(function(fault) {
					fail(fault);
				});
			});
		};
	};
	
	/**
	 * 
	 * @method deleteWebhook
	 * @param {Project} project
	 * @param {String} [branch]
	 */
	var deleteWebhook = function(project, webhook) {
		return new Promise(function(done, fail) {
			var requesting = {};
			requesting.method = "DELETE";
			resolve("projects/" + project.id + "/hooks/" + (webhook.id || webhook), requesting)
			.then(function(response) {
				done(project);
			})
			.catch(function(fault) {
				fail(fault);
			});
		});
	};
	
	/**
	 * 
	 * @method getCommits
	 * @param {Project} project
	 * @param {String} [branch]
	 */
	this.getCommits = function(project, branch) {
		return new Promise(function(done, fail) {
			var commits = [];
			var url = "projects/" + project.id + "/repository/commits?per_page=100";
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
