const StyleLintPlugin = require('stylelint-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

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
			emitError: !config.watch.enabled,
			failOnError: false,
		}));
	}

	if (config.lint.scripts) {
		webpackConfig.plugins.push(new ESLintPlugin({
			failOnWarning: false,
			failOnError: true,
		}));
	}

	return webpackConfig;
};
