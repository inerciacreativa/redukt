const {default: ImageminPlugin} = require('imagemin-webpack-plugin');
const imageminMozjpeg = require('imagemin-mozjpeg');

module.exports = (config) => {
  return {
    plugins: [
      new ImageminPlugin({
        optipng: {optimizationLevel: 7},
        gifsicle: {optimizationLevel: 3},
        pngquant: {quality: '65-90', speed: 4},
        svgo: {
          plugins: [
            {removeUselessDefs: false},
            {removeUnknownsAndDefaults: false},
            {removeTitle: false},
            {cleanupIDs: false},
          ],
        },
        plugins: [imageminMozjpeg({quality: 75})],
        disable: (config.enabled.watcher),
      }),
    ],
  };
};
