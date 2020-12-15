const webpack = require('webpack');
const merge = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack');

/**
 * Adds the plugins to optimize scripts and images when in production mode.
 *
 * @param config
 * @returns {{optimization: {minimizer: (*|TerserPlugin)[]}, plugins:
 *     ImageminPlugin[]}}
 */
module.exports = (config) => {
	const ImageminConfig = merge(require('./imagemin.config'), config.imagemin);

	return {
		optimization: {
			minimize: true,
			minimizer: [
				new TerserPlugin({
					parallel: true,
					extractComments: false,
					terserOptions: {
						compress: {
							warnings: true,
							drop_console: true,
						},
						output: {
							comments: false,
						},
					},
				}),
				new webpack.HashedModuleIdsPlugin(),
			],
		},
		plugins: [
			new ImageminPlugin({
				name: `[path][name].[ext]`,
				imageminOptions: {
					plugins: [
						['mozjpeg', ImageminConfig.mozjpeg],
						['optipng', ImageminConfig.optipng],
						['pngquant', ImageminConfig.pngquant],
						['gifsicle', ImageminConfig.gifsicle],
						['webp', ImageminConfig.webp],
						['svgo', ImageminConfig.svgo],
					],
				},
			}),
		],
	};
};
