var request = require("request-promise");

var DURATION_TwoWeeks = 1000 * 60 * 60 * 24 * 14;
var DURATION_OneWeeks = 1000 * 60 * 60 * 24 * 7;

/**
 * 
 * @class Algorithm
 * @constructor
 * @param {String} name
 * @param {Object} options
 */
module.exports = function(name, options) {

	
	var points = options.points || 10;
	var duration = options.duration || DURATION_TwoWeeks;
	var first = options.first || 1; // Monday
	
	/**
	 * 
	 * @property name
	 * @type String
	 */
	this.name = name;
	
	/**
	 * The first day of the sprint.
	 * 
	 * 0: Sunday
	 * 1: Monday  
	 * 2: Tuesday 
	 * ...   
	 * 
	 * @method first
	 * @param {Number} [start] 
	 * @return {Number}
	 */
	this.points = function() {
		if(expected) {
			first = start;
		}
		return first;
	};
	
	/**
	 * 
	 * @method points
	 * @param {Number} [expected] 
	 * @return {Number}
	 */
	this.points = function() {
		if(expected) {
			points = expected;
		}
		return points;
	};
	
	/**
	 * 
	 * @method duration
	 * @param {Number} [time] Duration for the sprint in milliseconds.
	 * @return {Number}
	 */
	this.duration = function(time) {
		if(time) {
			duration = time;
		}
		return duration;
	};

	/**
	 * 
	 * @method process
	 * @param {Array | Issue} issues An ordered array of issues from the backlog.
	 * @return {Promise | Array | Issue}
	 */
	this.process = function() {
		throw new Error("Process Method not Implemented");
	};
};
