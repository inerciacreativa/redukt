'use strict';

const ReduktComponent = require('./ReduktComponent');
const Version = require('../tools/Version');

/**
 *
 * @type {String[]}
 */
const loaders = [
	'Babel',
	'Ifdef',
	'Expose',
];

/**
 * @class
 */
class JavaScript extends ReduktComponent {
	/**
	 * @inheritDoc
	 */
	init(config) {
		/** @type {Map<String,ReduktLoader>} */
		this.loaders = new Map();
		this.folder = config.folder.scripts;

		this.addLoaders(loaders, '../loaders/');
		this.addJquery(config);
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
	 * Adds the needed configuration if jQuery is installed.
	 *
	 * @private
	 * @param {ReduktConfig} config
	 */
	addJquery(config) {
		if (!!Version.get('jquery')) {
			this.loaders.get('Expose').add('jquery', ['$', 'jQuery']);

			config.autoload.jquery = {
				$: 'jquery',
				jQuery: 'jquery',
				'window.jQuery': 'jquery',
			};
		}
	}

	/**
	 * Generates the rule for the given test and loaders.
	 *
	 * @private
	 * @param {RegExp} test
	 * @param {{}[]} loaders
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
	 * Returns the loaders for the modules.
	 *
	 * @private
	 * @return {{}[]}
	 */
	rules() {
		const loaders = [
			this.loaders.get('Babel').loader(),
			this.loaders.get('Ifdef').loader(),
		];

		return [
			this.getRule(/\.(cjs|mjs|jsx?|tsx?)$/, loaders),
			...this.loaders.get('Expose').rules(),
		];
	}

	/**
	 * Returns the output filenames for the modules.
	 *
	 * @private
	 * @return {{}}
	 */
	output() {
		return {
			filename: `${this.folder}/[name]${this.hash()}.js`,
			chunkFilename: `${this.folder}/[id]${this.hash()}.js`,
		};
	}

	/**
	 * @inheritDoc
	 */
	config() {
		return {
			module: {
				rules: this.rules(),
			},
			output: this.output(),
		};
	}
}

module.exports = JavaScript;
