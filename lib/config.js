var rc = require('rc')
var LogLevel = require('yalla').LogLevel
var path = require('path')

module.exports = rc('jamesbond', {
	logLevel: LogLevel.INFO,
	db: path.resolve(__dirname, '..', 'db'),
	port: 9001,
	githubToken: '123123123132123123'
})