=========
Datatypes
=========

.. _datatypes-autorecognition:

The type of the input field is based on the data type of each attribute and
defaults to a simple text input for empty / null values. The following data
types are recognized out of the box:

string
    If the value for a field is a string, an input field of type `text` is
    rendered (Template-ID: `form_string`).
boolean
    If the value for a field is boolean, a an input field of type `checkbox` is
    rendered (Template-ID: `form_boolean`).
number
    If the value for a field is a number, an input field of type `number` is
    rendered (Template-ID: `form_number`).
object
    If the value for a field is an object, a selectbox is rendered. You will
    need to :ref:`define a source <datatypes-sources>` for this type as well.
    (Template-ID: `form_object`).

You can customize the templates that are rendered for you fields by
:ref:`providing a template for your field or overwriting the default
templates <customization-field-widgets>`.

.. _datatypes-sources:


Defining a source for objects
=============================

Primitive datatypes like strings or boolean values can be easily handeled with
the above auto recognition. For more complex types like objects you need to
define a source from which the rendered selectbox gets its values. Not all
values are submitted on field save but the token of the selected value and
values accordingly for multiselect. An example will demonstrate the behaviour.

.. _datatypes-source-example:

.. code-block:: javascript

    var form = new gocept.jsform.Form("form");
    form.load(
        {title: []},
        {save_url: 'message/1',
         title: {
            label: "Title",
            source: [{token: 'mr', title: 'Mr.'},
                     {token: 'mrs', title: 'Mrs.'}]}});

Its also possible to define a multiselect field. Just pass the attribute
`multiple` to the fields options.

.. _datatypes-source-multiple-example:

.. code-block:: javascript

    var form = new gocept.jsform.Form("form");
    form.load(
        {title: []},
        {save_url: 'message/1',
         title: {
            label: "Title",
            source: [{token: 'mr', title: 'Mr.'},
                     {token: 'mrs', title: 'Mrs.'}],
            multiple: true}});


Rendering a Yes/No template for boolean fields
==============================================

By default, a boolean field is rendered as a checkbox. A selected checkbox
represends the value true, a not selected one the value false. By using an
object template one can get a boolean field which has two radio buttons for
Yes and No (or whatever you want to expess with the field).

.. _datatypes-yesno-example:

.. code-block:: javascript

    var form = new gocept.jsform.Form("form"),
        source = [{token: 'true', title: 'Yes'},
                  {token: 'false', title: 'No'}];
    form.load(
        {sent: 'false'},
        {save_url: 'message/1',
         sent: {
            label: "Was the message sent already?",
            source: source,
            template: 'form_radio_list'}});
