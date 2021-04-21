'use strict';

const ReduktPlugin = require('./ReduktPlugin');
const Env = require('../builder/Env');
const webpack = require('webpack');

/**
 * @class
 */
class Hmr extends ReduktPlugin {
	/**
	 * Adds the HMR client script to each entry point.
	 *
	 * @public
	 * @param {{}} entry
	 * @return {{}}
	 */
	static addClient(entry) {
		const results = {};

		Object.keys(entry).forEach((name) => {
			results[name] = Array.isArray(entry[name]) ? entry[name].slice(0) : [entry[name]];
			results[name].unshift(`${__dirname}/../plugins/HmrClient.js`);
		});

		return results;
	}

	/**
	 * @inheritDoc
	 */
	isEnabled() {
		return Env.isWatching();
	}

	/**
	 * @inheritDoc
	 */
	plugin() {
		return new webpack.HotModuleReplacementPlugin();
	}
}

module.exports = Hmr;
