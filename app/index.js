
/**
 * 
 * @module Main
 * @class IntegratredService
 * @constructor
 * @param {Object} options Contains the connections to JIRA, GitLab, ServiceNow, and Jenkins
 */
module.exports.IntegratedService = function(options) {
	var cookieParser = require("cookie-parser");
	var bodyParser = require("body-parser");
	var xmlParse = require("xml-parser");

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
			"unknown": []
		};
		
		parsedXML.root.
	};
	
	/* Bind routes */
	app.post("/test", function(req, res) {
		var xml = xmlParse(req.rawBody);
		console.log(JSON.stringify(xml, null, 4));
		res.json({"message": "done"});
	});

	/* Wrap up */
	app.use(function(error, req, res, next) {
		res.json({"code": 404, "statusCode": "HTTP404", "message": "Not Found", "uri": req.path, "error": JSON.stringify(error), "stack": error?error.stack:"none"});
	});
};
