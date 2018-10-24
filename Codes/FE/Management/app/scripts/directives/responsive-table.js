'use strict';

/**
 * @ngdoc directive
 * @name managementApp.directive:responsiveTable
 * @description
 * # responsiveTable
 */
angular.module('managementApp')
  .directive('responsiveTable', ["$http", "$location", "$timeout",
      function ($http, $location, $timeout) {
          return {
              templateUrl: "views/templates/directives/responsive_table_tpl.html",
              restrict: 'E',
              replace: true,
              scope: {
                  data: "=ngData"
              },
              link: function postLink($scope, $element, attrs) {
                  //debugger;
                  //$scope.column.title = $scope.column.title;
                  


                  //数据格式
                  var table = {
                      columns: [
                          { title: "专题名称", key: "title" },
                          { title: "专题类型", key: "type" },
                          { title: "专题描述", key: "description" }
                      ],
                      rows: [
                          { "title": "abc1", "description": "aaa", "type": "type1", "bbb": "bbb" },
                          { "title": "abc1", "description": "aaa", },
                          { "title": "abc1", "description": "aaa", "type": "type1" }
                      ]
                  }
              }
          };
      }]);
