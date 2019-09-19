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
    文字编辑器
*/
    var _fontName = function (name) { _action("fontname", name); }

    var _fontSize = function (size) {
        //执行原始字体设置
        _action("fontsize", "6");

        //size-->fontsize
        if (Kdo.utils.browserVersion.isChrome) {
            $.each($(".design_text_editor font"), function (i, item) {
                if (!!$(item).attr("size")) {
                    $(item).removeAttr("size").css("font-size", size);
                }
            })
        } else {
            $.each($(".design_text_editor font"), function (i, item) {
                if (!!$(item).attr("size") || !!$(item).css("font-size")) {
                    $(item).removeAttr("size").css("font-size", size);
                }
            })
        }
    }

    var _foreColor = function (color) { _action("forecolor", color); }

    var _backColor = function (color) { _action("backcolor", color); }

    var _fontBold = function () { _action("bold"); }

    var _fontItalic = function () { _action("italic"); }

    var _fontUnderline = function () { _action("underline"); }

    var _fontJustifyLeft = function () { _action("justifyleft"); }

    var _fontJustifyCenter = function () { _action("justifycenter"); }

    var _fontJustifyRight = function () { _action("justifyright"); }

    var _fontStrikeThrough = function () { _action("strikethrough"); }

    var _fontRemoveFormat = function () {
        _action("removeformat");
        //清除样式时，字体样式清除
        var $item = $(window.getSelection().getRangeAt(0).startContainer.parentNode);
        if ($item.hasClass("design_text_editor")) {
            $item.find("span").css("font-size", "");
        } else {
            $item.parents(".design_text_editor").find("span").css("font-size", "");
        }

        if ($item.hasClass("design_text_editor")) {//兼容Firefox 
            $item.children().removeAttr("align");
        } else if ($item.attr("id") == "content-body-body") {//兼容ie11
            $(window.getSelection().getRangeAt(0).startContainer).children().removeAttr("align");
        } else {
            $item.parents(".design_text_editor").children().removeAttr("align");
        }
    }

    var _action = function (sCommand, value) {
        if (value != null) {
            document.execCommand(sCommand, false, value);
        } else {
            document.execCommand(sCommand);
        }
        _trigger();
    }

    //计算可用状态
    var _status = function () {
        if (Kdo.utils.browserVersion.isChrome) {
            var _$focusElement = $(document.getSelection().focusNode.parentElement);
        } else {
            var $item = $(document.getSelection().focusNode).find("font:first");
            if ($item.length == 0) {//新拖文本模块
                var _$focusElement = $(document.getSelection().focusNode);
                if (!_$focusElement.hasClass("design_text_editor")) {
                    _$focusElement = $(document.getSelection().focusNode.parentNode);//ie
                }
            } else {
                var _$focusElement = $(document.getSelection().focusNode).find("font:first");
            }
        }

        return {
            fontName: document.queryCommandValue("fontName"),
            fontSize: _$focusElement.css("font-size"),
            foreColor: document.queryCommandValue("foreColor"),
            backColor: document.queryCommandValue("backColor"),
            fontBold: document.queryCommandValue("bold") == "true",
            fontItalic: document.queryCommandValue("italic") == "true",
            fontUnderline: document.queryCommandValue("underline") == "true",
            fontJustifyLeft: document.queryCommandValue("justifyleft") == "true",
            fontJustifyCenter: document.queryCommandValue("justifycenter") == "true",
            fontJustifyRight: document.queryCommandValue("justifyright") == "true",
            fontStrikeThrough: document.queryCommandValue("strikethrough") == "true",
            enabile: true
        }
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
            texteditor: {
                fontName: _fontName,
                fontSize: _fontSize,
                foreColor: _foreColor,
                backColor: _backColor,
                fontBold: _fontBold,
                fontItalic: _fontItalic,
                fontUnderline: _fontUnderline,
                fontJustifyLeft: _fontJustifyLeft,
                fontJustifyCenter: _fontJustifyCenter,
                fontJustifyRight: _fontJustifyRight,
                fontStrikeThrough: _fontStrikeThrough,
                fontRemoveFormat: _fontRemoveFormat,
                status: _status,
                on: _on
            }
        }
    });
});