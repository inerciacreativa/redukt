'use strict';

const ReduktPlugin = require('./ReduktPlugin');
const Env = require('../builder/Env');
const Merge = require('../tools/Merge');
const StylelintPlugin = require('stylelint-webpack-plugin');

/**
 * @class
 */
class Stylelint extends ReduktPlugin {
	/**
	 * @private
	 * @return {{}}
	 */
	getDefaults() {
		return {
			emitWarning: true,
			failOnWarning: false,
			emitError: true,
			failOnError: false,
		}
	}

	/**
	 * @private
	 * @return {{}}
	 */
	getConfig() {
		if (this.config.plugin.stylelint === true) {
			return this.getDefaults();
		}

		return Merge.webpack(this.getDefaults(), this.config.plugin.stylelint);
	}

	/**
	 * @inheritDoc
	 */
	isEnabled() {
		return !Env.isWatching() && this.config.plugin.stylelint !== false;
	}

	/**
	 * @inheritDoc
	 */
	plugin() {
		return new StylelintPlugin(this.getConfig());
	}
}

module.exports = Stylelint;
