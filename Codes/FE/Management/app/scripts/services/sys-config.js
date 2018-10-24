'use strict';

/**
 * @ngdoc service
 * @name managementApp.sysConfigService
 * @description
 * # sysConfigService
 * Service in the managementApp.
 */
angular.module('managementApp')
  .service('sysConfigService', ["$http", function ($http) {
      var self = this;
      //保存小程序appid设置
      self.saveConfig = function (obj, callback) {
          $http.post(lanh.kmaApiHost + "sysconfig/saveconfig", obj)
          .success(function (result) {
              callback(result);
          });
      };
      //获取小程序设置
      self.getConfig = function (callback) {
          $http.get(lanh.kmaApiHost + 'sysconfig/getconfig?config_id_type=syswx&type=1'
          ).success(function (json) {
            callback(json.data);
          });
      }
  }]);
