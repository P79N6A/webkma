'use strict';

/**
 * @ngdoc directive
 * @name managementApp.directive:masterBreadCrumbs
 * @description
 * # masterBreadCrumbs
 */
angular.module('managementApp')
  .directive('masterBreadCrumbs', ["$location", "$timeout", "menuInfoService",
      function ($location, $timeout, menuInfoService) {
          return {
              templateUrl: "views/templates/master/breadcrumb_tpl.html",
              restrict: 'E',
              replace: true,
              scope: true,
              link: function postLink($scope, $element, attrs) {
                  $scope.btnTransfer = function (route) {
                      if (!!route.url) {
                          $location.path(route.url);
                      }
                  }
                  var _refresh = function () {
                      var _menus = [{
                          icon: "fa-home",
                          tip: null,
                          title: "首页",
                          url: "/"
                      }];
                      $scope.routePath = menuInfoService.getMenuInfo($location.path()).routePath;
                      //临时处理
                      if($scope.routePath.length > 2){
                        var list = [];
                        for(var i = 0; i < $scope.routePath.length; i++){
                          if(i > 0){
                            list.push($scope.routePath[i]);
                          }
                        }
                        //list.push($scope.routePath[1]);
                        //list.push($scope.routePath[2]);
                        $scope.routePath = list;
                      }
                      $scope.routePath = _menus.concat($scope.routePath);
                  }
                  $scope.$on("$routeChangeSuccess", function () {
                      _refresh();
                  });
                  _refresh();
              }
          };
      }]);
