Redukt is an utility to build assets and resources. Redukt is based on [Sage 9](https://roots.io/sage/).

## Features

* Sass and Less for stylesheets
* ES6 for JavaScript
* [Webpack](https://webpack.github.io/) for compiling assets, optimizing images, and concatenating and minifying files
* [Browsersync](http://www.browsersync.io/) for synchronized browser testing

## Requirements

* [Node.js](http://nodejs.org/) >= 6.9.x
* [Yarn](https://yarnpkg.com/en/docs/install)

## Structure

```shell
project/                  # → Root of your Redukt based project
├── bower_components/     # → Bower packages (never edit)
├── node_modules/         # → Node.js packages (never edit)
├── package.json          # → Node.js dependencies and scripts
├── source/               # → Source assets
│   ├── build/            # → Webpack, ESLint and PostCSS config
│   ├── images/           # → Source images
│   ├── scripts/          # → Source scripts
│   ├── styles/           # → Source stylesheets
│   └── config.json       # → Settings
└── target/               # → Built assets (never edit)
    ├── images/           # → Optimized images (never edit)
    ├── scripts/          # → Optimiezd scripts (never edit)
    ├── styles/           # → Optimiezd stylesheets (never edit)
    └── assets.json       # → Cache busting manifest (never edit)
```
## Build commands

* `yarn run start` — Compile assets when file changes are made, start Browsersync session
* `yarn run build` — Compile and optimize the files in your source directory
* `yarn run build:production` — Compile assets for production
* `yarn run clear` — Cleans the target directory
