#!/usr/bin/env node

const {argv} = require('yargs');
const {spawn} = require('child_process');
const output = require('./../lib/helpers/output');
const params = ['--config=node_modules/redukt/lib/webpack.config.js', '--colors', '--progress'];

if (argv.p || argv.production) {
  params.push('-p')
}

const webpack = spawn('webpack', params);
let clear = null;
let date = false;

webpack.stdout.on('data', (buffer) => {
  const text = output.parseBuffer(buffer, date);

  output.write(text, clear);

  date = true;
  if (clear === true) {
    clear = false;
  }
})

webpack.stderr.on('data', (data) => {
  const text = output.parseError(data);

  if (clear === null) {
    clear = true;
  }

  text.forEach(line => output.write(line, clear));
});
