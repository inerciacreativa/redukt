'use strict';

const ReduktPlugin = require('./ReduktPlugin');
const Env = require('../builder/Env');
const AssetsManifest = require('webpack-assets-manifest');
const path = require('path');

/**
 * @class
 */
class Manifest extends ReduktPlugin {
    init() {
        this.customize = null;

        if (typeof this.config.manifest.customize === 'function') {
            this.customize = this.config.manifest.customize;
        }
    }

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

		entry.key = path.normalize(entry.key);
		entry.value = path.normalize(entry.value);

		if (this.customize) {
            entry = this.customize(entry, original);
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
			output: this.config.manifest.output,
			assets: this.config.manifest.assets,
			customize: this.getEntry.bind(this),
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
