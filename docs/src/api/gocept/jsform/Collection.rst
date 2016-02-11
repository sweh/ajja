

Collection
==========

.. currentmodule:: gocept.jsform


.. class:: ListWidget (node_selector[, options])

    Turn any DOM elements matched by node_selector into ListWidgets.

    :extends: gocept.jsform.TemplateHandler
    :param string node_selector: The selector of the DOM node where the widget should be rendered.
    :param WidgetOptions options: An object containing options for the widget.
    :return: The widget instance.
    :rtype: Object
    
    .. code-block:: js
    
        $(body).append('<div id="my_list_widget"></div>');
        var list_widget = new gocept.jsform.ListWidget(
            '#my_list_widget',
            {collection_url: '/list.json'}
        );

    .. method:: __init__(node_selector[, options])
    
        Initialize the list widget. Called upon widget initialization.
    
        :param string node_selector: The selector of the DOM node where the widget should be rendered.
        :param WidgetOptions options: An object containing options for the widget.
        :return: The widget instance.
        :rtype: Object
    .. method:: apply_item_actions(node)
    
        Bind a click handler to each action of the given item.
        
        .. note ::
            The callback, that was specified in `item_actions`, is binded here.
    
        :param Object node: The jQuery DOM node of the item with the actions.
    .. method:: get_collection(item)
    
        Return the container DOM node of item.
    
        :param Object item: An item as returned by the collection JSON view.
        :return: jQuery DOM node to items container.
        :rtype: Object
    .. method:: get_collection_head()
    
        Return the rendered HTML of the widgets header.
    
        :return: HTML ready to be included into the DOM.
        :rtype: string
    .. method:: reload()
    
        Reload the widget. Retrieve data from the server and render items in DOM.
    
        :return: The widget instance.
        :rtype: Object
    .. method:: render_form_actions()
    
        Render the form actions and bind a click handler to them.
    .. method:: render_item(item)
    
        Render an item into the DOM.
    
        :param Object item: An item as returned by the collection JSON view.
        :return: jQuery DOM node to the rendered item.
        :rtype: Object




