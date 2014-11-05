#!/usr/bin/env node

//TODO this entire code needs refactoring, too much hacky development on the go stuff here

var prompt = require('prompt')
var util = require('util')
var async = require('async')
var ndm = require('ndm')('jamesbond')

var argv = require('./lib/argv')
var log = require('./lib/log')
var db = require('./lib/db')
var deployApp = require('./lib/deployApp')

if (argv.$.command === 'app') {
	app()
} else if (argv.$.command === 'service') {
	service()
} else {
	log.error('invalid or missing command...')
}

function app() {
	switch (argv.$.args[0]) {
		case 'add':
			addApp(defaultCallback)
			break
		case 'update':
			updateApp()
			break
		case 'get':
			getApp()
			break
		case 'list':
			listApps()
			break
		case 'delete':
			deleteApp()
			break
		case 'deploy':
			deployApp()
			break
		default:
			log.error('invalid app command')
			break
	}
}

function service() {
	switch (argv.$.args[0]) {
		case 'install':
			log.info('db file is at: %s', config.db)
			ndm.install()
			break

		case 'uninstall':
			ndm.remove()
			break

		case 'start':
			log.info('db file is at: %s', config.db)
			ndm.start()
			break

		case 'restart':
			ndm.restart()
			break

		case 'stop':
			ndm.stop()
			break	
		
		default:
			log.error('unknown service command, try: install, uninstall, start, restart, stop')
			break
	}
}

function addApp(cb) {
	
	var app = { 
		name: argv.name || argv.$.args[1],
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
			app.paths = app.paths.split(',')
			log.info(JSON.stringify(app))

			db.putApp(app, cb)
		})
	} else {
		log.info(JSON.stringify(app))
		db.putApp(app, cb)
	}
}

function updateApp() {
	db.getApp(argv.$.args[1], function (err, app) {
		if (err) return log.error(err)

		prompt.start()
		prompt.message = ''
		prompt.delimiter = ''

		var field = argv.$.args[2]

		prompt.getApp(field + ':', function(err, result) {
			app[field] = result[argv.$.args[2]]

			if (field === 'paths') {
				app[field] = app[field].split(',')
			}
						
			db.putApp(app, defaultCallback)
		})
	})
}

function getApp() {
	db.getApp(argv.$.args[1], function (err, app) {
		if (err) return log.error(err)

		// intentionally console.log
		console.log(app)
	})		
}

function listApps() {
	db.listApps(function (err, apps) {
		if (err) return log.error(err)

		// intentionally console.log
		console.log(apps)
	})
}

function deleteApp() {
	db.deleteApp(argv.$.args[1], defaultCallback)
}

function deployApp() {
	db.getApp(argv.$.args[1], function (err, app) {
		if (err) {
			return addApp(deploy)
		}

		deployApp(app, defaultCallback)
	})		
}

function defaultCallback(err) {
	if (err) return log.error(err)			
	log.info('great success!')		
}
