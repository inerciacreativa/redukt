/**
 * Convert Buffer to an array of strings.
 *
 * @param  {Buffer} buffer
 * @return {String[]}
 */
const parse = (buffer) => buffer
	.toString()
	.replace(/[\b]/g, ' ') // Normalize spaces
	.split(/\s{2,}/);

/**
 * Remove unnecessary info.
 *
 * @param  {String} string
 * @return {String}
 */
const clear = (string) => string
	.replace(/<s> \[webpack.Progress\] /g, '')
	.replace(/^(.*)(\d{1,2} active).*$/gm, '$1$2')
	.trim();

/**
 * Count the number of lines in a string.
 *
 * @param  {String} string
 * @return {Number}
 */
const lines = (string) => (string.match(/\n/g) || []).length;

/**
 * Add string to array if not empty.
 *
 * @param {String[]} output
 * @param {String}   string
 */
const push = (output, string) => {
	if (string === '' || string === '100%' || string.includes('NODE_TLS_REJECT_UNAUTHORIZED')) {
		return;
	}

	output.push(string);
}

/**
 * Convert to string, remove backspaces and module info and split in lines.
 *
 * @param   {Buffer} buffer
 * @returns {String[]}
 */
const parseError = (buffer) => {
	const output = [];

	parse(buffer).forEach(string => {
		string = clear(string);

		if (lines(string) > 0) {
			string.split('\n').forEach(line => push(output, line));
		} else {
			push(output, string);
		}
	});

	return output;
}

/**
 * Convert to string, optionally remove the date.
 *
 * @param   {Buffer} buffer
 * @returns {String}
 */
const parseBuffer = (buffer, date = false) => {
	let string = buffer.toString();

	if (!date) {
		string = string.replace(/\d{1,2}:\d{2}:\d{2}(\s?[AP]M)?/, '');
	}

	if (string.replace(/\u001b\[.*?m/g, '').trim() === 'error') {
		return '';
	}

	return string;
}

/**
 * Output to stdout, optionally clear the previous line.
 *
 * @param {String} text
 * @param {Boolean} clear
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
	parseBuffer: parseBuffer,
	parseError: parseError,
	write: write,
};
