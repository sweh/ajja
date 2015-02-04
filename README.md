==============================
The gocept.jsform distribution
==============================

JavaScript library for simple creation of forms in your clients browser. It
just needs a JSON datastructure and creates a form with auto saving fields
from it.

Uses *knockout* for data-binding, *handlebars* for templating and *jquery*
for DOM manipulation and ajax calls.


Package contents
================

The package contains the following files, which you should include by hand if
you are *not* using bower:

* *ko.mapping.js*
* *helpers.js*
* *jsform.js*

Also, there are some widget templates, named ``gocept_jsform_templates_*.pt``.
You'll have to include those you need as scripts of type ``text/html`` with an
appropriate id, for example::

    <script type="text/html" id="gocept_jsform_templates_form">
      <form method="POST" action="{{action}}" id="{{form_id}}">
      </form>
    </script>

where the lines between the ``script`` tags are the content of the respective
template file.


Usage
=====

All you need to start creating forms is::

    <div id="replace_this_with_my_form"></div>

    <script type="text/javascript">
      var my_form = new gocept.jsform.Form('replace_this_with_my_form');
      my_form.load('/form_data.json');
    </script>

This will inject the form in the container with the id
``replace_this_with_my_form``, load the form data via *ajax* from the url
``form_data.json`` and create input fields according to the content of
``form_data.json``.

``form.load()`` accepts javascript objects as data or a url (like in the
example above). It then guesses, which field widget to load by means of the
datatype of your field::

    my_form.load(
        {firstName: '', // will result in a input field with type="text"
         title: [{id: 'mr', value: 'Mister'},
                 {id: 'mrs', value: 'Miss', selected: true}], // will result in a select box
         needs_glasses: false}); // will result in a checkbox

*gocept.jsform* comes with basic templates for these three use cases. Of cource
you can provide your own templates for either the form or the fields itself.
Please refer to the customization section for further information.


Customization
=============

There are various options which can be passed to customize the HTML output and
the behaviour of *gocept.jsform*.


Providing a save url for the server
-----------------------------------

The great thing about *gocept.jsform* is, that it automatically pushes changes
in your form fields to the server. For that to work you need to specify a url
where *gocept.jsform* should propagate changes to::

    var form = new gocept.jsform.Form('my_form', {save_url: '/save.json'});

On every change, the following information is pushed to that url:

* ``id``: the name of the field (e.g. *firstname*)
* ``value``: the new value for that field (e.g. *Bob*)

The server should now validate the given data. If saving went fine, it must
return ``{status: 'success'}``, if there was a (validation-) error, it must
return e.g. ``{status: 'error', msg: 'Not a valid email address'}``. The error
will then be displayed next to the widget.


Customizing the form template
-----------------------------

The default behaviour is to simply append every new field in the form tag. If
you would like to customize the order of your fields or just need another
boilerplate for you form, you can use a custom form template with containers
for all or just some of the fields::

    var template = 
      ['<form method="POST" action="{{action}}" id="{{form_id}}">',
       '<table><tr><td class="firstname"><span id="firstname" /></td>',
       '<td class="lastname"><span id="lastname" /></td></tr></table>',
       '</form>'].join('');

    var form = new gocept.jsform.Form('my_form', {form_template: template});
    form.load({firstname: 'Max', lastname: 'Mustermann'});

This will replace the ``span`` containers with id ``firstname`` and
``lastname`` with the appropriate ``input`` fields.


Customizing field widgets
-------------------------

You can either customize widgets by their type (e.g. all fields rendered for
strings) or customize single widgets by their name.

*Customization by field type*

You can overwrite the default templates by providing your own templates in the
options dict passed during form initialization::

    var form = new gocept.jsform.Form(
      'my_form', {string_template: my_input_template,
                  object_template: my_select_template,
                  boolean_template: my_checkbox_template});

For every string data, your input template would be rendered instead of the
default input text field. Same for lists and boolean values.

*Customization by field name*

Imagine you want checkboxes instead of a select field::

    var template =
      ['<div class="title">Titel:',
       '{#each value}',
       '  <div>',
       '    <input type="radio" name="{{name}}" value="{{id}}" class="{{id}}"',
       '           data-bind="checked: {{name}}" /> {{value}}',
       '  </div>',
       '{/each}',
       '</div>'].join('');

    var form = new gocept.jsform.Form('my_form');
    form.load({title: [{id: 'mr', value: 'Mr.'},
                       {id: 'mrs', value: 'Mrs.'}]},
              {title: {template: template}});

You can pass the *load* method a JS object containing customizations for each
field. One of these customization options is template, which results in
rendering two checkboxes instead of the default select box in the above
example.

You can also specify a label or other options for the fields::

    var template =
      ['{{label}}: <input type="text" name="{{name}}" value="{{default}}"',
       '                  data-bind="value: {{name}}" {{readonly}} />'].join('');

    var form = new gocept.jsform.Form('my_form');
    form.load({firstname: 'Sebastian'},
              {firstname: {template: template,
                           label: 'First name',
                           default: 'Max'}});
