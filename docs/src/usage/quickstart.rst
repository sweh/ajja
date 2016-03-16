===========
Quick Start
===========

The following examples assume that there is a ``Message`` model on the server
with ``title`` and ``description``. We further assume that the model is
accessible through a REST API where an HTTP ``GET`` request for a message's
URL, ``message/<id>``, returns JSON data representing the current values,
while an HTTP ``POST`` request for ``message/<id>`` accepts JSON data to
update the model.

*Note*: Field values will be sent to the server one by one as they are edited.
This means that if your model applies validation rules that consider multiple
fields at the same time, you need to be careful to provide useful default
values to make sure that any edits to form fields can be stored even if a
model object has just been created.


Rendering a Form
================

First install `gocept.jsform` via :ref:`bower <installation-bower>` (or
:ref:`fanstatic <installation-fanstatic>` or :ref:`manually
<installation-manual>`)

.. code-block:: bash

    bower install gocept.jsform

Add a placeholder inside your DOM

.. code-block:: html

    <div id="form"></div>

Initialize the form via `gocept.jsform` and load current state from server

.. _code-quickstart-without-options:

.. code-block:: javascript

    var form = new gocept.jsform.Form("form");
    form.load("message/1");

The response from the server should look like ``{"title": "", description:
""}`` and is analysed to create an input field for each attribute. The type of
the input field is based on the data type of each attribute and defaults to a
simple text input for empty / ``null`` values.

On ``load`` the placeholder will be replaced by the following HTML

.. code-block:: html

    <form method="POST" action id="form" class="jsform form-horizontal">
        <div class="statusarea"></div>
        <div class="field form-group" id="field-title">
            <label for="title" class="col-sm-3 control-label"></label>
            <div class="col-sm-9">
                <input type="text" data-bind="value: title" name="title" class="form-control" value />
            </div>
            <div class="col-sm-offset-3 col-sm-9">
                <div class="help-block error"></div>
            </div>
        </div>
        <div class="field form-group" id="field-desciption">
            <label for="desciption" class="col-sm-3 control-label"></label>
            <div class="col-sm-9">
                <input type="text" data-bind="value: desciption" name="desciption" class="form-control" value />
            </div>
            <div class="col-sm-offset-3 col-sm-9">
                <div class="help-block error"></div>
            </div>
        </div>
    </form>


Each input field contains a `Knockout <http://knockoutjs.com/>`_ binding via
``data-bind="value: {{name}}"`` to track changes. Those changes are pushed to
the server by a ``POST`` request to ``message/id`` on focus-out. There is
:doc:`a defined communication protocol <protocol>` that the server end point
at ``message/id`` needs to implement.


If server-side validations result in an error, a flash message will be
rendered inside ``<div class="statusarea"></div>``. If the response contained
a ``msg`` it will be displayed inside ``<div class="help-block error"></div>``
beneath the input field that was just saved.

As you can see the generated HTML contains CSS classes compatible with
`Bootstrap <http://getbootstrap.com/>`_, thus including the Bootstrap CSS is
enough to make this form look pretty.


Customizing form fields
-----------------------

If you want to display a label next to each input field, declare ``title`` as
required and to use a textarea for ``description``, you can call ``form.load``
with an additional options dict like

.. _code-quickstart-with-options:

.. code-block:: javascript

    var form = new gocept.jsform.Form("form")
    form.load("message/1", {
        title: {"label": "Title", "required": true},
        description: {"label": "Body", "template": "form_text"}
    });


Initializing form without AJAX request
--------------------------------------

Instead of loading data from an REST endpoint you can also provide the JSON
data directly to the ``load`` function

.. _code-quickstart-load-data-directly:

.. code-block:: javascript

    var form = new gocept.jsform.Form("form")
    form.load(
        {"title": "My brand new form", "description": ""},
        {
            title: {"label": "Title", "required": true},
            description: {"label": "Body", "template": "form_text"
        }
    });

Note, that you will need to provide a :ref:`save url <customization-save_url>`
in order to make the automatic pushes on field change work.


Rendering a Collection
======================

It is assumed, that you already :ref:`installed <installation>`
`gocept.jsform`.

.. _code-quickstart-collection-initialization:

Add a placeholder inside your DOM

.. code-block:: html

    <div id="my_collection"></div>

Initialize the collection (in this case a :js:class:`ListWidget`) and load
current state from server

.. _code-quickstart-initialize-list-widget:

.. code-block:: javascript

    var collection = new gocept.jsform.ListWidget(
        '#my_collection',
        {collection_url: '/messages.json',
         default_form_actions: [],
         form_options: {
            'title': {label: 'Title'},
            'description': {label: 'Body'}
    }});
    collection.reload();

The response from the server should look like

