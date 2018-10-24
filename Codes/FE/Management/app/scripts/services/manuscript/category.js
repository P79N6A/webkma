'use strict';

/**
 * @ngdoc service
 * @name managementApp.templateCategoryService
 * @description
 * # templateCategoryService
 * Service in the managementApp.
 */
angular.module('managementApp')
  .service('templateCategoryService', ["$rootScope", "$http", function ($rootScope, $http) {
      var self = this;

      //获取模板分类列表
      self.getCategoryList = function (options, callback) {
          var searchStr = "";
          if (!!options) {
              var array = [];
              for (var _key in options) {
                  array.push(_key + "=" + encodeURIComponent(options[_key]));
              }
              searchStr = "?" + array.join("&");
          }
          $http.get(lanh.apiHost + 'classification/load' + searchStr).success(function (json) {
              callback(json.data);
          });
      };

      //获取模板类型搜索
      self.getTypeList = function (options, callback) {
          var searchStr = "";
          if (!!options) {
              var array = [];
              for (var _key in options) {
                  array.push(_key + "=" + encodeURIComponent(options[_key]));
              }
              searchStr = "?" + array.join("&");
          }
          $http.get(lanh.apiHost + 'activitytype/search' + searchStr).success(function (json) {
              callback(json);
          });
      };

      //新增和编辑模板类型
      self.saveActivityTypeSrv = function (options, callback) {
          $http.post(lanh.apiHost + 'activitytype/save', options).success(function (json) {
              callback(json);
          });
      };

      //删除模板类型
      self.delActivityTypeSrv = function (options, callback) {
          $http.post(lanh.apiHost + 'activitytype/delete', options).success(function (json) {
              callback(json);
          });
      };

  }]);
