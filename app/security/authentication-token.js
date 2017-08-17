var btoa = require("btoa");

/**
 * 
 * @class TokenAuthentication
 * @constructor
 * @param {String} field The field that names the token 
 * @param {String} token The value of the token to pass for authentication
 * @param {String} [path] Indicates if the field is in the header, body, or query. Header by default.
 */
module.exports = function(field, token, path) {
	path = path || "header";

	/**
	 * 
	 * Additionally guarantees the passed object exists.
	 * @method authorize
	 * @param {RequestOptions} request
	 * @return {RequestOptions} The passed object with authorization information added.
	 */
	this.authorize = function(request) {
		request = request || {};
		request.query = request.query || {};
		request.headers = request.headers || {};
		
		var wrapBody = false;
		
		switch(path) {
			case "header":
				request.headers[field] = token;
				break;
			case "query":
				request.query[field] = token;
				break;
			case "body":
				if(request.body) {
					if(typeof request.body === "string") {
						request.body = JSON.parse(request.body);
						wrapBody = true;
					}
				} else {
					request.body = {};
				}
				request.body[field] = token;
				if(wrapBody) {
					request.body = JSON.stringify(request.body);
				}
				break;
		}
		
		
		return request;
	};
};
