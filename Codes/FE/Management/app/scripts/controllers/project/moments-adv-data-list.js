/**
 * @ngdoc function
 * @name managementApp.controller:momentsAdvDataListCtrl
 * @description
 * # momentsAdvDataListCtrl
 * Controller of the managementApp
 */

angular.module('managementApp')
    .controller('momentsAdvDataListCtrl', ['$scope', '$timeout', 'messenger', '$location', 'promotionService',
        function ($scope, $timeout, messenger, $location, promotionService) {

            $scope.data = [];//商家列表数据

            $scope.pagination = {//分页
                pageSize: 10,
                pageIndex: 1,
                totalCount: 0
            };

            $scope.promotionPlanName = sessionStorage.getItem('promotionPlanName') || '';
            $scope.mainId = $location.search()['mainId'];

            $scope.getPromotionDataList = function(callback){
                var _option = {
                    mainId: $scope.mainId,
                    pageIndex: $scope.pagination.pageIndex,
                    pageSize: $scope.pagination.pageSize
                }
                promotionService.getPromotionDataList(_option, function (json) {
                    if (json.status === 0) {
                        $scope.data = json.data.list;
                        $scope.pagination.totalCount = json.data.total;
                        _.each($scope.data, function (item) {
                            item.startTime = window.lanh.utils.dateString(item.startTime).split(' ')[0];
                            item.endTime = window.lanh.utils.dateString(item.endTime).split(' ')[0];
                        })
                        $scope.$broadcast("momentsAdvDataListCtrlflipupdateTotalcount", $scope.pagination.totalCount);
                    } else {
                        messenger.error(json.message);
                    }
                    !!callback && callback();
                })
            }

            $scope.getPromotionDataList();

            // 分页切换
            $scope.$on("momentsAdvDataListCtrlflip", function (e, pageIndex, callback) {//分页
                $scope.pagination.pageIndex = !!pageIndex ? pageIndex : $scope.pagination.pageIndex;
                $scope.getPromotionDataList(callback);
            });

            $scope.editData = function(type, item){
                switch(type){
                    case 'add': //新增
                        $location.search({mainId: $scope.mainId});
                        break;
                    case 'edit': //编辑
                        $location.search({mainId: $scope.mainId, id: item.id, edit: true});
                        break;
                    case 'query': //查看详情
                        $location.search({mainId: $scope.mainId, id: item.id});
                        break;
                    default:;
                }
                $location.path('/project/moments-adv-data-edit');
            }

        }]);
