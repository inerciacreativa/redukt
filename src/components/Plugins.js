'use strict';

const ReduktComponent = require('./ReduktComponent');

/**
 *
 * @type {String[]}
 */
let plugins = [
	'Clean',
	'Copy',
	'Autoload',
	'Hmr',
	'EsLint',
	'Stylelint',
	'Manifest',
];

/**
 * @class
 */
 class Plugins extends ReduktComponent {
	/**
	 * @inheritDoc
	 */
	init(config) {
		this.plugins = this.loadPlugins(plugins, '../plugins/');
	}

	/**
	 * Adds the plugins to be used.
	 *
	 * @private
	 * @param {String[]} plugins
	 * @param {String} path
	 */
	loadPlugins(plugins, path) {
		return plugins.map(name => {
			const plugin = require(`${path}${name}`);
			return new plugin(this);
		});
	}

	/**
	 *
	 * @private
	 * @return {Object[]}
	 */
	enablePlugins() {
		return this.plugins
			.filter(plugin => plugin.isEnabled())
			.map(plugin => plugin.plugin());
	}

	/**
	 * @inheritDoc
	 */
	config() {
		return {
			plugins: this.enablePlugins(),
		};
	}
}

module.exports = Plugins;
