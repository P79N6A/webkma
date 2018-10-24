'use strict';

/**
 * @ngdoc service
 * @name managementApp.templateCategoryService
 * @description
 * # templateCategoryService
 * Service in the managementApp.
 */
angular.module('managementApp')
    .service('activitiyService', ["$rootScope", "$http", function ($rootScope, $http) {
        var self = this;

        //获取活动列表
        self.getActivitiyList = function (options, callback) {
            // var searchStr = "";
            // if (!!options) {
            //     var array = [];
            //     for (var _key in options) {
            //         array.push(_key + "=" + encodeURIComponent(options[_key]));
            //     }
            //     searchStr = "?" + array.join("&");
            // }
            $http.post(lanh.kmaApiHost + 'manuscript/list/release',options).success(function (json) {
                callback(json.data);
            });
        };

        //活动推荐
        self.recommendActivitiy = function (options, callback) {
            $http.post(lanh.kmaApiHost + 'manuscript/recommend/activitiy', options).success(function (json) {
                callback(json);
            });
        };

        //模板启用或禁用
        self.enable = function (options, callback) {
            $http.post(lanh.kmaApiHost + 'manuscript/enable', options).success(function (json) {
                callback(json);
            });
        };
        
        //删除模板类型
        self.delActivityTypeSrv = function (options, callback) {
            $http.post(lanh.apiHost + 'activitytype/delete', options).success(function (json) {
                callback(json);
            });
        };

        //模板排序
        self.sort = function (options, callback) {
            $http.post(lanh.kmaApiHost + 'manuscript/sort', options).success(function (json) {
                callback(json);
            });
        };
    }]);
