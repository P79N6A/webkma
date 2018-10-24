'use strict';

/**
 * @ngdoc service
 * @name managementApp.dataStatisticsService
 * @description
 * # dataStatisticsService
 * Service in the managementApp.
 */
angular.module('managementApp')
  .service('dataStatisticsService', ["$http", function ($http) {
      var self = this;
      //会员统计列表
      self.getMemberList = function (options, callback) {
        $http.get(lanh.apiHost + 'vipstatistic/vipUserStatisticAmount?'+options).success(function (json){
              callback(json);
        });
      };

      //应用统计列表
      self.getApplicationList = function ( callback ) {
          $http.get(lanh.apiHost + 'applicationstatistic/applicationStatisticAmount').success(function (json){
              callback(json);
        });
      };

      // 邮件应用统计明细
      self.getEmailApplicationList = function (options, callback) {
          $http.get(lanh.apiHost + 'applicationstatistic/emailApplicationStatisticDetail?'+options).success(function (json){
              callback(json);
        });
      };

      // 短信应用统计明细
      self.getSmsApplicationList = function (options, callback) {
          $http.get(lanh.apiHost + 'applicationstatistic/smsApplicationStatisticDetail?'+options).success(function (json){
              callback(json);
        });
      };

      // 加载财务活动云销信息
      self.loadbasic = function (options, callback) {
          var searchStr = "";
          if (!!options) {
              //searchStr = "?" + lanh.utils.parseParam(options);
              var array = [];
              for (var _key in options) {
                  array.push(_key + "=" + encodeURIComponent(options[_key]));
              }
              searchStr = "?" + array.join("&");
          }
          $http.get(lanh.apiHost + 'manageuser/loadbasic'+searchStr).success(function (json){
              callback(json);
        });
      };

       // 加载财务SEO云销信息
      self.loadseo = function (options, callback) {
          var searchStr = "";
          if (!!options) {
              //searchStr = "?" + lanh.utils.parseParam(options);
              var array = [];
              for (var _key in options) {
                  array.push(_key + "=" + encodeURIComponent(options[_key]));
              }
              searchStr = "?" + array.join("&");
          }
          $http.get(lanh.apiHost + 'manageuser/loadseo'+searchStr).success(function (json){
              callback(json);
        });
      };
  }]);
