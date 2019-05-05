const webpack = require('webpack');
const StyleLintPlugin = require('stylelint-webpack-plugin');

/**
 * Adds the configuration for linting styles and scripts.
 * The scripts will always interrupt the compilation if the have errors, the
 * styles will only fail when not in watch mode.
 *
 * @param config
 * @returns {{plugins: Array}}
 */
module.exports = (config) => {
  const webpackConfig = {
    plugins: [],
  };

  if (config.lint.styles) {
    webpackConfig.plugins.push(new StyleLintPlugin({
      emitErrors: !config.watch.enabled,
      failOnError: false,
    }));
  }

  if (config.lint.scripts) {
    webpackConfig.module = {
      rules: [
        {
          enforce: 'pre',
          test: /\.js$/,
          include: config.path.source,
          use: 'eslint',
        },
      ],
    };

    webpackConfig.plugins.push(new webpack.LoaderOptionsPlugin({
      test: /\.js$/,
      options: {
        eslint: {
          failOnWarning: false,
          failOnError: true,
        },
      },
    }));
  }

  return webpackConfig;
};
