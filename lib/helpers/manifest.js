const path = require('path');

/**
 * Hack to prepend scripts/ or styles/ folders to manifest keys.
 * It also replaces the Workbox script if enabled.
 *
 * Before:
 *   {
 *     "main.js": "scripts/main_abcdef.js"
 *     "main.css": "styles/main_abcdef.css"
 *   }
 * After:
 *   {
 *     "scripts/main.js": "scripts/main_abcdef.js"
 *     "styles/main.css": "styles/main_abcdef.css"
 *   }
 *
 * @module helpers/manifest
 *
 * @param   {Array} config
 * @returns {Function}
 */
module.exports = (config) => {
  return (key, value) => {
    if (typeof value === 'string') {
      return value;
    }

    const manifest = value;

    if (config.workbox.enabled) {
      const search = `${config.workbox.chunk}.js`;
      const replace = path.basename(config.workbox.script);

      if (search !== replace) {
        manifest[replace] = manifest[search];
        delete manifest[search];
      }
    }

    Object.keys(manifest).forEach((src) => {
      const sourcePath = path.basename(path.dirname(src));
      const targetPath = path.basename(path.dirname(manifest[src]));

      if (sourcePath === targetPath) {
        return;
      }

      manifest[`${targetPath}/${src}`] = manifest[src];
      delete manifest[src];
    });

    return manifest;
  };
};
