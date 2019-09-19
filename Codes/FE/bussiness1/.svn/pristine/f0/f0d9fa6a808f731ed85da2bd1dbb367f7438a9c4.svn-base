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
    var $element = null;
    var _init = function ($target) {
        if (!!$target) {
            $element = $target;
            _on();
        }
    }

    var _on = function () {
        //继承自定义事件基类(键盘事件不调用此函数)
        var _baseEvent = function (event, callback) {
            //事件触发区域不在编辑页面本身, 则阻止流程.
            if (($element[0] != event.target && $(event.target).parents("#content").length == 0) ||
                $(event.target).parents(".module-configuration,.lanh-control-toolbar-rightmenu").length != 0) return false;
            //清除input的焦点
            $element.find("input").blur();
            //console.log(event.type);
            var _currentBox = Kdo.box.utils.getCurrentBox(event),
                $target = $(event.target);
            !!callback && callback(_currentBox, $target);
        }
        //延迟执行函数
        var _timeOutEvent = null,
            _setTimeoutEvent = function (callfunc) {
                !_timeOutEvent && (_timeOutEvent = setTimeout(function () { callfunc(); _timeOutEvent = null; }, 50));
            }

        //判断当前focus的元素是否是输入框
        var _isInputFocus = function () {
            //return $(document).find("input,textarea,div[contenteditable='true']").is(":focus");
            //兼容Firefox mars  17.8.2
            return $(document).find("input,textarea").is(":focus") || $(document).find("div[contenteditable='true']").is(":focus");
        }

        //页面级鼠标左键mousedown行为
        $($element).off("mousedown.page.left").on("mousedown.page.left", function (event) {
            _baseEvent(event, function (_currentBox, $target) {
                if (event.which == 1 && event.ctrlKey == false && event.altKey == false) {
                    if (_currentBox.targetLevel != "" && !$target.hasClass("cover") && !$target.hasClass("module-top-tip")) return true;
                    switch (_currentBox.targetLevel) {
                        case "single":  //单模块
                            Kdo.box.single.enter($target.hasClass("single") ? $target : $target.parents(".box.single:first"));
                            break;
                        case "group":   //组合
                            Kdo.box.single.enter($target.hasClass("group") ? $target : $target.parents(".box.group:first"));
                            break;
                        case "temp": break;   //临时组合，暂时不做任何操作
                        default: break;
                    }
                }
            });
        });

        //页面级鼠标左键mouseup和mouseup+ctrl行为
        $($element).off("mouseup.page.left").on("mouseup.page.left", function (event) {
            if (_isInputFocus()) return true;               //如果focus状态在input中，则不执行流程。
            _baseEvent(event, function (_currentBox, $target) {
                if (event.which == 1 && event.altKey == false) {
                    //切换浮动工具条显示为功能按钮
                    //Kdo.floatbar.toggle("actions");
                    if (_currentBox.targetLevel != "" && !$target.hasClass("cover") && !$target.hasClass("module-top-tip") || Kdo.settings.adsorb.status().resizing || Kdo.settings.adsorb.status().dragging || Kdo.featurer.rotate.status().isRotating) return true;
                    //如果没有进行resize或drag操作，则进入box流程（视为点选行为）
                    if ($element.find(".ui-draggable-dragging,.ui-resizable-resizing").length == 0) {
                        var _$selectedElements = null;
                        if ($target.hasClass("group") ||
                            ($target.hasClass("single") && $target.parents(".box.group:first").length == 0)) {
                            _$selectedElements = $target;
                        } else {
                            _$selectedElements = $target.parents(".box.single:first,.box.group:first").last();
                        }
                        if (event.ctrlKey == true) {
                            Kdo.box.temp.toggle(_$selectedElements);    //ctrl+左键 = 增选
                        } else {
                            Kdo.box.single.enter(_$selectedElements);   //左键 = 单选
                        }
                    } else if (event.ctrlKey == false) {
                        switch (_currentBox.targetLevel) {
                            case "single": break;   //单模块
                            case "group": break;    //组合
                            case "temp": break;     //临时组合
                            default:
                                //当前event不在box元素上时，清除Box选中行为。
                                Kdo.box.clean();
                                break;
                        }
                    }
                    //修补鼠标样式错误的问题（可能在中间环节会有替换的情况，并不稳定，所以在这里修复一次）Added by Dyllon
                    $("body").css({ "cursor": "auto" });
                }
            });
        });

        //页面级鼠标右键mousedown行为
        $($element).off("mousedown.page.right").on("mousedown.page.right", function (event) {
            _baseEvent(event, function (_currentBox, $target) {
                if (event.which == 3 && event.ctrlKey == false && event.altKey == false) {
                    if (_currentBox.targetLevel != "" && !$target.hasClass("cover") && !$target.hasClass("module-top-tip")) return true;
                    switch (_currentBox.targetLevel) {
                        case "single":  //单模块
                            Kdo.box.single.enter($target.hasClass("single") ? $target : $target.parents(".box.single:first"));
                            break;
                        case "group":  //组合
                            Kdo.box.single.enter($target.hasClass("group") ? $target : $target.parents(".box.group:first"));
                            break;
                        case "temp": break;   //临时组合，暂时不做任何操作
                        default: break;
                    }
                }
            });
        });

        //页面级鼠标右键mouseup和mouseup+ctrl行为
        $($element).off("mouseup.page.right").on("mouseup.page.right", function (event) {
            if (_isInputFocus() || Kdo.settings.adsorb.status().editing) return true;               //如果focus状态在input中，则不执行流程。
            _baseEvent(event, function (_currentBox, $target) {
                if (event.which == 3 && event.altKey == false) {
                    if (event.ctrlKey == false) {
                        switch (_currentBox.targetLevel) {
                            case "single": break;   //单模块
                            case "group": break;    //组合
                            case "temp": break;     //临时组合
                            default:
                                //当前event不在box元素上时，清除Box选中行为。
                                Kdo.box.clean();
                                break;
                        }
                        _currentBox = Kdo.box.utils.getCurrentBox(event);   //由于box状态可能改变，这里需要重新获取最新Box信息
                    }

                    switch (_currentBox.focusLevel) {
                        case "temp":
                            Kdo.contextMenu.show(event);
                            break;
                        case "group":
                            Kdo.contextMenu.show(event);
                            break;
                        case "single":
                            Kdo.contextMenu.show(event);
                            //console.log("open mouse right menu for single");
                            break;
                        default:
                            Kdo.contextMenu.show(event);
                            //console.log("open mouse right menu for empty");
                            break;
                    }
                }
            });
        });

        //window窗口级键盘事件
        $(document).off("keydown.page").on("keydown.page", function (event) {
            if ($(event.target).parents(".ui-dialog").length != 0) return true; //如果event.target在模态窗口中，则不执行流程。
            if (_isInputFocus()) return true;               //如果focus状态在文本框中，则不执行流程。
            var _currentBox = Kdo.box.utils.getCurrentBox(event);
            if (event.shiftKey == true && event.ctrlKey == true) {
                switch (event.keyCode) {
                    case 219:    //Shift+Ctrl + [: 顶层
                        _setTimeoutEvent(function () { Kdo.featurer.zIndex.top(); });
                        break;
                    case 221:    //Shift+Ctrl + ]: 底层
                        _setTimeoutEvent(function () { Kdo.featurer.zIndex.bottom(); });
                        break;
                    default: return true;   //其它键允许冒泡事件
                }
            } else if (event.ctrlKey == true) {
                switch (event.keyCode) {
                    case 67:    //Ctrl + c: 复制
                        _setTimeoutEvent(function () { Kdo.featurer.copy(); });
                        break;
                    case 86:    //Ctrl + v: 粘贴
                        _setTimeoutEvent(function () { Kdo.featurer.paste(); });
                        break;
                    case 81:    //Ctrl + q: 复印
                        _setTimeoutEvent(function () { Kdo.featurer.copyPaste(); });
                        break;
                    case 90:    //Ctrl + z: 撤销
                        _setTimeoutEvent(function () { Kdo.featurer.actionLogs.undo(); });
                        break;
                    case 89:    //Ctrl + y: 重做
                        _setTimeoutEvent(function () { Kdo.featurer.actionLogs.redo(); });
                        break;
                    case 219:    //Ctrl + [: 上一层
                        _setTimeoutEvent(function () { Kdo.featurer.zIndex.up(); });
                        break;
                    case 221:    //Ctrl + ]: 下一层
                        _setTimeoutEvent(function () { Kdo.featurer.zIndex.down(); });
                        break;
                    case 71:    //Ctrl + g: 组合
                        break;
                    default: return true;   //其它键允许冒泡事件
                }
                return false;
            } else {
                switch (event.keyCode) {
                    case 37:    //小键盘左
                        Kdo.featurer.move.left(_currentBox.$focusBox);
                        break;
                    case 38:    //小键盘上
                        Kdo.featurer.move.up(_currentBox.$focusBox);
                        break;
                    case 39:    //小键盘右
                        Kdo.featurer.move.right(_currentBox.$focusBox);
                        break;
                    case 40:    //小键盘下
                        Kdo.featurer.move.down(_currentBox.$focusBox);
                        break;
                    case 46:    //删除
                        Kdo.featurer.del();
                        break;
                    default: return true;   //其它键允许冒泡事件
                }
                return false;
            }
        });

        $(document).off("keyup.page").on("keyup.page", function (event) {
            if (_isInputFocus()) return true;               //如果focus状态在文本框中，则不执行流程。
            //切换浮动工具条显示为功能按钮
            //Kdo.floatbar.toggle("actions");
        });
    }

    var _off = function (type) {
        if (!!$element) {
            switch (type) {
                case "mouse":
                    $($element).off("mousedown.page.left");
                    $($element).off("mouseup.page.left");
                    $($element).off("mousedown.page.right");
                    $($element).off("mouseup.page.right");
                    break;
                case "key":
                    $(document).off("keydown.page");
                    break;
            }
        }
    }

    window.Kdo = $.extend(true, window.Kdo || {}, {
        events: {
            init: _init,
            on: _on,
            off: _off
        }
    });
});