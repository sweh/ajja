/*global describe, document, $, ajja, jasmine, beforeEach, it, expect */
/*global waits, runs, waitsFor, afterEach, spyOn, Handlebars */
/*jslint nomen: true, unparam: true, bitwise: true*/

describe("Form Plugin", function () {
    "use strict";
    var form, alert, set_save_response, set_load_response,
        default_templates = $.extend({}, ajja.templates);

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
            if (ajja.isUndefinedOrNull(trigger)) {
                setTimeout(apply_response, 1);
            } else {
                trigger.always(apply_response);
            }
            return deferred_save.promise();
        };
    };

    set_load_response = function (response, trigger) {
        form.reload = function () {
            form.finish_load({"firstname": "Sebastian",
                "title": [],
                "needs_glasses": false});
        };
    };

    beforeEach(function () {
        $('body').append($('<div id="my_form"></div>'));
        form = new ajja.Form('my_form', {});
        alert = spyOn(form, 'alert');
    });

    afterEach(function () {
        $('#my_form').remove();
        $.extend(ajja.templates, default_templates);
    });

    it("should throw an error when ID was not found", function () {
        expect(function () { new ajja.Form('foobar',  {}); }).toThrow();
    });

    it("should inject a form tag into html", function () {
        form.load();
        expect(form.node).toBeDefined();
        expect(form.node).toEqual($('#my_form'));
        expect(form.node.get(0).tagName).toEqual('FORM');
    });

    it("can get a cusomized action url", function () {
        var options = {action: 'http://foo'};
        form = new ajja.Form('my_form', options);
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

    it("should update field when after-save is called", function (done) {
        var source = [{token: 'mr', title: 'Mr.'},
                      {token: 'mrs', title: 'Mrs.'}];
        form.load({title: ''},
                  {title: {source: source}});
        $(form).trigger(
            'after-save',
            {'sources': {'title': [{token: 'foo', title: 'Foo'}]}}
        );
        setTimeout(function () {
            expect($('#my_form select option').get(1).value).toEqual('foo');
            done();
        }, 100);
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
                            template: 'form_radio_list'}}
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
                             template: 'form_radio_list'}}
        );
        expect($('#needs_glasses_true').prop('checked')).toEqual(false);
        expect($('#needs_glasses_false').prop('checked')).toEqual(true);
    });

    it('assumes string type if a value is null', function () {
        var data = {foo: null, needs_glasses: false};
        form.load(data);
        expect($('#my_form input').get(0).type).toEqual('text');
    });

    it("can get its data from a url", function (done) {
        set_load_response();
        $(form).on('after-load', function () {
            expect($('#my_form select option').get(1).innerHTML).toEqual('Mr.');
            done();
        });
        form.load(
            '/fanstatic/ajja.tests/testdata.json',
            {title: {source: [
                {token: 'mr', title: 'Mr.'},
                {token: 'mrs', title: 'Mrs.'}
            ]}}
        );
    });

    it("should send an event after loading", function (done) {
        $(form).on('after-load', function (ev) {done(); });
        form.load({});
    });

    it("should provide a deferred to check whether loading is done", function (done) {
        expect(form.loaded.state()).toEqual('pending');
        $(form).on('after-load', function () {
            expect(form.loaded.state()).toEqual('resolved');
            done();
        });
        form.load({});
    });

    it("should send an event after saving", function (done) {
        set_save_response(function (save) { save.resolve({status: 'success'}); });
        $(form).on('after-save', function () { done(); });
        form.load({'foo': 'bar'});
        form.save('foo', null);
    });

    it("should propagate the save message from server using a trigger", function (done) {
        set_save_response(function (save) {
            save.resolve({status: 'success', validation: 'success'});
        });
        $(form).on('after-save', function (event, data) {
            expect(data).toEqual(
                {status: 'success', validation: 'success'}
            );
            done();
        });
        form.load({foo: ''});
        form.start_save('foo', 'bar');
    });

    describe("Disabled field for", function () {

        it("all fields", function () {
            form = new ajja.Form('my_form', {disabled: true});
            form.load({firstname: 'Sebastian', text: 'asdf'},
                      {text: {template: 'form_text'}});
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
                              template: 'form_text'}});
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
            spyOn(form, "_save").and.returnValue($.Deferred());
        });

        it("textbox", function () {
            form.load({'title': ''});
            $('#my_form input').val('Test');
            $('#my_form input').change();
            expect(form._save).toHaveBeenCalled();
        });

        it("textbox with no change", function () {
            form.load({'title': 'Test'});
            $('#my_form input').change();
            expect(form._save).not.toHaveBeenCalled();
        });

        it("checkboxes", function () {
            form.load({needs_glasses: false});
            $('#my_form input').click();
            expect(form._save).toHaveBeenCalled();
        });

        it("select box saves token", function (done) {
            var source = [{token: 'mr', title: 'Mr.'},
                          {token: 'mrs', title: 'Mrs.'}];
            form.load({title: 'mr'},
                      {title: {source: source,
                               template: 'form_object'}});
            $('#my_form select')[0].selectedIndex = 2;
            $('#my_form select').change();
            setTimeout(function () {
                expect(form._save).toHaveBeenCalledWith(
                    'title',
                    null,
                    'POST',
                    '{"title":"mrs"}'
                );
                done();
            }, 100);
        });

        it("multi-select box saves tokens", function (done) {
            var source = [{token: 'mr', title: 'Mr.'},
                          {token: 'mrs', title: 'Mrs.'}];
            form.load({title: ['mr']},
                      {title: {source: source,
                               multiple: true}});
            $('#my_form select option')[2].selected = true;
            $('#my_form select').change();
            setTimeout(function () {
                expect(form._save).toHaveBeenCalledWith(
                    'title',
                    null,
                    'POST',
                    '{"title":["mr","mrs"]}'
                );
                done();
            }, 100);
        });

        it("sends csrf token if available", function (done) {
            form.load({needs_glasses: false});
            $('#my_form').append(
                $('<input type="hidden" id="csrf_token" value="token" />')
            );
            $('#my_form input').click();
            setTimeout(function () {
                expect(form._save).toHaveBeenCalledWith(
                    'needs_glasses',
                    null,
                    'POST',
                    '{"needs_glasses":true,"csrf_token":"token"}'
                );
                done();
            }, 100);
        });

    });

    describe("customized templates", function () {

        it("for the form", function () {
            var template = Handlebars.compile([
                '<form method="POST" action="{{action}}" id="{{form_id}}">',
                '  <table><tr><td class="firstname">',
                '    <span id="field-firstname" />',
                '  </td><td class="lastname">',
                '    <span id="field-lastname" />',
                '</td></tr></table></form>'].join(''));
            ajja.register_template('form', template);
            form = new ajja.Form('my_form');
            form.load({firstname: 'Max', lastname: 'Mustermann'});
            expect($('#my_form .firstname input').val()).toEqual('Max');
            expect($('#my_form .lastname input').val()).toEqual('Mustermann');
        });

        it("for a field type", function () {
            var template;
            template = Handlebars.compile([
                '<div class="label">{{label}}</div>',
                '<div class="field">',
                '  <input type="radio" name="{{name}}" data-bind="checked: {{name}}" />',
                '</div>'].join(''));

            form = new ajja.Form('my_form');
            form.register_template('form_boolean', template);
            form.load({needs_glasses: false});
            expect($('#my_form input[type=checkbox]').length).toEqual(0);
            expect($('#my_form input[type=radio]').length).toEqual(1);
        });

        it("for a field explicitly", function () {
            var template, source;
            template = Handlebars.compile([
                '<div class="title">Titel: ',
                '  <div data-bind="foreach: __sources__.{{name}}">',
                '    <input type="radio" name="{{name}}"',
                '           data-bind="checked: $parent.{{name}}, text: $data.title,',
                '                      attr: {value: $data.token, class: $data.token}" />',
                '  </div>',
                '</div>'].join(''));

            source = [{token: 'mr', title: 'Mr.'},
                      {token: 'mrs', title: 'Mrs.'}];
            form.register_template('my_special_field_template', template);
            form.load({title: 'mr'},
                      {title: {
                    template: 'my_special_field_template',
                    source: source
                }});

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

        it("required fields work just fine when filled in", function (done) {
            var saved_id, saved_value;
            set_save_response(function (save, id, value) {
                saved_id = id;
                saved_value = value;
            });
            form.load({name: ''}, {name: {required: true}});
            $('#my_form input').val('John').change();
            setTimeout(function () {
                expect(saved_id).toBe('name');
                expect(saved_value).toBe('John');
                done();
            }, 100);
        });

        it("required fields are not saved if blank", function (done) {
            spyOn(form, '_save').and.callThrough();
            form.load({name: 'John'}, {name: {required: true}});
            $('#my_form input').val('').change();
            form.field('name').data('save').always(function () {
                expect(form.field('name').data('save').state()).toEqual('rejected');
                expect(form._save).not.toHaveBeenCalled();
                expect($('#my_form .error').text()).toEqual(
                    'This field is required but has no input.'
                );
                done();
            });
        });

    });

    it("validation errors are displayed and cleared at the widget", function (done) {
        set_save_response(function (save) {
            save.resolve({status: 'error', msg: 'Not a valid eMail address.'});
        });
        form.load({email: ''});
        $('#my_form input').val('max@mustermann').change();
        setTimeout(function () {
            expect($('#my_form .error').text()).toEqual(
                'Not a valid eMail address.'
            );
            set_save_response(function (save) {
                save.resolve({status: 'success'});
            });
            $('#my_form input').val('max@mustermann.example').change();
            setTimeout(function () {
                expect($('#my_form .error').text()).toEqual('');
                done();
            }, 100);
        }, 100);
    });

    it("renders field's label in the status area on validation error", function (done) {
        set_save_response(function (save) {
            save.resolve({status: 'error', msg: 'Not a valid eMail address.'});
        });
        form.load({email: ''}, {email: {'label': 'Your Mail-Address'}});
        $('#my_form input').val('max@mustermann').change();
        setTimeout(function () {
            expect($('#my_form .statusarea .alert').text()).toEqual(
                'Your Mail-Address: Not a valid eMail address.'
            );
            done();
        }, 100);
    });

    it("renders no label in status area on validation error if not defined", function (done) {
        set_save_response(function (save) {
            save.resolve({status: 'error', msg: 'Not a valid eMail address.'});
        });
        form.load({email: ''});
        $('#my_form input').val('max@mustermann').change();
        setTimeout(function () {
            expect($('#my_form .statusarea .alert').text()).toEqual(
                'Not a valid eMail address.'
            );
            done();
        }, 100);
    });

    it("unrecoverable error on non-conformant HTTP OK response while saving", function (done) {
        set_save_response(function (save) { save.resolve(''); });
        form.load({email: ''});

        $(form).on('unrecoverable-error', function () {
            expect(form.start_save('foo', 'bar')).not.toBeDefined();
            expect(alert).toHaveBeenCalledWith(
                'An unrecoverable error has occurred: ' +
                    'Could not parse server response.'
            );
            done();
        });

        $('#my_form input').val('max@mustermann').change();
    });

    it("unrecoverable error on HTTP error response while saving", function (done) {
        set_save_response(function (save) { save.reject(null, 'error', 'fubar'); });
        form.load({email: ''});

        $(form).on('unrecoverable-error', function () {
            expect(form.start_save('foo', 'bar')).not.toBeDefined();
            expect(alert).toHaveBeenCalledWith(
                'An unrecoverable error has occurred: fubar'
            );
            done();
        });

        $('#my_form input').val('max@mustermann').change();
    });

    it("unrecoverable error displays message of response if present", function (done) {
        set_save_response(function (save) {
            save.reject(
                {'responseJSON': {'message': 'Custom Error Message'}},
                'error',
                'Conflict'
            );
        });
        form.load({email: ''});

        $(form).on('unrecoverable-error', function () {
            expect(form.start_save('foo', 'bar')).not.toBeDefined();
            expect(alert).toHaveBeenCalledWith(
                'An unrecoverable error has occurred: Custom Error Message'
            );
            done();
        });

        $('#my_form input').val('max@mustermann').change();
    });

    it("retry saving after failed connection to server", function (done) {
        var trigger = $.Deferred();
        form.load({email: ''});

        set_save_response(function (save) { save.reject(); }, trigger);
        $('#my_form input').val('max@mustermann.example').change();
        trigger.resolve();

        setTimeout(function () {
            expect($('#my_form .error').text()).toEqual(
                'This field contains unsaved changes.'
            );
            expect($('#my_form .statusarea .alert-danger').text()).toEqual(
                'This field contains unsaved changes.' +
                    'There was an error communicating with the server.'
            );
            set_save_response(function (save) { save.resolve({status: 'success'}); });
            form.retry();

            setTimeout(function () {
                expect(form.field('email').data('save').state()).toEqual('resolved');
                expect($('#my_form .error').text()).toEqual('');
                expect($('#my_form .statusarea .alert-danger').length).toEqual(0);
                done();
            }, 100);

        }, 100);

    });

    it("retry saving triggered by successful connection to server", function (done) {
        var trigger = $.Deferred();

        form.load({email: '', name: ''});

        set_save_response(function (save) { save.reject(); }, trigger);
        $('#field-email input').val('max@mustermann.example').change();
        trigger.resolve();
        setTimeout(function () {
            set_save_response(function (save) { save.resolve({status: 'success'}); });
            $('#field-name input').val('Max Mustermann').change();
            setTimeout(function () {
                expect(form.field('email').data('save').state()).toEqual('resolved');
                done();
            }, 100);
        }, 100);
    });

    describe("save_remaining behaviour", function () {

        it("save_remaining saves fields that haven't been saved yet", function (done) {
            var saved_id,
                saved_value;
            set_save_response(function (save, id, value) {
                saved_id = id;
                saved_value = value;
                save.resolve({status: 'success'});
            });
            form.load({email: 'max@mustermann.example'});
            form.save_remaining();
            $(form).on('after-save', function () {
                expect(saved_id).toEqual('email');
                expect(saved_value).toEqual('max@mustermann.example');
                done();
            });
        });

        it("save_remaining skips fields that have been saved", function (done) {
            set_save_response(function (save) { save.resolve({status: 'success'}); });
            form.load({email: ''});
            $(form).on('after-save', function () {
                form.save = jasmine.createSpy();
                form.save_remaining();
                expect(form.save).not.toHaveBeenCalled();
                done();
            });

            $('#field-email input').val('max@mustermann.example').change();
        });

        it("Supresses info messages of saving fields when saving remaining", function (done) {
            set_save_response(function (save, id, value) {
                save.resolve({status: 'success'});
            });
            form.load({email: 'max@mustermann.example'});
            $(form).on('after-save', function () {
                expect($('#my_form .statusarea .alert-success').length).toEqual(0);
                done();
            });
            form.save_remaining();
        });

    });

    describe("when_saved behaviour", function () {

        it("when_saved resolves if all fields are fine", function (done) {
            var promise;
            set_save_response(function (save) {
                save.resolve({status: 'success'});
            });
            form.load({email: '', name: ''});
            $('#field-email input').val('max@mustermann.example').change();
            setTimeout(function () {
                expect(form.field('email').data('save').state()).toEqual('resolved');
                promise = form.when_saved();

                setTimeout(function () {
                    expect(promise.state()).toEqual('resolved');
                    done();
                }, 100);
            }, 100);
        });

        it("when_saved resolves after pending saves succeeded", function (done) {
            var trigger = $.Deferred(),
                promise;
            set_save_response(
                function (save) { save.resolve({status: 'success'}); },
                trigger
            );
            form.load({email: '', name: ''});
            $('#field-email input').val('max@mustermann.example').change();
            expect(form.field('email').data('save').state()).toEqual('pending');
            promise = form.when_saved();
            expect(promise.state()).toEqual('pending');
            trigger.resolve();

            setTimeout(function () {
                expect(form.field('email').data('save').state()).toEqual('resolved');
                expect(promise.state()).toEqual('resolved');
                done();
            }, 100);
        });

        it("when_saved rejects if any field is not fine", function (done) {
            var promise;
            set_save_response(function (save) { save.resolve({status: 'error'}); });
            form.load({email: '', name: ''});
            $('#field-email input').val('max@mustermann').change();

            setTimeout(function () {
                expect(form.field('email').data('save').state()).toEqual('rejected');
                promise = form.when_saved();
                setTimeout(function () {
                    expect(promise.state()).toEqual('rejected');
                    done();
                }, 100);
            }, 100);
        });

        it("when_saved rejects after any pending save failed", function (done) {
            var trigger = $.Deferred(),
                promise;
            set_save_response(
                function (save) { save.resolve({status: 'error'}); },
                trigger
            );
            form.load({email: '', name: ''});
            $('#field-email input').val('max@mustermann').change();
            expect(form.field('email').data('save').state()).toEqual('pending');
            promise = form.when_saved();
            expect(promise.state()).toEqual('pending');
            trigger.resolve();

            setTimeout(function () {
                expect(form.field('email').data('save').state()).toEqual('rejected');
                expect(promise.state()).toEqual('rejected');
                done();
            }, 100);
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

        it("disappears after saving", function (done) {
            set_save_response(function (save) {
                save.resolve({status: 'success'});
            });
            form.load({email: ''});
            $('#my_form input').val('max@mustermann').change();
            setTimeout(function () {
                expect($('#my_form .success').length).toBe(0);
                done();
            }, 100);
        });

        it("disappears on server error", function (done) {
            set_save_response(function (save) { save.reject(); });
            form.load({email: ''});
            $('#my_form input').val('max@mustermann').change();
            setTimeout(function () {
                expect($('#my_form .success').length).toBe(0);
                done();
            }, 100);
        });
    });

    describe("status message", function () {

        it("appear in the status area, with css class", function () {
            form.status_message('foo', 'success');
            expect($('#my_form .statusarea .alert-success').text()).toEqual('foo');
        });

        it("disappear after a given duration", function (done) {
            form.status_message_fade_out_time = 100;
            form.status_message('foo', 'success', 100);
            expect($('#my_form .statusarea .alert-success').text()).toEqual('foo');
            setTimeout(function () {
                expect($('#my_form .statusarea .alert-success').length).toEqual(0);
                done();
            }, 250);
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

        it("saves and then calls the callback on success", function (done) {
            var template, submitted;
            template = Handlebars.compile([
                '<form method="POST" action="{{action}}" id="{{form_id}}">',
                '  <span id="field-name" />',
                '  <button id="mybutton"/>',
                '</form>'].join(''));

            ajja.register_template('form', template);
            form = new ajja.Form('my_form');
            form.load({name: 'Max'});

            submitted = false;
            $('#mybutton').form_submit_button(function () {
                submitted = true;
            });

            set_save_response(function (save) { save.resolve({status: 'success'}); });
            $('#field-name input').val('Bob');
            $('#mybutton').trigger('click');
            expect(submitted).toEqual(false);
            setTimeout(function () {
                expect(submitted).toEqual(true);
                expect($('#field-name input').get(0).value).toEqual('Bob');
                done();
            }, 100);
        });
    });

});
