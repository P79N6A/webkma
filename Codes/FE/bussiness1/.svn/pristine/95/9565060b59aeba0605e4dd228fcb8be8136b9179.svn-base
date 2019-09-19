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
       链接输入框
    */
    var _currentControlId;
    var _load = function (controlId) {
        _currentControlId = controlId;
    }

    var _html = function (isPayUser) {
        if (isPayUser == "false") {
            var _$textHtml = '<div class="link-form">'
                + '开通会员享受外链功能，<a href="/#/memberjoin" target="_blank">立即开通</a>'
                + '</div>'
            return _$textHtml;
        }
        var _link_value = "";
        var _controlConfig = Kdo.box.utils.getControlConfigById(_currentControlId);
        if (!!_controlConfig.data["link"]) {
            _link_value = _controlConfig.data["link"] || "";
        }
        var _$linkHtml =
            '<div class="link-form">'
            + '<div class="el-input el-input-group el-input-group--append el-input-group--prepend eleme_input_group">'
            + '  <div class="el-input-group__prepend">链接</div>'
            + '  <input id="js_link_value" type="text" autocomplete="off" placeholder="http://" value="' + _link_value + '" class="el-input__inner">'
            + '  <div class="el-input-group__append">'
            + '      <button id="js_submit_link" type="button" class="el-button el-button--primary" style="margin-top:-1px;"><i class="el-icon-check"></i></button>'
            + '  </div>'
            + '</div>'
            + '</div>'

        return _$linkHtml;
    }

    var _render = function () {
        var $element = $(".link-form");
        //保存链接
        $element.find("#js_submit_link").click(function () {
            var $el = $element.children(".el-input-group");
            if (!$el.hasClass("changed-val")) return;
            $el.removeClass("changed-val");

            //$(".link-form").find("input").off("blur").on("blur", function () {
            var _link = $(".link-form").find("input").val();
            //var _link = this.value;
            if (_link !== "" && !/^https?\:\/\//.test(_link)) {
                Kdo.utils.notification.error("链接必须以 http:// 或 https:// 开头");
                return false;
            }
            var _controlConfig = Kdo.box.utils.getControlConfigById(_currentControlId);
            _controlConfig.data["link"] = _link;
            Kdo.data.controls.update(_controlConfig);
            //操作记录
            Kdo.featurer.actionLogs.log();
            //刷新选中模块
            Kdo.box.utils.refresh();
            Kdo.utils.notification.success("链接地址保存成功");
        });

        // 监听输入框事件
        $element.find("#js_link_value").bind("input propertychange change", function (event) {
            var $el = $element.children(".el-input-group")
            $el.addClass("changed-val");
        });
    }

    $.extend(true, window.Kdo, {
        settings: {
            link: {
                load: _load,
                html: _html,
                render: _render
            }
        }
    });
});