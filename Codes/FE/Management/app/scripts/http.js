'use strict';

angular.module('managementApp').config(["$httpProvider", function ($httpProvider) {
    $httpProvider.interceptors.push(["$q", "$location", "messenger", function ($q, $location, messenger) {
        return {
            'request': function (config) {
                config.headers["secret_key"] = lanh.secret_key;
                if (sessionStorage.getItem("session_id")) config.headers['session_id'] = sessionStorage.getItem("session_id");

                //Node API Partner角色
                if (config.url.indexOf(lanh.apiHost) != -1 ||
                    config.url.indexOf(lanh.apiHostNode) != -1) {
                    var urlParams = $location.search(),
                        params = [];
                    for (var key in urlParams) {
                        if (key == "partner_id" || key == "sign" || key == "timestamp") {
                            params.push(key + "=" + urlParams[key]);
                        }
                    }
                    config.url += (config.url.indexOf("?") == -1 ? "?" : "&") + params.join("&");
                }

                return config;
            },

            'requestError': function (request) {
                //$("#global-loading").hide();
                return request;
            },

            'response': function (response) {
                // 登录过期或超时处理
                if (response.status == 401) {
                    location.href = "#/?login";
                }
                return response;
            },

            'responseError': function (response) {
                // 登录过期或超时处理
                if (response.status == 401) {
                    location.href = "#/?login";
                }
                return response;
            }
        };
    }]);




    $(document).ajaxSend(function (event, jqXHR, ajaxOptions) {
        jqXHR.setRequestHeader("ClientType", "backmanagesys");
        jqXHR.setRequestHeader("SessionId", sessionStorage.getItem("session_id"));
    });

    $(document).ajaxComplete(function (event, xhr, settings) {

    });

    $(document).ajaxError(function (event, xhr, settings) {

    });
}]);
