'use strict';

const ReduktLoader = require('./ReduktLoader');
const Env = require('../builder/Env');

/**
 * @class
 */
class Less extends ReduktLoader {
	/**
	 * @inheritDoc
	 */
	loader() {
		return {
			loader: 'less-loader',
			options: {
				sourceMap: Env.isDevelopment(),
			},
		};
	}
}

module.exports = Less;
