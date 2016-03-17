

Helpers
=======

.. currentmodule:: ajja

.. js:function:: ajja.declare_namespace(value)

    Helper to declare namespaces (e.g. `ajja`).

    :param string value: The namespace to be declared.
    
    .. code-block:: js
    
        ajja.declare_namespace('ajja');
        ajja.foo = 'bar';
.. js:function:: ajja.isUndefinedOrNull(value)

    Check whether value is undefined or null.

    :param * value: A value.
    :rtype: boolean
    
    .. code-block:: js
    
        ajja.isUndefinedOrNull('foo');
.. js:function:: ajja.or(value1, value2)

    Simple OR function. Returns ``value1`` if its defined else ``value2``.

    :param * value1: A value.
    :param * value2: A value.
    :return: value1 or value2
    :rtype: *
    
    .. code-block:: js
    
        ajja.or(null, 'asdf');


