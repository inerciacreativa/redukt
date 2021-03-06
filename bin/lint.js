#!/usr/bin/env node

const {spawnSync} = require('child_process');
const path = require('path');
const config = require('./../lib/config');
const styles = path.resolve(config.folder.source, config.folder.styles, '**/*');
const scripts = path.resolve(config.folder.source, config.folder.scripts);
const color = '\x1b[30m\x1b[42m';
const reset = '\x1b[0m';

console.log(color, 'ESLint', reset);
spawnSync('eslint', [scripts], {stdio: 'inherit'});
console.log(color, 'stylelint', reset);
spawnSync('stylelint', [styles], {stdio: 'inherit'});
