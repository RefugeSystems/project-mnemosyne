var btoa = require("btoa");

/**
 * 
 * @class BasicAuthentication
 * @constructor
 * @param {String} username
 * @param {String} password
 */
module.exports = function(username, password) {
	/**
	 * 
	 * @property auth
	 * @private
	 * @type String
	 */
	var auth = "Basic " + btoa(username + ":" + password);
	
	/**
	 * 
	 * Additionally guarantees the passed object exists.
	 * @method authorize
	 * @param {RequestOptions} request
	 * @return {RequestOptions} The passed object with authorization information added.
	 */
	this.authorize = function(request) {
		request = request || {};
		request.headers = request.headers || {};
		request.headers.authorization = auth;
		return request;
	};
};
