===========
Quick Start
===========

The following examples assume that there is a ``Message`` model on the server
with ``title`` and ``description``. We further assume that the model is
available via a REST API, therefore ``GET`` on ``message/id`` returns the
current state in JSON, while ``POST`` on ``message/id`` accepts JSON to update
the model.

Side Note: Your models should have no required fields, since any user input is
pushed to the server instantly for saving, i.e. some fields may be empty. This
also means that `gocept.jsform` only supports editing, not creation of model
objects, i.e. an empty instance must be created prior to editing.


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
