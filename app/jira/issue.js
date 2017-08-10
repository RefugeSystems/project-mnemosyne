
var format = require("dateformat");



var pointField = "customfield_10006";

var roadmapField = "customfield_10101"

/**
 * 
 * @class Issue
 * @constructor
 * @property {Object} details
 */
module.exports = function(details) {
	var issue =  this;
	
	/**
	 * Original 
	 * @property _detail
	 * @private
	 * @type Object
	 */
	var _detail = details;
//	this._detail = details;
	
	/**
	 * 
	 * @property id
	 * @type String
	 */
	this.id = details.id;
	
	/**
	 * 
	 * @property points
	 * @type String
	 */
	this.points = details.fields[pointField];
	
	/**
	 * 
	 * @property isselinks
	 * @type Array | > | LinkDescriptions
	 */
	this.issuelinks = details.issuelinks;
	
	/**
	 * 
	 * @property self
	 * @type String
	 */
	this.self = details.self;
	
	/**
	 * 
	 * @property self
	 * @type String
	 */
	this.self = details.self;
	
	/**
	 * 
	 * @property key
	 * @type String
	 */
	this.key = details.key;
	
	/**
	 * 
	 * @property issue
	 * @type String
	 */
	this.issue = details.fields.issue;
	
	/**
	 * 
	 * @property timespent
	 * @type String
	 */
	this.timespent = details.fields.timespent;
	
	/**
	 * 
	 * @property project
	 * @type String
	 */
	this.project = details.fields.project;
	
	/**
	 * 
	 * @property fixVersions
	 * @type String
	 */
	this.fixVersions = details.fields.fixVersions;
	
	/**
	 * 
	 * @property labels
	 * @type String
	 */
	this.labels = details.fields.labels;
	
	/**
	 * 
	 * @property issuelinks
	 * @type String
	 */
	this.issuelinks = details.fields.issuelinks;
	
	/**
	 * 
	 * @property assignee
	 * @type String
	 */
	this.assignee = details.fields.assignee;
	
	/**
	 * 
	 * @property summary
	 * @type String
	 */
	this.summary = details.fields.summary;
	
	/**
	 * 
	 * @property description
	 * @type String
	 */
	this.description = details.fields.description;
	
	/**
	 * 
	 * @property timeestimate
	 * @type String
	 */
	this.timeestimate = details.fields.timeestimate;
	
	/**
	 * 
	 * @property priority
	 * @type String
	 */
	this.priority = details.fields.priority;
	
	/**
	 * 
	 * @property duedate
	 * @type Number
	 */
	this.duedate = details.fields.duedate;
	if(this.duedate) {
		this.duedate = new Date(this.duedate).getTime();
	}
	
	/**
	 * 
	 * @property roadmapdate
	 * @type Number
	 */
	this.roadmapdate = details.fields[roadmapField];
	if(this.roadmapdate) {
		this.roadmapdate = new Date(this.roadmapdate).getTime();
	}
	
	/**
	 * Descriptions of exceptions found such as dependency order violations.
	 * @property exceptions
	 * @type Array | > | String
	 */
	this.exceptions = [];
	
	/**
	 * 
	 * @method toSave
	 * @return {Object}
	 */
	this.toSave = function() {
		var tmp, saving = {
			"key": issue.key,
			"id": issue.id,
			"fields": {}
		};
		
		saving["fields"][roadmapField] = issue.roadmapdate;
		if( saving["fields"][roadmapField]) {
			var d = new Date(saving["fields"][roadmapField]);
			saving["fields"][roadmapField] = format(d, "yyyy-mm-dd") + "T" + format(d, "hh:MM:ss.lo");
		}
		
		return saving;
	};
};
