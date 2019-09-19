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

    var _init = function ($el, args) {
        if (!$el) return;
        var $element = $el;
        var tpl = `
            <span role="button" class="el-input-number__decrease">
                <i class="el-icon-arrow-down"></i></span>
            <span role="button" class="el-input-number__increase">
                <i class="el-icon-arrow-up"></i>
            </span>
            <div class="el-input">
                <input type="text" class="el-input__inner"></div>
            </div>`;
        $element.addClass("el-input-number").addClass("is-controls-right");
        $element.html(tpl);
        var options = {
            min: parseFloat($element.attr("min") || 0),
            max: parseFloat($element.attr("max") || 10),
            step: parseFloat($element.attr("step") || 1),
            precision: parseInt($element.attr("precision") || 1),
            change: $element.attr("change")
        }
        var $input = $element.find("input.el-input__inner"),
            calculate = function (variable) {
                var newVal = parseFloat($input.val());
                if (isNaN(newVal)) newVal = 1;
                if (variable) newVal = newVal + variable;
                if (options.min > newVal) newVal = options.min;
                if (options.max < newVal) newVal = options.max;
                return newVal == 0 ? newVal : newVal.toFixed(options.precision);
            },
            delayHandle, loopHandle, emitHandle;
        if (args) $input.val(args.value == 0 ? args.value : (args.value || options.min).toFixed(options.precision));
        $input.on("keyup", function (event) {
            clearTimeout(delayHandle);
            clearInterval(loopHandle);
            if (options.change) {
                clearTimeout(emitHandle);
                emitHandle = setTimeout(() => {
                    var newValue = calculate();
                    $input.val(newValue);
                    $element.trigger(options.change, { value: newValue });
                }, event.keyCode == 38 || event.keyCode == 40 || event.keyCode == 13 ? 0 : 500);
                // up/down/enter立即触发(提升体验)
            }
        });
        $input.on("keydown", function (event) {
            var loop = function () {
                var newVal;
                switch (event.keyCode) {
                    case 38:    //up
                        newVal = calculate(options.step);
                        break;
                    case 40:    //down
                        newVal = calculate(-options.step);
                        break;
                    default: return;
                }
                if (newVal !== null) $input.val(newVal);
            }
            loop();
            clearTimeout(delayHandle);
            clearInterval(loopHandle);
            delayHandle = setTimeout(() => {
                loopHandle = setInterval(loop, 200);
            }, 500);
        });
        $element.find(".el-input-number__increase").on("click", function () {
            var newVal = calculate(options.step);
            $input.val(newVal);
            if (options.change) $element.trigger(options.change, { value: newVal });
        });
        $element.find(".el-input-number__decrease").on("click", function () {
            var newVal = calculate(-options.step);
            $input.val(newVal);
            if (options.change) $element.trigger(options.change, { value: newVal });
        });
        return {
            setValue: function (value) {
                $input.val(value === 0 ? value : (parseFloat(value || options.min)).toFixed(options.precision))
            },
            getValue: function () { return $input.val() },
            getOptions: function () { return options }
        };
    }

    $.extend(true, window.Kdo, {
        components: {
            inputNumber: {
                init: _init,
            }
        }
    });
});