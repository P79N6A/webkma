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
       透明度选择器
    */
    var _currentControlId;
    var _load = function (controlId) {
        _currentControlId = controlId;
    }


    //渲染透明度的进度条（UI）
    var _render = function () {
        var scale = function (btn, bar, title) {
            this.btn = document.getElementById(btn);
            this.bar = document.getElementById(bar);
            this.title = document.getElementById(title);
            this.step = this.bar.getElementsByTagName("div")[0];
            this.init();
        };
        var _controlConfig = Kdo.box.utils.getControlConfigById(_currentControlId);
        var inputNumber = Kdo.components.inputNumber.init($("#opacityNumber"), { value: (1 - _controlConfig.inner.style["opacity"]) * 100 });

        scale.prototype = {
            init: function () {
                var f = this, g = document, b = window, m = Math;
                f.btn.onmousedown = function (e) {
                    Kdo.featurer.selectable_fn.disable();
                    var _change_value = 0;
                    var x = (e || b.event).clientX;
                    var l = this.offsetLeft;
                    var max = f.bar.offsetWidth - this.offsetWidth;
                    g.onmousemove = function (e) {
                        var thisX = (e || b.event).clientX;
                        var to = m.min(max, m.max(-2, l + (thisX - x)));
                        _change_value = to;
                        f.btn.style.left = to + 'px';
                        f.ondrag(m.round(m.max(0, to / max) * 100), to);
                        b.getSelection ? b.getSelection().removeAllRanges() : g.selection.empty();
                    };
                    g.onmouseup = function () {
                        Kdo.featurer.selectable_fn.enable();
                        this.onmousemove = null;
                        //操作记录
                        if (_change_value != 0) {
                            Kdo.featurer.actionLogs.log();
                        }
                        g.onmouseup = null;
                    }
                };
            },
            ondrag: function (pos, x) {
                var _controlConfig = Kdo.box.utils.getControlConfigById(_currentControlId);
                this.step.style.width = Math.max(0, x) + 'px';
                // this.title.innerHTML = pos;
                _controlConfig.inner.style["opacity"] = 1 - (pos / 100);
                inputNumber.setValue(pos);
                Kdo.data.controls.update(_controlConfig);
                //刷新选中模块
                Kdo.box.utils.refresh();
            }
        }

        new scale('btn', 'bar', 'title');
        $("#opacityNumber").on("opacityChange", (event, data) => {
            var _controlConfig = Kdo.box.utils.getControlConfigById(_currentControlId);
            _controlConfig.inner.style["opacity"] = 1 - (data.value / 100);
            Kdo.data.controls.update(_controlConfig);
            //刷新选中模块
            Kdo.box.utils.refresh();
        });
    }

    //透明度进度条html
    var _html = function () {
        var _controlConfig = Kdo.box.utils.getControlConfigById(_currentControlId);
        var _width = 0;
        //if (!!_controlConfig.style["opacity"] || _controlConfig.style["opacity"] == 0) {
        if (!!_controlConfig.inner.style["opacity"] || _controlConfig.inner.style["opacity"] == 0) {
            _width = window.Kdo.utils.actionMultiplication(window.Kdo.utils.actionSubtraction(100, window.Kdo.utils.actionMultiplication(_controlConfig.inner.style["opacity"], 100)), 1);
        }

        var _$opacityHtml = '<div class="opacity-form"><span class="pull-left title">透明度</span><div class="scale_panel pull-left">'
            + '<div class="scale" id="bar">'
            + '<div class="choose" style="width: ' + _width + 'px;"></div>'
            + '<div id="btn" class="btn-choose" style="left: ' + _width + 'px;"><div></div></div>'
            + '</div>'
            + '</div>'
            + '<div id="opacityNumber" min="0" max="100" step="1" precision="0" change="opacityChange"></div></div>'
        // + '<span id="title"  class="pull-left">' + parseInt(window.Kdo.utils.actionDivision(_width, 1)) + '</span></div>';

        // var _$opacityHtml =
        //     '<div class="opacity-form"><span class="pull-left title">透明度</span>'
        //     + '<div class="scale_panel pull-left">'
        //     + '</div>'
        //     + '</div>'
        return _$opacityHtml;
    }

    $.extend(true, window.Kdo, {
        settings: {
            opacity: {
                load: _load,
                render: _render,
                html: _html
            }
        }
    });
});