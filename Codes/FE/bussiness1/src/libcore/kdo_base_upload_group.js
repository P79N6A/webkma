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
    var _upload = function ($target) {
        Kdo.utils.modalBox.init({
            headerTitle: "上传组合素材",
            templateUrl: "views/templates/design/upload-group-controls_tpl.html",
            width: 300
        });
    }

    var _status = function () {
        var _currentBox = Kdo.box.utils.getCurrentBox();
        return _currentBox.focusLevel == "group" && Kdo.utils.permission("uploadGroup");//用户权限
    }

    $.extend(true, window.Kdo, {
        uploadGroup: {
            upload: _upload,
            status: _status
        }
    });
});