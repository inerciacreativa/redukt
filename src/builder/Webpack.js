'use strict';

const Merge = require('../tools/Merge');

/**
 *
 * @type {String[]}
 */
const components = [
	'Base',
	'Entry',
	'JavaScript',
	'Css',
	'Chunks',
	'Assets',
	'Plugins',
	'Optimization',
];

/**
 * @class
 */
class Webpack {
	/**
	 * @param {Redukt} redukt
	 */
	constructor(redukt) {
		this.redukt = redukt;
		/** @type {Map<string,ReduktComponent>} */
		this.components = new Map();

		this.addComponents(components);
	}

	/**
	 * Loads all the given components.
	 *
	 * @param {String[]} components
	 */
	addComponents(components) {
		components
			.map(name => require(`../components/${name}`))
			.forEach(component => this.components.set(component.name, new component(this.redukt)));
	}

	/**
	 * Returns the configuration for Webpack, merging the configuration of each
	 * component.
	 *
	 * @public
	 * @return {{}}
	 */
	config() {
		let config = {};
		this.components.forEach(component => {
			config = Merge.webpack(config, component.config());
		});

		return config;
	}
}

module.exports = Webpack;
