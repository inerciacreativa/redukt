'use strict';

const ReduktPlugin = require('./ReduktPlugin');
const Env = require('../builder/Env');
const ImageminConfig = require('./ImageminConfig');
const ImageminPlugin = require('image-minimizer-webpack-plugin');

/**
 * @class
 */
class Imagemin extends ReduktPlugin {
	/**
	 *
	 * @return {{implementation, options: {plugins: *[]}}}
	 */
	getMinimizerOptions() {
		const plugins = [].concat(
			ImageminConfig.getRasterPlugins(this.config.plugin.imagemin),
			ImageminConfig.getSvgoPlugins(this.config.plugin.imagemin)
		);

		return {
			implementation: ImageminPlugin.imageminMinify,
			options: {
				plugins: plugins,
			},
		};
	}

	/**
	 *
	 * @return {[{implementation, options: {plugins: *[]}, type: string}]|undefined}
	 */
	getGeneratorOptions() {
		const plugins = ImageminConfig.getWebpPlugins(this.config.plugin.imagemin);

		if (plugins.length === 0) {
			return undefined;
		}

		return [
			{
				implementation: ImageminPlugin.imageminGenerate,
				type: "asset",
				options: {
					plugins: plugins,
				},
			},
		];
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
			test: /\.(gif|jpe?g|png|svg)$/i,
			deleteOriginalAssets: false,
			minimizer: this.getMinimizerOptions(),
			generator: this.getGeneratorOptions(),
		});
	}
}

module.exports = Imagemin;
