'use strict';

/**
 * @ngdoc service
 * @name managementApp.templateCategoryService
 * @description
 * # templateCategoryService
 * Service in the managementApp.
 */
angular.module('managementApp')
    .service('smsService', ["$rootScope", "$http", function ($rootScope, $http) {
        var self = this;

        //获取短信列表
        self.getSmsList = function (options, callback) {
            var searchstr = "";
            if (!!options) {
                var array = [];
                for (var _key in options) {
                    array.push(_key + "=" + encodeURIComponent(options[_key]));
                }
                searchstr = "?" + array.join("&");
            }

            $http.get(lanh.kpaasApiHost + 'api/communication_server/v1/sms/search' + searchstr).success(function (json) {
                callback(json.data);
            });
        };

        //获取短信模板列表
        self.getTemplateSmsList = function (options, callback) {
            var searchstr = "";
            if (!!options) {
                var array = [];
                for (var _key in options) {
                    array.push(_key + "=" + encodeURIComponent(options[_key]));
                }
                searchstr = "?" + array.join("&");
            }

            $http.get(lanh.kmaApiHost + 'template/sms/back/search' + searchstr).success(function (json) {
                callback(json);
            });
        };

        //保存短信模板
        self.saveSmsTemplate = function (options, callback) {
            $http.post(lanh.kmaApiHost + 'template/sms/save', options).success(function (json) {
                callback(json);
            });
        };

        //删除模板类型
        self.delSmsTemplate = function (options, callback) {
            $http.post(lanh.kmaApiHost + 'template/sms/delete', options).success(function (json) {
                callback(json);
            });
        };

    }]);
