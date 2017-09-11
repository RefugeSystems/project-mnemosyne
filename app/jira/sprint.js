var Issue = require("./issue");

/**
 * 
 * @class Board
 * @constructor
 * @param {Array | > | Issue} issues
 */
module.exports = function(issues) {
	var sprint = this;

	/**
	 * Ordered array of the keys within the Board
	 * @property keys
	 * @type Array | > | String
	 */
	this.keys = [];

	/**
	 * 
	 * @property issues
	 * @type Array | > | Issue
	 */
	this.issues = [];

	/**
	 * 
	 * @property lookup
	 * @type Object | > | Issue
	 */
	this.lookup = {};

	/**
	 * 
	 * @property releases
	 * @type Object | > | Release
	 */
	this.releases = {};

	/**
	 * Set after board creation in all cases.
	 * @property id
	 * @private
	 * @type String
	 * @default null
	 */
	var id = null;

	/**
	 * 
	 * @method setID
	 * @param {String} identifier
	 */
	this.setID = function(identifier) {
		id = identifier;
	};

	/**
	 * 
	 * @method getID
	 * @return {String}
	 */
	this.getID = function() {
		return id;
	};

	var x, y;
	for(x=0;x<issues.length;x++) {
		try{
			issues[x] = new Issue(issues[x]);
			sprint.keys.push(issues[x].key);
			sprint.issues.push(issues[x]);
			sprint.lookup[issues[x].key] = issues[x];
		} catch(exception) {
			console.log("Failed to parse Issue: " + exception.message + "\r\n" + exception.stack + "\r\n" + JSON.stringify(issues[x], null, 4));
		}
	}
};
