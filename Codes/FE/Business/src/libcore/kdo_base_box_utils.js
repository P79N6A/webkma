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
        缩放元素内部自适应
    
        * 遗留问题: 如果有元素是auto的情况下，会自适应临时框的宽度（造成模块跟着比例增长的假象）    remark by Dyllon
    */
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

    //预算每个box元素的size比例
    var _calculateRateSize = function ($element) {
        //计算每个子box与当前操作box的比例
        $.each($element.find(".box"), function (i, _box) {
            var _$box = $(_box),
                rateOptions = {
                    "left": _accDiv(parseFloat(_$box.css("left")), $element.width()),
                    "top": _accDiv(parseFloat(_$box.css("top")), $element.height()),
                    "width": _accDiv(parseFloat(_$box.css("width")), $element.width()),
                    "height": _accDiv(parseFloat(_$box.css("height")), $element.height())
                }
            //如果box为比例缩放，则计算模块的比例值。
            //if (!!_$box.resizable("option", "aspectRatio")) {
            //    var _width = parseFloat(_$box.css("width")),
            //        _height = parseFloat(_$box.css("height"));
            //    rateOptions.aspectRatio = { "width": 1, "height": 1 }
            //    //对比例缩放进行精确优化（以最大值为除数，避免结果值大于1。）
            //    if (_width > _height) {
            //        rateOptions.aspectRatio.height = _accDiv(_height, _width);
            //    } else if (_width < _height) {
            //        rateOptions.aspectRatio.width = _accDiv(_width, _height);
            //    }
            //    rateOptions.width = _accMul(rateOptions.aspectRatio.width, rateOptions.width);
            //    rateOptions.height = _accMul(rateOptions.aspectRatio.height, rateOptions.height);
            //}
            _$box.attr("rateOptions", JSON.stringify(rateOptions));
        });
    }

    //根据每个box的size比例设置size属性
    var _updateSize = function ($element) {
        //设置子级每个box的size
        $.each($element.find(".box"), function (i, _box) {
            var _$box = $(_box),
                rateOptions = _$box.attr("rateOptions");
            if (!!rateOptions) {
                rateOptions = JSON.parse(rateOptions);
                var _cssOptions = {
                    "left": _accMul($element.width(), rateOptions.left) + "px",
                    "top": _accMul($element.height(), rateOptions.top) + "px",
                    "width": _box.style.width == "auto" ? "auto" : _accMul($element.width(), rateOptions.width),
                    "height": _box.style.height == "auto" ? "auto" : _accMul($element.height(), rateOptions.height)
                }

                //按比例缩放
                //if (!!rateOptions.aspectRatio) {
                //    if (rateOptions.aspectRatio.width == 1) {
                //        if (_cssOptions.width != "auto") _cssOptions.width = _accMul(rateOptions.aspectRatio.width, _cssOptions.width);
                //        if (_cssOptions.height != "auto") _cssOptions.height = _accMul(rateOptions.aspectRatio.height, _cssOptions.width);
                //    } else if (rateOptions.aspectRatio.height == 1) {
                //        if (_cssOptions.width != "auto") _cssOptions.width = _accMul(rateOptions.aspectRatio.width, _cssOptions.height);
                //        if (_cssOptions.height != "auto") _cssOptions.height = _accMul(rateOptions.aspectRatio.height, _cssOptions.height);
                //    }
                //}

                //补全单位
                if (_cssOptions.width != "auto") _cssOptions.width = _cssOptions.width + "px";
                if (_cssOptions.height != "auto") _cssOptions.height = _cssOptions.height + "px";

                _$box.css(_cssOptions);
            }
        });
    }

    //清理属性
    var _clean = function () {
        $(".box[rateOptions]").attr("rateOptions", null);
    }

    //获取当前盒子（当前鼠标所在盒子 和 当前页面激活的盒子）
    var _getCurrentBox = function (event) {
        var _$target = !!event ? $(event.target) : $("");
        //targetBox & targetLevel: 当前鼠标所在元素的box
        //focusBox & focusLevel: 当前激活的box
        var obj = {
            $targetBox: _$target.parents(".box.single,.box.group,.box.temp").last(),
            targetLevel: "",
            $focusBox: $(".box .ui-resizable-handle:visible:first").parents(".box").last(),
            focusLevel: "",
            $focusSingleBox: null   //当前激活的single box集合
        }
        if (obj.$targetBox.length == 0) {
            if (_$target.hasClass("box")) {
                obj.$targetBox = _$target;
            } else {
                obj.$targetBox = $(".ui-resizable-resizing,.ui-draggable-dragging").first();
            }
        }
        if (obj.$targetBox.hasClass("box temp")) obj.targetLevel = "temp";
        else if (obj.$targetBox.hasClass("box single")) obj.targetLevel = "single";
        else if (obj.$targetBox.hasClass("box group")) obj.targetLevel = "group";
        if (obj.$focusBox.hasClass("box temp")) obj.focusLevel = "temp";
        else if (obj.$focusBox.hasClass("box single")) obj.focusLevel = "single";
        else if (obj.$focusBox.hasClass("box group")) obj.focusLevel = "group";

        switch (obj.focusLevel) {
            case "temp":
                obj.$focusSingleBox = obj.$focusBox.children(".box.single,.box.group");
                break;
            case "group":
            case "single":
            default:
                obj.$focusSingleBox = obj.$focusBox;
                break;
        }
        //obj.$focusSingleBox = obj.focusLevel == "temp" ? obj.$focusBox.children(".box.on") : obj.$focusBox;
        return obj;
    }

    //根据ControlID获取Box DOM元素
    var _getBoxElement = function (controlId) {
        var _$box = null,
            _$controlHTML = Kdo.container.$background().find("div[id='" + controlId + "']:first");
        if (_$controlHTML.length > 0) {
            _$box = _$controlHTML.parent();
        }
        return _$box;
    }

    var _getBoxControlId = function (_$box) {
        if ($(_$box).hasClass("box group")) {
            return $(_$box).attr("id");
        } else {
            return $(_$box).children("div[id^='control_']").attr("id");
        }
    }

    var _getControlConfigById = function (id) {
        return _.find(Kdo.data.page.controls, function (control) { return control.controlId == id });
    }

    //刷新选中模块
    //参数为接收非选中模块的，但需要更新的controlIds(可以不传递)
    var _refresh = function (controlIds) {
        var _selectedControlIds = [],   //当前"已选中"的模块（不包含groupId)
            _rangeControlIds = [];      //获取这次操作需要涉及到的所有模块controlId（不包含groupId）

        //临时保存已选中的模块，用于恢复之后重新选中。
        $.each(Kdo.featurer.getSelectedBox(Kdo.container.$background()), function (i, _el) {
            var _$box = $(_el);
            if (_$box.hasClass("group")) {
                $.each(_$box.find(".box.single"), function (i, _box) { _selectedControlIds.push(_getBoxControlId(_box)); });
            } else {
                _selectedControlIds.push(_getBoxControlId(_$box));
            }
        });

        //从当前“已选中模块id与外部controlIds”集合中，挖掘兄弟模块（即部分single模块为group的子模块时，需要把group下的其它single模块也一并获取出来）
        _.each(_.union(_selectedControlIds, controlIds || []), function (id) {
            var _$box = Kdo.container.$background().find("div[id='" + id + "']");
            //如果当前不是box，则查询模块最外层的box。（single or group）
            if (!_$box.hasClass("box")) {
                _$box = _$box.parents(".box:not(.temp)").last();
            }
            //将模块中的controlId添加到_rangeControlIds对象中。
            if (_$box.hasClass("single")) {
                _rangeControlIds.push(_getBoxControlId(_$box));
            } else if (_$box.hasClass("group")) {
                $.each(_$box.find(".box.single"), function (i, el) { _rangeControlIds.push(_getBoxControlId(el)); });
            }
            //清理模块
            _$box.remove();
        });
        //去除重复Id
        _rangeControlIds = _.uniq(_rangeControlIds);

        //重新render页面dom元素
        _.each(_rangeControlIds, function (controlId) {
            var _$box = Kdo.container.$background().find("div[id='" + controlId + "']").parents(".box:first");
            Kdo.page.create.repair(Kdo.data.controls.get(controlId));
        });

        //进行组合恢复操作
        Kdo.featurer.group.repair(_rangeControlIds);

        //重新选中“恢复前已选中”模块
        var _$selectedControls = null;
        $.each(_selectedControlIds, function (i, controlId) {
            var _$box = Kdo.container.$background().find("div[id='" + controlId + "']");
            //single模块的controlId在于box内部元素，而组合模块的id在于box上。
            if (!_$box.hasClass("box")) _$box = _$box.parents(".box.single,.box.group").last();
            _$selectedControls = _$selectedControls == null ? _$box : _$selectedControls.add(_$box);
        });
        Kdo.box.temp.enter($(_$selectedControls));
    }

    var _resizeOverflow = function (overflow, $el) {
        if ($el.hasClass("temp")) {
            $el.children(".box").css({ "overflow": overflow });
        } else {
            $el.css({ "overflow": overflow });
        }
    }

    $.extend(true, window.Kdo, {
        box: {
            utils: {
                resize: {
                    calculateRateSize: _calculateRateSize,
                    updateSize: _updateSize,
                    clean: _clean,
                    resizeStart: function ($el) { _resizeOverflow("hidden", $el); },
                    resizeStop: function ($el) { _resizeOverflow("", $el); }
                },
                getCurrentBox: _getCurrentBox,
                getBoxControlId: _getBoxControlId,
                getBoxElement: _getBoxElement,
                getControlConfigById: _getControlConfigById,
                refresh: _refresh
            }
        }
    });
});