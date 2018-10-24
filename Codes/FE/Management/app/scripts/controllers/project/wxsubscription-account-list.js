/**
 * @ngdoc function
 * @name managementApp.controller:WxsubscriptionAccountList
 * @description
 * # WxsubscriptionAccountList
 * Controller of the managementApp
 */

angular.module('managementApp')
    .controller('WxsubscriptionAccountList', ['$scope', 'messenger', '$location', 'promotionService',
        function ($scope, messenger, $location, promotionService) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
            $scope.dataList = [];//模板列表
            //搜索关键字
            $scope.searchKeyword = "";
            //模板信息的分页
            $scope.pagination = {
                pageSize: 10,
                pageIndex: 1,
                totalCount: 0
            };
            //获取模板列表
            $scope.getList = function (callback) {
                var obj = {
                    pageIndex: $scope.pagination.pageIndex,
                    pageSize: $scope.pagination.pageSize,
                    searchStr: $scope.searchKeyword
                }
                promotionService.getWxSubScriptionAccountList(obj, function (res) {
                    if (res.status == 0) {
                        _.each(res.data.list, function (item) {
                            item.createtime = window.lanh.utils.dateString(item.createtime);
                        })
                        $scope.dataList = res.data.list;
                        $scope.pagination.totalCount = res.data.total;
                        $scope.$broadcast("listCtrlflipupdateTotalcount", $scope.pagination.totalCount);
                    } else {
                        messenger.error(res.message);
                    }
                    !!callback && callback();
                })
            };
            //初始化模板列表信息
            $scope.getList();
            //点击事件
            $scope.action = function (type, data) {
                switch (type) {
                    case "search"://点击搜索模板
                        $scope.pagination.pageIndex = 1;
                        $scope.getList();
                        break;
                    case "detail":
                        $location.search({ appid: data.appId });
                        $location.path("/project/template-promotion-list");
                        break;
                }
            }
            // 分页切换
            $scope.$on("listCtrlflip", function (e, pageIndex, callback) {//分页
                $scope.pagination.pageIndex = !!pageIndex ? pageIndex : $scope.pagination.pageIndex;
                $scope.getList(callback);
            });
        }]);
