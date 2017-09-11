"use strict";

/**
 * 
 * @class Schema:Memory
 * @constructor
 */
module.exports = function(source) {
	this.name = source.name || source.title || source.display;
	
	if(source._model) {
		console.log("Modeled");
		this.modeled = new source._model(source);
		this.__proto__ = this.modeled;
	} else {
		console.log("Raw");
		this.__proto__ = Object;
		Object.assign(this, source);
	}
};

/**
 * 
 * @method _model
 * @static
 * @param {MongooseConnection} connection
 */
module.exports.setModel = function(connection) {
	this._model = connection.model("TestCase", this._schema);
};
