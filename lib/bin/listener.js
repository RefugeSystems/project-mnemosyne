"use strict";

var http = require('http');
var https = require("https");
var configuration = require('../configuration/');

if(configuration.endpoint) {
	var erroring = function(error) {
		switch (error.code) {
			case "EACCES":
				console.log("Access denied for listening on port: " + configuration.listen);
				process.exit(1);
				break;
			case "EADDRINUSE":
				console.log("Port already in use: " + configuration.listen);
				process.exit(1);
				break;
			default:
				console.log("An unusual error occurred during startup:\n>\t", error.message, "\nStack:\n", error.stack, "\nError:\n", error);
				throw error;
		}
	}
	
	var listening = function() {
		var addr = server.address();
		var bound = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
		console.log("REST Server bound: " + bound);
	}

	var server;
	var service = require("../");
	service = new service.IntegratedService();

	if(configuration.endpoint.key && configuration.endpoint.cert) {
		server = https.createServer({
			key: configuration.endpoint.key,
			cert: configuration.endpoint.cert
		}, service.app);
	} else {
		server = http.createServer(service.app);
	}
	
	server.listen(configuration.endpoint.listen);
	server.on("error", erroring);
	server.on("listening", listening);
} else {
	console.log("Endpoint Service has no configuration");
}
