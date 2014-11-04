var child = require('child_process')

module.exports.install = function (module, args, callback) {
	var cmd = 'npm install '

	// function was called only with a callback
	if (typeof module === 'function') {
		callback = module
		module = undefined
		args = undefined
	}

	// function was called with module and callback
	if (typeof args === 'function') {
		callback = args
		args = undefined
	}

	if (args) {
		cmd += args.join(' ')
	}

	if (module) {
		cmd += module
	}

	child.exec(cmd, callback)
}