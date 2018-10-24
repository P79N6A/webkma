'use strict';

/**
 * @ngdoc service
 * @name managementApp.VerificationCodeService
 * @description
 * # VerificationCodeService
 * Service in the managementApp.
 */
angular.module('managementApp')
  .service('VerificationCodeService', ["$http", function ($http) {
      var self = this;

      self.sendsms = function (obj, callback) {
          $http.post(lanh.apiHost + "smsvalicode/generate", obj)
          .success(function (result, status) {
              callback(result, status);
          });
      };
    
  }]);
