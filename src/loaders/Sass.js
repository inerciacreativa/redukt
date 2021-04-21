'use strict';

const ReduktLoader = require('./ReduktLoader');
const Env = require('../builder/Env');

/**
 * @class
 */
class Sass extends ReduktLoader {
	/**
	 * @inheritDoc
	 */
	loader() {
		return [
			{
				loader: 'resolve-url-loader',
				options: {
					sourceMap: Env.isDevelopment(),
					root: this.component.source(),
				},
			},
			{
				loader: 'sass-loader',
				options: {
					sourceMap: true
				},
			},
		];
	}
}

module.exports = Sass;
