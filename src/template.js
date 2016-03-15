/*global Class, gocept, Handlebars, ko, alert, jQuery */
/*jslint nomen: true, unparam: true, bitwise: true*/

/**
 * @module gocept.jsform.Template
 */

(function ($) {
    "use strict";

    gocept.jsform.template_descriptions = {
        form: 'The base `gocept.jsform.Form` template',
        form_field_wrapper: 'Wrapper template for each widget. Should contain block for rendering error messages for the widget.',
        form_boolean: 'Template for widgets rendering boolean input fields.',
        form_multiselect: 'Template for widgets rendering multiselect fields',
        form_number: 'Template for widgets rendering number input fields',
        form_object: 'Template for widgets rendering select fields',
        form_radio_list: 'Template for widgets rendering radio list fields',
        form_string: 'Template for widgets rendering text input fields',
        form_text: 'Template for widgets rendering textarea fields.',
        group: 'Template for `gocept.jsform.GroupWidget`.',
        group_item: 'Template for an item in a `gocept.jsform.GroupWidget`.',
        list: 'Template for `gocept.jsform.ListWidget`.',
        list_item_wrapper: 'Wrapper template for each item in a `gocept.jsform.ListWidget`.',
        list_item: 'Template for the content of an item in a `gocept.jsform.ListWidget`.',
        list_item_action: 'Template for an item action in a `gocept.jsform.ListWidget`.',
        list_item_edit: 'Template for edit form (modal dialog) of an item in `gocept.jsform.ListWidget`.',
        table: 'Template for `gocept.jsform.TableWidget`.',
        table_head: 'Template for head part of a `gocept.jsform.TableWidget`.',
        table_row: 'Template for a row of a `gocept.jsform.TableWidget`.'
    };

    /**
     * Allows you to register your templates or change the default templates.
     *
     * @function
     * @memberOf gocept.jsform.Template
     * @param {string} id The id of the template.
     * @param {string|function} template The template. Will be saved as a compiled Handlebars template. Can be a precompiled Handlebars template, the template as raw HTML or the id of a DOM node containing the HTML of the template.
     * @param {string} description A description for the template.
     * @throws {Exception} If no template could be handled for argument template.
     * @returns {void}
     *
     * @example
     * gocept.jsform.register_template('my_template', '<dl><dt>{{name}}</dt><dd>{{value}}</dd></dl>');
     * var form = new gocept.jsform.Form('form');
     * form.load({title: 'Sebastian'}, {title: {template: 'my_template'}});
     *
     * @example
     * $('body').append(
     *     '<script type="text/html" id="reference"><b>{{value}}</b></script>'
     * );
     * gocept.jsform.register_template('my_template', '#reference');
     * var form = new gocept.jsform.Form('form');
     * form.load({title: 'Sebastian'}, {title: {template: 'my_template'}});
     *
     * @example
     * var compiled = Handlebars.compile('<p>{{value}}</p>');
     * gocept.jsform.register_template('my_template', compiled);
     * var form = new gocept.jsform.Form('form');
     * form.load({title: 'Sebastian'}, {title: {template: 'my_template'}});
     */
    gocept.jsform.register_template = function (id, template, description) {
        var html;
        if (typeof template !== "function") {
            if (template.indexOf('>') !== -1) {
                html = template;
            } else if (template.indexOf('#') === 0) {
                html = $(template).html();
            } else if ($('#' + template).length === 1) {
                html = $('#' + template).html();
            } else {
                throw (
                    "Can not register template with id '" + id + "'. " +
                    "Don't know how to handle content '" + template + "'."
                );
            }
            template = Handlebars.compile(html);
        }
        if (description) {
            gocept.jsform.template_descriptions[id] = description;
        }
        gocept.jsform.templates[id] = template;
    };

   /**
     * Helper class for handling templates within `gocept.jsform`.
     *
     * @class
     * @memberOf gocept.jsform.Template
     * @name TemplateHandler
     * @borrows gocept.jsform.register_template as register_template
     *
     * @example
     * var handler = new gocept.jsform.TemplateHandler();
     */
    gocept.jsform.TemplateHandler = Class.$extend({

        /**
         * Get the template for the given `id`.
         * @method
         * @memberOf gocept.jsform.Template.TemplateHandler
         * @param {string} id The id of the template.
         * @throws {Exception} If no template was found for `id`.
         * @returns {function} The template as precompiled Handlebars template.
         *
         * @example
         * handler.get_template('form_boolean')({name: 'asdf'})
         * '<input type="checkbox" name="asdf" data-bind="checked: asdf" />'
         *
         */
        get_template: function (id) {
            if (!gocept.jsform.templates[id]) {
                throw (
                    "No template found for '" + id + "'. Did you call " +
                    "`form.register_template()`?"
                );
            }
            return gocept.jsform.templates[id];
        },


        register_template: gocept.jsform.register_template,

        /**
         * List all registered templates.
         * @method
         * @memberOf gocept.jsform.Template.TemplateHandler
         * @returns {Array} A list of objects containing the id, description and compiled template.
         *
         * @example
         * handler.list_template()[0]
         * {id: 'form', description: 'The base `gocept.jsform.Form` template', template: function}
         *
         */
        list_templates: function () {
            var result = [];
            $.each(gocept.jsform.templates, function (id, template) {
                var desc = gocept.jsform.template_descriptions[id] || '';
                result.push({
                    'id': id,
                    'description': desc,
                    'template': template
                });
            });
            return result;
        }
    });
}(jQuery));
