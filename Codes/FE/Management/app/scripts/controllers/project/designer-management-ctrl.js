/**
 * @ngdoc function
 * @name managementApp.controller:AddBusinessCtrl
 * @description
 * # AddBusinessCtrl
 * Controller of the managementApp
 */

angular.module('managementApp')
    .controller('DesignerManagementCtrl', ['$scope', '$timeout', 'messenger', '$location', 'businessService',
        function ($scope, $timeout, messenger, $location, businessService) {

            $scope.pageControl = {
                data: {
                    "businessId": "",
                    "businessName": "",//公司名称
                    "businessPhone": "",//用户名
                    "voucher": "", //密码
                    "businessType": "2"
                },
                revoucher: '',  //重复密码 
                edit: '', //是否是修改 
                typeText: '设计师',
            }

            $scope.pageControl.edit = !!$location.search()['edit'] ? 'true' : 'false';
            $scope.pageControl.data.businessId = $location.search()['businessId'] || '';

            //编辑时获取设计师信息
            $scope.getMemberData = function () {
                var _data = {
                    businessId: $scope.pageControl.data.businessId
                }
                businessService.getBusiness(_data, function (result) {
                    if (result.status == 0) {
                        $scope.pageControl.data = Object.assign({}, result.data[0]);
                    }
                })
            }

            if ($scope.pageControl.edit == 'true') {
                $scope.getMemberData();
            }

            // 表单验证
            var _fomvalidation = function () {
                var regArr = [
                    // /^[\u4e00-\u9fa5（）()\w]{1,80}$/
                    { type: 'businessName', reg: /^[a-zA-Z\u4e00-\u9fa5]{2,10}$/ },
                    { type: 'businessPhone', reg: /^1[3-9][0-9]{9}$/ },
                    { type: 'voucher', reg: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z@_~\!#\$%\^&\*\(\)-=\+\?]{6,20}$/ },
                ];

                if (!$scope.pageControl.data.businessName) {
                    messenger.error('请输入设计师姓名！');
                    return false;
                }
                if (!regArr[0].reg.test($scope.pageControl.data.businessName)) {
                    messenger.error('设计师姓名由2～10个中文、英文字符组成！');
                    return false;
                }
                if (!$scope.pageControl.data.businessPhone) {
                    messenger.error('请输入手机号！');
                    return false;
                }
                if (!regArr[1].reg.test($scope.pageControl.data.businessPhone)) {
                    messenger.error('请输入正确的手机号');
                    return false;
                }
                if (!$scope.pageControl.edit && !$scope.pageControl.data.voucher) {
                    messenger.error('请输入密码！');
                    return false;
                }
                if (!!$scope.pageControl.data.voucher && !regArr[2].reg.test($scope.pageControl.data.voucher)) {
                    messenger.error('密码为6~20位的字母、数字、符号组成！');
                    return false;
                }
                if (!!$scope.pageControl.data.voucher && !$scope.pageControl.revoucher) {
                    messenger.error('请输入确认密码！');
                    return false;
                }
                if (!!$scope.pageControl.data.voucher && $scope.pageControl.data.voucher != $scope.pageControl.revoucher) {
                    messenger.error('两次密码输入不一致！');
                    return false;
                }
                return true;
            }
            // 新增、设计师
            $scope._lock = false;
            $scope.addBusiness = function () {
                if (!_fomvalidation()) { return false; }
                if ($scope._lock) {
                    return false;
                }
                $scope._lock = true;
                businessService.saveBusiness($scope.pageControl.data, function (result) {
                    if (result.status == 0) {
                        messenger.success(($scope.pageControl.edit == 'true' ? '修改' : '新增') + '成功!');
                        $location.search({});
                        $location.path('/project/designer-list');
                    } else {
                        messenger.error(result.message);
                    }
                    $scope._lock = false;
                });
            }

        }]);
