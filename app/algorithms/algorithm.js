var request = require("request-promise");

/**
 * 
 * @class Algorithm
 * @constructor
 * @param {String} name
 */
module.exports = function(name) {
	/**
	 * 
	 * @property name
	 * @type String
	 */
	this.name = name;
	
	/**
	 * 
	 * @method points
	 * @param {Number} [points] 
	 * @return {Number}
	 */
	this.points = function() {
		
	};
	
	/**
	 * 
	 * @method duration
	 * @param {Number} [duration] Time duration for the sprint in milliseconds.
	 * @return {Number}
	 */
	this.duration = function() {
		
	};

	/**
	 * 
	 * @method process
	 * @param {Array | Card} cards The cards for the backlog in order.
	 */
	this.process = function() {
		
	};
};
