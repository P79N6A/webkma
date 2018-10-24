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
    放大缩小
*/
    $.extend(true, window.Kdo, {
        featurer: {
            resizable: function ($element, _options) {
                var options = $.extend({
                    autoHide: false,
                    handles: "all",
                    zIndex: 10090,
                    start: function (event, ui) {
                        Kdo.box.temp.filterByClass("lock");
                        //计算box的size比例
                        Kdo.box.utils.resize.calculateRateSize($(ui.helper));
                        //计算图片与吸附框的比例
                        Kdo.settings.adsorb.calculateRateSize($(ui.helper));
                        //吸附框是否为等比例缩放
                        Kdo.settings.adsorb.isAspectRatio($element);
                        Kdo.box.utils.resize.resizeStart($(ui.helper));
                    },
                    resize: function (event, ui) {
                        //实时改变模块大小
                        Kdo.box.utils.resize.updateSize($(ui.helper));
                        //实时改变吸附框图片大小
                        Kdo.settings.adsorb.updateSize($(ui.helper));
                        //改变大小时隐藏旋转按钮
                        Kdo.featurer.rotate.buttonHide($(ui.helper));
                        // add by clark 工具栏的值需要实时更新
                        Kdo.toolbar.refresh();
                    },
                    stop: function (event, ui) {
                        Kdo.box.utils.resize.clean();
                        //---------------更新拖动模块的大小 START---------------
                        Kdo.featurer.updateBoxSize();
                        Kdo.featurer.updateBoxPosition();
                        //操作记录
                        Kdo.featurer.actionLogs.log();
                        //刷新选中模块
                        Kdo.box.utils.refresh();
                        Kdo.box.utils.resize.resizeStop($(ui.helper));
                        //---------------更新拖动模块的大小 END---------------
                        // add by clark 工具栏的值需要实时更新
                        Kdo.toolbar.refresh();
                    }
                }, _.clone(_options || {}));
                $($element).resizable(options);
            },
            resizable_fn: {
                buildOptions: function (controlConfig) {
                    var _lock = !!controlConfig && controlConfig.lock == true || !!controlConfig.global,
                        _handles = !!controlConfig ? controlConfig.resizeHandles : "all";
                    _handles = _handles || "all";
                    //将all转换成各属性便于做筛选操作
                    if (_handles == "all") _handles = "n,e,s,w,ne,se,sw,nw";
                    if (!!controlConfig && controlConfig.stretch == true) {
                        //排除左右操作
                        _handles = _.without(_handles.split(","), "w", "e", "ne", "nw", "se", "sw").join(",");
                    }
                    //判断模块是否为固定
                    switch (controlConfig.fixed) {
                        case "top":     //不支持上拉动
                            _handles = _.without(_handles.split(","), "n", "ne", "nw").join(",");
                            break;
                        case "bottom":  //不支持下拉动
                            _handles = _.without(_handles.split(","), "s", "se", "sw").join(",");
                            break;
                    }
                    return {
                        disabled: _lock || !_handles,
                        handles: _handles || "none",
                        aspectRatio: !!controlConfig && controlConfig.aspectRatio == true && !controlConfig.stretch
                    }
                },
                dotStyle: function ($element) {
                    var _dotStyle = function ($element, type) {
                        switch (type) {
                            case 2://angle >= 20 && angle < 70
                                $element.find(".ui-resizable-s").addClass("rb");
                                $element.find(".ui-resizable-sw").addClass("bm");
                                $element.find(".ui-resizable-w").addClass("lb");
                                $element.find(".ui-resizable-nw").addClass("lm");
                                $element.find(".ui-resizable-n").addClass("lt");
                                $element.find(".ui-resizable-ne").addClass("tm");
                                $element.find(".ui-resizable-e").addClass("rt");
                                $element.find(".ui-resizable-se").addClass("rm");
                                break;
                            case 3://angle >= 70 && angle < 110
                                $element.find(".ui-resizable-s").addClass("rm");
                                $element.find(".ui-resizable-sw").addClass("rb");
                                $element.find(".ui-resizable-w").addClass("bm");
                                $element.find(".ui-resizable-nw").addClass("lb");
                                $element.find(".ui-resizable-n").addClass("lm");
                                $element.find(".ui-resizable-ne").addClass("lt");
                                $element.find(".ui-resizable-e").addClass("tm");
                                $element.find(".ui-resizable-se").addClass("rt");
                                break;
                            case 4://angle >= 110 && angle < 160
                                $element.find(".ui-resizable-s").addClass("rt");
                                $element.find(".ui-resizable-sw").addClass("rm");
                                $element.find(".ui-resizable-w").addClass("rb");
                                $element.find(".ui-resizable-nw").addClass("bm");
                                $element.find(".ui-resizable-n").addClass("lb");
                                $element.find(".ui-resizable-ne").addClass("lm");
                                $element.find(".ui-resizable-e").addClass("lt");
                                $element.find(".ui-resizable-se").addClass("tm");
                                break;
                            case 5://angle >= 160 && angle < 200
                                $element.find(".ui-resizable-s").addClass("tm");
                                $element.find(".ui-resizable-sw").addClass("rt");
                                $element.find(".ui-resizable-w").addClass("rm");
                                $element.find(".ui-resizable-nw").addClass("rb");
                                $element.find(".ui-resizable-n").addClass("bm");
                                $element.find(".ui-resizable-ne").addClass("lb");
                                $element.find(".ui-resizable-e").addClass("lm");
                                $element.find(".ui-resizable-se").addClass("lt");
                                break;
                            case 6://angle >= 200 && angle < 250
                                $element.find(".ui-resizable-s").addClass("lt");
                                $element.find(".ui-resizable-sw").addClass("tm");
                                $element.find(".ui-resizable-w").addClass("rt");
                                $element.find(".ui-resizable-nw").addClass("rm");
                                $element.find(".ui-resizable-n").addClass("rb");
                                $element.find(".ui-resizable-ne").addClass("bm");
                                $element.find(".ui-resizable-e").addClass("lb");
                                $element.find(".ui-resizable-se").addClass("lm");
                                break;
                            case 7://angle >= 250 && angle < 290
                                $element.find(".ui-resizable-s").addClass("lm");
                                $element.find(".ui-resizable-sw").addClass("lt");
                                $element.find(".ui-resizable-w").addClass("tm");
                                $element.find(".ui-resizable-nw").addClass("rt");
                                $element.find(".ui-resizable-n").addClass("rm");
                                $element.find(".ui-resizable-ne").addClass("rb");
                                $element.find(".ui-resizable-e").addClass("bm");
                                $element.find(".ui-resizable-se").addClass("lb");
                                break;
                            case 8://angle >= 290 && angle < 340
                                $element.find(".ui-resizable-s").addClass("lb");
                                $element.find(".ui-resizable-sw").addClass("lm");
                                $element.find(".ui-resizable-w").addClass("lt");
                                $element.find(".ui-resizable-nw").addClass("tm");
                                $element.find(".ui-resizable-n").addClass("rt");
                                $element.find(".ui-resizable-ne").addClass("rm");
                                $element.find(".ui-resizable-e").addClass("rb");
                                $element.find(".ui-resizable-se").addClass("bm");
                                break;
                            case 1://默认||angle >= 340 || angle < 20
                            default:
                                $element.find(".ui-resizable-s").addClass("bm");
                                $element.find(".ui-resizable-sw").addClass("lb");
                                $element.find(".ui-resizable-w").addClass("lm");
                                $element.find(".ui-resizable-nw").addClass("lt");
                                $element.find(".ui-resizable-n").addClass("tm");
                                $element.find(".ui-resizable-ne").addClass("rt");
                                $element.find(".ui-resizable-e").addClass("rm");
                                $element.find(".ui-resizable-se").addClass("rb");
                                break;
                        }

                    }
                    if ($element.hasClass("temp") || $element.hasClass("group")) {
                        _dotStyle($element);
                        return;
                    }
                    var _controlConfig = "",
                        _controlConfigs = Kdo.data.controls.get(Kdo.box.utils.getBoxControlId($element));
                    if (_controlConfigs.length > 0) _controlConfig = _controlConfigs[0];


                    //缩放点处理
                    //if ($element.children(".ui-resizable-s").length > 0) {
                    if (!_controlConfig || (!!_controlConfig.resizeHandles && _controlConfig.resizeHandles == "none")) {
                    } else {
                        var resizableCss = ["lt", "rt", "lb", "rb", "tm", "bm", "lm", "rm"];
                        //去掉原有样式
                        $.each($element.find(".ui-resizable-handle"), function (i, el) {
                            $.each(resizableCss, function (i, item) {
                                $(el).removeClass(item);
                            })
                        })

                        //设置box圆点鼠标样式
                        var angle = 0;
                        if (!!$element[0].style && !!$element[0].style.transform) {
                            var arrayAngle = $element[0].style.transform.match(/[0-9\.]+(?=deg)/g);
                            if (!!arrayAngle && arrayAngle.length > 0) {
                                angle = parseFloat(arrayAngle[0]);
                            }
                        }

                        var type = 0;
                        if (angle >= 340 || angle < 20) {
                            type = 1;
                        } else if (angle >= 20 && angle < 70) {
                            type = 2;
                        } else if (angle >= 70 && angle < 110) {
                            type = 3;
                        } else if (angle >= 110 && angle < 160) {
                            type = 4;
                        } else if (angle >= 160 && angle < 200) {
                            type = 5;
                        } else if (angle >= 200 && angle < 250) {
                            type = 6;
                        } else if (angle >= 250 && angle < 290) {
                            type = 7;
                        } else if (angle >= 290 && angle < 340) {
                            type = 8;
                        }
                        _dotStyle($element, type);
                    }
                }
            }
        }
    })
});