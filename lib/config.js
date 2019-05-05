const path = require('path');
const {argv} = require('yargs');
const merge = require('webpack-merge');
const desire = require('./helpers/desire');

const userConfig = merge(desire('redukt'), desire('redukt-local'));
const isProduction = !!((argv.env && argv.env.production) || argv.p);
const cleanPaths = (folders, manifest) => [folders.images, folders.styles, folders.scripts, 'workbox-*'].map((folder) => path.join(folders.target, folder)).concat(path.join(folders.target, manifest));

const config = merge({
  entry: null,
  path: {
    public: '/',
  },
  folder: {
    source: 'source',
    target: 'assets',
    styles: 'styles',
    scripts: 'scripts',
    images: 'images',
  },
  watch: {
    url: null,
    proxy: "http://localhost:3000",
    https: false,
    open: false,
    files: [],
  },
  lint: {
    watch: true,
    styles: true,
    scripts: true,
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
}, userConfig);

if (!config.entry) {
  console.error('No entry points are defined.');
  process.exit(1);
}

config.path.root = process.cwd();
config.path.copy = `${config.folder.images}/**/*`;

config.watch.enabled = !!argv.watch;
config.lint.enabled = (!config.watch.enabled || config.lint.watch) && (config.lint.scripts || config.lint.styles);

config.cache.enabled = isProduction;
config.cache.files = {};

config.workbox.enabled = isProduction && (config.workbox.script !== '');
config.workbox.chunk = 'workbox';
config.workbox.import = config.workbox.cdn ? 'cdn' : 'local';

module.exports = merge(config, {
  env: Object.assign({
    production: isProduction,
    development: !isProduction,
  }, argv.env),
  path: {
    public: path.join(path.resolve(path.join(config.path.public, config.folder.target)), '/'),
    source: path.join(config.path.root, config.folder.source),
    target: path.join(config.path.root, config.folder.target),
    clean: cleanPaths(config.folder, config.cache.manifest),
  },
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
