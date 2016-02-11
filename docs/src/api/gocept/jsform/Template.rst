

Template
========

.. currentmodule:: gocept.jsform

.. function:: gocept.jsform.register_template(id, template, description)

    Allows you to register your templates or change the default templates.

    :param string id: The id of the template.
    :param string|function template: The template. Will be saved as a compiled Handlebars template. Can be a precompiled Handlebars template, the template as raw HTML or the id of a DOM node containing the HTML of the template.
    :param string description: A description for the template.
    
    .. code-block:: js
    
        gocept.jsform.register_template('my_template', '<p>{{name}}</p>');
        
        $(body).append('<script type="text/html" id="reference"><p>{{name}}</p></script>')
        gocept.jsform.register_template('my_template', '#reference');
        
        var compiled = Handlebars.compile('<p>{{name}}</p>');
        gocept.jsform.register_template('my_template', compiled);

.. class:: TemplateHandler ()

    Helper class for handling templates within `gocept.jsform`.

    
    
    .. code-block:: js
    
        var handler = new gocept.jsform.TemplateHandler();

    .. method:: get_template(id)
    
        Get the template for the given `id`.
    
        :param string id: The id of the template.
        :return: The template as precompiled Handlebars template.
        :rtype: function
        
    
        .. code-block:: js
        
            handler.get_template('form_boolean')({name: 'asdf'})
            '<input type="checkbox" name="asdf" data-bind="checked: asdf" />'
    .. method:: list_templates()
    
        List all registered templates.
    
        :return: A list of objects containing the id, description and compiled template.
        :rtype: Array
        
    
        .. code-block:: js
        
            handler.list_template()[0]
            {id: 'form', description: 'The base `gocept.jsform.Form` template', template: function}




