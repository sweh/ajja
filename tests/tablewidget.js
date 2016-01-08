/*global describe, beforeEach, gocept, it, spyOn, expect, $, afterEach*/
/*jslint nomen: true, unparam: true, bitwise: true*/
describe("Table Widget", function () {
    "use strict";

    describe("Render", function () {
        var table;

        beforeEach(function () {
            table = new gocept.jsform.TableWidget('#my_form');
        });

        it("displays added item as table", function () {
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
            // XXX Don't actually run edit_item as it reloads the table.
            var edit = spyOn(table, 'edit_item').andCallFake(
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
            this.container = $('<tr><td></td></tr>');
        });

        afterEach(function () {
            this.container.remove();
        });

        it("from true into ok icon.", function () {
            this.container.find('td').text('true');
            var tablewidget = new gocept.jsform.TableWidget('#my_form');
            tablewidget.translate_boolean_cells(this.container);
            expect(this.container.find('td').html()).toBe(
                '<span class="glyphicon glyphicon-ok"></span>'
            );
        });

        it("from false into remove icon.", function () {
            this.container.find('td').text('false');
            var tablewidget = new gocept.jsform.TableWidget('#my_form');
            tablewidget.translate_boolean_cells(this.container);
            expect(this.container.find('td').html()).toBe(
                '<span class="glyphicon glyphicon-remove"></span>'
            );
        });
    });

});
