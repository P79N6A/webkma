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
    设置相关基础控制（弹窗、模块加载……）
*/
    var _tempControlConfig = null;  //缓存自定义Settings时的配置对象。

    var _open = function (type, options) {
        var _currentBox = Kdo.box.utils.getCurrentBox();
        var timespan = "?timespan=" + Date.now();
        switch (type) {
            //case "style":
            //    if (_currentBox.focusLevel == "temp") return;
            //    $.get("/views/templates/framework-edit-style.tpl.html" + timespan, function (result) {
            //        Kdo.modal.createForAngular({
            //            title: "样式设置",
            //            template: result
            //        });
            //    });
            //    break;
            case "data":
                if (_currentBox.focusLevel != "single") return;
                var controlConfig = Kdo.data.controls.get(Kdo.box.utils.getBoxControlId(_currentBox.$focusBox))[0];
                switch (controlConfig.struct) {
                    case "text":    //直接进入文本编辑模式
                        Kdo.settings.font.open();
                        break;
                    case "adsorb":  //吸附框内层编辑(drag & resize)
                        Kdo.settings.adsorb.open();
                        break;
                }
                //if (!!controlConfig && !controlConfig.global && !!controlConfig.settingTemplateUrl) {
                //    $.get(controlConfig.settingTemplateUrl + timespan, function (result) {
                //        Kdo.modal.createForAngular({
                //            title: "模块设置",
                //            template: result
                //        });
                //    });
                //}
                break;
            //case "custom":
            //    Kdo.page.create.load(Kdo.utils.copy(options.menu), function (controlConfig) {
            //        _tempControlConfig = controlConfig;
            //        //如果模块为全局模块，则尝试从当前稿件controls中获取数据
            //        if (!!_tempControlConfig.global) {
            //            var _existControlConfig = Kdo.data.controls.get(_tempControlConfig.controlId)[0];
            //            if (!!_existControlConfig) _tempControlConfig = _existControlConfig;
            //        }
            //        Kdo.modal.createForAngular({
            //            title: options.title,
            //            template: options.template
            //        });
            //    });
            //    break;
        }
    }

    var _close = function (event, controlConfig) {
        if (!!controlConfig) {
            //计算等比例高宽
            Kdo.page.create.calculateAspectRatio(controlConfig, function () {
                //更新模块对象
                Kdo.data.controls.set(controlConfig);
                //删除原DOM
                $("#" + controlConfig.controlId).parents(".box:first").remove();
                //恢复新DOM
                Kdo.page.create.repair(controlConfig);
                //操作记录
                Kdo.featurer.actionLogs.log();
                //重新选择模块
                Kdo.box.temp.enter($("#" + controlConfig.controlId).parents(".box:first"));
            });
        }
        //关闭窗口（新版modal）
        if (!!event) window.Kdo.utils.modalBox.hide(event.target);

        //暂时保留（原版modal）
        if (!!event) $(event.currentTarget).parents(".lanh-modal").dialog("close");
        else $(".lanh-modal").dialog("close");

        //清除当前操作的settings模块
        if (!!_tempControlConfig) _tempControlConfig = null;
    }

    var _status = function () {
        var _currentBox = Kdo.box.utils.getCurrentBox(),
            _controlConfig = null;
        if (_currentBox.focusLevel != "temp") {
            _controlConfig = Kdo.data.controls.get(Kdo.box.utils.getBoxControlId(_currentBox.$focusBox))[0];
        }
        return {
            //组件库页面不允许修改Data
            data: !!_controlConfig && !!_controlConfig.settingTemplateUrl && !_controlConfig.global && (!_controlConfig.floatbar || _.indexOf(_controlConfig.floatbar, "settings") != -1),
            style: (!_controlConfig.floatbar || _.indexOf(_controlConfig.floatbar, "style") != -1) //!_controlConfig.global
        }
    }

    var _currentControlConfig = function () {
        return _tempControlConfig;
    }

    $.extend(true, window.Kdo, {
        settings: {
            open: _open,
            close: _close,
            currentControlConfig: _currentControlConfig,
            status: _status
        }
    })
});