/*global describe, document, $, ajja, jasmine, beforeEach, it, expect */
/*global waits, runs, waitsFor, afterEach, spyOn, Handlebars */
/*jslint nomen: true, unparam: true, bitwise: true*/

describe("Template handler", function () {
    "use strict";
    var handler, default_templates = $.extend({}, ajja.templates);

    beforeEach(function () {
        handler = new ajja.TemplateHandler();
    });

    afterEach(function () {
        $.extend(ajja.templates, default_templates);
    });

    describe("has a function called `list_templates`, which", function () {

        it("lists registered templates with description.", function () {
            expect(handler.list_templates()).toContain({
                id: 'form',
                description: 'The base `ajja.Form` template',
                template: ajja.templates.form
            });
        });
    });

    describe("has a function called `get_template`, which", function () {

        it("returns the compiled template for a given identifier.", function () {
            expect(handler.get_template('form')).toEqual(
                ajja.templates.form
            );
        });

        it(
            "throws an error if no template if found for a given identifier.",
            function () {
                expect(function () { handler.get_template('asdf'); }).toThrow(
                    "No template found for 'asdf'. Did you call `form.register_template()`?"
                );
            }
        );
    });

    describe("has a function called `register_template`, which", function () {

        it("registers new templates with description.", function () {
            handler.register_template('my_template', '<p></p>', 'Dummy template');
            expect(handler.list_templates()).toContain({
                id: 'my_template',
                description: 'Dummy template',
                template: ajja.templates.my_template
            });
        });

        it("takes a precompiled template.", function () {
            var template = Handlebars.compile('<p>{{a}}</p>');
            handler.register_template('compiled', template);
            expect(handler.get_template('compiled')).toEqual(template);
            expect(handler.get_template('compiled')(
                {a: 'foo'}
            )).toEqual('<p>foo</p>');
        });

        it("takes a html string and compiles it.", function () {
            var template = '<p>{{a}}</p>';
            handler.register_template('html', template);
            expect(typeof handler.get_template('html')).toEqual('function');
            expect(handler.get_template('html')(
                {a: 'foo'}
            )).toEqual('<p>foo</p>');
        });

        describe("can retrieve template from id selector", function () {

            beforeEach(function () {
                $('body').append($(
                    '<script type="text/html" id="template"><p>{{a}}</p></script>'
                ));
            });

            afterEach(function () {
                expect(typeof handler.get_template('selector')).toEqual('function');
                expect(handler.get_template('selector')(
                    {a: 'foo'}
                )).toEqual('<p>foo</p>');
                $('#template').remove();
            });

            it("directly.", function () {
                handler.register_template('selector', '#template');
            });

            it("while guessing that you meant an id selector.", function () {
                handler.register_template('selector', 'template');
            });

        });

        it("throws an error if it does not know how to handle template.", function () {
            expect(
                function () { handler.register_template('html', 'template'); }
            ).toThrow(
                "Can not register template with id 'html'. Don't know how to handle content 'template'."
            );
        });
    });

});
