#!/usr/bin/env node

const {argv} = require('yargs');
const {spawn} = require('child_process');
const output = require('./../lib/helpers/output');
const params = ['npx webpack', '--config=node_modules/redukt/lib/webpack.config.js', '--progress'];

if (argv.p || argv.production) {
	params.push('--mode=production')
}

const webpack = spawn(params.join(' '), {
	stdio: 'inherit',
	shell: true
});
let clear = null;
let date = false;
/*
webpack.stdout.on('data', (buffer) => {
	const text = output.parseBuffer(buffer, date);

	output.write(text, clear);

	date = true;
	if (clear === true) {
		clear = false;
	}
})

webpack.stderr.on('data', (buffer) => {
	const text = output.parseError(buffer);

	if (clear === null) {
		clear = true;
	}

	text.forEach(line => output.write(line, clear));
});
*/