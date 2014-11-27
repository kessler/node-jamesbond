var should = require('should')
var config = require('../lib/config.js')
var path = require('path')

config.db = path.join(__dirname, 'testdb')

var db = require('../lib/db.js')
var fs = require('fs')
var rimraf = require('rimraf')

describe('db', function () {

	var APP_NAME = 'kessler/test#master'	
	var APP = { name: APP_NAME, paths: [] }
	var ENTRY_FILE = path.join(config.db, APP_NAME.replace('/', '_s') + '.app')

	it('putApp()', function (done) {
		db.putApp(APP, function(err) {
			if (err) return done(err)

			fs.readFile(ENTRY_FILE, 'utf8', function(err, data) {
				if (err) return done(err)

				JSON.parse(data).should.eql(APP)
				done()
			})
		})
	})

	it('getApp()', function(done) {
		fs.writeFile(ENTRY_FILE, JSON.stringify(APP), 'utf8', function(err) {
			if (err) return done(err)
			
			db.getApp(APP_NAME, function(err, app) {
				if (err) return done(err)

				app.should.eql(APP)
				done()
			})	
		})
	})

	it('deleteApp()', function (done) {
		fs.writeFile(ENTRY_FILE, JSON.stringify(APP), 'utf8', function(err) {
			if (err) return done(err)

			db.deleteApp(APP_NAME, function (err) {
				if (err) return done(err)

				fs.readFile(ENTRY_FILE, function (err) {					
					err.code.should.eql('ENOENT')
					done()
				})
			})
		})
	})

	it('listApps()', function (done) {
		fs.writeFile(ENTRY_FILE, JSON.stringify(APP), 'utf8', function(err) {
			if (err) return done(err)

			db.listApps(function (err, apps) {
				if (err) return done(err)

				var keys = Object.keys(apps)
				keys.should.eql([APP_NAME])
				apps[APP_NAME].should.eql(APP)
				done()
			})
		})
	})

	it('addPath()', function (done) {
		fs.writeFile(ENTRY_FILE, JSON.stringify(APP), 'utf8', function(err) {
			if (err) return done(err)

			db.addPath(APP_NAME, '123', function(err) {
				if (err) return done(err)

				fs.readFile(ENTRY_FILE, 'utf8', function (err, data) {
					if (err) return done(err)

					JSON.parse(data).should.eql({ name: APP_NAME, paths: [ '123' ]})
					done()
				})
			})
		})
	})

	beforeEach(function(done) {
		fs.mkdir(config.db, function (err) {
			if (err && err.code !== 'EEXIST')
				return done(err)

			done()
		})
	})

	afterEach(function (done) {
		rimraf(config.db, done)		
	})
})