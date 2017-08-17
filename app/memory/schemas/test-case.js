"use strict";

var Schema = require("mongoose").Schema;

var Memory = require("./_memory");

/**
 * 
 * @class Schema:TestCase
 * @constructor
 * @param {Object} node XML Node describing the test case in JUnit format as parsed by the xml-parser.
 */
module.exports = function(node) {
	var track = {};
	
	track.issues = undefined;
	track.description = "";
	track.skipped = false;
	track.passed = true;
	
	node.children.forEach(function(child) {
		if(child.name === "className") {
			track.description += child.content + " ";
		} else if(child.name === "testName") {
			if(child.content[child.content.length - 1] === "]") {
				track.issues = child.content.lastIndexOf("[");
				track.issues = child.content.substring(track.issues+1, child.content.length - 1);
				track.issues = track.issues.replace(/\s/gi, "");
				track.issues = track.issues.split(",");
			}
			track.description += child.content;
		} else if(child.name === "skipped") {
			track.skipped = child.content !== "false";
		} else if(child.name === "failedSince") {
			track.passed = child.content === "0" && child.children.length === 0;
		}
	});
	
	track.description = track.description.replace(/\./gi, " ") + ".";
	
	track._model = module.exports._model;
	this.__proto__ = new Memory(track);
	this.toJSON = function() {
		return {
			"issues": this.issues,
			"description": this.description,
			"skipped": this.skipped,
			"passed": this.passed,
		}
	};
};


module.exports._model = null;


module.exports._schema = new Schema({
	issues: [String],
	description: String,
	skipped: Boolean,
	passed: Boolean
});


module.exports.__proto__ = Memory;
