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
 * @param   {string} message
 * @returns {string}
 */
const cleanMessage = (message) => message.replace(/^Module build failed.*:\s/, "Module build failed: Module failed because of a stylelint error.\n");

/**
 * Whether the error is from the stylelint plugin.
 *
 * @param   {Object} error
 * @returns {boolean}
 */
const isStylelintError = (error) => error.originalStack.some(stackframe => stackframe.fileName && stackframe.fileName.indexOf('stylelint-webpack-plugin') > 0);

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
  if (isStylelintError(error)) {
    error = Object.assign({}, error, {
      message: cleanStackTrace(cleanMessage(error.message) + '\n'),
      name: 'Lint error',
      type: 'stylelint-error',
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
  const lintErrors = errors.filter(e => e.type === 'stylelint-error');
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
