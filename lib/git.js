var child = require('child_process')
var u = require('./util')

module.exports.clone = function(repoPath, gitRemoteUrl, branch, callback) {
	var c = child.spawn('git', ['clone', gitRemoteUrl, '--branch=' + branch, repoPath], {
		stdio: 'inherit'
	})

	u.hookChildProcessEvents(c, callback)
}

module.exports.pull = function(repoPath, remoteName, branch, callback) {
	var c = child.spawn('git', ['pull', remoteName, branch], {
		cwd: repoPath,
		stdio: 'inherit'
	})

	u.hookChildProcessEvents(c, callback)
}

module.exports.addRemote = function(repoPath, remoteName, gitRemoteUrl, callback) {
	child.spawn('git', ['remote', 'add ', remoteName, gitRemoteUrl], {
		cwd: repoPath,
		stdio: 'inherit'
	})

	u.hookChildProcessEvents(c, callback)
}

module.exports.init = function(repoPath, callback) {
	child.spawn('git', ['init'], {
		cwd: repoPath,
		stdio: 'inherit'
	})

	u.hookChildProcessEvents(c, callback)
}
