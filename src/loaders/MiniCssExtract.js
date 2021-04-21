'use strict';

const ReduktLoader = require('./ReduktLoader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/**
 * @class
 * @see https://github.com/webpack-contrib/mini-css-extract-plugin
 */
class MiniCssExtract extends ReduktLoader {
	/**
	 * Returns the plugin.
	 *
	 * @param {{}} config
	 * @return {Object}
	 */
	plugin(config) {
		return new MiniCssExtractPlugin(config);
	}

	/**
	 * @inheritDoc
	 */
	loader() {
		return MiniCssExtractPlugin.loader;
	}
}

module.exports = MiniCssExtract;
