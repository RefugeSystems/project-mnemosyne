var Configuration = require("./configuration/index.js");
var AlgorithmGeneral = require("./algorithms/general.js");

var start = Date.now();
var boardID = parseInt(process.argv[2]);
if(isNaN(boardID)) {
	//throw new Error("Invalid Board Identifier: " + process.argv[2]);
	console.log("Non-Int Identifier");
	boardID = process.argv[2];
}

var options = {};
var fetch;

//fetch = Configuration.jira.getBacklog(boardID);
fetch = Configuration.jira.getProject(boardID);
console.log("Fetching Board");

fetch
	.then(function(board) {
		console.log("Board Length[" + (Date.now() - start) + "ms]: " + board.issues.length);
	})
	.catch(function(fail) {
		console.log("Failed: " + (fail?fail.message:"Unknown"));
		//console.log(fail);
	});

var argument = 3;
while(process.argv[argument]) {
	switch(process.argv[argument++]) {
	case"help":
		console.log("Help: [index, original, key, keys, option, roadmap, releases, roadmap-clear, releases-clear]");
		break;
	case"index":
		(function() {
			var index = process.argv[argument++];
			console.log("Then -> Print Issue by Index[" + index + "]");
			fetch = fetch.then(function(board) {
				return new Promise(function(done) {
					index = parseInt(index);
					console.log(JSON.stringify(board.issues[index], null, 4));
					done(board);
				});
			});
		})();
		break;
	case"original":
		(function() {
			var index = process.argv[argument++];
			console.log("Then -> Print Original Issue by Index[" + index + "]");
			fetch = fetch.then(function(board) {
				return new Promise(function(done) {
					index = parseInt(index);
					console.log(JSON.stringify(board.issues[index].getOriginal(), null, 4));
					done(board);
				});
			});
		})();
		break;
	case"key":
		(function() {
			var key = process.argv[argument++];
			console.log("Then -> Print Issue by Key[" + key + "]");
			fetch = fetch.then(function(board) {
				return new Promise(function(done) {
					console.log(JSON.stringify(board.lookup[key], null, 4));
					done(board);
				});
			});
		})();
		break;
	case"raw":
		(function() {
			var key = process.argv[argument++];
			console.log("Then -> Print Issue by Key[" + key + "]");
			fetch = fetch.then(function(board) {
				return new Promise(function(done) {
					console.log(JSON.stringify(board.lookup[key].getOriginal(), null, 4));
					done(board);
				});
			});
		})();
		break;
	case"keys":
		console.log("Then -> Keys");
		fetch = fetch.then(function(board) {
			return new Promise(function(done) {
				console.log(JSON.stringify(board.keys));
				done(board);
			});
		});
		break;
	case"releases":
		console.log("Then -> Print Releases");
		(function() {
			fetch = fetch.then(function(board) {
				return new Promise(function(done) {
					console.log(JSON.stringify(board.releases, null, 4));
					done(board);
				});
			});
		})();
		break;
	case"issues":
		console.log("Then -> Print Issues");
		(function() {
			fetch = fetch.then(function(board) {
				return new Promise(function(done) {
					console.log(JSON.stringify(board.issues, null, 4));
					done(board);
				});
			});
		})();
		break;
	case"issue-keys":
		console.log("Then -> Print Issues by Keys");
		(function() {
			fetch = fetch.then(function(board) {
				return new Promise(function(done) {
					board.issues.forEach(function(issue, i) {
						console.log("[" + spaceWidth(i, 4) + "]: " + issue.key);
					});
					done(board);
				});
			});
		})();
		break;
	case"summaries":
		console.log("Then -> Print Issue Summaries");
		(function() {
			fetch = fetch.then(function(board) {
				return new Promise(function(done) {
					board.issues.forEach(function(issue) {
						console.log(issue.summary);
					});
					done(board);
				});
			});
		})();
		break;
	case"exceptions":
		console.log("Then -> Print Issues with Exceptions");
		(function() {
			fetch = fetch.then(function(board) {
				return new Promise(function(done) {
					console.log(">\tIssues with exceptions");
					board.issues.forEach(function(i) {
						if(i.exceptions.length) {
							console.log(JSON.stringify(i, null, 4));
						}
					});
					console.log("<\tIssues with exceptions");
					done(board);
				});
			});
		})();
		break;
	case"option":
		(function() {
			var key = process.argv[argument++];
			var value = process.argv[argument++];
			console.log("Then -> Set Option[" + key + " => " + value + "]");
			fetch = fetch.then(function(board) {
				return new Promise(function(done) {
					options[key] = value;
					done(board);
				});
			});
		})();
		break;
	case"roadmap":
		(function() {
			var algorithm = process.argv[argument++];
			console.log("Then -> Calculate Roadmap Dates [" + algorithm + "]");
			fetch = fetch.then(function(board) {
				switch(algorithm) {
				case"general":
					console.log(Object.keys(AlgorithmGeneral));
					var algo = new AlgorithmGeneral("quick", options);
					return algo.process(board, options);
				default:
					return new Promise(function(done, fail) {
						fail("Unknown Algorithm for board date calculation: " + algorithm);
					});
				}
			});
		})();
		break;
	case"roadmap-save":
		console.log("Then -> Save Roadmap Dates");
		(function() {
			fetch = fetch.then(function(board) {
				return new Promise(function(done, fail) {
					var chaining = null;
					board.issues.forEach(function(issue) {
						if(chaining) {
							chaining.then(function() {
								return Configuration.jira.updateIssue(issue);
							});
						} else{
							chaining = Configuration.jira.updateIssue(issue);
						}
					});
					chaining
						.then(function() {
							done(board);
						})
						.catch(fail);
				});
			});
		})();
		break;
	case"roadmap-clear":
		console.log("Then -> Clear Roadmap Dates");
		fetch = fetch.then(AlgorithmGeneral.releaseDates);
		break;
	case"releases":
		console.log("Then -> Calculate Release Dates");
		fetch = fetch.then(roadmapDatesClear);
		break;
	case"release-save":
		console.log("Then -> Save Release Dates");
		(function() {
			fetch = fetch.then(function(board) {
				return new Promise(function(done, fail) {
					var chaining = null;
					Object.keys(board.releases).forEach(function(id) {
						if(chaining) {
							chaining.then(function() {
								return Configuration.jira.updateRelease(board.releases[id]);
							});
						} else{
							chaining = Configuration.jira.updateRelease(board.releases[id]);
						}
					});
					chaining
						.then(function() {
							done(board);
						})
						.catch(fail);
				});
			});
		})();
		break;
	case"releases-clear":
		console.log("Then -> Clear Release Dates");
		fetch = fetch.then(releaseDatesClear);
		break;
	default:
		console.warn("Unknown Quick Option: " + process.argv[argument-1]);
	}
}

var roadmapDatesClear = function(board) {
	return new Promise(function(done, fail) {
		throw new Error("Roadmap Date Clear Not Implemented");
		done(board);
	});
};

var releaseDatesClear = function(board) {
	return new Promise(function(done, fail) {
		throw new Error("Release Date Clear Not Implemented");
		done(board);
	});
};

var spaceWidth = function(string, width) {
	while(string.length < width) {
		width = " " + width;
	}
};

fetch.catch(function(fail) {
	//console.log("Error in quick access chain");
	console.log("Error in quick access chain:\n", fail, "\n", fail.stack);
});
