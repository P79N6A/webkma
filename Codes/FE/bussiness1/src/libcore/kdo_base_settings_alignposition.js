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
      对齐
    */
    var _currentBox = null;    //存储当前选中的模块数据，每次load时更新。
    var _$alignposition = {}, _positonArray = ["top", "middle", "bottom", "left", "center", "right", "pageCenter"];

    var _currentControlId;
    var _load = function (controlId) {
        _currentControlId = controlId;
    }

    var _html = function () {
        _$alignposition = $('<div class="alignposition-form">'
            + '<div class="pull-left top" data-align="align-top" data-toggle="tooltip" data-placement="bottom" title="顶部对齐"><i class="iconfont icon-align-top"></i></div>'
            + '<div class="pull-left middle" data-align="vertical-alignment" data-toggle="tooltip" data-placement="bottom" title="上下居中" style="display:none;"><i class="iconfont icon-vertical-alignment"></i></div>'
            + '<div class="pull-left bottom" data-align="bottom-alignment" data-toggle="tooltip" data-placement="bottom" title="底部对齐"><i class="iconfont icon-bottom-alignment"></i></div>'
            + '<div class="pull-left left" data-align="left-justified" data-toggle="tooltip" data-placement="bottom" title="左对齐"><i class="iconfont icon-left-justified"></i></div>'
            + '<div class="pull-left center" data-align="horizontal-alignment" data-toggle="tooltip" data-placement="bottom" title="左右居中" style="display:none;"><i class="iconfont icon-horizontal-alignment"></i></div>'
            + '<div class="pull-left right" data-align="align-right" data-toggle="tooltip" data-placement="bottom" title="右对齐"><i class="iconfont icon-align-right"></i></div>'
            + '<div class="pull-left pageCenter" data-align="page-center" data-toggle="tooltip" data-placement="bottom" title="页面水平居中"><i class="iconfont icon-yemianshuipingjuzhong"></i></div>'
            + '</div>');
        //功能是否可用状态
        var _$status = Kdo.featurer.align.position.status();
        _.each(_positonArray, function (item, i) {
            if (!_$status[item]) {
                _$alignposition.find("." + item).addClass("enabled");
            }
        })
        if (_currentBox.focusLevel == "temp") {//框选多模块 
            _$alignposition.find(".middle").show();
            _$alignposition.find(".center").show();
        }
        return _$alignposition;
    }

    var _render = function () {
        _$alignposition.find("div[data-align]").off("click.alignposition").on("click.alignposition", function (event) {
            var $target = $(event.currentTarget);
            if ($target.hasClass("enabled")) return false;
            switch ($target.data("align")) {
                case "align-top":            //顶部对齐
                    Kdo.featurer.align.position.top();
                    break;
                case "vertical-alignment":            //上下居中
                    Kdo.featurer.align.position.middle();
                    break;
                case "bottom-alignment":            //底部对齐
                    Kdo.featurer.align.position.bottom();
                    break;
                case "left-justified":            //左对齐
                    Kdo.featurer.align.position.left();
                    break;
                case "horizontal-alignment":            //左右居中
                    Kdo.featurer.align.position.center("module");
                    break;
                case "align-right":            //右对齐
                    Kdo.featurer.align.position.right();
                    break;
                case "page-center":            //页面居中
                    Kdo.featurer.align.position.center("page");
                    break;
            }
        });
    }

    $.extend(true, window.Kdo, {
        settings: {
            alignposition: {
                load: _load,
                render: _render,
                html: _html
            }
        }
    });
});