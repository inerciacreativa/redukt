'use strict';

/**
 * @class
 */
class Uri {
	/**
	 * Returns the local external IP.
	 *
	 * @return {String}
	 */
	static localhost() {
		const interfaces = require('os').networkInterfaces();

		return Object.keys(interfaces)
			.map(x => interfaces[x].filter(x => x.family === 'IPv4' && !x.internal)[0])
			.filter(x => x)[0].address;
	}
}

module.exports = Uri;
