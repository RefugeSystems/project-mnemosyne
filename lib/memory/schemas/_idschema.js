/**
 * 
 * @class Schema:idSchema
 * @constructor
 * @extends Memory
 * @param {Object} source
 */
module.exports = new Schema({
	/**
	 * ID in Gitlab
	 * @property gitlab
	 * @type String
	 */
	gitlab: String,
	/**
	 * ID in JIRA
	 * @property jira
	 * @type String
	 */
	jira: String,
	/**
	 * ID in Jenkins
	 * @property jenkins
	 * @type String
	 */
	jenkins: String,
	/**
	 * ID in Service-Now
	 * @property snow
	 * @type String
	 */
	snow: String
});
