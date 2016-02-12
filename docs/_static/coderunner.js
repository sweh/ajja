/*global jQuery, document, gocept */
/*jslint nomen: true, unparam: true, bitwise: true*/

(function ($) {
    "use strict";

    var run, register_click_event;

    run = function (event) {
        $('#form').remove();
        var button = $(event.currentTarget),
            code_block = button.prev();
        button.after('<div id="form"></div>');
        eval(code_block.text());
    };

    register_click_event = function (node) {
        var button, clear;
        button = $('<button class="btn btn-neutral coderunner">Run</button>');
        clear = $('<span class="clearboth"></span>');
        node.after(button);
        button.after(clear);
        button.click(run);

    };

    $(document).ready(function () {
        // Mock AJAX calls by gocept.jsform.Form
        gocept.jsform.Form.prototype.reload = function () {
            var self = this;
            setTimeout(function () {
                self.finish_load({"title": "", "description": ""});
            }, 0);
        };
        gocept.jsform.Form.prototype._save = function (id, save_url, save_type, data) {
            var deferred_save = $.Deferred(), apply_response;
            apply_response = function () {
                deferred_save.resolve({status: 'success'});
            };
            setTimeout(apply_response, 0);
            return deferred_save.promise();
        };

        $.each(
            $('.highlight-javascript').add($('.highlight-js')),
            function (index, node) {
                register_click_event($(node));
            }
        );
    });
}(jQuery));
