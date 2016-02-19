===============
Server protocol
===============

Storing changes
===============

On every change, a mapping of field names to new field values is pushed to the
`save_url` (by default the same url the form was loaded from). While most of
the time only one field will save its value after it lost focus, it is
possible to save the whole form at once, or generally, a subset of fields.

The server must validate the saved data. If saving succeeded, it is expected
to return ``{status: 'success'}``, if there was a (validation) error, an error
status and message is returned, e.g.
``{status: 'error', msg: 'Not a valid email address'}``.
The error message will be displayed next to the widget.
