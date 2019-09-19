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
        页面操作模块相关函数
    */
    //选择对象的作用域
    var _switchControls = function (controlConfig) {
        if (!controlConfig) {
            var _pageControls = Kdo.utils.copy(Kdo.data.page.controls),
                _siteControls = Kdo.utils.copy(Kdo.data.site.controls);
            //如果页面不支持模块共享，则排除siteControls中的共享模块
            if (Kdo.data.config.page.get().supportShareControls == "false") {
                _siteControls = _.filter(_siteControls, function (control) { return control.share != true });
            }
            return _pageControls.concat(_siteControls);
        } else if (!!controlConfig.global || !!controlConfig.share) {    //全局模块or共享模块
            return Kdo.data.site.controls;
        } else if (!controlConfig.global) {     //页面模块
            return Kdo.data.page.controls;
        }
    }

    //所有模块
    var _getAllControls = function (controls) {
        if (!!controls) {
            Kdo.data.page.controls = _.filter(controls, function (control) { return !control.global });
            Kdo.data.site.controls = _.filter(controls, function (control) { return !!control.global });
        }
        return _switchControls();
    }

    //保存模块对象到页面对象中
    var _setControls = function (controlConfig) {
        var _controlConfig = _.isArray(controlConfig) ? controlConfig : [controlConfig];
        _.each(_controlConfig, function (item) {
            var dataControls = _switchControls(item),
                _control = _.findWhere(dataControls, { controlId: item.controlId });
            if (!_control) {
                dataControls.push(Kdo.utils.copy(item));
            } else {
                _control = $.extend(_control, item);
            }
        });
    }

    //获取保存在页面中的模块对象, 返回数组
    var _getControls = function (controlIds) {
        var _controlIds = _.isArray(controlIds) ? controlIds : [controlIds],
            _result = [];
        _.each(_controlIds, function (controlId) {
            _result = _result.concat(_.filter(_switchControls(), function (controlConfig) { return controlConfig.controlId == controlId }));
        });
        return _result;
    }

    //获取当前选中(focus)模块的数据对象(JSON)；返回数组格式
    var _getControlsByFocus = function () {
        var _currentBox = Kdo.box.utils.getCurrentBox(),
            _controlConfigs = [];
        $.each(_currentBox.$focusSingleBox, function (i, _el) {
            var _$el = $(_el),
                _temp = _getControls(Kdo.box.utils.getBoxControlId(_$el))[0];
            if (!!_temp) _controlConfigs.push(_temp);
        });
        return Kdo.utils.copy(_controlConfigs);
    }

    var _getControlsByKey = function (keys) {
        var keys = _.isArray(keys) ? keys : [keys],
            _result = [];
        _.each(keys, function (key) {
            _result = _result.concat(_.filter(_switchControls(), function (controlConfig) { return controlConfig.key == key }));
        });
        return _result;
    }

    var _getControlsBySingleGroup = function (singleGroupValue) {
        var singleGroupValue = _.isArray(singleGroupValue) ? singleGroupValue : [singleGroupValue],
            _result = [];
        _.each(singleGroupValue, function (val) {
            _result = _result.concat(_.filter(_switchControls(), function (controlConfig) { return !!controlConfig.singleGroup && controlConfig.singleGroup == val }));
        });
        return _result;
    }

    // 整个活动中是否存在single控件
    var _existsSingleControl = function (key) {
        if (!!_existsSingleControlInPage(key)) {
            return { pageIndex: Kdo.data.pages.findIndex(page => { return page.number == Kdo.data.config.page.get().number }) };
        }
        // 所有页面
        var pages = Kdo.data.pages,
            pglen = pages.length,
            currentPageNumber = Kdo.data.config.page.get().number;
        for (var pIndex = 0; pIndex < pglen; pIndex++) {
            if (pages[pIndex].number === currentPageNumber) {
                continue;
            }
            var ctrls = pages[pIndex].data,
                len = ctrls.length;
            for (var i = 0; i < len; i++) {
                if ((!key || ctrls[i].key == key) && ctrls[i].single === true) {
                    return { pageIndex: pIndex };
                }
            }
        }
        return null;
    }

    // 在当前页面是否存在single控件
    var _existsSingleControlInPage = function (key) {
        var ctrls = Kdo.data.site.controls,
            len = ctrls.length;
        // 全局站点
        for (var i = 0; i < len; i++) {
            if ((!key || ctrls[i].key == key) && ctrls[i].single === true) {
                return true;
            }
        }
        // 当前页面
        ctrls = Kdo.data.page.controls;
        len = ctrls.length;
        for (i = 0; i < len; i++) {
            if ((!key || ctrls[i].key == key) && ctrls[i].single === true) {
                return true;
            }
        }
        return false;
    }

    // 整个活动中是否存在游戏插件
    var _existsGameControl = function () {
        if (!!_existsGameControlInPage()) {
            return { pageIndex: Kdo.data.pages.findIndex(page => { return page.number == Kdo.data.config.page.get().number }) };
        }
        // 所有页面
        var pages = Kdo.data.pages,
            pglen = pages.length,
            currentPageNumber = Kdo.data.config.page.get().number;
        for (var pIndex = 0; pIndex < pglen; pIndex++) {
            if (pages[pIndex].number === currentPageNumber) {
                continue;
            }
            var ctrls = pages[pIndex].data,
                len = ctrls.length;
            for (var i = 0; i < len; i++) {
                if (["draw", "game"].includes(ctrls[i].pluginType)) {
                    return { pageIndex: pIndex };
                }
            }
        }
        return null;
    }

    // 在当前页面是否存在游戏插件
    var _existsGameControlInPage = function () {
        var ctrls = Kdo.data.site.controls,
            len = ctrls.length;
        // 全局站点
        for (var i = 0; i < len; i++) {
            if (["draw", "game"].includes(ctrls[i].pluginType)) {
                return true;
            }
        }
        // 当前页面
        ctrls = Kdo.data.page.controls;
        len = ctrls.length;
        for (i = 0; i < len; i++) {
            if (["draw", "game"].includes(ctrls[i].pluginType)) {
                return true;
            }
        }
        return false;
    }

    //修改模块对象
    var _updateControls = function (controlConfig) {
        var _controlConfig = _.isArray(controlConfig) ? controlConfig : [controlConfig];
        _.each(_controlConfig, function (item) {
            var _control = _.findWhere(_switchControls(item), { controlId: item.controlId });
            if (!!_control) {
                _control = $.extend(_control, item);
            }
            //console.log("width: "+_control.style.width + " height: " + _control.style.height + " left: " + _control.style.left + " top: " + _control.style.top);  //test
        });
    }

    //删除模块对象
    var _delControls = function (controlIds) {
        var _controlIds = _.isArray(controlIds) ? controlIds : [controlIds];
        _.each(_controlIds, function (controlId) {
            Kdo.data.site.controls = _.filter(Kdo.data.site.controls, function (controlConfig) { return controlConfig.controlId != controlId });
            Kdo.data.page.controls = _.filter(Kdo.data.page.controls, function (controlConfig) { return controlConfig.controlId != controlId });
        });
        //console.log("_delControls: dataControls: " + dataControls.length);
    }

    //切换页面数据
    var _togglePage = function (beforeNumber, afterNumber) {

        $.each(Kdo.data.pages, function (index, item) {
            //保存切换前的controls.page和config.page
            if (item.number == beforeNumber) {
                Kdo.page.release.page(function (fileResult) {
                    item.config = JSON.stringify(Kdo.data.config.page);
                    item.data = JSON.stringify(Kdo.data.page.controls);
                    item.htmlData = fileResult.context;
                });
            }

            //将切换后的controls.page和config.page放入当前操作的page对象中
            if (item.number == afterNumber) {
                Kdo.data.config.page = Kdo.utils.copy(item.config);
                Kdo.data.page.controls = Kdo.utils.copy(item.data);
            }
        });
    }

    $.extend(true, window.Kdo, {
        data: {
            controls: {
                all: _getAllControls,
                get: _getControls,
                set: _setControls,
                del: _delControls,
                update: _updateControls,
                getFocus: _getControlsByFocus,
                getKeys: _getControlsByKey,
                getBySingleGroup: _getControlsBySingleGroup,
                togglePage: _togglePage,
                existsSingleControl: _existsSingleControl,
                existsSingleControlInPage: _existsSingleControlInPage,
                existsGameControl: _existsGameControl,
                existsGameControlInPage: _existsGameControlInPage
            }
        }
    });
});