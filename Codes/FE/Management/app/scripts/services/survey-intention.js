'use strict';

/**
 * @ngdoc service
 * @name managementApp.surveyintentionListService
 * @description
 * # surveyintentionListService
 * Service in the managementApp.
 */
angular.module('managementApp')
  .service('surveyintentionListService', ["$http", function ($http) {
      var self = this;

      // 获取用户购买意向列表
      self.getSurveyIntentionList = function (options, callback) {
          $http.get(lanh.apiHost + 'frontuser/queryuserpurchase?'+options).success(function (json) {
            callback(json);
          });
      };

      // 获取申请试用用户列表
      self.getApplyForTrialUserSrv = function (options, callback) {
          $http.get(lanh.apiHost + 'TrialUser/search?'+options).success(function (json) {
            callback(json);
          });
      };

  }]);
