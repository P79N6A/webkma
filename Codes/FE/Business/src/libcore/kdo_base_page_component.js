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
    组件操作(添加、保存)
    */
    //获取当前组件到page中
    var _getComponent = function (componentNumber, callback) {
        $.ajax({
            url: lanh.kdesignHost + "component/" + componentNumber,
            data: { componentNumber: componentNumber },
            success: function (result) {
                callback(result);
            },
            error: function (result) {
                if (!!result.responseJSON)
                    window.Kdo.messageService.error(result.responseJSON.message);
                callback();
            }
        })
    }

    var _loadCompontent = function (controlConfigs) {
        var _controlConfigs = _.isArray(controlConfigs) ? Kdo.utils.copy(controlConfigs) : [Kdo.utils.copy(controlConfigs)],
            _$selectedControls = null;  //重新选中“恢复前已选中”模块
        $.each(_controlConfigs, function (i, control) {
            Kdo.data.controls.set(control);
            Kdo.page.create.repair(control);
            var _$box = $("div[id='" + control.controlId + "']").parents(".box:first");
            _$selectedControls = _$selectedControls == null ? _$box : _$selectedControls.add(_$box);
        });
        Kdo.box.temp.enter($(_$selectedControls));
    }

    //获取组件列表
    var _getAllComponents = function () {
        $.get("/views/settings/components.tpl.html", function (template) {
            Kdo.modal.createForAngular({
                title: '组件列表',
                template: template
            });
        });
    }

    $.extend(true, window.Kdo, {
        component: {
            all: _getAllComponents,
            get: _getComponent,
            load: _loadCompontent
        }
    });

});