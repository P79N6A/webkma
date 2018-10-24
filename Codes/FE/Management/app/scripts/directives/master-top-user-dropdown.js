'use strict';

/**
 * @ngdoc directive
 * @name managementApp.directive:masterTopUserDropdown
 * @description
 * # masterTopUserDropdown
 */
angular.module('managementApp')
  .directive('masterTopUserDropdown', ["$http", "$timeout", "userInfoService", "messenger",
      function ($http, $timeout, userInfoService, messenger) {
          return {
              templateUrl: "views/templates/master/master-top-user-dropdown_tpl.html",
              restrict: 'E',
              replace: true,
              scope: true,
              link: function postLink($scope, $element, attrs) {
                  //退出事件
                $scope.$on('btn-Logout',function (){$scope.btnLogout();});

                  $scope.btnLogout = function () {
                      userInfoService.logout(function () { });
                  }
              }
          };
      }]);
