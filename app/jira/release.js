
/**
 * 
 * @class Release
 * @constructor
 * @param {Object} details
 */
module.exports = function(details) {
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
	 * @property releaseDate
	 * @type Number
	 */
	this.releaseDate = details.releaseDate;
	if(this.releaseDate) {
		this.releaseDate = new Date(this.releaseDate).getTime();
	}
	
	this.toSave = function() {
		var releaseDate = new Date(release.releaseDate);
		var date = "";
		date += releaseDate.getFullYear();
		date += "-";
		date += releaseDate.getMonth() + 1;
		date += "-";
		date += releaseDate.getDate();
		return {
			id: release.id,
			self: release.self,
			name: release.name,
			description: release.description,
			releaseDate: date
		};
	};
};
