'use strict';

/**
 * @ngdoc service
 * @name managementApp.collectiontradeService
 * @description
 * # collectiontradeService
 * Service in the managementApp.
 */
angular.module('managementApp')
  .service('syscaseService', ["$http", function ($http) {
      var self = this;
      //获取成功案例列表
      self.getSyscaseList = function (options, callback) {
        $http.get(lanh.apiHost + 'syscase/search'+options).success(function (json){
              callback(json);
        });
      };

      //删除成功案例
      self.deleteSyscase = function (options, callback) {
        $http.post(lanh.apiHost + 'syscase/delete',options).success(function (json){
              callback(json);
        });
      };

      //保存成功案例
      self.saveSyscase = function (options, callback) {
        $http.post(lanh.apiHost + 'syscase/save',options).success(function (json){
              callback(json);
        });
      };

      //加载案例详情
      self.getCaseDetail = function (options, callback) {
          $http.get(lanh.apiHost + 'syscase/load?caseId='+ options).success(function (json) {
              callback(json);
          });
      };

    
  }]);
