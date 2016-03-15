/*global jQuery, document, gocept */
/*jslint nomen: true, unparam: true, bitwise: true*/

(function ($) {
    "use strict";

    var run, register_click_event;

    run = function (event) {
        $('#form').remove();
        $('#my_collection').remove();
        var button = $(event.currentTarget),
            code_block = button.prev();
        button.after('<div id="form"></div>');
        button.after('<div id="my_collection"></div>');
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
        var messages = {
            'message/0': {title: 'Schedule', 'description': 'Next week is getting important!'},
            'message/1': {title: 'Meeting update', 'description': 'Things changed for tomorrow'},
        };
        // Mock AJAX calls by gocept.jsform.Form
        gocept.jsform.Form.prototype.reload = function () {
            var self = this;
            setTimeout(function () {
                self.finish_load({"title": "", "description": ""});
            }, 0);
        };
        gocept.jsform.Form.prototype._save = function (id, save_url, save_type, data) {
            data = JSON.parse(data);
            if (data.hasOwnProperty('title')) {
                messages[save_url].title = data.title;
            }
            if (data.hasOwnProperty('description')) {
                messages[save_url].description = data.description;
            }
            var deferred_save = $.Deferred(), apply_response;
            apply_response = function () {
                deferred_save.resolve({status: 'success'});
            };
            setTimeout(apply_response, 0);
            return deferred_save.promise();
        };
        gocept.jsform.ListWidget.prototype.reload = function () {
            var self = this,
                result = [];
            $.each(messages, function (key, value) {
                //id = id.toString();
                result.push({resource: key, data: value});
            });
            self.render(result);
        };

        gocept.jsform.ListWidget.prototype.del_item = function (node) {
            delete messages[node.data('resource')];
            node.remove();
        };

        // Add run button to each JavaScript code block
        $.each(
            $('.highlight-javascript').add($('.highlight-js')),
            function (index, node) {
                // Skip code blocks without ID, i.e. have no reference label
                // (This way we can define which code blocks are executable)
                if (node.id.length) {
                    register_click_event($(node));
                }
            }
        );
    });
}(jQuery));
