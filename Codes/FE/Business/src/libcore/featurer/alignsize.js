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
    对齐大小
*/
    var _attach = function () {
        var $element = $("#content");   //todo: 这里可能需要改为传递 (目前PC & Mobile均正常. remark by dyllon 2016.5.16)
        $element.css({ "cursor": "alias" });
        //关闭页面全局事件
        Kdo.events.off("mouse");
        $element.one("mousedown.alignSize", function (event) {
            $element.css("cursor", "auto");
            var $target = $(event.target).parents(".box:first"),
                _currentBox = Kdo.box.utils.getCurrentBox();
            $.each(_currentBox.$focusSingleBox, function (i, _box) {
                $(_box).css({
                    "width": $target.css("width"),
                    "height": $target.css("height")
                })
            });
            //更新模块Size
            Kdo.featurer.updateBoxSize();
            Kdo.featurer.updateBoxPosition();
            //操作记录
            Kdo.featurer.actionLogs.log();
            //重新选择模块（刷新动作）
            Kdo.box.temp.enter(_currentBox.$focusSingleBox);
        });
        $element.one("mouseup.alignSize", function (event) {
            //恢复原本的事件
            Kdo.events.on();
        });
    }

    var _status = function () {
        var _currentBox = Kdo.box.utils.getCurrentBox(),
            _status = !!_currentBox.focusLevel;
        if (_status == true) {
            $.each(_currentBox.$focusSingleBox, function (i, _el) {
                var controlId = Kdo.box.utils.getBoxControlId($(_el)),
                    controlConfig = Kdo.data.controls.get(controlId)[0];
                if (!!controlConfig.global || !!controlConfig.lock || !!controlConfig.stretch || _.findIndex(controlConfig.banTools, function (key) { return key == "alignSize" }) != -1) {
                    _status = false;
                    return false;
                }
            });
        }
        return _status;
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
            align: {
                size: {
                    attach: _attach,
                    status: _status,
                    on: _on
                }
            }
        }
    })
});