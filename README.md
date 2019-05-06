# Redukt

Redukt is an utility to build assets and resources. Redukt is based on [Sage 9](https://roots.io/sage/).

## Features

* [webpack](https://webpack.github.io/) for compiling assets, optimizing images, and concatenating and minifying files.
* [Browsersync](http://www.browsersync.io/) for synchronized browser testing.
* Sass and Less for stylesheets.
* Styles linting with [stylelint](https://stylelint.io/).
* Modern JavaScript with [Bublé](https://github.com/bublejs/buble).
* Scripts linting with [ESLint](https://eslint.org/).
* Cache busting manifest.
* Support for [jQuery](https://jquery.com/).
* Support for [Workbox](https://developers.google.com/web/tools/workbox/) to build PWAs.

## Requirements

* [Node.js](http://nodejs.org/)
* [Yarn](https://yarnpkg.com/en/docs/install)

## Installation

Download and copy the files to the root of the project. For WordPress or Drupal it will be the folder of the theme you are developing. Then create a file named `redukt.json` in the same folder.

## Build commands

* `yarn watch` — Start **Browsersync** session (watch mode), compile assets when file changes are made.
* `yarn build` — Compile the assets.
* `yarn build -p` — Compile and optimize the assets for production.
* `yarn lint` — Run **ESLint** and **stylelint**.

## Config options

Only the first three are required.

| Name | Type | Default | Description |
|---|---|---|---|
|`entry`|`{string\|Object}`|`{[chunk: string]: string\|string[]}`|The entry points for **webpack**.|
|`path.public`|`{string}`|`/`|Specifies the public URL of the output directory when referenced in a browser (see `output.publicPath` config option of **webpack**).|
|`watch.url`|`{string}`||The local development URL.|
|`watch.proxy`|`{string}`|`http://localhost:3000`|The proxy for the local URL.|
|`watch.https`|`{boolean|Object}`|`false`|Whether to enable HTTPS for local development. It can be a hash with a `key` and a `cert` properties to enable with custom certificates.|
|`watch.open`|`{boolean}`|`false`|Whether to launch the browser when watch mode starts.|
|`watch.files`|`{Array}`|`[]`|Files to watch. Changes you make will either be injected into the page (CSS & images) or will cause all browsers to do a full-page refresh.|
|`lint.styles`|`{boolean}`|`true`|Whether to lint stylesheets with **stylelint**.|
|`lint.scripts`|`{boolean}`|`true`|Whether to lint scripts with **ESLint**.|
|`lint.watch`|`{boolean}`|`true`|Whether to run linters when in watch mode.|
|`cache.manifest`|`{string}`|`assets.json`|The name of the generated cache manifest.|
|`cache.name`|`{string}`|`[name].[hash:12]`|The filenames that will be generated (see `output.filename` config option of **webpack**).|
|`jquery.enabled`|`{boolean}`|`false`|Whether to use jQuery.|
|`jquery.bundle`|`{boolean}`|`false`|Whether to serve as an external script or bundle with the main entry point for JavaScript|
|`workbox.script`|`{string}`||The service worker script. If empty Workbox will not be used (see `swSrc` config option).|
|`workbox.manifest`|`{string}`|`cache.[manifestHash].js`|The name of the generated precache manifest (see `precacheManifestFilename` config option).|
|`workbox.cdn`|`{boolean}`|`false`|Whether to load Workbox from the CDN or create a local copy of the runtime librarie (see `importWorkboxFrom` config option).|
|`workbox.urls`|`{Object}`|`{}`|To generate unique versioning information (see `templatedUrls` config option).|
|`folder.target`|`{string}`|`target`|The folder where the assets will be created.|
|`folder.styles`|`{string}`|`styles`|The folder where the styles are located (and will be created under the `target` folder).|
|`folder.scripts`|`{string}`|`scripts`|The folder where the scripts are located (and will be created under the `target` folder).|
|`folder.images`|`{string}`|`images`|The folder where the images will are located (and will be created under the `target` folder).|

## Structure

This is the default folder structure:

```shell
project/                  # → Root of your Redukt based project
├── node_modules/         # → Node.js packages
├── package.json          # → Node.js dependencies and scripts
├── redukt.json           # → Settings
├── source/               # → Source assets
│   ├── images/           # → Source images
│   ├── scripts/          # → Source scripts
│   ├── styles/           # → Source stylesheets
└── target/               # → Built assets (generated, do not edit)
    ├── images/           # → Optimized images (generated, do not edit)
    ├── scripts/          # → Optimized scripts (generated, do not edit)
    ├── styles/           # → Optimized stylesheets (generated, do not edit)
    └── assets.json       # → Cache busting manifest (generated, do not edit)
```

## jQuery

You must add jQuery as a dependency in order to use it.

## Workbox

Redukt uses the [InjectManifest](https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin#injectmanifest_plugin_1) plugin, that creates a precache manifest and inject it in the service worker with `importScripts()`.

## License

#### [MIT](./LICENSE.md)
