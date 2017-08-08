/**
 * 
 * @class Issue
 * @constructor
 * @param {Object} details
 */
module.exports = function(details) {
	this.fields = {};
	
	/**
	 * Original 
	 * @property _detail
	 * @type Object
	 */
	this._detail = details;
	
	/**
	 * 
	 * @param id
	 * @type String
	 */
	this.id = details.id;
	
	/**
	 * 
	 * @param self
	 * @type String
	 */
	this.self = details.self;
	
	/**
	 * 
	 * @param key
	 * @type String
	 */
	this.key = details.key;
	
	/**
	 * 
	 * @param fields.issue
	 * @type String
	 */
	this.fields.issue = details.fields.issue;
	
	/**
	 * 
	 * @param fields.timespent
	 * @type String
	 */
	this.fields.timespent = details.fields.timespent;
	
	/**
	 * 
	 * @param fields.project
	 * @type String
	 */
	this.fields.project = details.fields.project;
	
	/**
	 * 
	 * @param fields.fixVersions
	 * @type String
	 */
	this.fields.fixVersions = details.fields.fixVersions;
	
	/**
	 * 
	 * @param fields.labels
	 * @type String
	 */
	this.fields.labels = details.fields.labels;
	
	/**
	 * 
	 * @param fields.issuelinks
	 * @type String
	 */
	this.fields.issuelinks = details.fields.issuelinks;
	
	/**
	 * 
	 * @param fields.assignee
	 * @type String
	 */
	this.fields.assignee = details.fields.assignee;
	
	/**
	 * 
	 * @param fields.summary
	 * @type String
	 */
	this.fields.summary = details.fields.summary;
	
	/**
	 * 
	 * @param fields.description
	 * @type String
	 */
	this.fields.description = details.fields.description;
	
	/**
	 * 
	 * @param fields.timeestimate
	 * @type String
	 */
	this.fields.timeestimate = details.fields.timeestimate;
	
	/**
	 * 
	 * @param fields.priority
	 * @type String
	 */
	this.fields.priority = details.fields.priority;
	
	/**
	 * 
	 * @param fields.duedate
	 * @type String
	 */
	this.fields.duedate = details.fields.duedate;
};
