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

            if ($(node_selector).length === 0) {
                throw "Selector " + node_selector + " did not match any node!";
            }

            self.options = options = options || {};

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
            // Subclasses of ListWidget return non-empty content for container
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
            var self = this;
            $.ajax({
                url: self.collection_url,
                type: 'PUT',
                dataType: 'json'
            }).done(function (item) {
                if (item.resource === undefined || item.data === undefined) {
                    throw "Response must contain resource URL and data.";
                }
                var node = self.render_item(item);
                self.edit_item(node);
            });
            // XXX Error handling!
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

    gocept.jsform.GroupListWidget = gocept.jsform.ListWidget.$extend({
        /* Group items of a list by class written in data attributes.
         *
         * Each list item must provide
         *   * data-{{self.group_by_key}}
         *   * data-{{self.group_title_key}}
         */

        base_template: 'gocept_jsform_group',

        __init__: function (node_selector, options) {
            var self = this;
            self.$super(node_selector, options);
            if (self.options.group_by_key === undefined) {
                throw "Required option group_by_key was not given!";
            }
            if (self.options.group_title_key === undefined) {
                throw "Required option group_title_key was not given!";
            }
        },

        get_container: function (item) {
            /* Look up grouping container for this item or create if missing */
            var self = this,
                group_container = self.$super(item),
                group_class = 'group_' + item.data[self.options.group_by_key],
                group_title = item.data[self.options.group_title_key],
                template = gocept.jsform.get_template(
                    'gocept_jsform_group_item'
                );
            if (!group_container.find('.' + group_class).length) {
                group_container.append(
                    template({
                        group_class: group_class,
                        group_title: group_title
                    })
                );
            }
            return group_container.find(
                '.' + group_class + ' ul.list-container'
            );
        }
    });

    gocept.jsform.TableWidget = gocept.jsform.ListWidget.$extend({

        base_template: 'gocept_jsform_table',

        __init__: function (node_selector, options) {
            var self = this;
            self.$super(node_selector, options);
            self.omit = self.options.omit || [];
        },

        get_container_head: function (items) {
            var self = this,
                columns = {};
            if (!items.length) {
                return;
            }
            $.each(items[0].data, function (key, value) {
                // Gather columns (that are not omitted) for table head
                if (self.omit.indexOf(key) === -1) {
                    columns[key] = self.jsform_options[key].label || key;
                }
            });
            return gocept.jsform.get_template('gocept_jsform_table_head')(columns);
        },

        render_item: function (item) {
            var self = this,
                template = gocept.jsform.get_template('gocept_jsform_table_row'),
                cell_data = {},
                node = null;
            $.each(item.data, function (key, value) {
                if (self.omit.indexOf(key) === -1) {
                    cell_data[key] = value;
                }
            });
            node = $(template({actions: self.item_actions,
                               data: cell_data}));
            self.translate_boolean_cells(node);
            self.get_container(item).append(node);
            node.data('resource', item.resource);
            node.data('data', item.data);
            self.apply_item_actions(node);
            return node;
        },

        translate_boolean_cells: function (node) {
            // Translate the contents of boolean cells to icons
            $.each(node.find('td'), function (idx, td) {
                $(td).filter(function () {
                    return this.innerHTML === 'true';
                }).html('<span class="glyphicon glyphicon-ok"></span>');
                $(td).filter(function () {
                    return this.innerHTML === 'false';
                }).html('<span class="glyphicon glyphicon-remove"></span>');
            });
        }

    });
}(jQuery));
