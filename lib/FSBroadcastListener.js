var deployApp = require('./deployApp')
var log = require('./log')

module.exports = function(event, app) {
	log.info('deploying...')
	deployApp(app, function(err) {
		if (err) return log.error(err)

		log.info('app %s deployed successfully', app.name)
	})
}