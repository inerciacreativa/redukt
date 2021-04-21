'use strict';

/**
 * @class
 */
class ReduktLoader {
	/**
	 * @param {ReduktComponent} component
	 */
	constructor(component) {
		this.component = component;
		this.config = component.redukt.config;

		this.init();
	}

	/**
	 * Configures the loader.
	 */
	init() {}

	/**
	 * Returns the rules generated with this loader.
	 *
	 * @return {{}[]}
	 */
	rules() {
		return [];
	}

	/**
	 * Returns the loader configuration, to be used in a Rule.use context.
	 *
	 * @return {{}}
	 */
	loader() {
		return {};
	}
}

module.exports = ReduktLoader;
