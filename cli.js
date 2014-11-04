var prompt = require('prompt')
var util = require('util')
var async = require('async')

var git = require('./lib/git')
var argv = require('./lib/argv')
var log = require('./lib/log')
var db = require('./lib/db')

if (argv.$.command === 'add') {
	addApp(defaultCallback)		
} else if (argv.$.command === 'get') {
	getApp()
} else if (argv.$.command === 'list') {
	listApps()
} else if (argv.$.command === 'delete') {
	deleteApp()
} else if (argv.$.command === 'deploy') {
	deployApp()
} else {
	log.error('invalid or missing command...')
}

function addApp(cb) {
	
	var app = { 
		name: argv.name || argv.$.args[0],
		gitRemoteUrl: argv.gitRemoteUrl,
		paths: argv.paths,
		branch: argv.branch,
		secret: argv.secret,
		// TODO: need to expose this to the user with defaults
		events: ['push']
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

			db.addApp(app, cb)
		})
	} else {
		log.info(JSON.stringify(app))
		db.addApp(app, cb)
	}
}

function getApp() {
	db.getApp(argv.$.args[0], function (err, app) {
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
	db.deleteApp(argv.$.args[0], defaultCallback)
}

function defaultCallback(err) {
	if (err) return log.error(err)			
	log.info('great success!')		
}

function deployApp() {
	db.getApp(argv.$.args[0], function (err, app) {
		if (err) {
			return addApp(deployApp)
		}

		var work = []
		for (var i = 0; i < app.paths.length; i++) {
			work.push(deployFunctor(app.gitRemoteUrl, app.paths[i]))
		}

		async.parallel(work, function(err, results) {
			console.log(err, results)
		})
	})		
}

function deployFunctor(gitUrl, appPath) {
	// TODO: maybe I can clone the remote to a local path once and then clone the rest from it ?
	return function (callback) {
		git.clone(appPath, gitUrl, callback)
	}
}