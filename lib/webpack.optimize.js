const webpack = require('webpack');
const {default: ImageminPlugin} = require('imagemin-webpack-plugin');
const imageminMozjpeg = require('imagemin-mozjpeg');

/**
 * Adds the plugins to optimize scripts and images when in production mode.
 *
 * @param   {Object} config
 * @returns {{plugins: any[]}}
 */
module.exports = (config) => {
  return {
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          screw_ie8: true,
          conditionals: true,
          unused: true,
          comparisons: true,
          sequences: true,
          dead_code: true,
          evaluate: true,
          if_return: true,
          join_vars: true,
        },
        output: {
          comments: false,
        },
      }),
      new ImageminPlugin({
        optipng: {optimizationLevel: 7},
        gifsicle: {optimizationLevel: 3},
        pngquant: {quality: '65-90', speed: 4},
        svgo: {
          plugins: [
            {removeUselessDefs: false},
            {removeUnknownsAndDefaults: false},
            {removeTitle: false},
            {cleanupIDs: false},
          ],
        },
        plugins: [imageminMozjpeg({quality: 75})],
        disable: (config.watch.enabled),
      }),
      new webpack.NoEmitOnErrorsPlugin(),
    ],
  };
};
