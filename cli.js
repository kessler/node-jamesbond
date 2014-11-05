#!/usr/bin/env node

var prompt = require('prompt')
var util = require('util')
var async = require('async')
var ndm = require('ndm')('jamesbond')

var argv = require('./lib/argv')
var log = require('./lib/log')
var db = require('./lib/db')
var deployApp = require('./lib/deployApp')

if (argv.$.command === 'add') {
	add(defaultCallback)		
} else if (argv.$.command === 'update') {
	update()
} else if (argv.$.command === 'get') {
	get()
} else if (argv.$.command === 'list') {
	list()
} else if (argv.$.command === 'delete') {
	deleteApp()
} else if (argv.$.command === 'deploy') {
	deploy()
} else if (argv.$.command === 'service') {
	service()
} else {
	log.error('invalid or missing command...')
}

function add(cb) {
	
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
			app.paths = app.paths.split(',')
			log.info(JSON.stringify(app))

			db.putApp(app, cb)
		})
	} else {
		log.info(JSON.stringify(app))
		db.putApp(app, cb)
	}
}

function update() {
	db.getApp(argv.$.args[0], function (err, app) {
		if (err) return log.error(err)

		prompt.start()
		prompt.message = ''
		prompt.delimiter = ''

		var field = argv.$.args[1]

		prompt.get(field + ':', function(err, result) {
			app[field] = result[argv.$.args[1]]

			if (field === 'paths') {
				app[field] = app[field].split(',')
			}
						
			db.putApp(app, defaultCallback)
		})
	})
}

function get() {
	db.getApp(argv.$.args[0], function (err, app) {
		if (err) return log.error(err)

		// intentionally console.log
		console.log(app)
	})		
}

function list() {
	db.listApps(function (err, apps) {
		if (err) return log.error(err)

		// intentionally console.log
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

function deploy() {
	db.getApp(argv.$.args[0], function (err, app) {
		if (err) {
			return add(deploy)
		}

		deployApp(app, defaultCallback)
	})		
}

function service() {
	switch (argv.$.args[0]) {
		case 'install':
			ndm.install();
			break;
		case 'uninstall':
			ndm.remove();
			break;
		case 'start':
			ndm.start();
			break;
		case 'restart':
			ndm.restart();
			break;
		case 'stop':
			ndm.stop();
			break;	
	}
}
