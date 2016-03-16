===============
Server protocol
===============

Communication between server and client consists of asynchronous calls to load
and save data. The server is expected to provide a RESTful interface using
resource-oriented URLs that can be accessed by HTTP methods GET, POST, PUT and
DELETE, respectively. Data serialisation for transport uses the JSON format.


Loading data
============

Data can be loaded in one of two ways: by requesting it from the resource URL,
or by passing it as an argument to the form object upon initialisation.

Either way, the data format is a mapping of field names to values. Values may
be any data type known to the JSON format, or appropriate serialisations that
can be JSON-encoded, see :ref:`the explanation of datatypes
<datatypes-autorecognition>`. If the form object is initialised with a URL
instead of a field-value mapping, an XHR GET request is sent to the URL and
the full response is expected to be the JSON-encoded field-value mapping:

.. code-block:: javascript

    {firstname: "Jack", lastname: "", send_notifications: true, messages: 0}


Storing changes
===============

Request
-------

With the current client implementation, each field will send its own value to
the server separately after it lost focus. To do so, a JSON-encoded mapping of
field name to value (or an appropriate representation thereof) is sent to the
resource URL by an XHR POST request:

.. code-block:: javascript

    {firstname: "John"}

In fact, this is an instance where the current implementation doesn't strictly
assume a RESTful URL layout; there may be different URLs for loading and
saving form data. The URL for saving is specified by the ``save_url`` form
option; if the form object was initialised with a load URL instead of initial
data, the ``save_url`` option may be omitted and will default to the load URL.
The latter special case of a single resource URL does imply a RESTful server.

Since the request body contains a mapping from field name to value, this
allows for more than one field value to be stored at the same time. While the
stock implementation doesn't store the value of more than one field through
the same request, custom widgets may do so; also, a CSRF token may be sent
along under a configurable name. A server implementation must assume any
number of fields to be sent within one save request.

Response
--------

The HTTP response code may be 200 if everything went fine technically (even
though validation errors may have occurred), or some error code if a server or
connection error occurred. In that case, a notification is displayed to the
user and the save request is queued to be retried later.

The body of a response with status 200 must be a JSON-encoded mapping that
contains at least a status flag, signifying whether validation succeeded. Upon
success, the minimal body should read:

.. code-block:: javascript

    {status: "success"}

In the case of validation errors, the response is expected to convey an error
message suitable to present to the user, e.g.

.. code-block:: javascript

    {status: "error", msg: "Not a valid email address"}

The error message will be displayed by the widget that initiated the save
request.

.. _protocol-updating-sources:

Updating sources
----------------

Furthermore, the response body for a successful save request may contain
updated sources for object fields within the same form. This is to help with
interdependent widgets where the value of a field determines the set of
possible choices of one or more dependent fields.

If a saved value results in updates to any sources for other fields within the
form, the response body contains another key ``sources`` whose value is a
mapping from field names to new source values. Source values have the same
format (lists of objects having a token and title) as when :ref:`configuring
them statically through the form options <datatypes-sources>`:

.. code-block:: javascript

    {status: "success",
     sources: {subcategories: [
         {token: "sub-a1", title: "Subcategory A.1"},
         {token: "sub-a2", title: "Subcategory A.2"}
     ]}
    }


Collections
===========

XXX to be done
