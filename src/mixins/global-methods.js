import fileLoader from './fileLoader';

export default {
	methods: {
		// Check value is isArray
		isArray(value) {
			return value && typeof value === 'object' && value.constructor === Array;
		},
		// Check value is number
		isNumber(value) {
			// eslint-disable-next-line no-restricted-properties,no-restricted-globals
			return typeof value === 'number' && isFinite(value);
		},
		// Check value is string
		isString(value) {
			return typeof value === 'string' || value instanceof String;
		},
		// Check value is object
		isObject(value) {
			return value && typeof value === 'object' && value.constructor === Object;
		},
		// Check value is null
		isNull(value) {
			return value === null;
		},
		// Check value is undefined
		isUndefined(value) {
			return typeof value === 'undefined';
		},
		isEmpty(value) {
			if (this.isArray(value)) {
				return value.length <= 0;
			}

			if (this.isString(value)) {
				return value.length <= 0;
			}

			if (this.isObject(value)) {
				return Object.keys(value).length <= 0;
			}

			if (this.isNull(value)) {
				return true;
			}

			return !!this.isUndefined(value);
		},
		downloadFile(id) {
			fileLoader.downloadFile(id);
		},
	},
};
