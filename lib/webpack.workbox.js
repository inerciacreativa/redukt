const {InjectManifest} = require('workbox-webpack-plugin');
const path = require('path');


/**
 * Adds support for Workbox.
 *
 * Adds the script to the entry so it can be linted. Then its output is renamed
 * so it will be overwritten by the InjectManifest plugin (yeah, an ugly hack).
 *
 * @param config
 * @returns {{plugins: *[]}}
 */
module.exports = (config) => {
	return {
		plugins: [
			new InjectManifest({
				swSrc: path.join(config.folder.source, config.workbox.script),
				swDest: config.workbox.script,
				precacheManifestFilename: path.join(config.folder.scripts, config.workbox.manifest),
				templatedURLs: config.workbox.urls,
				importWorkboxFrom: config.workbox.import,
			}),
		],
	}
};
