const webpack = require('webpack');
const url = require('url');
const merge = require('webpack-merge');
const BrowserSync = require('browser-sync');
const devMiddleware = require('webpack-dev-middleware');
const hmrMiddleware = require('webpack-hot-middleware');
const hmrLoader = require('./helpers/hmr-loader');

const config = require('./config');
const proxyUrl = `${config.watch.proxy}${config.path.public}`;
const targetUrl = process.env.DEVURL || config.watch.url;
const webpackConfig = require('./webpack.config');
const watchConfig = merge(webpackConfig, {
	output: {
		pathinfo: true,
		publicPath: proxyUrl,
	},
	devtool: 'cheap-module-source-map',
	stats: false,
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
	],
});

watchConfig.entry = hmrLoader(watchConfig.entry);

if (url.parse(targetUrl).protocol === 'https:') {
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
}

const compiler = webpack(watchConfig);
const app = BrowserSync.create();

app.init({
	open: config.watch.open,
	host: url.parse(config.watch.proxy).hostname,
	port: url.parse(config.watch.proxy).port,
	https: config.watch.https,
	files: [{
		match: config.patterns.copy,
		fn: () => {
			app.reload();
		},
	}],
	reloadDelay: config.watch.delay,
	refresh: true,
	proxy: {
		target: targetUrl,
	},
	plugins: [
		{
			module: 'bs-html-injector',
			options: {
				files: config.patterns.html,
			},
		},
	],
	middleware: [
		devMiddleware(compiler, {
			publicPath: proxyUrl,
			logLevel: 'silent',
			stats: false,
			writeToDisk: (file) => {
				return /\.([ot]tf|eot|woff2?|png|jpe?g|gif|svg|ico)$/.test(file);
			},
		}),
		hmrMiddleware(compiler, {
			log: app.notify.bind(app),
		}),
	],
	snippetOptions: {
		rule: {
			match: /(<\/body>)/i,
			fn: function (snippet, match) {
				return snippet + match;
			},
		},
	},
});