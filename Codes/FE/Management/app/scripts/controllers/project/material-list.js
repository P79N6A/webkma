'use strict';

/**
 * @ngdoc function
 * @name managementApp.controller:MaterialListCtrl
 * @description
 * # MaterialListCtrl
 * Controller of the managementApp
 */
angular.module('managementApp')
  .controller('MaterialListCtrl', ["$scope", "materialListService", "messenger", "userListService", "$location", "$timeout", "tagListService",
    function ($scope, materialListService, messenger, userListService, $location, $timeout, tagListService) {
        this.awesomeThings = [
          'HTML5 Boilerplate',
          'AngularJS',
          'Karma'
        ];

        $scope.materialCategoryKey = "";//controls_shape形状；controls_image图片；controls_background背景；controls_text文本
        if (!!$location.search().key) {
            $scope.materialCategoryKey = $location.search().key;
        } else {
            $scope.materialCategoryKey = "controls_shape";
        }
        switch ($scope.materialCategoryKey) {
            case "controls_shape":
            case "controls_text":
                $scope.materialType = "svg"
                break;
            case "controls_image":
            case "background":
                $scope.materialType = "img"
                break;
        }


        //定义整体素材库公共数据,指令中调用   所有必须属性数据条件
        $scope.materialObj = {
            //terminal_type: 1,    //终端类型  1：PC端；2：移动端
            terminal_type: 2,    //终端类型  1：PC端；2：移动端
            materialTypeId: false       //素材类型
        };
        $scope.pageControl = {
            operatingType: 'addTag', //操作
            checkAll: false,//全选
            currentItem: {},//当前操作项
            electedMaterialIds: [],//选中的素材id
            data: [],//图片素材数据
            tags: [],//所有标签
            editTag: [],//编辑时的标签
            selectedTag: [],//选中的标签
            promptTitle: '选择标签类型',
            removeTipText: '确定删除这条数据',
            remark: ''//备注
        }
        //分页
        $scope.pagination = {
            pageSize: 10,
            startCount: 0,
            pageIndex: 1,
            totalCount: 0
        };

        //搜索条件
        $scope.searchOptions = {
            order: "desc",
            terminalType: 2,
            materialCategoryId: '',
            materialId: '',
            keys: '',
            startTime: {	//可空，不为空时则筛选结果的创建时间将会大于等于该值
                value: "",
                opened: false,
                options: {}
            },
            endTime: {       //可空，不为空时则筛选结果的创建时间将会小于该值
                value: "",
                opened: false,
                options: {}
            }
        };

        $scope.tabClick = function (item) {
            $location.search({ key: item.classKey })
            //debugger
            $(".materialContentDiv").remove()
            //debugger
        }

        //获取素材分类
        $scope.Categray = function () {
            var opt = {
                startCount: 0,
                pageSize: 500
            };
            var array = [];
            if (!!opt) {
                for (var _key in opt) {
                    array.push(_key + "=" + encodeURIComponent(opt[_key]));
                }
                opt = "?" + array.join("&");
            }
            materialListService.getMaterialClassList(opt, function (result) {
                if (result.status == 0) {
                    $scope.crumData = result.data.list;
                    //$.each(result.data.list,function(index,item){
                    //    if(item.key == 'controls_image'){
                    //        $scope.searchOptions.materialCategoryId = item.material_id;
                    //    }
                    //});
                    $scope.getMaterialList();//获取素材列表
                    $scope.getMaterialTagList();//获取素材标签
                } else {
                    messenger.error('获取分类列表失败:' + result.message);
                }
            });
        };
        $scope.Categray();

        //获取素材列表
        $scope.getMaterialList = function (callback) {
            var options = {
                mtrClass: $scope.materialCategoryKey,
                sort: $scope.searchOptions.order,
                mtrId: $scope.searchOptions.keys,
                pageIndex: $scope.pagination.pageIndex,
                pageSize: $scope.pagination.pageSize,
                startTime: !!window.lanh && !!window.lanh.utils ? window.lanh.utils.dateString($scope.searchOptions.startTime.value) : '',
                endTime: !!window.lanh && !!window.lanh.utils ? window.lanh.utils.dateString($scope.searchOptions.endTime.value) : ''
            };
            var array = [];
            if (!!options) {
                for (var _key in options) {
                    array.push(_key + "=" + encodeURIComponent(options[_key]));
                }
                options = "?" + array.join("&");
            }
            materialListService.getMaterialList(options, function (json) {
                if (json.status === 0) {
                    $scope.pagination.totalCount = json.data.total;
                    $scope.pageControl.checkAll = false;
                    //$.each(json.data.list,function(index,item){
                    //    item.materialTypeName = '图片';
                    //    item.active = false;
                    //});
                    $scope.pageControl.data = json.data.list;
                    $scope.$broadcast("MaterialImageflipupdateTotalcount", $scope.pagination.totalCount);
                } else {
                    messenger.error('获取素材列表失败:' + json.message);
                }
                !!callback && callback();
            });
        };

        // 分页切换
        $scope.$on("MaterialImageflip", function (e, pageIndex, callback) {//所在地选取
            $scope.pagination.pageIndex = !!pageIndex ? pageIndex : $scope.pagination.pageIndex;
            var str_count = (parseInt($scope.pagination.pageIndex) - 1) * $scope.pagination.pageSize;
            $scope.pagination.startCount = str_count;
            $scope.getMaterialList(callback);
        });


        //获取素材标签
        $scope.getMaterialTagList = function () {
            tagListService.getList({}, function (result) {
                $scope.pageControl.tags = result;
            });
        }

        //按条件搜索素材
        $scope.materialSearch = function () {
            $scope.searchForm = true;
            $scope.pagination.startCount = 0;
            $scope.pagination.pageIndex = 1;
            $scope.getMaterialList();
        };
        //清空条件
        $scope.materialClearSearch = function () {
            $scope.searchForm = false;
            $scope.pagination.pageIndex = 1;
            $scope.pagination.startCount = 0;
            $scope.searchOptions.startTime.options = '';
            $scope.searchOptions.startTime.value = '';
            $scope.searchOptions.endTime.value = '';
            $scope.searchOptions.endTime.options = '';
            $scope.searchOptions.keys = '';
            $scope.getMaterialList();
        };
        /*----------------------------------弹窗设置----start--------------------------------------*/
        //设置弹窗可拖动位置
        $(".checkBox").draggable({
            addClasses: false,
            handle: ".pop_top_tit",
            containment: "body",
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
        //操作完成关闭弹窗
        $scope.done = function () {
            $('.checkBox').modal('hide');
        };
        /*----------------------------------弹窗设置----end--------------------------------------*/
        /*----------------------------------弹窗业务逻辑------------------------------------------*/
        $scope.action = function (operatingType, item) {
            switch (operatingType) {
                case 'checkSingle'://单选
                    item.active = !item.active;
                    var _array = $.grep($scope.pageControl.data, function (n) { return n.active == true; });
                    if (_array.length == $scope.pageControl.data.length) {
                        $scope.pageControl.checkAll = true;
                    } else {
                        $scope.pageControl.checkAll = false;
                    }
                    break;
                case 'checkAll'://全选
                    if ($scope.pageControl.checkAll == false) {
                        $scope.pageControl.checkAll = true;
                        $.each($scope.pageControl.data, function (index1, item1) {
                            item1.active = true;
                        });
                    } else {
                        $scope.pageControl.checkAll = false;
                        $.each($scope.pageControl.data, function (index1, item1) {
                            item1.active = false;
                        });
                    }
                    break;
                case 'addTag'://添加标签
                    $scope.pageControl.promptTitle = '选择标签类型';
                    $scope.pageControl.operatingType = 'addTag';
                    $.each($scope.pageControl.tags, function (index1, item1) { item1.active = false; });
                    var _array = _getSelectedMaterialIds();
                    if (_array.length == 0) {
                        messenger.info('请选择要添加标签的素材！');
                        return false;
                    };
                    $(".checkBox").modal('show');
                    break;
                case 'batchRemove'://批量删除
                    $scope.pageControl.removeTipText = '确定删除选中的数据';
                    $scope.pageControl.promptTitle = '素材删除';
                    $scope.pageControl.operatingType = 'batchRemove';
                    if (_getSelectedMaterialIds().length == 0) {
                        messenger.info('请选择要删除的素材！');
                        return false;
                    }
                    $(".checkBox").modal('show');
                    break;
                case 'editTag'://编辑标签
                    $scope.pageControl.promptTitle = '选择标签类型';
                    $scope.pageControl.operatingType = 'editTag';
                    $scope.pageControl.currentItem = item;
                    //合并标签并去重
                    var _array = [];
                    $.each(item.tags, function (index3, item3) {
                        var _array1 = $.grep($scope.pageControl.tags, function (n) { return n.tagName == item3.name });
                        if (_array1.length == 0) {
                            _array.push({ name: item3.name });
                        }
                    })
                    $scope.pageControl.editTag = $scope.pageControl.tags.concat(_array);

                    $.each($scope.pageControl.editTag, function (index1, item1) {
                        item1.active = false;
                        $.each(item.tags, function (index2, item2) {
                            if (item1.name == item2.tagName) {
                                item1.active = true;
                            }
                        });
                    });
                    $(".checkBox").modal('show');
                    break;
                case 'replace'://替换素材
                    $scope.pageControl.currentItem = item;
                    if ($scope.materialType == "svg") {
                        //debugger
                        $scope.svg_show(item);
                    } else {
                        bindFn('edit');
                    }
                    break;
                case 'removeSingle'://删除单个素材
                    $scope.pageControl.removeTipText = '确定删除这条数据';
                    $scope.pageControl.promptTitle = '素材删除';
                    $scope.pageControl.operatingType = 'removeSingle';
                    $scope.pageControl.currentItem = item;
                    $(".checkBox").modal('show');
                    break;
                case 'checkTag'://选择标签
                    item.active = !item.active;
                    break;
                case 'remark'://备注
                    $scope.pageControl.promptTitle = '编辑备注';
                    $scope.pageControl.operatingType = 'remark';
                    $scope.pageControl.currentItem = item;
                    $scope.pageControl.mtrRemark = item.mtrRemark;
                    $('.checkBox').modal('show');
                    break;
            }
        }

        //获取选中的素材id集合
        var _getSelectedMaterialIds = function () {
            var _array = [];
            $.each($scope.pageControl.data, function (index, item) {
                if (item.active) {
                    _array.push(item.mtrId);
                }
            });
            return _array;
        }

        //获取选中的标签集合
        var _getSelectedTags = function (edit) {
            var _array = [];
            if (!!edit) {
                $.each($scope.pageControl.editTag, function (index, item) {
                    if (item.active) {
                        _array.push(item.id);
                    }
                });
            } else {
                $.each($scope.pageControl.tags, function (index, item) {
                    if (item.active) {
                        _array.push(item.id);
                    }
                });
            }
            return _array;
        }

        $scope.checkClick = function (type) {
            switch (type) {
                case 'editTag':
                    if ($scope.pageControl.operatingType == 'addTag') {//添加
                        var _data = {
                            relationId: _getSelectedMaterialIds().toString(),
                            tagId: _getSelectedTags().toString()
                        };
                        tagListService.relateTag(_data, function (result) {
                            if (result.status == 0) {
                                messenger.success('添加标签成功！');
                            } else {
                                messenger.error('添加标签失败:' + result.message);
                            }
                            $scope.done();
                            $scope.pageControl.checkAll = false;
                            $scope.getMaterialList();
                        });
                    } else {//编辑标签
                        var _data = {
                            relationId: [$scope.pageControl.currentItem.mtrId].toString(),
                            tagId: _getSelectedTags('edit').toString()
                        };
                        tagListService.resetTag(_data, function (result) {
                            if (result.status == 0) {
                                messenger.success('编辑标签成功！');
                            } else {
                                messenger.error('编辑标签失败:' + result.message);
                            }
                            $scope.done();
                            $scope.pageControl.checkAll = false;
                            $scope.getMaterialList();
                        });
                    }
                    break;
                case 'remove':
                    if ($scope.pageControl.operatingType == 'batchRemove') {
                        var _data = {
                            mtrIds: _getSelectedMaterialIds()
                        }
                    } else {
                        var _data = {
                            mtrIds: [$scope.pageControl.currentItem.mtrId]
                        }
                    }
                    materialListService.deleteMaterial(_data, function (result) {
                        if (result.status == 0) {
                            messenger.success('素材删除成功！');
                        } else {
                            messenger.error('素材删除失败:' + result.message);
                        }
                        $scope.done();
                        $scope.pageControl.checkAll = false;
                        $scope.getMaterialList();
                    });
                    break;
                case 'remark'://备注
                    var opt = {
                        mtrId: $scope.pageControl.currentItem.mtrId,
                        mtrRemark: $scope.pageControl.mtrRemark
                    };

                    if (opt.mtrRemark == null || !opt.mtrRemark) {
                        messenger.error('请输入备注内容');
                        break;
                    }
                    materialListService.updateMaterial(opt, function (json) {
                        if (json.status == 0) {
                            messenger.success('编辑成功');
                            $scope.getMaterialList();
                            $scope.pageControl.checkAll = false;
                            $scope.done();
                        } else {
                            messenger.error('编辑失败:' + json.message);
                        }
                    });
                    break;
            }
        }
        /*----------------------------------弹窗业务逻辑----end--------------------------------------*/

        //清空条件
        $scope.materialClearSearch = function () {
            $scope.searchForm = false;
            $scope.pagination.pageIndex = 1;
            $scope.pagination.startCount = 0;
            $scope.searchOptions.startTime.value = '';
            $scope.searchOptions.startTime.options = '';
            $scope.searchOptions.endTime.value = '';
            $scope.searchOptions.endTime.options = '';
            $scope.searchOptions.keys = '';
            $scope.getMaterialList();
        };

        //上传图片
        function bindFn(add, obj) {
            //debugger
            var _obj = !!obj ? $(obj) : $('.terminalDataList').find("input[name=fileName]");
            _obj.off('change').on('change', function () {
                var $this = $(this);
                var This = this;
                var formData = new FormData($this.parent()[0]);
                var len = This.files.length;
                if (!!obj && len > 10) {
                    messenger.info('单次上传不能超过10张图片');
                    return;
                }
                if (!obj && len > 1) {
                    messenger.info('单次上传不能超过1张图片');
                    return;
                }
                for (var i = 0; i < len; i++) {
                    if (This.files.item(i).size > 3 * 1024 * 1024) {
                        messenger.info('图片大小不超过3M哦');
                        $this.val("");
                        return;
                    }
                }
                //formData.append('imgId', !!$scope.pageControl.currentItem.materialId ? $scope.pageControl.currentItem.materialId : '');
                //formData.append('materialId', $scope.searchOptions.materialCategoryId);

                var xhr = new XMLHttpRequest();

                //请求error
                xhr.addEventListener("error", function () {
                    messenger.info('图片上传失败');
                }, false);
                //请求中断
                xhr.addEventListener("abort", function () {
                    console.log('上传已由用户或浏览器取消删除连接');
                }, false);
                //发送请求
                xhr.open("POST", lanh.kpaasApiHost + 'api/assets_service/v1/assets/upload?secret_key=' + lanh.secret_key, true);
                xhr.setRequestHeader('SessionId', sessionStorage.getItem("session_id"));
                xhr.send(formData);
                xhr.onreadystatechange = function (callback) {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) {
                            var responseText = xhr.responseText;
                            var json = $.parseJSON(responseText);
                            if (json.status === 0) {
                                $this.val('');
                                if (add == "add") {
                                    var _list = [];
                                    $.each(json.data, function (index, item) {
                                        var _data = {
                                            mtrSource: item.file,
                                            mtrSourceName: item.title,
                                            mtrTemplate: "",
                                            mtrClass: $scope.materialCategoryKey,
                                            mtrRemark: "",
                                            mtrType: $scope.materialType
                                        }
                                        _list.push(_data)
                                    })

                                    $scope.addMaterial(_list);
                                }
                                else {
                                    var _data = {
                                        mtrId: $scope.pageControl.currentItem.mtrId,
                                        mtrSource: json.data[0].file,
                                        mtrSourceName: json.data[0].title
                                    }
                                    $scope.updateMaterial(_data);
                                }
                            } else {
                                messenger.error('图片上传失败：' + json.message);
                            }
                        } else {
                            messenger.error('图片上传失败：后台无响应');
                        }
                    }
                }
            });
        }

        bindFn('add', $('#addMaterialInput'));

        //添加素材（保存数据）
        $scope.addMaterial = function (_data) {
            materialListService.saveMaterail(_data, function (result) {
                if (result.status == 0) {
                    messenger.success('添加素材成功！');
                } else {
                    messenger.error('添加素材失败:' + result.message);
                }
                $scope.getMaterialList();
            });
        }

        //编辑素材（保存数据）
        $scope.updateMaterial = function (_data) {
            materialListService.updateMaterial(_data, function (json) {
                if (json.status == 0) {
                    messenger.success('替换成功');
                } else {
                    messenger.error('替换失败:' + json.message);
                }
                $scope.getMaterialList();
            });
        }
    }]);
