#!/usr/bin/env node

const {argv} = require('yargs');
const {spawn} = require('child_process');
const params = ['webpack', '--config=node_modules/redukt/lib/webpack.config.js', '--progress'];

if (argv.p || argv.production) {
	params.push('--mode=production')
}

const webpack = spawn(params.join(' '), {
	stdio: 'inherit',
	shell: true
});
