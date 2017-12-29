
var request = require("request-promise");
var Board = require("./board.js");
var Issue = require("./issue.js");

/**
 * 
 * 
 * @class JIRAConnection
 * @constructor
 * @param {String} name
 * @param {String} fqdn
 * @param {Authentication} authentication
 * @param {Log} log
 * @param {Object} options
 */
module.exports = function(name, fqdn, authentication, log, options) {
	if(fqdn[fqdn.length-1] !== "/" && fqdn[fqdn.length-1] !== "\\") {
		fqdn += "/";
	}

	var base = {};
	base.headers = {};
	base.uri = fqdn;
	base.uri += "rest/agile/1.0/board/{id}/backlog";
	base.headers["content-type"] = "application/json";
	base.resolveWithFullResponse = true;
	authentication.authorize(base);

	var api = {};
	api.headers = {};
	api.uri = fqdn;
	api.uri += "rest/api/2/";
	api.headers["content-type"] = "application/json";
	api.resolveWithFullResponse = true;
	authentication.authorize(api);

	/**
	 * 
	 * @method getBacklog
	 * @param {Number} board 
	 * @return {Promise | > | Board} 
	 */
	this.getBacklog = function(board) {
		board = parseInt(board);
		return new Promise(function(done, fail) {
			retrieve(board)
				.then(process)
				.then(cast)
				.then(function(constructed) {
					log.debug({"board": board}, "Constructed");
					constructed.setID(board);
					constructed.type = "Backlog";
					done(constructed);
				})
				.catch(fail);
		});
	};

	/**
	 * 
	 * 
	 * 
	 * @method getProject
	 * @param {String} project 
	 * @return {Promise | > | Board} Issues are returned in a Board Object as that class handles all indexing. 
	 */
	this.getProject = function(project) {
		//project = parseInt(project);
		var options = {
			uri: "rest/api/2/search?jql=project=\"" + project + "\" AND issuetype in (Bug, \"DevOps Story\", \"Feature Request\", Impediment, Task) AND status in (Open, \"In Progress\", Reopened, \"Under Review\", Approved, Rejected, Analyzed) ORDER BY Rank ASC"
		};
		return new Promise(function(done, fail) {
			retrieve(project, options)
				.then(process)
				.then(cast)
				.then(function(constructed) {
					log.debug({"Project": project}, "Constructed");
					constructed.setID(project);
					constructed.type = "Project";
					done(constructed);
				})
				.catch(fail);
		});
	};
	
	/**
	 * 
	 * @method getIssue
	 * @param {String} key
	 * @return {Promise}
	 */
	this.getIssue = function(issue) {
		return new Promise(function(done, fail) {
			var req = Object.assign({}, api);
			req.uri += "issue/" + issue.key;
			request(req)
				.then(function(response) {
					done(response);
				})
				.catch(fail);
		});
	};

	/**
	 * 
	 * @method getSprint
	 * @param {Number} board 
	 * @return {Promise | > | Board} 
	 */
	this.getSprint = function(board) {
		board = parseInt(board);
		return new Promise(function(done, fail) {
			retrieve(board)
				.then(process)
				.then(cast)
				.then(function(constructed) {
					log.debug({"board": board}, "Constructed");
					constructed.setID(board);
					done(constructed);
				})
				.catch(fail);
		});
	};

	/**
	 * 
	 * @method retrieve
	 * @private
	 * @param {Board} board
	 * @param {Object} [options] Override defaults for the request for changing the API 
	 * @return {Promise | > | Issue}
	 */
	var retrieve = function(board, options) {
		return new Promise(function(done, fail) {
			log.debug({"board": board}, "Resolving");
			var req = Object.assign({}, base);
			if(options) {
				Object.assign(req, options);
				if(options.uri) {
					req.uri = fqdn + options.uri;
				}
			}
			req.uri = req.uri.replace(/\{id\}/ig, board);
			
			console.log("Requesting[" + board + "]: " + req.uri);
			request(req)
				.then(function(response) {
					log.debug({"board": board}, "Resolved");
					var head = JSON.parse(response.body);
					if(head.total < head.maxResults) {
						done([head.issues]);
					} else{
						var scan = [];
						var pages = head.total/head.maxResults;
						for(var page = 1; page < pages; page++) {
							log.debug({
								"board": board,
								"page": page,
								"start": page * head.maxResults,
								"end": (page+1) * head.maxResults
							}, "Resolving Page");
							scan.push(new Promise(function(done, fail) {
								var report = page;
								var paged = Object.assign({}, base);
								if(options)
									Object.assign(paged, options);
								paged.uri = req.uri.replace(/\{id\}/ig, board);
								if(paged.uri.indexOf("?") === -1) {
									paged.uri += "?";
								} else {
									paged.uri += "&";
								}
								paged.uri += "startAt=" + page * head.maxResults;
								console.log("Continuing: " + paged.uri);
								request(paged)
									.then(function(response) {
										log.debug({
											"board": board,
											"page": report
										}, "Resolved Page");
										var parsed = JSON.parse(response.body);
										done(parsed.issues);
									})
									.catch(fail);
							}));
						}

						Promise.all(scan)
							.then(function(collection) {
								done(head.issues.concat(collection));
							})
							.catch(fail);
					}
				})
				.catch(fail);
		});
	};

	/**
	 * 
	 * @method process
	 * @private
	 * @param {Array | > | Response} responses
	 * @return {Promise | > | Array | > | Issue}
	 */
	var process = function(responses) {
		return new Promise(function(done, fail) {
			log.debug("Assembling Board");
			var issues = [];
			responses.forEach(function(received) {
				issues = issues.concat(received);
			});
			done(issues);
		});
	};

	/**
	 * 
	 * @method cast
	 * @private
	 * @param {Issue} issue
	 * @return {Promise | > | Issue}
	 */
	var cast = function(issues) {
		return new Promise(function(done, fail) {
			log.debug("Casting Board");
			done(new Board(issues));
		});
	};

	/**
	 * 
	 * @method updateIssue
	 * @param {Issue} issue
	 * @return {Promise | > | Issue}
	 */
	this.updateIssue = function(issue) {
		return new Promise(function(done, fail) {
			if(!options.generalize || (Date.now() - issue.roadmapdate) < options.generalize) {
				var req = Object.assign({}, api);
				req.uri += "issue/" + issue.key;
				req.method = "PUT";
				issue = issue.toSave();
				req.body = JSON.stringify(issue);
				request(req)
					.then(function(response) {
						console.log("Updated " + issue.key + " - " + issue.duedate);
						done(issue);
					})
					.catch(fail);
			} else{
				done(issue);
			}
		});
	};

	/**
	 * 
	 * @method updateRelease
	 * @param {Release} release
	 * @return {Promise | > | Release}
	 */
	this.updateRelease = function(release) {
		return new Promise(function(done, fail) {
			if(!options.generalize || (Date.now() - release.releaseDate) < options.generalize) {
				var req = Object.assign({}, api);
				req.uri += "version/" + release.id;
				req.method = "PUT";
				req.body = JSON.stringify(release.toSave());
				request(req)
					.then(function(response) {
						done(release);
					})
					.catch(fail);
			} else{
				done(release);
			}
		});
	};
};
