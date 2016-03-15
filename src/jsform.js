/*global Class, gocept, Handlebars, ko, alert, jQuery */
/*jslint nomen: true, unparam: true, bitwise: true*/

/**
 * @module gocept.jsform.Form
 */

(function ($) {
    "use strict";

    /**
     * @class
     * @extends TemplateHandler
     * @memberOf gocept.jsform.Form
     * @name Form
     * @param {string} id The id of the DOM node where the form should be rendered.
     * @param {Object} [options] An object containing options for the form.
     * @param {string} [options.save_url] The url where data changes are propagated to. Should return a dict with either ``{"status": "success"}`` or ``{"status": "error", "msg": "Not an eMail address."}``.
     * @param {string} [options.action] The url the form will submit to (if intended). Will become the action attribute in form.
     * @param {string} [options.language] 2-char language code. Default is `en`.
     * @param {boolean} [options.disabled] Only render disabled fields in the whole form if true.
     * @returns {Object} The form instance.
     *
     * @example
     * $(body).append('<div id="form"></div>');
     * var form = new gocept.jsform.Form('form');
     */
    gocept.jsform.Form = gocept.jsform.TemplateHandler.$extend({

        status_message_fade_out_time: 3000,

        __init__: function (id, options) {
            var self = this;

            if ($('#' + id).length === 0) {
                throw "ID #" + id + " could not be found!";
            }

            self.id = id;
            self.url = null;
            self.initial_data = null;
            self.data = {};
            self.subscriptions = {};
            self.options = {action: '', language: 'en', disabled: false};
            $.extend(self.options, options);
            self.csrf_token_id = 'csrf_token';
            self.mapping = {};
            self.texts = gocept.jsform.locales[self.options.language];
            self.create_form();
            $(self).on('server-responded', self.retry);
            self.unrecoverable_error = false;
            $(self).on('unrecoverable-error', function (event, msg) {
                self.unrecoverable_error = true;
                self.unrecoverable_error_msg = msg;
                self.alert(self.t('unrecoverable_error_intro') + msg);
            });
            self.field_wrapper_template = self.get_template('form_field_wrapper');
            self.loaded = $.Deferred();
            $(self).bind('after-load', function () {
                self.loaded.resolve();
            });
            $(self).bind('after-save', function (ev, data) {
                self.update_sources(data);
            });
        },

        /**
         * Show a message to the user. (Alert box)
         * @method
         * @param {string} msg The message to display.
         * @memberOf gocept.jsform.Form.Form
         * @returns {void}
         */
        alert: function (msg) {
            alert(msg);
        },

        /**
         * Translate a message into the language selected upon form initialization.
         * @method
         * @param {string} msgid The message id from the localization dict.
         * @memberOf gocept.jsform.Form.Form
         * @returns {string} The translated message.
         */
        t: function (msgid) {
            var self = this;
            return self.texts[msgid];
        },

        /**
         * Expands the form_template into the DOM.
         * @method
         * @memberOf gocept.jsform.Form.Form
         * @returns {void}
         */
        expand_form: function () {
            var self = this, form_template, form_options, form_code;
            form_template = self.get_template('form');
            form_options = $.extend({'form_id': self.id}, self.options);
            form_code = $(
                form_template(form_options).replace(/^\s+|\s+$/g, '')
            );
            $('#' + self.id).replaceWith(form_code);
        },

        /**
         * Wires the form DOM node and object.
         * @method
         * @memberOf gocept.jsform.Form.Form
         * @returns {void}
         */
        create_form: function () {
            var self = this;
            self.expand_form();
            self.node = $('#' + self.id);
            self.node.closest('form').data('form', self);
            self.statusarea = self.node.find('.statusarea');
        },

        /**
         * Invokes data retrieval and form field initialization.
         * @method
         * @memberOf gocept.jsform.Form.Form
         * @name load
         * @param {string} data_or_url The url to a JSON View returning the data for the form or the data itself.
         * @param {Options} [options] Options for each data field.
         * @param {string} [options.<field_name>] Options for the field.
         * @param {string} [options.<field_name>.label] The label of the field.
         * @param {string} [options.<field_name>.template] The id of a custom template for this field.
         * @param {boolean} [options.<field_name>.required] Whether this is a required field or not.
         * @param {Array} [options.<field_name>.source] The source for a select field. Contains objects with 'token' and 'title'.
         * @param {boolean} [options.<field_name>.multiple] For object selection, whether to do multi-select.
         * @param {string} [options.<field_name>.placeholder] Placeholder to the empty dropdown option.
         * @param {boolean} [options.<field_name>.disabled] true if field should be disabled.
         * @param {Object} [mapping] An optional mapping for the <ko.mapping> plugin.
         * @returns {void}
         *
         * @example
         * form.load({'firstname': 'Robert', 'is_baby': true});
         * form.load('/data.json', {is_baby: {label: 'Is it a baby?'}});
         */
        load: function (data_or_url, options, mapping) {

            var self = this;
            if (typeof data_or_url === 'string') {
                self.url = data_or_url;
            } else {
                self.initial_data = data_or_url;
            }
            if (gocept.jsform.isUndefinedOrNull(options)) {
                options = {};
            }
            $.extend(self.options, options);
            self.collect_sources();
            if (!gocept.jsform.isUndefinedOrNull(mapping)) {
                self.mapping = mapping;
            }
            self.start_load();
        },

        /**
         * Collect sources from options and make them ovservable.
         * @method
         * @memberOf gocept.jsform.Form.Form
         * @returns {void}
         */
        collect_sources: function () {
            var self = this;
            self.sources = {};
            self.item_maps = {};
            $.each(self.options, function (name, value) {
                if (!self.is_object_field(name)) {
                    return;
                }
                self.sources[name] = ko.observableArray(value.source);
                var item_map = {};
                $.each(value.source, function (index, item) {
                    item_map[item.token] = item;
                });
                self.item_maps[name] = item_map;
            });
        },

        /**
         * Update sources from data. Called on form reload.
         * @method
         * @param {Object} data The data returned from the ajax server request.
         * @memberOf gocept.jsform.Form.Form
         */
        update_sources: function (data) {
            /* Update sources from data. Called on form reload. */
            var self = this;
            if (!data || !data.sources) {
                return;
            }
            $.each(data.sources, function (name, source) {
                self.sources[name].removeAll();
                $.each(source, function (id, elem) {
                    self.sources[name].push(elem);
                });
            });
        },

        /**
         * Invokes data retrieval if needed.
         *
         * @note After retrieval (which may be asynchronous), self.data is
         * initialized.
         *
         * @method
         * @memberOf gocept.jsform.Form.Form
         */
        start_load: function () {
            var self = this;
            self.loaded = $.Deferred();  // replace to represent a new load cycle
            if (self.url !== null) {
                self.reload();
            } else {
                self.finish_load(self.initial_data);
            }
        },

        /**
         * Invokes data retrieval from server and reloads the form.
         * @method
         * @memberOf gocept.jsform.Form.Form
         */
        reload: function () {
            var self = this;
            $.ajax({
                dataType: "json",
                url: self.url,
                success: function (tokenized) {
                    self.finish_load(tokenized);
                },
                error: function (e) { self.notify_server_error(e); }
            });
        },

        /**
         * After load handler. Save data retrieved from server on model.
         * @method
         * @param {Object} tokenized The data returned from the ajax server request.
         * @memberOf gocept.jsform.Form.Form
         */
        finish_load: function (tokenized) {
            var self = this,
                data = tokenized;
            if (tokenized) {
                $.each(tokenized, function (name, value) {
                    data[name] = self.resolve_object_field(name, value);
                });
            }
            self.data = data;
            self.init_fields();
            setTimeout(function () {
                $(self).trigger('after-load');
            }, 0);
        },

        /**
         * Check whether field is an object field.
         *
         * @note Object fields are either select boxes or radio lists.
         *
         * @method
         * @param {string} name The name of the field to check.
         * @memberOf gocept.jsform.Form.Form
         * @returns {boolean}
         */
        is_object_field: function (name) {
            var self = this;
            if (gocept.jsform.isUndefinedOrNull(self.options[name]) ||
                    gocept.jsform.isUndefinedOrNull(self.options[name].source)) {
                return false;
            }
            if (self.options[name].template === 'form_radio_list') {
                return false;
            }
            return true;
        },

        /**
         * Save tokens from value in object fields.
         *
         * @method
         * @param {string} name The name of the field.
         * @param {Array|string} value Tokens from object field if multiple of one token.
         * @memberOf gocept.jsform.Form.Form
         * @returns {Array|Object} Returns either an array of source objects if field is multiple or exactly one source object.
         */
        resolve_object_field: function (name, value) {
            var self = this, item_map, resolved;
            if (!self.is_object_field(name)) {
                return value;
            }
            item_map = self.item_maps[name];
            if (self.options[name].multiple) {
                resolved = [];
                $.each(value, function (index, token) {
                    resolved.push(item_map[token]);
                });
                return resolved;
            }
            return item_map[value];
        },

       /**
         * Render one form widget (e.g. an input field).
         *
         * @method
         * @param {string} id The name of the field.
         * @memberOf gocept.jsform.Form.Form
         */
        render_widget: function (id) {
            var self = this, widget, widget_options, widget_code,
                wrapper_options, template_name = self.get_widget(id);
            widget = self.get_template(template_name);
            widget_options = $.extend({
                name: id,
                value: self.data[id],
                label: ''
            }, self.options[id]);
            if (self.options.disabled) {
                widget_options.disabled = true;
            }
            if (!gocept.jsform.isUndefinedOrNull(widget_options.source) &&
                    gocept.jsform.isUndefinedOrNull(widget_options.placeholder)) {
                if (widget_options.multiple) {
                    widget_options.placeholder = self.t(
                        'object_widget_placeholder_multiple'
                    );
                } else {
                    widget_options.placeholder = self.t(
                        'object_widget_placeholder'
                    );

                }
            }
            widget_code = widget(widget_options);
            wrapper_options = $.extend({
                id: id,
                widget_code: widget_code
            }, widget_options);
            widget_code = self.field_wrapper_template(wrapper_options);
            if (!$('#field-' + id, self.node).length) {
                self.node.append(widget_code);
            } else {
                $('#field-' + id, self.node).replaceWith(widget_code);
            }
            if (self.options[id].required) {
                $('#field-' + id, self.node).addClass('required');
            }
        },

        /**
         * Initialize fields from self.data.
         *
         * @note Guess the type of data for each field and render the correct
         * field template into the DOM. Invoke the knockout databinding via
         * auto-mapping data into a model (thanks to ko.mapping plugin) and
         * invoke observing the model for changes to propagate these to the
         * server.
         * Appends fields into the form if no DOM element with id name
         * like field is found.
         *
         * @method
         * @memberOf gocept.jsform.Form.Form
         */
        init_fields: function () {
            var self = this;
            if (gocept.jsform.isUndefinedOrNull(self.data)) {
                return;
            }
            $.each(self.data, function (id, value) {
                // XXX option defaults should not be applied here but until
                // fields have a class of their own, this is a convenient place
                self.options[id] = $.extend({required: false}, self.options[id]);
                self.render_widget(id);
            });
            self.update_bindings();
        },

        /**
         * Add or update knockout bindings to the data.
         *
         * @note This is where all the magic starts. Adding bindings to our
         * model and observing model changes allows us to trigger automatic
         * updates to the server when form fields are submitted.
         *
         * @method
         * @memberOf gocept.jsform.Form.Form
         */
        update_bindings: function () {
            var self = this;
            self.create_model();
            ko.applyBindings(self.model, self.node.get(0));
            self.observe_model_changes();
        },

        /**
         * Create a knockout model from self.data.
         *
         * @note Needed for bindings and oberservation.
         *
         * @method
         * @memberOf gocept.jsform.Form.Form
         */
        create_model: function () {
            var self = this;
            self.model = ko.mapping.fromJS(self.data, self.mapping);
            self.model.__sources__ = self.sources;
            $.each(self.sources, function (name, values) {
                if (self.options[name].multiple) {
                    self.model[name] = ko.observableArray(self.data[name]);
                }
                self.model[name] = ko.observable(self.data[name]);
            });
        },

        /**
         * Get the DOM node for a field.
         *
         * @method
         * @param {string} name The name of the field.
         * @memberOf gocept.jsform.Form.Form
         * @returns {Object} The DOM node of the field as a jQuery object.
         */
        field: function (name) {
            var self = this;
            return self.node.find('#field-' + name);
        },

        /**
         * Return the label for a field.
         *
         * @method
         * @param {string} name The name of the field.
         * @memberOf gocept.jsform.Form.Form
         * @returns {string} The label of the field.
         */
        label: function (name) {
            var self = this,
                label = self.options[name].label;
            if (gocept.jsform.isUndefinedOrNull(label)) {
                label = '';
            }
            return label;
        },

        /**
         * Subscribe to changes on one field of the model and propagate them to the server.
         *
         * @method
         * @param {string} name The name of the field.
         * @memberOf gocept.jsform.Form.Form
         */
        subscribe: function (name) {
            var self = this;
            if (!gocept.jsform.isUndefinedOrNull(self.subscriptions[name])) {
                self.subscriptions[name].dispose();
            }
            self.subscriptions[name] = self.model[name].subscribe(
                function (newValue) {
                    self.save(name, newValue);
                }
            );
        },

        /**
         * Observe changes on all fields on model.
         *
         * @method
         * @memberOf gocept.jsform.Form.Form
         */
        observe_model_changes: function () {
            /* Observe changes on all fields on model. */
            var self = this;
            $.each(self.data, function (id, value) {
                self.subscribe(id);
            });
        },

        /**
         * Retrieve the widget for a field.
         *
         * @method
         * @param {string} name The name of the field.
         * @memberOf gocept.jsform.Form.Form
         */
        get_widget: function (name) {
            var self = this,
                type,
                value = self.data[name];
            if (!gocept.jsform.isUndefinedOrNull(self.options[name]) &&
                    !gocept.jsform.isUndefinedOrNull(self.options[name].template)) {
                return self.options[name].template;
            }
            if (!gocept.jsform.isUndefinedOrNull(self.sources[name])) {
                type = self.options[name].multiple ? 'multiselect' : 'object';
            } else if (value === null) {
                type = 'string';
            } else {
                type = typeof value;
            }
            return gocept.jsform.or(
                self.options[type + '_template'],
                'form_' + type
            );
        },

        /**
         * Schedule saving one field's value to the server via ajax.
         *
         * @method
         * @param {string} name The name of the field.
         * @param {string} newValue The new value of the field.
         * @param {boolean} [silent] Do not notify the user about saving field.
         * @memberOf gocept.jsform.Form.Form
         */
        save: function (name, newValue, silent) {
            var self = this, deferred_save;
            deferred_save = $.when(self.field(name).data('save')).then(
                // For the time being, simply chain the new save after the
                // last, no compression of queued save calls yet.
                function () { return self.start_save(name, newValue, silent); },
                function () { return self.start_save(name, newValue, silent); }
            );
            self.field(name).data('save', deferred_save);
        },

        /**
         * Actual work of preparing and making the ajax call.
         *
         * @note May be deferred in order to serialise saving subsequent
         * values of each field.
         *
         * @method
         * @param {string} name The name of the field.
         * @param {string} newValue The new value of the field.
         * @param {boolean} [silent] Do not notify the user about saving field.
         * @memberOf gocept.jsform.Form.Form
         * @returns {Object} A jQuery promise.
         */
        start_save: function (name, newValue, silent) {
            var self = this, saving_msg_node;

            if (self.unrecoverable_error) {
                return;
            }
            if (!silent) {
                saving_msg_node = self.notify_saving(name);
            }
            return self.save_and_validate(name, newValue)
                .always(function () {
                    self.clear_saving(name, saving_msg_node);
                    self.clear_field_error(name);
                })
                .done(function () {
                    if (!silent) {
                        self.highlight_field(name, 'success');
                        self.status_message(
                            self.t('successfully_saved_value'),
                            'success',
                            1000
                        );
                    }
                })
                .progress(function () {
                    self.clear_saving(name, saving_msg_node);
                    self.notify_field_error(name, self.t('field_contains_unsaved_changes'));
                })
                .fail(function (data) {
                    self.notify_field_error(name, data.msg);
                })
                .always(function (data) {
                    $(self).trigger('after-save', data);
                });
        },

        /**
         * Validation of the field and newValue
         *
         * @method
         * @param {string} name The name of the field.
         * @param {string} newValue The new value of the field.
         * @memberOf gocept.jsform.Form.Form
         * @returns {Object} A jQuery promise.
         */
        save_and_validate: function (name, newValue) {
            var self = this,
                validated = $.Deferred(),
                result = validated.promise(),
                save_url,
                save_type,
                data;

            if (self.options[name].required && !newValue) {
                validated.reject({msg: self.t('required_field_left_blank')});
                return result;
            }

            self.data[name] = newValue;

            save_url = self.options.save_url;
            if (!save_url) {
                save_url = self.url;
            }
            save_type = self.options.save_type;
            if (!save_type) {
                save_type = "POST";
            }

            newValue = self.tokenize_object_fields(name, newValue);

            data = {};
            data[name] = newValue;
            if ($('#' + self.csrf_token_id).length) {
                data[self.csrf_token_id] = $('#' + self.csrf_token_id).val();
            }

            self._save(name, save_url, save_type, ko.toJSON(data))
                .always(function () {
                    self.clear_server_error();
                })
                .done(function (data) {
                    if (data.status === 'error') {
                        validated.reject(data);
                    } else if (data.status === 'success') {
                        validated.resolve(data);
                    } else {
                        $(self).trigger(
                            'unrecoverable-error',
                            self.t('error_could_not_parse_server_response')
                        );
                        return;
                    }
                    $(self).trigger('server-responded');
                })
                .fail(function (jqxhr, text_status, error_thrown) {
                    if (text_status === 'error' && error_thrown) {
                        if (gocept.jsform.isUndefinedOrNull(jqxhr) ||
                                gocept.jsform.isUndefinedOrNull(jqxhr.responseJSON) ||
                                gocept.jsform.isUndefinedOrNull(jqxhr.responseJSON.message)) {
                            $(self).trigger('unrecoverable-error', error_thrown);
                        } else {
                            $(self).trigger('unrecoverable-error', jqxhr.responseJSON.message);
                        }
                        return;
                    }
                    $(self).one('retry', function () {
                        self.start_save(name, newValue)
                            .done(validated.resolve)
                            .fail(validated.reject)
                            .progress(validated.notify);
                    });
                    validated.notify();
                    self.notify_server_error();
                });

            return result;
        },
        /* Method that takes ajax parameters, factored out for testability. */
        _save: function (id, save_url, save_type, data) {
            return $.ajax({
                url: save_url,
                type: save_type,
                data: data,
                contentType: 'application/json'
            });
        },

        /**
         * Get tokens from value in object fields.
         *
         * @method
         * @param {string} name The name of the field.
         * @param {Array|string} value The selected values if field is multiple else the selected value.
         * @memberOf gocept.jsform.Form.Form
         * @returns {Array|string} The selected tokens if field is multiple else the selected token.
         */
        tokenize_object_fields: function (name, value) {
            var self = this, tokens;
            if (!self.is_object_field(name)) {
                return value;
            }
            if (self.options[name].multiple) {
                tokens = [];
                $.each(value, function (index, item) {
                    tokens.push(item.token);
                });
                return tokens;
            }
            if (gocept.jsform.isUndefinedOrNull(value)) {
                return null;
            }
            return value.token;
        },

        /**
         * Handle save retries if connection to server is flaky or broken.
         *
         * @method
         * @param {boolean} retry Chain retries? (default: true)
         * @memberOf gocept.jsform.Form.Form
         * @returns {Object} A jQuery promise.
         */
        when_saved: function (retry) {
            var self = this,
                deferred_saves = [],
                aggregate,
                result,
                consumed_past;

            if (retry  === undefined) {
                retry = true;
            }

            self.node.find('.field').each(function (index, field) {
                deferred_saves.push($(field).data('save'));
            });
            aggregate = $.when.apply(null, deferred_saves);

            result = $.Deferred();
            consumed_past = false;
            if (retry) {
                aggregate
                    .done(result.resolve)
                    .fail(result.reject)
                    .progress(function (msg) {
                        if (consumed_past) { result.notify(msg); }
                    });
            } else {
                aggregate
                    .done(result.resolve)
                    .fail(function () { result.reject('invalid'); })
                    .progress(function () {
                        if (consumed_past) { result.reject('retry'); }
                    });
            }
            consumed_past = true;
            return result.promise();
        },

        /**
         * Retry saving the form.
         *
         * @method
         * @memberOf gocept.jsform.Form.Form
         */
        retry: function () {
            var self = this;
            $(self).triggerHandler('retry');
        },

        /**
         * Save all fields that were not saved before.
         *
         * @note Fields are saved silently.
         *
         * @method
         * @memberOf gocept.jsform.Form.Form
         */
        save_remaining: function () {
            var self = this;
            $.each(self.data, function (id, value) {
                if (gocept.jsform.isUndefinedOrNull(self.field(id).data('save'))) {
                    self.save(id, value, true);
                }
            });
        },

        /**
         * Announce error during save of field.
         *
         * @method
         * @param {string} name The name of the field.
         * @param {string} msg The message to announce.
         * @memberOf gocept.jsform.Form.Form
         */
        notify_field_error: function (name, msg) {
            var self = this, error_node, label;
            self.clear_field_error(name);
            error_node = self.field(name).find('.error');
            error_node.text(msg);
            self.highlight_field(name, 'danger');
            label = self.label(name);
            if (label !== '') {
                label = label + ': ';
            }
            error_node.data(
                'status_message',
                self.status_message(label + msg, 'danger')
            );
        },

        /**
         * Clear announcement of an field error during save.
         *
         * @method
         * @param {string} name The name of the field.
         * @memberOf gocept.jsform.Form.Form
         */
        clear_field_error: function (name) {
            var self = this,
                error_node = self.field(name).find('.error');
            error_node.text('');
            self.clear_status_message(error_node.data('status_message'));
            error_node.data('status_message', null);
        },

        /**
         * Announce HTTP faults during ajax calls.
         *
         * @method
         * @memberOf gocept.jsform.Form.Form
         */
        notify_server_error: function () {
            var self = this;
            self.clear_server_error();
            self.server_error_status_message = self.status_message(
                self.t('communication_error'),
                'danger'
            );
        },

        /**
         * Clear any announcement of an HTTP fault during an ajax call.
         *
         * @method
         * @memberOf gocept.jsform.Form.Form
         */
        clear_server_error: function () {
            var self = this;
            self.clear_status_message(self.server_error_status_message);
            self.server_error_status_message = null;
        },

        /**
         * Announce that save of a field is in progress.
         *
         * @method
         * @param {string} name The name of the field.
         * @memberOf gocept.jsform.Form.Form
         */
        notify_saving: function (name) {
            var self = this;
            self.field(name).addClass('alert-saving');
            return self.status_message(
                self.t('saving') + ' ' + self.label(name),
                'info'
            );
        },

        /**
         * Clear announcement of save progress for a given field.
         *
         * @method
         * @param {string} name The name of the field.
         * @param {string} msg_node The node where a saving progess message is displayed.
         * @memberOf gocept.jsform.Form.Form
         */
        clear_saving: function (name, msg_node) {
            var self = this;
            self.field(name).removeClass('alert-saving');
            self.clear_status_message(msg_node);
        },

        /**
         * Highlight field with status.
         *
         * @method
         * @param {string} name The name of the field.
         * @param {string} status The status to display. Should be one of 'success', 'info', 'warning' or 'danger'.
         * @memberOf gocept.jsform.Form.Form
         */
        highlight_field: function (name, status) {
            /* Highlight field with status. */
            var self = this,
                field = self.field(name);
            field.addClass('alert-' + status);
            field.delay(300);
            field.queue(function () {
                $(this).removeClass('alert-' + status).dequeue();
            });
        },

        /**
         * Create a status message for the given duration.
         *
         * @method
         * @param {string} message The message to display.
         * @param {string} status The status to display. Should be one of 'success', 'info', 'warning' or 'danger'.
         * @param {number} duration How long should the message be displayed (in milliseconds)
         * @memberOf gocept.jsform.Form.Form
         * @returns {Object} The created message as jQuery DOM node.
         */
        status_message: function (message, status, duration) {
            var self = this,
                msg_node = $('<div class="alert"></div>').text(message);
            msg_node.addClass('alert-' + status);
            if (!gocept.jsform.isUndefinedOrNull(duration)) {
                msg_node.delay(duration).fadeOut(
                    self.status_message_fade_out_time,
                    function () { msg_node.remove(); }
                );
            }
            self.statusarea.append(msg_node);
            self.statusarea.scrollTop(self.statusarea.height());
            return msg_node;
        },

        /**
         * Clear given status message.
         *
         * @method
         * @param {Object} msg_node DOM Node as returned by `status.message`.
         * @memberOf gocept.jsform.Form.Form
         */
        clear_status_message: function (msg_node) {
            if (!gocept.jsform.isUndefinedOrNull(msg_node)) {
                msg_node.remove();
            }
        }
    });

    /**
     * Make a form submit button an ajax submit button. This makes sure that when clicking submit, all fields are saved via ajax.
     *
     * @function
     * @memberOf gocept.jsform.Form
     *
     * @example
     * $('#form input[type=submit]').jsform_submit_button()
     *
     */
    $.fn.jsform_submit_button = function (action) {
        return this.each(function () {
            $(this).on('click', function (event) {
                var button = this, jsform;
                button.disabled = true;
                jsform = $(this).closest('form').data('form');
                jsform.save_remaining();
                jsform.when_saved().done(function () {
                    action.call(button);
                }).fail(function (reason) {
                    var msg = jsform.t('submit_fail');
                    jsform.status_message(msg, 'danger', 5000);
                    button.disabled = false;
                });
                event.preventDefault();
            });
        });
    };
}(jQuery));
