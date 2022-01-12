'use strict';

const Env = require('./Env');
const Merge = require('../tools/Merge');
const path = require('path');

/**
 * @typedef {{}} ReduktConfig
 * @property {{}}                    path
 * @property {string}                path.root
 * @property {string}                path.public
 * @property {{}}                    folder
 * @property {string}                folder.source
 * @property {string}                folder.target
 * @property {string}                folder.styles
 * @property {string}                folder.scripts
 * @property {string}                folder.images
 * @property {string}                folder.fonts
 * @property {(string|string[]|{})}  entry
 * @property {{}}                    chunks
 * @property {string[]}              chunks.extract
 * @property {boolean|string}        chunks.vendors
 * @property {boolean}               chunks.runtime
 * @property {{}}                    cache
 * @property {string}                cache.manifest
 * @property {{}}                    cache.assets
 * @property {Number}                cache.hash
 * @property {ReduktCopy[]}          copy
 * @property {{}}                    autoload
 * @property {{}}                    watch
 * @property {string}                watch.url
 * @property {string}                watch.proxy
 * @property {(boolean|ReduktHttps)} watch.https
 * @property {boolean}               watch.unsafe
 * @property {boolean|string}        watch.open
 * @property {Number}                watch.delay
 * @property {string[]}              watch.inject
 * @property {{}}                    plugin
 * @property {Object[]}              plugin.postcss
 * @property {{}}                    plugin.autoprefixer
 * @property {{}}                    plugin.cssnano
 * @property {{}}                    plugin.babel
 * @property {String}                plugin.babelrc
 * @property {{}}                    plugin.terser
 * @property {ReduktImagemin}        plugin.imagemin
 * @property {{}}                    plugin.stylelint
 * @property {{}}                    plugin.eslint
 */

class Redukt {
	/**
	 *
	 * @public
	 * @param {string} [production='redukt']
	 * @param {string} [development='redukt-local']
	 * @return {Redukt}
	 */
	constructor(production = 'redukt', development = 'redukt-local') {
		if (typeof Redukt.instance === 'object') {
			return Redukt.instance;
		}

		this.config = this.getConfig(production, development);

		Redukt.instance = this;
		return this;
	}

	/**
	 * Returns the current config options.
	 *
	 * @private
	 * @param {string} production
	 * @param {string} development
	 * @return {ReduktConfig}
	 */
	getConfig(production, development) {
		return Merge.webpack(
			this.getDefaults(),
			this.loadFile(production),
			this.loadFile(development, {}),
		);
	}

	/**
	 * Returns the default config options.
	 *
	 * @private
	 * @return {ReduktConfig}
	 */
	getDefaults() {
		return {
			path: {
				root: process.cwd(),
				public: '/',
			},
			folder: {
				source: 'source',
				target: 'assets',
				styles: 'styles',
				scripts: 'scripts',
				images: 'images',
				fonts: 'fonts',
			},
			entry: null,
			chunks: {
				extract: [],
				vendors: true,
				runtime: true,
			},
			cache: {
				manifest: 'assets.json',
				assets: {},
				hash: 12,
			},
			copy: [],
			autoload: {},
			watch: {
				url: null,
				proxy: "http://localhost:3000",
				https: false,
				unsafe: true,
				open: false,
				delay: 100,
				inject: ['*.php'],
			},
			workbox: {
				script: '',
				manifest: 'cache.[manifestHash].js',
				urls: {},
			},
			plugin: {
				postcss: [],
				autoprefixer: {},
				cssnano: {},
				babel: {},
				babelrc: '.babelrc',
				terser: {},
				imagemin: {
					mozjpeg: {},
					optipng: {},
					pngquant: {},
					gifsicle: {},
					webp: {},
					svgo: {},
				},
				stylelint: {},
				eslint: {},
			},
		}
	}

	/**
	 *
	 * @private
	 * @param {String} config
	 * @param {(Object|null)} [fallback=null]
	 * @return {{}}
	 */
	loadFile(config, fallback = null) {
		config = path.resolve(process.cwd(), config);

		try {
			require.resolve(config);
		} catch (err) {
			if (fallback === null) {
				console.log(`The configuration file ${config} has not been found!`);
				process.exit(1);
			}
			return fallback;
		}

		return require(config);
	}

	/**
	 *
	 * @param {String} [append='']
	 * @return {String}
	 */
	root(append = '') {
		return path.resolve(this.config.path.root, append);
	}

	/**
	 *
	 * @return {String}
	 */
	public() {
		return path.join(path.resolve(this.config.path.public, this.config.folder.target), '/');
	}

	/**
	 *
	 * @return {String}
	 */
	source() {
		return this.root(this.config.folder.source);
	}

	/**
	 *
	 * @return {String}
	 */
	target() {
		return this.root(this.config.folder.target);
	}

	/**
	 *
	 * @return {String}
	 */
	hash() {
		return Env.isProduction() ? `.[contenthash:${this.config.cache.hash}]` : '';
	}
}

module.exports = Redukt;
