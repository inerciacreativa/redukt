const WebpackAssetsManifest = require('webpack-assets-manifest');

/**
 * Adds the WebpackAssetsManifest plugin to generate a cache manifest.
 *
 * @param config
 * @returns {{plugins: WebpackAssetsManifest[]}}
 */
module.exports = (config) => {
  return {
    plugins: [
      new WebpackAssetsManifest({
        output: config.cache.manifest,
        writeToDisk: true,
        assets: config.cache.files,
        replacer: require('./helpers/manifest')(config),
      }),
    ],
  };
};
