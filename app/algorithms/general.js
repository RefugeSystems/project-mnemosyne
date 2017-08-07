
var Algorithm = require("./algorithm.js")

/**
 * 
 * @class GeneralAlgorithm
 * @constructor
 * @extends Algorithm
 * @param {String} name
 */
module.exports = function(name) {
	this.__proto__ = new Algotithm(name);
	
	this.process = function(issues, options) {
		return new Promise(function(done, fail) {
			var processing = {
				date: {
					today: options.start
				},
				current: {
					sprintOffset: 0,
					sprintCost: 0
				},
				deadlines: options.deadlines,
				releases: {},
				labels: {},
				components: {},
				issues: {}
			};
			
			if(!processing.date.today) {
				today = new Date();
				today.setHours(-1 * 24 * today.getDay());
				today.setHours(0);
				today.setMinutes(0);
				today.setSeconds(0);
				today.setMilliseconds(0);
			}
			
			var computing = [];
			var computed;
			
			issues.forEach(function(issue) {
				computed = computeEnd(issue, processing)
				.then(compute("release"))
				.then(compute("label"))
				.then(compute("components"));
				computing.push(computed);
			});
			
			Promise.all(computing)
			.then(done)
			.catch(fail);
		});
	};
	
	/**
	 * 
	 * @method computeEnd
	 * @private
	 * @param {Issue} issue
	 * @param {Object} processing
	 * @return {Promise | Object} 
	 */
	var computeEnd = function(issue, processing) {
		return new Promise(function(done, fail) {
			
		});
	};

	/**
	 * 
	 * @method compute
	 * @private
	 * @param {String} field
	 * @return {Function}
	 */
	var compute = function(field) {
		return function(processing) {
			return new Promise(function(done, fail) {
				
			});
		};
	};
};
