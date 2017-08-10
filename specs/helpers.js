var sandbox = require("sandboxed-module");
global.requireSubject = function (path, requires, globals, locals) {
	requires = requires || {};
	globals = globals || {};
	locals = locals || {};
	return sandbox.require("../app/" + path, {
		requires: requires, 
		globals: globals, 
		locals: locals
	});
};
