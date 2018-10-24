'use strict';

/**
 * @ngdoc service
 * @name managementApp.paidConfigService
 * @description
 * # paidConfigService
 * Service in the managementApp.
 */
angular.module('managementApp')
  .service('paidConfigService', ["$rootScope", "$http", function ($rootScope, $http) {
      var self = this;

      //获取套餐类型对应值
      self.packageInfoTypes = function (key) {
          var dictionary = {
              "vip": 0,                 //会员
              "email": 2,               //邮件
              "sms": 3,                 //短信
              "collect": 4,             //客户线索
              "b2b": 5,                 //B2B
              "user": 6,                //子账号
              "make_release": 7,        //营销内容发布
              "cases": 8,               //案例展示
              "wechat": 9,              //微信终端
              "customer_import": 10,    //客户导入
              "spread": 11,             //产品推广数
              "keywords": 12,           //关键字
              "site_ranking":13         //官网排名
          }

          return key ? dictionary[key] : dictionary;
      }

      //获取套餐配置信息
      self.getVersionSettingList = function (options, callback) {
          $http.get(lanh.apiHost + 'paymentservice/loadpayinfo?'+options).success(function (json) {
              callback(json);
          });
      };
      //保存套餐配置信息
      self.SaveVersionSettingList = function (options, callback) {
          $http.post(lanh.apiHost + 'paymentservice/savepayinfo', options).success(function (json) {
              callback(json);
          });
      };

      //删除套餐配置信息
      self.deleteVersionSettingList = function (options, callback) {
          $http.get(lanh.apiHost + 'paymentservice/deletepayinfo?id=' + options.id).success(function (json) {
              callback(json);
          });
      };

      //查询服务套餐配置
      self.getServicesSettingList = function (options, callback) {
          $http.get(lanh.apiHost + 'srvicePackage/search').success(function (json) {
              callback(json);
          });
      }

      //获取付费配置信息
      self.getSettingList = function (options, callback) {
          $http.get(lanh.apiHost + 'paymentservice/loadpricerange?type=' + options).success(function (json) {
              callback(json);
          });
      };
      //保存付费配置信息
      self.getSaveSettingList = function (options, callback) {
          $http.post(lanh.apiHost + 'paymentservice/saveservicepricerange', options).success(function (json) {
              callback(json);
          });
      };

      //获取支付配置信息
      self.getPaymentList = function (options, callback) {
          $http.get(lanh.apiHost + 'sysconfig/load?type=' + options).success(function (json) {
              callback(json);
          });
      };
      //保存付费配置信息
      self.SavePaymentList = function (options, callback) {
          $http.post(lanh.apiHost + 'sysconfig/save', options).success(function (json) {
              callback(json);
          });
      };
      //添加用户时获取企业code
      self.getCompanyCode = function (callback) {
          $http.get(lanh.apiHost + 'compaycode/getOneCode').success(function (json) {
              callback(json);
          });
      };
      //获取客服配置信息
      self.getsysConfig = function (options,callback) {
          $http.get(lanh.apiHost + 'sysconfig/load?type='+options).success(function (json) {
              callback(json);
          });
      };

      //保存客服配置信息
      self.savesysConfig = function (options,callback) {
          $http.post(lanh.apiHost + 'sysconfig/save',options).success(function (json) {
              callback(json);
          });
      };
  }]);
