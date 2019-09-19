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
        拖拽元素功能
    */
    $.extend(true, window.Kdo, {
        featurer: {
            draggable: function ($element, _options) {
                var options = $.extend({
                    tolerance: "pointer",
                    snap: "[id^='content-'],.box,[id^='guide-'],.staffLeftLine,.staffTopLine",
                    //snap: "[id^='guide-']",
                    snapTolerance: 10,
                    addClasses: false,
                    cursor: "move",
                    refreshPositions: true,
                    stop: function (event, ui) {
                        Kdo.featurer.guideLine.hide();
                        //---------------更新拖动模块的坐标 START---------------
                        Kdo.featurer.updateBoxPosition();
                        //操作记录
                        Kdo.featurer.actionLogs.log();
                        //重新选中已选中模块（刷新）
                        Kdo.box.temp.enter(Kdo.box.utils.getCurrentBox().$focusSingleBox);
                        //---------------更新拖动模块的坐标 END---------------
                        // add by clark 工具栏的值需要实时更新
                        Kdo.toolbar.refresh();
                    },
                    drag: function (event, ui) {
                        Kdo.featurer.guideLine.show(ui.helper, event, ui);

                        // add by clark 工具栏的值需要实时更新
                        Kdo.toolbar.refresh();
                    },
                    start: function (event, ui) {
                        var _currentBox = Kdo.box.utils.getCurrentBox();
                        if (_currentBox.focusLevel == "single") {
                            ui.helper.data("ui-draggable").offset.relative.top = -Kdo.featurer.rotate.rotateStyle($element).hdistance;
                            ui.helper.data("ui-draggable").offset.relative.left = -Kdo.featurer.rotate.rotateStyle($element).wdistance;
                        }

                        Kdo.box.temp.filterByClass("lock");
                        Kdo.featurer.guideLine.init({
                            el: '#content',
                            current: ui.helper
                        }, true);
                    }
                }, _options || {});
                $($element).draggable(options);
            },
            draggable_fn: {
                buildOptions: function (controlConfig) {
                    var _lock = !!controlConfig && controlConfig.lock == true || !!controlConfig.fixed || !!controlConfig.global,
                        _axis = false;
                    if (controlConfig.stretch == true) _axis = "y";
                    return {
                        disabled: _lock,
                        axis: _axis
                    }
                }
            }
        }
    })
});