'use strict';

const ReduktComponent = require('./ReduktComponent');
const Env = require('../builder/Env');
const path = require('path');

/**
 * @class
 */
class Base extends ReduktComponent {
	/**
	 * @private
	 * @return {String[]}
	 */
	getResolve() {
		return [
			this.source(),
			path.resolve(__dirname, '../../node_modules'),
			'node_modules',
		];
	}

	/**
	 *
	 * @private
	 * @return {String|Boolean}
	 */
	getDevtool() {
		if (Env.isWatching()) {
			return 'source-map';
		}

		return Env.isProduction() ? false : 'source-map';
	}

	/**
	 *
	 * @private
	 * @return {{}}
	 */
	getStats() {
		if (Env.isWatching()) {
			return {
				preset: 'errors-warnings',
				performance: false,
			}
		}

		return {
			preset: 'normal',
			performance: Env.isProduction(),
		}
	}

	/**
	 * @inheritDoc
	 */
	config() {
		return {
			context: this.source(),

			mode: Env.isProduction() ? 'production' : 'development',

			infrastructureLogging: Env.isWatching() ? {level: 'none'} : {},

			entry: {},

			output: {
				path: this.target(),
				publicPath: this.public(),
				clean: !Env.isWatching(),
			},

			module: {rules: []},

			plugins: [],

			resolve: {
				extensions: ['*', '.wasm', '.mjs', '.js', '.jsx', '.json'],
				modules: this.getResolve(),
			},

			resolveLoader: {
				modules: this.getResolve(),
			},

			stats: this.getStats(),

			performance: {
				hints: false,
			},

			optimization: {},

			devtool: this.getDevtool(),

			watchOptions: {
				ignored: /node_modules/,
			},
		};
	}
}

module.exports = Base;
