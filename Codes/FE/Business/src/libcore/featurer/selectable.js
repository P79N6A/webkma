(function(global, factory) {

    "use strict";
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = global.document ?
            factory(global, true) :
            function(w) {
                return factory(w);
            };
    } else {
        factory(global);
    }
})(typeof window !== "undefined" ? window : this, function(window) {
    'use strict';
    /*
        框选功能
    */
    var _$element = null;
    $.extend(true, window.Kdo, {
        featurer: {
            selectable: function($element, _options) {
                _$element = $element;
                //判断目标模块是否与已选中的模块处于相同父级
                var _isSameParent = function($el) {
                    var _selectedElements = Kdo.featurer.getSelectedBox(_$element);
                    var _$parent = _selectedElements.length > 0 ? $(_selectedElements[0]).parent() : null;
                    return !_$parent || _$parent.attr("id") == $el.parent().attr("id")
                }
                var options = $.extend({
                    filter: ".box.group,.box.single:not(.child)",
                    cancel: ".design_text_editor,select,input,textarea",
                    distance: 10,
                    tolerance: 'fit',                   //被选元素完全覆盖的时候才会框选
                    start: function(event, ui) {
                        //针对filter的功能扩展：将group box的子集box增加child类名，便于过滤。
                        _$element.find(".box.group>.box").addClass("child");
                        setTimeout(function() { Kdo.box.clean(); }, 1);   //由于selectable内部会默认加上边框，所以加了timeout处理。
                    },
                    selecting: function(event, ui) {
                        var _$el = $(ui.selecting);
                        if (_isSameParent(_$el)) {
                            _$el.addClass('on');
                        }
                    },
                    unselecting: function(event, ui) {
                        var _$el = $(ui.unselecting);
                        if (_isSameParent(_$el)) {
                            setTimeout(function() { _$el.removeClass('on'); }, 2);
                        }
                    },
                    selected: function(event, ui) {
                        var _$el = $(ui.selected);
                        if (_isSameParent(_$el)) {
                            _$el.addClass('on');
                        }
                    },
                    stop: function(event, ui) {
                        var _selectedElements = Kdo.featurer.getSelectedBox(_$element);
                        if (_selectedElements.length > 0) {
                            Kdo.box.temp.enter(_selectedElements);
                        }
                        //移除group box的子集box的child类名
                        _$element.find(".box.group>.box.single").removeClass("child");
                    }
                }, _options || {});

                $(_$element).selectable(options);
            },
            selectable_fn: {
                enable: function() { _$element.selectable("enable"); },
                disable: function() { _$element.selectable("disable"); }
            }
        }
    });
});