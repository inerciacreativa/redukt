const fs = require('fs');
const path = require('path');

/**
 * @param {Array} array
 * @param {string} folder
 * @param {string} root
 * @param {string|null} name
 * @return {Array}
 */
const maybeAdd = (array, folder, root, name= null) => {
	if (name) {
		if (fs.existsSync(path.join(root, folder))) {
			array.push({from: `${folder}/**/*`, to: `[path]${name}.[ext]`})
		}
	} else {
		if (!array.some((pattern) => pattern.indexOf(folder) !== -1) && fs.existsSync(path.join(root, folder))) {
			array.push(`${folder}/**/*`)
		}
	}

	return array;
};

/**
 * @param {Array} array
 * @return {string}
 */
const toRegexp = (array) => {
	if (array.length === 1) {
		return array[0];
	}

	const regex = /\/\*\*\/\*([^|]*)/g;

	return `+(${array.join('|').replace(regex, '')})/**/*`;
};

/**
 * @module helpers/array
 */
module.exports = {
	maybeAdd: maybeAdd,
	toRegexp: toRegexp,
};
