/*global describe, document, $, gocept, jasmine, beforeEach, it, expect */
/*global waits, runs, waitsFor, afterEach, spyOn */
/*jslint nomen: true, unparam: true, bitwise: true*/

var alert = jasmine.createSpy();

describe("Form Plugin", function () {
    "use strict";
    var form, set_save_response;

    set_save_response = function (response, trigger) {
        /*
        Patch the AJAX call for saving a field. The substitute returns a Deferred
        that can be resolved or rejected by the given function to simulate an AJAX
        response or fault. The function is called either after a tiny delay to get
        asynchronicity or, if a trigger is given, when the trigger is resolved.
        */
        form._save = function (id, save_url, save_type, data) {
            var deferred_save = $.Deferred(), apply_response;
            apply_response = function () {
                response(deferred_save, id, $.parseJSON(data)[id]);
            };
            if (gocept.jsform.isUndefinedOrNull(trigger)) {
                setTimeout(apply_response, 1);
            } else {
                trigger.always(apply_response);
            }
            return deferred_save.promise();
        };
    };

    beforeEach(function () {
        form = new gocept.jsform.Form('my_form', {});
    });

    it("should throw an error when ID was not found", function () {
        expect(function () {new gocept.jsform.Form('foobar',  {})}).toThrow();
    });

    it("should inject a form tag into html", function () {
        form.load();
        expect(form.node).toBeDefined();
        expect(form.node).toEqual($('#my_form'));
        expect(form.node.get(0).tagName).toEqual('FORM');
    });

    it("can get a cusomized action url", function () {
        var options = {action: 'http://foo'};
        form = new gocept.jsform.Form('my_form', options);
        form.load();
        expect(form.node.attr('action')).toEqual('http://foo');
    });

    it("should inject a input field for text data", function () {
        form.load({firstname: 'Sebastian'});
        expect(form.model).toBeDefined();
        expect($('#my_form input').attr('type')).toEqual('text');
        expect($('#my_form input').attr('name')).toEqual('firstname');
        expect($('#my_form input').get(0).value).toEqual('Sebastian');
        expect(form.model.firstname()).toEqual('Sebastian');
    });

    it("should inject a select field for arrays", function () {
        form.load({title: []},
                  {title: {source: [{token: 'mr', title: 'Mr.'},
                                    {token: 'mrs', title: 'Mrs.'}]}});
        expect($('#my_form select').attr('name')).toEqual('title');
        expect($('#my_form select option').get(0).innerHTML).toEqual(
            'Select an item'
        );
        expect($('#my_form select option').get(1).innerHTML).toEqual('Mr.');
        expect($('#my_form select option').get(1).value).toEqual('mr');
        expect($('#my_form select option').get(2).innerHTML).toEqual('Mrs.');
        expect($('#my_form select option').get(2).value).toEqual('mrs');
        expect($('#my_form select option').length).toEqual(3);
    });

    it("should update field when after-save is called", function () {
        var source = [{token: 'mr', title: 'Mr.'},
                      {token: 'mrs', title: 'Mrs.'}];
        form.load({title: ''},
                  {title: {source: source}});
        $(form).trigger(
            'after-save',
            {'sources': {'title': [{token: 'foo', title: 'Foo'}]}}
        );
        waits(100);
        runs(function () {
            expect($('#my_form select option').get(1).value).toEqual('foo');
        });
    });

    it("should select all given options for a multi-select field", function () {
        var source = [{token: 'mr', title: 'Mr.'},
                      {token: 'mrs', title: 'Mrs.'}];
        form.load({title: ['mr', 'mrs']},
                  {title: {source: source,
                           multiple: true}});
        expect($('#my_form select option').get(1).selected).toEqual(true);
        expect($('#my_form select option').get(2).selected).toEqual(true);
    });

    it("should inject checkbox for bool data", function () {
        form.load({needs_glasses: false});
        expect($('#my_form input').attr('type')).toEqual('checkbox');
        expect($('#my_form input').get(0).name).toEqual('needs_glasses');
        expect(form.model.needs_glasses()).toEqual(false);
    });

    it("should put a label on a boolean field if so configured", function () {
        form.load({needs_glasses: false},
                  {needs_glasses: {label: 'Needs glasses'}});
        expect($('#my_form').text()).toMatch('Needs glasses');
    });

    it("should create number field for numbers", function () {
        form.load({visitors: 42});
        expect($('#my_form input').attr('type')).toEqual('number');
        expect($('#my_form input').get(0).name).toEqual('visitors');
        expect(form.model.visitors()).toEqual(42);
    });

    it("can render an template with multiple radio buttons", function () {
        var source = [{token: 'dog', title: 'Dog'},
                      {token: 'cat', title: 'Cat'},
                      {token: 'mouse', title: 'Mouse'}];
        form.load(
            {small_animal: 'mouse'},
            {small_animal: {source: source,
                            template: 'gocept_jsform_templates_radio_list'}}
        );
        expect($('#small_animal_dog').attr('type')).toEqual('radio');
        expect($('#small_animal_dog').prop('checked')).toEqual(false);
        expect($('#small_animal_cat').prop('checked')).toEqual(false);
        expect($('#small_animal_mouse').prop('checked')).toEqual(true);
    });

    it("template with source can also be used as yes/no template", function () {
        var source = [{token: 'true', title: 'Yes'},
                      {token: 'false', title: 'No'}];
        form.load(
            {needs_glasses: 'false'},
            {needs_glasses: {source: source,
                             template: 'gocept_jsform_templates_radio_list'}}
        );
        expect($('#needs_glasses_true').prop('checked')).toEqual(false);
        expect($('#needs_glasses_false').prop('checked')).toEqual(true);
    });

    it('assumes string type if a value is null', function () {
        var data = {foo: null, needs_glasses: false};
        form.load(data);
        expect($('#my_form input').get(0).type).toEqual('text');
    });

    it("can get its data from a url", function () {
        var loaded = false;
        $(form).on('after-load', function () { loaded = true; });
        runs(function () {
            form.load(
                '/fanstatic/gocept.jsform.tests/testdata.json',
                {title: {source: [
                    {token: 'mr', title: 'Mr.'},
                    {token: 'mrs', title: 'Mrs.'}
                ]}}
            );
        });
        waitsFor(function () { return loaded; }, 'form to be loaded', 1000);
        runs(function () {
            expect($('#my_form select option').get(1).innerHTML).toEqual('Mr.');
        });
    });

    it("should send an event after loading", function () {
        var event_called = false;
        $(form).on('after-load', function () { event_called = true; });
        form.load({});
        waitsFor(function () { return event_called; }, 'form to be loaded', 1000);
        runs(function () {
            expect(event_called).toEqual(true);
        });
    });

    it("should provide a deferred to check whether loading is done", function () {
        expect(form.loaded.state()).toEqual('pending');
        form.load({});
        waitsFor(
            function () { return form.loaded.state() === 'resolved'; },
            'form to be loaded',
            1000
        );
        runs(function () {
            expect(form.loaded.state()).toEqual('resolved');
        });
    });

    it("should send an event after saving", function () {
        var event_called = false;
        set_save_response(function (save) { save.resolve({status: 'success'}); });
        $(form).on('after-save', function () { event_called = true; });
        form.load({'foo': 'bar'});
        runs(function () {
            form.save('foo', null);
        });
        waits(100);
        runs(function () {
            expect(event_called).toEqual(true);
        });
    });

    it("should propagate the save message from server using a trigger", function () {
        var event_options = null;
        set_save_response(function (save) {
            save.resolve({status: 'success', validation: 'success'});
        });
        $(form).on('after-save', function (event, data) {
            event_options = data;
        });
        form.load({foo: ''});
        runs(function () {
            form.start_save('foo', 'bar');
        });
        waits(100);
        runs(function () {
            expect(event_options).toEqual(
                {status: 'success', validation: 'success'}
            );
        });
    });

    describe("Disabled field for", function () {

        it("all fields", function () {
            form = new gocept.jsform.Form('my_form', {disabled: true});
            form.load({firstname: 'Sebastian', text: 'asdf'},
                      {text: {template: 'gocept_jsform_templates_text'}});
            expect($('#my_form input').attr('disabled')).toEqual('disabled');
            expect($('#my_form textarea').attr('disabled')).toEqual('disabled');
        });

        it("input field", function () {
            form.load({firstname: 'Sebastian'},
                      {firstname: {disabled: true}});
            expect($('#my_form input').attr('disabled')).toEqual('disabled');
        });

        it("boolean field", function () {
            form.load({has_children: true},
                      {has_children: {disabled: true}});
            expect($('#my_form input').attr('disabled')).toEqual('disabled');
        });

        it("number field", function () {
            form.load({visitors: 1},
                      {visitors: {disabled: true}});
            expect($('#my_form input').attr('disabled')).toEqual('disabled');
        });

        it("textarea field", function () {
            form.load({text: 'asdf'},
                      {text: {disabled: true,
                              template: 'gocept_jsform_templates_text'}});
            expect($('#my_form textarea').attr('disabled')).toEqual('disabled');
        });

        it("select field", function () {
            var source = [{token: 'mr', title: 'Mr.'},
                          {token: 'mrs', title: 'Mrs.'}];
            form.load({title: 'mr'},
                      {title: {source: source,
                               disabled: true}});
            expect($('#my_form select').attr('disabled')).toEqual('disabled');
        });

        it("multiselect field", function () {
            var source = [{token: 'mr', title: 'Mr.'},
                          {token: 'mrs', title: 'Mrs.'}];
            form.load({title: ['mr']},
                      {title: {source: source,
                               disabled: true,
                               multiple: true}});
            expect($('#my_form select').attr('disabled')).toEqual('disabled');
        });
    });

    describe("Propagation to server", function () {

        beforeEach(function () {
            spyOn(form, "_save").andCallThrough();
        });

        afterEach(function () {
            expect(form._save).toHaveBeenCalled();
        });

        it("checkboxes", function () {
            form.load({needs_glasses: false});
            $('#my_form input').click();
        });

        it("select box saves token", function () {
            var source = [{token: 'mr', title: 'Mr.'},
                          {token: 'mrs', title: 'Mrs.'}];
            form.load({title: 'mr'},
                      {title: {source: source,
                               template: 'gocept_jsform_templates_object'}});
            $('#my_form select')[0].selectedIndex = 2;
            $('#my_form select').change();
            waits(100);
            expect(form._save).toHaveBeenCalledWith(
                'title',
                null,
                'POST',
                '{"title":"mrs"}'
            );
        });

        it("multi-select box saves tokens", function () {
            var source = [{token: 'mr', title: 'Mr.'},
                          {token: 'mrs', title: 'Mrs.'}];
            form.load({title: ['mr']},
                      {title: {source: source,
                               multiple: true}});
            $('#my_form select option')[2].selected = true;
            $('#my_form select').change();
            waits(100);
            expect(form._save).toHaveBeenCalledWith(
                'title',
                null,
                'POST',
                '{"title":["mr","mrs"]}'
            );
        });

        it("sends csrf token if available", function () {
            form.load({needs_glasses: false});
            $('#my_form').append(
                $('<input type="hidden" id="csrf_token" value="token" />')
            );
            $('#my_form input').click();
            waits(100);
            expect(form._save).toHaveBeenCalledWith(
                'needs_glasses',
                null,
                'POST',
                '{"needs_glasses":true,"csrf_token":"token"}'
            );
        });

    });

    describe("customized templates", function () {

        it("for the form", function () {
            var template;
            template = [
                '<form method="POST" action="{{action}}" id="{{form_id}}">',
                '  <table><tr><td class="firstname">',
                '    <span id="field-firstname" />',
                '  </td><td class="lastname">',
                '    <span id="field-lastname" />',
                '</td></tr></table></form>'].join('');

            form = new gocept.jsform.Form('my_form', {form_template: template});
            form.load({firstname: 'Max', lastname: 'Mustermann'});
            expect($('#my_form .firstname input').val()).toEqual('Max');
            expect($('#my_form .lastname input').val()).toEqual('Mustermann');
        });

        it("for a field type", function () {
            var template;
            template = [
                '<div class="label">{{label}}</div>',
                '<div class="field">',
                '  <input type="radio" name="{{name}}" data-bind="checked: {{name}}" />',
                '</div>'].join('');

            form = new gocept.jsform.Form(
                'my_form',
                {boolean_template: template}
            );
            form.load({needs_glasses: false});
            expect($('#my_form input[type=checkbox]').length).toEqual(0);
            expect($('#my_form input[type=radio]').length).toEqual(1);
        });

        it("for a field explicitly", function () {
            var template, source;
            template = [
                '<div class="title">Titel: ',
                '  <div data-bind="foreach: __sources__.{{name}}">',
                '    <input type="radio" name="{{name}}"',
                '           data-bind="checked: $parent.{{name}}, text: $data.title,',
                '                      attr: {value: $data.token, class: $data.token}" />',
                '  </div>',
                '</div>'].join('');

            source = [{token: 'mr', title: 'Mr.'},
                      {token: 'mrs', title: 'Mrs.'}];
            form.load({title: 'mr'},
                      {title: {template: template, source: source}});
            spyOn(form, "save");
            $('#my_form .mrs').click().click();  // Not sure why one needs to
                                                 // trigger click twice here
            expect(form.save).toHaveBeenCalled();
        });
    });

    describe("required fields handling", function () {

        it("required field is marked after load but not as error", function () {
            spyOn(form, 'notify_field_error');
            form.load({name: 'John'}, {name: {required: true}});
            expect($('#my_form #field-name').hasClass('required')).toEqual(true);
            expect(form.notify_field_error).not.toHaveBeenCalled();
        });

        it("required fields work just fine when filled in", function () {
            var saved_id, saved_value;
            set_save_response(function (save, id, value) {
                saved_id = id;
                saved_value = value;
            });
            form.load({name: ''}, {name: {required: true}});
            runs(function () { $('#my_form input').val('John').change(); });
            waitsFor(function () {
                return saved_id === 'name' && saved_value === 'John';
            }, 100);
        });

        it("required fields are not saved if blank", function () {
            var save_finished = false;
            spyOn(form, '_save').andCallThrough();
            form.load({name: 'John'}, {name: {required: true}});
            runs(function () {
                $('#my_form input').val('').change();
                form.field('name').data('save').always(function () {
                    save_finished = true;
                });
            });
            waitsFor(function () { return save_finished; }, 100);
            runs(function () {
                expect(form.field('name').data('save').state()).toEqual('rejected');
                expect(form._save).not.toHaveBeenCalled();
                expect($('#my_form .error').text()).toEqual(
                    'This field is required but has no input.'
                );
            });
        });

    });

    it("validation errors are displayed and cleared at the widget", function () {
        set_save_response(function (save) {
            save.resolve({status: 'error', msg: 'Not a valid eMail address.'});
        });
        form.load({email: ''});
        runs(function () {
            $('#my_form input').val('max@mustermann').change();
        });
        waits(100);
        runs(function () {
            expect($('#my_form .error').text()).toEqual(
                'Not a valid eMail address.'
            );
        });
        runs(function () {
            set_save_response(function (save) {
                save.resolve({status: 'success'});
            });
            $('#my_form input').val('max@mustermann.example').change();
        });
        waits(100);
        runs(function () {
            expect($('#my_form .error').text()).toEqual('');
        });
    });

    it("renders field's label in the status area on validation error", function () {
        set_save_response(function (save) {
            save.resolve({status: 'error', msg: 'Not a valid eMail address.'});
        });
        form.load({email: ''}, {email: {'label': 'Your Mail-Address'}});
        runs(function () {
            $('#my_form input').val('max@mustermann').change();
        });
        waits(100);
        runs(function () {
            expect($('#my_form .statusarea .alert').text()).toEqual(
                'Your Mail-Address: Not a valid eMail address.'
            );
        });
    });

    it("renders no label in status area on validation error if not defined", function () {
        set_save_response(function (save) {
            save.resolve({status: 'error', msg: 'Not a valid eMail address.'});
        });
        form.load({email: ''});
        runs(function () {
            $('#my_form input').val('max@mustermann').change();
        });
        waits(100);
        runs(function () {
            expect($('#my_form .statusarea .alert').text()).toEqual(
                'Not a valid eMail address.'
            );
        });
    });

    it("unrecoverable error on non-conformant HTTP OK response while saving", function () {
        set_save_response(function (save) { save.resolve(''); });
        form.load({email: ''});

        var unrecoverable_error_triggered = false;
        $(form).on('unrecoverable-error', function () {
            unrecoverable_error_triggered = true;
        });

        runs(function () {
            $('#my_form input').val('max@mustermann').change();
        });
        waitsFor(function () { return unrecoverable_error_triggered; },
                 'unrecoverable-error to be triggered', 100);
        runs(function () {
            expect(form.start_save('foo', 'bar')).not.toBeDefined();
            expect(alert).toHaveBeenCalledWith(
                'An unrecoverable error has occurred: ' +
                    'Could not parse server response.'
            );
        });
    });

    it("unrecoverable error on HTTP error response while saving", function () {
        set_save_response(function (save) { save.reject(null, 'error', 'fubar'); });
        form.load({email: ''});

        var unrecoverable_error_triggered = false;
        $(form).on('unrecoverable-error', function () {
            unrecoverable_error_triggered = true;
        });

        runs(function () {
            $('#my_form input').val('max@mustermann').change();
        });
        waitsFor(function () { return unrecoverable_error_triggered; },
                 'unrecoverable-error to be triggered', 100);
        runs(function () {
            expect(form.start_save('foo', 'bar')).not.toBeDefined();
            expect(alert).toHaveBeenCalledWith(
                'An unrecoverable error has occurred: fubar'
            );
        });
    });

    it("unrecoverable error displays message of response if present", function () {
        set_save_response(function (save) {
            save.reject(
                {'responseJSON': {'message': 'Custom Error Message'}},
                'error',
                'Conflict'
            );
        });
        form.load({email: ''});

        var unrecoverable_error_triggered = false;
        $(form).on('unrecoverable-error', function () {
            unrecoverable_error_triggered = true;
        });

        runs(function () {
            $('#my_form input').val('max@mustermann').change();
        });
        waitsFor(function () { return unrecoverable_error_triggered; },
                 'unrecoverable-error to be triggered', 100);
        runs(function () {
            expect(form.start_save('foo', 'bar')).not.toBeDefined();
            expect(alert).toHaveBeenCalledWith(
                'An unrecoverable error has occurred: Custom Error Message'
            );
        });
    });

    it("retry saving after failed connection to server", function () {
        var trigger = $.Deferred(),
            server_error_notified = false,
            save_completed = false;
        form.load({email: ''});
        runs(function () {
            set_save_response(function (save) { save.reject(); }, trigger);
            $('#my_form input').val('max@mustermann.example').change();
            form.field('email').data('save').progress(function () {
                server_error_notified = true;
            }).always(function () {
                save_completed = true;
            });
            trigger.resolve();
        });
        waitsFor(function () { return server_error_notified; },
                 'server error to be notified', 100);
        runs(function () {
            expect($('#my_form .error').text()).toEqual(
                'This field contains unsaved changes.'
            );
            expect($('#my_form .statusarea .alert-danger').text()).toEqual(
                'This field contains unsaved changes.' +
                    'There was an error communicating with the server.'
            );
            set_save_response(function (save) { save.resolve({status: 'success'}); });
            form.retry();
        });
        waitsFor(function () { return save_completed; },
                 'field "email" to be saved successfully when retried', 100);
        runs(function () {
            expect(form.field('email').data('save').state()).toEqual('resolved');
            expect($('#my_form .error').text()).toEqual('');
            expect($('#my_form .statusarea .alert-danger').length).toEqual(0);
        });
    });

    it("retry saving triggered by successful connection to server", function () {
        var trigger = $.Deferred(),
            server_error_notified = false,
            save_completed = false;

        form.load({email: '', name: ''});
        runs(function () {
            set_save_response(function (save) { save.reject(); }, trigger);
            $('#field-email input').val('max@mustermann.example').change();
            form.field('email').data('save').progress(function () {
                server_error_notified = true;
            }).always(function () {
                save_completed = true;
            });
            trigger.resolve();
        });
        waitsFor(function () { return server_error_notified; },
                 'server error to be notified', 100);
        runs(function () {
            set_save_response(function (save) { save.resolve({status: 'success'}); });
            $('#field-name input').val('Max Mustermann').change();
        });
        waitsFor(function () { return save_completed; },
                 'field "email" to be saved successfully when retried', 100);
        runs(function () {
            expect(form.field('email').data('save').state()).toEqual('resolved');
        });
    });

    describe("save_remaining behaviour", function () {

        it("save_remaining saves fields that haven't been saved yet", function () {
            var saved_id,
                saved_value;
            set_save_response(function (save, id, value) {
                saved_id = id;
                saved_value = value;
                save.resolve({status: 'success'});
            });
            form.load({email: 'max@mustermann.example'});
            runs(function () {
                form.save_remaining();
            });
            waitsFor(function () {
                return (!gocept.jsform.isUndefinedOrNull(saved_id));
            }, "the remaining field to have been saved", 100);
            runs(function () {
                expect(saved_id).toEqual('email');
                expect(saved_value).toEqual('max@mustermann.example');
            });
        });

        it("save_remaining skips fields that have been saved", function () {
            var save_called = false;
            set_save_response(function (save) { save.resolve({status: 'success'}); });
            form.load({email: ''});
            $(form).on('after-save', function () { save_called = true; });
            runs(function () {
                $('#field-email input').val('max@mustermann.example').change();
            });
            waitsFor(function () { return save_called; },
                     "the email field to have been saved", 100);
            runs(function () {
                form.save = jasmine.createSpy();
                form.save_remaining();
                expect(form.save).not.toHaveBeenCalled();
            });
        });

        it("Supresses info messages of saving fields when saving remaining", function () {
            var saved_id;
            set_save_response(function (save, id, value) {
                saved_id = id;
                save.resolve({status: 'success'});
            });
            form.load({email: 'max@mustermann.example'});
            runs(function () {
                form.save_remaining();
            });
            waitsFor(function () {
                return (!gocept.jsform.isUndefinedOrNull(saved_id));
            }, "the remaining field to have been saved", 100);
            runs(function () {
                expect($('#my_form .statusarea .alert-success').length).toEqual(0);
            });
        });

    });

    describe("when_saved behaviour", function () {

        it("when_saved resolves if all fields are fine", function () {
            var promise;
            set_save_response(function (save) { save.resolve({status: 'success'}); });
            form.load({email: '', name: ''});
            runs(function () {
                $('#field-email input').val('max@mustermann.example').change();
            });
            waitsFor(function () {
                return form.field('email').data('save').state() !== 'pending';
            }, 'saving field "email"', 100);
            runs(function () {
                expect(form.field('email').data('save').state()).toEqual('resolved');
                promise = form.when_saved();
            });
            waitsFor(function () {
                return promise.state() !== 'pending';
            }, 'promise returned by when_saved()', 100);
            runs(function () {
                expect(promise.state()).toEqual('resolved');
            });
        });

        it("when_saved resolves after pending saves succeeded", function () {
            var trigger = $.Deferred(),
                promise;
            set_save_response(
                function (save) { save.resolve({status: 'success'}); },
                trigger
            );
            form.load({email: '', name: ''});
            runs(function () {
                $('#field-email input').val('max@mustermann.example').change();
                expect(form.field('email').data('save').state()).toEqual('pending');
                promise = form.when_saved();
                expect(promise.state()).toEqual('pending');
                trigger.resolve();
            });
            waitsFor(function () {
                return promise.state() !== 'pending';
            }, 'promise returned by when_saved()', 100);
            runs(function () {
                expect(form.field('email').data('save').state()).toEqual('resolved');
                expect(promise.state()).toEqual('resolved');
            });
        });

        it("when_saved rejects if any field is not fine", function () {
            var promise;
            set_save_response(function (save) { save.resolve({status: 'error'}); });
            form.load({email: '', name: ''});
            runs(function () {
                $('#field-email input').val('max@mustermann').change();
            });
            waitsFor(function () {
                return form.field('email').data('save').state() !== 'pending';
            }, 'saving field "email"', 100);
            runs(function () {
                expect(form.field('email').data('save').state()).toEqual('rejected');
                promise = form.when_saved();
            });
            waitsFor(function () {
                return promise.state() !== 'pending';
            }, 'promise returned by when_saved()', 100);
            runs(function () {
                expect(promise.state()).toEqual('rejected');
            });
        });

        it("when_saved rejects after any pending save failed", function () {
            var trigger = $.Deferred(),
                promise;
            set_save_response(
                function (save) { save.resolve({status: 'error'}); },
                trigger
            );
            form.load({email: '', name: ''});
            runs(function () {
                $('#field-email input').val('max@mustermann').change();
                expect(form.field('email').data('save').state()).toEqual('pending');
                promise = form.when_saved();
                expect(promise.state()).toEqual('pending');
                trigger.resolve();
            });
            waitsFor(function () {
                return promise.state() !== 'pending';
            }, 'promise returned by when_saved()', 100);
            runs(function () {
                expect(form.field('email').data('save').state()).toEqual('rejected');
                expect(promise.state()).toEqual('rejected');
            });
        });

        it("when_saved notifies server error if any field does", function () {
            var trigger = $.Deferred(),
                promise,
                server_error_notified = false;
            set_save_response(function (save) { save.reject(); }, trigger);
            form.load({email: ''});
            $('#field-email input').val('max@mustermann.example').change();
            promise = form.when_saved().progress(
                function () { server_error_notified = true; }
            );
            trigger.resolve();
            expect(server_error_notified).toEqual(true);
            expect(promise.state()).toEqual('pending');
        });

        it("when_saved doesn't notify past server errors", function () {
            var trigger = $.Deferred(),
                server_error_notified = false;
            set_save_response(function (save) { save.reject(); }, trigger);
            form.load({email: ''});
            $('#field-email input').val('max@mustermann.example').change();
            trigger.resolve();
            form.when_saved().progress(
                function () { server_error_notified = true; }
            );
            expect(server_error_notified).toEqual(false);
        });

        it("when_saved(false) fails 'retry' on server error ", function () {
            var trigger = $.Deferred(),
                reason_reported,
                promise;
            set_save_response(function (save) { save.reject(); }, trigger);
            form.load({email: ''});
            $('#field-email input').val('max@mustermann.example').change();
            promise = form.when_saved(false).fail(
                function (reason) { reason_reported = reason; }
            );
            trigger.resolve();
            expect(promise.state()).toEqual('rejected');
            expect(reason_reported).toEqual('retry');
        });

        it("when_saved(false) doesn't fail due to past server errors", function () {
            var trigger = $.Deferred(), promise;
            set_save_response(function (save) { save.reject(); }, trigger);
            form.load({email: ''});
            $('#field-email input').val('max@mustermann.example').change();
            trigger.resolve();
            promise = form.when_saved(false);
            expect(promise.state()).toEqual('pending');
        });

        it("when_saved(false) fails 'invalid' if field is invalid", function () {
            var trigger = $.Deferred(),
                reason_reported,
                promise;
            set_save_response(
                function (save) { save.resolve({status: 'error'}); },
                trigger
            );
            form.load({email: ''});
            $('#field-email input').val('max@mustermann').change();
            promise = form.when_saved(false).fail(
                function (reason) { reason_reported = reason; }
            );
            trigger.resolve();
            expect(promise.state()).toEqual('rejected');
            expect(reason_reported).toEqual('invalid');
        });

    });

    describe("saving notification", function () {

        it("disappears after saving", function () {
            set_save_response(function (save) {
                save.resolve({status: 'success'});
            });
            form.load({email: ''});
            runs(function () {
                $('#my_form input').val('max@mustermann').change();
            });
            waitsFor(
                function () { return $('#my_form .success').length === 0; },
                'saving notification to disappear after saving',
                100
            );
        });

        it("disappears on server error", function () {
            set_save_response(function (save) { save.reject(); });
            form.load({email: ''});
            runs(function () {
                $('#my_form input').val('max@mustermann').change();
            });
            waitsFor(
                function () { return $('#my_form .success').length === 0; },
                'saving notification to disappear on server error',
                100
            );
        });
    });

    describe("status message", function () {

        it("appear in the status area, with css class", function () {
            form.status_message('foo', 'success');
            expect($('#my_form .statusarea .alert-success').text()).toEqual('foo');
        });

        it("disappear after a given duration", function () {
            runs(function () {
                form.status_message('foo', 'success', 100);
                expect($('#my_form .statusarea .alert-success').text()).toEqual('foo');
            });
            waits(3500);  /* fadeOut(3000) */
            runs(function () {
                expect($('#my_form .statusarea .alert-success').length).toEqual(0);
            });
        });

        it("can be cleared by handle", function () {
            var handle = form.status_message('foo', 'success');
            expect($('#my_form .statusarea *').length).toEqual(1);
            form.clear_status_message(handle);
            expect($('#my_form .statusarea *').length).toEqual(0);
        });
    });

    describe("form can", function () {

        it("can display the select status of a list", function () {
            var source = [{token: 'mr', title: 'Mr.'},
                          {token: 'mrs', title: 'Mrs.'}];
            form.load({title: ['mrs']},
                      {title: {source: source,
                               multiple: true}});
            expect($('#my_form select option').get(2).selected).toEqual(true);
        });

        it("can reload the form", function () {
            form.load({firstname: 'Sebastian'});
            $('#my_form input').val('Bob');
            expect($('#my_form input').val()).toEqual('Bob');
            form.reload();
            expect($('#my_form input').val()).toEqual('Sebastian');
        });

        it("can reload the form from a url", function () {
            var loaded = false;
            $(form).on('after-load', function () { loaded = true; });
            runs(function () {
                form.load('/fanstatic/gocept.jsform.tests/testdata.json');
            });
            waitsFor(function () { return loaded; }, 'form to be loaded', 1000);
            runs(function () {
                $('#my_form input').val('Bob');
                expect($('#my_form input').get(0).value).toEqual('Bob');
                loaded = false;
                form.reload();
            });
            waitsFor(function () { return loaded; }, 'form to be reloaded', 1000);
            runs(function () {
                expect($('#my_form input').get(0).value).toEqual('Sebastian');
            });
        });
    });

    describe("object template", function () {

        it("renders placeholder as disabled if required", function () {
            var source = [{token: 'mr', title: 'Mr.'},
                          {token: 'mrs', title: 'Mrs.'}];
            form.load({title: ['mrs']},
                      {title: {source: source,
                               required: true}});
            expect($('#my_form select option').get(0).disabled).toEqual(true);
        });

        it("renders placeholder not as disabled if not required", function () {
            var source = [{token: 'mr', title: 'Mr.'},
                          {token: 'mrs', title: 'Mrs.'}];
            form.load({title: ['mrs']},
                      {title: {source: source}});
            expect($('#my_form select option').get(0).disabled).toEqual(false);
        });
    });

    describe("multiselect object template", function () {

        it("renders placeholder as disabled if required", function () {
            var source = [{token: 'mr', title: 'Mr.'},
                          {token: 'mrs', title: 'Mrs.'}];
            form.load({title: ['mrs']},
                      {title: {source: source,
                               multiple: true,
                               required: true}});
            expect($('#my_form select option').get(0).disabled).toEqual(true);
        });

        it("renders placeholder not as disabled if not required", function () {
            var source = [{token: 'mr', title: 'Mr.'},
                          {token: 'mrs', title: 'Mrs.'}];
            form.load({title: ['mrs']},
                      {title: {source: source,
                               multiple: false}});
            expect($('#my_form select option').get(0).disabled).toEqual(false);
        });
    });

    describe("submit button", function () {

        it("saves and then calls the callback on success", function () {
            var template, submitted, save_called;
            template = [
                '<form method="POST" action="{{action}}" id="{{form_id}}">',
                '  <span id="field-name" />',
                '  <button id="mybutton"/>',
                '</form>'].join('');

            form = new gocept.jsform.Form('my_form', {form_template: template});
            form.load({name: 'Max'});

            submitted = false;
            $('#mybutton').jsform_submit_button(function () {
                submitted = true;
            });

            save_called = false;
            set_save_response(function (save) { save.resolve({status: 'success'}); });
            $(form).on('after-save', function () { save_called = true; });

            $('#field-name input').val('Bob');
            runs(function () {
                $('#mybutton').trigger('click');
                expect(submitted).toEqual(false);
            });
            waitsFor(function () { return save_called; }, 'form to be saved', 100);
            runs(function () {
                expect(submitted).toEqual(true);
                expect($('#field-name input').get(0).value).toEqual('Bob');
            });
        });
    });

});
