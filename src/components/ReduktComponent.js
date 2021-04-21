/**
 *
 * @class
 * @property {string} name
 */
class ReduktComponent {
	/**
	 *
	 * @param {Redukt} redukt
	 */
	constructor(redukt) {
		this.redukt = redukt;
		this.init(redukt.config);
	}

	/**
	 * @private
	 * @param {ReduktConfig} config
	 */
	init(config) {
	}

	/**
	 *
	 * @param {String} append
	 * @return {String}
	 */
	root(append = '') {
		return this.redukt.root(append);
	}

	/**
	 *
	 * @return {String}
	 */
	public() {
		return this.redukt.public();
	}

	/**
	 *
	 * @return {String}
	 */
	source() {
		return this.redukt.source();
	}

	/**
	 *
	 * @return {String}
	 */
	target() {
		return this.redukt.target();
	}

	/**
	 *
	 * @return {String}
	 */
	hash() {
		return this.redukt.hash();
	}

	/**
	 * Returns the Webpack configuration.
	 *
	 * @public
	 * @abstract
	 * @return {{}}
	 */
	config() {
	}
}

module.exports = ReduktComponent;
