'use strict';

/**
 * @ngdoc service
 * @name managementApp.templateListService
 * @description
 * # templateListService
 * Service in the managementApp.
 */
angular.module('managementApp')
  .service('templateListService', ["$rootScope","$http", function ($rootScope,$http) {
      var self = this;


      //获取 列表
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
          $http.get(lanh.apiHost + 'manuscript/search' + searchStr).success(function (json) {
              var list = json.data.list;
              json.data.list = list;
              callback(json.data);
          });
      };

      //获取邮件列表
      self.getMailList = function (options, callback) {
          var searchStr = "";
          if (!!options) {
              //searchStr = "?" + lanh.utils.parseParam(options);
              var array = [];
              for (var _key in options) {
                  array.push(_key + "=" + encodeURIComponent(options[_key]));
              }
              searchStr = "?" + array.join("&");
          }
          $http.get(lanh.apiHost + 'email/search' + searchStr).success(function (json) {
              callback(json.data);
          });
      };

      //获取短信列表
      self.getSmsList = function (options, callback) {
          var searchStr = "";
          if (!!options) {
              //searchStr = "?" + lanh.utils.parseParam(options);
              var array = [];
              for (var _key in options) {
                  array.push(_key + "=" + encodeURIComponent(options[_key]));
              }
              searchStr = "?" + array.join("&");
          }
          $http.get(lanh.apiHost + 'sms/search' + searchStr).success(function (json) {
              callback(json.data);
          });
      };


      //预览
      self.preview = function (options, callback) {
          $http.post(lanh.apiHost + "manuscript/preview", options).success(function (result, status) {
              callback(result, status);
          });
      };

      //老接口 mars  v1.6.8
      self.checkTemplate = function (options, callback) {
          $http.post(lanh.apiHost + 'template/verify', options).success(function (json){
              callback(json);
          });
      };

        //模板上下架
      self.shelvesTemplate = function (options, callback) {
          $http.post(lanh.apiHost + 'template/verify', options).success(function (json) {
              callback(json);
          });
      };

      //活动插件设置接口
      self.pluginSetting = function (data, callback) {
          $http.post(lanh.apiHost + 'activeplugin/savesetting', data).success(function (result) {
              callback(result);
          })
      };

        //模板推荐到首页
      self.recommendTemplateSrv = function (options, callback) {
          $http.post(lanh.apiHost + 'manuscript/commend', options).success(function (json) {
              callback(json);
          });
      };

        //模板删除
      self.renoveTemplate = function (options, callback) {
          $http.post(lanh.apiHost + 'template/delete', options).success(function (json){
              callback(json);
          });
      };

      //邮件上下架
      self.shelvesMail = function (options, callback) {
          $http.post(lanh.apiHost + 'email/shelves', options).success(function (json) {
              callback(json);
          });
      };

      //短信上下架
      self.shelvesSms = function (options, callback) {
          $http.post(lanh.apiHost + 'sms/shelves', options).success(function (json) {
              callback(json);
          });
      }
  }]);
