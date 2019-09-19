(function (global, factory) {
    "use strict";
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = global.document ?
            factory(global, true) :
            function (w) {
                return factory(w);
            };
    } else {
        factory(global);
    }
})(typeof window !== "undefined" ? window : this, function (window) {
    'use strict';
    /*
       上传样式
    */
    var _settingPageBackground = function ($target) {
        var menu = Kdo.menus.getMenuInfo("setting_page_config", "mobile" /*Kdo.utils.url.queryString("webType").toLowerCase() == "web" ? "pc" : "mobile"*/);
        $.get(menu.settingTemplateUrl, function (result) {
            Kdo.settings.open("custom", {
                title: menu.name,
                template: result,
                menu: menu
            });
        });
    }

    $.extend(true, window.Kdo, {
        settingPageBackground: _settingPageBackground
    });
});