'use strict';

const Version = require('../tools/Version');
const {argv} = require('yargs');

const env = {
	production: !!((argv.env && argv.env.production) || argv.mode === 'production'),
	watch: !!argv.watch,
	debug: (!!((argv.env && argv.env === 'debug') || argv.debug) && Version.compare(Version.get(), 'v14.16.0', '>=')),
};

/**
 * @class
 */
class Env {
	/**
	 *
	 * @return {Boolean}
	 */
	static isProduction() {
		return env.production;
	}

	/**
	 *
	 * @return {Boolean}
	 */
	static isDevelopment() {
		return !env.production;
	}

	/**
	 *
	 * @return {Boolean}
	 */
	static isWatching() {
		return env.watch;
	}

	/**
	 *
	 * @return {Boolean}
	 */
	static isDebugging() {
		return env.debug;
	}
}

module.exports = Env;
