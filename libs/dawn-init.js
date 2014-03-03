#!/usr/bin/env node
exports = module.exports = new Project;

function Project () {}
Project.prototype = {
	constructor: Project,
	init: function (env) {
		var root = env.dir;
	}
};