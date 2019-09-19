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
        页面基础数据相关函数
    */
    var _init = function (dataConfig, triggers) {

        var _clear = function () {
            dataConfig = {};
        }

        var _get = function () {
            return Object.assign({},dataConfig);
        }

        var _set = function (otpions) {
            $.extend(true, dataConfig, otpions);
            _trigger();
        }

        //注册记录后调用的回调函数
        var _on = function (key, callback) {
            //TODO: 这里可以根据key做重写处理。目前业务上用不到，暂时不用加。
            triggers.push({ key: key, callback: callback });
        }

        //触发回调函数(private)
        var _trigger = function () {
            _.each(triggers, function (trigger) {
                if (!!trigger.callback) {
                    trigger.callback(_get());
                }
            });
        }

        return {
            get: _get,
            set: _set,
            clear: _clear,
            on: _on
        }
    }

    $.extend(true, window.Kdo, {
        data: {
            config: {
                init: _init
            }
        }
    });
});