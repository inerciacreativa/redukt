const webpack = require('webpack');
const {merge} = require('webpack-merge');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const ExtractCssPlugin = require('mini-css-extract-plugin');

const config = require('./config');
const file = (config.env.production) ? config.cache.name : '[name]';

const StyleLoader = ExtractCssPlugin.loader;

const CssLoader = {
	loader: 'css-loader',
	options: {
		sourceMap: config.env.development,
	},
};

const PostCssLoader = {
	loader: 'postcss-loader',
	options: {
		postcssOptions: require('./postcss.config.js')(config),
		sourceMap: config.env.development,
	},
};

let webpackConfig = {
	mode: config.env.development ? 'development' : 'production',
	context: config.path.source,
	entry: config.entry,
	devtool: config.env.development ? 'source-map' : undefined,
	output: {
		path: config.path.target,
		publicPath: config.path.public,
		filename: `${config.folder.scripts}/${file}.js`.replace('[hash', '[chunkhash'),
		chunkFilename: `${config.folder.scripts}/${file}.js`.replace('[hash', '[chunkhash'),
	},
	stats: {
		colors: true,
		hash: false,
		version: false,
		timings: false,
		children: false,
		errors: false,
		errorDetails: true,
		warnings: true,
		chunks: false,
		modules: false,
		reasons: true,
		source: false,
		publicPath: false,
	},
	optimization: {
		emitOnErrors: !(config.env.production || config.watch.enabled),
	},
	module: {
		rules: [
			{
				enforce: 'pre',
				test: /\.(js|s?[ca]ss)$/,
				include: config.path.source,
				loader: 'import-glob',
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
					},
					{
						loader: 'ifdef-loader',
						options: {
							DEVELOPMENT: config.env.development,
							PRODUCTION: config.env.production,
						},
					},
				],
			},
			{
				test: /\.css$/,
				include: config.path.source,
				use: [
					StyleLoader,
					CssLoader,
					PostCssLoader,
				],
			},
			{
				test: /\.less$/,
				include: config.path.source,
				use: [
					StyleLoader,
					CssLoader,
					PostCssLoader,
					{
						loader: 'less-loader',
						options: {
							sourceMap: config.env.development,
						},
					},
				],
			},
			{
				test: /\.s[ca]ss$/,
				include: config.path.source,
				use: [
					StyleLoader,
					CssLoader,
					PostCssLoader,
					{
						loader: 'resolve-url-loader',
						options: {
							sourceMap: config.env.development,
							root: config.path.source,
						},
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true,
						},
					},
				],
			},
			{
				test: /\.(svg)$/,
				include: config.path.source,
				exclude: `/${config.folder.fonts}/`,
				loader: 'svg-url-loader',
				options: {
					limit: 8192,
					name: `[path]${file}.[ext]`,
				},
			},
			{
				test: /\.(png|jpe?g|gif|[ot]tf|eot|woff2?)$/,
				include: config.path.source,
				loader: 'url-loader',
				options: {
					limit: 4096,
					name: `[path]${file}.[ext]`,
				},
			},
			{
				test: /\.(png|jpe?g|gif|svg|[ot]tf|eot|woff2?)$/,
				include: /node_modules/,
				loader: 'url-loader',
				options: {
					limit: 4096,
					outputPath: 'vendor/',
					name: `${file}.[ext]`,
				},
			},
		],
	},
	resolve: {
		modules: config.modules,
		enforceExtension: false,
	},
	resolveLoader: {
		modules: config.modules,
	},
	plugins: [
		new CleanWebpackPlugin(),
		new CopyPlugin({
			patterns: config.copy,
		}),
		new ExtractCssPlugin({
			filename: `${config.folder.styles}/${file}.css`.replace('[hash', '[contenthash'),
			chunkFilename: `${config.folder.styles}/${file}.css`.replace('[name]', '[id]'),
		}),
		new webpack.LoaderOptionsPlugin({
			minimize: config.env.production,
			debug: config.watch.enabled,
			stats: {colors: true},
		}),
		new webpack.LoaderOptionsPlugin({
			test: /\.(s?[ca]ss)$/,
			options: {
				output: {path: config.path.target},
				context: config.path.source,
			},
		}),
	],
};

if (config.jquery.enabled) {
	webpackConfig = merge(webpackConfig, require('./webpack.jquery')(config));
}

if (config.lint.enabled) {
	webpackConfig = merge(webpackConfig, require('./webpack.lint')(config));
}

if (config.workbox.enabled) {
	webpackConfig = merge(webpackConfig, require('./webpack.workbox')(config));
}

if (config.env.production) {
	webpackConfig = merge(webpackConfig, require('./webpack.optimize')(config));
	webpackConfig = merge(webpackConfig, require('./webpack.manifest')(config));
}

module.exports = webpackConfig;
