#!/usr/bin/env node

const {argv} = require('yargs');
const {spawn} = require('child_process');
const exit = require('signal-exit');
const params = ['node_modules/redukt/src/redukt.js', '--color', '--watch', '--hot'];

if (argv.d || argv.debug) {
	params.push('--debug');
}

const node = spawn('node', params, {
	detached: true,
	stdio: ['ignore', 'pipe', 'pipe'],
});

node.stdout.on('data', (buffer) => {
	const text = buffer.toString();

	process.stdout.write(text);
})

node.stderr.on('data', (buffer) => {
	const text = buffer.toString();

	if (text.match(/NODE_TLS_REJECT_UNAUTHORIZED/)) {
		return;
	}

	process.stdout.write(text);
});

node.unref();

exit((code, signal) => {
	node.kill(signal);
});
