var minimist = require('minimist')

var argv = minimist(process.argv.slice(2))

argv.$ = {}

//var commands = ['add', 'get', 'list', 'delete']

if (argv._ && argv._.length > 0) {
	argv.$.command = argv._[0]
	argv.$.args = argv._.slice(1)
}

module.exports = argv