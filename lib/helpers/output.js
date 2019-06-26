/**
 * Convert to string and remove the date.
 *
 * @param   {Buffer} buffer
 * @returns {string}
 */
const data = (buffer) => buffer.toString().replace(/\d{1,2}:\d{2}:\d{2}(\s?[AP]M)?/, '');

/**
 * Convert to string, remove backspaces and module info and split in lines.
 *
 * @param   {Buffer} buffer
 * @returns {string[]}
 */
const error = (buffer) => {
  const string = buffer.toString().replace(/[\b]/g, ' ').split(/\s{2,}/);
  const lines = [];

  string.forEach(line => lines.push(line.replace(/^(.*)(\d{1,2} active).*$/g, '$1$2').trim()));

  return lines;
}

/**
 * Output to stdout, optionally clear the last line.
 * 
 * @param {string} text
 * @param {boolean} clear
 */
const write = (text, clear = false) => {
  if (text === '') {
    return;
  }

  if (clear) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
  }

  process.stdout.write(text);
};

/**
 * @module helpers/output
 */
module.exports = {
  data: data,
  error: error,
  write: write,
};