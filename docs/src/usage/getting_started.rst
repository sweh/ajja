***************
Getting started
***************

All you need to start creating forms is::

    $(body).append('<div id="replace_this_with_my_form"></div>');

    var my_form = new gocept.jsform.Form('replace_this_with_my_form');
    my_form.load('/form_data.json');


This will inject the form in the container with the id ``replace_this_with_my_form``, load the form data via *ajax* from the url
``form_data.json`` and create input fields according to the content of ``form_data.json``.

``form.load()`` accepts JavaScript objects as data or a url (like in the
example above). It then guesses, which field widget to load by means of the
datatype of your field::

    my_form.load(
        {firstName: '', // will result in a input field with type="text"
         title: [{id: 'mr', value: 'Mister'},
                 {id: 'mrs', value: 'Miss', selected: true}], // will result in a select box
         needs_glasses: false}); // will result in a checkbox

`gocept.jsform` comes with basic templates for these three use cases. Of cource
you can provide your own templates for either the form or the fields itself.
