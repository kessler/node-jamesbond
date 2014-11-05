#!/usr/bin/env node

var http = require('http')
var async = require('async')
var listener = require('./lib/FSBroadcastListener')
var log = require('./lib/log')
var db = require('./lib/db')
var config = require('./lib/config')

var webapp = require('jamesbond-hookwebapp').webapp(log, db, listener)

http.createServer(webapp).listen(config.port, function () {
	log.info('server listening at %d', config.port)
})