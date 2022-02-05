'use strict';

const ReduktLoader = require('./ReduktLoader');
const ImageminConfig = require('../plugins/ImageminConfig');
const ImageminPlugin = require('image-minimizer-webpack-plugin');

/**
 * @class
 */
class Imagemin extends ReduktLoader {
	/**
	 * @private
	 * @return {{}[]}
	 */
	getRasterPlugins() {
		return ImageminConfig.getRasterPlugins(this.config.plugin.imagemin);
	}

	/**
	 * @private
	 * @return {{}[]}
	 */
	getSvgoPlugins() {
		return ImageminConfig.getSvgoPlugins(this.config.plugin.imagemin);
	}

	/**
	 * @public
	 * @return {{}[]}
	 */
	svgoLoader() {
		return {
			loader: ImageminPlugin.loader,
			options: {
				minimizer: {
					implementation: ImageminPlugin.imageminMinify,
					options: {
						plugins: this.getSvgoPlugins(),
					},
				},
			},
		};
	}

	/**
	 * @inheritDoc
	 */
	rasterLoader() {
		return {
			loader: ImageminPlugin.loader,
			options: {
				minimizer: {
					implementation: ImageminPlugin.imageminMinify,
					options: {
						plugins: this.getRasterPlugins(),
					},
				},
			},
		};
	}
}

module.exports = Imagemin;
