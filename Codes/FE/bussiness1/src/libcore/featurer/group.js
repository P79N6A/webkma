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
    锁定、解锁
*/
    var _group = function () {
        if (_status().group) {
            _action("group");
        }
    }

    var _ungroup = function () {
        if (_status().ungroup) {
            _action("ungroup");
        }
    }

    var _action = function (type) {
        var _updateControls = [],
            _currentBox = Kdo.box.utils.getCurrentBox(),
            _groupId = _newGroupId(),
            _callback = function (controlId) {
                var _controlConfig = Kdo.data.controls.get(controlId)[0];
                switch (type) {
                    case "group":
                        _controlConfig.groupId = _groupId;
                        _controlConfig.lock = false;        //fix bug No: 7967——模块进行组合操作时，解锁单模块锁定状态。
                        _updateControls.push(_controlConfig);
                        break;
                    case "ungroup":
                        if (!!_controlConfig.groupId) {
                            _controlConfig.groupId = null;
                            _controlConfig.lock = false;    //fix bug No: 7944——模块进行解组操作时，强制解除模块的锁定状态。
                            _updateControls.push(_controlConfig);
                        }
                        break;
                }
            }
        $.each(_currentBox.$focusSingleBox, function (i, _el) {
            var _$el = $(_el);
            if (_$el.hasClass("group")) {
                $.each(_$el.children(".box.single"), function (i, _box) {
                    _callback(Kdo.box.utils.getBoxControlId($(_box)));
                });
            } else {
                _callback(Kdo.box.utils.getBoxControlId(_$el));
            }
        });
        //如果有改变，才执行update
        if (_updateControls.length > 0) {
            _update(_updateControls);
        }
    }

    var _update = function (controls) {
        //------------------更新页面controls对象(JSON)------------------
        Kdo.data.controls.update(controls);
        //------------------操作记录------------------
        Kdo.featurer.actionLogs.log();
        //------------------更新页面呈现元素(DOM)------------------
        //刷新选中模块
        Kdo.box.utils.refresh();
    }

    //恢复组合形态（controlIds为可选指定项）
    var _repairGroupBox = function (controlIds) {
        var _controlConfigs = [];
        if (!!controlIds) {
            //指定controlId
            if (!_.isArray(controlIds)) controlIds = [controlIds];
            //获取当前controlIds (这里的controlIds会匹配controlId和groupId)
            var _targetControls = _.filter(Kdo.data.controls.all(), function (controlConfig) {
                return !!controlConfig.groupId && (_.indexOf(controlIds, controlConfig.controlId) != -1 || _.indexOf(controlIds, controlConfig.groupId) != -1);
            });
            //获取targetControls对应的所有相关的group controls
            _controlConfigs = _.filter(Kdo.data.controls.all(), function (controlConfig) { return _.findIndex(_targetControls, { groupId: controlConfig.groupId }) != -1 });
        } else {
            //获取所有group controls
            _controlConfigs = _.filter(Kdo.data.controls.all(), function (controlConfig) { return !!controlConfig.groupId });
        }
        if (_controlConfigs.length == 0) return;

        var _groupByControlConfigs = _.groupBy(_controlConfigs, function (controlConfig) { return controlConfig.groupId });

        for (var key in _groupByControlConfigs) {
            //进行组合恢复操作
            Kdo.box.group.binder(_groupByControlConfigs[key]);
        }
    }

    //创建一个GroupId
    var _newGroupId = function () {
        return "group_" + uuid.v4();
    }

    //验证编辑界面素材是否为一个组合素材
    var _isGroupMaterial = function () {
        var _groupId = "", _status = true;
        _.each(Kdo.data.controls.all(), function (item, i) {
            if (!item.groupId) {
                _status = false;
                return false;
            }
            if (i == 0) {
                _groupId = item.groupId;
            }
            if (item.groupId != _groupId) {
                _status = false;
                return false;
            }
        })
        return _status;
    }

    var _status = function () {
        var _currentBox = Kdo.box.utils.getCurrentBox();
        return {
            group: _currentBox.focusLevel == "temp",
            ungroup: _currentBox.focusLevel == "group"
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
            group: {
                group: _group,
                ungroup: _ungroup,
                status: _status,
                on: _on,
                repair: _repairGroupBox,
                newGroupId: _newGroupId,
                isGroupMaterial: _isGroupMaterial
            }
        }
    });
});