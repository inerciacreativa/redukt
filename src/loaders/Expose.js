'use strict';

const ReduktLoader = require('./ReduktLoader');

/**
 * @class
 * @see https://github.com/webpack-contrib/expose-loader
 */
class Expose extends ReduktLoader {
	/**
	 * @inheritDoc
	 */
	init() {
		this.modules = new Map();
	}

	/**
	 * Adds a module for exposition to global object.
	 *
	 * @param {String} module
	 * @param {String|String[]|Object} exposes
	 */
	add(module, exposes) {
		this.modules.set(module, exposes);
	}

	/**
	 * Generates the rule for the given module.
	 *
	 * @private
	 * @param {String} module
	 * @param {String|String[]|Object} exposes
	 * @return {{}}
	 */
	getRule(module, exposes) {
		return {
			test: require.resolve(module),
			loader: 'expose-loader',
			options: {
				exposes: exposes,
			},
		};
	}

	/**
	 * @inheritDoc
	 */
	rules() {
		const rules = [];

		this.modules.forEach((exposes, module) => {
			rules.push(this.getRule(module, exposes));
		});

		return rules;
	}
}

module.exports = Expose;
