'use strict';

/**
 * @ngdoc directive
 * @name managementApp.directive:ionRangeSlider
 * @description
 * # ionRangeSlider
 */
angular.module('managementApp')
    .directive('ionRangeSlider', ["$http", "$location", "$timeout", "$compile", "menuInfoService",
	  function ($http, $location, $timeout, $compile, menuInfoService) {
	      return {
	          template: "<input type=\"text\" value=\"\" />",
	          restrict: 'E',
	          scope: {
	              value: "=ngData",
	              opts: "=ngOpts"
	          },
	          link: function postLink($scope, $element, attrs) {
	              $scope.opts = $.extend(true, {
	                  grid: true,
	                  onChange: function (obj) {
	                      $scope.$apply(function () {
	                          $scope.value = obj.from_value;
	                      });
	                  },
	              }, $scope.opts);

	              var $slider = $element.ionRangeSlider($scope.opts);

	              $scope.$on("update.ionRangeSlider", function () {
	                  var slider = $slider.data("ionRangeSlider");
	                  slider.update($scope.opts);
	              });
	          }
	      };
	  }
    ]);
