const path = require('path');
const {argv} = require('yargs');
const merge = require('webpack-merge');
const desire = require('./helpers/desire');

const userConfig = merge(desire(`${__dirname}/../config`), desire(`${__dirname}/../config-local`));

const isProduction = !!((argv.env && argv.env.production) || argv.p);
const rootPath = (userConfig.paths && userConfig.paths.root) ? userConfig.paths.root : process.cwd();

const publicPath = (base, folder) => (folder === '.') ? base : `${base}/${folder}/`;
const cleanPaths = (folders) => [folders.styles, folders.scripts, folders.images].map((folder) => path.join(folders.target, folder));

const config = merge({
  proxyUrl: 'http://localhost:3000',
  devSsl: {},
  cacheBusting: '[name]_[hash:8]',
  folders: {
    source: 'source',
    target: 'assets',
    styles: 'styles',
    scripts: 'scripts',
    images: 'images'
  },
  enabled: {
    lint: 'scripts',
    sourceMaps: !isProduction,
    optimize: isProduction,
    cacheBusting: isProduction,
    watcher: !!argv.watch
  },
  watch: [],
}, userConfig);

module.exports = merge(config, {
  open: true,
  env: Object.assign({
    production: isProduction,
    development: !isProduction
  }, argv.env),
  paths: {
    root: rootPath,
    source: path.join(rootPath, config.folders.source),
    target: path.join(rootPath, config.folders.target),
    clean: cleanPaths(config.folders)
  },
  copy: `${config.folders.images}/**/*`,
  publicPath: publicPath(config.publicPath, config.folders.target),
  manifest: {}
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
  module.exports.publicPath = process.env.REDUKT_TARGET;
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
