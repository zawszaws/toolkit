/**
 * @copyright	Copyright 2010-2013, The Titon Project
 * @license		http://opensource.org/licenses/bsd-license.php
 * @link		http://titon.io
 */

"use strict";

/**
 * The base object for all Titon classes. Contains global functionality and configuration.
 */
var Titon = {

	/**
	 * Current version.
	 */
	version: '1.0.0',

	/**
	 * Options for all classes.
	 *
	 *	prefix 			- (string) String to prepend to all created element containers
	 *	activeClass		- (string) Class name to append to active elements
	 *	disabledClass	- (string) Class name to append to disabled elements
	 *	draggableClass	- (string) Class name to append to elements that are draggable
	 *	draggingClass	- (string) Class name to append to elements being dragged
	 */
	options: {
		prefix: '',
		activeClass: 'active',
		disabledClass: 'disabled',
		draggableClass: 'draggable',
		draggingClass: 'dragging',
		loadingClass: 'loading',
		failedClass: 'failed'
	},

	/**
	 * Localization messages.
	 */
	msg: {
		loading: 'Loading...',
		error: 'An error has occurred!'
	},

	/**
	 * Converts a value to a specific scalar type.
	 * The value is extracted via parseOptions().
	 *
	 * @param {String} value
	 * @return {boolean|String|int}
	 */
	convertType: function(value) {
		value = value.trim();

		if (value === 'true') {
			value = true;

		} else if (value === 'false') {
			value = false;

		} else if (value === 'null') {
			value = null;

		} else if (isNaN(value)) {
			value = String.from(value);

		} else {
			value = Number.from(value);
		}

		return value;
	},

	/**
	 * Merge custom options into the base. Clone the base as to not reference the original.
	 *
	 * @param {Object} base
	 * @param {Object} options
	 * @return {Object}
	 */
	mergeOptions: function(base, options) {
		return Object.merge(Object.clone(base || {}), options || {});
	},

	/**
	 * Parse options out of the data-options attributes.
	 * Format: key1:value1;key2:value2
	 *
	 * @param {Object} data
	 * @return {Object}
	 */
	parseOptions: function(data) {
		var options = {};

		if (data) {
			data.split(';').each(function(item) {
				var pieces = item.split(':');

				if (pieces.length) {
					options[pieces[0]] = Titon.convertType(pieces[1]);
				}
			});
		}

		return options;
	},

	/**
	 * Apply custom options.
	 *
	 * @param {Object} options
	 */
	setup: function(options) {
		Titon.options = Object.merge(Titon.options, options);
	}

};

/**
 * Prototype overrides.
 */
Element.implement({

	/**
	 * Returns an object representation of the data-options attribute located on the element.
	 *
	 * @param {String} scope
	 * @return {Object}
	 */
	getOptions: function(scope) {
		return Titon.parseOptions(this.get('data-' + scope + '-options'));
	},

	/**
	 * Fade in an element and set its display type.
	 *
	 * @param {int} duration
	 * @return {Element}
	 */
	fadeIn: function(duration) {
		duration = duration || 600;

		return this.setStyles({
			display: '',
			opacity: 0
		}).set('tween', {
			duration: duration,
			link: 'cancel'
		}).fade('in');
	},

	/**
	 * Fade out an element and remove from DOM.
	 *
	 * @param {int} duration
	 * @param {Function|string} callback
	 * @return {Element}
	 */
	fadeOut: function(duration, callback) {
		duration = duration || 600;
		callback = callback || 'hide';

		if (typeOf(callback) === 'string') {
			callback = function() {
				if (callback === 'remove') {
					this.dispose();
				} else {
					this.hide();
				}
			}.bind(this);
		}

		this.set('tween', {
			duration: duration,
			link: 'cancel'
		}).fade('out');

		if (callback) {
			this.get('tween').chain(callback);
		}

		return this;
	},

	/**
	 * Set the content of the element.
	 *
	 * @param {String|Element} html
	 * @return {Element}
	 */
	setHtml: function(html) {
		if (typeOf(html) === 'element') {
			this.empty().grab(html);

		} else if (typeOf(html) === 'string' && html.substr(0, 1) === '#') {
			this.set('html', document.getElement(html).get('html'));

		} else {
			this.set('html', html);
		}

		return this;
	}

});

String.implement({

	/**
	 * Remove specific characters from a string.
	 *
	 * @param {String|Array} chars
	 * @return {String}
	 */
	remove: function(chars) {
		if (typeOf(chars) !== 'array') {
			chars = chars.toString().split('');
		}

		return this.replace(new RegExp('[' + chars.join('|') + ']+', 'ig'), '');
	}

});

Array.implement({

	/**
	 * Split an array into multiple chunked arrays.
	 *
	 * @param {int} size
	 * @return {Array}
	 */
	chunk: function(size) {
		var array = this;

		return [].concat.apply([], array.map(function(elem, i) {
			return (i % size) ? [] : [ array.slice(i, i + size) ];
		}));
	}

});