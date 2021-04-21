'use strict';

const ReduktLoader = require('./ReduktLoader');
const Merge = require('../tools/Merge');
const File = require('../tools/File');

/**
 * @class
 */
class Babel extends ReduktLoader {
	/**
	 * Returns the final configuration options.
	 *
	 * @private
	 * @return {{}}
	 */
	getOptions() {
		return Merge.babel(this.getDefaultOptions(), this.getGlobalOptions(), this.getLocalOptions());
	}

	/**
	 * Returns the default configuration options.
	 *
	 * @private
	 * @return {{}}
	 */
	getDefaultOptions() {
		return {
			cacheDirectory: true,
			presets: [
				[
					'@babel/preset-env',
					{
						modules: false,
						forceAllTransforms: true,
					},
				],
			],
			plugins: [
				'@babel/plugin-syntax-dynamic-import',
				'@babel/plugin-proposal-object-rest-spread',
				[
					'@babel/plugin-transform-runtime',
					{
						helpers: false,
					},
				],
			],
		};
	}

	/**
	 * Returns the options from the Babel configuration file (.babelrc).
	 *
	 * @private
	 * @return {{}}
	 */
	getGlobalOptions() {
		const file = this.component.root(this.config.plugin.babelrc);

		return File.exists(file) ? File.find(file).read(true) : {};
	}

	/**
	 * Returns the options from the configuration.
	 *
	 * @private
	 * @return {{}}
	 */
	getLocalOptions() {
		return this.config.plugin.babel;
	}

	/**
	 * @inheritDoc
	 */
	loader() {
		return {
			loader: 'babel-loader',
			options: this.getOptions(),
		}
	}
}

module.exports = Babel;
