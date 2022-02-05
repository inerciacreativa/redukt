'use strict';

const ReduktComponent = require('./ReduktComponent');
const Imagemin = require('../loaders/Imagemin');
const Merge = require('../tools/Merge');

/**
 * @class
 */
class Assets extends ReduktComponent {
	/**
	 * @inheritDoc
	 */
	init(config) {
		this.folderImages = config.folder.images;
		this.folderFonts = config.folder.fonts;
	}

	/**
	 * Generates the filename of the asset.
	 *
	 * @private
	 * @param {String} path
	 * @param {String} folder
	 * @return {string}
	 */
	getName(path, folder) {
		let name = '[name]';

		if (/node_modules/.test(path)) {
			name = path
				.replace(/\\/g, '/')
				.replace(/((.*(node_modules))|fonts|font|images|image|img|assets)\//g, '')
				.replace('@', '')
				.replace(/\.[^/.]+$/, '');
		}

		return `${folder}/${name}${this.hash()}[ext]`;
	}

	/**
	 * Generates the rule for the given test.
	 *
	 * @private
	 * @param {RegExp} test
	 * @param {String} folder
	 * @param {{}} extra
	 * @return {{}}
	 */
	getRule(test, folder, extra = {}) {
		return Merge.webpack({
			test: test,
			type: 'asset/resource',
			generator: {
				filename: module => this.getName(module.filename, folder),
			},
		}, extra);
	}

	/**
	 * Returns the rules for the assets.
	 *
	 * @private
	 * @return {{}[]}
	 */
	rules() {
		const imagemin = new Imagemin(this);

		return [
			this.getRule(/(\.(eot|[ot]tf|woff2?)$|font.*\.svg$)/, this.folderFonts, {
				use: imagemin.svgoLoader(),
			}),
			this.getRule(/^((?!font).)*\.svg$/, this.folderImages, {
				use: imagemin.svgoLoader(),
			}),
			this.getRule(/\.(gif|jpe?g|png|webp)$/, this.folderImages, {
				use: imagemin.rasterLoader(),
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
		};
	}
}

module.exports = Assets;
