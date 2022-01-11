'use strict';

const ReduktComponent = require('./ReduktComponent');
const Env = require('../builder/Env');
const Terser = require('../plugins/Terser');
const Imagemin = require('../plugins/Imagemin');

/**
 * @class
 */
class Optimization extends ReduktComponent {
	/**
	 * @inheritDoc
	 */
	config() {
		if (!Env.isProduction()) {
			return {};
		}

		return {
			optimization: {
				sideEffects: true,
				minimizer: [
					new Terser(this).plugin(),
					new Imagemin(this).plugin(),
				],
			},
		};
	}
}

module.exports = Optimization;
