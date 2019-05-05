#!/usr/bin/env node

const {spawn} = require('child_process');
const exit = require('signal-exit');
const output = require('./../lib/helpers/output');
const params = ['--config=node_modules/redukt/lib/webpack.config.js', '--colors', '--watch', '--hide-modules'];
const webpack = spawn('webpack', params, {
  detached: true,
  stdio: ['ignore', 'pipe', 'pipe'],
});

webpack.stdout.on('data', (data) => {
  const text = output.data(data);

  if (text.indexOf('DONE') !== -1 || text.indexOf('WAIT') !== -1 || text.indexOf('WARNING') !== -1) {
    console.clear();
  }

  output.write(text);
})

webpack.stderr.on('data', (data) => {
  const text = output.error(data);

  console.clear();
  text.forEach(line => output.write(line));
});

webpack.unref();

exit((code, signal) => {
  webpack.kill(signal);
});
