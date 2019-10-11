#!/usr/bin/env node

const {spawn} = require('child_process');
const exit = require('signal-exit');
const output = require('./../lib/helpers/output');
const params = ['node_modules/redukt/lib/webpack.watch.js', '--colors', '--watch'];
const node = spawn('node', params, {
	detached: true,
	stdio: ['ignore', 'pipe', 'pipe'],
});

node.stdout.on('data', (buffer) => {
	const text = output.parseBuffer(buffer);

	output.write(text);
})

node.stderr.on('data', (buffer) => {
	const text = output.parseError(buffer);

	text.forEach(line => output.write(line));
});

node.unref();

exit((code, signal) => {
	node.kill(signal);
});