#!/usr/bin/env node

const {spawn} = require('child_process');
const exit = require('signal-exit');
const output = require('./../lib/helpers/output');
const params = ['node_modules/redukt/lib/webpack.watch.js', '--colors', '--watch'];
const node = spawn('node', params, {
  detached: true,
  stdio: ['ignore', 'pipe', 'pipe'],
});

node.stdout.on('data', (data) => {
  const text = output.data(data);

  if (text.indexOf('DONE') !== -1 || text.indexOf('WAIT') !== -1 || text.indexOf('WARNING') !== -1) {
    console.clear();
  }

  output.write(text);
})

node.stderr.on('data', (data) => {
  const text = output.error(data);

  console.clear();
  text.forEach(line => output.write(line));
});

node.unref();

exit((code, signal) => {
  node.kill(signal);
});
