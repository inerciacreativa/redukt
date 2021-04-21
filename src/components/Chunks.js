'use strict';

const ReduktComponent = require('./ReduktComponent');

/**
 * @class
 */
class Chunks extends ReduktComponent {
	/**
	 * @inheritDoc
	 */
	init(config) {
		this.chunks = {};
		this.runtime = config.chunks.runtime;

		this.parseChunks(config.chunks);
	}

	/**
	 *
	 * @private
	 * @param {{}} chunks
	 */
	parseChunks(chunks) {
		delete chunks.runtime;

		Object.keys(chunks).forEach(name => {
			this.addChunk(name, chunks[name]);
		});
	}

	/**
	 *
	 * @private
	 * @param {String} name
	 * @param {String[]|RegExp|String|Boolean} modules
	 */
	addChunk(name, modules) {
		if (modules === false) {
			return;
		}

		this.chunks[name] = {
			name: this.getName(name, modules),
			test: this.getTest(modules),
			enforce: true,
			priority: (name === 'vendors') ? -20 : -10,
		};
	}

	/**
	 *
	 *
	 * @private
	 * @param {String[]|RegExp|String|Boolean} modules
	 * @return {RegExp|Boolean}
	 */
	getTest(modules) {
		const pattern = '(?<!node_modules)[\\\\/]node_modules[\\\\/]';
		let extra = '';

		if (Array.isArray(modules) && modules.length) {
			extra = modules.map(lib => `${lib}[\\\\/]`).join('|');
		} else if (modules instanceof RegExp) {
			extra = modules.source;
		}

		return new RegExp(`${pattern}(${extra})`, 'i');
	}

	/**
	 *
	 * @private
	 * @param {String} name
	 * @param {String[]|RegExp|String|Boolean} modules
	 * @return {String|Function}
	 */
	getName(name, modules) {
		if (name === 'extract') {
			return (module) => {
				const name = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
				return name.replace('@', '');
			};
		}

		if (name === 'vendors') {
			return (typeof modules === 'string') ? modules : name;
		}

		return name;
	}

	/**
	 *
	 * @private
	 * @return {{}}
	 */
	getRuntimeChunk() {
		if (!this.chunks || !this.runtime) {
			return {};
		}

		const name = (typeof this.runtime === 'string') ? this.runtime : 'runtime';

		return {
			runtimeChunk: {name: name},
		};
	}

	/**
	 *
	 * @private
	 * @return {{}}
	 */
	getSplitChunks() {
		return {
			splitChunks: {
				chunks: 'all',
				cacheGroups: {
					default: false,
					defaultVendors: false,
					...this.chunks,
				},
			},
		};
	}

	/**
	 * @inheritDoc
	 */
	config() {
		return {
			optimization: {
				moduleIds: 'deterministic',
				providedExports: true,
				usedExports: true,
				...this.getRuntimeChunk(),
				...this.getSplitChunks(),
			},
		};
	}
}

module.exports = Chunks;
