const cssnanoConfig = {
  preset: ['default', {discardComments: {removeAll: true}}],
};

/**
 * Adds the configuration for PostCSS.
 *
 * @param options
 * @returns {{parser: *, plugins: {autoprefixer: boolean, cssnano: *}}}
 */
module.exports = ({options}) => {
  return {
    parser: options.env.production ? 'postcss-safe-parser' : undefined,
    plugins: {
      cssnano: options.env.production ? cssnanoConfig : false,
      autoprefixer: true,
    },
  };
};
