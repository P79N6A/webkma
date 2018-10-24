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
    锁定、解锁
*/
    var _lock = function () {
        if (_status().lock) {
            _action("lock");
        }
    }

    var _unlock = function () {
        if (_status().unlock) {
            _action("unlock");
        }
    }

    var _action = function (type) {
        var _updateControls = [],
            _currentBox = Kdo.box.utils.getCurrentBox(),
            _callback = function (controlId) {
                var _controlConfig = Kdo.data.controls.get(controlId);
                if (_controlConfig.length > 0) _controlConfig = _controlConfig[0];
                switch (type) {
                    case "lock":
                        if (!_controlConfig.lock) {
                            _controlConfig.lock = true;
                            _updateControls.push(_controlConfig);
                        }
                        break;
                    case "unlock":
                        if (!!_controlConfig.lock) {
                            _controlConfig.lock = false;
                            _updateControls.push(_controlConfig);
                        }
                        break;
                }
            }
        $.each(_currentBox.$focusSingleBox, function (i, _el) {
            var _$el = $(_el);
            //group or single
            if (_$el.hasClass("box group")) {
                $.each(_$el.children(".box.single"), function (i, _box) {
                    _callback(Kdo.box.utils.getBoxControlId($(_box)));
                });
            } else {
                _callback(Kdo.box.utils.getBoxControlId(_$el));
            }
        });
        //如果有改变，才执行update
        if (_updateControls.length > 0) {
            _update(_updateControls);
        }
    }

    var _update = function (controls) {
        //------------------更新页面controls对象(JSON)------------------
        Kdo.data.controls.update(controls);
        //------------------操作记录------------------
        Kdo.featurer.actionLogs.log();
        //------------------更新页面呈现元素(DOM)------------------
        //刷新选中模块
        Kdo.box.utils.refresh();
    }

    var _status = function () {
        var _currentBox = Kdo.box.utils.getCurrentBox(),
            _controlConfig = null,
            _lock = true,
            _unlock = true;
        switch (_currentBox.focusLevel) {
            case "single":
                _controlConfig = Kdo.data.controls.get(Kdo.box.utils.getBoxControlId(_currentBox.$focusBox))[0];
                _lock = !!_controlConfig && !_controlConfig.lock && !_controlConfig.global;
                _unlock = !!_controlConfig && _controlConfig.lock && !_controlConfig.global && !_controlConfig.fixed;   //!_controlConfig.fixed这个条件是否与业务合理？暂时这样做。
                break;
            case "group":
                _lock = !_currentBox.$focusBox.hasClass("lock");
                _unlock = _currentBox.$focusBox.hasClass("lock");
                break;
            case "temp":
            default:
                _lock = true;
                _unlock = true;
                break;
        }
        return {
            lock: _lock,
            unlock: _unlock
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
        Kdo.featurer.stretch.trigger();
        Kdo.featurer.inputResize.trigger();
    }

    $.extend(true, window.Kdo, {
        featurer: {
            locker: {
                lock: _lock,
                unlock: _unlock,
                status: _status,
                on: _on
            }
        }
    });
});