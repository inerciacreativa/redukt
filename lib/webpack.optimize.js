const {merge} = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

/**
 * Adds the plugins to optimize scripts and images when in production mode.
 *
 * @param config
 * @returns {{optimization: {minimizer: (*|TerserPlugin)[]}, plugins:
 *     ImageMinimizerPlugin[]}}
 */
module.exports = (config) => {
	const ImageminConfig = merge(require('./imagemin.config'), config.imagemin);

	return {
		optimization: {
			moduleIds: 'deterministic',
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
			],
		},
		plugins: [
			new ImageMinimizerPlugin({
				filename: `[path][name][ext]`,
				minimizerOptions: {
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
