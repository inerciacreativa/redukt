const cssnanoConfig = {
	preset: ['default', {discardComments: {removeAll: true}}],
};

/**
 * Adds the configuration for PostCSS.
 *
 * @param config
 * @returns {{parser: *, plugins: {autoprefixer: boolean, cssnano: *}}}
 */
module.exports = (config) => {
	return {
		path: __dirname,
		parser: config.env.production ? 'postcss-safe-parser' : undefined,
		plugins: {
			cssnano: config.env.production ? cssnanoConfig : false,
			autoprefixer: true,
		},
	};
};
