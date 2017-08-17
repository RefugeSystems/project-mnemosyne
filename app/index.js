
module.exports.Connections = require("./connections/");

/**
 * 
 * @module Main
 * @class IntegratredService
 * @constructor
 * @param {Connections} connections Contains the connections to JIRA, GitLab, ServiceNow, and Jenkins
 */
module.exports.IntegratedService = function(connections) {
	var cookieParser = require("cookie-parser");
	var bodyParser = require("body-parser");
	var xmlParse = require("xml-parser");
	var Case = require("./memory/test-case");

	/* Build express path management */
	var app = this.app = require("express")();

	/* Bind General Express Middleware */
	app.use(cookieParser());
	app.use(function(req, res, next) {
		req.setEncoding("utf8");
		req.rawBody = "";
		req.on("data", function(chunk) {
			req.rawBody += chunk;
		});
		req.on("end", function(){
			next();
		});
	});
	app.use(bodyParser.json({
		inflate: false,
		limit: "50mb"
	}));
	app.use(bodyParser.urlencoded({
		extended: false,
		limit: "50mb"
	}));

	var testParser = function(parsedXML) {
		var parsed = {
			"Case-None": []
		};
		
		var sentence, issues;
		parsedXML.root.children.forEach(function(suites) {
			if(suites.name === "suites" && suites.children) {
				suites.children.forEach(function(node) {
					if(node.name === "suite" && node.children) {
						node.children.forEach(function(cases) {
							if(cases.name === "cases" && cases.children) {
								cases.children.forEach(function(unit) {
									var track = new Case(unit);
									if(track.issues) {
										track.issues.forEach(function(i) {
											parsed[i] = parsed[i] || [];
											parsed[i].push(track);
										});
									} else {
										parsed["Case-None"].push(track)
									}
								});
							}
						});
					}
				});
			}
		});
		
		console.log("Parsed:\n", parsed);
	};
	
	/* Bind routes */
	app.post("/project/:project/tests", function(req, res) {
		var xml = xmlParse(req.rawBody);
		//console.log(JSON.stringify(xml, null, 4));
		testParser(xml);
		res.json({"message": "done"});
	});

	/* Wrap up */
	app.use(function(error, req, res, next) {
		if(error) {
			console.log("Error:\n", error, "\nStack:\n", error.stack)
		}
		res.json({"code": 404, "statusCode": "HTTP404", "message": "Not Found", "uri": req.path, "error": JSON.stringify(error), "stack": error?error.stack:"none"});
	});
};
