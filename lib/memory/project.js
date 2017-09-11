"use strict";

var Memory = require("./_memory");

/**
 * 
 * @class Project
 * @constructor
 * @extends Memory
 * @param {Object} source
 */
module.exports = function(source) {
	this.__proto__ = new Memory(source);
	
	
	this.issues = [];
	
	
	this.jobs = [];
	
	
	this.repositories = [];
	
	
	this.tests = [];
	
	
	this.trackIssue = function(issue) {
		
	};
	
	
	this.trackJob = function(job) {
		
	};
	
	
	this.trackRepository = function(repo) {
		
	};
	
	
	this.trackTest = function(test) {
		
	};
};
