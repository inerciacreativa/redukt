const url = require('url');
const interfaces = require('os').networkInterfaces();

/**
 * Get the network IP.
 *
 * @return {string}
 */
const resolve = () => {
	return Object.keys(interfaces)
		.map(x => interfaces[x].filter(x => x.family === 'IPv4' && !x.internal)[0])
		.filter(x => x)[0].address;
}

/**
 * Get the target URL.
 *
 * @param {string} original
 * @return {Url}
 */
const target = (original) => {
	return url.parse(process.env.DEVURL || original);
}

/**
 * Get the proxy URL.
 *
 * @param {string} original
 * @param {string} pathname
 * @param {Url} target
 * @return {Url}
 */
const proxy = (original, pathname, target) => {
	const parsed = url.parse(original);

	parsed.pathname = pathname;

	if (parsed.hostname === 'localhost') {
		parsed.hostname = resolve();
		parsed.host = parsed.hostname + ':' + parsed.port
	}

	parsed.protocol = target.protocol;
	parsed.href = url.format(parsed);

	return parsed;
}

/**
 * @param {boolean|Array} config
 * @param {Url} target
 * @return {boolean|Array}
 */
const https = (config, target) => {
	if (typeof config === 'object' && config !== null) {
		return config;
	}

	return target.protocol === 'https:'
}

module.exports = {
	target: target,
	proxy: proxy,
	https: https,
}
