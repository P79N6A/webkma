import sysConfig from "config/system.js";
import module from 'config/design/module'
import structConfig from 'config/design/struct'
import { debug } from "util";
// import "../libcore/kdo_base_utils"

//递归生成模块结构(模块基础结构 + 模块信息)
var _recursion = function (menus) {
    for (var i = 0; i < menus.length; i++) {
        if (!!menus[i].struct) {
            menus[i] = $.extend(true, Kdo.utils.copy(structConfig[menus[i].struct]), Kdo.utils.copy(menus[i]));
        }
        if (!!menus[i].childs && menus[i].childs.length > 0) {
            menus[i].childs = _recursion(menus[i].childs);
        }
    }
    return menus;
};
for (var key in module) {
    module[key] = _recursion(module[key]);
}

var _menuJson = module;

let _selectedMenuOption;
let _searchMenuOption = function (key, _menus) {
    _menus.forEach(_menu => {
        if (_selectedMenuOption) return;
        // debugger
        if (_menu.key == key) {
            _selectedMenuOption = _menu;
        } else if (!!_menu.childs && _menu.childs.length > 0) {
            _searchMenuOption(key, _menu.childs);
        }
    })
}

let leftMenuService = {
    getMenuJson() {

    },
    pushMenuJson(category, data) {
        let type = ""

        category.includes("background") ? type = "background" : type = "controls"
        // debugger
        let controls = _menuJson[type].find(item => {
            return item.key == category;
        }).childs;
        let result = [];
        data.forEach(item => {
            var retStruct;
            switch (item.mtrType) {
                // case "text":
                //     retStruct = window.Kdo.utils.copy(structConfig["text"]);
                //     break;
                case "img":
                    retStruct = Object.assign(
                        window.Kdo.utils.copy(structConfig["image"]),
                        {
                            key: item.mtrId,
                            name: "",
                            data: {
                                src: /^(http|https)/i.test(item.mtrSource) ? item.mtrSource : (sysConfig.image_host + item.mtrSource)
                            },
                            coverPicture: item.mtrSource,
                        }
                    );
                    break;
                case "svg":
                    retStruct = Object.assign(
                        window.Kdo.utils.copy(structConfig["svg"]),
                        {
                            key: item.mtrId,
                            name: "",
                            defaultTemplate: { html: item.mtrTemplate },
                            resourceSrc: item.mtrSource,
                            coverPicture: item.mtrSource,
                        }
                    );
                    break;
            }
            if (controls.find(control => control.key == item.mtrId) == null) {
                controls.push(retStruct);
            }
            result.push(retStruct);
        });
        return result;
    },
    getLeftMenuJson(menuType) {
        return window.Kdo.utils.copy(leftMenuService.getMenusData(menuType));
    },
    getMenuInfo(key) {
        _selectedMenuOption = null;
        if (key) _searchMenuOption(key, leftMenuService.getMenusData("all"));
        return _selectedMenuOption;
    },
    getMenusData(menuType) {
        //json+后台数据
        var _menus = [];
        switch (menuType) {
            case "controls":
                _menus = _menuJson.controls;
                break;
            case "background":
                _menus = _menuJson.background;
                break;
            case "plugin":
                _menus = _menuJson.plugin;
                break;
            case "group":
                _menus = _menuJson.group;
                break;
            case "game":
                _menus = _menuJson.game;
                break;
            case "all":
                _menus = _menus.concat(_menuJson.controls).concat(_menuJson.background).concat(_menuJson.plugin).concat(_menuJson.group).concat(_menuJson.game);
                break;
        }
        return window.Kdo.utils.copy(_menus);
    },
    setCacheMenu(key, type, _template) {
        var _recursion = function (key, _menus) {
            $.each(_menus, function (i, _menu) {
                if (_menu.key == key) {
                    _menu.template = window.Kdo.utils.copy(_template);
                } else if (!!_menu.childs && _menu.childs.length > 0) {
                    _recursion(key, _menu.childs);
                }
            });
        }
        _recursion(key, _menuJson)
    },
    getStruct(key) {
        var ret = structConfig[key];
        return !!ret ? window.Kdo.utils.copy(structConfig[key]) : null;
    },
    getToolbar(controlConfig) {
        var _addTools = window.Kdo.utils.copy(controlConfig.addTools);

        var struct = leftMenuService.getStruct(controlConfig.struct);
        if (!!struct) {
            _addTools = struct.addTools;
        } else {
            var control = window.Kdo.utils.copy(leftMenuService.getMenuInfo(controlConfig.key));
            if (!!control) {
                _addTools = control.addTools;
            }
        }
        return _addTools;
    },
    getPlatform(type) {
        var platform = "";
        switch (type) {
            case "wx":
            case "wap":
            case "mobile":
                platform = "mobile";
                break;
            case "web":
            case "pc":
                platform = "pc";
                break;
        }
        return platform;
    }
}

window.Kdo = Object.assign(window.Kdo || {}, {
    menus: {
        getMenuInfo: leftMenuService.getMenuInfo,
        pushMenuJson: leftMenuService.pushMenuJson,
        setCacheMenu: leftMenuService.setCacheMenu,
        getStruct: leftMenuService.getStruct,
        getToolbar: leftMenuService.getToolbar,
        getPlatform: leftMenuService.getPlatform,
        menusJSON: _menuJson,
        getLeftMenuJson: leftMenuService.getLeftMenuJson
    }
})

export default leftMenuService