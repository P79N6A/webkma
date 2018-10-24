/**
 * @ngdoc directive
 * @name designApp.directive:uibPagination
 * @description
 * # uibPagination
 */
angular.module('managementApp')
    .directive('uiPagination', ["$http", "$location", "$timeout", '$compile', '$rootScope',
        function ($http, $location, $timeout, $compile, $rootScope) {
            return {
                templateUrl: "views/templates/directives/ui-pagination.html",//使用template指定的HTML标记替换指令内容
                restrict: 'E',//限定指令的应用场景
                replace: true,//是否完整替换指令dom对象
                scope: {
                    pageindex: "@",
                    totalcount: "@",
                    pagesize: "@",
                    textalign: "@",
                    myWhere: "@myWhere"
                },//共享作用域
                link: function postLink($scope, $element, attrs) {//指令操作dom函数
                    $scope.whichPage = '';
                    $scope.$watch('totalcount', function () {
                        var pages = Math.ceil(parseInt($scope.totalcount) / parseInt($scope.pagesize))
                        $scope.totalPage = !!pages ? pages : 1;
                    });
                    //   $timeout(function(){
                    //     $scope.totalPage = !!Math.ceil(parseInt($scope.totalcount) / parseInt($scope.pagesize))?Math.ceil(parseInt($scope.totalcount) / parseInt($scope.pagesize)):1;
                    //   },1000);
                    var _clock = false;
                    $scope.action = function (type) {
                        switch (type) {
                            case 'prev':
                                if (_clock == false) {
                                    $scope.whichPage = '';
                                    $scope.pageindex--;
                                    _clock = true;
                                    $scope.$emit($scope.myWhere, $scope.pageindex, function () {
                                        _clock = false;
                                    });
                                }
                                break;
                            case 'next':
                                if (_clock == false) {
                                    $scope.whichPage = '';
                                    $scope.pageindex++;
                                    _clock = true;
                                    $scope.$emit($scope.myWhere, $scope.pageindex, function () {
                                        _clock = false;
                                    });
                                }
                                break;
                            case 'gotowhich':
                                /* 验证正整数 */
                                if (!/^\d+$/.test($scope.whichPage)) {
                                    break;
                                }
                                /* 必须大于0 */
                                if (parseInt($scope.whichPage) <= 0) {
                                    break;
                                }
                                /* 超出最大页数时不跳转 */
                                if (parseInt($scope.whichPage) > parseInt($scope.totalPage)) {
                                    break;
                                }
                                if (_clock == false) {
                                    $scope.pageindex = $scope.whichPage;
                                    _clock = true;
                                    $scope.$emit($scope.myWhere, $scope.pageindex, function () {
                                        _clock = false;
                                        $scope.whichPage = '';
                                    });
                                }
                                break;
                        }
                    };
                    //   $scope.$on($scope.myWhere+'updateTotalcount',function(e,totalcount){
                    //       $scope.totalcount = totalcount;
                    //       $scope.totalPage = !!Math.ceil(parseInt($scope.totalcount) / parseInt($scope.pagesize))?Math.ceil(parseInt($scope.totalcount) / parseInt($scope.pagesize)):1;
                    //       // $scope.pageindex = $scope.pageindex > $scope.totalPage ? 1 : $scope.pageindex;
                    //       if(parseInt($scope.pageindex)>$scope.totalPage){
                    //           $scope.pageindex--;
                    //           $scope.$emit($scope.myWhere,$scope.pageindex,function(){
                    //               _clock = false;
                    //           });
                    //       }
                    //   });
                }
            };
        }]);
