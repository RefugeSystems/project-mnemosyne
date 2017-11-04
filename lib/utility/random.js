"use strict";

/**
 * Provides a suite of functions for generating random data.
 * @class Random
 * @constructor
 * @static
 */

/**
 * Quick reference array for generating random strings
 * @private
 * @property alphanumeric
 * @type Array
 */
var alphanumeric = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

/**
 * <p>Method for getting a random floating point number x | min <= x < min + range</p>
 * <p>As an example, random(5) will yield a number between 0 and 5 where as
 * random(5,5) will yield a number between 5 and 10.<p>
 * @private
 * @method number
 * @param {Number} range The "width" of the range of numbers desired.
 * @param {Number} min The minimum number desired.
 * @return {Number} A random number.
 */
module.exports.number = function(range, min) {
	if(min) {
		return Math.random() * range + min;
	}
	return Math.random() * range;
};

/**
 * <p>Method for getting a random integer x | min <= x < min + range</p>
 * <p>As an example, random(5) will yield a number between 0 and 4 where as
 * random(5,5) will yield a number between 5 and 9.<p>
 * @private
 * @method integer
 * @param {Number} range The "width" of the range of numbers desired.
 * @param {Number} min The minimum number desired.
 * @return {Number} A random number.
 */
module.exports.integer = function(range, min) {
	if(min) {
		return Math.floor(Math.random() * range + min);
	}
	return Math.floor(Math.random() * range);
};

/**
 * Get a random alphanumeric string (ie. matches pattern ^[a-zA-Z0-9]*$.
 * @private
 * @method string
 * @param {Number} len The desired length for the returned String.
 * @return {String} A random alphanumeric string
 */
module.exports.string = function(len) {
	if(len) {
		var string = alphanumeric[module.exports.integer(alphanumeric.length)];
		while(string.length < len) {
			string += alphanumeric[module.exports.integer(alphanumeric.length)];
		}
		return string;
	} else{
		return null;
	}
};
