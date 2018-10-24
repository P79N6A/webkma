'use strict';

/**
 * @ngdoc service
 * @name managementApp.partnerService
 * @description
 * # partnerService
 * Service in the managementApp.
 */
angular.module('managementApp')
  .service('partnerService', ["$http", "$rootScope",
      function ($http, $rootScope) {
          var self = this;

          //验证后台下单链接是否可用
          self.validBackendShopUrl = function (options, callback) {
              $http.post(lanh.apiHostNode + 'partner/backend/shopUrl', {
                  key: options.key
              }).success(function (json) {
                  callback(json);
              });
          }

      }]);
