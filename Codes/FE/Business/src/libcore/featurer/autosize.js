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
    自适应
*/
    //自适应大小（目前仅适用于对象中addTools包含"scale"的模块）
    var _scale = function () {
        if (_status()) {
            var _currentBox = Kdo.box.utils.getCurrentBox(),
                _$box = _currentBox.$focusBox,
                _$img = _$box.find("img"),
                _src = _$img.attr("src");
            var newImg = new Image();
            newImg.src = _src;
            newImg.onload = function () {
                var containerWidth = _$box.parent().width(),
                    containerHeight = _$box.parent().height(),
                    imageWidth = newImg.width,
                    imageHeight = newImg.height,
                    currentWidth = _$box.width(),
                    currentHeight = _$box.height(),
                    currentLeft = parseInt(_$box.css('left')),
                    currentTop = parseInt(_$box.css('top')),
                    finalStyle = {
                        width: Math.min(imageWidth, containerWidth),
                        height: Math.min(imageHeight, containerHeight),
                        left: Math.max(currentLeft - (imageWidth - currentWidth), 0),
                        top: Math.max(currentTop - (imageHeight - currentHeight), 0)
                    };
                //图片超过containerWidth时失真
                if (finalStyle.width == containerWidth) {
                    _$box.width(finalStyle.width);
                    _$box.height((containerWidth * imageHeight / imageWidth));
                } else {
                    _$box.width(finalStyle.width);
                    _$box.height(finalStyle.height);
                }
                //放大后如果超过拖动区域宽度则重置X
                if (currentLeft + imageWidth > containerWidth) {
                    _$box.css({ left: finalStyle.left });
                }
                //放大后如果超过拖动区域高度则重置Y
                if (currentTop + imageHeight > containerHeight) {
                    _$box.css({ top: finalStyle.top });
                }
                //更新模块Size
                Kdo.featurer.updateBoxSize();
                Kdo.featurer.updateBoxPosition();
                //操作记录
                Kdo.featurer.actionLogs.log();
                //重新选择模块（刷新动作）
                Kdo.box.temp.enter(Kdo.box.utils.getCurrentBox().$focusSingleBox);
            }
        }
    }

    var _status = function () {
        var _currentBox = Kdo.box.utils.getCurrentBox(),
            controlConfig = Kdo.data.controls.get(Kdo.box.utils.getBoxControlId(_currentBox.$focusBox));
        return _currentBox.focusLevel == "single" && controlConfig.length > 0 && !controlConfig[0].lock && !controlConfig[0].global && _.findIndex(Kdo.menus.getToolbar(controlConfig[0]), function (key) { return key == "scale" }) != -1;
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
            autoSize: {
                scale: _scale,
                status: _status,
                on: _on
            }
        }
    })
});