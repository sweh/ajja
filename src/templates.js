this["ajja"] = this["ajja"] || {};
this["ajja"]["templates"] = this["ajja"]["templates"] || {};

this["ajja"]["templates"]["form"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<form method=\"POST\" action=\""
    + alias4(((helper = (helper = helpers.action || (depth0 != null ? depth0.action : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"action","hash":{},"data":data}) : helper)))
    + "\" id=\""
    + alias4(((helper = (helper = helpers.form_id || (depth0 != null ? depth0.form_id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"form_id","hash":{},"data":data}) : helper)))
    + "\"\n      class=\"ajja form-horizontal\">\n<div class=\"statusarea\"></div>\n</form>\n";
},"useData":true});

this["ajja"]["templates"]["form_boolean"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return " disabled=\"disabled\" ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<input type=\"checkbox\" name=\""
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.disabled : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " data-bind=\"checked: "
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\" />\n";
},"useData":true});

this["ajja"]["templates"]["form_field_wrapper"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"field form-group\" id=\"field-"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n    <label for=\""
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\" class=\"col-sm-3 control-label\">"
    + alias4(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper)))
    + "</label>\n    <div class=\"col-sm-9\">\n        "
    + ((stack1 = ((helper = (helper = helpers.widget_code || (depth0 != null ? depth0.widget_code : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"widget_code","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n    </div>\n    <div class=\"col-sm-offset-3 col-sm-9\">\n        <div class=\"help-block error\"></div>\n    </div>\n</div>\n";
},"useData":true});

this["ajja"]["templates"]["form_multiselect"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return " disabled=\"disabled\" ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<select name=\""
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\"\n        multiple=\"multiple\"\n        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.disabled : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        data-bind=\"selectedOptions: "
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + ",\n                   options: __sources__."
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + ",\n                   optionsText: 'title',\n                   optionsCaption: '"
    + alias4(((helper = (helper = helpers.placeholder || (depth0 != null ? depth0.placeholder : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"placeholder","hash":{},"data":data}) : helper)))
    + "',\n                   optionsAfterRender: function(option, item) {\n                     if (!item && "
    + alias4(((helper = (helper = helpers.required || (depth0 != null ? depth0.required : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"required","hash":{},"data":data}) : helper)))
    + ") {\n                       option.disabled = true;\n                     } else if (item) {\n                       option.value = item.token;\n                     }\n                   }\">\n</select>\n";
},"useData":true});

this["ajja"]["templates"]["form_number"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return " disabled=\"disabled\" ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<input type=\"number\" data-bind=\"value: "
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\" name=\""
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.disabled : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " class=\"form-control\" value=\"\" />\n";
},"useData":true});

this["ajja"]["templates"]["form_object"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return " disabled=\"disabled\" ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<select name=\""
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\"\n        "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.disabled : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        data-bind=\"value: "
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + ",\n                   options: __sources__."
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + ",\n                   optionsText: 'title',\n                   optionsCaption: '"
    + alias4(((helper = (helper = helpers.placeholder || (depth0 != null ? depth0.placeholder : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"placeholder","hash":{},"data":data}) : helper)))
    + "',\n                   optionsAfterRender: function(option, item) {\n                     if (!item && "
    + alias4(((helper = (helper = helpers.required || (depth0 != null ? depth0.required : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"required","hash":{},"data":data}) : helper)))
    + ") {\n                       option.disabled = true;\n                     } else if (item) {\n                       option.value = item.token;\n                     }\n                   },\n                   allowValueUnset: true\">\n</select>\n";
},"useData":true});

