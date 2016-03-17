=============
Customization
=============

There are various options which can be passed to customize the HTML output and
the behaviour of *ajja*.


.. _customization-save_url:

Providing a save url for the server
===================================

One great feature of *ajja* is that it automatically pushes changes
in your form fields to the server. By default, changes are sent to the same
url that form data was loaded from. You can also specify a separate url to
save to::

    var form = new ajja.Form('form', {save_url: '/save.json'});

The server end point at ``save_url`` is expected to implement
:doc:`ajja's communication protocol <protocol>`.


.. _customization-form_template:

Customizing the form template
=============================

The default behaviour is to simply append every new field as a child to the
form tag. If you need to customize the order of your fields or just need
different overall HTML for your form, you can use a custom form template with
containers for all or just some of the fields:

.. _code-customization-form-template:

.. code-block:: javascript

    ajja.register_template(
      'form',
      ['<form method="POST" action="{{action}}" id="{{form_id}}" class="ajja form-horizontal">',
       '  <div class="statusarea"></div>',
       '  <table><tr><td><span id="field-firstname" /></td>',
       '  <td><span id="field-lastname" /></td></tr></table>',
       '</form>'].join('')
    );

    var form = new ajja.Form('form');
    form.load({firstname: 'Max', lastname: 'Mustermann'});

This will replace the ``span`` containers with ids ``firstname`` and
``lastname`` with the appropriate ``input`` fields.


.. _customization-csrf-token:

CSRF token
==========

In order to prevent `Cross-site request forgery (CSRF) <https://en.wikipedia.org/wiki/Cross-site_request_forgery>`_,
`ajja` can handle CSRF tokens and always submit them with every save
request. The token needs to be generated on the server and injected into the
DOM in a hidden input field with the id ``csrf_token``.

.. code-block:: html

    <input type="hidden" id="csrf_token" value="secure-random" />
    <div id="form"></div>


The token will be sent with every request under the key ``csrf_token``.


.. _customization-field-widgets:

Customizing field widgets
=========================

You can either customize widgets by their type (e.g. all fields rendered for
strings) or customize single widgets by their name.

Customization by field type
---------------------------

You can overwrite the default templates by registering your own templates
prior to form initialization:

.. code-block:: javascript

    ajja.register_template('form_boolean', '<bool_template_html />');
    ajja.register_template('form_string', '<string_template_html />');
    var form = new ajja.Form('form');

For every string value, your input template would be rendered instead of the
default input text field. Same for lists and boolean values.


Customization by field name
---------------------------

Imagine you want checkboxes instead of a select field. You can use the
`form_radio_list` template for that purpose:

.. _code-customization-checkbox-select:

.. code-block:: javascript

    var form = new ajja.Form('form');
    form.load({kind: ''},
              {kind: {source: [
                          {token: 'dog', title: 'Dog'},
                          {token: 'cat', title: 'Cat'},
                          {token: 'mouse', title: 'Mouse'}],
                      label: 'What kind of animal do you love?',
                      template: 'form_radio_list'}});

You can pass the *load* method a JS object containing customizations for each
field. One of these customization options is the name of the registered
template, which results in rendering two checkboxes instead of the default
select box.


Rendering readonly widgets
--------------------------

If you need to make a field widget immutable, you can pass it the `disabled`
flag in the options:

.. _code-customization-readonly:

.. code-block:: javascript

    var form = new ajja.Form('form');
    form.load({kind: 'Immutable'},
              {kind: {label: 'Immutable text',
                      disabled: true}});

Its possible to render the whole form with immutable fields, too:


.. _code-customization-readonly-form:

.. code-block:: javascript

    var form = new ajja.Form('form', {disabled: true});
    form.load({name: 'John Doe', gender: 'male'},
              {name: {label: 'Name'},
              gender: {label: 'Gender',
                        'source': [{token: 'unknown', title: 'Not specified'},
                                   {token: 'male', title: 'Male'},
                                   {token: 'female', title: 'Female'}]}});
