/**
 * Concat and flattens non-null values.
 * Ex: concat(1, undefined, 2, [3, 4]) = [1, 2, 3, 4]
 *
 * @param   {...any}
 * @returns {any[]}
 */
function concat() {
	const args = Array.from(arguments).filter(e => e != null);
	const baseArray = Array.isArray(args[0]) ? args[0] : [args[0]];
	return Array.prototype.concat.apply(baseArray, args.slice(1));
}

/**
 * Remove the stack trace from the message.
 *
 * @param   {string} message
 * @returns {string}
 */
const cleanStackTrace = (message) => message.replace(/^\s*at\s.*:\d+:\d+[\s)]*\n/gm, '');

/**
 * Replace the error message.
 *
 * @param   {string} type
 * @param   {string} message
 * @returns {string}
 */
const cleanMessage = (type, message) => {
	message = message.replace(/^Module build failed.*:\s/, `Module build failed: Module failed because of a ${type} error.\n`);
	message = message.replace(/^(ModuleBuild)?Error:(.*)\n+/m, "\n");
	return cleanStackTrace(`${message}\n`);
};

/**
 * Whether the error is from the specified module.
 *
 * @param   {string} module
 * @param   {Object} error
 * @returns {boolean}
 */
const isErrorFromModule = (module, error) => error.originalStack.some(frame => frame.fileName && frame.fileName.indexOf(module) > 0);

/**
 * Return the error message.
 *
 * @param   {Object} error
 * @returns {*[]}
 */
const displayError = (error) => [error.message, ''];

/**
 *
 * @param   {Object} error
 * @returns {Object}
 */
const transform = (error) => {
	if (isErrorFromModule('stylelint-webpack-plugin', error)) {
		error = Object.assign({}, error, {
			message: cleanMessage('stylelint', error.message),
			name: 'Lint error',
			type: 'style-error',
		});

		error.webpackError = error.message;
	} else if (isErrorFromModule('node-sass', error)) {
		error = Object.assign({}, error, {
			message: cleanMessage('node-sass', error.message),
			name: 'Sass error',
			type: 'style-error',
		});

		error.webpackError = error.message;
	}

	return error;
};

/**
 *
 * @param   {Object[]} errors
 * @returns {Array}
 */
const format = (errors) => {
	const lintErrors = errors.filter(e => e.type === 'style-error');
	if (lintErrors.length > 0) {
		const flatten = (accum, curr) => accum.concat(curr);
		return concat(
			lintErrors
			.map(error => displayError(error))
			.reduce(flatten, []),
		);
	}

	return [];
};

/**
 * Adds the transformer and formatter for properly display stylelint errors in
 * FriendlyErrorsWebpackPlugin.
 *
 * @module helpers/errors
 */
module.exports = {
	transform: transform,
	format: format,
};
