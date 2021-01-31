const path = require('path');

/**
 * Hack to prepend scripts/ or styles/ folders to manifest keys.
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
 * @returns {Function}
 */
module.exports = (config) => {
	return (key, value) => {
		if (typeof value === 'string') {
			return value;
		}

		const manifest = value;

		Object.keys(manifest).forEach((src) => {
			if (src === manifest[src]) {
				delete manifest[src];
				return;
			}

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
