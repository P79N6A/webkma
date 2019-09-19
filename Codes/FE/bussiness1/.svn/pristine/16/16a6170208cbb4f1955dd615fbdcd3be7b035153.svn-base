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
    复制、粘贴、复印功能
*/
    var _copyCache = null,
        _copyTarget = null,
        _triggers = [];

    //复制
    var _copy = function () {
        if (!_pasteStatus().copy) return;
        var _currentBox = Kdo.box.utils.getCurrentBox(),
            _controlIds = [],
            _push = function (controlId) {
                var controlConfig = Kdo.data.controls.get(controlId)[0];
                if (_checkStatus(controlConfig)) {
                    _controlIds.push(controlId);
                }
            }
        $.each(_currentBox.$focusSingleBox, function (i, _el) {
            var _$el = $(_el);
            if (_$el.hasClass("box group")) {
                $.each(_$el.children(".box.single"), function (i, _box) {
                    _push(Kdo.box.utils.getBoxControlId($(_box)));
                });
            } else {
                _push(Kdo.box.utils.getBoxControlId($(_el)));
            }
        });
        _copyCache = Kdo.utils.copy(Kdo.data.controls.get(_controlIds));
        _copyTarget = Kdo.box.utils.getCurrentBox().$focusBox.parent();
        _trigger();
    }

    //粘贴
    var _paste = function () {
        if (!_pasteStatus().paste) return;
        var offsetVal = 10;
        $.each(_copyCache, function (i, _controlConfig) {
            //判断X坐标和Y坐标是否有重叠的模块，如果有则自动为X、Y增加10px。
            if (_.filter(Kdo.data.controls.all(), function (control) {
                return !!control.style && control.style.left == _controlConfig.style.left && control.style.top == _controlConfig.style.top;
            }).length > 0) {
                _controlConfig.style = $.extend(_controlConfig.style, {
                    "left": (parseFloat(_controlConfig.style.left) + offsetVal) + "px",
                    "top": (parseFloat(_controlConfig.style.top) + offsetVal) + "px"
                });
            }
            //粘贴的模块默认解锁
            _controlConfig.lock = false;
        });
        Kdo.page.create.paste(_copyCache, _copyTarget);
        //Tip: 操作记录已在create.paste中记录
    }

    //复印
    var _copyPaste = function () {
        _copy();
        _paste();
    }

    var _checkStatus = function (controlConfig) {
        return !!controlConfig && !controlConfig.single && !controlConfig.global && _.findIndex(controlConfig.banTools, function (key) { return key == "copy" }) == -1
    }

    var _pasteStatus = function () {
        var _status = {
            copy: false,
            paste: !!_copyCache && _copyCache.length > 0
        },
        _callback = function (controlId) {
            var controlConfig = Kdo.data.controls.get(controlId)[0];
            if (_checkStatus(controlConfig)) {
                _status.copy = true;
            }
        }

        var _currentBox = Kdo.box.utils.getCurrentBox();
        $.each(_currentBox.$focusSingleBox, function (i, _el) {
            var _$el = $(_el);
            if (_$el.hasClass("box group")) {
                $.each(_$el.children(".box.single"), function (i, _box) {
                    _callback(Kdo.box.utils.getBoxControlId($(_box)));
                    if (_status.copy == true) return false;
                });
            } else {
                _callback(Kdo.box.utils.getBoxControlId($(_el)));
            }
            if (_status.copy == true) return false;
        });
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
                trigger.callback(_pasteStatus());
            }
        });
    }


    $.extend(true, window.Kdo, {
        featurer: {
            copy: _copy,
            paste: _paste,
            copyPaste: _copyPaste,
            copied: {
                status: _pasteStatus,
                on: _on
            }
        }
    })
});