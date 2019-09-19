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
    旋转
*/
    var _isRotating = false;  //判断当前是否在执行旋转动作

    var _binder = function (_$box) {
        var _controlConfig = null;
        _$box.find(".rotate").on("mousedown.rotate", function (event) {
            var _controlConfigs = Kdo.data.controls.get(Kdo.box.utils.getBoxControlId(_$box));
            if (_controlConfigs.length > 0) _controlConfig = _controlConfigs[0];
            //debugger
            //屏蔽拖拽、框选
            _$box.draggable({ disabled: true });
            //_$box.selectable({ disabled: true });
            Kdo.featurer.selectable_fn.disable();

            var $button = $(this),
                $body = Kdo.container.$body(),
                $modular = _$box.children("div[id^='control_']"),
                _angle = 0;//旋转角度

            $(document).on("mousemove.rotate", function (event) {
                //隐藏坐标工具栏
                //Kdo.floatbar.attach();
                //Kdo.propertybar.attach();

                var angle = 0, x = 0, y = 0, a = 0, b = 0;
                x = event.pageX - ($body.offset().left + parseInt(_$box.css("left")) + $modular.width() / 2);
                y = event.pageY - (parseInt(_$box.css("top")) + $modular.height() / 2) - 185;//185为wap头部高度，50为pc头部高度
                if (x < 0) { a = -x; } else { a = x; }
                if (y < 0) { b = -y; } else { b = y; }
                angle = Math.atan(a / b) * 180 / Math.PI;

                if (x <= 0 && y >= 0) { angle = angle; }//0-90
                if (x < 0 && y <= 0) { angle = 180 - angle; }//90-180
                if (x >= 0 && y <= 0) { angle = 180 + angle; }//180-270
                if (x >= 0 && y > 0) { angle = 360 - angle; }//270-360

                if (angle > 360) { angle = 360 - angle; }
                _angle = angle;

                $button.find("span").html(parseInt(angle) + "°");

                var rotate = [], _transform = "";
                var scaleRe = /(scale)\([\-0-9\,]+?\)/;

                var boxCssTransform = _controlConfig.style["transform"];
                //是否已进行翻转
                if (!!boxCssTransform) {
                    var scale = boxCssTransform.match(scaleRe);
                    if (!!scale) {
                        _transform += scale[0];
                    }
                }

                _transform += "rotate(" + angle + "deg)";

                _$box.css({
                    "transform": _transform,
                    "-ms-transform": _transform, 	/* IE 9 */
                    "-moz-transform": _transform, 	/* Firefox */
                    "-webkit-transform": _transform, /* Safari 和 Chrome */
                    "-o-transform": _transform
                });

                _isRotating = true;   //旋转时修改状态
            });

            $(document).one("mouseup.rotate", function (event) {
                $(document).off("mousemove.rotate");

                //打开拖拽、框选
                _$box.draggable({ disabled: false });
                //_$box.selectable({ disabled: false });
                Kdo.featurer.selectable_fn.enable();

                if (_isRotating) {//是否进行旋转
                    var _transform = "";
                    var scaleRe = /(scale)\([\-0-9\,]+?\)/;

                    var boxCssTransform = _controlConfig.style["transform"];
                    //是否已进行翻转
                    if (!!boxCssTransform) {
                        var scale = boxCssTransform.match(scaleRe);
                        if (!!scale) {
                            _transform += scale[0];
                        }
                    }
                    _transform += "rotate(" + _angle + "deg)";

                    if (!!_controlConfig.style.transform && _angle < 1) {
                        delete _controlConfig.style["transform"];
                        delete _controlConfig.style["-ms-transform"];
                        delete _controlConfig.style["-moz-transform"];
                        delete _controlConfig.style["-webkit-transform"];
                        delete _controlConfig.style["-o-transform"];
                    } else if (_angle != 0) {
                        _controlConfig.style["transform"] = _transform;
                        _controlConfig.style["-ms-transform"] = _transform;
                        _controlConfig.style["-moz-transform"] = _transform;
                        _controlConfig.style["-webkit-transform"] = _transform;
                        _controlConfig.style["-o-transform"] = _transform;
                    }
                    //更新模块对象
                    Kdo.data.controls.update(_controlConfig);
                    //操作记录
                    Kdo.featurer.actionLogs.log();
                    //刷新选中模块
                    Kdo.box.utils.refresh();
                }

                _isRotating = false;  //复位旋转状态
            });
        });
    }

    //旋转以后宽、高、距离计算
    var _rotateStyle = function ($box) {
        var style = {
            width: 0,
            height: 0,
            wdistance: 0,
            hdistance: 0
        }
        var width = 0, height = 0;
        var _controlId = Kdo.box.utils.getBoxControlId($box),
              _controlConfig = Kdo.data.controls.get(_controlId)[0];
        if (!_controlId || _controlId.indexOf("group_") == -1 || !_controlConfig) {
            width = $box.outerWidth();
            height = $box.outerHeight();
        } else {
            width = parseFloat(_controlConfig.style.width);
            height = parseFloat(_controlConfig.style.height);
        }
        var w = 0, h = 0, angle = 0;
        if (!!_controlConfig && !!_controlConfig.style && !!_controlConfig.style.transform) {
            var arrayAngle = _controlConfig.style.transform.match(/[0-9\.]+(?=deg)/g);
            if (!!arrayAngle && arrayAngle.length > 0) {
                angle = parseFloat(arrayAngle[0]);
            }
            if (angle > 90 && angle <= 180) {
                angle = 180 - angle;
            }
            else if (angle > 180 && angle <= 270) {
                angle -= 180;
            }
            else if (angle > 270 && angle <= 360) {
                angle = 360 - angle;
            }
            w = Math.cos(angle * Math.PI / 180) * width + Math.sin(angle * Math.PI / 180) * height;
            h = Math.sin(angle * Math.PI / 180) * width + Math.cos(angle * Math.PI / 180) * height;
            style.width = w;
            style.height = h;
            style.wdistance = (w - parseFloat($box.width())) / 2;
            style.hdistance = (h - parseFloat($box.height())) / 2;
        } else {
            style.width = width;
            style.height = height;
        }
        return style;
    }

    //隐藏旋转按钮
    var _buttonHide = function ($box) {
        var _currentBox = Kdo.box.utils.getCurrentBox();
        if (_currentBox.focusLevel == "single") {
            $box.find(".rotate").hide();
        }
    }

    //显示旋转按钮
    var _buttonShow = function ($box) {
        var _currentBox = Kdo.box.utils.getCurrentBox();
        if (_currentBox.focusLevel == "single") {
            $box.find(".rotate").show();
        }
    }

    //旋转按钮图标位置
    var _buttonPostion = function ($box, controlConfig) {
        var _controlConfig = controlConfig || Kdo.data.controls.get(Kdo.box.utils.getBoxControlId($box))[0];
        $box.find(".rotate").css({ "left": parseInt(_controlConfig.style.width) / 2 - parseInt($box.find(".rotate i").width()) / 2 + "px" });
    }

    //计算可用状态
    var _status = function () {
        var _isRotated = false;
        var _currentBox = Kdo.box.utils.getCurrentBox();
        var _controlConfig = Kdo.data.controls.get(Kdo.box.utils.getBoxControlId(_currentBox.$focusBox))[0];

        if (_currentBox.focusLevel == "single" && _controlConfig.style.transform && _controlConfig.style.transform.match(/[0-9\.]+(?=deg)/g) != 0) {
            _isRotated = true;
        }
        return {
            isRotating: _isRotating,
            isRotated: _isRotated
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
            rotate: {
                binder: _binder,
                status: _status,
                rotateStyle: _rotateStyle,
                buttonHide: _buttonHide,
                buttonShow: _buttonShow,
                buttonPostion: _buttonPostion
            }
        }
    })
});