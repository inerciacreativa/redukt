'use strict';

const ReduktLoader = require('./ReduktLoader');
const Env = require('../builder/Env');

/**
 * @class
 * @see https://github.com/nippur72/ifdef-loader
 */
class Ifdef extends ReduktLoader {
	/**
	 * @inheritDoc
	 */
	loader() {
		return {
			loader: 'ifdef-loader',
			options: {
				DEVELOPMENT: Env.isDevelopment(),
				PRODUCTION: Env.isProduction(),
			},
		}
	}
}

module.exports = Ifdef;
