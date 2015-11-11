/*global jQuery, gocept, Class, confirm */
/*jslint nomen: true, unparam: true, bitwise: true*/
(function ($) {
    "use strict";

    gocept.jsform.ListWidget = Class.$extend({

        base_template: 'gocept_jsform_list',
        default_item_actions: [
            {
                css_class: 'edit',
                icon: 'glyphicon-edit',
                title: 'Bearbeiten',
                callback: function (node, widget) { widget.edit_item(node); }
            },
            {
                css_class: 'del',
                icon: 'glyphicon-trash',
                title: 'Löschen',
                callback: function (node, widget) {
                    if (confirm('Wirklich löschen?') === true) {
                        widget.del_item(node);
                    }
                }
            },
        ],
        default_form_actions: [
            {
                css_class: 'add',
                icon: 'glyphicon-plus',
                title: 'Hinzufügen',
                callback: function (widget) { widget.add_item(); }
            }
        ],

        __init__: function (node_selector, options) {
            /* Turn any DOM elements matched by node_selector into ListWidgets.
             *
             * Options:
             *
             * item_actions: additional item_actions besides edit and del
             * form_actions: additional form_actions besides add
             * default_form_actions: set to an empty list to hide add
             */
            var self = this,
                node = $(node_selector),
                template = gocept.jsform.get_template(self.base_template);
            self.node_selector = node_selector;
            self.node = node;

            options = options || {};

            self.item_actions = self.default_item_actions.concat(
                options.item_actions || []
            );
            self.item_action_callbacks = {};
            $.each(self.item_actions, function (key, item) {
                self.item_action_callbacks[item.css_class] = item.callback;
            });

            self.form_actions =
                (options.default_form_actions || self.default_form_actions)
                .concat(options.form_actions || []);

            node.append(template({}));
            self.list_container = node.find('#container');
            self.collection_url = node.data('collection-url');
            self.template = gocept.jsform.or(
                node.data('template'),
                'gocept_jsform_list_item'
            );
            self.jsform_template = node.data('form-template');
            self.jsform_options = gocept.jsform.or(
                node.data('form-options'),
                {}
            );
            self.render_form_actions();
        },

        load: function () {
            var self = this;
            $('#container').empty();
            $.ajax({
                url: self.collection_url,
                type: 'GET',
                dataType: 'json'
            }).done(function (items) {
                $('#container').html(self.get_container_head(items));
                $.each(items, function (index, item) {
                    self.render_item(item);
                });
                $(self).trigger('after-load');
            });
            return self;
        },

        get_container_head: function (items) {
            return '';
        },

        render_form_actions: function () {
            var self = this,
                template = gocept.jsform.get_template(
                    'gocept_jsform_list_item_action'
                ),
                form_actions = self.node.find('#form-actions');
            $.each(self.form_actions, function (id, action) {
                form_actions.append(template(action));
                form_actions.find('a.' + action.css_class).on(
                    'click',
                    function (ev) {
                        ev.preventDefault();
                        action.callback(self);
                    }
                );
            });
        },

        apply_item_actions: function (node) {
            var self = this;
            node.find('.actions a').on('click', function (ev) {
                ev.preventDefault();
                self.item_action_callbacks[$(ev.target).data('action')](
                    node,
                    self
                );
            });
        },

        render_item: function (item) {
            var self = this,
                template = gocept.jsform.get_template(
                    'gocept_jsform_list_item_wrapper'
                ),
                node = self.get_container(item).append(
                    template({actions: self.item_actions, id: item.data.id})
                ).children().last();
            node.data('resource', item.resource);
            node.data('data', item.data);
            self.render_item_content(node);
            self.apply_item_actions(node);
            return node;
        },

        get_container: function (item) {
            var self = this;
            // item is used in subclasses of ListWidget
            return self.list_container;
        },

        render_item_content: function (node) {
            var self = this,
                template,
                content,
                data = {};
            if (!self.template) {
                return;
            }
            template = gocept.jsform.get_template(self.template);
            content = node.find('.content');
            content.html('');
            // XXX This template should be rendered once, employing knockout and
            // reusing the model of a persistent form associated with this node.
            $.each(node.data('data'), function (name, value) {
                if (value) {
                    data[name] = value;
                } else {
                    data[name] = '';
                }
            });
            content.append(template(data));
        },

        add_item: function () {
            // XXX Error handling!
            var self = this;
            $.ajax({
                url: self.collection_url,
                type: 'PUT',
                dataType: 'json'
            }).done(function (item) {
                var node = self.render_item(item);
                self.edit_item(node);
            });
        },

        edit_item: function (node) {
            var self = this,
                template = gocept.jsform.get_template(
                    'gocept_jsform_list_item_edit'
                ),
                form_dialog,
                data = {},
                object_form;

            $('body').append(template({
                title: self.node.data('modal-title'),
                save_button_title: self.node.data('modal-save-button-title') ||
                                   'Speichern und Schließen'
            }));
            form_dialog = $('body').children().last();
            object_form = new gocept.jsform.Form('object-jsform', {
                save_url: node.data('resource'),
                form_template: self.jsform_template,
                language: 'de'
            });
            self.closing = false;
            form_dialog.bind('hide.bs.modal', function (ev) {
                self.close_object_edit_form(ev, object_form, form_dialog);
            });
            form_dialog.bind('hidden.bs.modal', function () {
                self.load();
                form_dialog.remove();
            });
            $.each(node.data('data'), function (key, value) {
                // Only display data in form where a label exists.
                if (self.jsform_options[key]) {
                    data[key] = value;
                }
            });
            object_form.load(data, self.jsform_options);
            $(self).trigger('before-edit', [object_form.node, node]);
            form_dialog.bind('shown.bs.modal', function () {
                $(self.node).trigger('item-edit-form-loaded');
            });
            form_dialog.modal('show');
        },

        close_object_edit_form: function (ev, object_form, form_dialog) {
            var self = this;
            if (self.closing) {
                // Guard against recursion since the modal API exposes only one
                // method to hide the dialog after the form has been saved, which
                // in turn causes this hide.bs.modal handler to be fired again.
                return;
            }
            self.closing = true;
            ev.preventDefault();
            object_form.when_saved().done(function () {
                form_dialog.modal('hide');
            });
        },

        del_item: function (node) {
            // XXX Error handling!
            $.ajax({
                url: node.data('resource'),
                type: 'DELETE'
            }).done(function () {
                node.remove();
            });
        }
    });
}(jQuery));
