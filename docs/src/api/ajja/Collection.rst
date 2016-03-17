

Collection
==========

.. currentmodule:: ajja


.. js:class:: GroupListWidget (node_selector, options)

    Group items of a list by class written in data attributes.

    .. note::

        Each list item must provide ``data-{{self.group_by_key}}`` and
        ``data-{{self.group_title_key}}``. Those are needed to decide, in
        which group the item is placed and what title that group will get.

    :extends: :js:class:`ListWidget`
    :param string node_selector: The selector of the DOM node where the widget should be rendered.
    :param Object options: An object containing options for the widget.
    :param Array options.group_by_key: By which data-key are items grouped.
    :param Array options.group_title_key: Specify what key leads to the title of the group.
    :param string options.[collection_url]: The url to a JSON View returning the data for the collection.
    :param Object options.[form_options]: An object containing options for the edit :js:class:`Form` as described under :js:func:`load`.
    :param Array options.[item_actions]: Additional item_actions besides `edit` and `del`.
    :param Array options.[default_item_actions]: Set to an empty Array to hide `edit` and `del`.
    :param Array options.[form_actions]: Additional form_actions besides `add`.
    :param Array options.[default_form_actions]: Set to an empty list to hide `add`.
    :return: The widget instance.
    :rtype: Object
    
    .. code-block:: js
    
        $(body).append('<div id="my_list_widget"></div>');
        var list_widget = new ajja.GroupListWidget(
            '#my_list_widget',
            {collection_url: '/list.json'}
        );

    .. js:function:: get_collection(item)
    
        Return the container DOM node of item.
    
        .. note::
    
            The grouping is done here on the fly.
    
        :param Object item: An item as returned by the collection JSON view.
        :return: jQuery DOM node to items container.
        :rtype: Object



.. js:class:: ListWidget (node_selector, options)

    Turn any DOM elements matched by node_selector into ListWidgets.

    :extends: :js:class:`TemplateHandler`
    :param string node_selector: The selector of the DOM node where the widget should be rendered.
    :param Object options: An object containing options for the widget.
    :param string options.collection_url: The url to a JSON View returning the data for the collection.
    :param Object options.form_options: An object containing options for the edit :js:class:`Form` as described under :js:func:`load`.
    :param Array options.[item_actions]: Additional item_actions besides `edit` and `del`.
    :param Array options.[default_item_actions]: Set to an empty Array to hide `edit` and `del`.
    :param Array options.[form_actions]: Additional form_actions besides `add`.
    :param Array options.[default_form_actions]: Set to an empty list to hide `add`.
    :return: The widget instance.
    :rtype: Object
    
    .. code-block:: js
    
        $(body).append('<div id="my_list_widget"></div>');
        var list_widget = new ajja.ListWidget(
            '#my_list_widget',
            {collection_url: '/list.json'}
        );

    .. js:function:: add_item()
    
        Add an new item to the collection.
    .. js:function:: apply_item_actions(node)
    
        Bind a click handler to each action of the given item.
    
        .. note::
    
            The callback, that was specified in `item_actions`, is binded
            here.
    
        :param Object node: The jQuery DOM node of the item with the actions.
    .. js:function:: close_object_edit_form(ev, object_form, form_dialog)
    
        Handler, that closes the edit form after save or cancel.
    
        :param Object ev: The close event.
        :param Object object_form: The :js:class:`Form` instance.
        :param Object form_dialog: The jQuery DOM node of the form.
    .. js:function:: del_item(node)
    
        Delete an item from the collection.
    
        :param Object node: The jQuery DOM node of the item     to be deleted.
    .. js:function:: edit_item(node)
    
        Render an edit :js:class:`Form()` and provide it to the user.
    
        .. note::
    
            The {FormOptions} object provided on initialization of the
            ListWidget is used to render the form.
    
        .. note::
    
            Only fields with a label (provided in {FormOptions}) are
            rendered in this form.
    
        :param Object node: The jQuery DOM node pointing to the item.
    .. js:function:: get_collection(item)
    
        Return the container DOM node of item.
    
        :param Object item: An item as returned by the collection JSON view.
        :return: jQuery DOM node to items container.
        :rtype: Object
    .. js:function:: get_collection_head(items)
    
        Return the rendered HTML of the widgets header.
    
        :param Array items: The items as returned by the collection JSON view.
        :return: HTML ready to be included into the DOM.
        :rtype: string
    .. js:function:: reload()
    
        Reload the widget. Retrieve data from the server and render items in DOM.
    
        :return: The widget instance.
        :rtype: Object
    .. js:function:: render(items)
    
        Render items in the DOM.
    
        :param Array items: The items as returned by the collection JSON view.
        :rtype: eval
    .. js:function:: render_form_actions()
    
        Render the form actions and bind a click handler to them.
    .. js:function:: render_item(item)
    
        Render an item into the DOM.
    
        :param Object item: An item as returned by the collection JSON view.
        :return: jQuery DOM node to the rendered item.
        :rtype: Object
    .. js:function:: render_item_content(node)
    
        Render the content of an item (the part next to the actions in DOM).
    
        :param Object node: The jQuery DOM node pointing to the item.



.. js:class:: TableWidget (node_selector, options)

    Show list of items in a table.

    :extends: :js:class:`ListWidget`
    :param string node_selector: The selector of the DOM node where the widget should be rendered.
    :param Object options: An object containing options for the widget.
    :param string options.collection_url: The url to a JSON View returning the data for the collection.
    :param Object options.form_options: An object containing options for the edit :js:class:`Form` as described under :js:func:`load`.
    :param Array options.[omit]: Specifiy attributes taht should not be rendered as columns in the table.
    :param Array options.[item_actions]: Additional item_actions besides `edit` and `del`.
    :param Array options.[default_item_actions]: Set to an empty Array to hide `edit` and `del`.
    :param Array options.[form_actions]: Additional form_actions besides `add`.
    :param Array options.[default_form_actions]: Set to an empty list to hide `add`.
    :return: The widget instance.
    :rtype: Object
    
    .. code-block:: js
    
        $(body).append('<div id="my_list_widget"></div>');
        var list_widget = new ajja.TableWidget(
            '#my_list_widget',
            {collection_url: '/list.json'}
        );

    .. js:function:: get_collection_head(items)
    
        Return the rendered HTML of the widgets header.
    
        .. note::
    
            Only fields with a label (provided in {FormOptions}) are
            returned as columns of the table.
    
        :param Array items: The items as returned by the collection JSON view.
        :return: HTML ready to be included into the DOM.
        :rtype: string
    .. js:function:: render_item(item)
    
        Render an item into the DOM as a table row.
    
        :param Object item: An item as returned by the collection JSON view.
        :return: jQuery DOM node to the rendered item.
        :rtype: Object
    .. js:function:: translate_boolean_cells(node)
    
        Render boolean cells as proper glyphicons.
    
        :param Object node: The jQuery DOM node pointing to the table row.




