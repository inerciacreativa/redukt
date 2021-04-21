'use strict';

const compareVersions = require('compare-versions');

module.exports = {
	/**
	 * Returns the version of Node or a module.
	 *
	 * @param {String} module
	 * @return {String|null}
	 */
	get: function (module = '') {
		if (module === '' || module === 'node') {
			return process.version;
		}

		let version = null;
		try {
			version = require(`${module}/package.json`).version;
		} catch (e) {
		}

		return version;
	},

	/**
	 * Whether is a valid semver.
	 *
	 * @param version
	 * @return {Boolean}
	 */
	validate: function (version) {
		return compareVersions.validate(version);
	},

	/**
	 * Compares two semver strings.
	 *
	 * @param {String} v1
	 * @param {String} v2
	 * @param {'>'|'>='|'='|'<'|'<='|null} operator
	 * @return {1|0|-1|Boolean}
	 */
	compare: function (v1, v2, operator = null) {
		if (operator === null) {
			return compareVersions(v1, v2);
		}

		return compareVersions.compare(v1, v2, operator);
	},
};
