'use strict';

/**
 * @ngdoc service
 * @name managementApp.userListService
 * @description
 * # userListService
 * Service in the managementApp.
 */
angular.module('managementApp')
  .service('userListService', ["$http", function ($http) {
      var self = this;

      self.getList = function (options, callback) {
        var array = [];
        if (!!options) {
          for (var _key in options) {
            array.push(_key + "=" + encodeURIComponent(options[_key]));
          }
          var searchStr = "?" + array.join("&");
        }
        var opt = array.join("&");
          $http.get(lanh.apiHost + 'manuscript/search?'+opt).success(function (json) {
            if(json.code === 0){
              var list = json.data.list;
              for (var i = 0; i < list.length;i++){
                try {
                  list[i]['upTime'] = (list[i].publishTime).split(' ')[0];
                }catch (e){
                  list[i]['upTime'] = '-';
                }
                list[i]['clickNum'] = (list[i].clickNum == undefined ? 0 : list[i].clickNum);
                list[i]['terminals'] = (list[i].extensionType == 1 ? 'PC端' : '移动端');
              }
              json.data.list = list;
              callback(json.data);
            }
          });
      };

        //禁用
      self.disablePopularize = function (options, callback) {
          $http.post(lanh.apiHost + 'extension/disable', options).success(function (json){
              callback(json);
          });
      };

        //设置or取消案例
      self.setCase = function (options, callback) {
          $http.post(lanh.apiHost + 'manuscript/create', options).success(function (json){
              callback(json);
          });
      };

      //预览
      self.preview = function (opt, callback) {
          $http.post(lanh.apiHost + "special/preview", opt).success(function (result, status) {
              callback(result, status);
          });
      };
      //获取推广地址
      self.getHostLookFor = function (opt,callback) {
          $http.get(lanh.apiHost + "extension/lookfor?"+opt,'').success(function (result, status) {
              callback(result, status);
          });
      };
      //获取线上地址
      self.getHostUrl = function (callback) {
          $http.get(lanh.apiHost + "session/gethosturl").success(function (result, status) {
              callback(result, status);
          });
      };
  }]);
