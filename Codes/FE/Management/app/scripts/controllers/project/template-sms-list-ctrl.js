/**
 * @ngdoc function
 * @name managementApp.controller:TemplateListCtrl
 * @description
 * # TemplateListCtrl
 * Controller of the managementApp
 */

angular.module('managementApp')
    .controller('TemplateSmsListCtrl', ['$scope', 'messenger', '$location', 'templateService', 'businessService', 'smsService',
        function ($scope, messenger, $location, templateService, businessService, smsService) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
            $scope.tempList = [];//模板列表
            $scope.business = { //商家信息
                list: [],//商家信息列表，在type==special的情况下
                type: 0,//0-公用 1-专用
                distribution: 0, //分配情况 1已分配， 0-未分配的（type=0时不生效）
                smsId: '',//模板id
                selectAll: false,//是否为全选状态
                pageIndex: 1,//商家列表页码
                pageSize: 5,//商家列表每一页显示几条数据
                more: false,//信息列表是否有下一页
            }
            //弹窗数据
            $scope.prompt = {
                title: '模板分发',
                tpl: 'handout'
            };
            //搜索关键字
            $scope.searchKeyword = {
                module: '',//模板列表关键字
                business: '',//商家列表关键字
            };
            //模板信息的分页
            $scope.pagination = {
                pageSize: 8,
                pageIndex: 1,
                totalCount: 0
            };

            //添加编辑短信模板
            $scope.addData = {
                name: "",
                content: "",
                id: ""
            }

            $scope.businessIds = [];//选中商家的id
            //获取模板列表
            $scope.getTempList = function (callback) {
                var obj = {
                    pageIndex: $scope.pagination.pageIndex,
                    pageSize: $scope.pagination.pageSize,
                    searchStr: $scope.searchKeyword.module,
                }
                smsService.getTemplateSmsList(obj, function (res) {
                    if (res.status == 0) {
                        _.each(res.data.list, function (item) {
                            item.createTime = window.lanh.utils.dateString(item.createTime);
                        })
                        $scope.tempList = res.data.list;
                        $scope.pagination.totalCount = res.data.total;
                        $scope.$broadcast("TemplateListCtrlflipupdateTotalcount", $scope.pagination.totalCount);
                    } else {
                        messenger.error(res.message);
                    }
                    !!callback && callback();
                })
            };
            //获取商家列表
            $scope.getBusinessList = function (callback) {
                var obj = {
                    businessType: 1,//商家/设计师 类型 1商家 2设计师 空 全部
                    businesskeyword: $scope.searchKeyword.business,//商家/设计师查询关键词
                    smsId: $scope.business.smsId,//短信模板idid 选填
                    distribution: $scope.business.distribution,//过滤分配情况 1 只显示已分配的， 0 只显示未分配的，不传显示所有
                    pageIndex: $scope.business.pageIndex,//页码
                    pageSize: $scope.business.pageSize,//页面大小
                }
                businessService.getBusinessList(obj, function (res) {
                    if (res.status == 0) {
                        if (res.data.data.length > 0) {
                            $.each(res.data.data, function (index, item) {
                                item.checked = 0;
                                $scope.business.list.push(item);
                            })
                        }
                        $scope.business.more = (parseInt($scope.business.pageIndex) * parseInt($scope.business.pageSize) < parseInt(res.data.total) ? true : false)
                    } else {
                        messenger.error(res.message);
                    }
                    !!callback && callback();
                })
            }

            //初始化模板列表信息
            $scope.getTempList();
            //点击事件
            $scope.action = function (type, data) {
                switch (type) {
                    case "add":
                        $('.checkBox').modal({ backdrop: 'static', keyboard: false });
                        $scope.prompt.title = "添加短信模板";
                        $scope.prompt.tpl = "add";
                        break;
                    case "edit":
                        $('.checkBox').modal({ backdrop: 'static', keyboard: false });
                        $scope.prompt.title = "编辑短信模板";
                        $scope.prompt.tpl = "add";
                        $scope.addData = {
                            name: data.name,
                            content: data.content,
                            id: data.id
                        }
                        break;
                    case "search"://点击搜索模板
                        $scope.pagination.pageIndex = 1;
                        $scope.getTempList();
                        break;
                    case "preview"://点击预览
                        break;
                    case "handout"://点击分发
                        $('.checkBox').modal({ backdrop: 'static', keyboard: false });
                        $scope.prompt.title = "模板分发";
                        $scope.prompt.tpl = "handout";
                        $scope.business.smsId = data.id;
                        $scope.business.type = data.type;
                        if (data.type == 1) {
                            $scope.business.list = [];
                            $scope.business.distribution = 0;
                            $scope.business.selectAll = false;
                            $scope.business.pageIndex = 1
                            $scope.business.more = false;
                            $scope.searchKeyword.business = '';
                            $scope.getBusinessList($scope.scrollRegister);
                        }
                        break;
                    case "del"://点击删除
                        $('.checkBox').modal({ backdrop: 'static', keyboard: false });
                        $scope.prompt.title = "删除模板";
                        $scope.prompt.tpl = "del";
                        $scope.prompt.delId = data;
                        break;
                    case "selectDis"://选择模板类型
                        if ($scope.business.type == 1) {
                            $scope.business.list = [];
                            $scope.business.distribution = 0;
                            $scope.business.selectAll = false;
                            $scope.business.pageIndex = 1
                            $scope.business.more = false;
                            $scope.searchKeyword.business = '';
                            $scope.getBusinessList($scope.scrollRegister);
                        }
                        break;
                    case "selcetCheckBox"://选择商家
                        $scope.business.list[data].checked = ($scope.business.list[data].checked == 1 ? 0 : 1);
                        $scope.business.selectAll = isSelectAll();
                        break;
                    case "selcetCheckBoxAll"://点击全部选中
                        $.each($scope.business.list, function (index, item) {
                            if (!$scope.business.selectAll && item.checked == 0) {
                                item.checked = 1;
                            }
                            if ($scope.business.selectAll && item.checked == 1) {
                                item.checked = 0;
                            }
                        })
                        $scope.business.selectAll = $scope.business.selectAll ? false : true;
                        isSelectAll();
                        break;
                    case "selectSpecialType"://专用属性选择分发和撤销分发
                        $scope.business.distribution = data;
                        $scope.business.list = [];
                        $scope.business.selectAll = false;
                        $scope.business.pageIndex = 1
                        $scope.business.more = false;
                        $scope.searchKeyword.business = '';
                        $scope.getBusinessList();
                        break;
                    case "handoutBusiness"://分发弹框点击确认
                        templateService.handoutSmsTemplate({
                            smsId: $scope.business.smsId,
                            type: $scope.business.distribution == 0 ? 1 : 0,
                            businessId: $scope.businessIds,
                            distribution: $scope.business.type
                        }, function (res) {
                            if (res.status == 0) {
                                $scope.done();
                                messenger.success(($scope.business.distribution == 0 ? '分发' : '撤销分发') + '成功!');
                                $scope.getTempList();
                            } else {
                                messenger.error(($scope.business.distribution == 0 ? '分发' : '撤销分发') + '失败!<br>' + res.message);
                            }
                        })
                        break;
                    case "searchBusiness"://点击搜索商家
                        $scope.business.pageIndex = 1;
                        $scope.business.list = [];
                        $scope.business.more = false;
                        $scope.business.selectAll = false;
                        $scope.getBusinessList();
                        break;

                }
            }

            $scope.scrollRegister = function () {
                /*绑定滚动事件*/
                $("#case_wrap").scroll(function () {
                    if ($scope.business.more) {
                        $scope.business.pageIndex++;
                        $scope.getBusinessList(function () {
                            $scope.business.selectAll = isSelectAll();
                        });
                    }
                })
            }
            // 分页切换
            $scope.$on("TemplateListCtrlflip", function (e, pageIndex, callback) {//分页
                $scope.pagination.pageIndex = !!pageIndex ? pageIndex : $scope.pagination.pageIndex;
                $scope.getTempList(callback);
            });
            //操作完成关闭弹窗
            $scope.done = function () {
                $('.checkBox').modal('hide');
            }
            //判断是否全部选中
            function isSelectAll() {
                var selectLen = 0;
                $scope.businessIds = [];
                $.each($scope.business.list, function (index, item) {
                    if (item.checked == 1) {
                        selectLen++;
                        $scope.businessIds.push(item.businessId);
                    }
                })
                return (selectLen == $scope.business.list.length ? true : false)
            }
            //点击删除模板点击确认按钮
            $scope.delTemplate = function () {
                smsService.delSmsTemplate({ "id": $scope.prompt.delId }, function (res) {
                    if (res.status == 0) {
                        messenger.success('已删除成功！');
                        $scope.done();
                        $scope.pagination.pageIndex = 1;
                        $scope.getTempList();
                    } else {
                        messenger.error(res.message);
                    }
                })
            }

            //点击保存短信模板点击确认按钮
            $scope.addTemplate = function () {
                if ($scope.addData.name.length==0) {
                    messenger.error("请输入1-20个字符的模板名称！");
                    return;
                }
                if ($scope.addData.content.length == 0) {
                    messenger.error("请输入1-300个字符的短信内容！");
                    return;
                }
                smsService.saveSmsTemplate($scope.addData, function (res) {
                    if (res.status == 0) {
                        messenger.success('保存到短信模板成功！');
                        $scope.addData = {
                            name: "",
                            content: "",
                            id: ""
                        }
                        $scope.done();
                        $scope.pagination.pageIndex = 1;
                        $scope.getTempList();
                    } else {
                        messenger.error(res.message);
                    }
                })
            }
        }]);
