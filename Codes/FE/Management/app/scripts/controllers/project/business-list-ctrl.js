/**
 * @ngdoc function
 * @name managementApp.controller:BusinessListCtrl
 * @description
 * # BusinessListCtrl
 * Controller of the managementApp
 */

angular.module('managementApp')
    .controller('BusinessListCtrl', ['$rootScope', '$scope', 'messenger', '$location', 'businessService', 'designersInfoService',
        function ($rootScope, $scope, messenger, $location, businessService, designersInfoService) {
           
            $scope.searchForm = false;

            $scope.pageControl = {
                data: []//商家列表数据
            }

            $scope.pagination = {//分页
                pageSize: 10,
                pageIndex: 1,
                totalCount: 0
            };
            $scope.opt = {
                businessType: 1,
                businesskeyword: '',//可空，模糊查询内如可是用户名，公司名称
                pageIndex: $scope.pagination.pageIndex,//开始条数，不可空，正整数
                pageSize: $scope.pagination.pageSize//取用条数，不可空，正整数
            };
            $scope.prompt = {//保存弹窗数据
                tpl: 'editsign',
                newPwd: '',//新密码
                title: '编辑短信签名',
                user: {//当前操作商家
                    secretKey: ''
                },
                sign: {//储存签名数据
                    "name": "",          //用户名
                    "password": "",     //用户密码
                    "apiSmsUser": "",   //发送user
                    "apiSmsKey": "",        //发送key
                    "signs": ""  //签名
                }
            }

            //商家认证，对应滑动开关map
            $scope.certificationOpt = {active: 1, inactive: 0};
            //商家状态，对应滑动开关map
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
                        $scope.$broadcast("BusinessListCtrlflipupdateTotalcount", $scope.pagination.totalCount);
                    } else {
                        messenger.error(json.message);
                    }
                    !!callback && callback();
                })
            };

            $scope.getBusinessList();

            // 分页切换
            $scope.$on("BusinessListCtrlflip", function (e, pageIndex, callback) {//分页
                $scope.pagination.pageIndex = !!pageIndex ? pageIndex : $scope.pagination.pageIndex;
                $scope.opt.pageIndex = $scope.pagination.pageIndex;
                $scope.getBusinessList(callback);
            });

            //设置弹窗可拖动位置
            $(".checkBox").draggable({
                addClasses: false,
                handle: ".pop_top_tit",
                containment: ".modal-backdrop",
                drag: function (e, ui) {
                    var winH = $(window).height(),
                        T = $(ui)[0].position.top;
                    if (T < 0) {
                        $(ui)[0].position.top = 0;
                    }
                    $('.checkBox').css('overflow', 'hidden');
                },
                stop: function () {
                    $('.checkBox').css('height', 'auto');
                }
            });

            // 查询短信签名
            $scope.querySmsSign = function(cb){
                businessService.querySmsSign( $scope.prompt.user.secret, function (json) {
                    if (json.status == 0) {
                        $scope.prompt.sign = {
                            "name": json.data.name,          //用户名
                            "password": json.data.password,     //用户密码
                            "apiSmsUser": json.data.apiSmsUser,   //发送user
                            "apiSmsKey": json.data.apiSmsKey,        //发送key
                            "signs": json.data.sign
                        }
                        !!cb && cb();
                    } else {
                        messenger.error("操作失败:" + json.message);
                    }
                });
            }

            $scope.action = function (type, obj) {
                switch (type) {
                    case 'addBesiness'://添加用户
                        $location.search({ businessType: 1 });
                        $location.path("/project/add-business")
                        break;
                    case 'queryDetail'://查看详情
                        $location.search({ businessId: obj.businessId, businessType: 1, edit: true });
                        $location.path("/project/business-detail");
                        break;
                    case 'setStatus'://用户状态控制--启用/禁用
                        var opt = {
                            businessId: obj.businessId,
                            businessType: 1,
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
                        sessionStorage.setItem('user-id', obj.userId);
                        sessionStorage.setItem('user-name', obj.company);
                        $location.path("/project/member-popularize");
                        break;
                    case 'serSms'://短信
                        $location.search({ secretKey: obj.secret });
                        $location.path("/project/sms-list");
                        break;
                    case 'search':
                        $scope.pagination.pageIndex = 1;
                        $scope.opt.pageIndex = 1;
                        $scope.getBusinessList();
                        break;
                    case 'smsSign':
                        $scope.prompt.title = '编辑短信签名';
                        $scope.prompt.user = angular.copy(obj);
                        $scope.prompt.tpl = 'editsign';
                        $scope.querySmsSign(function () {
                            $('.checkBox').modal({ backdrop: 'static', keyboard: false });
                        })
                        break;
                    case 'modifyUserPhone':
                        $scope.prompt.title = '修改账号';
                        $scope.prompt.user = angular.copy(obj);
                        $scope.prompt.tpl = 'modifyUserPhone';
                        $scope.prompt.newPwd = '';
                        $('.checkBox').modal({ backdrop: 'static', keyboard: false });
                        break;
                    case 'viewActivities':
                        $location.search({ businessId: obj.businessId });
                        $location.path('/project/activity-list');
                        break;
                    case 'restPwd'://重置密码
                        messenger.confirm('你确定要重置密码吗？',function(tag){
                            if(tag){
                                var option = {
                                    userId: $scope.prompt.user.userId,
                                    phone: $scope.prompt.user.businessPhone
                                }
                                businessService.resetPwd(option, function (json) {
                                    if (json.status === 0) {
                                        $scope.prompt.newPwd = json.data.password;
                                    } else {
                                        messenger.error(json.message);
                                    }
                                })
                            }
                        })
                        break;
                    case 'certification': //商家认证
                        var opt = {
                            ids: [obj.businessId],
                            field: 'certification',
                            value: obj.certification
                        };
                        businessService.certification(opt, function (json) {
                            if (json.status == 0) {
                                $scope.getBusinessList();
                                messenger.success("操作成功");
                            } else {
                                messenger.error("操作失败:" + json.message);
                            }
                        });
                        break;
                }
            }


            var _btnCanClick = true;
            $scope.checkClick = function (type) {//确定操作
                switch (type) {
                    case 'editsign':
                        var _data = { secretKey: $scope.prompt.user.secret };  //用户secret
                        _data = $.extend(_data, $scope.prompt.sign);

                        if (!_data.name) {
                            messenger.error('sendcloud账号不能为空！');
                            return false;
                        }
                        if (!_data.password) {
                            messenger.error('sendcloud密码不能为空！');
                            return false;
                        }
                        if (!_data.apiSmsUser) {
                            messenger.error('短信发送user不能为空！');
                            return false;
                        }
                        if (!_data.apiSmsKey) {
                            messenger.error('短信发送key不能为空！');
                            return false;
                        }
                        if (!_data.signs) {
                            messenger.error('短信发送签名不能为空！');
                            return false;
                        } else if(!/^[a-z0-9A-Z\u4e00-\u9fa5]{3,6}$/.test(_data.signs)){
                            messenger.error('短信发送签名为3~6为的中、英文、数字！');
                            return false;
                        }

                        businessService.updateSmsSign(_data, function (json) {
                            if (json.status === 0) {
                                messenger.success('保存成功！');
                                $scope.done();
                            } else {
                                messenger.error(json.message);
                            }
                        })
                        break;
                    case 'modifyUserPhone':
                        if (!$scope.prompt.user.businessPhone) {
                            messenger.error('账号不能为空！');
                            return false;
                        } else if (!/^((13[0-9])|(14[57])|(15[^4,\D])|(18[0-9])|(17[0-9]))\d{8}$/.test($scope.prompt.user.businessPhone)) {
                            messenger.error('账号格式不正确！');
                            return false;
                        }
                        businessService.saveBusiness($scope.prompt.user, function (result) {
                            if (result.status == 0) {
                                messenger.success('修改成功！');
                                $scope.done();
                                $scope.getBusinessList();
                            } else {
                                messenger.error(result.message);
                            }
                        })
                        break;
                }
            }

            $rootScope.slideCallback = function(type, item){
                $scope.action(type, item);
            }
            //操作完成关闭弹窗
            $scope.done = function () {
                $('.checkBox').modal('hide');
                $scope.getBusinessList();
            }

        }]);
