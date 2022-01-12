'use strict';

const ReduktPlugin = require('./ReduktPlugin');
const Env = require('../builder/Env');
const Merge = require('../tools/Merge');
const ImageminConfig = require('./ImageminConfig');
const ImageminPlugin = require('image-minimizer-webpack-plugin');

/**
 * @class
 */
class Imagemin extends ReduktPlugin {
	/**
	 *
	 * @private
	 * @return {ReduktImagemin}
	 */
	getDefaults() {
		return Merge.webpack(ImageminConfig.getRasterDefaults(), ImageminConfig.getVectorDefaults());
	}

	/**
	 *
	 * @private
	 * @return {[]}
	 */
	getConfig() {
		return ImageminConfig.resolve(this.getDefaults(), this.config.plugin.imagemin);
	}

	/**
	 * @inheritDoc
	 */
	isEnabled() {
		return Env.isProduction();
	}

	/**
	 * @inheritDoc
	 */
	plugin() {
		return new ImageminPlugin({
			loader: false,
			test: /\.(gif|jpe?g|png|svg|webp)$/i,
			severityError: "off",
			minimizer: {
				implementation: ImageminPlugin.imageminMinify,
				options: {
					plugins: this.getConfig(),
				},
			}
		});
	}
}

module.exports = Imagemin;
