/**
 * @ngdoc function
 * @name managementApp.controller:AddBusinessCtrl
 * @description
 * # AddBusinessCtrl
 * Controller of the managementApp
 */

angular.module('managementApp')
    .controller('AddBusinessCtrl', ['$scope', '$timeout', 'messenger', '$location', 'businessService',
        function ($scope, $timeout, messenger, $location, businessService) {
            $scope.pageControl = {
                data: {
                    "businessId": "",
                    "businessName": "",//公司名称
                    "businessPhone": "",//用户名
                    "voucher": "", //密码
                    "businessType": "1",//1商家  2是设计师
                    "staffCount": "",//员工数量
                    "smsCount": "",//短信数量
                    "businessLogo": lanh.defaultLogo,//公司 logo
                    "businessCover": lanh.defaultBusinessCard,//公司封面
                    "items": [],//营销方案id组
                    money:'',//推广金额
                    smsUsed: 0,
                    smsOldCount: 0,
                    staffCreated: 0
                },
                revoucher: '',  //重复密码 
                edit: '', //是否是修改 
                case: [], //营销方案  
                typeText: '商家',
                search: '', //模板筛选条件
                allChoose: false //模板是否全选
            }

            $scope.pagination = {
                pageIndex: 1,
                pageSize: 15,
                totalCount: '',
                more: true //是否还有下一页
            }

            $scope.pageControl.edit = !!$location.search()['edit'] ? 'true' : 'false';
            $scope.pageControl.typeText = '商家';
            $scope.pageControl.data.businessId = $location.search()['businessId'] || '';

            //编辑时获取成员（商家）信息
            $scope.getMemberData = function () {
                var _data = {
                    businessId: $scope.pageControl.data.businessId
                }
                businessService.getBusiness(_data, function (result) {
                    if (result.status == 0) {
                        $scope.pageControl.data = result.data[0];
                        $scope.pageControl.data.smsOldCount = $scope.pageControl.data.smsCount;
                    }
                })
            }

            if ($scope.pageControl.edit == 'true') {
                $scope.getMemberData();
            }
            // 获取模板方案数据
            $scope.getTemplateList = function (more, cb) {
                $timeout(function () {
                    if (!!more) {
                        if (!!$scope.pagination.more) {
                            $scope.pagination.pageIndex++;
                        } else {
                            return false;
                        }
                    }
                    var _data = {
                        businessId: $scope.pageControl.data.businessId,
                        search: $scope.pageControl.search,
                        pageIndex: $scope.pagination.pageIndex,
                        pageSize: $scope.pagination.pageSize,
                        templateDistribution: 1 // 获取私有模板
                    }
                    businessService.getTemplateList(_data, function (result) {
                        if (result.status == 0) {
                            if (result.data.list.length > 0) {
                                _.each(result.data.list, function (item) {
                                    item.operatorDate = window.lanh.utils.dateString(item.operatorDate);
                                    item.active = !!item.distribution;
                                })
                                if (!!more) {
                                    $scope.pageControl.case = $scope.pageControl.case.concat(result.data.list);
                                } else {
                                    $scope.pageControl.case = result.data.list;
                                }
                                if ($scope.pageControl.case && $scope.pageControl.case.length > 0 && $scope.pageControl.case.every(rec => !!rec.active)) {
                                    $scope.pageControl.allChoose = true;
                                }
                            } else {
                                $scope.pagination.more = false;
                            }
                            !!cb && cb();
                        }
                    })

                })
            }

            $scope.getTemplateList('', function () {
                /*绑定滚动事件*/
                $("#case_wrap").isScroll({
                    container: "#case_wrap",
                    sections: ".case",
                    cb: function (data) {
                        $scope.getTemplateList(true);
                    }
                })
            });

            // 按模板搜索条件查询模板
            $scope.search = function () {
                $scope.pagination.startCount = 0;
                $scope.pagination.more = true;
                $scope.getTemplateList();
                // 搜索时先把 $scope.pageControl.allChoose 属性设置为true，统一清除全选功能
                $scope.pageControl.allChoose = true;
                $scope.choose('all');
            }

            //模板选择
            $scope.choose = function (type, item) {
                switch (type) {
                    case 'all': //全选
                        if ($scope.pageControl.allChoose == false) {
                            $scope.pageControl.allChoose = true;
                            _.each($scope.pageControl.case, function (template) {
                                template.active = true;
                            })
                        } else {
                            $scope.pageControl.allChoose = false;
                            _.each($scope.pageControl.case, function (template) {
                                template.active = false;
                            })
                        }

                        break;
                    case 'single': //单选
                        if (item.active == false) {
                            item.active = true;
                            if ($scope.pageControl.case.length == $.grep($scope.pageControl.case, function (n) { return n.active == true; }).length) {
                                $scope.pageControl.allChoose = true;
                            } else {
                                $scope.pageControl.allChoose = false;
                            };
                        } else {
                            item.active = false;
                            $scope.pageControl.allChoose = false;
                        }
                        break;
                }
            }

            // 判断公司名称手机号是否重复
            $scope.checkUniq = function (item, type) {
                var obj = {
                    businessType: $scope.pageControl.data.businessType,
                    pageIndex: 1,
                    pageSize: 100
                };
                if (!item) { return false; }
                obj[type] = item;
                businessService.getBusinessList(obj, function (result) {
                    if (result.status == 0 && result.data.total > 0) {
                        if ($scope.pageControl.edit == 'true' && result.data.data[0].businessId == $scope.pageControl.data.businessId) {//判断id是否一致，一致则为编辑，不校验
                            return false;
                        }
                        messenger.error((type == 'businessName' ? '公司名称' : '手机号') + '已存在,请重新填写!');
                        $scope.pageControl.data[type] = '';
                    }
                })
            }

            // 表单验证
            var _fomvalidation = function () {
                var _tag = true
                    , regArr = [
                        // /^[\u4e00-\u9fa5（）()\w]{1,80}$/
                        { type: 'businessName', reg: /^[\u4e00-\u9fa5\[\]]{2,40}$/ },
                        { type: 'businessPhone', reg: /^1[3-9][0-9]{9}$/ },
                        { type: 'voucher', reg: /^[a-zA-Z0-9\w\`\~\!\@\#\$\%\^\&\*\(\)_\-\+\=\{\}\[\]\:\;\"\'\\\|\<\,\.\>\/\?.]{6,20}$/ },
                        { type: 'resource', reg: /^0?|([1-9][0-9]{0,5})$/ }
                    ];
                if (_tag && !$scope.pageControl.data.businessName) {
                    messenger.error('请输入公司名称！');
                    _tag = false;
                } else if (_tag && !regArr[0].reg.test($scope.pageControl.data.businessName)) {
                    messenger.error('公司名称可以由2～40个中文和中括号组成！');
                    _tag = false;
                }
                if (_tag && !$scope.pageControl.data.businessPhone) {
                    messenger.error('请输入手机号！');
                    _tag = false;
                } else if (_tag && !regArr[1].reg.test($scope.pageControl.data.businessPhone)) {
                    messenger.error('请输入正确的手机号');
                    _tag = false;
                }
                if ($scope.pageControl.edit == 'false') {
                    if (_tag && !$scope.pageControl.data.voucher) {
                        messenger.error('请输入密码！');
                        _tag = false;
                    } else if (_tag && !regArr[2].reg.test($scope.pageControl.data.voucher)) {
                        messenger.error('请输入6-20位密码，区分大小写！');
                        _tag = false;
                    }
                    if (_tag && !!$scope.pageControl.data.voucher && !$scope.pageControl.revoucher) {
                        messenger.error('请输入确认密码！');
                        _tag = false;
                    } else if (_tag && !!$scope.pageControl.data.voucher && $scope.pageControl.data.voucher != $scope.pageControl.revoucher) {
                        messenger.error('两次密码输入不一致，请重新输入！');
                        _tag = false;
                    }
                }
                var smsCount = Number($scope.pageControl.data.smsCount);
                if (_tag && !smsCount && smsCount != 0) {
                    messenger.error('请输入短信数量！');
                    _tag = false;
                } else if (_tag && !regArr[3].reg.test(smsCount)) {
                    messenger.error('短信数量应为0-100000之间的数字！');
                    _tag = false;
                } else if (smsCount > 100000 || smsCount < 0) {
                    messenger.error('短信数量应为0-100000之间的数字！');
                    _tag = false;
                } else if ($scope.pageControl.data.smsOldCount > 0 && smsCount < $scope.pageControl.data.smsOldCount) {
                    messenger.error('短信数量必须大于已购买数！');
                    _tag = false;
                }
                var staffCount = Number($scope.pageControl.data.staffCount);
                if (_tag && !staffCount && staffCount != 0) {
                    messenger.error('请输入员工数量！');
                    _tag = false;
                } else if (_tag && !regArr[3].reg.test(staffCount)) {
                    messenger.error('员工数量应为0-100000之间的数字！');
                    _tag = false;
                } else if (staffCount > 100000 || staffCount < 0) {
                    messenger.error('员工数量应为0-100000之间的数字！');
                    _tag = false;
                } else if ($scope.pageControl.data.staffCreated > 0 && staffCount < $scope.pageControl.data.staffCreated) {
                    messenger.error('员工数量必须大于已创建数！');
                    _tag = false;
                }
                var money = Number($scope.pageControl.data.money);
                if (_tag && !money && money != 0){
                    messenger.error('推广金额应为大于或等于0数字！');
                    _tag = false;
                } else if (_tag && !regArr[3].reg.test(money)){
                    messenger.error('推广金额应为大于或等于0的数字！');
                    _tag = false;
                } else if (money<0){
                    messenger.error('推广金额应为大于或等于0的数字！');
                    _tag = false;
                }
                return _tag;
            }
            // 新增、设计师，修改商家
            $scope._lock = false;
            $scope.addBusiness = function () {
                if (!_fomvalidation()) { return false; }
                if ($scope.pageControl.case.length > 0) {
                    var _templateIdArr = [];
                    _.each($scope.pageControl.case, function (item) {
                        // if (item.active) {
                        //     _templateIdArr.push(item.id);
                        // }
                        _templateIdArr.push(
                            {
                                "id": item.id,                      // 模板ID
                                "distribution": !!item.active ? 1 : 0, // 是否已经分发到该商家
                            })
                    })
                }
                $scope.pageControl.data.items = _templateIdArr;
                if ($scope._lock) {
                    return false;
                }
                $scope._lock = true;
                businessService.saveBusiness($scope.pageControl.data, function (result) {
                    if (result.status == 0) {
                        messenger.success(($scope.pageControl.edit == 'true' ? '修改' : '新增') + '成功!');
                        $location.search({});
                        $location.path('/project/business-list');
                    } else {
                        messenger.error(result.message);
                    }
                    $scope._lock = false;
                })
            }

        }]);