this["ajja"]["templates"]["form_radio_list"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : {}, alias4=helpers.helperMissing, alias5="function";

  return "    <div class=\"checkbox\">\n        <input type=\"radio\" id=\""
    + alias2(alias1((depths[1] != null ? depths[1].name : depths[1]), depth0))
    + "_"
    + alias2(((helper = (helper = helpers.token || (depth0 != null ? depth0.token : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"token","hash":{},"data":data}) : helper)))
    + "\" name=\""
    + alias2(alias1((depths[1] != null ? depths[1].name : depths[1]), depth0))
    + "\" value=\""
    + alias2(((helper = (helper = helpers.token || (depth0 != null ? depth0.token : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"token","hash":{},"data":data}) : helper)))
    + "\"\n               "
    + ((stack1 = helpers["if"].call(alias3,(depth0 != null ? depth0.disabled : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n               data-bind=\"checked: "
    + alias2(alias1((depths[1] != null ? depths[1].name : depths[1]), depth0))
    + "\" />\n        <label class=\"control-label\" for=\""
    + alias2(alias1((depths[1] != null ? depths[1].name : depths[1]), depth0))
    + "_"
    + alias2(((helper = (helper = helpers.token || (depth0 != null ? depth0.token : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"token","hash":{},"data":data}) : helper)))
    + "\">"
    + alias2(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"title","hash":{},"data":data}) : helper)))
    + "</label>\n    </div>\n";
},"2":function(container,depth0,helpers,partials,data) {
    return " disabled=\"disabled\" ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.source : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true,"useDepths":true});

this["ajja"]["templates"]["form_string"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return " disabled=\"disabled\" ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<input type=\"text\" data-bind=\"value: "
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\" name=\""
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.disabled : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " class=\"form-control\" value=\"\" />\n";
},"useData":true});

this["ajja"]["templates"]["form_text"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return " disabled=\"disabled\" ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<textarea class=\"form-control form-"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\" data-bind=\"value: "
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.disabled : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " name=\""
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\"></textarea>\n";
},"useData":true});

this["ajja"]["templates"]["group"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"panel-group\" id=\"collection\" role=\"tablist\" aria-multiselectable=\"true\">\n</div>\n<div id=\"form-actions\"></div>\n";
},"useData":true});

this["ajja"]["templates"]["group_item"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"panel panel-default group-item "
    + alias4(((helper = (helper = helpers.group_class || (depth0 != null ? depth0.group_class : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"group_class","hash":{},"data":data}) : helper)))
    + "\">\n    <div class=\"panel-heading\" role=\"tab\" id=\"heading-"
    + alias4(((helper = (helper = helpers.group_class || (depth0 != null ? depth0.group_class : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"group_class","hash":{},"data":data}) : helper)))
    + "\">\n      <h4 class=\"panel-title\">\n        <a data-toggle=\"collapse\"\n           data-parent=\"#collection\"\n           href=\"#"
    + alias4(((helper = (helper = helpers.group_class || (depth0 != null ? depth0.group_class : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"group_class","hash":{},"data":data}) : helper)))
    + "\"\n           aria-expanded=\"true\"\n           aria-controls=\""
    + alias4(((helper = (helper = helpers.group_class || (depth0 != null ? depth0.group_class : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"group_class","hash":{},"data":data}) : helper)))
    + "\"\n           class=\"group-title\">"
    + alias4(((helper = (helper = helpers.group_title || (depth0 != null ? depth0.group_title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"group_title","hash":{},"data":data}) : helper)))
    + "</a>\n      </h4>\n    </div>\n    <div id=\""
    + alias4(((helper = (helper = helpers.group_class || (depth0 != null ? depth0.group_class : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"group_class","hash":{},"data":data}) : helper)))
    + "\" class=\"panel-collapse collapse\" role=\"tabpanel\" aria-labelledby=\"heading-"
    + alias4(((helper = (helper = helpers.group_class || (depth0 != null ? depth0.group_class : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"group_class","hash":{},"data":data}) : helper)))
    + "\">\n      <ul class=\"list-group list-collection\" data-group-id=\""
    + alias4(((helper = (helper = helpers.group_class || (depth0 != null ? depth0.group_class : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"group_class","hash":{},"data":data}) : helper)))
    + "\"></ul>\n  </div>\n</div>\n";
},"useData":true});

this["ajja"]["templates"]["list"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div><ul class=\"list-group list-collection nav nav-stacked\" id=\"collection\"></ul></div>\n<div id=\"form-actions\"></div>\n";
},"useData":true});

this["ajja"]["templates"]["list_item"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "  <dt>"
    + container.escapeExpression(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"key","hash":{},"data":data}) : helper)))
    + "</dt>\n  <dd>"
    + ((stack1 = container.lambda(depth0, depth0)) != null ? stack1 : "")
    + "</dd>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<dl>\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(data && data.root),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</dl>\n";
},"useData":true});

