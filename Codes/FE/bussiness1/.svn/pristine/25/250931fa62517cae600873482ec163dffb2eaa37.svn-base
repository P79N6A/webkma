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
    输入方式改变宽度、高度、坐标
*/
    var _inputResize = function () {
            var recalculateSize = function (callback) {
                Kdo.box.temp.filterByClass("lock");

                var _currentBox = Kdo.box.utils.getCurrentBox(),
                    box = _currentBox.$focusBox;

                callback && callback(box);

                Kdo.box.utils.resize.updateSize(box);

                Kdo.featurer.updateBoxSize();
                Kdo.featurer.updateBoxPosition();

                Kdo.featurer.actionLogs.log();//记录一下日志
                //刷新选中模块
                Kdo.box.utils.refresh();

            }
            var update = {
                width: function (val) {
                    recalculateSize(function (box) {
                        $(box).width(parseInt(val));
                    });
                },
                height: function (val) {
                    recalculateSize(function (box) {
                        $(box).height(parseInt(val));
                    });
                },
                top: function (val) {
                    Kdo.box.temp.filterByClass("lock");

                    var box = Kdo.box.utils.getCurrentBox().$focusBox;
                    $(box).css('top', parseInt(val) + 'px');//坐标也只精确到1像素

                    Kdo.featurer.updateBoxPosition();
                    Kdo.featurer.actionLogs.log();//记录一下日志
                    //刷新选中模块
                    Kdo.box.utils.refresh();
                },
                left: function (val) {
                    Kdo.box.temp.filterByClass("lock");

                    var box = Kdo.box.utils.getCurrentBox().$focusBox;
                    $(box).css('left', parseInt(val) + 'px');

                    Kdo.featurer.updateBoxPosition();
                    Kdo.featurer.actionLogs.log();//记录一下日志
                    //刷新选中模块
                    Kdo.box.utils.refresh();
                }
            },
            get = function () {
                var box = Kdo.box.utils.getCurrentBox().$focusBox;
                return {
                    size: {
                        width: !!box.length ? box.width() : '',
                        height: !!box.length ? box.height() : ''
                    },
                    position: {
                        left: !!box.length ? parseInt(box.position().left) : '',
                        top: !!box.length ? parseInt(box.position().top) : ''
                    }
                }
            }

            return {
                update: update,
                get: get
            }
        };

    var _triggers = [];

    var _status = function () {
        var _currentBox = Kdo.box.utils.getCurrentBox(),
            _statusOptions = { width: true, height: true, top: true, left: true }
        if (_currentBox.focusLevel != "temp") { //单模块
            var _controlConfig = Kdo.data.controls.get(Kdo.box.utils.getBoxControlId(_currentBox.$focusBox))[0];
            if (!!_controlConfig) {
                //根据stretch（通栏）判断
                _statusOptions.width = !!_statusOptions.width && _controlConfig.stretch != true;
                _statusOptions.left = !!_statusOptions.width && _controlConfig.stretch != true;
                //根据lock（锁定）判断
                _statusOptions = {
                    width: !!_statusOptions.width && !_controlConfig.lock,
                    height: !!_statusOptions.height && !_controlConfig.lock,
                    top: !!_statusOptions.top && !_controlConfig.lock,
                    left: !!_statusOptions.left && !_controlConfig.lock
                }
                //根据resizeHandles判断
                _statusOptions.width = !!_statusOptions.width && (!_controlConfig.resizeHandles || _controlConfig.resizeHandles == "all" || _controlConfig.resizeHandles.indexOf("e") != -1 || _controlConfig.resizeHandles.indexOf("w") != -1);
                _statusOptions.height = !!_statusOptions.height && (!_controlConfig.resizeHandles || _controlConfig.resizeHandles == "all" || _controlConfig.resizeHandles.indexOf("n") != -1 || _controlConfig.resizeHandles.indexOf("s") != -1);
            } else {
                _statusOptions = { width: false, height: false, top: false, left: false }
            }
        } else { //多模块
            /*
            $.each(_currentBox.$focusSingleBox, function (i, _el) {
                var controlId = Kdo.box.utils.getBoxControlId($(_el)),
                    controlConfig = Kdo.data.controls.get(controlId)[0];
            });
            */

            //暂定开放全部功能
        }
        return _statusOptions;
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
            inputResize: {
                get: _inputResize().get,
                update: _inputResize().update,
                status: _status,
                on: _on,
                trigger: _trigger
            }
        }
    });
});