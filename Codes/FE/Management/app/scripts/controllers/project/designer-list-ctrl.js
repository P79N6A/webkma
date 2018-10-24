/**
 * @ngdoc function
 * @name managementApp.controller:DesignerListCtrl
 * @description
 * # DesignerListCtrl
 * Controller of the managementApp
 */

angular.module('managementApp')
  .controller('DesignerListCtrl', ['$rootScope','$scope', 'messenger', '$location', 'businessService', 'designersInfoService',
    function ($rootScope, $scope, messenger, $location, businessService, designersInfoService) {

        $scope.pageControl = {
            data: []//商家列表数据
        }

        $scope.pagination = {//分页
            pageSize: 15,
            pageIndex: 1,
            totalCount: 0
        };
        $scope.opt = {
            businessType: 2,
            businesskeyword: '',//可空，模糊查询内如可是用户名，公司名称
            pageIndex: $scope.pagination.pageIndex,//开始条数，不可空，正整数
            pageSize: $scope.pagination.pageSize//取用条数，不可空，正整数
        };

        //设计师状态，对应滑动开关map
        $scope.stateOpt = {active: 0, inactive: 1};
        // 获取列表数据
        $scope.getBusinessList = function (callback) {
            businessService.getBusinessList($scope.opt, function (json) {
                if (json.status === 0) {
                    $scope.pageControl.data = json.data.data;
                    $scope.pagination.totalCount = json.data.total;
                    _.each($scope.pageControl.data, function (item) {
                        item.createtime = window.lanh.utils.dateString(item.createtime);
                        item.stateText = item.state == 0 ? '正常' : '禁用';
                    })
                    $scope.$broadcast("DesignerListCtrlflipupdateTotalcount", $scope.pagination.totalCount);
                } else {
                    messenger.error(json.message);
                }
                !!callback && callback();
            })
        };

        $scope.getBusinessList();

        // 分页切换
        $scope.$on("DesignerListCtrlflip", function (e, pageIndex, callback) {//分页
            $scope.pagination.pageIndex = !!pageIndex ? pageIndex : $scope.pagination.pageIndex;
            $scope.opt.pageIndex = $scope.pagination.pageIndex;
            $scope.getBusinessList(callback);
        });


        $scope.action = function (type, obj) {
            switch (type) {
                case 'addDesigner'://添加用户
                    $location.path("/project/designer-management")
                    break;
                case 'queryDetail'://查看详情
                    $location.search({ businessId: obj.businessId,  edit: true });
                    $location.path("/project/designer-management");
                    break;
                case 'setStatus'://用户状态控制--启用/禁用
                    var opt = {
                        businessId: obj.businessId,
                        state: obj.state
                    };
                    businessService.setMemberStatus(opt, function (json) {
                        if (json.status == 0) {
                            $scope.getBusinessList();
                            messenger.success("操作成功");
                        } else {
                            messenger.error("操作失败:" + json.message);
                        }
                    });
                    break;
                case 'serPopularize'://推广
                    $location.search({designerId: obj.userId});
                    $location.path("/project/template-list");
                    break;
                case 'search':
                    $scope.pagination.pageIndex = 1;
                    $scope.opt.pageIndex = 1;
                    $scope.getBusinessList();
                    break;
                case 'delete':
                    businessService.deleteBusiness({ businessId: obj.businessId }, function (json) {
                        if (json.status === 0) {
                            messenger.success("操作成功");
                            $scope.getBusinessList();
                        } else {
                            messenger.error("操作失败:" + json.message);
                        }
                    })
                    break;
            }
        }

        $rootScope.slideCallback = function(type, item){
            $scope.action(type, item);
        }
    }]);
