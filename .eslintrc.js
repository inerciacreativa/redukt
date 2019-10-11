module.exports = {
	"root": true,
	"extends": "eslint:recommended",
	"globals": {
		"wp": true,
		"workbox": true,
		"__webpack_public_path__": true,
	},
	"env": {
		"node": true,
		"es6": true,
		"amd": true,
		"browser": true,
		"serviceworker": true,
		"jquery": true,
	},
	"parserOptions": {
		"ecmaFeatures": {
			"globalReturn": true,
			"generators": false,
			"objectLiteralDuplicateProperties": false,
		},
		"ecmaVersion": 2018,
		"sourceType": "module",
	},
	"plugins": [
		"import",
	],
	"settings": {
		"import/core-modules": [],
		"import/ignore": [
			"node_modules",
			"\\.(scss|css|svg|json)$",
		],
	},
	"rules": {
		"no-console": process.env.NODE_ENV === 'production' ? 2 : 0,
		"comma-dangle": [
			"error",
			{
				"arrays": "always-multiline",
				"objects": "always-multiline",
				"imports": "always-multiline",
				"exports": "always-multiline",
				"functions": "ignore",
			},
		],
	},
};