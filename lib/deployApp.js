var fs = require('fs')
var async = require('async')
var path = require('path')

var git = require('./git')
var npm = require('./npm')
var log = require('./log')

module.exports = function (app, callback) {

	var work = []
	
	// TODO make sure paths are unique
	for (var i = 0; i < app.paths.length; i++) {
		work.push(deploySingle(app.paths[i], app.gitRemoteUrl, app.branch))
	}

	async.parallel(work, callback)
}

/**
 * Deploys an remote repository to a path in the file system
 * 
 * @param {String} repoPath
 * @param {String} gitRemoteUrl
 * @return {Function} a function thats accepts a callback for when the operation finishes
 */
function deploySingle(repoPath, gitRemoteUrl, branch) {
	// used to assign the decision of pull or clone during series
	var operation

	return function (callback) {
		async.series([
			checkRepositoryExists,
			deploy,
			npmInstall
		], callback)	
	}

	function checkRepositoryExists (cb) {
		fs.exists(repoPath, function(exist) {
			if (exist) {
				operation = gitPull
			} else {
				operation = gitClone
			}
			
			cb()
		})
	}

	function deploy(cb) {
		operation(cb)
	}

	function gitClone(cb) {
		git.clone(repoPath, gitRemoteUrl, branch, cb)
	}

	function gitPull(cb) {
		git.pull(repoPath, gitRemoteUrl, branch, cb)
	}

	function npmInstall(cb) {
		npm.install({ cwd: repoPath }, cb)
	}
}
