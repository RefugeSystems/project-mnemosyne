
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
	this.__proto__ = Object;
	options = options || {};

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
	this.first = function(start) {
		if(start) {
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
	this.points = function(expected) {
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
	 * @param {Board} board 
	 * @return {Promise | > | Board}
	 */
	this.process = function() {
		throw new Error("Process Method not Implemented");
	};
};
