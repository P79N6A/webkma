'use strict';

/**
 * @ngdoc directive
 * @name managementApp.directive:tabCrumbsHandover
 * @description
 * # tabCrumbsHandover
 */
angular.module('managementApp')
  .directive('tabCrumbsHandover', ["$http", "$location", "$timeout", "materialListService", "$rootScope", "messenger",
    function ($http, $location, $timeout, materialListService, $rootScope, messenger) {
        return {
            templateUrl: "views/templates/directives/tab-handover_tpl.html",//使用template指定的HTML标记替换指令内容
            restrict: 'E',//限定指令的应用场景
            replace: true,//是否完整替换指令dom对象
            //scope: {
            //  crumTab: '=ngTab',
            //  viewsType: '=viewsType'
            //},//隔离的作用域
            scope: false,
            link: function postLink($scope, $element, attrs) {//指令操作dom函数

                if (!!$location.search().tabIndex) {
                    $scope.tabIndex = $location.search().tabIndex;
                } else {
                    $scope.tabIndex = 0;
                }

                $scope.clickTab = function (name) {
                    if (name == '' || name == undefined) {
                        return;
                    }
                    $rootScope.$broadcast(name);
                    if (name == 'material-mobile') {
                        $scope.createObj.terminalType = '2';
                    } else {
                        $scope.createObj.terminalType = '1';
                    }
                };

                $scope.createMaterial = function () {
                    $scope.createObj.materialState = '';
                    $('.popBox').modal('show');
                    $('.popBox').on('click', '.pop_top_tit>i,.check_false', function () {
                        $('.popBox').modal('hide');
                        $scope.checked = 'off';
                    });
                };
                //设置弹窗可拖动位置
                $(".popBox").draggable({
                    addClasses: false,
                    handle: ".pop_top_tit,.txt_content",
                    containment: "body",
                    stop: function () {
                        $('.popBox').css('height', 'auto');
                    }
                });
                $scope.createObj = {
                    materialName: '',
                    terminalType: '2',
                    materialState: ''
                };
                $scope.sureCreate = function () {
                    if ($scope.createObj.materialName === '') {
                        messenger.info('分类名称不能为空');
                        return;
                    }
                    if ($scope.createObj.materialState === '') {

                        $scope.createObj.materialState = 1;
                        return;
                    }
                    materialListService.addMaterialType(angular.copy($scope.createObj), function (json) {
                        if (json.code === 0) {
                            messenger.success('添加成功');
                            $('.popBox').modal('hide');
                            $rootScope.$broadcast($scope.createObj.terminalType == '1' ? 'material-pc' : 'material-mobile');
                            $scope.createObj.materialName = '';
                            $scope.createObj.materialState = '';
                            $("#isTrue").removeAttr("checked");
                            $("#isFalse").removeAttr("checked");
                        } else {
                            messenger.error('添加失败:' + json.desc);
                        }
                    });
                }
            }
        };
    }]);
