// -*- js-indent-level: 2; -*-
/*global Class, gocept, Handlebars, ko */

(function($) {
  "use strict";

  gocept.jsform.locales = {};
  gocept.jsform.locales.en = {
    successfully_saved_value: 'Successfully saved value.',
    field_contains_unsaved_changes: 'This field contains unsaved changes.',
    communication_error: 'There was an error communicating with the server.',
    required_field_left_blank: 'This field is required but has no input.',
    saving: 'Saving'
  };
  gocept.jsform.locales.de = {
    successfully_saved_value: 'Feld wurde gespeichert.',
    field_contains_unsaved_changes: 'Dieses Feld enthält nicht gespeicherte Änderungen.',
    communication_error: 'Es gab einen Fehler bei der Kommunikation mit dem Server.',
    required_field_left_blank: 'Dieses Pflichtfeld wurde nicht ausgefüllt.',
    saving: 'Speichere'
  };

  gocept.jsform.get_template = function(template) {
      var self = this;
      if (template && (typeof(template) === "function")) {
        return template;
      }

      var html;
      if (template.indexOf('>') !== -1) {
        html = template;
      } else if (template.indexOf('#') === 0) {
        html = $(template).html();
      } else {
        html = $('#' + template).html();
      }
      return Handlebars.compile(html);
  };

  gocept.jsform.Form = Class.$extend({

    __init__: function(id, options) {
      /* Exand the form under #id.
       *
       * Options can be:
       *
       * - form_template:    An alternative template for the form. It may
       *                     contain ids for the fields to render them on
       *                     custom places.
       * - field_wrapper_template:
       *                     An alternative template for wrapping the
       *                     fields. This has to be compatible to the used
       *                     form template, i.e. the element with ids of the
       *                     fields must match the used form_template. The
       *                     template gets expanded with 2 variables:
       *                        * id (id of the field)
       *                        * widget (actual widget code)
       * - string_template:  An alternative template for text based fields.
       * - object_template:  An alternative template for input based fields.
       * - boolean_template: An alternative template for boolean based fields.
       * - save_url:         The url where data changes are propagated to.
       *                     Should return a dict with either {"status":
       *                     "success"} or {"status": "error", "msg":
       *                     "Not an eMail address."}.
       * - action:           The url the form will submit to (if intended).
       *                     Will become the action attribute in form.
       * - language:         2-char language code. Default is en.
       */
      var self = this;
      self.id = id;
      self.url = null;
      self.initial_data = null;
      self.data = {};
      self.subscriptions = {};
      self.options = {action: '', language: 'en'};
      $.extend(self.options, options);
      self.csrf_token_id = 'csrf_token';
      self.mapping = {};
      self.texts = gocept.jsform.locales[self.options.language];
      self.create_form();
      $(self).on('server-responded', self.retry);
      self.unrecoverable_error = false;
      $(self).on('unrecoverable-error', function(event, msg) {
        self.unrecoverable_error = true;
        self.unrecoverable_error_msg = msg;
        alert('An unrecoverable error has occurred: ' + msg);
      });
      if (gocept.jsform.isUndefinedOrNull(self.options.field_wrapper_template))
        self.field_wrapper_template = self.get_template('gocept_jsform_templates_field_wrapper');
      else
        self.field_wrapper_template = self.get_template(self.options.field_wrapper_template);
      self.loaded = $.Deferred();
      $(self).bind('after-load', function() {
        self.loaded.resolve();
      });
    },

    t: function(msgid) {
        var self = this;
        return self.texts[msgid];
    },

    expand_form: function() {
      /* Expands the form_template into the DOM */
      var self = this;
      var form_template = self.get_template(gocept.jsform.or(
        self.options.form_template, 'gocept_jsform_templates_form'));
      var form_options = $.extend({'form_id': self.id}, self.options);
      var form_code = $(
        form_template(form_options).replace(/^\s+|\s+$/g, ''));
      $('#' + self.id).replaceWith(form_code);
    },

    create_form: function() {
      /* wires the form DOM node and object */
      var self = this;
      if (self.options.form_template !== '') {
        self.expand_form();
      }
      self.node = $('#' + self.id);
      self.node.data('form', self);
      self.statusarea = self.node.find('.statusarea');
    },

    reload: function() {
        var self = this;
        self.create_form();
        self.start_load();
    },

    load: function (data_or_url, options, mapping) {
      /* Invokes data retrieval and form field initialization.
       *
       * Takes the following parameters:
       * |
       * |- data_or_url: The url to a JSON View returning the data for the
       * |               form or the data itself.
       * |- options: Options for each data field:
       *   |- <field_name>: Foreach field in data you can add some options:
       *     |- label: The label of the field.
       *     |- template: A custom template for this field.
       *     |- required: boolean, whether this is a required field
       *     |- source: array of objects containing 'token' and 'title'
       *     |- multiple: for object selection, whether to do multi-select
       * |- mapping:  An optional mapping for the <ko.mapping> plugin.
       */
      var self = this;
      if (typeof(data_or_url) == 'string') {
        self.url = data_or_url;
      } else {
        self.initial_data = data_or_url;
      }
      $.extend(self.options, options);
      self.collect_sources();
      if (!gocept.jsform.isUndefinedOrNull(mapping))
        self.mapping = mapping;
      self.start_load();
    },

    collect_sources: function() {
      var self = this;
      self.sources = {};
      self.item_maps = {};
      $.each(self.options, function(name, value) {
        if (gocept.jsform.isUndefinedOrNull(value.source)) {
          return;
        }
        self.sources[name] = value.source;
        var item_map = {};
        $.each(value.source, function(index, item) {
          item_map[item.token] = item;
        });
        self.item_maps[name] = item_map;
      });
    },

    start_load: function() {
      /* Invokes data retrieval if needed.
       *
       * After retrieval (which may be asynchronous), self.data is initialized.
       */
      var self = this;
      self.loaded = $.Deferred();  // replace to represent a new load cycle
      if (self.url !== null) {
          self.reload_data(function(data) { self.finish_load(data); });
      } else {
        self.finish_load(self.initial_data);
      }
    },

    reload_data: function(cb) {
        //Only reload data and call cb with it.
        var self = this;
        $.ajax({
          dataType: "json",
          url: self.url,
          success: function (tokenized) {
              var data = {};
              $.each(tokenized, function(name, value) {
                  data[name] = self.resolve_object_field(name, value);
              });
              cb(data);
          },
          error: function (e) { self.notify_server_error(e); }
        });
    },

    finish_load: function(data) {
        var self = this;
        self.data = data;
        self.init_fields();
        $(self).trigger('after-load');
    },

    resolve_object_field: function(name, value) {
        var self = this;
        if (gocept.jsform.isUndefinedOrNull(self.options[name]) ||
            gocept.jsform.isUndefinedOrNull(self.options[name].source)) {
            return value;
        }
        var item_map = self.item_maps[name];
        if (self.options[name].multiple) {
            var resolved = [];
            $.each(value, function(index, token) {
                resolved.push(item_map[token]);
            });
            return resolved;
        } else {
            return item_map[value];
        }
    },

    get_template: gocept.jsform.get_template,

    render_widget: function(id) {
      var self = this;
      var widget = self.get_template(self.get_widget(id));
      var widget_options = $.extend(
        {name: id,
         value: self.data[id],
         label: ''
        }, self.options[id]);
      if (!gocept.jsform.isUndefinedOrNull(widget_options.source) &&
          gocept.jsform.isUndefinedOrNull(widget_options.placeholder)) {
          widget_options.placeholder =
            widget_options.multiple ? 'Select items' : 'Select an item';
      }
      var widget_code = widget(widget_options);
      var wrapper_options = $.extend(
          {id: id,
           widget_code: widget_code
          }, widget_options);
      widget_code = self.field_wrapper_template(wrapper_options);
      if (!$('#field-'+id, self.node).length)
        self.node.append(widget_code);
      else
        $('#field-'+id, self.node).replaceWith(widget_code);
      if (self.options[id].required) {
        $('#field-' + id, self.node).addClass('required');
      }
    },

    init_fields: function() {
      /* Initialize field from self.data.
       *
       * Guess the type of data for each field and render the correct field
       * template into the DOM. Invoke the knockout databinding via
       * auto-mapping data into a model (thanks to ko.mapping plugin) and
       * invoke observing the model for changes to propagate these to the
       * server.
       *
       * Appends fields into the form if no DOM element with id name like
       * field is found.
       */
      var self = this;
      if (gocept.jsform.isUndefinedOrNull(self.data))
        return;
      $.each(self.data, function (id, value) {
        /* XXX option defaults should not be applied here but until fields
         * have a class of their own, this is a convenient place
         */
        self.options[id] = $.extend({required: false}, self.options[id]);
        self.render_widget(id);
      });
      self.update_bindings();
    },

    update_bindings: function() {
      var self = this;
      self.create_model();
      ko.applyBindings(self.model, self.node.get(0));
      self.observe_model_changes();
    },

    create_model: function() {
      var self = this;
      self.model = ko.mapping.fromJS(self.data, self.mapping);
      self.model.__sources__ = self.sources;
      $.each(self.sources, function(name, values) {
        if (self.options[name].multiple) {
          self.model[name] = ko.observableArray(self.data[name]);
        }
          self.model[name] = ko.observable(self.data[name]);
      });
    },

    field: function(id) {
      var self = this;
      return self.node.find('#field-' + id);
    },

    label: function(id) {
      var self = this;
      var label = self.options[id].label;
      if (gocept.jsform.isUndefinedOrNull(label)) {
        label = '';
      }
      return label;
    },

    subscribe: function(id, real_id) {
      /* Subscribe to changes on one field of the model and propagate them to
       * the server.
       */
      var self = this;
      if (!gocept.jsform.isUndefinedOrNull(self.subscriptions[id])) {
          self.subscriptions[id].dispose();
      }
      self.subscriptions[id] = self.model[id].subscribe(function(newValue) {
        self.save(gocept.jsform.or(real_id, id), newValue);
      });
    },

    observe_model_changes: function() {
      /* Observe changes on all fields on model. */
      var self = this;
      $.each(self.data, function (id, value) {
        self.subscribe(id);
      });
    },

    get_widget: function(id) {
      /* Retrieve the widget for a field. */
      var self = this;
      if (!gocept.jsform.isUndefinedOrNull(self.options[id]) &&
          !gocept.jsform.isUndefinedOrNull(self.options[id].template)) {
        return self.options[id].template;
      }
      var type;
      var value = self.data[id];
      if (!gocept.jsform.isUndefinedOrNull(self.sources[id])) {
        type = self.options[id].multiple ? 'multiselect' : 'object';
      } else if (value === null) {
        type = 'string';
      } else {
        type = typeof(value);
      }
      return gocept.jsform.or(self.options[type + '_template'],
                              'gocept_jsform_templates_' + type);
    },

    save: function (id, newValue) {
      /* Schedule saving one field's value to the server via ajax. */
      var self = this;
      var deferred_save = $.when(self.field(id).data('save')).then(
        /* For the time being, simply chain the new save after the last, no
           compression of queued save calls yet. */
        function () {return self.start_save(id, newValue);},
        function () {return self.start_save(id, newValue);}
      );
      self.field(id).data('save', deferred_save);
    },

    start_save: function(id, newValue) {
      /* Actual work of preparing and making the ajax call. May be deferred in
         order to serialise saving subsequent values of each field. */
      var self = this;

      if (self.unrecoverable_error) {
        return;
      }

      var saving_msg_node = self.notify_saving(id);
      return self.save_and_validate(id, newValue)
      .always(function() {
        self.clear_saving(id, saving_msg_node);
        self.clear_field_error(id);
      })
      .done(function() {
        self.highlight_field(id, 'success');
        self.status_message(self.t('successfully_saved_value'), 'success', 1000);
      })
      .progress(function() {
        self.clear_saving(id, saving_msg_node);
        self.notify_field_error(id, self.t('field_contains_unsaved_changes'));
      })
      .fail(function(msg) {
        self.notify_field_error(id, msg);
      })
      .always(function(data_or_msg) {
        $(self).trigger('after-save', [data_or_msg]);
      });
    },

    save_and_validate: function(id, newValue) {
      var self = this;

      var validated = $.Deferred();
      var result = validated.promise();

      if (self.options[id].required && !(newValue)) {
        validated.reject(self.t('required_field_left_blank'));
        return result;
      }

      self.data[id] = newValue;

      var save_url = self.options.save_url;
      if (!save_url) {
        save_url = self.url;
      }
      var save_type = self.options.save_type;
      if (!save_type) {
        save_type = "POST";
      }

      newValue = self.tokenize_object_fields(id, newValue);

      var data = {};
      data[id] = newValue;
      if ($('#'+self.csrf_token_id).length) {
        data[self.csrf_token_id] = $('#'+self.csrf_token_id).val();
      }

      self._save(id, save_url, save_type, ko.toJSON(data))
      .always(function() {
        self.clear_server_error();
      })
      .done(function(data) {
        if (data.status == 'error') {
          validated.reject(data.msg);
        } else if (data.status == 'success') {
          validated.resolve(data);
        } else {
          if ((data[0] === '<') && (typeof jasmine === 'undefined')) {
            // HTML was returnd
            $('html head').remove();
            $('html body').remove();
            $('html').append($(data));
            return;
          } else {
            $(self).trigger('unrecoverable-error',
                            'Could not parse server response.');
            return;
          }
        }
        $(self).trigger('server-responded');
      })
      .fail(function(jqxhr, text_status, error_thrown) {
        if (text_status == 'error' && error_thrown) {
          if (gocept.jsform.isUndefinedOrNull(jqxhr) ||
              gocept.jsform.isUndefinedOrNull(jqxhr.responseJSON) ||
              gocept.jsform.isUndefinedOrNull(jqxhr.responseJSON.message)) {
            $(self).trigger('unrecoverable-error', error_thrown);
          } else {
            $(self).trigger('unrecoverable-error', jqxhr.responseJSON.message);
          }
          return;
        }
        $(self).one('retry', function() {
          self.start_save(id, newValue)
            .done(validated.resolve)
            .fail(validated.reject)
            .progress(validated.notify);
        });
        validated.notify();
        self.notify_server_error();
      });

      return result;
    },

    _save: function (id, save_url, save_type, data) {
      /* Method that takes ajax parameters, factored out for testability. */
      return $.ajax({
        url: save_url,
        type: save_type,
        data: data,
        contentType: 'application/json'
      });
    },

    tokenize_object_fields: function(id, value) {
      var self = this;
      if (gocept.jsform.isUndefinedOrNull(self.sources[id])) {
        return value;
      }
      if (self.options[id].multiple) {
        var tokens = [];
          $.each(value, function(index, item) {
          tokens.push(item.token);
        });
        return tokens;
      }
      if (gocept.jsform.isUndefinedOrNull(value)) {
        return null;
      }
      return value.token;
    },

    when_saved: function (retry) {
      var self = this;

      if (typeof(retry) == 'undefined') {
        retry = true;
      }

      var deferred_saves = [];
      self.node.find('.field').each(function (index, field) {
        deferred_saves.push($(field).data('save'));
      });
      var aggregate = $.when.apply(null, deferred_saves);

      var result = $.Deferred();
      var consumed_past = false;
      if (retry) {
        aggregate
          .done(result.resolve)
          .fail(result.reject)
          .progress(function(msg) {
            if (consumed_past) { result.notify(msg); }
          });
      } else {
        aggregate
          .done(result.resolve)
          .fail(function() { result.reject('invalid'); })
          .progress(function() {
            if (consumed_past) { result.reject('retry'); }
          });
      }
      consumed_past = true;
      return result.promise();
    },

    retry: function() {
      var self = this;
      $(self).triggerHandler('retry');
    },

    save_remaining: function() {
      var self = this;
      $.each(self.data, function(id, value) {
        if (gocept.jsform.isUndefinedOrNull(self.field(id).data('save'))) {
          self.save(id, value);
        }
      });
    },

    notify_field_error: function(id, msg) {
      var self = this;
      self.clear_field_error(id);
      var error_node = self.field(id).find('.error');
      error_node.text(msg);
      self.highlight_field(id, 'danger');
      var label = self.label(id);
      if (label !== '') {
        label = label + ': ';
      }
      error_node.data(
          'status_message', self.status_message(label + msg, 'danger'));
    },

    clear_field_error: function(id) {
      var self = this;
      var error_node = self.field(id).find('.error');
      error_node.text('');
      self.clear_status_message(error_node.data('status_message'));
      error_node.data('status_message', null);
    },

    notify_server_error: function() {
      /* Announce HTTP faults during ajax calls. */
      var self = this;
      self.clear_server_error();
      self.server_error_status_message = self.status_message(
          self.t('communication_error'), 'danger');
    },

    clear_server_error: function() {
      /* Clear any announcement of an HTTP fault during an ajax call. */
      var self = this;
      self.clear_status_message(self.server_error_status_message);
      self.server_error_status_message = null;
    },

    notify_saving: function(id) {
      var self = this;
      self.field(id).addClass('alert-saving');
      return self.status_message(
          self.t('saving') + ' ' + self.label(id), 'info');
    },

    clear_saving: function(id, msg_node) {
      var self = this;
      self.field(id).removeClass('alert-saving');
      self.clear_status_message(msg_node);
    },

    highlight_field: function(id, status) {
      var self = this;
      var field = self.field(id);
      field.addClass('alert-' + status);
      field.delay(300);
      field.queue(function() {
        $(this).removeClass('alert-' + status).dequeue();
      });
    },

    status_message: function(message, status, duration) {
      var self = this;
      var msg_node = $('<div class="alert"></div>').text(message);
      msg_node.addClass('alert-' + status);
      if (!gocept.jsform.isUndefinedOrNull(duration)) {
          msg_node.delay(duration).fadeOut(
              1000, function(){msg_node.remove();});
      }
      self.statusarea.append(msg_node);
      self.statusarea.scrollTop(self.statusarea.height());
      return msg_node;
    },

    clear_status_message: function(msg_node) {
      if (!gocept.jsform.isUndefinedOrNull(msg_node)) {
        msg_node.remove();
      }
    }
  });


  $.fn.jsform_submit_button = function(action) {
    return this.each(function() {
      $(this).on('click', function(event) {
        var button = this;
        button.disabled = true;
        var jsform = $(this).closest('form').data('form');
        jsform.save_remaining();
        jsform.when_saved().done(
          function () {
            action.call(button);
        }).fail(
          function (reason) {
            var msg = 'Some fields could not be saved. ' +
                'Please correct the errors and send again.';
            jsform.status_message(msg, 'danger', 5000);
            button.disabled = false;
          }
        );
        event.preventDefault();
      });
    });
  };

}(jQuery));
