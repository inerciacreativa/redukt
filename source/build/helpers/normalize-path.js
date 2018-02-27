const os = require('os');
const isWindows = os.platform() === 'win32';
const upath = require('upath');
const windowsDriveLetter = /^([a-z]):[\\/]{1,2}/gi;
const linuxPath = (match, letter) => {
  return letter.toLowerCase() + '/'
};

/**
 *
 * @param input
 * @param prefix
 * @returns {string}
 */
module.exports = (input, prefix = '/') => {
  if (isWindows || !windowsDriveLetter.test(input)) {
    return input;
  }

  let output = upath.normalize(input).replace(windowsDriveLetter, linuxPath);

  return upath.join(prefix, output);
};
