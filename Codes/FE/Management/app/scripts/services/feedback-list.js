'use strict';

/**
 * @ngdoc service
 * @name managementApp.feedbackService
 * @description
 * # feedbackService
 * Service in the managementApp.
 */
angular.module('managementApp')
  .service('feedbackService', ["$rootScope", "$http", function ($rootScope, $http) {
      var self = this;


      //获取反馈列表
      self.getFeedbackList = function (options, callback) {
          var searchStr = "?secret_key="+lanh.secret_key;
          if (!!options) {
              //searchStr = "?" + lanh.utils.parseParam(options);
              var array = [];
              for (var _key in options) {
                  array.push(_key + "=" + encodeURIComponent(options[_key]));
              }
              searchStr += "&" + array.join("&");
          }
          $http.get(lanh.kpaasApiHost + 'api/feedback_service/v1/feedback/search'+searchStr).success(function (json) {
            callback(json);
          });
      };

      //获取反馈详情
      self.loadFeedbackDetail = function (options, callback) {
          $http.get(lanh.apiHost + 'Feedback/load?id='+options).success(function (json) {
            callback(json);
          });
      };
  }]);
