
var Algorithm = require("./algorithm");
var Release = require("../jira/release");

/**
 * 
 * @class GeneralAlgorithm
 * @constructor
 * @extends Algorithm
 * @param {String} name
 */
module.exports = function(name, options) {
	var algo = this;
	this.__proto__ = new Algorithm(name);
//	this.prototype = Algorithm; 
	
	
	this.process = function(board, options) {
		options = options || {};
		return new Promise(function(done) {
			var sprint = {
				offset: 0,
				points: options.points || algo.points(),
				duration: options.duration || algo.duration()
			};
			
			var deadlines = options.deadlines;
			var current, releases = {};
			var points = 0;

			var start = options.start;
			if(!start) {
				start = new Date();
				start.setHours(-1 * 24 * start.getDay());
				start.setHours(0);
				start.setMinutes(0);
				start.setSeconds(0);
				start.setMilliseconds(0);
			}
			start = start.getTime();
			var now = start;
			var finish = now + sprint.duration;
			
			board.keys.forEach(function(key, index) {
				current = {};
				
				/* Validate Issue */
				if(board.lookup[key].issuelinks && board.lookup[key].issuelinks.length) {
					board.lookup[key].issuelinks.forEach(function(link) {
						if(link.outwardIssue) {
							link = link.outwardIssue;
							var track = board.keys.indexOf(link.key);
							if(track === -1) {
								board.lookup[key].exceptions.push("Issue is dependent on a non-existent issue key: " + link.key);
							} else if(track > index) {
								board.lookup[key].exceptions.push("Issue is out of order per dependency (Uses) regarding " + link.key);
							}
						} else if(link.inwardIssue) {
							link = link.inwardIssue;
							var track = board.keys.indexOf(link.key);
							if(track === -1) {
								board.lookup[key].exceptions.push("Issue has a dependency on a non-existent issue key: " + link.key);
							} else if(track < index) {
								board.lookup[key].exceptions.push("Issue is out of order per dependency (Feeds) regarding " + link.key);
							}
						} else {
							throw new Error("Link without inward or outward data");
						}
					});
				}
				
				/* Index Issue */
				points += board.lookup[key].points;
				if(board.lookup[key].fixVersions && board.lookup[key].fixVersions.length) {
					board.lookup[key].fixVersions.forEach(function(rls) {
						current[rls.id] = releases[rls.id];
						if(!current[rls.id]) {
							releases[rls.id] = new Release(rls);
							board.releases[rls.id] = releases[rls.id];
							current[rls.id] = releases[rls.id];
						}
					});
				}
				
				/* Check for Sprint Increment */
				while(points >= sprint.points) {
					points -= sprint.points;
					now += sprint.duration;
					finish += sprint.duration;
//					console.log("Adjusting Points: " + points + "\n\tNow: " + now + "\n\tFinish: " + finish);
				}
				
				/* Update Issue Data */
				board.lookup[key].roadmapdate = finish;
				Object.keys(current).forEach(function(ckey) {
					current[ckey].releaseDate = finish;
				});
			});
			
			done(board);
		});
	};
};

//module.exports.prototype = Algorithm; 
