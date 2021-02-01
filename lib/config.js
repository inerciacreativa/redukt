const path = require('path');
const {argv} = require('yargs');
const {merge} = require('webpack-merge');
const desire = require('./helpers/desire');
const array = require('./helpers/array');

const userConfig = merge(desire('redukt'), desire('redukt-local', {}));
const isProduction = !!((argv.env && argv.env.production) || argv.mode === 'production');

const config = merge({
	entry: null,
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
	watch: {
		url: null,
		proxy: "http://localhost:3000",
		https: false,
		unsafe: false,
		open: false,
		delay: 100,
		files: [],
		inject: ['*.php'],
	},
	copy: [],
	lint: {
		scripts: true,
		styles: true,
		watch: false,
	},
	cache: {
		manifest: 'assets.json',
		name: '[name].[hash:12]',
	},
	jquery: {
		enabled: false,
		bundle: false,
	},
	workbox: {
		script: '',
		manifest: 'cache.[manifestHash].js',
		cdn: false,
		urls: {},
	},
	imagemin: {},
}, userConfig, {
	modules: [],
});

config.path = merge(config.path, {
	public: path.join(path.resolve(path.join(config.path.public, config.folder.target)), '/'),
	source: path.join(config.path.root, config.folder.source),
	target: path.join(config.path.root, config.folder.target),
});

config.copy = array.maybeAdd(config.copy, config.folder.images, config.path.source, isProduction ? config.cache.name : '[name]');
config.copy = array.maybeAdd(config.copy, config.folder.fonts, config.path.source, isProduction ? config.cache.name : '[name]');

config.watch.enabled = !!argv.watch;
config.watch.files = array.maybeAdd(config.watch.files, config.folder.images, config.path.source);
config.watch.files = array.maybeAdd(config.watch.files, config.folder.fonts, config.path.source);

config.lint.enabled = !config.watch.enabled || (config.lint.watch && (config.lint.scripts || config.lint.styles));

config.cache.files = {};

config.workbox.enabled = isProduction && (config.workbox.script !== '');
config.workbox.import = config.workbox.cdn ? 'cdn' : 'local';

config.modules = [
	config.path.source,
	path.resolve(__dirname, '../node_modules'),
	'node_modules',
];

module.exports = merge(config, {
	env: Object.assign({
		production: isProduction,
		development: !isProduction,
	}, argv.env),
});

if (process.env.NODE_ENV === undefined) {
	process.env.NODE_ENV = isProduction ? 'production' : 'development';
}
/**
 * If your publicPath differs between environments, but you know it at compile
 * time, then set REDUKT_TARGET as an environment variable before compiling.
 * Example: REDUKT_TARGET=/wp-content/themes/twist/dist yarn build:production
 */
if (process.env.REDUKT_TARGET) {
	module.exports.path.public = process.env.REDUKT_TARGET;
}

/**
 * If you don't know your publicPath at compile time, then uncomment the lines
 * below and use WordPress's wp_localize_script() to set REDUKT_TARGET global.
 * Example:
 *   wp_localize_script('twist/main.js', 'REDUKT_TARGET',
 * get_theme_file_uri('dist/'))
 */
// Object.keys(module.exports.entry).forEach(id =>
//   module.exports.entry[id].unshift(path.join(__dirname,
// 'helpers/target.js')));
