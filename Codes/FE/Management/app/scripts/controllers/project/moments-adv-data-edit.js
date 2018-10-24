/**
 * @ngdoc function
 * @name managementApp.controller:momentsAdvDataEditCtrl
 * @description
 * # momentsAdvDataEditCtrl
 * Controller of the managementApp
 */

angular.module('managementApp')
    .controller('momentsAdvDataEditCtrl', ['$scope', '$timeout', 'messenger', '$location', 'promotionService',
        function ($scope, $timeout, messenger, $location, promotionService) {
            $scope.pageControl = {
                data: {
                    mainId: '', //推广计划id
                    id: '', //数据报告id
                    name: '', // 报告名称
                    startTime: '', // 报告开始时间
                    endTime: '', // 报告结束时间
                    clickCount: '', //点击次数
                    exposureCount: '', //曝光次数
                    clickRate: '', //点击率
                    conversionIndex: '', //转化指标
                    conversionCost: '', //转化花费
                    extensionCost: '', //推广花费
                    // keyIndicatorsImg: '', //趋势图
                    advertisementDiagnosis: '' //广告诊断
                },
                startTime: {	//可空，不为空时则筛选结果的创建时间将会大于等于该值
                    value: "",
                    opened: false,
                    options: {}
                },
                endTime: {       //可空，不为空时则筛选结果的创建时间将会小于该值
                    value: "",
                    opened: false,
                    options: {}
                },
                edit: '', //是否是修改  
                promotionPlanName: sessionStorage.getItem('promotionPlanName') || ''
            }

            $scope.pageControl.edit = !!$location.search()['edit'] ? 'true' : 'false';
            $scope.pageControl.data.mainId = $location.search()['mainId'] || '';
            $scope.pageControl.data.id = $location.search()['id'] || '';

            //编辑时获取推广数据详情
            $scope.getPromotionDataDetail = function () {
                var _option = {
                    id: $scope.pageControl.data.id,
                    mainId: $scope.pageControl.data.mainId
                }
                promotionService.getPromotionDataDetail(_option, function (result) {
                    if (result.status == 0) {
                        $scope.pageControl.data = Object.assign({}, result.data);
                        $scope.pageControl.startTime.value = window.lanh.utils.dateString($scope.pageControl.data.startTime).split(' ')[0];
                        $scope.pageControl.endTime.value = window.lanh.utils.dateString($scope.pageControl.data.endTime).split(' ')[0];
                        $($('.date-picker').find('input').get(0)).val($scope.pageControl.startTime.value);
                        $($('.date-picker').find('input').get(1)).val($scope.pageControl.endTime.value);
                    }
                })
            }

            if (!!$scope.pageControl.data.id) {
                $scope.getPromotionDataDetail();
            }

            // 表单验证
            var _fomvalidation = function () {

                if (!$scope.pageControl.data.name) {
                    messenger.error('请输入数据报告名称！');
                    return false;
                } else if( $scope.pageControl.data.name.length>20 ) {
                    messenger.error('数据报告名称字符在1-20个之间！');
                    return false;
                }

                if (!$scope.pageControl.data.startTime) {
                    messenger.error('请选择数据统计开始时间！');
                    return false;
                }
                if (!$scope.pageControl.data.endTime) {
                    messenger.error('请选择数据统计结束时间！');
                    return false;
                }
                if(!$scope.pageControl.data.extensionCost){
                    messenger.error('花费推广费用不能为空！');
                    return false;
                } else if(!/^\d{1,}(\.\d{1,2})?$/.test($scope.pageControl.data.extensionCost) || parseFloat($scope.pageControl.data.extensionCost) <= 0){
                    messenger.error('花费推广费用为数字，且小数点后最多只能有2位的数！');
                    return false;
                }
                if(!$scope.pageControl.data.exposureCount){
                    messenger.error('曝光次数不能为空！');
                    return false;
                } else if(!/^\d{1,}$/.test($scope.pageControl.data.exposureCount)){
                    messenger.error('曝光次数仅支持数字！');
                    return false;
                }
                if(!$scope.pageControl.data.clickCount){
                    messenger.error('点击次数不能为空！');
                    return false;
                } else if(!/^\d{1,}$/.test($scope.pageControl.data.clickCount)){
                    messenger.error('点击次数仅支持数字！');
                    return false;
                }
                if(!$scope.pageControl.data.clickRate){
                    messenger.error('点击率不能为空！');
                    return false;
                } else if(!/^\d{1,}$/.test($scope.pageControl.data.clickRate) || parseInt($scope.pageControl.data.clickRate)>100 ){
                    messenger.error('点击率仅支持数字，且范围为1~100！');
                    return false;
                }
                if(!$scope.pageControl.data.conversionIndex){
                    messenger.error('转化指标不能为空！');
                    return false;
                } else if(!/^\d{1,}$/.test($scope.pageControl.data.conversionIndex)){
                    messenger.error('转化指标仅支持数字！');
                    return false;
                }
                if(!$scope.pageControl.data.conversionCost){
                    messenger.error('转化成本不能为空！');
                    return false;
                } else if(!/^\d{1,}(\.\d{1,2})?$/.test($scope.pageControl.data.conversionCost) || parseFloat($scope.pageControl.data.conversionCost) <= 0){
                    messenger.error('转化成本为数字，且小数点后最多只能有2位的数！');
                    return false;
                }
                if(!$scope.pageControl.data.advertisementDiagnosis){
                    messenger.error('广告诊断不能为空！');
                    return false;
                } else if(!/^\d{1,}$/.test($scope.pageControl.data.advertisementDiagnosis) || parseInt($scope.pageControl.data.advertisementDiagnosis)>10 ){
                    messenger.error('广告诊断仅支持数字，且范围为1~10！');
                    return false;
                }
                // if(!$scope.pageControl.data.keyIndicatorsImg){
                //     messenger.error('请上传关键指标趋势图！');
                //     return false;
                // }
                return true;
            }


            $scope.btnAction = function(type){
                switch( type ){
                    case 'goback':
                        $location.search({mainId: $scope.pageControl.data.mainId});
                        $location.path('/project/moments-adv-data-list');
                        break;
                    case 'submit':
                        $scope.pageControl.data.startTime = !!window.lanh && !!window.lanh.utils ? window.lanh.utils.dateString($scope.pageControl.startTime.value).split(' ')[0] + ' 00:00' : '';
                        $scope.pageControl.data.endTime = !!window.lanh && !!window.lanh.utils ? window.lanh.utils.dateString($scope.pageControl.endTime.value).split(' ')[0] + ' 23:59' : '';
                        if (!_fomvalidation()) { return false; }

                        promotionService.savePromotionDataReport($scope.pageControl.data, function (result) {
                            if (result.status == 0) {
                                messenger.success(($scope.pageControl.edit == 'true' ? '修改' : '添加') + '成功!');
                                $location.search({mainId: $scope.pageControl.data.mainId});
                                $location.path('/project/moments-adv-data-list');
                            } else {
                                messenger.error(result.message);
                            }
                        });
                        break;
                }
            }
        }]);
