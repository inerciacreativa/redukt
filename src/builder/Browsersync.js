'use strict';

const Uri = require('../tools/Uri');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

/**
 * @typedef {{}} ReduktHttps
 * @property {string} key
 * @property {string} cert
 */

/**
 * @class
 */
class Browsersync {
	/**
	 *
	 * @param {Redukt} redukt
	 */
	constructor(redukt) {
		const config = redukt.config;
		this.browsersync = require('browser-sync').create();
		this.url = new URL(config.watch.url);
		this.proxy = this.getProxy(config.watch.proxy, this.url, redukt.public());
		this.https = this.getHttps(config.watch.https, this.url, config.watch.unsafe);
		this.files = `${config.folder.target}/**/*`;
		this.open = config.watch.open;
		this.delay = config.watch.delay;
		this.inject = config.watch.inject;
	}

	/**
	 *
	 * @private
	 * @param {String} proxy
	 * @param {URL} url
	 * @param {String} pathname
	 * @return {URL}
	 */
	getProxy(proxy, url, pathname) {
		const parsed = new URL(proxy);

		parsed.protocol = url.protocol;
		parsed.pathname = pathname;

		if (parsed.hostname === 'localhost') {
			parsed.hostname = Uri.localhost();
		}

		return parsed;
	}

	/**
	 *
	 * @private
	 * @param {Boolean|ReduktHttps} https
	 * @param {URL} url
	 * @param {Boolean} unsafe
	 * @return {Boolean|ReduktHttps}
	 */
	getHttps(https, url, unsafe) {
		let result;

		if (typeof https === 'object' && https.cert && https.key) {
			result = https;
		} else {
			result = url.protocol === 'https:';
		}

		if (result && unsafe) {
			process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
		}

		return result;
	}

	/**
	 *
	 * @public
	 * @param {{}} webpackConfig
	 * @return {{}}
	 */
	config(webpackConfig) {
		const compiler = webpack(webpackConfig);

		return {
			proxy: {
				target: this.url.href,
			},
			host: this.proxy.hostname,
			port: this.proxy.port,
			https: this.https,
			open: this.open,
			reloadDelay: this.delay,
			cors: true,
			refresh: true,
			logLevel: 'info',
			files: [{
				match: this.files,
				fn: (event, file) => {
					this.browsersync.reload(file);
				},
			}],
			plugins: [
				{
					module: 'bs-html-injector',
					options: {
						files: this.inject,
					},
				},
			],
			middleware: [
				function (request, response, next) {
					response.setHeader('X-Proxy-Header', 'Redukt');
					response.setHeader('Access-Control-Allow-Origin', '*');
					next();
				},
				webpackDevMiddleware(compiler, {
					publicPath: this.proxy.href,
					writeToDisk: (file) => {
						return /\.(gif|jpe?g|png|svg|webp|eot|[ot]tf|woff2?)$/.test(file);
					},
				}),
				webpackHotMiddleware(compiler, {
					log: this.browsersync.notify.bind(this.browsersync),
				}),
			],
			snippetOptions: {
				rule: {
					match: /(<\/body>|<\/pre>)(?!.*(<\/body>|<\/pre>))/is,
					fn: (snippet, match) => {
						return snippet + match;
					},
				},
			},
		};
	}

	/**
	 *
	 * @public
	 * @param {{}} browsersyncConfig
	 */
	start(browsersyncConfig) {
		this.browsersync.init(browsersyncConfig);
	}
}

module.exports = Browsersync;
