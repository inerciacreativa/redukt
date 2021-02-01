const webpack = require('webpack');
const {merge} = require('webpack-merge');
const BrowserSync = require('browser-sync');
const devMiddleware = require('webpack-dev-middleware');
const hmrMiddleware = require('webpack-hot-middleware');
const hmrLoader = require('./helpers/hmr-loader');
const url = require('./helpers/url');

const config = require('./config');
const targetUrl = url.target(config.watch.url);
const proxyUrl = url.proxy(config.watch.proxy, config.path.public, targetUrl);
const webpackConfig = require('./webpack.config');
const watchConfig = merge(webpackConfig, {
	output: {
		pathinfo: true,
		publicPath: proxyUrl.href,
	},
	devtool: 'cheap-module-source-map',
	stats: 'minimal',
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
	],
});

watchConfig.entry = hmrLoader(watchConfig.entry);

if (targetUrl.protocol === 'https:' && config.watch.unsafe) {
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const compiler = webpack(watchConfig);
const app = BrowserSync.create();

app.init({
	proxy: {
		target: targetUrl.href,
	},
	host: proxyUrl.hostname,
	port: proxyUrl.port,
	https: url.https(config.watch.https, targetUrl),
	open: config.watch.open,
	reloadDelay: config.watch.delay,
	cors: true,
	refresh: true,
	logLevel: 'info',
	files: [{
		match: config.watch.files,
		fn: () => {
			app.reload();
		},
	}],
	plugins: [
		{
			module: 'bs-html-injector',
			options: {
				files: config.patterns.html,
			},
		},
	],
	middleware: [
		function (req, res, next) {
			res.setHeader('X-Proxy-Header', 'Redukt');
			res.setHeader('Access-Control-Allow-Origin', '*');
			next();
		},
		devMiddleware(compiler, {
			publicPath: proxyUrl.href,
			//stats: false,
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
