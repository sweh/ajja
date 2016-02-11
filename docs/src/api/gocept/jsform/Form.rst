

Form
====

.. currentmodule:: gocept.jsform

.. js:function:: $.fn.jsform_submit_button()

    Make a form submit button an ajax submit button. This makes sure that when clicking submit, all fields are saved via ajax.

    
    
    .. code-block:: js
    
        $('#my_form input[type=submit]').jsform_submit_button()

.. js:class:: Form (id[, options])

    :extends: :js:class:`TemplateHandler`
    :param string id: The id of the DOM node where the form should be rendered.
    :param Object options: An object containing options for the form.
    :param string options.save_url: The url where data changes are propagated to. Should return a dict with either ``{"status": "success"}`` or ``{"status": "error", "msg": "Not an eMail address."}``.
    :param string options.action: The url the form will submit to (if intended). Will become the action attribute in form.
    :param string options.language: 2-char language code. Default is `en`.
    :param boolean options.disabled: Only render disabled fields in the whole form if true.
    :return: The form instance.
    :rtype: Object
    
    .. code-block:: js
    
        $(body).append('<div id="my_form"></div>');
        var form = new gocept.jsform.Form('my_form');

    .. js:function:: alert(msg)
    
        Show a message to the user. (Alert box)
    
        :param string msg: The message to display.
    .. js:function:: clear_field_error(name)
    
        Clear announcement of an field error during save.
    
        :param string name: The name of the field.
    .. js:function:: clear_saving(name, msg_node)
    
        Clear announcement of save progress for a given field.
    
        :param string name: The name of the field.
        :param string msg_node: The node where a saving progess message is displayed.
    .. js:function:: clear_server_error()
    
        Clear any announcement of an HTTP fault during an ajax call.
    .. js:function:: clear_status_message(msg_node)
    
        Clear given status message.
    
        :param Object msg_node: DOM Node as returned by `status.message`.
    .. js:function:: collect_sources()
    
        Collect sources from options and make them ovservable.
    .. js:function:: create_form()
    
        Wires the form DOM node and object.
    .. js:function:: create_model()
    
        Create a knockout model from self.data.
        
        .. note ::
            Needed for bindings and oberservation.
    .. js:function:: expand_form()
    
        Expands the form_template into the DOM.
    .. js:function:: field(name)
    
        Get the DOM node for a field.
    
        :param string name: The name of the field.
        :return: The DOM node of the field as a jQuery object.
        :rtype: Object
    .. js:function:: finish_load(tokenized)
    
        After load handler. Save data retrieved from server on model.
    
        :param Object tokenized: The data returned from the ajax server request.
    .. js:function:: get_widget(name)
    
        Retrieve the widget for a field.
    
        :param string name: The name of the field.
    .. js:function:: highlight_field(name, status)
    
        Highlight field with status.
    
        :param string name: The name of the field.
        :param string status: The status to display. Should be one of 'success', 'info', 'warning' or 'danger'.
    .. js:function:: init_fields()
    
        Initialize fields from self.data.
        
        .. note ::
            Guess the type of data for each field and render the correct field
            template into the DOM. Invoke the knockout databinding via
            auto-mapping data into a model (thanks to ko.mapping plugin) and
            invoke observing the model for changes to propagate these to the
            server.
            Appends fields into the form if no DOM element with id name like
            field is found.
    .. js:function:: is_object_field(name)
    
        Check whether field is an object field.
        
        .. note ::
            Object fields are either select boxes or radio lists.
    
        :param string name: The name of the field to check.
        :rtype: boolean
    .. js:function:: label(name)
    
        Return the label for a field.
    
        :param string name: The name of the field.
        :return: The label of the field.
        :rtype: string
    .. js:function:: load(data_or_url[, options[, mapping]])
    
        Invokes data retrieval and form field initialization.
    
        :param string data_or_url: The url to a JSON View returning the data for the form or the data itself.
        :param Options options: Options for each data field.
        :param string options.<field_name>: Options for the field.
        :param string options.<field_name>.label: The label of the field.
        :param string options.<field_name>.template: The id of a custom template for this field.
        :param boolean options.<field_name>.required: Whether this is a required field or not.
        :param Array options.<field_name>.source: The source for a select field. Contains objects with 'token' and 'title'.
        :param boolean options.<field_name>.multiple: For object selection, whether to do multi-select.
        :param string options.<field_name>.placeholder: Placeholder to the empty dropdown option.
        :param boolean options.<field_name>.disabled: true if field should be disabled.
        :param Object mapping: An optional mapping for the <ko.mapping> plugin.
        
    
        .. code-block:: js
        
            form.load({'firstname': 'Robert', 'is_baby': true});
            form.load('/data.json', {is_baby: {label: 'Is it a baby?'}});
    .. js:function:: notify_field_error(name, msg)
    
        Announce error during save of field.
    
        :param string name: The name of the field.
        :param string msg: The message to announce.
    .. js:function:: notify_saving(name)
    
        Announce that save of a field is in progress.
    
        :param string name: The name of the field.
    .. js:function:: notify_server_error()
    
        Announce HTTP faults during ajax calls.
    .. js:function:: observe_model_changes()
    
        Observe changes on all fields on model.
    .. js:function:: reload()
    
        Invokes data retrieval from server and reloads the form.
    .. js:function:: render_widget(id)
    
        Render one form widget (e.g. an input field).
    
        :param string id: The name of the field.
    .. js:function:: resolve_object_field(name, value)
    
        Save tokens from value in object fields.
    
        :param string name: The name of the field.
        :param Array|string value: Tokens from object field if multiple of one token.
        :return: Returns either an array of source objects if field is multiple or exactly one source object.
        :rtype: Array|Object
    .. js:function:: retry()
    
        Retry saving the form.
    .. js:function:: save(name, newValue[, silent])
    
        Schedule saving one field's value to the server via ajax.
    
        :param string name: The name of the field.
        :param string newValue: The new value of the field.
        :param boolean silent: Do not notify the user about saving field.
    .. js:function:: save_and_validate(name, newValue)
    
        Validation of the field and newValue
    
        :param string name: The name of the field.
        :param string newValue: The new value of the field.
        :return: A jQuery promise.
        :rtype: Object
    .. js:function:: save_remaining()
    
        Save all fields that were not saved before.
        
        .. note ::
            Fields are saved silently.
    .. js:function:: start_load()
    
        Invokes data retrieval if needed.
        
        .. note ::
            After retrieval (which may be asynchronous), self.data is initialized.
    .. js:function:: start_save(name, newValue[, silent])
    
        Actual work of preparing and making the ajax call.
        
        .. note ::
            May be deferred in order to serialise saving subsequent
            values of each field.
    
        :param string name: The name of the field.
        :param string newValue: The new value of the field.
        :param boolean silent: Do not notify the user about saving field.
        :return: A jQuery promise.
        :rtype: Object
    .. js:function:: status_message(message, status, duration)
    
        Create a status message for the given duration.
    
        :param string message: The message to display.
        :param string status: The status to display. Should be one of 'success', 'info', 'warning' or 'danger'.
        :param number duration: How long should the message be displayed (in milliseconds)
        :return: The created message as jQuery DOM node.
        :rtype: Object
    .. js:function:: subscribe(name)
    
        Subscribe to changes on one field of the model and propagate them to the server.
    
        :param string name: The name of the field.
    .. js:function:: t(msgid)
    
        Translate a message into the language selected upon form initialization.
    
        :param string msgid: The message id from the localization dict.
        :return: The translated message.
        :rtype: string
    .. js:function:: tokenize_object_fields(name, value)
    
        Get tokens from value in object fields.
    
        :param string name: The name of the field.
        :param Array|string value: The selected values if field is multiple else the selected value.
        :return: The selected tokens if field is multiple else the selected token.
        :rtype: Array|string
    .. js:function:: update_bindings()
    
        Add or update knockout bindings to the data.
        
        .. note ::
            This is where all the magic starts. Adding bindings to our model
            and observing model changes allows us to trigger automatic updates
            to the server when form fields are submitted.
    .. js:function:: update_sources(data)
    
        Update sources from data. Called on form reload.
    
        :param Object data: The data returned from the ajax server request.
    .. js:function:: when_saved(retry)
    
        Handle save retries if connection to server is flaky or broken.
    
        :param boolean retry: Chain retries? (default: true)
        :return: A jQuery promise.
        :rtype: Object




