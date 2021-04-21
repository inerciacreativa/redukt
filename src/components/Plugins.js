'use strict';

const ReduktComponent = require('./ReduktComponent');

/**
 *
 * @type {String[]}
 */
const plugins = [
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
		this.plugins = [];

		this.addPlugins(plugins, '../plugins/');
	}

	/**
	 * Adds the plugins to be used.
	 *
	 * @private
	 * @param {String[]} plugins
	 * @param {String} path
	 */
	addPlugins(plugins, path) {
		plugins
			.map(name => require(`${path}${name}`))
			.forEach(plugin => this.plugins.push(new plugin(this)));
	}

	/**
	 *
	 * @private
	 * @return {Object[]}
	 */
	getPlugins() {
		return this.plugins
			.filter(plugin => plugin.isEnabled())
			.map(plugin => plugin.plugin());
	}

	/**
	 * @inheritDoc
	 */
	config() {
		return {
			plugins: this.getPlugins(),
		};
	}
}

module.exports = Plugins;
