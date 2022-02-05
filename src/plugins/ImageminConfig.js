'use strict';

const Merge = require('../tools/Merge');

/**
 * @typedef {{}} ReduktImagemin
 * @property {{}} mozjpeg
 * @property {{}} optipng
 * @property {{}} pngquant
 * @property {{}} gifsicle
 * @property {[]} svgo
 * @property {{}} webp
 */

/**
 * @class
 */
class ImageminConfig {
	/**
	 *
	 * @public
	 * @return {{}}}
	 */
	static getRasterDefaults() {
		return {
			gifsicle: {
				optimizationLevel: 3,
			},
			mozjpeg: {
				progressive: true,
				quality: 40,
			},
			optipng: {
				optimizationLevel: 7,
			},
			pngquant: {
				quality: [.65, .9],
				speed: 4,
			},
		};
	}

	static getWebpDefaults() {
		return {
			webp: {
				quality: 80,
			},
		}
	}

	/**
	 *
	 * @public
	 * @return {{}}
	 */
	static getSvgoDefaults() {
		return {
			svgo: [
				{
					name: 'preset-default',
					params: {
						overrides: {
							removeTitle: false,
							removeUselessDefs: false,
							removeHiddenElems: false,
							removeUnknownsAndDefaults: false,
							removeViewBox: false,
							cleanupIDs: false,
						},
					},
				},
				{
					name: 'removeAttrs',
					params: {
						attrs: 'svg:version',
					},
				},
				'removeXMLProcInst',
			],
		};
	}

	static getRasterPlugins(config) {
		return ImageminConfig.resolve(config, ImageminConfig.getRasterDefaults());
	}

	static getWebpPlugins(config) {
		return ImageminConfig.resolve(config, ImageminConfig.getWebpDefaults());
	}

	static getSvgoPlugins(config) {
		return ImageminConfig.resolve(config, ImageminConfig.getSvgoDefaults());
	}

	/**
	 *
	 * @public
	 * @param {{}} config
	 * @param {{}} defaults
	 * @return {[]}
	 */
	static resolve(config, defaults) {
		const isObject = object => object && typeof object === 'object';
		const plugins = [];

		Object.entries(defaults).forEach(([name, options]) => {
			if (name === 'svgo') {
				const svgPlugins = config[name] ? Merge.svgo(options, config[name]) : options;

				plugins.push([name, {plugins: svgPlugins}]);
			} else {
				if (config[name] === false) {
					return;
				} else if (config[name] === true) {
					plugins.push([name, options]);
				} else if (isObject(config[name])) {
					plugins.push([name, Merge.webpack(options, config[name])]);
				}
			}
		});

		return plugins;
	}
}

module.exports = ImageminConfig;
