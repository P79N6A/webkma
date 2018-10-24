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
        层级控制: 上一层、下一层、顶层、底层
    */
    var _baseBefore = function (callback) {
        var _currentBox = Kdo.box.utils.getCurrentBox(),
            _controlId = Kdo.box.utils.getBoxControlId(_currentBox.$focusBox),
            _allControls = Kdo.utils.copy(Kdo.data.controls.all()),
            _controlConfig = _.findWhere(_allControls, { controlId: _controlId }),
            _controlIndex = -1;

        //排除组合后的模块  TODO: 未使用
        //_allControls = _.filter(_allControls, function (control) { return !control.group || control.group.length == 0 });

        //如果是PC版，排除通栏的模块
        //if (Kdo.utils.url.queryString("webType").toLowerCase() == "web") {
        //    _allControls = _.filter(_allControls, function (control) { return !control.stretch });
        //}

        //页面模块根据zindex排序
        _allControls = _allControls.sort(function (item1, item2) { return parseFloat(item1.style["z-index"]) - parseFloat(item2.style["z-index"]) });

        //获取当前模块所在排序后数组的下标
        if (!!_controlConfig) {
            //排除非“同类”行为的模块（以global为准）
            _allControls = _.filter(_allControls, function (control) { return control.global == _controlConfig.global });
            $.each(_allControls, function (index, _control) {
                if (_control.controlId == _controlConfig.controlId) {
                    _controlIndex = index;
                    return false;
                }
            });
        }
        !!callback && callback(_controlConfig, _controlIndex, _allControls);
    }

    var _update = function (controls) {
        //------------------更新页面controls对象(JSON)------------------
        Kdo.data.controls.update(controls);
        //操作记录
        Kdo.featurer.actionLogs.log();

        //------------------更新页面呈现元素(DOM)------------------
        //收集涉及到的模块ID
        var _controlIds = [];
        _.each(controls, function (control) {
            _controlIds.push(control.controlId);
        });
        //刷新选中模块
        Kdo.box.utils.refresh(_controlIds);

        _trigger();
    }

    //上一层
    var _up = function () {
        _baseBefore(function (controlConfig, controlIndex, allControls) {
            if (!_status().up) return;
            var _updateControl = allControls[controlIndex + 1];
            if (!!_updateControl) {
                var temp = parseFloat(controlConfig.style["z-index"]);
                controlConfig.style["z-index"] = parseFloat(_updateControl.style["z-index"]);
                _updateControl.style["z-index"] = temp;
                _update([_updateControl, controlConfig]);
            }
        });
    }

    //下一层
    var _down = function () {
        _baseBefore(function (controlConfig, controlIndex, allControls) {
            if (!_status().down) return;
            var _updateControl = allControls[controlIndex - 1];
            if (!!_updateControl) {
                var temp = parseFloat(controlConfig.style["z-index"]);
                controlConfig.style["z-index"] = parseFloat(_updateControl.style["z-index"]);
                _updateControl.style["z-index"] = temp;
                _update([_updateControl, controlConfig]);
            }
        });
    }

    //顶层
    var _top = function () {
        _baseBefore(function (controlConfig, controlIndex, allControls) {
            if (!_status().top) return;
            controlConfig.style["z-index"] = parseFloat(allControls[allControls.length - 1].style["z-index"]);
            var _updateControls = [controlConfig];
            for (var index = controlIndex + 1; index < allControls.length; index++) {
                allControls[index].style["z-index"]--;
                _updateControls.push(allControls[index]);
            }
            _update(_updateControls);
        });
    }

    //底层
    var _bottom = function () {
        _baseBefore(function (controlConfig, controlIndex, allControls) {
            if (!_status().bottom) return;
            controlConfig.style["z-index"] = parseFloat(allControls[0].style["z-index"]);
            var _updateControls = [controlConfig];
            for (var index = 0; index < controlIndex; index++) {
                allControls[index].style["z-index"]++;
                _updateControls.push(allControls[index]);
            }
            _update(_updateControls);
        });
    }

    var _getMax = function (type) {
        var zIndex = 0,
            _$boxes = null;
        switch (type) {
            case "global":
                //拥有global标记的模块，从2000开始叠加，永远处于普通模块的上层。
                zIndex = 2000;
                _$boxes = $(".box.global:not(.temp)");
                break;
            case "normal":
            default:
                _$boxes = $(".box:not(.temp,.global)");
                break;
        }
        $.each(_$boxes, function (i, _box) {
            var _box_index = parseFloat($(_box).css("z-index"));
            if (isFinite(_box_index)) {
                zIndex = Math.max(zIndex, parseFloat($(_box).css("z-index")));
            }
        });
        return zIndex;
    }

    //计算可用状态
    var _status = function () {
        var val = { up: false, down: false, top: false, bottom: false };
        _baseBefore(function (controlConfig, controlIndex, allControls) {
            var _currentBox = Kdo.box.utils.getCurrentBox();
            //多模块禁用
            if (_currentBox.focusLevel != "single") return;
            //PC版通栏模块禁用
            //if (Kdo.utils.url.queryString("webType").toLowerCase() == "web" && !!controlConfig.stretch) return;
            val = {
                up: controlIndex < allControls.length - 1 && !controlConfig.global,
                down: controlIndex > 0 && !controlConfig.global,
                top: controlIndex < allControls.length - 1 && !controlConfig.global,
                bottom: controlIndex > 0 && !controlConfig.global
            }
        });
        return val;
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
            zIndex: {
                up: _up,
                down: _down,
                top: _top,
                bottom: _bottom,
                getMax: _getMax,
                status: _status,
                on: _on
            }
        }
    })
});