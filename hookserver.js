var http = require('http')
var async = require('async')

var log = require('./lib/log')
var db = require('./lib/db')
var config = require('./lib/config')
var git = require('./lib/git')
var npm = require('./lib/npm')

function localBroadcaster (event, app) {

	for (var i = 0; i < app.paths.length; i++) {

	}
}

var webapp = require('jamesbond-hookwebapp')(log, db, broadcaster)

http.listen(config.port)