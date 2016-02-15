

Helpers
=======

.. currentmodule:: gocept.jsform

.. js:function:: gocept.jsform.declare_namespace(value)

    Helper to declare namespaces (e.g. `gocept.jsform`).

    :param string value:
    
    .. code-block:: js
    
        gocept.jsform.declare_namespace('gocept.jsform');
        gocept.jsform.foo = 'bar';
.. js:function:: gocept.jsform.isUndefinedOrNull(value)

    Check whether value is undefined or null.

    :param * value:
    :rtype: boolean
    
    .. code-block:: js
    
        gocept.jsform.isUndefinedOrNull('foo');
.. js:function:: gocept.jsform.or(value1, value2)

    Simple OR function. Returns ``value1`` if its defined else ``value2``.

    :param * value1:
    :param * value2:
    :return: value1 or value2
    :rtype: *
    
    .. code-block:: js
    
        gocept.jsform.or(null, 'asdf');


