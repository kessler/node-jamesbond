var prompt = require('prompt')
var argv = require('./lib/argv')
var log = require('./lib/log')
var db = require('./lib/db')

if (argv.commands.add) {
	addApp()		
} else if (argv.commands.get) {
	getApp()
} else if (argv.commands.list) {
	listApps()
} else if (argv.commands.delete) {
	deleteApp()
} else {
	log.error('invalid or missing command...')
}

function addApp() {
	
	var app = { 
		name: argv.name || argv.commands.add[0],
		gitRemoteUrl: argv.gitRemoteUrl,
		paths: argv.paths,
		branch: argv.branch,
		secret: argv.secret
	}
	
	var prompts = []

	for (var field in app) {
		if (!app[field])
			prompts.push(field)
	}

	// TODO maybe not print the whole app object here (with secret)
	// some fields are missing so as the user
	if (prompts.length > 0) {
		prompt.message = ''
		prompt.delimiter = ''
		prompt.colors = false

		prompt.addProperties(app, prompts, function(err, result) {
	
			if (app.gitRemoteUrl.indexOf('http') !== 0 || app.gitRemoteUrl.indexOf('git://') !== 0) {
				app.gitRemoteUrl = 'https://github.com/' + app.gitRemoteUrl
			}

			log.info(JSON.stringify(app))

			addAppImpl(app)
		})
	} else {
		log.info(JSON.stringify(app))
		addAppImpl(app)
	}
}

function addAppImpl(app) {
	db.addApp(app, defaultCallback)
}

function getApp() {
	db.getApp(argv.commands.get[0], function (err, app) {
		if (err) return log.error(err)

		console.log(app)
	})		
}

function listApps() {
	db.listApps(function (err, apps) {
		if (err) return log.error(err)

		console.log(apps)
	})
}

function deleteApp() {
	db.deleteApp(argv.commands.delete[0], defaultCallback)
}

function defaultCallback(err) {
	if (err) return log.error(err)			
	log.info('great success!')		
}

function deployApp() {
	db.getApp(argv.commands.get[0], function (err, app) {
		if (err) return log.error(err)

		console.log(app)
	})		
}
