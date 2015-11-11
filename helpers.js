/*global jQuery, gocept, window */
/*jslint nomen: true, unparam: true, bitwise: true*/
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
    gocept.jsform.declare_namespace = declare_namespace;
    gocept.jsform.isUndefinedOrNull = isUndefinedOrNull;

    gocept.jsform.or = function (value1, value2) {
        if (!isUndefinedOrNull(value1)) {
            return value1;
        }
        return value2;
    };

}(jQuery));

