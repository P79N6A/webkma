'use strict';

/**
 * @ngdoc service
 * @name managementApp.authorizedUserService
 * @description
 * # authorizedUserService
 * Service in the managementApp.
 */
angular.module('managementApp')
  .service('authorizedUserService', ["$http", function ($http) {
      var self = this;

      self.addUser = function (obj, callback) {
          $http.post(lanh.apiHost + "manageuser/addauthuser", obj)
          .success(function (result, status) {
              callback(result, status);
          });
      };
      self.deleteUser = function (obj, callback) {
          $http.post(lanh.apiHost + "manageuser/deleteauthuser", obj)
          .success(function (result, status) {
              callback(result, status);
          });
      };
      self.getList = function (options, callback) {
          var searchStr = "";
          if (!!options) {
              //searchStr = "?" + lanh.utils.parseParam(options);
              var array = [];
              for (var _key in options) {
                  array.push(_key + "=" + encodeURIComponent(options[_key]));
              }
              searchStr = "?" + array.join("&");
          }
          $http.get(lanh.apiHost + 'manageuser/searchauthuser' + searchStr)
              .success(function (json) {
                  callback(json);
              });
      }
  }]);
