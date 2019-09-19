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
        函数库，用于存放公共、通用的函数。
    */
    var _$container = {
        $background: null,
        $body: null
    }

    //初始化容器对象
    var _init = function (container) {
        if (!!container.$background) _$container.$background = container.$background;
        if (!!container.$body) _$container.$body = container.$body;
    }

    //根据controlConfig判断当前容器(目前主要根据“通栏”选择)
    var _get = function (controlConfig) {
        var _returnContainer = _$container.$body;

        //通栏状态、PC版返回$background元素
        // if (controlConfig.stretch == true && Kdo.utils.url.queryString("webType").toLowerCase() == "web") {
        //     _returnContainer = _$container.$background;
        // }

        return _returnContainer;
    }

    $.extend(true, window.Kdo, {
        container: {
            init: _init,
            get: _get,
            $background: function () { return _$container.$background },
            $body: function () { return _$container.$body }
        }
    });
});