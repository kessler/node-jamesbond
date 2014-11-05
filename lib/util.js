module.exports.hookChildProcessEvents = function (c, callback) {	
	c.on('exit', function(code, signal) {
		if (code !== 0)
			return callback(new Error('exit code ' + code))

		callback()
	})

	c.on('error', callback)
}