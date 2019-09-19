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
      边框
    */
    var _currentControlId;
    var _load = function (controlId) {
        _currentControlId = controlId;
    }

    var _render = function ($element) {
        var borderWidth = {
            $el: $element.find("#borderWidth"),
            obj: null
        }
        var _controlConfig = Kdo.box.utils.getControlConfigById(_currentControlId);
        borderWidth.obj = Kdo.components.inputNumber.init(borderWidth.$el, { value: parseFloat(_controlConfig.data["borderWidth"]) });
        borderWidth.$el.on("borderWidthChange", function (event, data) {
            _controlConfig.data["borderWidth"] = data.value + "px";
            //更新模块数据
            Kdo.data.controls.update(_controlConfig);
            //刷新选中模块
            Kdo.box.utils.refresh();
            //操作记录
            Kdo.featurer.actionLogs.log();
        });
    }

    var _html = function () {
        var $tpl = $('<div>边框：<div id="borderWidth" min="0" max="20" step="0.5" precision="1" change="borderWidthChange"></div></div>');
        return $tpl;
    }


    $.extend(true, window.Kdo, {
        settings: {
            border: {
                load: _load,
                render: _render,
                html: _html
            }
        }
    });
});