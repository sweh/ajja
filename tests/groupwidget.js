/*global describe, beforeEach, afterEach, ajja, it, spyOn, expect, $*/
/*jslint nomen: true, unparam: true, bitwise: true*/
describe("Group List Widget", function () {
    "use strict";

    var list;

    beforeEach(function () {
        $('body').append($('<div id="my_form"></div>'));
        list = new ajja.GroupListWidget(
            '#my_form',
            {group_by_key: 'foo', group_title_key: 'foo'}
        );
    });

    afterEach(function () {
        //$('#my_form').remove();
    });

    it("displays added item inside group", function () {
        spyOn($, 'ajax').and.callFake(function (options) {
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
        var edit = spyOn(list, 'edit_item').and.callFake(
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
            new ajja.GroupListWidget('#my_form');
        }).toThrow("Required option group_by_key was not given!");
        expect(function () {
            new ajja.GroupListWidget(
                '#my_form',
                {group_by_key: 'foo'}
            );
        }).toThrow("Required option group_title_key was not given!");
    });
});