.. _quickstart-server-response-list-widget:

.. code-block:: json

    [
        {resource: 'message/1',
         data: {'title': 'The title', 'description': 'The description'},
        {resource: 'message/2',
         data: {'title': 'Another title', 'description': 'Another description'}
    ]

It is used to create a HTML list of items containing the values from the data
attribute.

On ``reload`` the placeholder will be replaced by the following HTML

.. code-block:: html

    <ul id="collection" class="list-group list-collection nav nav-stacked">
        <li id="item_" style="min-height: 50px;" class="list-group-item">
            <span class="actions btn-group badge">
                <a href="#" class="edit btn btn-default btn-xs" data-action="edit">
                    <span class="glyphicon glyphicon-edit"></span> Edit</a>
                <a href="#" class="del btn btn-default btn-xs" data-action="del">
                    <span class="glyphicon glyphicon-trash"></span> Delete</a>
            </span>
            <span class="content">
                <dl>
                    <dt>title</dt>
                    <dd>The title</dd>
                    <dt>description</dt>
                    <dd>The description</dd>
                </dl>
            </span>
        </li>
    </ul>
    <div id="form-actions">
        <a href="#" class="btn btn-default btn-sm add">
            <span class="glyphicon glyphicon-plus"></span> Add
        </a>
    </div>

Each item has two default actions: ``edit`` and ``delete``. The collection has
the default action ``add``. Add and edit both create a bootstrap modal dialog
containing a `gocept.jsform.Form` form.

As you can see the generated HTML contains CSS classes compatible with
`Bootstrap <http://getbootstrap.com/>`_, thus including the Bootstrap CSS is
enough to make this form look pretty.

The `form_options` argument can be used the same way as `options` for a
:js:class:`Form` to customize the look and behaviour of the form that is used
for adding and editing collection items.


Collection types
----------------

.. _quickstart-collection-listwidget:

ListWidget
**********

The :js:class:`ListWidget` renders items as HTML lists. List items are rendered
as HTML definition lists. Please refer to the section
:ref:`collection initialization <code-quickstart-collection-initialization>`
for details about the default list widget.

.. _quickstart-collection-grouplistwidget:

GroupListWidget
***************

The :js:class:`GroupListWidget` behaves similar to the
:ref:`ListWidget <quickstart-collection-listwidget>` except that it
groups items by a defined attribute.

.. _code-quickstart-initialize-grouplist-widget:

.. code-block:: javascript

    var collection = new gocept.jsform.GroupListWidget(
        '#my_collection',
        {group_by_key: 'title',
         group_title_key: 'title',
         collection_url: '/messages.json',
         default_form_actions: [],
         form_options: {
            'title': {label: 'Title'},
            'description': {label: 'Body'}
    }});
    collection.reload();

Groups are created dynamically and items sorted into those groups by
`group_by_key`. The title for the groups is taken from the attribute
`group_title_key`.

The server response is the same as for
:ref:`ListWidgets <quickstart-server-response-list-widget>`.

.. _quickstart-collection-tablewidget:

TableWidget
***********

The :js:class:`TableWidget` renders items in a HTML table.

.. _code-quickstart-initialize-table-widget:

.. code-block:: javascript

    var collection = new gocept.jsform.TableWidget(
        '#my_collection',
        {collection_url: '/messages.json',
         default_form_actions: [],
         form_options: {
            'title': {label: 'Title'},
            'description': {label: 'Body'}
    }});
    collection.reload();

The server response is the same as for
:ref:`ListWidgets <quickstart-server-response-list-widget>`.


.. _quickstart-collection-tenplate-customization:

Customizing the HTML output
---------------------------

It is possible to change the rendered HTML by overriding the default templates.
Please refere to :js:func:`gocept.jsform.register_template` for information
about how default templates are customized.

The following default templates are used by :ref:`ListWidgets <quickstart-collection-listwidget>`:

    list
        The main template for the list collection.

    list_item_wrapper
        Wrapper template for each item of the collection.

    list_item
        Template for the content of an item.

    list_item_action
        Template for an item action (edit, delete).

    list_item_edit
        Template for add or edit form (modal dialog) of an item.


:ref:`GroupListWidgets <quickstart-collection-grouplistwidget>` use these templates in addition:

    group
        The main template for the group collection.

    group_item
        Template for a group item. Contains one :ref:`ListWidgets <quickstart-collection-listwidget>`.


:ref:`TableWidgets <quickstart-collection-tablewidget>` just use these templates:

    table
        The main template for a table collection.

    table_head
        Template for head part of the table.

    table_row
        Template for a row of a table. Contains data and actions.

    list_item_edit
        The same template as for :ref:`ListWidgets <quickstart-collection-listwidget>`.
