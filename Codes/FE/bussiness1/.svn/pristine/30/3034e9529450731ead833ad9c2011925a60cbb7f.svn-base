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
    var _baseUpdateBox = function (type) {
        var _currentBox = Kdo.box.utils.getCurrentBox(),
            _controlConfigs = [];
        var _callback = function (_$el) {
            var _controlId = Kdo.box.utils.getBoxControlId(_$el),
                _controlConfig = Kdo.data.controls.get(_controlId);
            if (_controlConfig.length > 0) {
                _controlConfig = _controlConfig[0];
                var _boxPositionSize = {
                    //"left": (_$el.position().left + (_currentBox.focusLevel != "single" ? _currentBox.$focusBox.position().left : 0)) + "px",
                    //"top": (_$el.position().top + (_currentBox.focusLevel != "single" ? _currentBox.$focusBox.position().top : 0)) + "px",
                    "left": parseFloat(_$el[0].style.left),
                    "top": parseFloat(_$el[0].style.top),
                    "width": _controlConfig.style.width == "auto" ? "auto" : _$el.width() + "px",
                    "height": _controlConfig.style.height == "auto" ? "auto" : _$el.height() + "px"
                }
                $.each(_$el.parents(".box"), function (i, _el) {
                    var _position = $(_el).position();
                    _boxPositionSize["left"] += _position.left;
                    _boxPositionSize["top"] += _position.top;
                });
                _boxPositionSize["left"] = _boxPositionSize["left"] + "px";
                _boxPositionSize["top"] = _boxPositionSize["top"] + "px";

                switch (type) {
                    case "size":
                        _controlConfig.style = $.extend(_controlConfig.style, {
                            "width": _boxPositionSize.width,
                            "height": _boxPositionSize.height
                        });
                        break;
                    case "position":
                        _controlConfig.style = $.extend(_controlConfig.style, {
                            "left": _boxPositionSize.left,
                            "top": _boxPositionSize.top
                        });
                        break;
                    default:
                        _controlConfig.style = $.extend(_controlConfig.style, _boxPositionSize);
                        break;
                }
                _controlConfigs.push(_controlConfig);
            }
        }
        $.each(_currentBox.$focusSingleBox, function (i, _el) {
            var _$el = $(_el);
            if (_$el.hasClass("group")) {
                $.each(_$el.children(".box.single"), function (i, _box) {
                    _callback($(_box));
                });
            } else {
                _callback($(_el));
            }
        });
        Kdo.data.controls.update(_controlConfigs);
    }
    window.Kdo = $.extend(true, window.Kdo || {}, {
        featurer: {
            //_config:{
            //    selector: {
            //        selected: "[id^='oper_control_']:not([isgroup]).on",

            //    }
            //},
            getSelectedBox: function ($element) {
                return $element.find(".box.on:not(.child)");    //这里的not(.child)暂时没有实际意义（在selectable中的start和stop做了处理）
            },
            //更新box的size到control(JSON)对象中
            updateBoxSize: function () {
                _baseUpdateBox("size");
            },
            updateBoxPosition: function () {
                _baseUpdateBox("position");
            }
        }
    });
});