'use strict';

/**
 * @ngdoc service
 * @name managementApp.designersInfoService
 * @description
 * # designersInfoService
 * Service in the managementApp.
 */
angular.module('managementApp')
  .service('designersInfoService', ["$rootScope", "$http", "$location", function ($rootScope, $http, $location) {
      var self = this;


      //获取用户列表
      self.getList = function (options, callback) {
          $http.get(lanh.apiHost + 'manageuser/loaduserinfo?' + options).success(function (json) {
              callback(json);
          });
      };


      //获取SEO会员用户列表
    self.getSeoMemberList = function (options, callback) {
      $http.get(lanh.apiHost + 'manageuser/loaduserseo?' + options).success(function (json) {
        callback(json);
      });
    };


      //冻结SEO套餐
    self.disSeoServiceSrv = function (options, callback) {
      $http.get(lanh.apiHost + 'zdsintegrate/disseoservice?' + options).success(function (json) {
        callback(json);
      });
    };

      //解冻SEO套餐
    self.openSeoServiceSrv = function (options, callback) {
      $http.get(lanh.apiHost + 'zdsintegrate/openseoservice?' + options).success(function (json) {
        callback(json);
      });
    };

      //获取SEO会员用户推广计划列表
    self.getUserSeoList = function (options, callback) {
        $http.get(lanh.apiHost + 'zdsintegrate/userseoplan?' + options).success(function (json) {
            callback(json);
        });
    };

      //添加用户
      self.addMember = function (options, callback) {
          //临时兼容第三方partner角色

          var urlParams = $location.search();
          if (urlParams.partner_id && urlParams.sign && urlParams.timestamp) {
              options.partner_id = urlParams.partner_id;
              options.sign = urlParams.sign;
              options.timestamp = urlParams.timestamp;
          }

          $http.post(lanh.apiHost + 'backuser/saveUser', options).success(function (json) {
              callback(json);
          });
      };

      //禁用启用用户
      self.setMemberStatus = function (options, callback) {
          //todo: 调用接口
          $http.post(lanh.apiHost + 'manageuser/setstate', options).success(function (json) {
              callback(json);
          });
      }

      //查询用户详情
      self.queryUserDetail = function (options, callback) {
          //todo: 调用接口
          $http.get(lanh.apiHost + 'manageuser/getuserdetail?userId=' + options).success(function (json) {
              callback(json);
          });
      }

      //加载付费信息
      self.loadpayinfo = function (options, callback) {
          $http.get(lanh.apiHost + 'paymentservice/loadpayinfo?type=' + options).success(function (json) {
              callback(json);
          });
      }

      //下单接口
      self.orderPay = function (options, callback) {
          $http.post(lanh.apiHost + 'paymentservice/placeorder', options).success(function (json) {
              callback(json);
          });
      }

      //升级到试用版接口
      self.upgradeTryout = function (options, callback) {
          $http.post(lanh.apiHost + 'manageuser/updateTrialState', options).success(function (json) {
              callback(json);
          });
      }
      //获取用户账单列表
      self.getBillList = function (options, callback) {
          $http.get(lanh.apiHost + 'paymentservice/searchorder?' + options).success(function (json) {
              callback(json);
          });
      };

      //获取用户当前套餐版本
      self.getUserPackageVersion = function (userId, callback) {
          $http.get(lanh.apiHostNode + 'member/package/version/' + userId).success(function (json) {
              callback(json);
          });
      }

      //获取用户SEO套餐计划
      self.getUserSEOPlanList = function (userId, callback) {
          $http.get(lanh.apiHost + 'promotionplan/getuserplan?1=1&userId=' + userId).success(function (json) {
              callback(json);
          });
      }

      //购买套餐服务
      self.packageBuy = function (options, callback) {
          $http.post(lanh.apiHostNode + 'package/buy', options).success(function (json) {
              callback(json);
          });
      }
      // 加载短信签名及sendcloud信息
      self.loadsign = function (options, callback) {
          $http.get(lanh.apiHost + 'sms/loadsign?userId=' + options).success(function (json) {
              callback(json);
          });
      };
      // 保存短信签名及sendcloud信息
      self.saveSign = function (options, callback) {
          $http.post(lanh.apiHost + 'sms/savesign', options).success(function (json) {
              callback(json);
          });
      };

      // 修改用户账号
      self.updateuser = function (options, callback) {
          $http.post(lanh.apiHost + 'backuser/updateuser', options).success(function (json) {
              callback(json);
          });
      };
  }]);
