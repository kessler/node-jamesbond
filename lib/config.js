var rc = require('rc')
var LogLevel = require('yalla').LogLevel

module.exports = rc('jamesbond', {
	logLevel: LogLevel.INFO,
	db: 'db',
	port: 9001
})