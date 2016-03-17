/*global describe, beforeEach, ajja, it, spyOn, expect, $, afterEach*/
/*jslint nomen: true, unparam: true, bitwise: true*/
describe("Table Widget", function () {
    "use strict";

    beforeEach(function () {
        $('body').append($('<div id="my_form"></div>'));
    });

    afterEach(function () {
        $('#my_form').remove();
    });

    describe("Render", function () {
        var table;

        beforeEach(function () {
            table = new ajja.TableWidget('#my_form');
        });

        it("displays added item as table", function () {
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
            // XXX Don't actually run edit_item as it reloads the table.
            var edit = spyOn(table, 'edit_item').and.callFake(
                function () { return; }
            );

            $('#my_form .add').click();
            expect(edit).toHaveBeenCalled();
            expect($('#my_form table tr td.foo').length).toEqual(1);
            expect($('#my_form table tr td.foo').text()).toEqual('bar');
            expect($('#my_form table tr td.actions').length).toEqual(2);
        });
    });

    describe("should transform boolean values", function () {
        beforeEach(function () {
            this.collection = $('<tr><td></td></tr>');
        });

        afterEach(function () {
            this.collection.remove();
        });

        it("from true into ok icon.", function () {
            this.collection.find('td').text('true');
            var tablewidget = new ajja.TableWidget('#my_form');
            tablewidget.translate_boolean_cells(this.collection);
            expect(this.collection.find('td').html()).toBe(
                '<span class="glyphicon glyphicon-ok"></span>'
            );
        });

        it("from false into remove icon.", function () {
            this.collection.find('td').text('false');
            var tablewidget = new ajja.TableWidget('#my_form');
            tablewidget.translate_boolean_cells(this.collection);
            expect(this.collection.find('td').html()).toBe(
                '<span class="glyphicon glyphicon-remove"></span>'
            );
        });
    });

});
