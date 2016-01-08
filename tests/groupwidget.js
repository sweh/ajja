/*global describe, beforeEach, gocept, it, spyOn, expect, $*/
/*jslint nomen: true, unparam: true, bitwise: true*/
describe("Group List Widget", function () {
    "use strict";

    var list;

    beforeEach(function () {
        list = new gocept.jsform.GroupListWidget(
            '#my_form',
            {group_by_key: 'foo', group_title_key: 'foo'}
        );
    });

    it("displays added item inside group", function () {
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
        expect($('#my_form ul[data-group-id=group_bar]:visible').length).toBe(0);
        $('#my_form a.group-title').click();
        expect($('#my_form ul[data-group-id=group_bar]:visible').length).toBe(1);
    });

    it("throws an error if required options are missing", function () {
        expect(function () {
            new gocept.jsform.GroupListWidget('#my_form');
        }).toThrow("Required option group_by_key was not given!");
        expect(function () {
            new gocept.jsform.GroupListWidget(
                '#my_form',
                {group_by_key: 'foo'}
            );
        }).toThrow("Required option group_title_key was not given!");
    });
});
