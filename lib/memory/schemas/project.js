"use strict";

var Schema = require("mongoose").Schema;

var Memory = require("./_memory");
var IDSchema = require("./_idschema");

var Issue = require("./issue")._schema;
var Job = require("./job")._schema;
var Repository = require("./repository")._schema;
var TestCase = require("./test-case")._schema;

/**
 * 
 * @class Schema:Project
 * @constructor
 * @extends Schema:Memory
 * @param {Object} source
 */
module.exports = function(source) {
	this.__proto__ = new Memory(source);
	
};


module.exports._model = null;


module.exports._schema = new Schema({
	/**
	 * Internal identifier for tracking, created by MongoDB on saving.
	 * @property _id
	 * @type ObjectId
	 */
	
	/**
	 * 
	 * @property name
	 * @type String
	 */
	name: String,

	/**
	 * 
	 * @property description
	 * @type String
	 */
	description: String,
	
	/**
	 * 
	 * @property id
	 * @type Object
	 */
	id: idSchema,
	
	
	issues: [Issue],
	jobs: [Job],
	repositories: [Repository],
	tests: [TestCase]
});