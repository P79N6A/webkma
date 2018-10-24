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
        功能箱: 提供操作模块的盒子
        包含特点：
            * 放大缩小，组合放大缩小
            * 
    */

    var $canvs = null; //初始化时，传入的box作用域。

    //---------------------临时组合 START---------------------
    var _$box_temp = $('<div class="box temp module-group ui-widget-content"><div class="module_border top"></div><div class="module_border right"></div><div class="module_border bottom"></div><div class="module_border left"></div></div>');

    //将模块加入盒子(临时组合), $element传入模块列表
    var _tempEnter = function ($element) {
        _tempLeave();
        _groupLeave();
        _singleLeave();
        //Kdo.floatbar.hide();    //清楚floatbar选中状态
        Kdo.propertybar.hide();
        if (!$element) return;
        $element = $element.filter(function (el) { return $(el).parents(".box.group:first").length == 0 });  //过滤所有被组合的模块（即它们的上级存在group box的模块）
        if ($element.length == 0) return;
        if ($element.length > 1) $element = $element.filter(":not(.fixed)");    //如果是多选行为，则过滤fixed类型的模块。（fixed的模块禁止框选）
        if ($element.length > 1) $element = $element.filter(":not(.global)");    //如果是多选行为，则过滤global类型的模块。（global的模块禁止框选）
        if ($element.length > 1) $element = $element.filter(":not(.stretch)");    //如果是多选行为，则过滤stretch类型的模块。（stretch的模块禁止框选）

        if ($element.length == 1) { _singleEnter($element); return; }
        var _boxPosition = _tempCalculateSize($element);
        _$box_temp.resizable("option", "aspectRatio", false);   //重置临时组合box的等比例缩放为默认值(false)
        $.each($element, function (i, _el) {
            var _$el = $(_el);
            _$el.css({
                "left": (parseFloat(_el.style.left) - _boxPosition.left) + "px",
                "top": (parseFloat(_el.style.top) - _boxPosition.top) + "px"
            });
            _$el.addClass("on").draggable({ disabled: true }).resizable({ disabled: true });
            //判断临时组合中的所有元素是否存在等比例缩放模块，如果有，则将临时组合设置为等比例缩放

            window.Kdo._$box_temp = _$box_temp;
            if (_$el.resizable("option", "aspectRatio")) {
                _$box_temp.resizable("option", "aspectRatio", true);
            }
        });
        _$box_temp.css({
            "top": _boxPosition.top + "px",
            "left": _boxPosition.left + "px",
            "width": _boxPosition.width + "px",
            "height": _boxPosition.height + "px"
        });
        $element.parents("[id^='content']:first").append(_$box_temp);
        _$box_temp.append($element);
        _$box_temp.show();
        //判断临时组合中的所有元素是否都被lock，如果是，则禁用temp的drag和resize操作
        if (_$box_temp.children(".box.lock").length == _$box_temp.children(".box").length) {
            _$box_temp.addClass("lock").draggable({ disabled: true }).resizable({ disabled: true });
        } else {
            _$box_temp.removeClass("lock").draggable({ disabled: false }).resizable({ disabled: false });
        }
        //临时组合后，需要计算当前组合中的模块Size比例值。
        Kdo.box.utils.resize.calculateRateSize(_$box_temp);
        Kdo.toolbar.refresh();
        //临时组合也需要显示floatbar
        //Kdo.floatbar.attach(_$box_temp, { show: true });
        Kdo.propertybar.attach(_$box_temp, { show: true });

        //外框圆点样式
        Kdo.featurer.resizable_fn.dotStyle(_$box_temp);
    }

    //将目标元素从“临时组合Box”和“单模块Single”之间进行转换
    var _tempToggle = function ($element) {
        var _currentBox = Kdo.box.utils.getCurrentBox(),
            _$boxes = _currentBox.$focusSingleBox;

        if (_$boxes.length == 0) {   //如果临时组合中没有元素，则寻找已选中的单模块加上目标元素放入临时组合
            //如果是多个模块被选中，需要过滤所有通栏的模块。
            if (_$boxes.length > 1) {
                _tempEnter($canvs.find(".box.single.on,.box.group.on").not(".stretch").add($element));
            } else {
                _tempEnter($canvs.find(".box.single.on,.box.group.on").add($element));
            }
        } else {    //如果临时组合中有元素
            $.each($element, function (i, _el) {    //判断每一个元素
                //元素是否包含在临时组合中，做toggle切换操作。
                if ($.grep(_$boxes, function (n) { return Kdo.box.utils.getBoxControlId(n) == Kdo.box.utils.getBoxControlId(_el) }).length > 0) {
                    //反选
                    _$boxes = $.grep(_$boxes, function (n) { return Kdo.box.utils.getBoxControlId(n) != Kdo.box.utils.getBoxControlId(_el) });
                } else {
                    //选中(排除通栏模块)
                    if (!$(_el).hasClass("stretch")) {
                        _$boxes = _$boxes.add($(_el));
                    }
                }
            });
            var _$selectBox = null;
            $.each(_$boxes, function (i, _el) {
                _$selectBox = _$selectBox == null ? $(_el) : _$selectBox.add($(_el));
            });
            _tempEnter(_$selectBox);
        }
    }

    //将模块抛出盒子(临时解组)
    var _tempLeave = function () {
        var $children = _$box_temp.children(".box.single,.box.group");
        var boxPosition = _$box_temp.position();
        $.each($children, function (i, _el) {
            var _$el = $(_el),
                _lock = _$el.hasClass("lock");
            _$el.css({
                "left": (parseFloat(_el.style.left) + boxPosition.left) + "px",
                "top": (parseFloat(_el.style.top) + boxPosition.top) + "px"
            });
            _$el.removeClass("on").draggable({ disabled: _lock }).resizable({ disabled: _lock });
        });
        _$box_temp.parent().append($children);
        _resetBoxStyle(_$box_temp);

        //清除模块的Size比例值
        Kdo.box.utils.resize.clean();

        Kdo.toolbar.refresh();
        Kdo.contextMenu.hide();//add by clark 隐藏右键菜单
    }

    //筛选部分临时组合中的模块
    var _tempFilterByClass = function (hasClass) {
        var _currentBox = Kdo.box.utils.getCurrentBox();
        $.each(_currentBox.$focusSingleBox, function (i, _el) {
            var _$el = $(_el);
            if (_$el.hasClass(hasClass)) {
                var _position = _$el.position();
                _$el.css({
                    "left": (_position.left + _$box_temp.position().left) + "px",
                    "top": (_position.top + _$box_temp.position().top) + "px"
                });
                _$box_temp.parent().append(_$el);
            }
        });
    }

    //计算临时组合的size
    var _tempCalculateSize = function ($boxes) {
        var boxPosition = { left: 0, top: 0, width: 0, height: 0 }
        $.each($boxes, function (i, _el) {
            var _$el = $(_el),
                _position = _$el.position();
            boxPosition = $.extend(boxPosition, {
                left: (i == 0) ? _position.left : Math.min(_position.left, boxPosition.left),
                top: (i == 0) ? _position.top : Math.min(_position.top, boxPosition.top)
            });
        })
        $.each($boxes, function (i, _el) {
            var _$el = $(_el),
                _position = _$el.position(), _width = 0, _height = 0;
            if (_$el.hasClass("group")) {//框选中有组合
                _width = (i == 0) ? _position.left + _$el.width() - boxPosition.left : Math.max(boxPosition.width, _position.left + _$el.width() - boxPosition.left);
                _height = (i == 0) ? _position.top + _$el.height() - boxPosition.top : Math.max(boxPosition.height, _position.top + _$el.height() - boxPosition.top);
            } else {
                _width = (i == 0) ? _position.left + Kdo.featurer.rotate.rotateStyle(_$el).width - boxPosition.left : Math.max(boxPosition.width, _position.left + Kdo.featurer.rotate.rotateStyle(_$el).width - boxPosition.left);
                _height = (i == 0) ? _position.top + Kdo.featurer.rotate.rotateStyle(_$el).height - boxPosition.top : Math.max(boxPosition.height, _position.top + Kdo.featurer.rotate.rotateStyle(_$el).height - boxPosition.top);
            }
            boxPosition = $.extend(boxPosition, {
                //width: (i == 0) ? _position.left + _$el.width() - boxPosition.left : Math.max(boxPosition.width, _position.left + _$el.width() - boxPosition.left),
                //height: (i == 0) ? _position.top + _$el.height() - boxPosition.top : Math.max(boxPosition.height, _position.top + _$el.height() - boxPosition.top)
                width: _width,
                height: _height
            });
        });
        return boxPosition;
    }

    //刷新临时组合的size
    var _tempRefreshSize = function () {
        var _boxPosition = _tempCalculateSize(_$boxes); //TODO: 这里的boxes没有传递，该方法暂时没用，暂不修复。
        _$box_temp.css({
            "top": _boxPosition.top + "px",
            "left": _boxPosition.left + "px",
            "width": _boxPosition.width + "px",
            "height": _boxPosition.height + "px"
        });
    }
    //---------------------临时组合 END---------------------

    //---------------------单模块 START---------------------
    var _singleBinder = function ($element) {
        var _controlConfig = Kdo.data.controls.get(Kdo.box.utils.getBoxControlId($element))[0];
        //根据JSON设置resizable的行为
        window.Kdo.featurer.resizable($element, Kdo.featurer.resizable_fn.buildOptions(_controlConfig));

        //根据JSON设置draggable的行为
        window.Kdo.featurer.draggable($element, $.extend({ containment: $canvs }, Kdo.featurer.draggable_fn.buildOptions(_controlConfig)));

        //注册旋转功能
        Kdo.featurer.rotate.binder($element);

        //计算模块锁定
        if ($element.resizable("option", "disabled") && $element.draggable("option", "disabled")) {
            $element.addClass("lock");
        } else {
            $element.removeClass("lock");
        }

        //计算模块固定
        if (!!_controlConfig.fixed) {
            $element.addClass("fixed");
        } else {
            $element.removeClass("fixed");
        }

        //计算模块全局
        if (!!_controlConfig.global) {
            $element.addClass("global");
        } else {
            $element.removeClass("global");
        }
        //计算模块通栏
        if (!!_controlConfig.stretch) {
            $element.addClass("stretch");
        } else {
            $element.removeClass("stretch");
        }

        //计算模块共享
        if (!!_controlConfig.share) {
            $element.addClass("share");
        } else {
            $element.removeClass("share");
        }

        $element.find(".ui-resizable-handle").hide();

        //dbclick事件注册
        $element.off("dblclick.popup").on("dblclick.popup", function (event) {
            Kdo.settings.open("data");
        });
    }
    var _singleEnter = function ($element) {
        _singleLeave();
        _groupLeave();
        _tempLeave();
        $element.addClass("on");
        $element.children(".ui-resizable-handle").show();

        var _controlConfig = Kdo.data.controls.get(Kdo.box.utils.getBoxControlId($element))[0];

        // var _webType = Kdo.utils.getQueryString("webType");
        //手机版和吸附框不进行旋转
        // if (_webType == "mobile" && !!_controlConfig && _controlConfig.struct != "adsorb") {
        if (!!_controlConfig && _controlConfig.struct != "adsorb") {
            $element.children(".rotate").show();
        }
        //通栏、锁定、ie浏览器访问时不显示旋转按钮
        if (Kdo.featurer.stretch.status().real || !Kdo.featurer.locker.status().lock || Kdo.utils.browserVersion.isIE) {
            Kdo.featurer.rotate.buttonHide($element);
        }

        //外框圆点样式
        Kdo.featurer.resizable_fn.dotStyle($element);

        Kdo.toolbar.refresh();
        //Kdo.floatbar.attach($element, { show: true });
        Kdo.propertybar.attach($element, { show: true });
    }
    var _singleLeave = function () {
        var $onControls = $canvs.find(".box.single.on");
        $onControls.removeClass("on");
        $onControls.children(".ui-resizable-handle").hide();
        $onControls.children(".rotate").hide();
        Kdo.toolbar.refresh();
        Kdo.contextMenu.hide();//add by clark 隐藏右键菜单
    }
    //---------------------单模块 END---------------------

    //---------------------组合 START---------------------
    //将传递的模块对象进行组合打包
    var _groupBinder = function (controlConfigs) {
        var $element = null;
        if (!!controlConfigs) {
            if (_.isArray(controlConfigs) && controlConfigs.length > 1) {
                _.each(controlConfigs, function (controlConfig) {
                    var _$box = Kdo.box.utils.getBoxElement(controlConfig.controlId);
                    $element = !$element ? _$box : $element.add(_$box);
                });
            }
        }
        if (!$element) return;

        //设置group div样式
        var _$box_group = $('<div class="box group module-group ui-widget-content"><div class="module_border top"></div><div class="module_border right"></div><div class="module_border bottom"></div><div class="module_border left"></div></div>');
        _$box_group.attr("id", controlConfigs[0].groupId); //随便拿一条数据的ID即可（在group.js中已生成该Id）
        _resetBoxStyle(_$box_group);
        window.Kdo.featurer.draggable(_$box_group, { containment: $canvs });
        window.Kdo.featurer.resizable(_$box_group);

        var _boxPosition = {},
            _isInTempBox = $element.parents(".box.temp:first").length > 0;
        if (!!_isInTempBox) {
            _boxPosition = { left: _$box_temp.position().left, top: _$box_temp.position().top, width: _$box_temp.width(), height: _$box_temp.height() }
        } else {
            _boxPosition = _tempCalculateSize($element);
        }

        $.each($element, function (i, _el) {
            var _$el = $(_el);
            if (!_isInTempBox) {
                var _position = _$el.position();
                _$el.css({
                    "left": (parseFloat(_el.style.left) - _boxPosition.left) + "px",
                    "top": (parseFloat(_el.style.top) - _boxPosition.top) + "px"
                });
            }
            _$el.addClass("on").draggable({ disabled: true }).resizable({ disabled: true });
            //判断临时组合中的所有元素是否存在等比例缩放模块，如果有，则将临时组合设置为等比例缩放
            if (_$el.resizable("option", "aspectRatio")) _$box_group.resizable("option", "aspectRatio", true);
        });

        _$box_group.css({
            "top": _boxPosition.top + "px",
            "left": _boxPosition.left + "px",
            "width": _boxPosition.width + "px",
            "height": _boxPosition.height + "px"
        });
        $element.parents("[id^='content']:first").append(_$box_group);
        _$box_group.append($element);
        _$box_group.show();
        //判断组合中的所有元素是否都被lock，如果是，则禁用group的drag和resize操作
        if (_$box_group.children(".box.lock").length == _$box_group.children(".box").length) {
            _$box_group.addClass("lock").draggable({ disabled: true }).resizable({ disabled: true });
        } else {
            _$box_group.removeClass("lock").draggable({ disabled: false }).resizable({ disabled: false });
        }
        //组合后，需要计算当前组合中的模块Size比例值。
        Kdo.box.utils.resize.calculateRateSize(_$box_group);

        //重新选中该组合
        //_singleEnter(_$box_group);

        //离开组合模块（这里是为了重置组合模块被选中的样式(on)——初始化样式）
        _groupLeave(_$box_group);

        //刷新工具栏状态
        Kdo.toolbar.refresh();
    }
    var _groupLeave = function ($onControls) {
        var _$onControls = $onControls || $canvs.find(".box.group.on");
        _$onControls.removeClass("on");
        _$onControls.children(".ui-resizable-handle").hide();
        $.each(_$onControls, function (i, _group) {
            var _$group = $(_group)
            _$group.removeClass("on");
            _$group.find(".box>.ui-resizable-handle").hide();
            _$group.find(".box.on").removeClass("on");
        });
        Kdo.toolbar.refresh();
        Kdo.contextMenu.hide();//add by clark 隐藏右键菜单
    }
    //---------------------组合 END---------------------

    //---------------------辅助函数 START---------------------
    var _resetBoxStyle = function ($box) {
        $box.css({
            "position": "absolute",
            "min-width": "3px",
            "min-height": "3px",
            "top": "0",
            "left": "0",
            "width": "0px",
            "height": "0px"
        });
        $box.hide();
    }
    //初始化,传递$element总范围
    var _init = function (_$canvs) {
        $canvs = _$canvs;
        //初始化临时组合盒子
        _resetBoxStyle(_$box_temp);
        window.Kdo.featurer.draggable(_$box_temp, { containment: $canvs });
        window.Kdo.featurer.resizable(_$box_temp);
        $canvs.append(_$box_temp);
    }
    //---------------------辅助函数 END---------------------


    $.extend(true, window.Kdo, {
        box: {
            init: _init,
            clean: function () {
                _tempLeave();
                _groupLeave();
                _singleLeave();
                //Kdo.floatbar.hide();    //清楚floatbar选中状态 
                Kdo.propertybar.hide();
            },
            temp: {
                enter: _tempEnter,
                toggle: _tempToggle,
                leave: _tempLeave,
                filterByClass: _tempFilterByClass,
                //refreshSize: _tempRefreshSize //暂时用不上
            },
            single: {
                binder: _singleBinder,
                enter: _singleEnter,
                leave: _singleLeave
            },
            group: {
                binder: _groupBinder,
                //enter: function () { },   //与single共用一个enter函数
                leave: _groupLeave
            }
        }
    });
});