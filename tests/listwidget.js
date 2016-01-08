/*global describe, beforeEach, gocept, it, spyOn, expect, $*/
/*jslint nomen: true, unparam: true, bitwise: true*/
describe("List Widget", function () {
    "use strict";

    var list;

    beforeEach(function () {
        list = new gocept.jsform.ListWidget('#my_form');
    });

    it("displays added item", function () {
        spyOn($, 'ajax').andCallFake(function (options) {
            var result, response;
            result = $.Deferred();
            response = {
                resource: '',
                data: {foo: 'bar'}
            };
            result.resolve(response);
            return result.promise();
        });
        // XXX Don't actually run edit_item as it reloads the list.
        var edit = spyOn(list, 'edit_item').andCallFake(
            function () { return; }
        );

        $('#my_form .add').click();
        expect(edit).toHaveBeenCalled();
        expect($('#my_form ul li').length).toEqual(1);
        expect($('#my_form ul li dt').text()).toEqual('foo');
        expect($('#my_form ul li dd').text()).toEqual('bar');
    });

    it("should throw an error when selector was not found", function () {
        expect(function () {new gocept.jsform.ListWidget('#foobar',  {})}).toThrow();
    });

    it("should throw an error when malformed response is returned on add", function () {
        spyOn($, 'ajax').andCallFake(function (options) {
            var result, response;
            result = $.Deferred();
            response = {
                foo: 'bar'
            };
            result.resolve(response);
            return result.promise();
        });
        expect(list.add_item).toThrow(
            "Response must contain resource URL and data."
        );
    });

});
