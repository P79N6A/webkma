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
        临时保存功能块
    */
    var _isTemp = false,        //存储当前是否存在临时存档
        _data = null,
        interval = null,
        pageNumber='';

    //初始化函数
    var _init = function (number) {
        //初始化页面数据时需要把number一起保存起来
        pageNumber = number;
        _data = _setData();
        _isTemp = false;
        if (!interval) {
            interval = setInterval(_save, 500);
        }
    }

    var _setData = function () {
        return Kdo.utils.copy({
            //pageNumber: Kdo.data.config.page.get().pageNumber,
            number: Kdo.data.config.page.get().number,
            data: Kdo.data.controls.all(),
            config: Kdo.data.config.page.get(),
            number:pageNumber
        });
    }

    //临时保存函数
    var _save = function () {
        var _currentData = _setData();
        if (!_.isEqual(_data, _currentData)) {
            _isTemp = true;
            //Kdo.service.page.tempSave(_currentData, function (result) { //TODO: 对象参数没有包含pageNumber，暂时没有用该方法了
            //    _data = _currentData;
            //    _isTemp = true;
            //});
        }
    }

    $.extend(true, window.Kdo, {
        page: {
            temp: {
                init: _init,
                save: _save,
                isTemp: function () { return _isTemp; },
                getData:_setData
            }
        }
    })
});