.. gocept.jsform documentation master file, created by
   sphinx-quickstart on Tue Feb  9 12:48:09 2016.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

=============
gocept.jsform
=============


Advanced forms in JavaScript
============================

The latest stable version is |release| - https://github.com/gocept/gocept.jsform

gocept.jsform is a MIT licensed library, written in JavaScript, to build forms
and collections from JSON data directly in the browser.

For most developers building forms is a bothersome, boring and most of the
time repeating task. gocept.jsform makes building forms flexible and bearable.
It renders forms in the browser using advanced technology like
`HandlebarsJS <https://http://handlebarsjs.com/>`_ or
`KnockoutJS <http://knockoutjs.com>`_ from a simple JSON datastructure. Field
types are guessed from the data you provide and form fields auto save to the
server.

As a developer all you have to do is include the sources (see :ref:`installation`)
and write some JavaScript code:

.. _code-introduction:

.. code-block:: javascript

    var form = new gocept.jsform.Form('form', {save_url: 'save'});
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
