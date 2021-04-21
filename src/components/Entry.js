'use strict';

const ReduktComponent = require('./ReduktComponent');
const Env = require('../builder/Env');
const Hmr = require('../plugins/Hmr');

/**
 * @class
 */
class Entry extends ReduktComponent {
	/**
	 * @inheritDoc
	 */
	init(config) {
		const entry = this.parseEntry(config.entry);
		this.entry = Env.isWatching() ? Hmr.addClient(entry) : entry;
	}

	/**
	 *
	 * @private
	 * @param entry
	 * @return {{}}
	 */
	parseEntry(entry) {
		if (this.isString(entry) || this.isArray(entry)) {
			return {main: entry};
		}

		if (this.isObject(entry)) {
			return entry;
		}

		console.error('No valid entry points found!');
		process.exit(1);
	}

	/**
	 * Checks whether is a string an is not empty.
	 *
	 * @private
	 * @param {*} entry
	 * @return {boolean}
	 */
	isString(entry) {
		return (typeof entry === 'string') && (entry.length > 0);
	}

	/**
	 * Checks whether is an array and is not empty.
	 *
	 * @private
	 * @param {*} entry
	 * @return {boolean}
	 */
	isArray(entry) {
		return Array.isArray(entry) && (entry.length > 0);
	}

	/**
	 * Checks whether is a literal object and is not empty.
	 *
	 * @private
	 * @param {*} entry
	 * @return {boolean}
	 */
	isObject(entry) {
		return (!!entry) && (entry.constructor === Object) && (Object.keys(entry).length > 0);
	}

	/**
	 * @inheritDoc
	 */
	config() {
		return {
			entry: this.entry,
		};
	}
}

module.exports = Entry;
