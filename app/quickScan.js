var Configuration = require("./configuration/index.js");
var AlgorithmGeneral = require("./algorithm/general.js");

var start = Date.now();
var boardID = parseInt(process.argv[2]);
if(isNaN(boardID)) {
	throw new Error("Invalid Board Identifier: " + process.argv[2]);
}

var fetch = Configuration.jira.getBacklog(boardID);
console.log("Fetching Board");

fetch.then(function(board) {
	console.log("Board Length[" + (Date.now() - start) + "ms]: " + board.issues.length);
})
.catch(function(fail) {
	console.log(fail);
});

var argument = 3;
while(process.argv[argument]) {
	switch(process.argv[argument++]) {
		case "index":
			console.log("Then -> Print");
			fetch = fetch.then(function(board) {
				return new Promise(function(done) {
					index = parseInt(process.argv[argument++]);
					console.log(JSON.stringify(board.issues[index], null, 4));
					done(board);
				});
			});
			break;
		case "key":
			console.log("Then -> Print");
			fetch = fetch.then(function(board) {
				return new Promise(function(done) {
					index = parseInt(process.argv[argument++]);
					console.log(JSON.stringify(board.lookup[index], null, 4));
					done(board);
				});
			});
			break;
		case "keys":
			console.log("Then -> Keys");
			fetch = fetch.then(function(board) {
				return new Promise(function(done) {
					console.log(JSON.stringify(board.keys));
					done(board);
				});
			});
			break;
		case "roadmap":
			console.log("Then -> Roadmap Dates");
			fetch = fetch.then(AlgorithmGeneral.roadmapDates);
			break;
		case "roadmap-clear":
			console.log("Then -> Clear Roadmap Dates");
			fetch = fetch.then(AlgorithmGeneral.releaseDates);
			break;
		case "releases":
			console.log("Then -> Release Dates");
			fetch = fetch.then(roadmapDatesClear);
			break;
		case "releases-clear":
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

fetch.catch(function(fail) {
	console.log("Error in quick access chain:\n", fail);
});
