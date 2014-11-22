var deployApp = require('./deployApp')
var log = require('./log')
var inspect = require('util').inspect

module.exports = function(event, app) {
	log.info('deploying:')
	log.info(inspect(app))
	log.info('...........................')
	deployApp(app, function(err) {
		if (err) return log.error(err)

		log.info('app %s deployed successfully', app.name)
	})
}