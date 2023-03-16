'use strict';

const ReduktPlugin = require('./ReduktPlugin');
const CopyPlugin = require('copy-webpack-plugin');
const File = require('../tools/File');

/**
 * @typedef {{}} ReduktCopy
 * @property {string} from
 * @property {string} [to]
 */

/**
 * @class
 */
class Copy extends ReduktPlugin {
	/**
	 * @inheritDoc
	 */
	init() {
		this.patterns = [];

		this.config.copy.forEach(pattern => this.add(pattern));
	}

	/**
	 * Adds a pattern to the copy list.
	 *
	 * @public
	 * @param {ReduktCopy} pattern
	 */
	add(pattern) {
		const result = {
			from: '',
            to: '[path][name][hash][ext]',
		}

		Object.keys(pattern)
			.filter(key => key in result)
			.forEach(key => result[key] = pattern[key]);

		if (this.exists(result.from)) {
			result.to = result.to.replace('[hash]', `${this.component.hash()}`);

			this.patterns.push(result);
		}
	}

	/**
	 * Whether the path exists.
	 *
	 * @private
	 * @param {String} path
	 * @return {Boolean}
	 */
	exists(path) {
		if (!path) {
			return false;
		}

		let test = File.find(path.replace(/\*/g, ''));

		if (!test.isAbsolute()) {
			test = test.forceFromSource();
		}

		return File.exists(test.path());
	}

	/**
	 * @inheritDoc
	 */
	isEnabled() {
		return this.patterns.length > 0;
	}

	/**
	 * @inheritDoc
	 */
	plugin() {
		return new CopyPlugin({
			patterns: this.patterns,
		});
	}
}

module.exports = Copy;
