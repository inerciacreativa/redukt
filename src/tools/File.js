'use strict';

const fs = require('fs');
const path = require('path');
const Redukt = require('../builder/Redukt');

/**
 * @class
 */
class File {
	constructor(file) {
		this.file = file;
		this.absolutePath = path.resolve(file);
		this.filePath = this.relativePath();
		this.segments = this.parse();
	}

	static root() {
		return new Redukt().root();
	}

	static source() {
		return new Redukt().source();
	}

	static find(file) {
		return new File(file);
	}

	static exists(file) {
		return fs.existsSync(file);
	}

	/**
	 *
	 * @param json
	 * @return {string}
	 */
	read(json = false) {
		let content = fs.readFileSync(this.path(), 'utf8');
		if (json) {
			content = JSON.parse(content);
		}

		return content;
	}

	path() {
		return this.absolutePath;
	}

	relativePath() {
		return path.relative(File.root(), this.path());
	}

	forceFromRoot() {
		const root = File.root();

		if (!this.relativePath().startsWith(root)) {
			return new File(path.join(root, this.relativePath()));
		}

		return this;
	}

	forceFromSource() {
		const source = File.source();

		if (!this.relativePath().startsWith(source)) {
			return new File(path.join(source, this.relativePath()));
		}

		return this;
	}

	isDirectory() {
		return this.segments.isDir;
	}

	isFile() {
		return this.segments.isFile;
	}

	isAbsolute() {
		return path.isAbsolute(this.file);
	}

	parse() {
		const parsed = path.parse(this.absolutePath);

		return {
			path: this.filePath,
			absolutePath: this.absolutePath,
			pathWithoutExt: path.join(parsed.dir, `${parsed.name}`),
			isDir: !parsed.ext && !parsed.name.endsWith('*'),
			isFile: !!parsed.ext,
			name: parsed.name,
			ext: parsed.ext,
			file: parsed.base,
			base: parsed.dir
		};
	}
}

module.exports = File;
