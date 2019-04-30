const AssetsManifest = require('webpack-assets-manifest');

/**
 * Adds the WebpackAssetsManifest plugin to generate a cache manifest.
 *
 * @param config
 * @returns {{plugins: WebpackAssetsManifest[]}}
 */
module.exports = (config) => {
  return {
    plugins: [
      new AssetsManifest({
        output: config.cache.manifest,
        space: 2,
        writeToDisk: false,
        assets: config.cache.files,
        replacer: require('./helpers/manifest')(config),
      }),
    ],
  };
};
