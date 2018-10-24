'use strict';

/**
 * @ngdoc function
 * @name managementApp.controller:IndexCtrl
 * @description
 * # IndexCtrl
 * Controller of the managementApp
 */
angular.module('managementApp')
  .controller('IndexCtrl', ["$scope", "$location", function ($scope, $location) {
      this.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
      ];

      $scope.urlParams = $location.search();

      $scope.$root.userInfo = sessionStorage.getItem("user-info");
      if ($scope.$root.userInfo) $scope.$root.userInfo = JSON.parse($scope.$root.userInfo);

      $("body").show();
  }]);