this["ajja"]["templates"]["list_item_action"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<a class=\"btn btn-default btn-sm "
    + alias4(((helper = (helper = helpers.css_class || (depth0 != null ? depth0.css_class : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"css_class","hash":{},"data":data}) : helper)))
    + "\" href=\"#\">\n  <span class=\"glyphicon "
    + alias4(((helper = (helper = helpers.icon || (depth0 != null ? depth0.icon : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"icon","hash":{},"data":data}) : helper)))
    + "\"></span> "
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "\n</a>\n";
},"useData":true});

this["ajja"]["templates"]["list_item_edit"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div id=\"object-edit-form\" class=\"modal fade\" role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\">\n  <div class=\"modal-dialog modal-lg\">\n    <div class=\"modal-content\">\n      <div class=\"modal-header\">\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Schlie&szlig;en</span></button>\n        <h4 class=\"modal-title\">"
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "</h4>\n      </div>\n      <div class=\"modal-body\">\n        <div class=\"object-edit\">\n          <form id=\"object-form\"></form>\n          <button type=\"button\" data-dismiss=\"modal\"\n                  id=\"close-object-edit-form\" class=\"btn btn-primary\"\n            >"
    + alias4(((helper = (helper = helpers.save_button_title || (depth0 != null ? depth0.save_button_title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"save_button_title","hash":{},"data":data}) : helper)))
    + "</button>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n";
},"useData":true});

this["ajja"]["templates"]["list_item_wrapper"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "    <a data-action=\""
    + alias4(((helper = (helper = helpers.css_class || (depth0 != null ? depth0.css_class : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"css_class","hash":{},"data":data}) : helper)))
    + "\"\n       class=\""
    + alias4(((helper = (helper = helpers.css_class || (depth0 != null ? depth0.css_class : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"css_class","hash":{},"data":data}) : helper)))
    + " btn btn-default btn-xs\"\n       href=\"#\">\n        <span class=\"glyphicon "
    + alias4(((helper = (helper = helpers.icon || (depth0 != null ? depth0.icon : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"icon","hash":{},"data":data}) : helper)))
    + "\"></span> "
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "</a>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "<li class=\"list-group-item\" style=\"min-height: 50px;\" id=\"item_"
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n  <span class=\"actions btn-group badge\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.actions : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "  </span>\n  <span class=\"content\" />\n</li>\n";
},"useData":true});

this["ajja"]["templates"]["table"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div>\n    <table id=\"collection\"></table>\n</div>\n<div id=\"form-actions\"></div>\n";
},"useData":true});

this["ajja"]["templates"]["table_head"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.escapeExpression;

  return "      <th class=\""
    + alias1(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"key","hash":{},"data":data}) : helper)))
    + "\">"
    + alias1(container.lambda(depth0, depth0))
    + "</th>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<thead>\n  <tr>\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},depth0,{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    <th></th>\n    <th></th>\n  </tr>\n</thead>\n";
},"useData":true});

this["ajja"]["templates"]["table_row"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.escapeExpression;

  return "    <td class=\""
    + alias1(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"key","hash":{},"data":data}) : helper)))
    + "\">"
    + alias1(container.lambda(depth0, depth0))
    + "</td>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "    <td class=\"actions\">\n      <a data-action=\""
    + alias4(((helper = (helper = helpers.css_class || (depth0 != null ? depth0.css_class : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"css_class","hash":{},"data":data}) : helper)))
    + "\"\n         class=\""
    + alias4(((helper = (helper = helpers.css_class || (depth0 != null ? depth0.css_class : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"css_class","hash":{},"data":data}) : helper)))
    + " btn btn-default btn-xs\"\n         href=\"#\">\n          <span class=\"glyphicon "
    + alias4(((helper = (helper = helpers.icon || (depth0 != null ? depth0.icon : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"icon","hash":{},"data":data}) : helper)))
    + "\"></span> "
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "</a>\n    </td>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "<tr>\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.data : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.actions : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</tr>\n";
},"useData":true});