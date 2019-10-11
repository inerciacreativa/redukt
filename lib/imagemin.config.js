module.exports = {
	mozjpeg: {progressive: true, quality: 80},
	optipng: {optimizationLevel: 7},
	pngquant: {quality: [.65, .9], speed: 4},
	gifsicle: {optimizationLevel: 3},
	webp: {quality: 80},
	svgo: {
		plugins: [
			{removeXMLProcInst: true},
			{removeDoctype: true},
			{removeComments: true},
			{removeMetadata: true},
			{removeDesc: true},
			{removeUnknownsAndDefaults: true},
			{removeTitle: false},
			{removeUselessDefs: false},
			{cleanupIDs: false},
		],
	},
};