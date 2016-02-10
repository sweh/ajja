************
Installation
************

`gocept.jsform` comes with files ready to be used in your browser. There is no
need to browserify our code. However its your task to minify or bundle this
library within your deployment workflow.


Installation via Bower (recommended)
************************************

The recommended way to install `gocept.jsform` is via bower.

.. code-block:: bash

    bower install gocept.jsform


Manual installation
*******************

If you prefere including `gocept.jsform` by hand, please make sure to include
the files in the correct order. You can copy & paste the following snipped.

.. code-block:: html

    <script type="text/javascript" src="src/helpers.js"></script>
    <script type="text/javascript" src="src/templates.js"></script>
    <script type="text/javascript" src="src/collection.js"></script>
    <script type="text/javascript" src="src/jsform.js"></script>

You will also need to include the libaries needed by `gocept.jsform`. Have a
look at the depencencies section in `bower.json` for details.


Installation via Fanstatic
**************************

There is a fanstatic integration package available for your Python backend.
Install it via pip.

.. code-block:: bash

    pip install gocept.jsform

then need the resources in your View.

.. code-block:: python

    from gocept.jsform import jsform
    jsform.need()
