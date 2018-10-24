'use strict';

/**
 * @ngdoc service
 * @name managementApp.templateService
 * @description
 * # templateService
 * Service in the managementApp.
 */
angular.module('managementApp')
    .service('templateService', ["$rootScope", "$http", function ($rootScope, $http) {
        var self = this;
        //获取模板列表
        self.getTempList = function (options, callback) {
            var array = [];
            for (var _key in options) {
                array.push(_key + '=' + encodeURIComponent(options[_key]));
            }
            $http.get(lanh.kmaApiHost + 'manuscript/list/template?' + array.join("&"))
                .success(function (json) {
                    callback(json);
                });
        }
        //模板分发
        self.handoutBusiness = function (options, callback) {
            $http.post(lanh.kmaApiHost + 'manuscript/distribute/template', options)
                .success(function (json) {
                    callback(json);
                })
        }
        self.delTemplate = function (params, callback) {
            $http.post(lanh.kmaApiHost + "manuscript/delete", params)
            .success(function (json) {
                callback(json);
            })
        }
        //短信模板分发
        self.handoutSmsTemplate = function (options, callback) {
            $http.post(lanh.kmaApiHost + 'template/sms/distribute', options)
                .success(function (json) {
                    callback(json);
                })
        }
    }]);
