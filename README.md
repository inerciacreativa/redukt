# Redukt

Redukt is an utility to build assets and resources.

## Features

* [webpack](https://webpack.github.io/) for compiling assets, optimizing images, and concatenating and minifying files.
* [Browsersync](http://www.browsersync.io/) for synchronized browser testing.
* [Sass](https://sass-lang.com/) and [Less](http://lesscss.org/) for stylesheets.
* Use PostCSS [Autoprefixer](https://autoprefixer.github.io/) to make CSS work with needed vendor prefixes.
* Support for modern JavaScript with [Babel](https://babeljs.io/).
* Styles linting with [stylelint](https://stylelint.io/).
* Scripts linting with [ESLint](https://eslint.org/).
* Minifying styles with [cssnano](https://cssnano.co/).
* Minifying scripts with [terser](https://github.com/terser-js/terser).
* Minifying images with [imagemin](https://github.com/imagemin/imagemin) (JPEG, PNG, GIF, SVG, WebP).
* Cache busting manifest.
* Support for [jQuery](https://jquery.com/).
* Support for [Workbox](https://developers.google.com/web/tools/workbox/) to build PWAs.

## Installation

You can use `yarn` or `npm` in the root of the project. If you don't have a `package.json` created yet, then:

```shell
yarn init
```

In order to install Redukt:

```shell
yarn add redukt --dev
```

For WordPress or Drupal it will be the folder of the theme you are developing. Then create a file named `redukt.json` in the same folder. See an [example](#example-config) below.

## Build commands

* `yarn watch` — Start **Browsersync** session (watch mode), compile assets when file changes are made.
* `yarn build` — Compile the assets.
* `yarn build -p` — Compile and optimize the assets for production. This will generate the manifest.
* `yarn lint` — Run **ESLint** and **stylelint**.

## Config options

| Name | Type | Default | Description |
|---|---|---|---|
|`entry`|`{string\|Object}`|`{[chunk: string]: string\|string[]}`|The entry points for **webpack**.|
|`path.public`|`{string}`|`/`|Specifies the public URL of the output directory when referenced in a browser (see `output.publicPath` config option of **webpack**).|
|`folder.source`|`{string}`|`source`|The base folder where the assets are located.|
|`folder.target`|`{string}`|`target`|The base folder where the assets will be created.|
|`folder.styles`|`{string}`|`styles`|The folder where the styles are located (and will be created under the `target` folder).|
|`folder.scripts`|`{string}`|`scripts`|The folder where the scripts are located (and will be created under the `target` folder).|
|`folder.images`|`{string}`|`images`|The folder where the images are located (and will be created under the `target` folder).|
|`folder.fonts`|`{string}`|`images`|The folder where the fonts are located (and will be created under the `target` folder).|
|`watch.url`|`{string}`||The local development URL.|
|`watch.proxy`|`{string}`|`http://localhost:3000`|The proxy for the local URL.|
|`watch.https`|`{boolean\|Object}`|`false`|Whether to enable HTTPS for local development. It can be a hash with a `key` and a `cert` properties to enable with custom certificates.|
|`watch.open`|`{boolean}`|`false`|Whether to launch the browser when watch mode starts.|
|`watch.delay`|`{number}`|`250`|Reload delay following a file change event.|
|`patterns.copy`|`{Array}`|`['images/**/*', 'fonts/**/*']`|Files to copy. These default folders will be included only if they exists and are not empty.|
|`patterns.html`|`{Array}`|`['*.php']`|Files to watch in watch mode. Changes you make will either be injected into the page (CSS & HTML).|
|`lint.scripts`|`{boolean}`|`true`|Whether to lint scripts with **ESLint**.|
|`lint.styles`|`{boolean}`|`true`|Whether to lint stylesheets with **stylelint**.|
|`lint.watch`|`{boolean}`|`false`|Whether to run linters when in watch mode.|
|`cache.manifest`|`{string}`|`assets.json`|The name of the generated cache manifest.|
|`cache.name`|`{string}`|`[name].[hash:12]`|The filenames that will be generated (see `output.filename` config option of **webpack**).|
|`imagemin`|`{Object}`|`{}`|Custom configuration for **imagemin**. See `lib/imagemin.config.js` for current configuration.|
|`jquery.enabled`|`{boolean}`|`false`|Whether to use jQuery.|
|`jquery.bundle`|`{boolean}`|`false`|Whether to serve as an external script or bundle with the main entry point for JavaScript|
|`workbox.script`|`{string}`||The service worker script. If empty Workbox will not be used (see `swSrc` config option).|
|`workbox.manifest`|`{string}`|`cache.[manifestHash].js`|The name of the generated precache manifest (see `precacheManifestFilename` config option).|
|`workbox.cdn`|`{boolean}`|`false`|Whether to load Workbox from the CDN or create a local copy of the runtime librarie (see `importWorkboxFrom` config option).|
|`workbox.urls`|`{Object}`|`{}`|To generate unique versioning information (see `templatedUrls` config option).|

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
└── assets/               # → Built assets (generated, do not edit)
    ├── images/           # → Optimized images (generated, do not edit)
    ├── scripts/          # → Optimized scripts (generated, do not edit)
    ├── styles/           # → Optimized stylesheets (generated, do not edit)
    └── assets.json       # → Cache busting manifest (generated, do not edit)
```

## Example config

This `redukt.json` example config is for a WordPress theme.

```json
{
    "path": {
        "public": "/wp-content/themes/your-theme"
    },
    "entry": {
        "app": [
            "styles/app.scss",
            "scripts/app.js"
        ]
    },
    "watch": {
        "proxy": "https://localhost:3000",
        "url": "https://your-local-domain.test",
        "https": {
            "key": "path-to-your/private.key",
            "cert": "path-to-your/public.cert"
        }
    },
    "patterns": {
        "html": ["*.php"],
        "copy": [
            "images/**/*",
            "fonts/**/*"
        ]
    },
    "jquery": {
        "enabled": true
    },
    "workbox": {
        "script": "scripts/your-service-worker.js",
        "cdn": true,
        "urls": {
            "/site.webmanifest": "./../../../site.webmanifest",
            "/favicon.ico": "./../../../favicon.ico"
        }
    }
}
```

## Watch

When you run `yarn watch` you will see something like this:

```shell
[HTML Injector] Running...
[Browsersync] Proxying: https://your-local-domain.test
[Browsersync] Access URLs:
 ---------------------------------------
       Local: https://localhost:3000
    External: https://192.168.1.100:3000
 ---------------------------------------
          UI: http://localhost:3001
 UI External: http://192.168.1.100:3001
 ---------------------------------------
[Browsersync] Watching files...
```

In this mode:

* Only the files specified in `patterns.copy` will be copied to `path.target` folder.
* Changes made to scripts in `folder.scripts` and files in `patterns.copy` will cause all browsers to do a full-page refresh.
* Changes made to styles in `folder.styles` and files in `patterns.html` will be injected into the page.
* Source maps will be generated so you can inspect the real source path of styles and scripts in the browser dev tools.
* The manifest won't be generated.

## Build for development

When you run `yarn build` you will see something like this:

```shell
             Asset       Size  Chunks             Chunk Names
  images/icons.svg   5.47 KiB          [emitted]
   images/logo.svg   25.1 KiB          [emitted]
    scripts/app.js   69.4 KiB     app  [emitted]  app
scripts/app.js.map    100 KiB     app  [emitted]  app
 scripts/jquery.js   86.1 KiB          [emitted]
    styles/app.css   71.9 KiB     app  [emitted]  app
styles/app.css.map    196 KiB     app  [emitted]  app
Entrypoint app = styles/app.css scripts/app.js styles/app.css.map scripts/app.js.map
```

In this mode:

* The resulting assets won't be optimized.
* Source maps will be generated so you can inspect the real source path of styles and scripts in the browser dev tools.
* The manifest won't be generated.

## Build for production

When you run `yarn build -p` you will see something like this:

```shell
                                            Asset       Size  Chunks             Chunk Names
                                      assets.json  260 bytes          [emitted]
                    images/icons.2dee76cf4f9c.svg    4.2 KiB          [emitted]
                     images/logo.39b1539b522f.svg   24.8 KiB          [emitted]
                      scripts/app.11e725b84dfb.js     26 KiB       0  [emitted]  app
scripts/cache.9c59560e9fdcd02e1a56f6fafbe8d2d5.js   1.65 KiB          [emitted]
                            scripts/jquery.341.js   86.1 KiB          [emitted]
                   scripts/your-service-worker.js   3.62 KiB          [emitted]
                      styles/app.46e006c2057e.css   51.5 KiB       0  [emitted]  app
Entrypoint app = styles/app.46e006c2057e.css scripts/app.11e725b84dfb.js
```

In this mode:

* The styles and scripts will be linted, if there are errors the assets won't be generated.
* The resulting assets will be optimized.
* Source maps won't be generated.
* The manifest will be generated.

The contents of the `assets.json` manifest will be in this example:

```json
{
  "images/icons.svg": "images/icons.2dee76cf4f9c.svg",
  "images/logo.svg": "images/logo.39b1539b522f.svg",
  "scripts/jquery.js": "scripts/jquery.341.js",
  "styles/app.css": "styles/app.46e006c2057e.css",
  "scripts/app.js": "scripts/app.11e725b84dfb.js"
}
```

This way you can get the final filenames of the assets (if the manifest don't exists the filenames won't change).

## Styles

When use the [`<url>`](https://developer.mozilla.org/en-US/docs/Web/CSS/url) CSS data type to load an image or font use `folder.source` as the root:

```css
background: url("/images/background.png");
```

If the file is a SVG image and its size is less than 8192 bytes it will be inlined as a [Data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) encoded as text (UTF-8). Other supported image formats will be inlined if its size is less than 4096 bytes, and will be encoded in base64.

The stylesheets are processed with [Autoprefixer](https://autoprefixer.github.io/) to make it work with needed vendor prefixes.

## Scripts

Redukt uses [ifdef-loader](https://github.com/nippur72/ifdef-loader) and defines two variables, `DEVELOPMENT` and `PRODUCTION`, which you can use in your scripts to make conditional compilations.

In order to transpile ES6 to ES5, Redukt uses [Babel](https://babeljs.io/).

## jQuery

You must add jQuery as a dependency in order to use it.

```shell
yarn add jquery
```

## Workbox

Redukt uses the [InjectManifest](https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin#injectmanifest_plugin_2) plugin, that creates a precache manifest and inject it in the service worker with `importScripts()`.

You have to create the [service worker](https://developers.google.com/web/tools/workbox/guides/get-started) script and register it.

```javascript
// Path based on the example from above.
var sw = '/wp-content/themes/your-theme/assets/scripts/your-service-worker.js';

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(sw, {scope: '/'})
    .then(function(register)) {
        ...
    })
    .catch(function(error)) {
        ...
    });
}
```

## License

[MIT](./LICENSE.md)
