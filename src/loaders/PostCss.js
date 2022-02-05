'use strict';

const ReduktLoader = require('./ReduktLoader');
const Env = require('../builder/Env');
const PostCssLoadConfig = require('postcss-load-config');

/**
 * @class
 */
class PostCss extends ReduktLoader {
	/**
	 *
	 * @return {[]}
	 */
	getPlugins() {
		return [
			...this.getGlobalPlugins(),
			...this.getLocalPlugins(),
			...this.getAutoprefixerPlugin(),
			...this.getCssNanoPlugin(),
		];
	}

	/**
	 *
	 * @return {[]}
	 */
	getGlobalPlugins() {
		let plugins = [];

		try {
			plugins = [...PostCssLoadConfig.sync().plugins];
		} catch (e) {
			// Do nothing
		}

		return plugins;
	}

	/**
	 *
	 * @return {[]}
	 */
	getLocalPlugins() {
		return [...this.config.plugin.postcss];
	}

	/**
	 *
	 * @return {[]}
	 */
	getAutoprefixerPlugin() {
		return [require('autoprefixer')(this.config.plugin.autoprefixer)];
	}

	/**
	 *
	 * @return {[]}
	 */
	getCssNanoPlugin() {
		return [require('cssnano')({
			preset: ['default', this.config.plugin.cssnano],
		})];
	}

	/**
	 * @inheritDoc
	 */
	loader() {
		return {
			loader: 'postcss-loader',
			options: {
				sourceMap: Env.isDevelopment(),
				postcssOptions: {
					plugins: this.getPlugins(),
				},
			},
		};
	}
}

module.exports = PostCss;
