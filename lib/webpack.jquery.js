const webpack = require('webpack');
const CopyPlugin = require('copy-globs-webpack-plugin');

/**
 * Adds support for jQuery. If it's not bundled then add it to the cache
 * manifest.
 *
 * @param   {Object} config
 * @returns {{plugins: Array}}
 */
module.exports = (config) => {
  const webpackConfig = {
    plugins: [],
  };

  if (!config.jquery.bundle) {
    const version = config.env.production ? '.' + require(`jquery/package.json`).version.replace(/\./g, '') : '';
    const folder = config.folder.scripts;
    const source = '../node_modules/jquery/dist/jquery.min.js';
    const target = `${folder}/jquery${version}.js`;

    webpackConfig.plugins.push(new CopyPlugin({
        pattern: source,
        output: target,
      }),
    );

    webpackConfig.externals = {
      jquery: 'jQuery',
    };

    config.cache.files[`${folder}/jquery.js`] = target;
  }

  webpackConfig.plugins.push(new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
  );

  return webpackConfig;
};
