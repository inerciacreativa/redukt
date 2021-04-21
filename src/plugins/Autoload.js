'use strict';

const ReduktPlugin = require('./ReduktPlugin');
const webpack = require('webpack');

/**
 * @class
 */
class Autoload extends ReduktPlugin {
	/**
	 * @inheritDoc
	 */
	init() {
		this.modules = this.config.autoload;
	}

	/**
	 *
	 * @inheritDoc
	 */
	isEnabled() {
		return Object.keys(this.modules).length > 0;
	}

	/**
	 * @inheritDoc
	 */
	plugin() {
		return new webpack.ProvidePlugin(this.modules);
	}
}

module.exports = Autoload;
