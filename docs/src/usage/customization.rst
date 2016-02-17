=============
Customization
=============

There are various options which can be passed to customize the HTML output and
the behaviour of *gocept.jsform*.


Providing a save url for the server
===================================

The great thing about *gocept.jsform* is, that it automatically pushes changes
in your form fields to the server. For that to work you need to specify a url
where *gocept.jsform* should propagate changes to::

    var form = new gocept.jsform.Form('form', {save_url: '/save.json'});

On every change, the following information is pushed to that url:

* ``id``: the name of the field (e.g. *firstname*)
* ``value``: the new value for that field (e.g. *Bob*)

The server should now validate the given data. If saving went fine, it must
return ``{status: 'success'}``, if there was a (validation-) error, it must
return e.g. ``{status: 'error', msg: 'Not a valid email address'}``. The error
will then be displayed next to the widget.


Customizing the form template
=============================

The default behaviour is to simply append every new field in the form tag. If
you would like to customize the order of your fields or just need another
boilerplate for you form, you can use a custom form template with containers
for all or just some of the fields::

    gocept.jsform.register_template(
      'form',
      ['<form method="POST" action="{{action}}" id="{{form_id}}">',
       '<table><tr><td class="firstname"><span id="firstname" /></td>',
       '<td class="lastname"><span id="lastname" /></td></tr></table>',
       '</form>'].join('')
    );

    var form = new gocept.jsform.Form('form');
    form.load({firstname: 'Max', lastname: 'Mustermann'});

This will replace the ``span`` containers with id ``firstname`` and
``lastname`` with the appropriate ``input`` fields.


Customizing field widgets
=========================

You can either customize widgets by their type (e.g. all fields rendered for
strings) or customize single widgets by their name.

Customization by field type
---------------------------

You can overwrite the default templates by providing your own templates in the
options dict passed during form initialization::

    gocept.jsform.register_template('form_boolean', '<bool_template_html />');
    gocept.jsform.register_template('form_string', '<string_template_html />');
    var form = new gocept.jsform.Form('form');

For every string data, your input template would be rendered instead of the
default input text field. Same for lists and boolean values.

Customization by field name
---------------------------

Imagine you want checkboxes instead of a select field::

    gocept.jsform.register_template(
        'checkbox_template',
        ['<div class="title">Titel:',
         '{#each value}',
         '  <div>',
         '    <input type="radio" name="{{name}}" value="{{id}}" class="{{id}}"',
         '           data-bind="checked: {{name}}" /> {{value}}',
         '  </div>',
         '{/each}',
         '</div>'].join('')
    );

    var form = new gocept.jsform.Form('form');
    form.load({title: [{id: 'mr', value: 'Mr.'},
                       {id: 'mrs', value: 'Mrs.'}]},
              {title: {template: 'checkbox_template'}});

You can pass the *load* method a JS object containing customizations for each
field. One of these customization options is template, which results in
rendering two checkboxes instead of the default select box in the above
example.

You can also specify a label or other options for the fields::

    gocept.jsform.register_template(
        'form_string_special',
        ['{{label}}: <input type="text" name="{{name}}" value="{{default}}"',
         '                  data-bind="value: {{name}}" {{readonly}} />'].join('')
    );

    var form = new gocept.jsform.Form('form');
    form.load({firstname: 'Sebastian'},
              {firstname: {template: 'form_string_special',
                           label: 'First name',
                           default: 'Max'}});


Backlog of Mind
===============

Alternative: Save-URL but no Load-URL (prefill directly when calling ``load``)

    form.load(
        {firstName: '', // will result in a input field with type="text"
         title: [{id: 'mr', value: 'Mister'},
                 {id: 'mrs', value: 'Miss', selected: true}], // will result in a select box
         needs_glasses: false}); // will result in a checkbox

Customization: Adding custom templates (overwriting default / additional templates)
