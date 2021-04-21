'use strict';

const Env = require('./builder/Env');
const Redukt = require('./builder/Redukt');
const Webpack = require('./builder/Webpack');

const config = new Redukt();
const webpack = new Webpack(config);

let webpackConfig = webpack.config();
let browsersyncConfig = null;

if (Env.isWatching()) {
	const Browsersync = require('./builder/Browsersync');
	const browsersync = new Browsersync(config);

	browsersyncConfig = browsersync.config(webpackConfig);
	browsersync.start(browsersyncConfig);
}

if (Env.isDebugging()) {
	const Debug = require('./tools/Debug');

	if (Env.isWatching()) {
		Debug.dump('redukt-debug-watch.json', webpackConfig);
		Debug.dump('redukt-debug-browsersync.json', browsersyncConfig);
	} else if (Env.isProduction()) {
		Debug.dump('redukt-debug-production.json', webpackConfig);
	} else {
		Debug.dump('redukt-debug-development.json', webpackConfig);
	}
}

module.exports = webpackConfig;
