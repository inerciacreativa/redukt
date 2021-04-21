'use strict';

const ReduktComponent = require('./ReduktComponent');

/**
 *
 * @type {String[]}
 */
const loaders = [
	'MiniCssExtract',
	'Css',
	'PostCss',
	'Less',
	'Sass',
];

/**
 * @class
 */
class Css extends ReduktComponent {
	/**
	 * @inheritDoc
	 */
	init(config) {
		/** @type {Map<String,ReduktLoader>} */
		this.loaders = new Map();
		this.folder = config.folder.styles;

		this.addLoaders(loaders, '../loaders/');
	}

	/**
	 * Adds the loaders to be used.
	 *
	 * @private
	 * @param {String[]} loaders
	 * @param {String} path
	 */
	addLoaders(loaders, path) {
		loaders
			.map(name => require(`${path}${name}`))
			.forEach(loader => this.loaders.set(loader.name, new loader(this)));
	}

	/**
	 * Generates the rule for the given test and loaders.
	 *
	 * @private
	 * @param {RegExp} test
	 * @param {Object[]} loaders
	 * @return {{}}
	 */
	getRule(test, loaders) {
		return {
			test: test,
			include: this.source(),
			use: loaders,
		}
	}

	/**
	 * Returns the loaders for the stylesheets.
	 *
	 * @private
	 * @return {Object[]}
	 */
	rules() {
		const css = [
			this.loaders.get('MiniCssExtract').loader(),
			this.loaders.get('Css').loader(),
			this.loaders.get('PostCss').loader(),
		];

		const less = this.loaders.get('Less').loader();
		const sass = this.loaders.get('Sass').loader();

		return [
			this.getRule(/\.p?css$/, css),
			this.getRule(/\.less$/, [...css, less]),
			this.getRule(/\.s[ca]ss$/, [...css, ...sass]),
		];
	}

	/**
	 * Plugin for extracting the stylesheets from modules.
	 *
	 * @private
	 * @return {Object[]}
	 */
	plugins() {
		return [
			this.loaders.get('MiniCssExtract').plugin({
				filename: `${this.folder}/[name]${this.hash()}.css`,
				chunkFilename: `${this.folder}/[id]${this.hash()}.css`,
			}),
		];
	}

	/**
	 * @inheritDoc
	 */
	config() {
		return {
			module: {
				rules: this.rules(),
			},
			plugins: this.plugins(),
		};
	}
}

module.exports = Css;
