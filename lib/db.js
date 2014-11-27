var fs = require('fs')
var config = require('./config.js')
var path = require('path')
var FileIndex = require('file-index')
var flattenIndex = require('./flattenIndex.js')
var handlers = FileIndex.handle('*.app', FileIndex.loadJsonFile).create()
var sanitize = require('sanitize-filename')

try {
	fs.mkdirSync(config.db)
} catch (e) {
	if (e.code !== 'EEXIST') {
		throw e
	}
}

var publicApi = module.exports = {
	/*
		add an app to the database

		@param {String} app.name
		@param {Array} app.paths
		@param {String} app.remoteUrl
		@param {String} app.branch
		@param {Function} cb 
	*/
	putApp: function(app, cb) {

		if (app.paths === undefined) {
			app.paths = []
		} else if (typeof app.paths === 'string') {
			app.paths = [app.paths]
		}

		fs.writeFile(path.join(config.db, appToFilename(app.name)), JSON.stringify(app), 'utf8', cb)
	},

	/*
		get app by names
	*/
	getApp: function(name, cb) {
		fs.readFile(path.join(config.db, appToFilename(name)), 'utf8', function(err, data) {
			// entry does not exist
			if (err && err.code === 'ENOENT') {
				return cb()
			}

			if (err) {
				return cb(err)
			}

			var app = JSON.parse(data)

			if (app.name !== name) {
				return cb(new Error('corrupted app file'))
			}

			cb(null, app)
		})
	},

	/*
	 */
	deleteApp: function(name, cb) {
		fs.unlink(path.join(config.db, appToFilename(name)), cb)
	},

	/*
	 */
	listApps: function(cb) {
		FileIndex.load(config.db, handlers, function(err, results) {
			if (err) return cb(err)

			cb(null, flattenIndex(results))
		})
	},

	/*
		add more paths for an existing app
	*/
	addPath: function(name, path, cb) {
		publicApi.getApp(name, function(err, app) {
			if (err) return cb(err)

			app.paths.push(path)

			publicApi.putApp(app, cb)
		})
	}
}

function appToFilename (name) {
	return sanitize(name) + '.app'
}
