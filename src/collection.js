/*global jQuery, gocept, confirm */
/*jslint nomen: true, unparam: true, bitwise: true*/

/**
 * @module gocept.jsform.Collection
 */

/**
 * @typedef {Object} WidgetOptions
 * @memberOf gocept.jsform.Collection
 * @property {string} collection_url The url to a JSON View returning the data for the collection.
 * @property {Array} item_actions Additional item_actions besides `edit` and `del`.
 * @property {Array} default_item_actions Set to an empty Array to hide `edit` and `del`.
 * @property {Array} form_actions Additional form_actions besides `add`.
 * @property {Array} default_form_actions Aet to an empty list to hide `add`.
 */
(function ($) {
    "use strict";

    /**
     * Turn any DOM elements matched by node_selector into ListWidgets.
     * @class
     * @extends gocept.jsform.TemplateHandler
     * @memberOf gocept.jsform.Collection
     * @name ListWidget
     * @param {string} node_selector The selector of the DOM node where the widget should be rendered.
     * @param {WidgetOptions} [options] An object containing options for the widget.
     * @returns {Object} The widget instance.
     * @throws {Exception} if the node_selector does not match any DOM node.
     *
     * @example
     * $(body).append('<div id="my_list_widget"></div>');
     * var list_widget = new gocept.jsform.ListWidget(
     *     '#my_list_widget',
     *     {collection_url: '/list.json'}
     * );
     */
    gocept.jsform.ListWidget = gocept.jsform.TemplateHandler.$extend({

        base_template: 'list',

        /* The default item actions. */
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

        /* The default form actions. */
        default_form_actions: [
            {
                css_class: 'add',
                icon: 'glyphicon-plus',
                title: 'Hinzufügen',
                callback: function (widget) { widget.add_item(); }
            }
        ],

        /**
         * Initialize the list widget. Called upon widget initialization.
         * @method
         * @param {string} node_selector The selector of the DOM node where the widget should be rendered.
         * @param {WidgetOptions} [options] An object containing options for the widget.
         * @returns {Object} The widget instance.
         * @throws {Exception} if the node_selector does not match any DOM node.
         * @memberOf gocept.jsform.Collection.ListWidget
         */
        __init__: function (node_selector, options) {
            /* Initialize the widget. For more information see class docs. */
            var self = this,
                node = $(node_selector),
                template = self.get_template(self.base_template);
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
            self.list_collection = node.find('#collection');
            self.collection_url = gocept.jsform.or(
                options.collection_url,
                node.data('collection-url')
            );

            self.template = gocept.jsform.or(
                node.data('template'),
                'list_item'
            );
            self.jsform_template = node.data('form-template');
            self.jsform_options = gocept.jsform.or(
                node.data('form-options'),
                {}
            );
            self.render_form_actions();
        },

        /**
         * Reload the widget. Retrieve data from the server and render items in DOM.
         * @method
         * @returns {Object} The widget instance.
         * @memberOf gocept.jsform.Collection.ListWidget
         */
        reload: function () {
            /*"""
                .. js:function:: reload()

                    Reload the widget.
             */
            var self = this;
            $('#collection').empty();
            $.ajax({
                url: self.collection_url,
                type: 'GET',
                dataType: 'json'
            }).done(function (items) {
                $('#collection').html(self.get_collection_head(items));
                $.each(items, function (index, item) {
                    self.render_item(item);
                });
                $(self).trigger('after-load');
            });
            return self;
        },

        /**
         * Return the rendered HTML of the widgets header.
         * @method
         * @returns {string} HTML ready to be included into the DOM.
         * @memberOf gocept.jsform.Collection.ListWidget
         */
        get_collection_head: function (items) {
            // Subclasses of ListWidget return non-empty content for collection
            return '';
        },

        /**
         * Render the form actions and bind a click handler to them.
         * @method
         * @memberOf gocept.jsform.Collection.ListWidget
         */
        render_form_actions: function () {
            var self = this,
                template = self.get_template('list_item_action'),
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

        /**
         * Bind a click handler to each action of the given item.
         *
         * .. note ::
         *     The callback, that was specified in `item_actions`, is binded here.
         *
         * @method
         * @param {Object} node The jQuery DOM node of the item with the actions.
         * @memberOf gocept.jsform.Collection.ListWidget
         */
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

        /**
         * Render an item into the DOM.
         *
         * @method
         * @param {Object} item An item as returned by the collection JSON view.
         * @memberOf gocept.jsform.Collection.ListWidget
         * @returns {Object} jQuery DOM node to the rendered item.
         */
        render_item: function (item) {
            var self = this,
                template = self.get_template('list_item_wrapper'),
                node = self.get_collection(item).append(
                    template({actions: self.item_actions, id: item.data.id})
                ).children().last();
            node.data('resource', item.resource);
            node.data('data', item.data);
            self.render_item_content(node);
            self.apply_item_actions(node);
            return node;
        },

        /**
         * Return the container DOM node of item.
         *
         * @method
         * @param {Object} item An item as returned by the collection JSON view.
         * @memberOf gocept.jsform.Collection.ListWidget
         * @returns {Object} jQuery DOM node to items container.
         */
        get_collection: function (item) {
            var self = this;
            // item is used in subclasses of ListWidget
            return self.list_collection;
        },

        render_item_content: function (node) {
            var self = this,
                template,
                content,
                data = {};
            if (!self.template) {
                return;
            }
            template = self.get_template(self.template);
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
                template = self.get_template('list_item_edit'),
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
                self.reload();
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

        base_template: 'group',

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

        get_collection: function (item) {
            /* Look up grouping collection for this item or create if missing */
            var self = this,
                group_collection = self.$super(item),
                group_class = 'group_' + item.data[self.options.group_by_key],
                group_title = item.data[self.options.group_title_key],
                template = self.get_template('group_item');
            if (!group_collection.find('.' + group_class).length) {
                group_collection.append(
                    template({
                        group_class: group_class,
                        group_title: group_title
                    })
                );
            }
            return group_collection.find(
                '.' + group_class + ' ul.list-collection'
            );
        }
    });

    gocept.jsform.TableWidget = gocept.jsform.ListWidget.$extend({

        base_template: 'table',

        __init__: function (node_selector, options) {
            var self = this;
            self.$super(node_selector, options);
            self.omit = self.options.omit || [];
        },

        get_collection_head: function (items) {
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
            return self.get_template('table_head')(columns);
        },

        render_item: function (item) {
            var self = this,
                template = self.get_template('table_row'),
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
            self.get_collection(item).append(node);
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
