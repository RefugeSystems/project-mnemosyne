
var releases = {};

/**
 * 
 * @class Release
 * @constructor
 * @param {Object} details
 */
module.exports = function(details) {
	if(releases[details.id]) {
		return releases[details.id];
	}
	
	var release = this;

	/**
	 * 
	 * @property id
	 * @type String
	 */
	this.id = details.id;

	/**
	 * 
	 * @property name
	 * @type String
	 */
	this.name = details.name;

	/**
	 * 
	 * @property link
	 * @type String
	 */
	this.link = details.self;
	
	/**
	 * 
	 * @property issues
	 * @type Array | > | Issue
	 */
	this.issues = [];

	/**
	 * 
	 * @property releaseDate
	 * @type Number
	 */
	this.releaseDate = details.releaseDate;
	if(this.releaseDate) {
		this.releaseDate = new Date(this.releaseDate).getTime();
	}
	
	
	this.toJSON = function() {
		var returning = {};
		Object.assign(returning, release);
		returning.issues = [];
		release.issues.forEach(function(issue) {
			returning.issues.push(issue.key);
		});
		return returning;
	};
	
	this.toString = function() {
		return JSON.stringify(release.toJSON(), null, 4);
	};

	this.toSave = function() {
		var releaseDate = new Date(release.releaseDate);
		var date = "";
		date += releaseDate.getFullYear();
		date += "-";
		date += releaseDate.getMonth() + 1;
		date += "-";
		date += releaseDate.getDate();
		return{
			id: release.id,
			self: release.self,
			name: release.name,
			description: release.description,
			releaseDate: date
		};
	};
	
	releases[details.id] = this;
};
