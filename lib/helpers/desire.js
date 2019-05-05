const path = require('path');

/**
 * @module helpers/desire
 *
 * @param {string} dependency
 * @param {any} [fallback]
 * @returns {any}
 */
module.exports = (dependency, fallback) => {
  dependency = path.resolve(process.cwd(), dependency);

  try {
    require.resolve(dependency);
  } catch (err) {
    return fallback;
  }

  return require(dependency);
};