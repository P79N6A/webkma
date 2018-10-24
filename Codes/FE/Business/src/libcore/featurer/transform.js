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
    翻转控制: 水平翻转、垂直翻转
*/
    var _transform = function (direction) {
        var _controlConfig = null;
        var _currentBox = Kdo.box.utils.getCurrentBox(),
               _$box = _currentBox.$focusBox;
        if (_currentBox.focusLevel == "single") {
            var _controlConfigs = Kdo.data.controls.get(Kdo.box.utils.getBoxControlId(_$box));
            if (_controlConfigs.length > 0) _controlConfig = _controlConfigs[0];
        }

        //var scaleValueRe = /-?(\d+\.)?\d+/g, scaleRe = /(scale)\([\-0-9\,]+?\)/, rotateRe = /(rotate)\([0-9\.a-zA-Z]+?\)/;

        //var boxCssTransform = _controlConfig.style["transform"];
        //if (!boxCssTransform || boxCssTransform.indexOf("scale") == -1) {//初始scale值
        //    scale = [1, 1];
        //} else {//获取已翻转值
        //    var scaleOld = boxCssTransform.match(scaleRe)[0];
        //    if (!!scaleOld) { scale = scaleOld.match(scaleValueRe); }
        //}
        //debugger
        var scale = [], _transform = "", scaleValueRe = /-?(\d+\.)?\d+/g;
        var scaleOld = _controlConfig.inner.style["transform"];
        if (!scaleOld) {//初始scale值
            scale = [1, 1];
        } else {//获取已翻转值
            scale = scaleOld.match(scaleValueRe);
        }

        //进行翻转
        var x = scale[0], y = scale[1];
        switch (direction) {
            case "horizontal":  //水平翻转
                if (!!_status().horizontal) {
                    scale[0] = x * -1;
                    _controlConfig.inner.style["filter"] = "FlipH";
                }
                break;
            case "vertical":    //垂直翻转
                if (!!_status().vertical) {
                    scale[1] = y * -1;
                    _controlConfig.inner.style["filter"] = "FlipV";
                }
                break;
        }
        var scaleStr = scale.join(",");

        _transform += "scale(" + scaleStr + ")";

        _controlConfig.inner.style["-moz-transform"] = _transform;
        _controlConfig.inner.style["-webkit-transform"] = _transform;
        _controlConfig.inner.style["-o-transform"] = _transform;
        _controlConfig.inner.style["transform"] = _transform;
        Kdo.data.controls.update(_controlConfig);
        //操作记录
        Kdo.featurer.actionLogs.log();
        //刷新选中模块
        Kdo.box.utils.refresh();
    }

    //计算可用状态
    var _status = function () {
        var _currentBox = Kdo.box.utils.getCurrentBox();
        return {
            horizontal: _currentBox.focusLevel == "single",
            vertical: _currentBox.focusLevel == "single"
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
            transform: {
                transformForHorizontal: function () { _transform("horizontal") },
                transformForVertical: function () { _transform("vertical") },
                status: _status,
                on: _on
            }
        }
    })
});