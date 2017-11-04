/**
 * 
 * 
 * @class JenkinsJob
 * @module Jenkins
 * @param {String} name
 * @param {Object} config xml2js Object specification for an XML file representing the job config.xml file 
 */
module.exports = function(name, config) {
	this.name = name;
	this.config = config;
};
