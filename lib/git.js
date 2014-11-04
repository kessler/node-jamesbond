var child = require('child_process')

module.exports.clone = function (repoPath, gitRemoteUrl, callback) {
	child.exec('git clone ' + gitRemoteUrl + ' ' + repoPath, callback)
}

module.exports.pull = function(repoPath, remoteName, branch, callback) {
	child.exec('git pull ' + remoteName + ' ' + branch, { cwd: repoPath}, callback)
}

module.exports.addRemote = function(repoPath, remoteName, gitRemoteUrl, callback) {
	child.exec('git remote add ' + remoteName + ' ' + gitRemoteUrl, { cwd: repoPath }, callback)
}