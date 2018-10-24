'use strict';

/**
 * @ngdoc service
 * @name managementApp.seoService
 * @description
 * # seoService
 * Service in the managementApp.
 */
angular.module('managementApp')
  .service('seoService', ["$http", function ($http) {
      var self = this;
      //获取SEO推广计划列表
      self.getSEOPlanList = function (options, callback) {
        $http.get(lanh.apiHost + 'promotionplan/search?'+options).success(function (json){
              callback(json);
        });
      };

      //新增修改SEO推广计划
      self.updateSeoPlan = function (options, callback) {
        $http.post(lanh.apiHost + 'promotionplan/save',options).success(function (json){
              callback(json);
        });
      };

    
  }]);
