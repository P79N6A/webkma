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
    上、下、左、右移动功能
*/
    //延迟执行函数
    var _timeOutEvent = null;
    var _updateControlConfig = function ($target) {
        Kdo.featurer.updateBoxPosition();
        //实时刷新工具栏
        Kdo.toolbar.refresh();
        //当触发keyup时记录当前move操作的记录。(一次性事件)
        $(document).off("keyup.move").on("keyup.move", function (event) {
            Kdo.featurer.actionLogs.log();
            $(document).off("keyup.move");
            //重新选中已选中模块（刷新）
            Kdo.box.temp.enter(Kdo.box.utils.getCurrentBox().$focusSingleBox);
        });
    }

    var _left = function ($target) {
        if (!$target || $target.length == 0 || $target.draggable("option", "disabled")) return;
        if ($target.draggable("option", "axis") == "y") return;
        //var _left = $target.position().left;
        Kdo.box.temp.filterByClass("lock");
        var _left = parseFloat($target.css("left"));
        $target.css({ "left": (_left - 1) + "px" });
        
        _updateControlConfig($target);
    }
    var _right = function ($target) {
        if (!$target || $target.length == 0 || $target.draggable("option", "disabled")) return;
        if ($target.draggable("option", "axis") == "y") return;
        //var _left = $target.position().left;
        Kdo.box.temp.filterByClass("lock");
        var _left = parseFloat($target.css("left"));
        $target.css({ "left": (_left + 1) + "px" });
        _updateControlConfig($target);
    }
    var _up = function ($target) {
        if (!$target || $target.length == 0 || $target.draggable("option", "disabled")) return;
        if ($target.draggable("option", "axis") == "x") return;
        //var _top = $target.position().top;
        Kdo.box.temp.filterByClass("lock");
        var _top = parseFloat($target.css("top"));
        $target.css({ "top": (_top - 1) + "px" });
        _updateControlConfig($target);
    }
    var _down = function ($target) {
        if (!$target || $target.length == 0 || $target.draggable("option", "disabled")) return;
        if ($target.draggable("option", "axis") == "x") return;
        //var _top = $target.position().top;
        Kdo.box.temp.filterByClass("lock");
        var _top = parseFloat($target.css("top"));
        $target.css({ "top": (_top + 1) + "px" });
        _updateControlConfig($target);
    }
    $.extend(true, window.Kdo, {
        featurer: {
            move: {
                left: _left,
                right: _right,
                up: _up,
                down: _down
            }
        }
    })
});