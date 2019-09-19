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
        记录、撤销、重做
    */
    var _logs = [[]],   //记录每次操作的状态(controls), 第一个位置初始化为空数据.
        _index = 0,     //当前操作的索引(默认指向最后一个存在的log下标)
        _triggers = []; //回调事件集合——用于_logs对象改变时按顺序触发

    //撤销
    var _undo = function () {
        if (_index > 0) {
            _index--;
            _repairControls(Kdo.utils.copy(_logs[_index]));
            //console.log("undo index: " + _index);
            _trigger();
        }
    }

    //重做
    var _redo = function () {
        if (_index + 1 < _logs.length) {
            _index++;
            _repairControls(Kdo.utils.copy(_logs[_index]));
            //console.log("redo index: " + _index);
            _trigger();
        }
    }

    //记录
    var _log = function () {
        _index++;
        //生成临时对象，保存从下标为0位置开始到当前index索引位置的记录。（目的：抛弃后面的记录。用于undo后记录新的状态时，删除数组中当前索引后面的垃圾记录）
        var _temp = [];
        for (var i = 0; i < _index; i++) {
            _temp[i] = _logs[i];
        }
        _temp[_index] = Kdo.utils.copy(Kdo.data.controls.all());
        _logs = _temp;
        //console.log(_logs);
        _trigger();
    }

    var _clear = function () {
        _logs = [[]];
        _index = 0;
        _trigger();
    }

    //注册记录后调用的回调函数
    var _on = function (key, callback) {
        //TODO: 这里可以根据key做重写处理。目前业务上用不到，暂时不用加。
        _triggers.push({ key: key, callback: callback });
    }

    //触发回调函数(private)
    var _trigger = function () {
        var _status = {
            undo: _index > 0,
            redo: _index < _logs.length - 1
        };
        _.each(_triggers, function (trigger) {
            if (!!trigger.callback) {
                trigger.callback(_status);
            }
        });
    }

    //执行恢复操作
    var _repairControls = function (repairControls) {
        var currentControls = Kdo.utils.copy(Kdo.data.controls.all()),
            _selectedControlIds = [],
            _repairControls = [],
            _filterControlIds = [];

        var _collectControlId = function (groupId) {
            var _groupControls = _.filter(Kdo.data.controls.all(), function (controlConfig) { return controlConfig.groupId == groupId });
            _.each(_groupControls, function (controlConfig) {
                if (!_.findWhere(_repairControls, { controlId: controlConfig.controlId })) {
                    _repairControls.push(controlConfig);
                    _filterControlIds.push(controlConfig.controlId);
                }
            });
        }

        //比较差异模块是否为活动插件，开启活动插件创建的锁 mars 17.9.5
        _.each(currentControls, function (_currentControl) {
            if (!_.findWhere(repairControls, { controlId: _currentControl.controlId })) {
                var _$box = Kdo.container.$background().find("#" + _currentControl.controlId).parents(".box.single").first(),
                    _$group = _$box.parents(".box.group").first();
                //单个模块
                if (Kdo.data.controls.get(Kdo.box.utils.getBoxControlId(_$box))[0].singleGroup == 'activity') {
                    delete window.hasPlugin;
                }
                //组合
                if (_$group.length > 0) {
                    var _groupControls = _.filter(Kdo.data.controls.all(), function (controlConfig) { return controlConfig.groupId == _$group.attr("id") });
                    _.each(_groupControls, function (controlConfig) {
                        if (controlConfig.singleGroup == 'activity') {
                            delete window.hasPlugin;
                        }
                    });
                }
            }
        });

        //将记录的整体对象赋予页面对象（全完替换）
        Kdo.data.controls.all(repairControls);

        //临时保存已选中的模块，用于恢复之后重新选中。
        $.each(Kdo.featurer.getSelectedBox(Kdo.container.$background()), function (i, _el) {
            var _$box = $(_el);
            if (_$box.hasClass("group")) {
                $.each(_$box.find(".box.single"), function (i, _box) { _selectedControlIds.push(Kdo.box.utils.getBoxControlId(_box)); });
            } else {
                _selectedControlIds.push(Kdo.box.utils.getBoxControlId(_$box));
            }
        });

        //找出差异模块，并对其重新渲染。
        //记录中(repairControls)多出来的模块需要创建
        _.each(repairControls, function (_repairControl) {
            if (!_.findWhere(currentControls, { controlId: _repairControl.controlId })) {
                if (!_.findWhere(_repairControls, { controlId: _repairControl.controlId })) {
                    _repairControls.push(_repairControl);
                    _filterControlIds.push(_repairControl.controlId);
                }
                if (!!_repairControl.groupId) {
                    _collectControlId(_repairControl.groupId);
                    Kdo.container.$background().find("div[id='" + _repairControl.groupId + "'].box.group").remove();
                }
            }
        });

        //当前页面上(repairControls)多出来的模块需要删除
        _.each(currentControls, function (_currentControl) {
            if (!_.findWhere(repairControls, { controlId: _currentControl.controlId })) {
                var _$box = Kdo.container.$background().find("#" + _currentControl.controlId).parents(".box.single").first(),
                    _$group = _$box.parents(".box.group").first();

                _$box.remove();
                if (_$group.length > 0) {
                    _collectControlId(_$group.attr("id"));
                    _$group.remove();
                }
            }
        });

        //都存在的模块,需要恢复到记录中(repairControls)模块的状态
        _.each(repairControls, function (_repairControl) {
            var _currentControl = _.findWhere(currentControls, { controlId: _repairControl.controlId });
            //如果记录中的模块和当前页面上的模块深度匹配不成功，则执行删除和恢复操作。
            if (!!_currentControl && !_.isEqual(_repairControl, _currentControl)) {
                if (!_.findWhere(_repairControls, { controlId: _repairControl.controlId })) {
                    _repairControls.push(_repairControl);
                }
                _filterControlIds.push(_repairControl.controlId);
                Kdo.container.$background().find("#" + _currentControl.controlId).parents(".box.single").first().remove();

                if (!!_repairControl.groupId) {
                    _collectControlId(_repairControl.groupId);
                    Kdo.container.$background().find("div[id='" + _repairControl.groupId + "'].box.group").remove();
                }
                if (!!_currentControl.groupId) {
                    _collectControlId(_currentControl.groupId);
                    Kdo.container.$background().find("div[id='" + _currentControl.groupId + "'].box.group").remove();
                }
            }
        });
        //恢复所有相关模块
        Kdo.page.create.repair(_repairControls);

        //进行组合恢复操作
        Kdo.featurer.group.repair(_.uniq(_filterControlIds));

        //重新选中“恢复前已选中”模块
        var _$selectedControls = null;
        $.each(_selectedControlIds, function (i, _controlId) {
            var _$box = $("div[id='" + _controlId + "']").parents(".box.single,.box.group").last();
            _$selectedControls = _$selectedControls == null ? _$box : _$selectedControls.add(_$box);
        });

        Kdo.box.temp.enter($(_$selectedControls));
    }

    $.extend(true, window.Kdo, {
        featurer: {
            actionLogs: {
                log: _log,
                undo: _undo,
                redo: _redo,
                on: _on,
                clear: _clear
            }
        }
    });
});