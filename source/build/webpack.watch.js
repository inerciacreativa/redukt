const url = require('url');
const webpack = require('webpack');
const BrowserSyncPlugin = require('browsersync-webpack-plugin');

module.exports = (config) => {
  /**
   * We do this to enable injection over SSL.
   */
  const target = process.env.DEVURL || config.devUrl;
  if (url.parse(target).protocol === 'https:') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
  }

  return {
    output: {
      pathinfo: true,
      publicPath: config.proxyUrl + config.publicPath,
    },
    devtool: '#cheap-module-source-map',
    stats: false,
    plugins: [
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new BrowserSyncPlugin({
        target,
        open: config.open,
        proxyUrl: config.proxyUrl,
        watch: config.watch,
        delay: 500,
        disableHostCheck: true,
        advanced: {
          browserSync: {
            https: config.devSsl,
          },
        },
      }),
    ],
  };
};
