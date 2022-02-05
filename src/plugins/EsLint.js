'use strict';

const ReduktPlugin = require('./ReduktPlugin');
const Env = require('../builder/Env');
const Merge = require('../tools/Merge');
const EsLintPlugin = require('eslint-webpack-plugin');

/**
 * @class
 */
class EsLint extends ReduktPlugin {
	/**
	 * @private
	 * @return {{}}
	 */
	getDefaults() {
		return {
			emitWarning: true,
			failOnWarning: false,
			emitError: true,
			failOnError: true,
		}
	}

	/**
	 * @private
	 * @return {{}}
	 */
	getConfig() {
		if (this.config.plugin.eslint === true) {
			return this.getDefaults();
		}

		return Merge.webpack(this.getDefaults(), this.config.plugin.eslint);
	}

	/**
	 * @inheritDoc
	 */
	isEnabled() {
		return !Env.isWatching() && this.config.plugin.eslint !== false;
	}

	/**
	 * @inheritDoc
	 */
	plugin() {
		return new EsLintPlugin(this.getConfig());
	}
}

module.exports = EsLint;
