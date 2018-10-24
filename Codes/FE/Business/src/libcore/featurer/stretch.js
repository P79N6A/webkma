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
    通栏
*/
    var _baseBefore = function (callback) {
        var _currentBox = Kdo.box.utils.getCurrentBox(),
            _controlConfig = Kdo.data.controls.get(Kdo.box.utils.getBoxControlId(_currentBox.$focusBox))[0];
        !!callback && callback(_controlConfig);
    }

    var _update = function (controls) {
        //------------------更新页面controls对象(JSON)------------------
        Kdo.data.controls.update(controls);
        //操作记录
        Kdo.featurer.actionLogs.log();
        //------------------更新页面呈现元素(DOM)------------------
        //刷新选中模块
        Kdo.box.utils.refresh();
    }

    var _full = function () {
        if (_status()) {
            _baseBefore(function (controlConfig) {
                controlConfig.stretch = true;
                _update([controlConfig]);
            });
        }
    }

    var _real = function () {
        if (_status()) {
            _baseBefore(function (controlConfig) {
                controlConfig.stretch = false;
                //在非通栏情况下，模块宽度必须小于容器宽度。 Added by Dyllon 2016.6.3
                controlConfig.style.width = Math.min(Kdo.container.get(controlConfig).width(), parseFloat(controlConfig.style.width)) + "px";

                _update([controlConfig]);
            });
        }
    }

    var _status = function () {
        var result = {
            enabled: false,
            full: false,
            real: false,
        }

        var _currentBox = Kdo.box.utils.getCurrentBox(),
            _controlConfig = Kdo.data.controls.get(Kdo.box.utils.getBoxControlId(_currentBox.$focusBox));
        var _enabled = _currentBox.focusLevel == "single" && _controlConfig.length == 1 &&
                       //_controlConfig[0].lock == false &&
                        !_controlConfig[0].lock &&
                       !_controlConfig[0].global &&
                       !Kdo.featurer.rotate.status().isRotated &&
                       _.findIndex(Kdo.menus.getToolbar(_controlConfig[0]), function (key) { return key == "stretch" }) != -1;
        _controlConfig = _controlConfig[0];

        //TODO: 全网推暂时没有组件功能
        //组件设计页面不能使用通栏功能
        //if (Kdo.utils.url.queryString("type").toLowerCase() != "component") {
        result = {
            enabled: _enabled,
            full: _enabled && !!_controlConfig && !_controlConfig.stretch,
            real: _enabled && !!_controlConfig && _controlConfig.stretch,
        }
        //}
        return result;
    }

    var _triggers = [];

    //注册记录后调用的回调函数
    var _on = function (key, callback) {
        //TODO: 这里可以根据key做重写处理。目前业务上用不到，暂时不用加。
        _triggers.push({ key: key, callback: callback });
    }

    //触发回调函数(private)
    var _trigger = function () {
        _.each(_triggers, function (trigger) {
            if (!!trigger.callback) {
                trigger.callback(_status());
            }
        });
        Kdo.featurer.inputResize.trigger();
    }

    $.extend(true, window.Kdo, {
        featurer: {
            stretch: {
                full: _full,
                real: _real,
                status: _status,
                on: _on,
                trigger: _trigger
            }
        }
    })
});