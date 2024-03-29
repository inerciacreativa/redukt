#!/usr/bin/env node

const {argv} = require('yargs');
const {spawn} = require('child_process');
const params = ['--config=node_modules/redukt/src/redukt.js', '--color', '--progress'];

if (argv.p || argv.production) {
	params.push('--mode=production');
}

if (argv.d || argv.debug) {
	params.push('--env debug');
}

spawn('webpack', params, {
	stdio: 'inherit',
	shell: true,
});
