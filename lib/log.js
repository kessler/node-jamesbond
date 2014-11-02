var config = require('./config')
var Logger = require('yalla').Logger

module.exports = new Logger(config.logLevel)
