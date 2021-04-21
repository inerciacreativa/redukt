'use strict';

const ReduktPlugin = require('./ReduktPlugin');
const Env = require('../builder/Env');
const Merge = require('../tools/Merge');
const TerserPlugin = require('terser-webpack-plugin');

/**
 * @class
 */
class Terser extends ReduktPlugin {
	/**
	 * @private
	 * @return {{}}
	 */
	getDefaults() {
		return {
			parallel: true,
			extractComments: false,
			terserOptions: {
				compress: {
					warnings: false,
					drop_console: true,
				},
				output: {
					comments: false,
				},
			},
		};
	}

	/**
	 * @private
	 * @return {{}}
	 */
	getConfig() {
		return Merge.webpack(this.getDefaults(), this.config.plugin.terser);
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
		return new TerserPlugin(this.getConfig());
	}
}

module.exports = Terser;
