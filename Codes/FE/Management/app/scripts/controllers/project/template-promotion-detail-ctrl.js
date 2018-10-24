/**
 * @ngdoc function
 * @name managementApp.controller:TemplatePromotionDetailCtrl
 * @description
 * # TemplatePromotionDetailCtrl
 * Controller of the managementApp
 */

angular.module('managementApp')
    .controller('TemplatePromotionDetailCtrl', ['$scope', 'messenger', '$location', 'promotionService',
        function ($scope, messenger, $location, promotionService) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
            $scope.mainId = $location.search().mainId;
            $scope.getPromotionDetail=function () {
                promotionService.getPromotionDetail({ id: $scope.mainId }, function (res) {
                    if (res.status == 0) {
                        $scope.detail = res.data;
                    } else {
                        messenger.error(res.message);
                    }
                })
            } 
            $scope.getPromotionDetail();

            $scope.model={
                status: 1,//弹框显示内容 2-审核成功 1-审核失败
                reason: '',//审核失败原因
                err: ''//status=1,是否输入审核失败原因
            }
            //操作完成关闭弹窗
            $scope.done=function () {
                $('.checkBox').modal('hide');
            }
            // 操作按钮
            $scope.action = function (status) {
                switch (status) {
                    case "success":
                        $scope.model.status = 2;
                        $scope.model.reason = '';
                        $scope.model.err = '';
                        $('.checkBox').modal({ backdrop: 'static', keyboard: false });
                        break;
                    case "fail":
                        $scope.model.status = 1;
                        $scope.model.reason = '';
                        $scope.model.err = '';
                        $('.checkBox').modal({ backdrop: 'static', keyboard: false });
                        break;
                    case "model":
                        var opt = { 'mainId': $scope.mainId , "state": $scope.model.status };
                        if ($scope.model.status == 1) {
                            if ($scope.model.reason == '') {
                                $scope.model.err = "请输入审核失败原因";
                                return;
                            }
                            opt.reason = $scope.model.reason;
                        }
                        promotionService.isPass(opt, function (res) {
                            if (res.status == 0) {
                                $('.checkBox').modal('hide');
                                messenger.success($scope.model.status == 1 ? '已驳回成功' : '已审核成功');
                                $scope.getPromotionDetail();
                            } else {
                                messenger.error(res.message);
                            }
                        })
                        break;
                    case "back":
                        history.back();
                        break;
                    // case "detail":
                    //     lanh.utils.createPreviewWindow($scope.detail.url, $scope.detail.creator);
                    // break;
                }
            }
        }]);
