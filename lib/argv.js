var minimist = require('minimist')

var argv = minimist(process.argv.slice(2))

argv.commands = {}

var commands = ['add', 'get', 'list', 'delete']

if (argv._ && argv._.length > 0) {
	var cmd = argv._[0]

	if (commands.indexOf(cmd) > -1) {
		argv.commands[cmd] = argv._.slice(1)
	}
}

module.exports = argv