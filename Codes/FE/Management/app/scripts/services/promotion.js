'use strict';

/**
 * @ngdoc service
 * @name managementApp.promotionService
 * @description
 * # promotionService
 * Service in the managementApp.
 */
angular.module('managementApp')
    .service('promotionService', ["$rootScope", "$http", function ($rootScope, $http) {
        var self = this;
        //获取朋友圈推广列表
        self.getPromotionList = function (options, callback) {
            var array = [];
            for (var _key in options) {
                array.push(_key + '=' + encodeURIComponent(options[_key]));
            }
            $http.get(lanh.kmaApiHost + "/promotion/back/list?" + array.join("&"))
                .success(function (json) {
                    callback(json);
                })
        }
        self.isPass = function (options, callback) {
            $http.post(lanh.kmaApiHost + "promotion/audit", options)
                .success(function (json) {
                    callback(json);
                })
        }
        self.getPromotionDetail = function name(options, callback) {
            var array = [];
            for (var _key in options) {
                array.push(_key + '=' + encodeURIComponent(options[_key]));
            }
            $http.get(lanh.kmaApiHost + "promotion/show/info?" + array.join("&"))
                .success(function (json) {
                    callback(json);
                })
        }
        //获取推广数据报告列表
        self.getPromotionDataList = function (options, callback) {
            var array = [];
            for (var _key in options) {
                array.push(_key + '=' + encodeURIComponent(options[_key]));
            }
            $http.get(lanh.kmaApiHost + "promotion/report/list?" + array.join("&"))
                .success(function (json) {
                    callback(json);
                })
        }
        //获取推广数据报告详情
        self.getPromotionDataDetail = function (options, callback) {
            var array = [];
            for (var _key in options) {
                array.push(_key + '=' + encodeURIComponent(options[_key]));
            }
            $http.get(lanh.kmaApiHost + "promotion/report/get?" + array.join("&"))
                .success(function (json) {
                    callback(json);
                })
        }
        //推广数据报告新增和修改
        self.savePromotionDataReport = function (options, callback) {
            $http.post(lanh.kmaApiHost + "promotion/report/save", options)
                .success(function (json) {
                    callback(json);
                })
        }
        // 获取公众号账号信息列表
        self.getWxSubScriptionAccountList = function (options, callback) {
            var array = [];
            _.each(["searchStr", "businessId", "status"], function (key) {
                if (options[key]) {
                    array.push(key + '=' + encodeURIComponent(options[key]));
                }
            });
            $http.get(lanh.kmaApiHost + "wxsubscription/search/list?" + array.join("&")).success(function (json) {
                callback(json);
            })
        }
    }]);
