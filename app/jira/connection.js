
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
	base.uri += "rest/agile/1.0/";
	base.headers["content-type"] = "application/json";
	base.resolveWithFullResponse = true;
	authentication.authorize(base);
	
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
				done(constructed);
			})
			.catch(fail);
		});
	};
	
	var retrieve = function(board) {
		return new Promise(function(done, fail) {
			log.debug({"board": board}, "Resolving");
			var req = Object.assign({}, base);
			req.uri += "board/" + board + "/backlog";
			request(req)
			.then(function(response) {
				log.debug({"board": board}, "Resolved");
				var head = JSON.parse(response.body);
				if(head.total < head.maxResults) {
					done([head.issues]);
				} else {
					var scan = [];
					var pages = head.total/head.maxResults;
					for(var page = 1; page < pages; page++) {
						log.debug({"board": board, "page": page, "start": page * head.maxResults, "end": (page+1) * head.maxResults}, "Resolving Page");
						scan.push(new Promise(function(done, fail) {
							var report = page;
							var paged = Object.assign({}, base);
							paged.uri += "board/" + board + "/backlog?startAt=" + page * head.maxResults;
							request(paged)
							.then(function(response) {
								log.debug({"board": board, "page": report}, "Resolved Page");
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
	
	var cast = function(issues) {
		return new Promise(function(done, fail) {
			log.debug("Casting Board");
			done(new Board(issues));
		});
	};
};
