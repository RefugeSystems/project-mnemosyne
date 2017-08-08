var Bunyan = require("Bunyan");

var settings = require("./settings.json");
var AuthorizationBasic = require("../jira/authentication-basic");
var JIRAConnection = require("../jira/connection.js");

/**
 * 
 * @class Configuration
 * @constructor
 * @static
 */
module.exports = (function() {
	var configuration = {};
	var loading;
	
	var buildAuthentication = function(details) {
		switch(details.type) {
			case "basic":
				return new AuthorizationBasic(details.username, details.password);
			default:
				throw new Error("Unknown authentication type");
		}
	};
	
	/**
	 * The package.json information
	 * @property package
	 * @type Object
	 */
	configuration.package = require("../../package.json");

	/**
	 * 
	 * @property log
	 * @type Bunyan
	 */
	if(settings.log) {
		configuration.log = settings.log;
		configuration.log.name = configuration.log.name || configuration.package.name;
		configuration.log.version = configuration.log.version || configuration.package.version;
		configuration.log = Bunyan.createLogger(configuration.log);
	}
	
	/**
	 * If a valid JIRA property is valid on the settings object, this
	 * property is initialized as the default JIRA handler.
	 * @property jira
	 * @type JIRAConnection
	 */
	if(settings.jira && settings.jira.name && settings.jira.uri && settings.jira.authentication) {
		loading = buildAuthentication(settings.jira.authentication);
		configuration.jira = new JIRAConnection(settings.jira.name, settings.jira.uri, loading, configuration.log, settings.jira);
	} else {
		console.warn("Default JIRA Connection Omitted");
	}
	
	return configuration;
})();
