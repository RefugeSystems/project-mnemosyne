"use strict";

/**
 * 
 * @class Memory
 * @constructor
 */
module.exports = function(source) {
	this.name = source.name || source.title || source.display;
	this.description = source.description;
	this.id = {};
	this.id.gitlab = source.gitlab;
	this.id.jira = source.jira;
	this.id.jenkins = source.jenkins;
	this.id.snow = source.snow;
};
