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
    删除功能
*/
    var _triggers = [];
    var _del = function () {
        if (!_status()) return;
        var _currentBox = Kdo.box.utils.getCurrentBox(),
            controlIds = [];

        $.each(_currentBox.$focusSingleBox, function (i, _el) {
            if ($(_el).hasClass("box group")) {
                $.each($(_el).children(".box.single"), function (i, _box) {
                    //判断假如是活动插件，则开启活动插件创建的锁
                    if (Kdo.data.controls.get(Kdo.box.utils.getBoxControlId(_box))[0].singleGroup == 'activity') {
                        delete window.hasPlugin;
                    }
                    controlIds.push(Kdo.box.utils.getBoxControlId(_box)); //获取html的div的controlId
                });
            } else {
                //判断假如是活动插件，则开启活动插件创建的锁
                if (Kdo.data.controls.get(Kdo.box.utils.getBoxControlId(_el))[0].singleGroup == 'activity') {
                    delete window.hasPlugin;
                }
                controlIds.push(Kdo.box.utils.getBoxControlId(_el)); //获取html的div的controlId
            }
        });
        //删除页面的模块配置
        Kdo.data.controls.del(controlIds);
        //操作记录
        Kdo.featurer.actionLogs.log();
        //删除dom元素
        _currentBox.$focusSingleBox.remove();
        //清除Box盒子的选择状态
        Kdo.box.clean();
    }

    var _status = function () {
        var _currentBox = Kdo.box.utils.getCurrentBox(),
            _status = !!_currentBox.focusLevel,
            _callback = function (controlId) {
                var controlConfig = Kdo.data.controls.get(controlId)[0];
                if (!!controlConfig.global || _.findIndex(controlConfig.banTools, function (key) { return key == "delete" }) != -1) {
                    _status = false;
                    return false;
                }
            }
        if (_status == true) {
            $.each(_currentBox.$focusSingleBox, function (i, _el) {
                var _$el = $(_el);
                //group or single
                if (_$el.hasClass("box group")) {
                    $.each(_$el.children(".box.single"), function (i, _box) {
                        return _callback(Kdo.box.utils.getBoxControlId($(_box)));
                    });
                } else {
                    return _callback(Kdo.box.utils.getBoxControlId(_$el));
                }
                return _status;
            });
        }
        return _status;
    }

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
            del: _del,
            deleted: {
                status: _status,
                on: _on
            }
        }
    });
});