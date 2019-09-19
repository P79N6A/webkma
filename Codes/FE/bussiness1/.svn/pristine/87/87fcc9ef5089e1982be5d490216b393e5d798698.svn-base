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
       线宽
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
                        f.ondrag(m.round(m.max(0, to / max) * 10), to);
                        b.getSelection ? b.getSelection().removeAllRanges() : g.selection.empty();
                    };
                    g.onmouseup = function () {
                        Kdo.featurer.selectable_fn.enable();
                        this.onmousemove = null;
                        //操作记录
                        if (_change_value != 0) {
                            Kdo.featurer.actionLogs.log();
                        }
                    }
                };
            },
            ondrag: function (pos, x) {
                this.step.style.width = Math.max(0, x) + 'px';
                this.title.innerHTML = pos;
                if (pos == 0) {
                    pos = 1;
                }
                //设置输入框值
                $(".lanh-control-toolbar-setting").find(".inputsize input").val(pos);
                _updateBorderSize(pos);
            }
        }

        new scale('btn', 'bar', 'title');

        var valueKey = "";//改变size的属性：width、height
        if (_controlConfig.key == "controls_rectangle_horizontal") {
            valueKey = "height";
        } else if (_controlConfig.key == "controls_rectangle_vertical") {
            valueKey = "width";
        }

        $(".lanh-control-toolbar-setting").find(".inputsize input").on("keyup", function () {
            var $this = $(this), _val = $this.val();

            //输入框验证
            if (!_val) {
                _val = 1;
                //$this.val("1");
            } else if (_val > 10) {
                _val = 10;
                $this.val("10");
            } else if (!/^[0-9]*[1-9][0-9]*$/.test(_val)) {
                _val = 1;
                $this.val("1");
            }

            _updateBorderSize(_val);

            Kdo.featurer.actionLogs.log();
        });

        var _updateBorderSize = function (width) {
            width = parseFloat(width);
            var _width = window.Kdo.utils.actionMultiplication(width, 16);
            $(".lanh-control-toolbar-setting .bordersize-form .choose").css("width", _width + "px");
            if (width == 1) {
                $(".lanh-control-toolbar-setting .bordersize-form .btn-choose").css("left", _width + "px");
            } else {
                $(".lanh-control-toolbar-setting .bordersize-form .btn-choose").css("left", _width - 13 + "px");
            }
            $(".lanh-control-toolbar-setting .bordersize-form #title").html(width);

            var _controlConfig = Kdo.box.utils.getControlConfigById(_currentControlId);
            _controlConfig.data["borderSize"] = width;
            if (width > 1) {
                _controlConfig.style[valueKey] = width + 6 + "px";
            } else {
                _controlConfig.style[valueKey] = "6px";
            }
            Kdo.data.controls.update(_controlConfig);

            //刷新选中模块
            Kdo.box.utils.refresh();
        }
    }

    //透明度进度条html
    var _html = function () {
        var _width = 0;
        if (!!_controlConfig.data["borderSize"] || _controlConfig.data["borderSize"] == 0) {
            _width = window.Kdo.utils.actionMultiplication(_controlConfig.data["borderSize"], 16);
        }

        var _$borderSizeHtml = '<div class="bordersize-form"><div class="graphical"><div class="scale_panel">'
            + '<div class="scale" id="bar">'
            + '<div class="choose" style="width: ' + _width + 'px;"></div>'
            + '<div id="btn" class="btn-choose" style="left: ' + _width + 'px;"><div></div></div>'
            + '</div>'
            + '</div>'
            + '<span id="title">' + window.Kdo.utils.actionDivision(_width, 16) + '</span></div>'
            + '<div class="inputsize"><input type="text" class="form-control form-input" value="' + window.Kdo.utils.actionDivision(_width, 16) + '"/></div><div style="float: left;margin-left: 5px;margin-top: -6px;">px</div></div>';

        return _$borderSizeHtml;
    }

    $.extend(true, window.Kdo, {
        settings: {
            borderSize: {
                load: _load,
                render: _render,
                html: _html
            }
        }
    });
});