/**
 * @module helpers/desire
 *
 * @param {string} dependency
 * @param {any} [fallback]
 * @returns {any}
 */
module.exports = (dependency, fallback) => {
  try {
    require.resolve(dependency);
  } catch (err) {
    return fallback;
  }

  return require(dependency);
};