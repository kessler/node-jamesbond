var fs = require('fs')
var config = require('./config.js')
var path = require('path')
var async = require('async')

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

		fs.writeFile(path.join(config.db, appnameToFilename(app.name)), JSON.stringify(app), 'utf8', cb)
	},

	/*
		get app by names
	*/
	getApp: function(name, cb) {
		fs.readFile(path.join(config.db, appnameToFilename(name)), 'utf8', function(err, data) {
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
		fs.unlink(path.join(config.db, appnameToFilename(name)), cb)
	},

	/*
	 */
	listApps: function(cb) {
		fs.readdir(config.db, function (err, files) {
			if (err) return cb(err)

			async.map(files, readAppFile, function (err, contents) {
				if (err) return cb(err)

				var results = {}

				for (var i = files.length - 1; i >= 0; i--) {
					var appName = filenameToAppname(files[i])					
					results[appName] = JSON.parse(contents[i])
				}

				cb(null, results)
			})
		})
	},

	/*
		add more paths for an existing app
	*/
	addPath: function(name, path, cb) {
		publicApi.getApp(name, function(err, app) {
			if (err) return cb(err)
			if (!app) return cb(new Error('no such app: ' + name))

			app.paths.push(path)

			publicApi.putApp(app, cb)
		})
	}
}

function appnameToFilename (name) {
	name = name.replace('/', '_s')
	return name + '.app'
}

function filenameToAppname(filename) {
	return filename.replace('_s', '/').replace('.app', '')
}

function readAppFile(name, cb) {
	fs.readFile(path.join(config.db, name), 'utf8', cb)
}
