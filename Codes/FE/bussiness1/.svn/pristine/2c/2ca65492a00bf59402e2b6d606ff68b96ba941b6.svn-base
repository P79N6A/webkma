let structConfig = require("../../config/design/struct");

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
        文字模块编辑
    */
    var _currentControlId;
    var _load = function (controlId) {
        _currentControlId = controlId;
    }

    var _save = function (_controlConfig) {
        Kdo.data.controls.update(_controlConfig);
        //刷新选中模块
        Kdo.box.utils.refresh();
        // 刷新box框大小
        var _$box = Kdo.box.utils.getCurrentBox().$focusSingleBox;
        Kdo.box.utils.getCurrentBox().$focusSingleBox.css("height", _$box.find(".note-editable").height() + "px");
        Kdo.featurer.updateBoxSize();
        //操作记录
        Kdo.featurer.actionLogs.log();
    }

    var _fontName = function (val) {
        var _controlConfig = Kdo.box.utils.getControlConfigById(_currentControlId);
        if (_controlConfig) {
            _controlConfig.inner.style["font-family"] = val;
            _save(_controlConfig);
        }
    }

    var _fontSize = function (val) {
        var _controlConfig = Kdo.box.utils.getControlConfigById(_currentControlId);
        if (_controlConfig) {
            _controlConfig.inner.style["font-size"] = val;
            _save(_controlConfig);
        }
    }

    var _foreColor = function (val) {
        var _controlConfig = Kdo.box.utils.getControlConfigById(_currentControlId);
        if (_controlConfig) {
            _controlConfig.inner.style["color"] = val;
            _save(_controlConfig);
        }
    }

    var _backColor = function (val) {
        var _controlConfig = Kdo.box.utils.getControlConfigById(_currentControlId);
        if (_controlConfig) {
            _controlConfig.inner.style["background-color"] = val;
            _save(_controlConfig);
        }
    }

    var _fontBold = function (val) {
        var _controlConfig = Kdo.box.utils.getControlConfigById(_currentControlId);
        if (_controlConfig) {
            _controlConfig.inner.style["font-weight"] = !!val ? "bold" : "normal";
            _save(_controlConfig);
        }
    }

    var _fontItalic = function (val) {
        var _controlConfig = Kdo.box.utils.getControlConfigById(_currentControlId);
        if (_controlConfig) {
            _controlConfig.inner.style["font-style"] = !!val ? "italic" : "normal";
            _save(_controlConfig);
        }
    }


    var _fontTextAlign = function (val) {
        var _controlConfig = Kdo.box.utils.getControlConfigById(_currentControlId);
        if (_controlConfig) {
            _controlConfig.inner.style["text-align"] = val;
            _save(_controlConfig);
        }
    }

    var _fontTextDecoration = function (val) {
        var _controlConfig = Kdo.box.utils.getControlConfigById(_currentControlId);
        if (_controlConfig) {
            _controlConfig.inner.style["text-decoration"] = val;
            _save(_controlConfig);
        }
    }

    var _lineHeight = function (val) {
        var _controlConfig = Kdo.box.utils.getControlConfigById(_currentControlId);
        if (_controlConfig) {
            _controlConfig.inner.style["line-height"] = val;
            _save(_controlConfig);
        }
    }

    var _fontRemoveFormat = function () {
        var _controlConfig = Kdo.box.utils.getControlConfigById(_currentControlId);
        if (_controlConfig) {
            _controlConfig.inner.style = Kdo.utils.copy(structConfig.default.text.inner.style)
            _save(_controlConfig);
        }
    }

    $.extend(true, window.Kdo, {
        featurer: {
            fonteditor: {
                fontName: _fontName,
                fontSize: _fontSize,
                foreColor: _foreColor,
                backColor: _backColor,
                fontBold: _fontBold,
                fontItalic: _fontItalic,
                fontTextAlign: _fontTextAlign,
                fontTextDecoration: _fontTextDecoration,
                lineHeight: _lineHeight,
                fontRemoveFormat: _fontRemoveFormat,
                load: _load
            }
        }
    });
});