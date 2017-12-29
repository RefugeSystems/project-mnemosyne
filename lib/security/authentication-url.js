/**
 * 
 * @class URLAuthentication
 * @constructor
 * @param {String} username 
 * @param {String} password
 */
module.exports = function(username, password) {

	this.username = username;
	this.password = password;
	
	/**
	 * 
	 * Additionally guarantees the passed object exists.
	 * @method authorize
	 * @param {RequestOptions} request
	 * @return {RequestOptions} The passed object with authorization information added.
	 */
	this.authorize = function(request) {
		//TODO: Regex request.url to split up where to put the login info with the "@" convention
		return request;
	};
};
