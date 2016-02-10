/*global Class, gocept, Handlebars, ko, alert, jasmine, jQuery */
/*jslint nomen: true, unparam: true, bitwise: true*/
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


    gocept.jsform.register_template = function (id, template, description) {
        /*"""
        .. js:function:: gocept.jsform.register_template(id, template[, description])

            Allows you to register your templates or change the default templates.

            :param string id: The id of the template.
            :param template: The template. Will be saved as a compiled
                Handlebars template. Can be a precompiled Handlebars template,
                the template as raw HTML or the id of a DOM node containing
                the HTML of the template.
            :type template: function or string
            :param string description: A description for the template.
        */
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

    gocept.jsform.TemplateHandler = Class.$extend({
    /*"""
    .. js:class:: gocept.jsform.TemplateHandler()

        Helper class for handling templates within `gocept.jsform`.
    */

        get_template: function (id) {
            /*"""
                .. js:function:: get_template(id)

                    Get the template for the given `id`.

                    :param string id: The id of the template.
                    :throws Exception: If no template was found for `id`.
                    :returns: The template as precompiled Handlebars template.
            */
            if (!gocept.jsform.templates[id]) {
                throw (
                    "No template found for '" + id + "'. Did you call " +
                    "`form.register_template()`?"
                );
            }
            return gocept.jsform.templates[id];
        },

        register_template: gocept.jsform.register_template,
            /*"""
                .. js:function:: register_template(id, template[, description])

                    Calls :js:func:`gocept.jsform.register_template()`.
            */

        list_templates: function () {
            /*"""
                .. js:function:: list_templates()

                    List all registered templates.

                    :returns: A list of objects containing the id, description
                        and compiled template.
            */
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
