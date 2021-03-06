#!/usr/bin/env node

//TODO this entire code needs refactoring, too much hacky development on the go stuff here

// TODO also, need to externalize functionality from here so it will be usable programmatically.
// so basicaly create a seperte module with these functions only accepting their arguments
// via function parameters rather than using the argv object

var prompt = require('prompt')
var util = require('util')
var async = require('async')
var ndm = require('ndm')('jamesbond')
var child = require('child_process')
var path = require('path')

var config = require('./lib/config')
var argv = require('./lib/argv')
var log = require('./lib/log')
var db = require('./lib/db')
var deployApp = require('./lib/deployApp')

if (argv.$.command === 'app') {
	return app()
}

if (argv.$.command === 'service') {
	return service()
} 

if (argv.$.command === 'hookserver') {
	return hookserver()
} 

return log.error('invalid command: %s', argv.$.command)

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
			deploy()
			break
		default:
			log.error('invalid app command')
			break
	}
}

function hookserver() {
	switch (argv.$.args[0]) {
		case 'start':
			child.spawn('node', [ path.join(__dirname, 'hookserver.js')].concat(process.argv.slice(2)), { cwd: __dirname, stdio: 'inherit' })			
			break
		
		default:
			log.error('invalid hookserver command')
			break
	}	
}

function service() {
	switch (argv.$.args[0]) {
		case 'install':
			// var interview = new ndm.Interview({"env": {
			// 	"HOST": {
			// 		"default": "localhost",
			// 		"description": "what host should I bind to?"
			// 	}
			// }})

			// interview.run(function () {
			// 	console.log(arguments)
			// })

			//log.info('db file is at: %s', config.db)
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

	db.getApp(argv.$.args[1], function(err, app) {
		if (app) throw new Error('app exists, use "app update" command instead')

		var appName = argv.name || argv.$.args[1]
		var branch

		try {
		 	branch = getBranch(appName)
		} catch (e) {
		 	log.error('failed to extract branch from %s', appName)
		}

		var app = {
			name: appName,
			protocol: argv.protocol,
			paths: argv.paths,
			branch: branch || argv.branch,
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
				app.gitRemoteUrl = generateRemoteUrl(app)

				app.paths = app.paths.split(',')
				log.info(JSON.stringify(app))

				db.putApp(app, cb)
			})
		} else {
			log.info(JSON.stringify(app))
			db.putApp(app, cb)
		}
	})
}

function updateApp() {

	var field = argv.$.args[2]

	db.getApp(argv.$.args[1], function(err, app) {
		if (err) return log.error(err)

		prompt.start()
		prompt.message = ''
		prompt.delimiter = ''

		prompt.get(field + ':', function(err, result) {
			app[field] = result[field]

			if (field === 'paths') {
				app[field] = app[field].split(',')
			}

			db.putApp(app, defaultCallback)
		})
	})
}

function getApp() {
	db.getApp(argv.$.args[1], function(err, app) {
		if (err) return log.error(err)

		// intentionally console.log
		console.log(app)
	})
}

function listApps() {
	db.listApps(function(err, apps) {
		if (err) return log.error(err)

		// intentionally console.log
		console.log(apps)
	})
}

function deleteApp() {
	db.deleteApp(argv.$.args[1], defaultCallback)
}

function deploy() {

	db.getApp(argv.$.args[1], function(err, app) {
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

function getBranch(appName) {
	var index = appName.indexOf('#')
	
	if (index > -1)
		return appName.substr(index + 1)
}

function removeBranch(appName) {
	var index = appName.indexOf('#')
	if (index > -1)
		return appName.substr(0, index)
	
	return appName
}

function generateRemoteUrl(app) {
	var remoteUrl

	if (app.protocol === 'https') {
		remoteUrl = 'https://github.com/'
	} else if (app.protocol === 'ssh') {
		remoteUrl = 'git@github.com:'
	} else {
		throw new Error('invalid procotol ' + app.protocol)
	}

	remoteUrl += removeBranch(app.name)
	
	if (app.protocol === 'ssh') {
		remoteUrl += '.git'
	}

	return remoteUrl
}
