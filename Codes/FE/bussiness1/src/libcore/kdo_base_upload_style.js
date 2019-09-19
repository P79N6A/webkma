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
   上传样式
*/
    var _currentCache = null;
    var _uploadStyle = function ($target) {
        $.get('/views/templates/framework-style-create.tpl.html', function (result) {
            Kdo.modal.createForAngular({
                title: '上传样式',
                template: result
            })
        });
        
    }
    var _status = function () {
        var _currentBox = Kdo.box.utils.getCurrentBox();

        var _status = _currentBox.$focusBox.length == 1 && _currentBox.focusLevel == 'single';
        if (!!_status) {
            $.each(_currentBox.$focusSingleBox, function (i, _el) {
                var controlId = Kdo.box.utils.getBoxControlId($(_el)),
                    controlConfig = Kdo.data.controls.get(controlId)[0];
                if (!!controlConfig && _.findIndex(controlConfig.banTools, function (key) { return key == "uploadStyle" }) != -1 || !!sessionStorage.getItem('kcms_user')) {
                    _status = false;
                    return false;
                }
            });
        }

        return _status;
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
        uploadStyle: {
            upload: _uploadStyle,
            status: _status,
            on: _on
        }
    })

});