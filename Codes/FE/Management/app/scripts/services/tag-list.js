'use strict';

/**
 * @ngdoc service
 * @name managementApp.tagListService
 * @description
 * # tagListService
 * Service in the managementApp.
 */
angular.module('managementApp')
  .service('tagListService', ["$http", function ($http) {
      var self = this;

      self.addTag = function (obj, callback) {
          $http.post(lanh.kmaApiHost + "tag/create", obj)
          .success(function (result, status) {
              callback(result, status);
          });
      };
      self.deleteTag = function (obj, callback) {
          $http.post(lanh.kmaApiHost + "tag/delete", obj)
          .success(function (result, status) {
              callback(result, status);
          });
      };
      //self.selectedTag = function (obj, callback) {
      //    $http.post(lanh.kmaApiHost + "tag/setselection", obj)
      //    .success(function (result, status) {
      //        callback(result, status);
      //    });
      //};

      self.tagOrder = function (obj, callback) {
          $http.put(lanh.kmaApiHost + "tag/sort", obj)
          .success(function (result, status) {
              callback(result, status);
          });
      };

      self.getList = function (options, callback) {
          var searchStr = "";
          if (!!options) {
              var array = [];
              for (var _key in options) {
                  array.push(_key + "=" + encodeURIComponent(options[_key]));
              }
              searchStr = "?" + array.join("&");
          }
          $http.get(lanh.kmaApiHost + 'tag/list/material' + searchStr)
              .success(function (json) {
                  callback(json.data);
              });
      }

      //关联标签
      self.relateTag = function (obj, callback) {
          $http.post(lanh.kmaApiHost + "tag/relation", obj)
          .success(function (result, status) {
              callback(result, status);
          });
      };
      //重置关联标签
      self.resetTag = function (obj, callback) {
          $http.put(lanh.kmaApiHost + "tag/reset/material", obj)
          .success(function (result, status) {
              callback(result, status);
          });
      };
  }]);
