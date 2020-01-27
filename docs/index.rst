.. ajja documentation master file, created by
   sphinx-quickstart on Tue Feb  9 12:48:09 2016.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

====
ajja
====


Advanced forms in JavaScript
============================

The latest stable version is |release|; you will find it at
`github <https://github.com/sweh/ajja>`_.

`ajja` is a MIT licensed library, written in JavaScript, to build
forms and collections from JSON data directly in the browser.

The name `ajja` is an Hebrew firstname and also abbreviates the basics of this
library: **aj**\ ax and **ja**\ vascript.


For most developers, building forms is a bothersome, boring and mostly
repeating task. `ajja` makes building forms flexible and almost fun.
It renders forms in the browser based on a simple JSON datastructure, using
advanced technology like
`HandlebarsJS <https://http://handlebarsjs.com/>`_ and
`KnockoutJS <http://knockoutjs.com>`_. Field
types may be inferred from the data you provide and form fields are saved
automatically to the server.

As a developer, all you have to do is include the sources (see
:ref:`installation`) and write some JavaScript code:

.. _code-introduction:

.. code-block:: javascript

    var form = new ajja.Form('form', {save_url: 'save'});
    form.load(
        {'firstname': 'Robert', 'is_child': true},
        {'firstname': {'label': 'Name'}, 'is_child': {'label': 'Child?'}}
    );



Contents
========

.. toctree::
    :maxdepth: 2

    introduction.rst
    src/usage/index.rst
    api.rst
    contributing.rst
    CHANGES.rst
