/*global jQuery, document */
/*jslint nomen: true, unparam: true, bitwise: true*/

(function ($) {
    "use strict";

    var run, register_click_event;

    run = function (event) {
        $('#my_form').remove();
        var button = $(event.currentTarget),
            code_block = button.prev();
        button.after('<div id="my_form"></div>');
        eval(code_block.text());
    };

    register_click_event = function (node) {
        var button = $('<button class="btn btn-neutral coderunner">Run</button>');
        node.after(button);
        button.click(run);

    };

    $(document).ready(function () {
        $.each(
            $('.highlight-javascript').add($('.highlight-js')),
            function (index, node) {
                register_click_event($(node));
            }
        );
    });
}(jQuery));
