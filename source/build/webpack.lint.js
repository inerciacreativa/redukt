const webpack = require('webpack');
const StyleLintPlugin = require('stylelint-webpack-plugin');

module.exports = (config) => {
  let webpackConfig = {
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.js$/,
          include: config.paths.source,
          use: 'eslint'
        }
      ]
    },
    plugins: [
      new webpack.LoaderOptionsPlugin({
        test: /\.js$/,
        options: {
          eslint: {failOnWarning: false, failOnError: true}
        }
      })
    ]
  };

  if (config.enabled.lint === true || config.enabled.lint === 'styles') {
    webpackConfig.plugins.push(new StyleLintPlugin({
      files: ['**/*.s?(a|c)ss', '**/*.less'],
      failOnError: false
    }));
  }

  return webpackConfig;
};
