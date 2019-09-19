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
        页面基础数据相关函数
    */
    var _pageConfigs = {},  //保存页面的数据对象
        _pageControls = [], //保存页面上的所有模块的controlConfig对象
        _triggers = [],
        _defaultSize={ width: 320, height: 615 }; // 每个页面的默认尺寸

    var _getCurrentPageData = function () {
        var _currentPageData = null,
            number = Kdo.data.config.page.get().number;
        $.each(_pages, function (index, item) {
            if (item.number === number) {
                _currentPageData = item;
                return false;
            }
        });
        if (!_currentPageData) {
            _currentPageData = _createPage();
            _pages.push(_currentPageData);
        }
        return _currentPageData;
    }
    var _createPage = function (number) {
        number = number || Kdo.utils.uuid()
        var _currentPageData = {
            config: { number: number,style:$.extend(true,{},_defaultSize) },
            data: [],
            number: number
        }
        return _currentPageData;
    }

    var _savePage = function () {
        var pageData = Kdo.page.temp.getData();
        var idx = Kdo.data.pages.findIndex(p => p.number === pageData.number);
        if (idx >= 0) {
            Kdo.data.pages[idx] = pageData;
        }
    }

    var _sort = function (sortFn) {
        if (_.isFunction(sortFn)) {
            Kdo.data.pages.sort(sortFn);
        }
        else if (_.isArray(sortFn)) {
            var pages = Kdo.data.pages,
                pageMap = {},
                len = pages.length;
            for (var i = 0; i < len; i++) {
                var rec = pages[i];
                pageMap[rec.number] = rec;
            }
            Kdo.data.pages = sortFn.map(function (number) {
                return pageMap[number];
            })
        }
    }
    $.extend(true, window.Kdo, {
        data: {
            config: {
                page: Kdo.data.config.init(_pageConfigs, _triggers)
            },
            page: {
                controls: _pageControls,
                save: _savePage,
                newPage: _createPage,
                sort: _sort,
                defaultSize:$.extend(true,{},_defaultSize),
            }
        }
    });
});