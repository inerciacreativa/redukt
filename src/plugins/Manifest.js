'use strict';

const ReduktPlugin = require('./ReduktPlugin');
const Env = require('../builder/Env');
const AssetsManifest = require('webpack-assets-manifest');
const path = require('path');

/**
 * @class
 */
class Manifest extends ReduktPlugin {
	/**
	 * @private
	 * @param {{key: String, value: String}} entry
	 * @param original
	 * @return {{}}
	 */
	getEntry(entry, original) {
		const keyPath = path.dirname(entry.key);
		const valuePath = path.dirname(entry.value);
		if (keyPath !== valuePath) {
			entry.key = path.join(valuePath, path.basename(entry.key));
		}

		return entry;
	}

	/**
	 * @private
	 * @return {{}}
	 */
	getConfig() {
		return {
			writeToDisk: true,
			output: this.config.cache.manifest,
			assets: this.config.cache.assets,
			customize: this.getEntry,
		}
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
		return new AssetsManifest(this.getConfig());
	}
}

module.exports = Manifest;
