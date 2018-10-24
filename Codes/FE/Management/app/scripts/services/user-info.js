'use strict';

/**
 * @ngdoc service
 * @name managementApp.menuInfoService
 * @description
 * # menuInfoService
 * Service in the managementApp.
 */
angular.module('managementApp')
    .service('userInfoService', ["$http", "$rootScope",
        function ($http, $rootScope) {
            var self = this,
                userInfoKey = "user-info";

            //执行登录
            self.login = function (opt, callback) {
                $http.post(lanh.kmaApiHost + 'user/back/logon', opt).success(function (result) {
                    if (result.status === 0) {
                        callback(result);
                        $rootScope.userInfo = result.data.data[0];
                        sessionStorage.setItem(userInfoKey, JSON.stringify(result.data.data[0]));
                    } else {
                        callback(false);
                    }
                });
            };

            //执行退出(清除会话状态);
            self.logout = function (callback) {
                $http.post(lanh.apiHost + 'session/logout', '').success(function (data) {
                    if (data.code == 0) {
                        $rootScope.userInfo = null;
                        sessionStorage.removeItem(userInfoKey);
                        callback();
                    } else {
                        callback(false);
                    }
                });
            };

            //执行seo登录
            self.loginSeo = function (opt, callback) {
                $http.post(lanh.apiHost + 'zdsintegrate/zdslogin', opt).success(function (json) {
                    if (json.code == 0 && json.data != "") {
                        callback(json);
                    } else {
                        callback(false);
                    }
                });
            };

            //获取用户信息
            self.getUserInfo = function (callback) {
                $http.get(lanh.apiHost + 'backuser/currentuserinfo').success(function (json) {
                    if (json.code == 0 && json.data != "") {
                        var data = {
                            username: json.data.userName
                        };
                        $rootScope.userInfo = data;
                        sessionStorage.setItem(userInfoKey, JSON.stringify(data));
                        callback(data);
                    } else {
                        callback(false);
                    }
                });
            }

            //检查用户是否存在
            self.checkUser = function (username, callback) {
                $http.get(lanh.apiHostNode + 'frontUser/check/' + username).success(function (json) {
                    callback(json);
                });
            }

            //担任主要账号的关联企业
            self.getDomainsUser = function (username, callback) {
                $http.get(lanh.apiHostNode + 'frontUser/domainsUser/' + username).success(function (json) {
                    callback(json);
                });
            }

        }]);
