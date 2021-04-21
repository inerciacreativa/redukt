'use strict';

const util = require('util');
const path = require('path');
const fs = require('fs');
const os = require('os');

/**
 * @class
 */
class Function {
	/**
	 *
	 * @param {String} key
	 * @param {Function} value
	 * @return {String|Object}
	 */
	debug(key, value) {
		const result = this.inspect(value);
		const parsed = this.parse(result);
		const name = parsed.shift()[2].replace('bound ', '') || '(anonymous)';

		if (name === key && parsed.length === 0) {
			return 'function()';
		}

		return this.object(name, parsed);
	}

	/**
	 *
	 * @param {Function} value
	 * @return {String}
	 */
	inspect(value) {
		let result = Debug.inspect(value, 1);
		if (this.lines(result) === 0) {
			result = this.expand(result);
		}

		return result;
	}

	/**
	 * Parses the inspected function.
	 *
	 * @param {String} value
	 * @return {RegExpMatchArray[]}
	 */
	parse(value) {
		const regExp = /^\s{2}(\w+|\[name\]):\s(?:(?:['\[](?:Function )?([\w\s\.\(\)]*)['\]])|(\{))/gm

		return [...value.matchAll(regExp)];
	}

	/**
	 * Returns the number of lines.
	 *
	 * @param {String} value
	 * @return {Number}
	 */
	lines(value) {
		return (value.match(/\r?\n/g) || []).length;
	}

	/**
	 * Expands a one liner function.
	 *
	 * @param {String} value
	 * @return {String}
	 */
	expand(value) {
		return value.split(/[\{\},]/).map((string, index) => {
			string = string.trim();
			if (index === 0) {
				return `${string} {`;
			} else if (string === '') {
				return '}';
			} else {
				return `  ${string},`;
			}
		}).join("\n");
	}

	/**
	 * Returns the printable version of the function.
	 *
	 * @param {String} name
	 * @param {RegExpMatchArray[]} value
	 * @return {Object}
	 */
	object(name, value) {
		const object = {};
		const parameters = {};

		value.forEach(parameter => {
			let value = parameter[2] || parameter[3];
			if (value === '{') {
				value = {};
			} else if (value === '(anonymous)') {
				value = {'(anonymous)()': {}};
			}

			parameters[parameter[1]] = value;
		});

		object[name + '()'] = parameters;

		return object;
	}
}

/**
 * @class
 */
class Classes {
	/**
	 *
	 * @param {Array} value
	 * @return {Object|Array}
	 */
	debug(value) {
		const objects = {};

		value.forEach(object => {
			const name = this.inspect(object);
			if (name) {
				objects[name] = object;
			}
		});

		if (Object.keys(objects).length > 0) {
			return objects;
		}

		return value;
	}

	/**
	 * Returns the inspected class.
	 *
	 * @param {Object} value
	 * @return {String|null}
	 */
	inspect(value) {
		const result = Debug.inspect(value);
		const regExp = /^(\w+)(?:\s{)/;
		const parsed = result.match(regExp);

		return Array.isArray(parsed) ? parsed[1] : null;
	}
}

/**
 * @class
 */
class Debug {
	/**
	 * Returns the printable representation of an object.
	 *
	 * @param {Object} object
	 * @param {Number} depth
	 * @param {Boolean} colors
	 * @return {String}
	 */
	static inspect(object, depth = 5, colors = false) {
		return util.inspect(object, true, depth, colors);
	}

	/**
	 * Prints the representation of an object.
	 *
	 * @param {Object} object
	 * @param {Number} depth
	 * @param {Boolean} exit
	 */
	static log(object, depth = 5, exit = false) {
		console.log(Debug.inspect(object, depth, true));
		if (exit) {
			process.exit(1);
		}
	}

	/**
	 * Dumps the representation of an object into a file.
	 *
	 * @param {String} name
	 * @param {(String|Object)} body
	 */
	static dump(name, body) {
		const file = path.join(process.cwd(), name);

		if (typeof body === 'object') {
			body = JSON.stringify(body, Debug.replacer, 4);
		}

		body = body + os.EOL;

		fs.writeFileSync(file, body);
	}

	/**
	 *
	 * @param {String} key
	 * @param {(RegExp|Object|Array|String)} value
	 * @return {(String|Object|*)}
	 */
	static replacer(key, value) {
		const classes = ['plugins', 'minimizer'];

		if (value instanceof RegExp) {
			return value.toString();
		}

		if (typeof value === 'function') {
			return new Function().debug(key, value);
		}

		if (classes.includes(key) && Array.isArray(value)) {
			return new Classes().debug(value);
		}

		return value;
	}
}

module.exports = {
	inspect: Debug.inspect,
	log: Debug.log,
	dump: Debug.dump,
}
