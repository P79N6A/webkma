(function(global, factory) {
    "use strict";
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = global.document ?
            factory(global, true) :
            function(w) {
                return factory(w);
            };
    } else {
        factory(global);
    }
})(typeof window !== "undefined" ? window : this, function(window) {
    'use strict';
    /*
       更新
    */
    var _currentControlId;
    var _load = function (controlId) {
        _currentControlId = controlId;
    }

    var _html = function() {

    }

    var _render = function() {
        var _controlConfig = Kdo.box.utils.getControlConfigById(_currentControlId);
        _updateControl(_controlConfig, function(_newConfig) {
            //更新control的json
            Kdo.data.controls.update(_newConfig);
            //刷新选中模块
            Kdo.box.utils.refresh();

            Kdo.utils.messenger.info("模块更新成功！");

            Kdo.featurer.actionLogs.log();
        });
    }

    //更新control
    var _updateControl = function(_controlConfig, callback) {
        var _controlConfigOriginal = {};
        var _newConfig = {};

        if (!!_controlConfig.struct && !!_controlConfig.key) {
            if (_controlConfig.struct == "image" || _controlConfig.struct == "svg") {
                _controlConfigOriginal = Kdo.menus.getStruct(_controlConfig.struct);
            }
            //else if (_controlConfig.struct == "svg") {
            //    //var searchOptions = {
            //    //    materialId=
            //    //};
            //    //Kdo.materialService.searchMaterial(searchOptions, function () {

            //    //})

            //    $.ajax({
            //        global: false, url: _controlConfig.defaultTemplate.html + timespan, dataType: "text",
            //        success: function (result) {
            //            if (controlConfig.struct == "svg" && $(result).length > 0 && $(result)[0].type == "application/json") {
            //                var svgData = JSON.parse($($(result)[0]).html());
            //                $.extend(controlConfig, svgData);
            //            }

            //            _controlConfigOriginal = Kdo.menus.getStruct(_controlConfig.struct);

            //            $.extend(true, _newConfig, _controlConfig, _controlConfigOriginal);
            //            $.extend(true, _newConfig.data, _controlConfigOriginal.data, _controlConfig.data);
            //            $.extend(true, _newConfig.style, _controlConfigOriginal.style, _controlConfig.style);
            //            _callback();
            //        }
            //    });

            //}
            else {
                if (_controlConfig.key == "controls_rectangle_002") {
                    _controlConfig.key = "controls_rectangle_horizontal";
                }

                _controlConfigOriginal = Kdo.menus.getMenuInfo(_controlConfig.key, "mobile" /*Kdo.utils.getQueryString("webType")*/);
            }
            if (!_controlConfigOriginal) {
                console.log(_controlConfig);
                return false;
            }
            $.extend(true, _newConfig, _controlConfig, _controlConfigOriginal);
            $.extend(true, _newConfig.data, _controlConfigOriginal.data, _controlConfig.data);
            $.extend(true, _newConfig.style, _controlConfigOriginal.style, _controlConfig.style);
        } else {
            _newConfig = _controlConfig;
        }
        Kdo.page.create.load(_newConfig, function(_newConfig) {
            callback(_newConfig);
        }, true);

    }

    $.extend(true, window.Kdo, {
        settings: {
            update: {
                load: _load,
                html: _html,
                render: _render,
                updateControl: _updateControl
            }
        }
    });
});