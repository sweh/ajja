

jsform
======

The gocept.jsform Module



.. currentmodule:: gocept.jsform

.. function:: $.fn.jsform_submit_button()

    Make a form submit button an ajax submit button. This makes sure that when clicking submit, all fields are saved via ajax.

    
    
    .. code-block:: js
    
        $('#my_form input[type=submit]').jsform_submit_button()

.. class:: Form (id[, options])

    :extends: gocept.jsform.TemplateHandler
    :param string id: The id of the DOM node where the form should be rendered.
    :param FormOptions options: An object containing options for the form.
    :return: The form instance.
    :rtype: Object
    
    .. code-block:: js
    
        $(body).append('<div id="my_form"></div>');
        var form = gocept.jsform.Form('my_form');

    .. attribute:: gocept.jsform.Form.status_message_fade_out_time
    
        Time in milliseconds the status popup will be displayed
    
        :type: Number
        :default: 3000
    .. method:: __init__(id[, options])
    
        Initialize the form. Called upon form initialization.
    
        :param string id: The id of the DOM node where the form should be rendered.
        :param FormOptions options: An object containing options for the form.
    .. method:: alert(msg)
    
        Show a message to the user. (Alert box)
    
        :param string msg: The message to display.
    .. method:: clear_field_error(name)
    
        Clear announcement of an field error during save.
    
        :param string name: The name of the field.
    .. method:: clear_saving(name, msg_node)
    
        Clear announcement of save progress for a given field.
    
        :param string name: The name of the field.
        :param string msg_node: The node where a saving progess message is displayed.
    .. method:: clear_server_error()
    
        Clear any announcement of an HTTP fault during an ajax call.
    .. method:: clear_status_message(msg_node)
    
        Clear given status message.
    
        :param Object msg_node: DOM Node as returned by `status.message`.
    .. method:: collect_sources()
    
        Collect sources from options and make them ovservable.
    .. method:: create_form()
    
        Wires the form DOM node and object.
    .. method:: create_model()
    
        Create a knockout model from self.data.
        
        .. note ::
            Needed for bindings and oberservation.
    .. method:: expand_form()
    
        Expands the form_template into the DOM.
    .. method:: field(name)
    
        Get the DOM node for a field.
    
        :param string name: The name of the field.
        :return: The DOM node of the field as a jQuery object.
        :rtype: Object
    .. method:: finish_load(tokenized)
    
        After load handler. Save data retrieved from server on model.
    
        :param Object tokenized: The data returned from the ajax server request.
    .. method:: get_widget(name)
    
        Retrieve the widget for a field.
    
        :param string name: The name of the field.
    .. method:: highlight_field(name, status)
    
        Highlight field with status.
    
        :param string name: The name of the field.
        :param string status: The status to display. Should be one of 'success', 'info', 'warning' or 'danger'.
    .. method:: init_fields()
    
        Initialize fields from self.data.
        
        .. note ::
            Guess the type of data for each field and render the correct field
            template into the DOM. Invoke the knockout databinding via
            auto-mapping data into a model (thanks to ko.mapping plugin) and
            invoke observing the model for changes to propagate these to the
            server.
            Appends fields into the form if no DOM element with id name like
            field is found.
    .. method:: is_object_field(name)
    
        Check weather field is an object field.
        
        .. note ::
            Object fields are either select boxes or radio lists.
    
        :param string name: The name of the field to check.
        :rtype: boolean
    .. method:: label(name)
    
        Return the label for a field.
    
        :param string name: The name of the field.
        :return: The label of the field.
        :rtype: string
    .. method:: load(data_or_url[, options[, mapping]])
    
        Invokes data retrieval and form field initialization.
    
        :param string data_or_url: The url to a JSON View returning the data for the form or the data itself.
        :param LoadOptions options: Options for each data field.
        :param Object mapping: An optional mapping for the <ko.mapping> plugin.
        
    
        .. code-block:: js
        
            form.load({'firstname': 'Robert', 'is_baby': true});
            form.load('/data.json', {is_baby: {label: 'Is it a baby?'}});
    .. method:: notify_field_error(name, msg)
    
        Announce error during save of field.
    
        :param string name: The name of the field.
        :param string msg: The message to announce.
    .. method:: notify_saving(name)
    
        Announce that save of a field is in progress.
    
        :param string name: The name of the field.
    .. method:: notify_server_error()
    
        Announce HTTP faults during ajax calls.
    .. method:: observe_model_changes()
    
        Observe changes on all fields on model.
    .. method:: reload()
    
        Invokes data retrieval from server and reloads the form.
    .. method:: render_widget(id)
    
        Render one form widget (e.g. an input field).
    
        :param string id: The name of the field.
    .. method:: resolve_object_field(name, value)
    
        Save tokens from value in object fields.
    
        :param string name: The name of the field.
        :param Array|string value: Tokens from object field if multiple of one token.
        :return: Returns either an array of source objects if field is multiple or exactly one source object.
        :rtype: Array|Object
    .. method:: retry()
    
        Retry saving the form.
    .. method:: save(name, newValue[, silent])
    
        Schedule saving one field's value to the server via ajax.
    
        :param string name: The name of the field.
        :param string newValue: The new value of the field.
        :param boolean silent: Do not notify the user about saving field.
    .. method:: save_and_validate(name, newValue)
    
        Validation of the field and newValue
    
        :param string name: The name of the field.
        :param string newValue: The new value of the field.
        :return: A jQuery promise.
        :rtype: Object
    .. method:: save_remaining()
    
        Save all fields that were not saved before.
        
        .. note ::
            Fields are saved silently.
    .. method:: start_load()
    
        Invokes data retrieval if needed.
        
        .. note ::
            After retrieval (which may be asynchronous), self.data is initialized.
    .. method:: start_save(name, newValue[, silent])
    
        Actual work of preparing and making the ajax call.
        
        .. note ::
            May be deferred in order to serialise saving subsequent
            values of each field.
    
        :param string name: The name of the field.
        :param string newValue: The new value of the field.
        :param boolean silent: Do not notify the user about saving field.
        :return: A jQuery promise.
        :rtype: Object
    .. method:: status_message(message, status, duration)
    
        Create a status message for the given duration.
    
        :param string message: The message to display.
        :param string status: The status to display. Should be one of 'success', 'info', 'warning' or 'danger'.
        :param number duration: How long should the message be displayed (in milliseconds)
        :return: The created message as jQuery DOM node.
        :rtype: Object
    .. method:: subscribe(name)
    
        Subscribe to changes on one field of the model and propagate them to the server.
    
        :param string name: The name of the field.
    .. method:: t(msgid)
    
        Translate a message into the language selected upon form initialization.
    
        :param string msgid: The message id from the localization dict.
        :return: The translated message.
        :rtype: string
    .. method:: tokenize_object_fields(name, value)
    
        Get tokens from value in object fields.
    
        :param string name: The name of the field.
        :param Array|string value: The selected values if field is multiple else the selected value.
        :return: The selected tokens if field is multiple else the selected token.
        :rtype: Array|string
    .. method:: update_bindings()
    
        Add or update knockout bindings to the data.
        
        .. note ::
            This is where all the magic starts. Adding bindings to our model
            and observing model changes allows us to trigger automatic updates
            to the server when form fields are submitted.
    .. method:: update_sources(data)
    
        Update sources from data. Called on form reload.
    
        :param Object data: The data returned from the ajax server request.
    .. method:: when_saved(retry)
    
        Handle save retries if connection to server is flaky or broken.
    
        :param boolean retry: Chain retries? (default: true)
        :return: A jQuery promise.
        :rtype: Object




