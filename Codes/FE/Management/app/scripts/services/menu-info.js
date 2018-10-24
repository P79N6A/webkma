'use strict';

/**
 * @ngdoc service
 * @name managementApp.menuInfoService
 * @description
 * # menuInfoService
 * Service in the managementApp.
 */
angular.module('managementApp')
    .service('menuInfoService', ["$rootScope", function ($rootScope) {
        var self = this;
        var _menus = [{
            key: "member_management",
            title: "用户管理",
            icon: "fa fa-book",
            url: null,
            tip: null,
            childs: [
                {
                    key: "business-list", title: "商家列表", icon: null, url: "/project/business-list",
                    childs: [
                        { key: "add-business", title: "新增商家", icon: null, url: "/project/add-business", hidden: true },
                        { key: "business-detail", title: "商家详情", icon: null, url: "/project/business-detail", hidden: true }
                    ]
                },
                {
                    key: "designer-list", title: "设计师列表", icon: null, url: "/project/designer-list",
                    childs: [
                        { key: "add-designer", title: "新增设计师", icon: null, url: "/project/add-designer", hidden: true }
                    ]
                }
            ]
        }, {
            key: "activity_management",
            title: "活动管理",
            icon: "fa fa-book",
            url: null,
            tip: null,
            childs: [
                { key: "activity-list", title: "活动列表", icon: null, url: "/project/activity-list" },
                { key: "sms-list", title: "短信列表", icon: null, url: "/project/sms-list" }
            ]
        }, {
            key: "template_management",
            title: "模板管理",
            icon: "fa fa-book",
            url: null,
            tip: null,
            childs: [
                {
                    key: "template-list", title: "活动模板", icon: null, url: "/project/template-list",
                    childs: [
                        { key: "templat-distribute", title: "模板分发", icon: null, url: "/project/templat-distribute", hidden: true }
                    ]
                },
                {
                    key: "template-sms-list", title: "短信模板", icon: null, url: "/project/template-sms-list",
                    childs: [
                    ]
                }
            ]
        }, {
            key: "project_management",
            title: "素材管理",
            icon: "fa fa-book",
            url: null,
            tip: null,
            childs: [
                //{ key: "material-image", title: "图片管理", icon: null, url: "/project/material-image" },
                //{ key: "material-text", title: "文本管理", icon: null, url: "/project/material-text" },
                //{ key: "material-shap", title: "形状管理", icon: null, url: "/project/material-shap" },
                { key: "material-background", title: "素材列表", icon: null, url: "/project/material-list" },
                { key: "material-tag", title: "素材标签", icon: null, url: "/project/material-tag" }
            ]
        },
        {
            key: "question-management",
            title: "问题反馈",
            icon: "fa fa-book",
            url: null,
            tip: null,
            childs: [
                { key: "question-feedback", title: "反馈内容", icon: null, url: "/project/question-feedback" }
            ]
        }, {
            key: "sysconfig",
            title: "系统设置",
            icon: "fa fa-book",
            url: null,
            tip: null,
            childs: [
                { key: "sys-config", title: "小程序设置", icon: null, url: "/project/sys-config" }
            ]
        }, {
            key: 'promotion-management',
            title: "推广管理",
            icon: "fa fa-book",
            url: null,
            tip: null,
            childs: [
                {
                    key: "promotion-list",
                    title: "朋友圈广告推广",
                    icon: null,
                    url: "/project/template-promotion-list",
                    childs: [{ key: "promotion-detail", title: "朋友圈广告推广详情", icon: null, url: "/project/template-promotion-detail", hidden: true }]
                },
                {
                    key: "wxsubscription-account-list",
                    title: "公众号管理",
                    icon: null,
                    url: "/project/wxsubscription-account-list",
                    childs: []
                }
            ]
        }];

        //获取导航菜单对象副本
        self.getMenus = function () {
            return angular.copy(_menus);
        };

        //根据url获取菜单信息
        self.getMenuInfo = function (url) {
            var level = 0, _newArray = [];//面包屑层级
            var _eachMenus = function (menus, parentKey) {
                $.each(menus, function (index, menu) {
                    menu.parentKey = parentKey;
                    _newArray.push(menu);
                    if (!!menu.childs && menu.childs.length > 0) {
                        _eachMenus(menu.childs, menu.key);
                    }
                });
            };

            var _newMenus = function (url, obj) {
                $.each(_newArray, function (index, menu) {
                    if (menu.url == url) {
                        obj.routePath.push(menu);
                        _parentMenus(menu.parentKey, obj);
                        obj.routePath.reverse();
                    }
                });
            };

            var _parentMenus = function (key, obj) {
                $.each(_newArray, function (index, menu) {
                    if (menu.key == key) {
                        obj.routePath.push(menu);
                        _parentMenus(menu.parentKey, obj);
                    }
                });
            };

            var obj = {
                menu: null,
                routePath: []
            };
            _eachMenus(self.getMenus(), "");
            _newMenus(url, obj);
            return obj;
        }
    }]);
