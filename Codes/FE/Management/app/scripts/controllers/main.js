'use strict';

/**
 * @ngdoc function
 * @name managementApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the managementApp
 */
angular.module('managementApp')
  .controller('MainCtrl', ['$scope',"$rootScope","$location","userInfoService",
    function ($scope,$rootScope,$location,userInfoService) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.loginType = function (){
      if ($location.search()["login"] != undefined) {
        userInfoService.logout(function () { });
      }
    };

    $scope.loginType();

  }]);
