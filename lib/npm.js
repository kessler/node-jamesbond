var child = require('child_process')
var util = require('util')
var u = require('./util')

module.exports.install = function (opts, callback) {
	var cmd = 'npm'
	var args = [ 'install' ]

	opts = opts || {}

	opts.cwd = opts.cwd || process.cwd()

	// append user args to default args
	if (util.isArray(opts.args)) {		
		args = args.concat(opts.args)	
	}

	opts.stdio = 'inherit'

	if (opts.module) {
		args.push(module)
	}

	var c = child.spawn(cmd, args, opts)

	u.hookChildProcessEvents(c, callback)
}