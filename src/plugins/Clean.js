'use strict';

const ReduktPlugin = require('./ReduktPlugin');
const Env = require('../builder/Env');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

/**
 * @class
 */
class Clean extends ReduktPlugin {
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
		return new CleanWebpackPlugin();
	}
}

module.exports = Clean;
