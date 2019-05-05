const {InjectManifest} = require('workbox-webpack-plugin');
const renameOutputPlugin = require('rename-output-webpack-plugin');
const path = require('path');

/**
 * Adds support for Workbox.
 *
 * Adds the script to the entry so it can be linted. Then its output is renamed
 * so it will be overwritten by the InjectManifest plugin (yeah, an ugly hack).
 *
 * @param config
 * @returns {{entry: {}, plugins: *[]}}
 */
module.exports = (config) => {
  return {
    entry: {
      [config.workbox.chunk]: config.workbox.script,
    },
    plugins: [
      new renameOutputPlugin({
        workbox: config.workbox.script,
      }),
      new InjectManifest({
        swSrc: path.join(config.folder.source, config.workbox.script),
        swDest: config.workbox.script,
        precacheManifestFilename: path.join(config.folder.scripts, config.workbox.manifest),
        excludeChunks: [config.workbox.chunk],
        templatedURLs: config.workbox.urls,
        importWorkboxFrom: config.workbox.import,
      }),
    ],
  }
};
