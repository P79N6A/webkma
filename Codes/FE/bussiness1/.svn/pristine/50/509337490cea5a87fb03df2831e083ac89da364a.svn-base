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
       字体编辑
    */
    var _$editor = $('<div class="design_text_editor scroll-box" contenteditable="true"></div>'),
        _attachControlConfig = null;    //临时缓存正在编辑的模块对象

    var _init = function ($element) {
        $element.append(_$editor);
        $("body").on("mousedown.editorblur", function (event) {
            var _$el = $(event.target);
            if (!_$el.hasClass("design_text_editor") && _$el.parents(".design_text_editor").length == 0 &&
                !_$el.hasClass("lanh-control-toolbar-setting") && _$el.parents(".lanh-control-toolbar-setting").length == 0 &&
                !_$el.hasClass("propertybar") && _$el.parents(".propertybar").length == 0
                && _$el.parents(".sp-container").length == 0) {
                _close();
            }
        });

        //_$editor.bind('DOMActivate', function (e) { console.log("DOMActivate"); });
        //_$editor.bind('DOMCharacterDataModified', function (e) { console.log("DOMCharacterDataModified"); });
        //_$editor.bind('DOMNodeInserted', function (e) { console.log("DOMNodeInserted"); });

        // 设定文本框只能输入文本（去掉样式）
        // 参考：https://www.zhangxinxu.com/wordpress/2016/01/contenteditable-plaintext-only/
        // 干掉IE http之类地址自动加链接
        try {
            document.execCommand("AutoUrlDetect", false, false);
        } catch (e) { }
        _$editor.on('paste', function (e) {
            e.preventDefault();
            var text = null;
            if (window.clipboardData && clipboardData.setData) {
                // IE
                text = window.clipboardData.getData('text');
            } else {
                text = (e.originalEvent || e).clipboardData.getData('text/plain') || prompt('在这里输入文本');
            }
            if (document.body.createTextRange) {
                var textRange;
                if (document.selection) {
                    textRange = document.selection.createRange();
                } else if (window.getSelection) {
                    var sel = window.getSelection();
                    var range = sel.getRangeAt(0);

                    // 创建临时元素，使得TextRange可以移动到正确的位置
                    var tempEl = document.createElement("span");
                    tempEl.innerHTML = "&#FEFF;";
                    range.deleteContents();
                    range.insertNode(tempEl);
                    textRange = document.body.createTextRange();
                    textRange.moveToElementText(tempEl);
                    tempEl.parentNode.removeChild(tempEl);
                }
                textRange.text = text || "";
                textRange.collapse(false);
                textRange.select();
            } else {
                // Chrome之类浏览器
                document.execCommand("insertText", false, text || "");
            }
        });
        // 去除Crtl+b/Ctrl+i/Ctrl+u等快捷键
        _$editor.on('keydown keyup', function (e) {
            // e.metaKey for mac
            if (e.ctrlKey || e.metaKey) {
                switch (e.keyCode) {
                    case 66: //ctrl+B or ctrl+b
                    case 98:
                    case 73: //ctrl+I or ctrl+i
                    case 105:
                    case 85: //ctrl+U or ctrl+u
                    case 117: {
                        e.preventDefault();
                        break;
                    }
                }
            }
            Kdo.box.utils.getCurrentBox().$focusSingleBox.css("height", _$editor.height() + "px");
            Kdo.featurer.updateBoxSize();
        });

        _$editor.hide();
    }

    var _open = function () {
        var _currentBox = Kdo.box.utils.getCurrentBox();
        if (_currentBox.focusLevel != "single") return false;
        var _$box = _currentBox.$focusSingleBox,
            _$box_note = _$box.find(".note-editable");
        _attachControlConfig = Kdo.data.controls.get(Kdo.box.utils.getBoxControlId(_$box))[0];

        _$editor.show();
        //将_$editor模拟成模块大小和位置 
        _$editor.css($.extend({
            "width": _$box.css("width"),
            "height": "auto",   //高度自适应（覆盖scroll-box的定高）
            "max-height": Kdo.data.config.page.get().style.height,  //最大高度不可操作页面设定高度
            // "height": _$box.css("height"),
            // "height": parseFloat(Kdo.data.config.page.get().style.height) - parseFloat(_$box.css("top")),
            "left": _$box.css("left"),
            "top": _$box.css("top"),
            // "font-size": _$box_note.css("font-size"),
            "transform": _$box.css("transform")
        }, _attachControlConfig.inner.style));
        //将模块对象中的内容传递给编辑器
        _$editor.html(_attachControlConfig.data.context);
        _$box_note.html("");
        //选中“编辑模式”的div
        _$editor.focus();
        document.execCommand("SelectAll");

        // 字体编辑时，不允许对内部添加样式
        Kdo.propertybar.hide();

        //内核不为chrome的浏览器点击全选
        if (!Kdo.utils.browserVersion.isChrome) {
            _$editor.off("click").on("click", function () { document.execCommand("SelectAll"); });
            _$editor.off("mouseup").on("mouseup", function () { document.execCommand("SelectAll"); });
        }
    }

    var _close = function () {
        if (!_attachControlConfig) return;
        var _$box = Kdo.container.$background().find("div[id^='" + _attachControlConfig.controlId + "']").parents(".box.single").first(),
            _$box_note = _$box.find(".note-editable");

        //设置编辑器内容到模块对象
        _attachControlConfig.data.context = _$editor.html();
        Kdo.data.controls.set(_attachControlConfig);
        //更新DOM元素文本（暂时不需要用到模块刷新函数）
        _$box_note.html(_attachControlConfig.data.context);

        //box的高度为文字显示高度  7.24
        _$box.css("height", _$box_note.height() + "px");
        Kdo.featurer.updateBoxSize();

        //清理文本编辑器
        _attachControlConfig = null;
        //编辑器失去焦点 mars 17.8.2
        _$editor.blur();
        _$editor.hide();
        //将toolbar设置为模块类型
        //...
        //操作记录
        Kdo.featurer.actionLogs.log();
    }

    $.extend(true, window.Kdo, {
        settings: {
            font: {
                init: _init,
                open: _open,
                close: _close
            }
        }
    });
});