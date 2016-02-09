***************
Migration guide
***************


From 2.x to 3.0.0
*****************

``gocept.jsform`` now only accepts *precompiled* templates generated via
``Handlebars.compile()``. So if you have custom templates that you used with
``gocept.jsform``, you now must wrap them into a ``Handlbars.compile()`` call.

Furthermore, to overwrite the standard templates, just add your compiled
templates to ``gocept.jsform.templates['<name_of_the_template>']`` or register
them with ``gocept.jsform.register_template('<name_of_the_template>', '<your_html')``
(available from version 3.0.1).

The built in templates were renamed. The ``gocept_jsform_templates`` namespace
was removed. Have a look in the *templates* folder for the new names.


From 1.x to 2.0.0
*****************

We switched the template engine from ``jsontemplate`` to ``Handlebars``. So if
you have custom templates, make sure to rewrite them to ``Handlebars``.


From 0.x to 1.0.0
*****************

Sorry, we are not providing any migration hints. :(
