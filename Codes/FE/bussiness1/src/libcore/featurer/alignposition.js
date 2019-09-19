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
    对齐方式：上对齐、下对齐、左对齐、右对齐、模块左右居中、页面左右居中、模块上下居中、页面上下居中
*/
    var _base = function (callback) {
        var _currentBox = Kdo.box.utils.getCurrentBox();
        !!callback && callback($(_.filter(_currentBox.$focusSingleBox, function (item) { return !$(item).hasClass("lock") })), _currentBox.focusLevel, Kdo.utils.copy(_currentBox.$focusBox.position()));
    }

    var _update = function ($boxes) {
        //更新模块Size
        Kdo.featurer.updateBoxPosition();
        //操作记录
        Kdo.featurer.actionLogs.log();
        //重新选择模块（刷新动作）
        Kdo.box.temp.enter($boxes);
    }

    var _top = function () {
        _base(function ($boxes, level, boxPosition) {
            if (!_status().top) return;
            var _val = 0;
            switch (level) {
                case "temp":    //模块上对齐
                    $.each($boxes, function (i, _el) {
                        var _$el = $(_el),
                            _position = _$el.position();
                        if (i == 0) {
                            _val = _position.top;
                        } else {
                            _val = Math.min(_val, _position.top);
                        }
                    });
                    $.each($boxes, function (i, _el) {
                        var _$el = $(_el);
                        //这里的boxes可能包含group和single，所以通过box的样式来判断是否被lock相对能够提升性能（否则要遍历group下的single box做判断）
                        if (!_$el.hasClass("lock")) {
                            var _newVal = _val + Kdo.featurer.rotate.rotateStyle(_$el).hdistance;
                            _$el.css("top", _newVal + "px");
                        }
                    });
                    break;
                case "single":  //页面上对齐
                    $.each($boxes, function (i, _el) {
                        var _$el = $(_el);
                        var _newVal = _val + Kdo.featurer.rotate.rotateStyle(_$el).hdistance;
                        _$el.css("top", _newVal + "px");
                    });
                    break;
                case "group":   //页面上对齐
                    $.each($boxes, function (i, _el) {
                        var _$el = $(_el);
                        _$el.css("top", _val + "px");
                    });
                    break;
            }
            _update($boxes);
        });
    }

    var _bottom = function () {
        _base(function ($boxes, level, boxPosition) {
            if (!_status().bottom) return;
            var _val = 0;
            switch (level) {
                case "temp":    //模块下对齐
                    $.each($boxes, function (i, _el) {
                        var _$el = $(_el),
                            _position = _$el.position();
                        _val = Math.max(_val, _position.top + Kdo.featurer.rotate.rotateStyle(_$el).height);
                    });
                    $.each($boxes, function (i, _el) {
                        var _$el = $(_el);
                        //这里的boxes可能包含group和single，所以通过box的样式来判断是否被lock相对能够提升性能（否则要遍历group下的single box做判断）
                        if (!_$el.hasClass("lock")) {
                            _$el.css("top", (_val - Kdo.featurer.rotate.rotateStyle(_$el).height + Kdo.featurer.rotate.rotateStyle(_$el).hdistance) + "px");
                        }
                    });
                    break;
                case "single":  //页面下对齐
                    $.each($boxes, function (i, _el) {
                        var $parent = $(_el).parent(),
                           height = $parent.height();
                        $(_el).css("top", (height - (Kdo.featurer.rotate.rotateStyle($(_el)).height) + Kdo.featurer.rotate.rotateStyle($(_el)).hdistance) + "px");
                    });
                    break;
                case "group":   //页面下对齐
                    $.each($boxes, function (i, _el) {
                        var $parent = $(_el).parent(),
                           height = $parent.height();
                        $(_el).css("top", (height - $(_el).height()));
                    });
                    break;
            }
            _update($boxes);
        });
    }

    var _left = function () {
        _base(function ($boxes, level, boxPosition) {
            if (!_status().left) return;
            var _val = 0;
            switch (level) {
                case "temp":    //模块左对齐
                    $.each($boxes, function (i, _el) {
                        var _$el = $(_el),
                            _position = _$el.position();
                        if (i == 0) {
                            _val = _position.left;
                        } else {
                            _val = Math.min(_val, _position.left);
                        }
                    });
                    $.each($boxes, function (i, _el) {
                        var _$el = $(_el);
                        //这里的boxes可能包含group和single，所以通过box的样式来判断是否被lock相对能够提升性能（否则要遍历group下的single box做判断）
                        if (!_$el.hasClass("lock")) {
                            var _newVal = _val + Kdo.featurer.rotate.rotateStyle(_$el).wdistance;
                            _$el.css("left", _newVal + "px");
                        }
                    });
                    break;
                case "single":  //页面左对齐
                    $.each($boxes, function (i, _el) {
                        var _$el = $(_el);
                        var _newVal = _val + Kdo.featurer.rotate.rotateStyle(_$el).wdistance;
                        _$el.css("left", _newVal + "px");
                    });
                    break;
                case "group":   //页面左对齐
                    $.each($boxes, function (i, _el) {
                        var _$el = $(_el);
                        _$el.css("left", _val + "px");
                    });
                    break;
            }
            _update($boxes);

        });
    }

    var _right = function () {
        _base(function ($boxes, level, boxPosition) {
            if (!_status().right) return;
            var _val = 0;
            switch (level) {
                case "temp":    //模块右对齐
                    $.each($boxes, function (i, _el) {
                        var _$el = $(_el),
                            _position = _$el.position();
                        //_val = Math.max(_val, _position.left + _$el.width());
                        _val = Math.max(_val, _position.left + Kdo.featurer.rotate.rotateStyle(_$el).width);
                    });
                    $.each($boxes, function (i, _el) {
                        var _$el = $(_el);
                        //这里的boxes可能包含group和single，所以通过box的样式来判断是否被lock相对能够提升性能（否则要遍历group下的single box做判断）
                        //if (!_$el.hasClass("lock")) _$el.css("left", (_val - _$el.width()) + "px");
                        _$el.css("left", (_val - Kdo.featurer.rotate.rotateStyle(_$el).width + Kdo.featurer.rotate.rotateStyle(_$el).wdistance) + "px");
                    });
                    break;
                case "single":  //页面右对齐
                    $.each($boxes, function (i, _el) {
                        var $parent = $(_el).parent(),
                           width = $parent.width();
                        $(_el).css("left", (width - (Kdo.featurer.rotate.rotateStyle($(_el)).width) + Kdo.featurer.rotate.rotateStyle($(_el)).wdistance) + "px");
                    });
                    break;
                case "group":   //页面右对齐
                    $.each($boxes, function (i, _el) {
                        var $parent = $(_el).parent(),
                         width = $parent.width();
                        $(_el).css("left", (width - $(_el).width()));
                    });
                    break;
            }
            _update($boxes);
        });
    }

    var _center = function (centerType) {
        _base(function ($boxes, level, boxPosition) {
            if (!_status().center) return;
            switch (centerType) {
                case "module":
                    var left = 0, width = 0;
                    $.each($boxes, function (i, el) {
                        var position = $(el).position();
                        left = (i == 0) ? position.left : Math.min(left, position.left);
                    });
                    $.each($boxes, function (i, el) {
                        var position = $(el).position();
                        width = (i == 0) ? position.left + Kdo.featurer.rotate.rotateStyle($(el)).width - left : Math.max(width, position.left + Kdo.featurer.rotate.rotateStyle($(el)).width - left);
                    });
                    $.each($boxes, function (i, el) {
                        var _$el = $(el);
                        //这里的boxes可能包含group和single，所以通过box的样式来判断是否被lock相对能够提升性能（否则要遍历group下的single box做判断）
                        if (!_$el.hasClass("lock")) {
                            //_$el.css("left", left + ((width - _$el.width()) / 2));
                            _$el.css("left", left + ((width - Kdo.featurer.rotate.rotateStyle(_$el).width) / 2) + Kdo.featurer.rotate.rotateStyle(_$el).wdistance);
                        }
                    });
                    break;
                case "page":
                    switch (level) {
                        case "temp":
                            var _$el = $($boxes[0]).parent();
                            var $parent = _$el.parent(),
                                   width = $parent.width();
                            _$el.css("left", (width - _$el.width()) / 2);
                            break;
                        case "single":
                        case "group":
                            $.each($boxes, function (i, el) {
                                var $parent = $(el).parent(),
                                    width = $parent.width();
                                $(el).css("left", (width - $(el).width()) / 2);
                            });
                            break;
                    }
            }
            _update($boxes);
        });
    }

    var _middle = function () {
        _base(function ($boxes, level, boxPosition) {
            if (!_status().middle) return;
            switch (level) {
                case "temp":    //模块上下居中
                    var top = 0, height = 0;
                    $.each($boxes, function (i, el) {
                        var position = $(el).position();
                        top = (i == 0) ? position.top : Math.min(top, position.top);
                    });
                    $.each($boxes, function (i, el) {
                        var position = $(el).position();
                        height = (i == 0) ? position.top + Kdo.featurer.rotate.rotateStyle($(el)).height - top : Math.max(height, position.top + Kdo.featurer.rotate.rotateStyle($(el)).height - top);
                    });
                    $.each($boxes, function (i, el) {
                        var _$el = $(el);
                        //这里的boxes可能包含group和single，所以通过box的样式来判断是否被lock相对能够提升性能（否则要遍历group下的single box做判断）
                        if (!_$el.hasClass("lock")) {
                            _$el.css("top", top + ((height - Kdo.featurer.rotate.rotateStyle(_$el).height) / 2) + Kdo.featurer.rotate.rotateStyle(_$el).hdistance);
                        }
                    });
                    break;
                case "single":  //页面上下居中
                    break;
                case "group":   //页面上下居中
                    $.each($boxes, function (i, el) {
                        var $parent = $(el).parent(),
                            height = $parent.height();
                        $(el).css("top", (height - $(el).height()) / 2);
                    });
                    break;
            }
            _update($boxes);
        });
    }

    var _status = function () {
        var _currentBox = Kdo.box.utils.getCurrentBox(),
            result = {
                top: true,
                bottom: true,
                left: true,
                right: true,
                center: true,
                pageCenter: true,
                middle: true,
            }
        switch (_currentBox.focusLevel) {
            case "temp":
            case "group":
                var _lock = _currentBox.$focusBox.hasClass("lock");
                result = {
                    top: !_lock,
                    bottom: !_lock,
                    left: !_lock,
                    right: !_lock,
                    center: !_lock,
                    pageCenter: !_lock,
                    middle: !_lock,
                }
                break;
            case "single":
                var _controlConfig = Kdo.data.controls.get(Kdo.box.utils.getBoxControlId(_currentBox.$focusBox))[0],
                    _lock = !!_currentBox.focusLevel && !_controlConfig.global && !!_controlConfig.lock;
                result = {
                    top: !_lock,
                    bottom: !_lock,
                    left: !_lock && !_controlConfig.stretch,
                    right: !_lock && !_controlConfig.stretch,
                    center: !_lock,
                    pageCenter: !_lock && !_controlConfig.stretch,
                    middle: !_lock,
                }
                break;
        }

        return result;
    }

    var _triggers = [];

    //注册记录后调用的回调函数
    var _on = function (key, callback) {
        //TODO: 这里可以根据key做重写处理。目前业务上用不到，暂时不用加。
        _triggers.push({ key: key, callback: callback });
    }

    //触发回调函数(private)
    var _trigger = function () {
        _.each(_triggers, function (trigger) {
            if (!!trigger.callback) {
                trigger.callback(_status());
            }
        });
    }

    $.extend(true, window.Kdo, {
        featurer: {
            align: {
                position: {
                    top: _top,
                    bottom: _bottom,
                    left: _left,
                    right: _right,
                    center: _center,
                    pageCenter: _center,
                    middle: _middle,
                    status: _status,
                    on: _on
                }
            }
        }
    })
});