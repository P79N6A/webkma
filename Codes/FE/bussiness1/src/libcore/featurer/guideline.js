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
    显示模块拖动时的辅助线（头部、中部、底部单独控制）   add by clark
*/
    var MIN_DISTANCE = 20; //
    var NON_POSITION = {
        left: 0,
        top: 0
    };
    var guides = []; // 初始化需要显示辅助线的模块 
    var innerOffsetX, innerOffsetY; // 拖动的时候需要用这个值来进行计算
    var container = document.body;

    var init = function () {
        var options = $.extend(arguments[0]),
            controls;

        container = $(options.el);
        controls = container.find('.box.single');

        if (options.nots && !!options.nots) {
            $(options.nots).each(function () {
                controls = controls.not($(this));
            });
        }
        $(controls).each(function () {
            if ($(this).parent('.box.temp').length) {
                controls = controls.not($(this));
            }
        });

        if (container.find('#guide-h').length <= 0) {
            $('<div id="guide-h" class="guide"></div>'
                + '<div id="guide-v" class="guide"></div>').appendTo(container);
        }
        guides = $.map(controls.not(options.current), computeGuidesForElement);
    }


    function computeGuidesForElement(elem, pos, w, h) {
        if (elem != null) {
            var $t = $(elem);
            pos = {
                top: $t.offset().top,// parseFloat($t.get(0).style.top),
                left: $t.offset().left,//parseFloat($t.get(0).style.left)
            }
            if ($t.hasClass("single")) {
                w = Kdo.featurer.rotate.rotateStyle($t).width;
                h = Kdo.featurer.rotate.rotateStyle($t).height;
            } else {
                //间距设置为1个像素，如果有空白间距则需要进行手工微调（已对齐）
                w = $t.outerWidth();//由于左右的圆圈没有padding值，只有边框线所占的1像素，所以就是1+1=2个像素的空位
                h = $t.outerHeight();//由于上下的圆圈的直径有5个像素，padding了2个像素+直径的1像素边线就是3个像素，两个模块叠在一起的时候就6个像素的空位
            }
        }
        return [
            { type: "h", left: pos.left, top: pos.top },
            { type: "h", left: pos.left, top: pos.top + h },
            { type: "v", left: pos.left, top: pos.top },
            { type: "v", left: pos.left + w, top: pos.top },
            // you can add _any_ other guides here as well (e.g. a guide 10 pixels to the left of an element)
            { type: "h", left: pos.left, top: pos.top + h / 2 },
            { type: "v", left: pos.left + w / 2, top: pos.top }
        ];
    }

    var showLine = function (elem, event, ui) {
        var chosenGuides = { top: { dist: MIN_DISTANCE + 1 }, left: { dist: MIN_DISTANCE + 1 } };
        var $t = $(elem);
        var pos = {
            top: $t.offset().top,//$t.position().top
            left: $t.offset().left//$t.position().left
        };
        var w = 0, h = 0;
        if ($t.hasClass("single")) {
            w = Kdo.featurer.rotate.rotateStyle($t).width - 1;
            h = Kdo.featurer.rotate.rotateStyle($t).height - 1;
        } else {
            w = $t.outerWidth() - 1;
            h = $t.outerHeight() - 1;
        }

        var elemGuides = computeGuidesForElement(null, pos, w, h);
        for (var j = 0, jj = elemGuides.length; j < jj; j++) {
            var currentItem = elemGuides[j];
            for (var i = 0, ii = guides.length; i < ii; i++) {
                var targetItem = guides[i];
                if (currentItem.type != targetItem.type) continue;
                var posName = currentItem.type == "h" ? "top" : "left";
                var gapVal = Math.abs(currentItem[posName] - targetItem[posName]);
                if (gapVal < chosenGuides[posName].dist) {
                    chosenGuides[posName].dist = gapVal;
                    chosenGuides[posName].offset = currentItem[posName] - pos[posName];
                    chosenGuides[posName].guide = $.extend(true, {}, targetItem);
                }
            }
        }
        if (chosenGuides.top.dist <= MIN_DISTANCE) {
            //由于使用offset（全局）定位，需要考虑父级元素的起始位置
            var guideTop = chosenGuides.top.guide.top - $(container).offset().top;
            $(container).find("#guide-h").css("top", guideTop).show();
            //debugger;
            //$(elem).css({ "top": guideTop });
        }
        else {
            $(container).find("#guide-h").hide();
        }

        if (chosenGuides.left.dist <= MIN_DISTANCE) {
            //由于使用offset（全局）定位，需要考虑父级元素的起始位置
            var guideLeft = chosenGuides.left.guide.left - $(container).offset().left;
            $(container).find("#guide-v").css("left", guideLeft).show();
        }
        else {
            $(container).find("#guide-v").hide();
        }
        /*限制模块元素不能拖到边界之外*/  //暂时不使用该逻辑(Remark By Dyllon)
        //if (ui.position.left < 0) ui.position.left = 0;
        //if (ui.position.left + w > container.width())
        //    ui.position.left = container.width() - w;


        /*模块辅助线的吸附功能 modify by clark */
        var draggableContext = $(elem).data('ui-draggable');
        $.ui.plugin.call(draggableContext, 'start', [event, ui, draggableContext], true);
        $.ui.plugin.call(draggableContext, 'drag', [event, ui, draggableContext], true);
        if ($("body").css('cursor') !== 'auto') {
            $("body").css("cursor", 'auto');
        }
    }

    var hideLine = function () {
        $(container).find("#guide-h").hide();
        $(container).find("#guide-v").hide();
    }

    $.extend(true, window.Kdo, {
        featurer: {
            guideLine: {
                init: function () {
                    init.call(this, arguments[0]);
                },
                show: showLine,
                hide: hideLine
            }
        }
    })
});