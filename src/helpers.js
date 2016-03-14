/*global jQuery, gocept, window */
/*jslint nomen: true, unparam: true, bitwise: true*/

/**
 * @module gocept.jsform.Helpers
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

    declare_namespace('gocept.jsform');
    gocept.jsform.locales = {};

    /**
     * Helper to declare namespaces (e.g. `gocept.jsform`).
     *
     * @function
     * @memberOf gocept.jsform.Helpers
     * @param {string} value The namespace to be declared.
     *
     * @example
     * gocept.jsform.declare_namespace('gocept.jsform');
     * gocept.jsform.foo = 'bar';
     *
     */
    gocept.jsform.declare_namespace = declare_namespace;


    /**
     * Check whether value is undefined or null.
     *
     * @function
     * @memberOf gocept.jsform.Helpers
     * @param {*} value A value.
     * @returns {boolean}
     *
     * @example
     * gocept.jsform.isUndefinedOrNull('foo');
     *
     */
    gocept.jsform.isUndefinedOrNull = isUndefinedOrNull;

    /**
     * Simple OR function. Returns ``value1`` if its defined else ``value2``.
     *
     * @function
     * @memberOf gocept.jsform.Helpers
     * @param {*} value1 A value.
     * @param {*} value2 A value.
     * @returns {*} value1 or value2
     *
     * @example
     * gocept.jsform.or(null, 'asdf');
     *
     */
    gocept.jsform.or = function (value1, value2) {
        if (!isUndefinedOrNull(value1)) {
            return value1;
        }
        return value2;
    };

}(jQuery));

