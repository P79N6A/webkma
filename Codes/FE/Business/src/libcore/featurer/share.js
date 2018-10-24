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
    共享，解除共享
*/
    var _open = function () {
        if (_status().open) {
            _action("open");
        }
    }

    var _close = function () {
        if (_status().close) {
            _action("close");
        }
    }

    var _action = function (type) {
        var _updateControls = [],
            _currentBox = Kdo.box.utils.getCurrentBox();
        $.each(_currentBox.$focusSingleBox, function (i, _box) {
            var _$box = $(_box),
                _controlConfig = Kdo.data.controls.get(Kdo.box.utils.getBoxControlId(_$box));
            if (_controlConfig.length > 0) _controlConfig = _controlConfig[0];
            if (_checkStatus(_controlConfig)) {
                switch (type) {
                    case "open":
                        if (!_controlConfig.share) {
                            _controlConfig.share = true;
                            _updateControls.push(_controlConfig);
                        }
                        break;
                    case "close":
                        if (!!_controlConfig.share) {
                            _controlConfig.share = false;
                            _updateControls.push(_controlConfig);
                        }
                        break;
                }
            }
        });
        //如果有改变，才执行update
        if (_updateControls.length > 0) {
            _update(_updateControls);
        }
    }

    var _update = function (controls) {
        //------------------更新页面controls对象(JSON)------------------
        var controlIds = [];
        _.each(controls, function (control) { controlIds.push(control.controlId) });
        Kdo.data.controls.del(controlIds);
        Kdo.data.controls.set(controls);
        //------------------操作记录------------------
        Kdo.featurer.actionLogs.log();
        //------------------更新页面呈现元素(DOM)------------------
        //刷新选中模块
        Kdo.box.utils.refresh();
    }

    //判断状态封装
    var _checkStatus = function (_controlConfig) {
        return !!_controlConfig && !_controlConfig.global && !_controlConfig.fixed && _.findIndex(_controlConfig.banTools, function (key) { return key == "share" }) == -1
    }

    var _status = function () {
        var _currentBox = Kdo.box.utils.getCurrentBox(),
            _controlConfig = null;
        if (_currentBox.focusLevel != "temp") {
            _controlConfig = Kdo.data.controls.get(Kdo.box.utils.getBoxControlId(_currentBox.$focusBox))[0];
        }
        return {
            open: _currentBox.focusLevel == "temp" || (!!_controlConfig && !_controlConfig.share && _checkStatus(_controlConfig)),
            close: _currentBox.focusLevel == "temp" || (!!_controlConfig && _controlConfig.share && _checkStatus(_controlConfig)),   //!_controlConfig.fixed这个条件是否与业务合理？暂时这样做。
        }
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
    }

    $.extend(true, window.Kdo, {
        featurer: {
            share: {
                open: _open,
                close: _close,
                status: _status,
                on: _on
            }
        }
    });
});