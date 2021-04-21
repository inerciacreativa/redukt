'use strict';

const ReduktLoader = require('./ReduktLoader');
const ImageminConfig = require('../plugins/ImageminConfig');
const ImageminPlugin = require('image-minimizer-webpack-plugin');
const svgToMiniDataURI = require('mini-svg-data-uri');

/**
 * @class
 */
class Imagemin extends ReduktLoader {
	/**
	 * @private
	 * @return {{}[]}
	 */
	getRasterPlugins() {
		return ImageminConfig.resolve(this.config.plugin.imagemin, ImageminConfig.getRasterDefaults());
	}

	/**
	 * @private
	 * @param {Boolean} inline
	 * @return {{}[]}
	 */
	getVectorPlugins(inline = false) {
		const defaults = inline ? {} : this.config.plugin.imagemin;

		return ImageminConfig.resolve(defaults, ImageminConfig.getVectorDefaults(inline));
	}

	/**
	 * @public
	 * @param {String} data
	 * @return {String}
	 */
	svgUri(data) {
		return svgToMiniDataURI(data);
	}

	/**
	 * @public
	 * @param {Number} limit
	 * @return {{}[]}
	 */
	svgLoader(limit) {
		return [
			{
				loader: ImageminPlugin.loader,
				options: {
					filter: source => source.byteLength <= limit,
					minimizerOptions: {
						plugins: this.getVectorPlugins(true),
					},
				},
			},
			{
				loader: ImageminPlugin.loader,
				options: {
					filter: source => source.byteLength > limit,
					minimizerOptions: {
						plugins: this.getVectorPlugins(),
					},
				},
			},
		];
	}

	/**
	 * @inheritDoc
	 */
	loader() {
		return {
			loader: ImageminPlugin.loader,
			options: {
				minimizerOptions: {
					plugins: this.getRasterPlugins(),
				},
			},
		};
	}
}

module.exports = Imagemin;
