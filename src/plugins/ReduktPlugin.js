'use strict';

/**
 * @class
 */
class ReduktPlugin {
	/**
	 * @param {ReduktComponent} component
	 */
	constructor(component) {
		this.component = component;
		this.config = component.redukt.config;

		this.init();
	}

	/**
	 * Configures the plugin.
	 *
	 * @private
	 */
	init() {}

	/**
	 * Whether the plugin is enabled.
	 *
	 * @public
	 * @return {Boolean}
	 */
	isEnabled() {
		return true;
	}

	/**
	 * @public
	 * @abstract
	 * @return {Object}
	 */
	plugin() {
	}
}

module.exports = ReduktPlugin;
