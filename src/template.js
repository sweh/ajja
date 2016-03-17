/*global Class, ajja, Handlebars, ko, alert, jQuery */
/*jslint nomen: true, unparam: true, bitwise: true*/

/**
 * @module ajja.Template
 */

(function ($) {
    "use strict";

    ajja.template_descriptions = {
        form: 'The base `ajja.Form` template',
        form_field_wrapper: 'Wrapper template for each widget. Should contain block for rendering error messages for the widget.',
        form_boolean: 'Template for widgets rendering boolean input fields.',
        form_multiselect: 'Template for widgets rendering multiselect fields',
        form_number: 'Template for widgets rendering number input fields',
        form_object: 'Template for widgets rendering select fields',
        form_radio_list: 'Template for widgets rendering radio list fields',
        form_string: 'Template for widgets rendering text input fields',
        form_text: 'Template for widgets rendering textarea fields.',
        group: 'Template for `ajja.GroupWidget`.',
        group_item: 'Template for an item in a `ajja.GroupWidget`.',
        list: 'Template for `ajja.ListWidget`.',
        list_item_wrapper: 'Wrapper template for each item in a `ajja.ListWidget`.',
        list_item: 'Template for the content of an item in a `ajja.ListWidget`.',
        list_item_action: 'Template for an item action in a `ajja.ListWidget`.',
        list_item_edit: 'Template for edit form (modal dialog) of an item in `ajja.ListWidget`.',
        table: 'Template for `ajja.TableWidget`.',
        table_head: 'Template for head part of a `ajja.TableWidget`.',
        table_row: 'Template for a row of a `ajja.TableWidget`.'
    };

    /**
     * Allows you to register your templates or change the default templates.
     *
     * @function
     * @memberOf ajja.Template
     * @param {string} id The id of the template.
     * @param {string|function} template The template. Will be saved as a compiled Handlebars template. Can be a precompiled Handlebars template, the template as raw HTML or the id of a DOM node containing the HTML of the template.
     * @param {string} description A description for the template.
     * @throws {Exception} If no template could be handled for argument template.
     * @returns {void}
     *
     * @example
     * ajja.register_template('my_template', '<dl><dt>{{name}}</dt><dd>{{value}}</dd></dl>');
     * var form = new ajja.Form('form');
     * form.load({title: 'Sebastian'}, {title: {template: 'my_template'}});
     *
     * @example
     * $('body').append(
     *     '<script type="text/html" id="reference"><b>{{value}}</b></script>'
     * );
     * ajja.register_template('my_template', '#reference');
     * var form = new ajja.Form('form');
     * form.load({title: 'Sebastian'}, {title: {template: 'my_template'}});
     *
     * @example
     * var compiled = Handlebars.compile('<p>{{value}}</p>');
     * ajja.register_template('my_template', compiled);
     * var form = new ajja.Form('form');
     * form.load({title: 'Sebastian'}, {title: {template: 'my_template'}});
     */
    ajja.register_template = function (id, template, description) {
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
            ajja.template_descriptions[id] = description;
        }
        ajja.templates[id] = template;
    };

   /**
     * Helper class for handling templates within `ajja`.
     *
     * @class
     * @memberOf ajja.Template
     * @name TemplateHandler
     * @borrows ajja.register_template as register_template
     *
     * @example
     * var handler = new ajja.TemplateHandler();
     */
    ajja.TemplateHandler = Class.$extend({

        /**
         * Get the template for the given `id`.
         * @method
         * @memberOf ajja.Template.TemplateHandler
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
            if (!ajja.templates[id]) {
                throw (
                    "No template found for '" + id + "'. Did you call " +
                    "`form.register_template()`?"
                );
            }
            return ajja.templates[id];
        },


        register_template: ajja.register_template,

        /**
         * List all registered templates.
         * @method
         * @memberOf ajja.Template.TemplateHandler
         * @returns {Array} A list of objects containing the id, description and compiled template.
         *
         * @example
         * handler.list_template()[0]
         * {id: 'form', description: 'The base `ajja.Form` template', template: function}
         *
         */
        list_templates: function () {
            var result = [];
            $.each(ajja.templates, function (id, template) {
                var desc = ajja.template_descriptions[id] || '';
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
