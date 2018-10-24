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
        站点基础数据相关函数
    */
    var _siteConfigs = {},  //保存站点的数据对象
        _siteControls = [], //保存站点中的所有global模块的controlConfig对象
        _triggers = [],
        _pages = [],//保存所有页面的数据 { config: "{}", data: "[]", number: "" }
        _removedPages=[];  // 临时保存移除的页面，用于撤销时还原      

    $.extend(true, window.Kdo, {
        data: {
            config: {
                site: Kdo.data.config.init(_siteConfigs, _triggers)
            },
            site: {
                controls: _siteControls
            },
            pages: _pages,
            removedPages:_removedPages
        }
    });
});