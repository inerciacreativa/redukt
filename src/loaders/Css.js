'use strict';

const ReduktLoader = require('./ReduktLoader');
const Env = require('../builder/Env');

/**
 * @class
 */
class Css extends ReduktLoader {
	/**
	 * @inheritDoc
	 */
	loader() {
		return {
			loader: 'css-loader',
			options: {
				sourceMap: Env.isDevelopment(),
			},
		};
	}
}

module.exports = Css;
