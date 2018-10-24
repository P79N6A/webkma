'use strict';
/**
 * @ngdoc directive
 * @name managementApp.directive:slideBtn
 * @滑动门插件
 * # slideBtn
 */
angular.module('managementApp')
  .directive('slideBtn', ["$http", "$location", "$timeout", '$compile', '$rootScope',
    function ($http, $location, $timeout, $compile, $rootScope) {
        return {
            templateUrl: "views/templates/directives/slide-btn_tpl.html",
            restrict: 'E',
            replace: true,
            scope: {
                type: "@slideType",
                myDefault: '=',
                activeText: "@activeText",
                inactiveText: "@inactiveText",
                propKey: "@propKey",
                map: "=slideMap",
                trunOn: "@trunOn"
            },
            link: function postLink($scope, $element, attrs) {
                var _innerBtn = $element.find('.slide-inner')
                , _text = $element.find('.slide-text');

                $scope.activeText = $scope.activeText || '正常';
                $scope.inactiveText = $scope.inactiveText || '禁用';
                $scope.propKey = $scope.propKey || 'state';
                $scope.type = $scope.type || '';
                $scope.map = $scope.map || {active: 0,inactive: 1};
                $scope.trunOn = $scope.trunOn || 'active';

                if( $scope.myDefault[$scope.propKey] == $scope.map[$scope.trunOn] ){
                    $scope.text = $scope.activeText;
                    _innerBtn.css({'left':'37px'});
                }else {
                    $scope.text = $scope.inactiveText;
                    _innerBtn.css({'left':'3px'});
                }
            },
            controller: function($scope){
                $scope.slide = function(event){
                    var _this = $(event.target);
                    if( $scope.myDefault[$scope.propKey] == $scope.map[$scope.trunOn] ){
                        $scope.myDefault[$scope.propKey] = $scope.trunOn == 'active' ? $scope.map.inactive : $scope.map.active;
                        _this.animate({'left':'3px'},100);
                    }else{
                        $scope.myDefault[$scope.propKey] = $scope.map[$scope.trunOn];
                        _this.animate({'left':'37px'},100);
                    }
                    $scope.text = $scope.myDefault[$scope.propKey] == $scope.map[$scope.trunOn] ? $scope.activeText : $scope.inactiveText;
                    $rootScope.slideCallback($scope.type, $scope.myDefault);
                }
            }
        };
    }]);
