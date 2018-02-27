const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyGlobsPlugin = require('copy-globs-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const config = require('./config');
const assetsFilenames = (config.enabled.cacheBusting) ? config.cacheBusting : '[name]';

let webpackConfig = {
  context: config.paths.source,
  entry: config.entry,
  devtool: (config.enabled.sourceMaps ? '#source-map' : undefined),
  output: {
    path: config.paths.target,
    publicPath: config.publicPath,
    filename: `${config.folders.scripts}/${assetsFilenames}.js`,
  },
  stats: {
    hash: false,
    version: false,
    timings: false,
    children: false,
    errors: true,
    errorDetails: true,
    warnings: false,
    chunks: false,
    modules: false,
    reasons: true,
    source: false,
    publicPath: true,
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|s[ca]ss|less|css)$/,
        include: config.paths.source,
        loader: 'import-glob',
      },
      {
        test: /\.js$/,
        exclude: [/(node_modules)(?![/|\\](bootstrap|foundation-sites))/],
        use: [
          {loader: 'buble', options: {objectAssign: 'Object.assign'}},
        ],
      },
      {
        test: /\.css$/,
        include: config.paths.source,
        use: ExtractTextPlugin.extract({
          fallback: 'style',
          use: [
            {loader: 'css', options: {sourceMap: config.enabled.sourceMaps}},
            {
              loader: 'postcss', options: {
              config: {path: __dirname, ctx: config},
              sourceMap: config.enabled.sourceMaps,
            },
            },
          ],
        }),
      },
      {
        test: /\.less$/,
        include: config.paths.source,
        use: ExtractTextPlugin.extract({
          fallback: 'style',
          use: [
            {loader: 'css', options: {sourceMap: config.enabled.sourceMaps}},
            {
              loader: 'postcss', options: {
              config: {path: __dirname, ctx: config},
              sourceMap: config.enabled.sourceMaps,
            },
            },
            {loader: 'less', options: {sourceMap: config.enabled.sourceMaps}},
          ],
        }),
      },
      {
        test: /\.s[ac]ss$/,
        include: config.paths.source,
        use: ExtractTextPlugin.extract({
          fallback: 'style',
          use: [
            {loader: 'css', options: {sourceMap: config.enabled.sourceMaps}},
            {
              loader: 'postcss', options: {
              config: {path: __dirname, ctx: config},
              sourceMap: config.enabled.sourceMaps,
            },
            },
            {
              loader: 'resolve-url',
              options: {sourceMap: config.enabled.sourceMaps}
            },
            {loader: 'sass', options: {sourceMap: config.enabled.sourceMaps}},
          ],
        }),
      },
      {
        test: /\.(ttf|eot|woff2?|png|jpe?g|gif|svg|ico)$/,
        include: config.paths.source,
        loader: 'url',
        options: {
          limit: 4096,
          name: `[path]${assetsFilenames}.[ext]`,
        },
      },
      {
        test: /\.(ttf|eot|woff2?|png|jpe?g|gif|svg|ico)$/,
        include: /node_modules/,
        loader: 'url',
        options: {
          limit: 4096,
          outputPath: 'vendor/',
          name: `${config.cacheBusting}.[ext]`,
        },
      },
    ],
  },
  resolve: {
    modules: [
      config.paths.source,
      'node_modules',
      'bower_components',
    ],
    enforceExtension: false,
  },
  resolveLoader: {
    moduleExtensions: ['-loader'],
  },
  externals: {
    jquery: 'jQuery',
  },
  plugins: [
    new CleanPlugin(config.paths.clean, {
      root: config.paths.root,
      verbose: false,
    }),
    /**
     * It would be nice to switch to copy-webpack-plugin, but
     * unfortunately it doesn't provide a reliable way of
     * tracking the before/after file names
     */
    new CopyGlobsPlugin({
      pattern: config.copy,
      output: `[path]${assetsFilenames}.[ext]`,
      manifest: config.manifest,
    }),
    new ExtractTextPlugin({
      filename: `${config.folders.styles}/${assetsFilenames}.css`,
      allChunks: true,
      disable: (config.enabled.watcher),
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: config.enabled.optimize,
      debug: config.enabled.watcher,
      stats: {colors: true},
    }),
    new webpack.LoaderOptionsPlugin({
      test: /\.css|s[ac]ss|less$/,
      options: {
        output: {path: config.paths.target},
        context: config.paths.source,
      },
    }),
    new FriendlyErrorsWebpackPlugin(),
  ],
};

if (['all', 'styles', 'scripts'].includes(config.enabled.lint)) {
  webpackConfig = merge(webpackConfig, require('./webpack.lint')(config));
}

if (config.enabled.optimize) {
  webpackConfig = merge(webpackConfig, require('./webpack.optimize')(config));
}

if (config.env.production) {
  webpackConfig.plugins.push(new webpack.NoEmitOnErrorsPlugin());
}

if (config.enabled.cacheBusting) {
  const WebpackAssetsManifest = require('webpack-assets-manifest');

  webpackConfig.plugins.push(
      new WebpackAssetsManifest({
        output: config.manifestFile,
        space: 2,
        writeToDisk: false,
        assets: config.manifest,
        replacer: require('./helpers/manifest'),
      })
  );
}

if (config.enabled.watcher) {
  webpackConfig.entry = require('./helpers/hmr-loader')(webpackConfig.entry);
  webpackConfig = merge(webpackConfig, require('./webpack.watch')(config));
}

module.exports = webpackConfig;
