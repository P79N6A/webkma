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
       颜色选择器
    */
    var _caches = [];
    var _currentControlId;
    var _load = function (controlId) {
        _currentControlId = controlId;
    }

    //渲染一个color块（UI）
    var _html = function () {
        var _$chooseColors = "";
        //固定从data中读取"_chooseColors"属性，并且该属性必须是数组。则判定为颜色选择器设置对象
        var _controlConfig = Kdo.box.utils.getControlConfigById(_currentControlId);
        if (!!_controlConfig.data && !!_.isArray(_controlConfig.data._chooseColors)) {
            _.each(_controlConfig.data._chooseColors, function (color, index) {
                var _$template = $('<div class="pull-left choose-color"  data-index="{0}"><input class="chooseColors{0}" /></div>'.replace("{0}", index).replace("{0}", index).replace("{1}", color));
                _$chooseColors = _$chooseColors == "" ? _$template : _$chooseColors.add(_$template);
            });
        }
        return _$chooseColors;
    }

    var _render = function () {
        //固定从data中读取"_chooseColors"属性，并且该属性必须是数组。则判定为颜色选择器设置对象
        var _controlConfig = Kdo.box.utils.getControlConfigById(_currentControlId);
        if (!!_controlConfig.data && !!_.isArray(_controlConfig.data._chooseColors)) {
            _.each(_controlConfig.data._chooseColors, function (color, index) {
                _init_color(index, color, _controlConfig.controlId);
            });
        }
    }

    var _destroy = function () {
        if (_caches && _caches.length > 0) {
            _.each(_caches, function (_$el, index) {
                _$el.spectrum("destroy");
                _$el.remove();
                $(".full-spectrum").remove();
            });
            _caches = [];
        }
    }

    //颜色选择器
    var _init_color = function (_index, _color, controlId) {
        var _$el = $(".chooseColors" + _index).spectrum({
            allowEmpty: true,
            color: _color,
            showInput: true,
            showPalette: true,
            showSelectionPalette: false,
            showAlpha: false,
            showButtons: false,
            maxPaletteSize: 10,
            preferredFormat: "hex",
            localStorageKey: "spectrum.demo",
            containerClassName: "full-spectrum",
            beforeShow: function (e, color) {
                //收回工具栏
                //Kdo.floatbar.actions_child_hide();
            },
            move: function (color) {
                var _currentBox = Kdo.box.utils.getCurrentBox(),
                    _$box = _currentBox.$focusSingleBox;
                if (Kdo.box.utils.getBoxControlId(_$box) == _$el.attr("control-id")) _refresh(_index, color);
            },
            change: function (color) {
                var _currentBox = Kdo.box.utils.getCurrentBox(),
                    _$box = _currentBox.$focusSingleBox;
                if (Kdo.box.utils.getBoxControlId(_$box) == _$el.attr("control-id")) _refresh(_index, color, true);
            },
            palette: $.spectrum.customOptions.palette
        });
        $(".chooseColors" + _index).on("dragstop.spectrum", function (e, color) {
            _refresh(_index, color, true);
        });
        _$el.attr("control-id", controlId);
        _caches.push(_$el);
    }

    var _refresh = function (_index, color, record) {
        var _controlConfig = Kdo.box.utils.getControlConfigById(_currentControlId);
        if (!!color) {
            _controlConfig.data._chooseColors[_index] = color.toHexString();
        } else {
            _controlConfig.data._chooseColors[_index] = "none";
        }
        var _currentBox = Kdo.box.utils.getCurrentBox();
        if (_currentBox.focusLevel == "single") {
            //更新模块数据
            Kdo.data.controls.update(_controlConfig);

            //获取当前选中模块
            var _$box = _currentBox.$focusSingleBox;
            //删除模块的HTML元素
            _$box.children("div[id^='control']").remove();
            //获取模块编译后(Repair行为)的HTML重新添加到box中
            _$box.append(Kdo.page.create.buildHTML(_controlConfig));

            //操作记录
            if (record) Kdo.featurer.actionLogs.log();

            //刷新选中模块  7.25
            Kdo.box.utils.refresh();
        }
    }

    $.extend(true, window.Kdo, {
        settings: {
            chooseColors: {
                load: _load,
                render: _render,
                destroy: _destroy,
                html: _html
            }
        }
    });
});