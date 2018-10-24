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
       吸附框编辑
    */
    var _attachControlConfig = null,    //临时缓存正在编辑的模块对象
        _statusOptions = {
            dragging: false,
            resizing: false,
            editing: false
        };

    //计算精度修正(除法)
    var _accDiv = function (arg1, arg2) {
        var t1 = 0, t2 = 0, r1, r2;
        try { t1 = arg1.toString().split(".")[1].length } catch (e) { }
        try { t2 = arg2.toString().split(".")[1].length } catch (e) { }

        r1 = Number(arg1.toString().replace(".", ""));
        r2 = Number(arg2.toString().replace(".", ""));
        return (r1 / r2) * Math.pow(10, t2 - t1);
    }
    //计算精度修正(乘法)
    var _accMul = function (arg1, arg2) {
        var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
        try { m += s1.split(".")[1].length } catch (e) { }
        try { m += s2.split(".")[1].length } catch (e) { }
        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
    }

    //计算图片与吸附框的比例
    var _calculateRateSize = function ($element) {
        $.each($element.find("#inner"), function (i, _box) {
            var _$box = $(_box),
                rateOptions = {
                    "left": _accDiv(parseFloat(_$box.css("left")), $element.width()),
                    "top": _accDiv(parseFloat(_$box.css("top")), $element.height()),
                    "width": _accDiv(parseFloat(_$box.css("width")), $element.width()),
                    "height": _accDiv(parseFloat(_$box.css("height")), $element.height())
                }
            _$box.attr("rateOptions", JSON.stringify(rateOptions));
        });
    }

    //设置inner图片的size
    var _updateSize = function ($element) {
        $.each($element, function (i, _box) {
            var _$box = $(_box),
                _$inner = _$box.children("div[id^='control_']").find("#inner"),
                rateOptions = _$inner.attr("rateOptions");

            var _controlConfig = Kdo.data.controls.get(Kdo.box.utils.getBoxControlId(_$box))[0];

            if (!_controlConfig || _controlConfig.struct != "adsorb") return;

            if (_controlConfig.data.view.endsWith("adsorb_placeholder.svg")) {
                _fullSize(_$box, _controlConfig.data);
            } else if (!!rateOptions) {
                rateOptions = JSON.parse(rateOptions);
                var _cssOptions = {
                    "left": _accMul($element.width(), rateOptions.left) + "px",
                    "top": _accMul($element.height(), rateOptions.top) + "px",
                    "width": _$inner.css("width") == "auto" ? "auto" : _accMul($element.width(), rateOptions.width),
                    "height": _$inner.css("height") == "auto" ? "auto" : _accMul($element.height(), rateOptions.height)
                }

                //补全单位 
                if (_cssOptions.width != "auto") _cssOptions.width = _cssOptions.width + "px";
                if (_cssOptions.height != "auto") _cssOptions.height = _cssOptions.height + "px";

                _$inner.css(_cssOptions);
            }
        });
    }


    //是否为等比例缩放
    var _isAspectRatio = function ($element) {
        var img = $element.find("#inner_body img").attr("src");
        if (!!img && img.indexOf("http://") != -1) {
            $element.resizable("option", "aspectRatio", true);
        }
    }

    //等比例铺满外层大小
    var _fullSize = function (_$box, options) {
        var _controlConfig = Kdo.data.controls.get(Kdo.box.utils.getBoxControlId(_$box))[0];
        if (_controlConfig.struct != "adsorb") return;
        //设置内层元素的属性
        var _$inner = _$box.children("div[id^='control_']:first").find("#inner");
        _$inner.css({
            "left": options["left"],
            "top": options["top"],
            "width": options["width"],
            "height": options["height"]
        });
        if (options.view != _$inner.find("img").attr("src")) _$inner.find("img").attr("src", options.view || "");
        //读取图片的真实大小填充吸附框
        //计算宽高最小Size
        var _maxSize = {
            width: Math.abs(parseFloat(options["left"])) + _$box.width(),
            height: Math.abs(parseFloat(options["top"])) + _$box.height()
        },
            _diffSize = {
                width: _maxSize.width - parseFloat(options.width),
                height: _maxSize.height - parseFloat(options.height)
            },
            _targetSize = {
                width: 0,
                height: 0
            }

        if (_diffSize.width > _diffSize.height) {
            _targetSize.width = _maxSize.width;
            _targetSize.height = _targetSize.width * parseFloat(options.originalHeight) / parseFloat(options.originalWidth);
        } else {
            _targetSize.height = _maxSize.height;
            _targetSize.width = _targetSize.height * parseFloat(options.originalWidth) / parseFloat(options.originalHeight);
        }

        //设置大小(填充满——图片大小 小于 外框大小)
        if (_diffSize.width > 0 || _diffSize.height > 0) {
            _$inner.css({
                "width": _targetSize["width"] + "px",
                "height": _targetSize["height"] + "px"
            });
        }
    }

    //保存当前内层图片信息到ControlConfig中
    var _setInnerImageData = function (_$inner, _controlConfig) {
        _controlConfig.data["view"] = _$inner.find("img").attr("src");
        _controlConfig.data["left"] = _$inner.css("left");
        _controlConfig.data["top"] = _$inner.css("top");
        _controlConfig.data["width"] = _$inner.css("width");
        _controlConfig.data["height"] = _$inner.css("height");
        //console.log(_controlConfig.data);
    }

    //绑定吸附框的吸附功能（drop）
    var _binder = function ($boxes) {
        $.each($boxes, function (index, _box) {
            //判断是吸附框模块则增加droppable功能
            var _$box = $(_box);
            if (Kdo.data.controls.get(Kdo.box.utils.getBoxControlId(_$box))[0].struct == "adsorb") {
                var _preData = {};
                _$box.droppable({
                    accept: "div.ui-draggable.ui-draggable-handle[data-struct='image'],.box.single[data-adsorb='allow']",   //这里需要限制为菜单素材的图片和已存在的图片模块
                    tolerance: "pointer",
                    greedy: true,
                    over: function (event, ui) {
                        var self = this,
                            _controlConfig = Kdo.data.controls.get(Kdo.box.utils.getBoxControlId(_$box))[0],
                            _$img = _$box.find("img");
                        _preData = Kdo.utils.copy(_controlConfig.data);

                        _$img.attr("src", (function () {
                            var _view = "";
                            if (ui.draggable.hasClass("box")) {
                                //用已存在的box进行吸附
                                var _controlConfig = Kdo.data.controls.get(Kdo.box.utils.getBoxControlId(ui.draggable))[0];
                                _view = _controlConfig.data.src;
                            } else {
                                //用左侧导航的素材进行吸附
                                _view = ui.draggable.find("img").attr("src");
                            }
                            return _view;
                        })());
                        _readImage(_$img.attr("src"), function (img) {
                            var w = parseFloat(img.width),
                                h = parseFloat(img.height),
                                _boxW = _$box.width(),
                                _boxh = _$box.height(),
                                fixW = img.width,
                                fixH = img.height;

                            if (Math.abs(w - _boxW) > Math.abs(h - _boxh)) {
                                fixW = _boxW;
                                fixH = _boxW * h / w;
                            } else {
                                fixW = w * _boxh / h;
                                fixH = _boxh;
                            }

                            //等比例铺满外层大小
                            _fullSize(_$box, {
                                "view": _$img.attr("src"),
                                "left": "0px",
                                "top": "0px",
                                "width": fixW + "px",
                                "height": fixH + "px",
                                "originalWidth": img.width,
                                "originalHeight": img.height,
                                "change": true
                            });
                        });
                    },
                    out: function (event, ui) {
                        var self = this;
                        //等比例铺满外层大小
                        _fullSize(_$box, _preData);
                    },
                    drop: function (event, ui) {
                        var self = this,
                            _controlConfig = Kdo.data.controls.get(Kdo.box.utils.getBoxControlId(_$box))[0],
                            _$img = _$box.find("img");
                        //如果吸附的是“已存在”的元素，则删除该模块元素。
                        if (ui.draggable.hasClass("box")) {
                            Kdo.data.controls.del(Kdo.box.utils.getBoxControlId(ui.draggable));
                            ui.draggable.remove();
                        }
                        _readImage(_$img.attr("src"), function (img) {
                            _controlConfig.data["originalWidth"] = img.width;
                            _controlConfig.data["originalHeight"] = img.height;
                            //保存当前内层图片信息到controlConfig中
                            _setInnerImageData(_$box.children("div[id^='control_']:first").find("#inner"), _controlConfig);
                            //更新模块对象
                            Kdo.data.controls.set(_controlConfig);
                            //操作记录
                            Kdo.featurer.actionLogs.log();
                            //选中当前吸附框模块
                            Kdo.box.temp.enter(_$box);
                            //刷新选中模块
                            Kdo.box.utils.refresh();
                        });
                    }
                });

                //监听元素变动
                var _observer = new MutationObserver(function (mutationRecords) {
                    // console.log(mutationRecords);
                    if (_$box.children(".cover").is(":visible")) {
                        var _controlConfig = Kdo.data.controls.get(Kdo.box.utils.getBoxControlId(_$box))[0];
                        //等比例铺满外层大小
                        // console.log(_$box.height());
                        //_fullSize(_$box, _controlConfig.data);
                        //保存当前内层图片信息到ControlConfig中
                        _setInnerImageData(_$box.children("div[id^='control_']:first").find("#inner"), _controlConfig);
                        //更新模块对象
                        Kdo.data.controls.set(_controlConfig);
                    }
                });
                _observer.observe(_$box[0], {
                    //subtree: true,
                    attributes: true,
                    attributeOldValue: true,
                    attributeFilter: ['style']
                });
            }
        });
    }

    $("body").on("mousedown.adsorb.blur", function (event) {
        if (!!_attachControlConfig) {
            var _$el = $(event.target);
            if (_$el.attr("id") != _attachControlConfig.controlId &&
                _$el.parents("div[id='" + _attachControlConfig.controlId + "']").length == 0) {
                _close();
            }
        }
    });

    //改变attach模块对象的值
    var _updateInnerSize = function (position, size) {
        if (!!position) {
            _attachControlConfig.data.left = position.left + "px";
            _attachControlConfig.data.top = position.top + "px";
        }
        if (!!size) {
            _attachControlConfig.data.width = size.width + "px";
            _attachControlConfig.data.height = size.height + "px";
        }
    }

    //开启内层模块编辑模式
    var _open = function () {
        if (_statusOptions.editing == true) {
            return false;
        } else {
            //修改内层模块编辑状态
            _statusOptions.editing = true;
        }
        var _currentBox = Kdo.box.utils.getCurrentBox();
        if (_currentBox.focusLevel != "single") return false;
        var _$box = _currentBox.$focusSingleBox;
        var _$inner = _$box.children("div[id^='control_']:first").find("#inner");
        _attachControlConfig = Kdo.data.controls.get(Kdo.box.utils.getBoxControlId(_$box))[0];
        //如果没有设置view，则不允许编辑内层模块
        if (!_attachControlConfig.data.view) return false;

        _$box.children(".cover").hide();
        _$box.children("div[id='" + _attachControlConfig.controlId + "']").css({ "overflow": "visible" });
        _$box.children(".ui-resizable-handle").hide();

        //隐藏工具栏
        //Kdo.floatbar.hide();
        Kdo.propertybar.hide();
        //注册内层元素drag & resize行为
        (function (_$inner) {
            var _ratio = { width: 1, height: 1 };
            _$inner.resizable({
                autoHide: false,
                handles: "all",
                zIndex: 10090,
                aspectRatio: true,
                resize: function (event, ui) {
                    var _isResize = false,
                        _resize = function () {
                            //计算宽高最小Size
                            var _maxSize = {
                                width: Math.abs(ui.position.left) + _$box.width(),
                                height: Math.abs(ui.position.top) + _$box.height()
                            },
                                _diffSize = {
                                    width: _maxSize.width - ui.size.width,
                                    height: _maxSize.height - ui.size.height,
                                },
                                _maxDiff = Math.max(_diffSize.width, _diffSize.height);

                            _ratio.width = _diffSize.width >= _diffSize.height ? 1 : ui.helper.width() / ui.helper.height();
                            _ratio.height = _diffSize.height >= _diffSize.width ? 1 : ui.helper.height() / ui.helper.width();

                            var _targetSize = {
                                width: _maxDiff * _ratio.width + ui.size.width,
                                height: _maxDiff * _ratio.height + ui.size.height
                            }
                            //设置大小
                            ui.size.width = _targetSize.width;
                            ui.size.height = _targetSize.height;
                            ui.originalElement.width(_targetSize.width);
                            ui.originalElement.height(_targetSize.height);
                        }
                    if (ui.position.left > 0) {
                        ui.position.left = 0;
                    }
                    if (ui.position.top > 0) {
                        ui.position.top = 0;
                    }
                    if (ui.position.left + ui.size.width < _$box.width() ||
                        ui.position.top + ui.size.height < _$box.height()) {
                        _isResize = true;
                    }
                    if (!!_isResize) _resize();
                    //记录当前操作状态
                    _statusOptions.resizing = true;
                },
                stop: function (event, ui) {
                    $(document).one("mousedown.inner.resizing", function (event) {
                        //记录操作状态
                        _statusOptions.resizing = false;
                    });
                    // 模块尺寸修复
                    var _maxSize = {
                        width: Math.abs(ui.position.left) + _$box.width(),
                        height: Math.abs(ui.position.top) + _$box.height()
                    },
                        _diffSize = {
                            width: _maxSize.width - ui.helper.width(),
                            height: _maxSize.height - ui.helper.height(),
                        },
                        _targetSize = {
                            width: '',
                            height: ''
                        }
                    if ((_diffSize.width > _diffSize.height) && _diffSize.width > 0) {
                        _targetSize.width = _maxSize.width;
                        _targetSize.height = _targetSize.width * ui.helper.height() / ui.helper.width();
                    }
                    if ((_diffSize.height > _diffSize.width) && _diffSize.height > 0) {
                        _targetSize.height = _maxSize.height;
                        _targetSize.width = _targetSize.height * ui.helper.width() / ui.helper.height();
                    }

                    if (_diffSize.width > 0 || _diffSize.height > 0) {
                        ui.size.width = _targetSize.width;
                        ui.size.height = _targetSize.height;
                        ui.originalElement.width(_targetSize.width);
                        ui.originalElement.height(_targetSize.height);
                    }
                    _updateInnerSize(ui.position, ui.size);
                }
            });

            _$inner.draggable({
                drag: function (event, ui) {
                    var width = ui.helper.width(),
                        height = ui.helper.height(),
                        left = ui.position.left,
                        top = ui.position.top;

                    //计算边缘不可为空白
                    if (left >= 0) { ui.position.left = 0; }
                    else if (left + width < _$box.width()) { ui.position.left = _$box.width() - width; }
                    if (top >= 0) { ui.position.top = 0; }
                    else if (top + height < _$box.height()) { ui.position.top = _$box.height() - height; }
                    //记录当前操作状态
                    _statusOptions.dragging = true;
                },
                stop: function (event, ui) {
                    $(document).one("mousedown.inner.drag", function (event) {
                        //记录操作状态
                        _statusOptions.dragging = false;
                    });
                    //改变模块对象
                    _updateInnerSize(ui.position);
                }
            });
            _$inner.parent().css({ "overflow": "visible" });
        })(_$box.children("div[id^='control_']:first").find("#inner"));

        //外框圆点样式
        Kdo.featurer.resizable_fn.dotStyle(_$box);
    }

    //关闭内层模块编辑模式(以刷新模块的方式关闭——即重置)
    var _close = function () {
        if (!_attachControlConfig) return;
        var _$box = Kdo.container.$background().find("div[id^='" + _attachControlConfig.controlId + "']").parents(".box.single").first();
        //更新模块对象
        Kdo.data.controls.set(_attachControlConfig);
        //操作记录
        Kdo.featurer.actionLogs.log();
        //回选中当前操作模块（由于mouseup会重新选择其它模块或失去模块焦点。所以这里没有实际意义，为了流程完整而调用）
        Kdo.box.temp.enter(_$box);
        //刷新选中模块
        Kdo.box.utils.refresh();
        //清理临时缓存模块对象
        _attachControlConfig = null;
        //复位内层模块编辑状态
        _statusOptions.editing = false;
    }

    //重新设置内层大小（不记录日志，仅刷新或修复用）
    var _repairSize = function ($boxes) {
        $.each($boxes, function (index, _box) {
            var _$box = $(_box),
                _controlConfig = Kdo.data.controls.get(Kdo.box.utils.getBoxControlId(_$box))[0];
            if (_controlConfig.struct == "adsorb") {

                var w = parseFloat(_controlConfig.data.width),
                    h = parseFloat(_controlConfig.data.height),
                    _boxW = _$box.width(),
                    _boxh = _$box.height();

                if (_controlConfig.data.change) {
                    if (Math.abs(w - _boxW) > Math.abs(h - _boxh)) {
                        _controlConfig.data.width = _boxW;
                        _controlConfig.data.height = _boxW * h / w;
                    } else {
                        _controlConfig.data.width = w * _boxh / h;
                        _controlConfig.data.height = _boxh;
                    }
                }

                //等比例铺满外层大小
                _fullSize(_$box, _controlConfig.data);
                //保存当前内层图片信息到ControlConfig中
                _setInnerImageData(_$box.children("div[id^='control_']:first").find("#inner"), _controlConfig);
                //更新模块对象
                _controlConfig.data.change = null;
                Kdo.data.controls.set(_controlConfig);
            }
        });
    }

    var _status = function () {
        return _statusOptions;
    }

    var _readImage = function (path, callback) {
        var _img = new Image();
        _img.src = path;
        _img.onload = function () {
            _img.onload = null;
            callback(_img);
        }
    }

    //当发布mobile时，将吸附框inner的width、height转换为rem
    var _convertData = function (_$element, _controlConfig) {
        var _radix = 12;
        var _convert = function (value) {
            return parseFloat(parseInt(value) / _radix) + "rem";
        }
        var _width = _convert(_controlConfig.data.width),
            _height = _convert(_controlConfig.data.height),
            _top = _convert(_controlConfig.data.top),
            _left = _convert(_controlConfig.data.left);
        _$element.find("#inner").css({ "width": _width, "height": _height, "top": _top, "left": _left });
    }

    $.extend(true, window.Kdo, {
        settings: {
            adsorb: {
                open: _open,
                close: _close,
                binder: _binder,
                repairSize: _repairSize,
                status: _status,
                calculateRateSize: _calculateRateSize,
                updateSize: _updateSize,
                isAspectRatio: _isAspectRatio,
                convertData: _convertData
            }
        }
    });
});