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
    拖动元素的目标
*/
    var _dropTo = null;
    $.extend(true, window.Kdo, {
        featurer: {
            droppable: function ($element, _options) {
                var options = $.extend({
                    //tolerance: "pointer",
                    drop: function (event, ui) {
                        //该回调在嵌套层的时候不准确。不建议使用。
                        var self = this;
                        //console.log($(self).attr("id") + ": drop");
                    },
                    over: function (event, ui) {
                        var self = this;
                        //console.log($(self).attr("id") + ": over");
                        _dropTo = self;
                        //$(self).addClass("drop-state-active");
                    },
                    out: function (event, ui) {
                        var self = this;
                        //console.log($(self).attr("id") + ": out");
                        _dropTo = null;
                        //$(this).removeClass("drop-state-active");
                    },
                    deactivate: function (event, ui) {
                        var self = this;
                        //console.log($(self).attr("id") + ": deactivate");
                        //取消当前操作的模块所有父级元素的overflow（结合activate事件的恢复设置）
                        $(ui.helper).parents().css({ "overflow": "" });
                        if (!!_dropTo) {
                            var _css = {
                                "left": ($(ui.helper).offset().left - $(_dropTo).offset().left) + "px",
                                "top": ($(ui.helper).offset().top - $(_dropTo).offset().top) + "px"
                            }
                            $(ui.helper).css(_css);
                            $(_dropTo).append(ui.helper);
                            _dropTo = null;
                        }
                        //$(this).removeClass("drop-state-active");
                    },
                    activate: function (event, ui) {
                        var self = this;
                        //console.log($(self).attr("id") + ": activate");
                        //设置当前操作的模块所有父级元素的overflow，让操作的元素可以不受模块的限制显示在任意区域。
                        $(ui.helper).parents().css({ "overflow": "visible" });
                    }
                }, _options || {});
                $($element).droppable(options);
            }
        }
    })
});