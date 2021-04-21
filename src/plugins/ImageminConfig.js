'use strict';

const Merge = require('../tools/Merge');
const {extendDefaultPlugins} = require('svgo');

/**
 * @typedef {{}} ReduktImagemin
 * @property {{}} mozjpeg
 * @property {{}} optipng
 * @property {{}} pngquant
 * @property {{}} gifsicle
 * @property {{}} webp
 * @property {[]} svgo
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
			mozjpeg: {
				progressive: true,
				quality: 80,
			},
			optipng: {
				optimizationLevel: 7,
			},
			pngquant: {
				quality: [.65, .9],
				speed: 4,
			},
			gifsicle: {
				optimizationLevel: 3,
			},
			webp: {
				quality: 80,
			},
		};
	}

	/**
	 *
	 * @public
	 * @param {Boolean} inline
	 * @return {{}}
	 */
	static getVectorDefaults(inline = false) {
		if (inline) {
			return {
				svgo: [
					{
						name: 'removeScriptElement',
						active: true,
					},
					{
						name: 'removeStyleElement',
						active: true,
					},
					{
						name: 'mergeStyles',
						active: false,
					},
					{
						name: 'inlineStyles',
						active: false,
					},
					{
						name: 'minifyStyles',
						active: false,
					},
				],
			};
		}

		return {
			svgo: [
				{
					name: 'removeTitle',
					active: false,
				},
				{
					name: 'removeUselessDefs',
					active: false,
				},
				{
					name: 'removeHiddenElems',
					active: false,
				},
				{
					name: 'removeUnknownsAndDefaults',
					active: false,
				},
				{
					name: 'cleanupIDs',
					active: false,
				},
			],
		};
	}

	/**
	 *
	 * @public
	 * @param {{}} config
	 * @param {{}} defaults
	 * @return {[]}
	 */
	static resolve(config, defaults) {
		const result = [];

		Object.entries(defaults).forEach(([name, values]) => {
			if (name === 'svgo') {
				const plugins = config[name] ? Merge.svgo(values, config[name]) : values;

				result.push([name, {plugins: extendDefaultPlugins(plugins)}]);
			} else {
				result.push([name, Merge.webpack(values, config[name])]);
			}
		});

		return result;
	}
}

module.exports = ImageminConfig;
