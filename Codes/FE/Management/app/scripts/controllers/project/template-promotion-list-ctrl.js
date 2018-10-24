/**
 * @ngdoc function
 * @name managementApp.controller:TemplatePromotionListCtrl
 * @description
 * # TemplatePromotionListCtrl
 * Controller of the managementApp
 */

angular.module('managementApp')
    .controller('TemplatePromotionListCtrl', ['$scope', 'messenger', '$location', 'promotionService',
        function ($scope, messenger, $location,promotionService) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
            $scope.promotionStatus = !!$location.search().promotionStatus ? $location.search().promotionStatus:'0';// checkPending--待审核 promotion--推广中  checkFail--审核失败
            $scope.statusList = [{ status: '0', value: '待审核' }, { status: '2', value: '推广中' }, { status: '1', value: '审核失败' }, { status: '3', value: '已结束' }];
            $scope.appid = !!$location.search().appid ? $location.search().appid:'';
            $scope.model={
                status: 1,//弹框显示内容 2-审核成功 1-审核失败
                id:'',
                reason:'',//审核失败原因
                err:''//status=1,是否输入审核失败原因
            };
            $scope.promotionList=[];
            $scope.keywords='';//搜索关键字
            $scope.pagination={//存储分页
                totalCount:0,
                pageSize: 10,
                pageIndex:1
            }
            $scope.tabClick=function(item) {//切换tab
                var searchObj = { promotionStatus: item.status};
                if ($scope.appid!=''){
                    searchObj.appid = $scope.appid;
                }
                $location.search(searchObj);
            }
            $scope.getPromotionList=function(cb){//获取朋友圈广告列表
                var opt = {
                    "state": $scope.promotionStatus,
                    "search": $scope.keywords,
                    "pageIndex": $scope.pagination.pageIndex,
                    "pageSize": $scope.pagination.pageSize
                };
                if ($scope.appid!=''){
                    opt.appId = $scope.appid;
                }
                promotionService.getPromotionList(opt, function (res) {
                        if (res.status==0){
                            $scope.promotionList = res.data.list;
                            $scope.pagination.totalCount = res.data.total;
                            $scope.$broadcast("TemplatePromotionListCtrlflipupdateTotalcount", $scope.pagination.totalCount);
                            !!cb && cb();
                        }
                })
            }
            $scope.getPromotionList();
            // 分页切换
            $scope.$on("TemplatePromotionListCtrlflip", function (e, pageIndex, callback) {//分页
                $scope.pagination.pageIndex = !!pageIndex ? pageIndex : $scope.pagination.pageIndex;
                $scope.getPromotionList(callback);
            });
            // 操作按钮
            $scope.action=function (status,id) {
                switch (status) {
                    case "success":
                        $scope.model.status = 2;
                        $scope.model.id = id;
                        $scope.model.reason = '';
                        $scope.model.err='';
                        $('.checkBox').modal({ backdrop: 'static', keyboard: false });
                        break;
                    case "fail":
                        $scope.model.status = 1;
                        $scope.model.id = id;
                        $scope.model.reason = '';
                        $scope.model.err = '';
                        $('.checkBox').modal({ backdrop: 'static', keyboard: false });
                        break;
                    case "detail":
                        $location.path('/project/template-promotion-detail').search({mainId:id});
                        break;
                    case "model":
                        var opt = { 'mainId': $scope.model.id, "state": $scope.model.status };
                        if ($scope.model.status==1){
                            if ($scope.model.reason==''){
                                $scope.model.err="请输入审核失败原因";
                                return ;
                            }
                            opt.reason=$scope.model.reason;
                        }
                        promotionService.isPass(opt,function (res) {
                          if(res.status==0){
                              $('.checkBox').modal('hide');
                              messenger.success($scope.model.status==1?'已驳回成功':'已审核成功');
                              $scope.getPromotionList();
                          }else{
                              messenger.error(res.message);
                          } 
                        })
                    break;
                    case "search":
                        $scope.pagination.pageIndex = 1;
                        $scope.getPromotionList();
                    break;
                }
            }

            //操作完成关闭弹窗
            $scope.done = function () {
                $('.checkBox').modal('hide');
            }

            //跳转到数据报告列表
            $scope.jumpToPromotionData = function(item){
                $location.search({mainId: item.mainId});
                sessionStorage.setItem('promotionPlanName', item.activityName);
                $location.path('/project/moments-adv-data-list');
            }
        }]);
