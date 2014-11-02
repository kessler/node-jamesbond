var locket = require('locket')
var levelup = require('levelup')
var sublevel = require('level-sublevel')
var config = require('./config.js')

var db = sublevel(levelup(config.db, { db: locket, encoding: 'json'}))
var apps = db.sublevel('apps')

var publicApi = module.exports = {
	/*
		add an app to the database

		@param {String} app.name
		@param {Array} app.paths
		@param {String} app.remoteUrl
		@param {String} app.branch
		@param {Function} cb 
	*/
	addApp: function (app, cb) {
		
		if (typeof app.paths === 'string')
			app.paths = [app.paths]

		apps.put(app.name, app, cb)
	},

	/*
		add more paths for an existing app
	*/
	addPath: function (name, path, cb) {
		publicApi.getApp(name, function (err, app) {
			if (err) return cb(err)

			app.paths.push(path)

			publicApi.addApp(app, cb)
		})
	},

	/*
		get app by names
	*/
	getApp: function (name, cb) {
		apps.get(name, cb)
	},

	/*
	*/
	listApps: function (cb) {
		var results = {}

		apps.createReadStream()
			.on('data', function(d) {
				results[d.key] = d.value
			})
			.on('end', function() {
				cb(null, results)
			})
	},

	/*
	*/
	deleteApp: function (name, cb) {
		apps.del(name, cb)
	}
}