/*global jQuery, ajja, window */
/*jslint nomen: true, unparam: true, bitwise: true*/

/**
 * @module ajja.Helpers
 */

(function ($) {
    "use strict";
    var isUndefinedOrNull, declare_namespace;
    isUndefinedOrNull = function (o) {
        return o  === undefined || o === null;
    };

    declare_namespace = function (namespace) {
        var obj = window;
        $.each(namespace.split('.'), function (i, name) {
            if (isUndefinedOrNull(obj[name])) {
                obj[name] = {};
            }
            obj = obj[name];
        });
    };

    declare_namespace('ajja');
    ajja.locales = {};

    /**
     * Helper to declare namespaces (e.g. `ajja`).
     *
     * @function
     * @memberOf ajja.Helpers
     * @param {string} value The namespace to be declared.
     *
     * @example
     * ajja.declare_namespace('ajja');
     * ajja.foo = 'bar';
     *
     */
    ajja.declare_namespace = declare_namespace;


    /**
     * Check whether value is undefined or null.
     *
     * @function
     * @memberOf ajja.Helpers
     * @param {*} value A value.
     * @returns {boolean}
     *
     * @example
     * ajja.isUndefinedOrNull('foo');
     *
     */
    ajja.isUndefinedOrNull = isUndefinedOrNull;

    /**
     * Simple OR function. Returns ``value1`` if its defined else ``value2``.
     *
     * @function
     * @memberOf ajja.Helpers
     * @param {*} value1 A value.
     * @param {*} value2 A value.
     * @returns {*} value1 or value2
     *
     * @example
     * ajja.or(null, 'asdf');
     *
     */
    ajja.or = function (value1, value2) {
        if (!isUndefinedOrNull(value1)) {
            return value1;
        }
        return value2;
    };

}(jQuery));

