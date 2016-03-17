============
Introduction
============

.. _installation:

Installation
============

`ajja` comes with files ready to be delivered to the browser. There
is no need to browserify our code. It is, however, up to you to minify or
bundle the library in the course of your deployment workflow.


.. _installation-bower:

Installation via Bower (recommended)
------------------------------------

The recommended way to install `ajja` is via bower.

.. code-block:: bash

    bower install ajja


.. _installation-manual:

Manual installation
-------------------

If you prefer to include `ajja` by hand, please make sure to include
the files in the correct order. For the Javascript code, you can copy & paste
the following snipped.

.. code-block:: html

    <script type="text/javascript" src="src/helpers.js"></script>
    <script type="text/javascript" src="src/templates.js"></script>
    <script type="text/javascript" src="src/collection.js"></script>
    <script type="text/javascript" src="src/form.js"></script>

You will also need to include the libaries needed by `ajja`. They are
listed in the depencencies section in `bower.json`.


.. _installation-fanstatic:

Installation via Fanstatic
--------------------------

There is a fanstatic integration package available for your Python backend.
Install it via pip.

.. code-block:: bash

    pip install ajja

Then, include the resources in your View.

.. code-block:: python

    from ajja import form
    form.need()


Migration
=========


From 2.x to 3.0.0
-----------------

``ajja`` now only accepts *precompiled* templates generated via
``Handlebars.compile()``. So if you have custom templates that you used with
``ajja``, you now must wrap them into a ``Handlbars.compile()`` call.

Furthermore, to overwrite the standard templates, just add your compiled
templates to ``ajja.templates['<name_of_the_template>']`` or register
them with ``ajja.register_template('<name_of_the_template>', '<your_html')``
(available from version 3.0.1).

The built-in templates were renamed and the ``gocept_jsform_templates``
namespace was removed. Have a look inside the *templates* folder for the new
names.


From 1.x to 2.0.0
-----------------

We switched the template engine from ``jsontemplate`` to ``Handlebars``. So if
you have custom templates, make sure to rewrite them as ``Handlebars``
templates.
