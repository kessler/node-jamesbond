var path = require('path')
var defaultOpts = {
	ignoreOverwrites: false
}

/*
    flattens a file-index, stripping all paths from keys
*/
module.exports = function flattenIndex(index, options) {
	options = options || defaultOpts

	var flattenedIndex = {}

	// flatten
	for (var r in index) {
		var key = path.basename(r)
		key = key.replace(path.extname(key), '')

		if (!options.ignoreOverwrites && key in flattenedIndex) {
			throw new Error(
				'flattening this index will overwrite existing keys (files with the same name in different directories), fix this or call flattenIndex with (index, { ignoreOverwrites: true }) '
			)
		}

		flattenedIndex[key] = index[r]
	}

	return flattenedIndex
}
