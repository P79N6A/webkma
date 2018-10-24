'use strict';

/**
 * @ngdoc service
 * @name managementApp.businessService
 * @description
 * # businessService
 * Service in the managementApp.
 */
angular.module('managementApp')
  .service('businessService', ["$http", function ($http) {
      var self = this;
      //添加修改商家
      self.saveBusiness = function (opt, callback) {
          $http.post(lanh.kmaApiHost + "business/savebusiness",opt)
          .success(function (result) {
              callback(result);
          });
      };
      //启，禁用商家、设计师
      self.setMemberStatus = function (opt, callback) {
          var _api = opt.state == 0 ? 'openbusiness' : 'disablebusiness';
          delete opt.state;
          $http.post(lanh.kmaApiHost + "business/"+_api, opt)
          .success(function (result) {
                callback(result);
          });
      };
      //获取商家详情
      self.getBusiness = function (opt, callback) {
        var array = [];
        for (var _key in opt) {
            array.push(_key + "=" + encodeURIComponent(opt[_key]));
        }
        $http.get(lanh.kmaApiHost + 'business/getbusiness?'+ array.join("&")
        ).success(function (json) {
        callback(json);
        });
      }
      //获取模板列表
      self.getBusinessList = function (opt, callback) {
        var array = [];
        for (var _key in opt) {
            array.push(_key + "=" + encodeURIComponent(opt[_key]));
        }
        $http.get(lanh.kmaApiHost + 'business/searchbusiness?'+ array.join("&")
            ).success(function (json) {
                callback(json);
            });
        }
      //获取商家、设计师列表
      self.getTemplateList = function (opt, callback) {
        $http.get(lanh.kmaApiHost + 'manuscript/list/template/business?'+ window.lanh.utils.parseParam(opt)
            ).success(function (json) {
                callback(json);
            });
      }
      //删除商家、设计师
      self.deleteBusiness = function (opt, callback) {
          $http.post(lanh.kmaApiHost + "business/delete", opt)
          .success(function (result) {
              callback(result);
          });
      };
      //查询短信签名
      self.querySmsSign = function (opt, callback) {
          $http.get(lanh.kpaasApiHost + "api/communication_server/v1/sendcloud/searchone?secretKey="+opt)
          .success(function (result) {
              callback(result);
          });
      };
      //新增、修改短信签名
      self.updateSmsSign = function (opt, callback) {
          $http.post(lanh.kpaasApiHost + "api/communication_server/v1/sendcloud/add", opt)
          .success(function (result) {
              callback(result);
          });
      };
      //重置密码
      self.resetPwd = function (opt, callback) {
          $http.post( lanh.kmaApiHost + "business/reset/password", opt)
          .success(function (result) {
              callback(result);
          });
      };
      //单一/批量修改商户/设计师
      self.certification = function (opt, callback) {
          $http.post( lanh.kmaApiHost + "business/modify", opt)
          .success(function (result) {
              callback(result);
          });
      };
  }]);
