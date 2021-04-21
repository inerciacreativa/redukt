'use strict';

const {merge} = require('webpack-merge');
const babelMerge = require('babel-merge');

/**
 * Merges two Babel configuration objects.
 *
 * @param {{}} objects
 * @return {{}}
 */
const babelMergeAll = (...objects) => {
	return babelMerge.all(objects, {arrayMerge: (destinationArray, sourceArray, options) => sourceArray});
}

/**
 * Merges two sets of svgo plugins.
 *
 * @param {[]} objects
 * @return {[]}
 */
const svgoMerge = (...objects) => {
	const isObject = object => object && typeof object === 'object';
	const filterArray = array => {
		return array.reverse().filter((value, index, array) => {
			if (isObject(value)) {
				const key = Object.keys(value);
				const first = array.findIndex(x => key in x);

				if (index > first) {
					return false;
				}
			}
			return true;
		});
	};

	return objects.reduce((result, current) => {
		Object.keys(current).forEach(key => {
			const rValue = result[key];
			const cValue = current[key];

			if (Array.isArray(rValue) && Array.isArray(cValue)) {
				result[key] = filterArray([...rValue, ...cValue]);
			} else if (isObject(rValue) && isObject(cValue)) {
				result[key] = svgoMerge(rValue, cValue);
			} else {
				result[key] = cValue;
			}
		});

		return result;
	}, []);
};

module.exports = {
	webpack: merge,
	babel: babelMergeAll,
	svgo: svgoMerge,
}
