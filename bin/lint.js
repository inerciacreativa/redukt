#!/usr/bin/env node

const Redukt = require('../src/builder/Redukt');
const {spawnSync} = require('child_process');
const path = require('path');
const argv = require('yargs/yargs')(process.argv.slice(2))
	.usage('Usage: yarn $0 [-t type]')
	.alias('t', 'type')
	.describe('t', 'Linter to run')
	.choices('t', ['css', 'js', 'all'])
	.default('t', 'all')
	.help('h')
	.alias('h', 'help')
	.alias('v', 'version')
	.argv;

const config = new Redukt().config;
const styles = path.resolve(config.folder.source, config.folder.styles, '**/*');
const scripts = path.resolve(config.folder.source, config.folder.scripts);
const color = '\x1b[30m\x1b[42m';
const reset = '\x1b[0m';

if (argv.t === 'all' || argv.t === 'js') {
	console.log(color, 'Running ESLint', reset);
	spawnSync('eslint', [scripts], {stdio: 'inherit'});
}
if (argv.t === 'all' || argv.t === 'css') {
	console.log(color, 'Running stylelint', reset);
	spawnSync('stylelint', [styles], {stdio: 'inherit'});
}
