'use strict';

/**
 * @ngdoc function
 * @name managementApp.controller:MaterialListCtrl
 * @description
 * # MaterialListCtrl
 * Controller of the managementApp
 */
angular.module('managementApp')
  .controller('MaterialBackgroundCtrl', ["$scope", "materialListService", "messenger","userListService","$location","$timeout",
    function ($scope, materialListService, messenger,userListService,$location,$timeout) {
      this.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
      ];
      //定义整体素材库公共数据,指令中调用   所有必须属性数据条件
      $scope.materialObj = {
        //terminal_type: 1,    //终端类型  1：PC端；2：移动端
        terminal_type: 2,    //终端类型  1：PC端；2：移动端
        materialTypeId: false       //素材类型
      };
      $scope.pageControl = {
        operatingType: 'addTag', //操作
        checkAll: false,//全选
        currentItem:{},//当前操作项
        electedMaterialIds:[],//选中的素材id
        data:[],//图片素材数据
        tags:[],//所有标签
        editTag:[],//编辑时的标签
        selectedTag:[],//选中的标签
        promptTitle:'选择标签类型',
        removeTipText:'确定删除这条数据',
        remark:''//备注
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
        startTime: {  //可空，不为空时则筛选结果的创建时间将会大于等于该值
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

      //获取素材分类
      $scope.Categray = function () {
        var opt = {
          terminalType: $scope.searchOptions.terminalType,//终端类型
          materialName: "",//素材类型名称
          startCount: 0,
          pageSize: 500
        };
        if ($scope.searchOptions.terminalType == '') {
          return;
        }
        var array = [];
        if (!!opt) {
          for (var _key in opt) {
            array.push(_key + "=" + encodeURIComponent(opt[_key]));
          }
          opt = "?" + array.join("&");
        }
        materialListService.getMaterialClassList(opt, function (result) {
          if (result.code == 0) {
            $.each(result.data.list,function(index,item){
                if(item.key == 'background_special'){
                    $scope.searchOptions.materialCategoryId = item.material_id;
                }
            });
            $scope.getImgMaterialList();//获取图片素材列表
            $scope.getMaterialTagList();//获取图片标签
          }else {
            messenger.error('获取分类列表失败:' + result.desc);
          }
        });
      };
      $scope.Categray();

      //获取素材列表
      $scope.getImgMaterialList = function (callback) {
        var options = {
          terminalType: $scope.searchOptions.terminalType,
          sort: $scope.searchOptions.order,
          materialId: $scope.searchOptions.keys,
          materialCategoryId: $scope.searchOptions.materialCategoryId,
          startCount: $scope.pagination.startCount,
          pageSize: $scope.pagination.pageSize,
          startDate: !!window.lanh && !!window.lanh.utils ? window.lanh.utils.dateString($scope.searchOptions.startTime.value):'',
          endDate: !!window.lanh && !!window.lanh.utils ? window.lanh.utils.dateString($scope.searchOptions.endTime.value):''
        };
        var array = [];
        if (!!options) {
          for (var _key in options) {
            array.push(_key + "=" + encodeURIComponent(options[_key]));
          }
          options = "?" + array.join("&");
        }
        materialListService.getMaterialList(options, function (json) {
          if (json.code === 0) {
            $scope.pagination.totalCount = json.data.totalCount;
            $scope.$broadcast("MaterialBackgroundflipupdateTotalcount",$scope.pagination.totalCount);
            $scope.pageControl.checkAll = false;
            $.each(json.data.list,function(index,item){
                item.materialTypeName = '图片';
                item.active = false;
            });
            $scope.pageControl.data = json.data.list;
            setTimeout(function(){
              bindFn('add',$('#addMaterialInput'));
              bindFn();
            },1000);
          } else {
            messenger.error('获取背景素材列表失败:' + json.desc);
          }
          !!callback && callback();
        });
      };

      // 分页切换
      $scope.$on("MaterialBackgroundflip",function(e,pageIndex,callback){//所在地选取
          $scope.pagination.pageIndex = !!pageIndex ? pageIndex : $scope.pagination.pageIndex;
          var str_count = (parseInt($scope.pagination.pageIndex) - 1) * $scope.pagination.pageSize;
          $scope.pagination.startCount = str_count;
          $scope.getImgMaterialList(callback);
      });

      $scope.getMaterialTagList = function(){
          var _data = {
              orderMode: '',//排序方式,quoteAsc引用数升序,quoteDesc引用数降序，可空
              tagName: '',//标签名称，不超过5个字，可空
              tagType: '9',//标签类别，1:模板 ,2:H5,3:短信,4:邮件，5客户 6文本 7图片 8形态 9背景  如果为null 或者 为 0则查询全部标签
              startCount: 0,//开始条数，不可空
              pageSize: 1000,//取用条数，不可空
              isSelection: true,//是否精选，为null则不筛选此条件，true/false，可空
              isCurrentUser: false//不可空，true则需要前台用户登录，查询系统标签及当前用户标签，false则仅查询系统标签
          };
          materialListService.getMaterialTagList(_data,function(result){
              if(result.code == 0){
                  $.each(result.data.list,function(index,item){
                      item.active = false;
                  });
                  $scope.pageControl.tags = result.data.list;
              }else{
                  messenger.error('获取标签失败:' + result.desc);
              }
          })
      }

      //按条件搜索素材
      $scope.materialSearch = function () {
        $scope.searchForm = true;
        $scope.pagination.startCount = 0;
        $scope.pagination.pageIndex = 1;
        $scope.getImgMaterialList();
      };
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
        $scope.getImgMaterialList();
      };
      /*----------------------------------弹窗设置----start--------------------------------------*/
      //设置弹窗可拖动位置
      $(".checkBox").draggable({
        addClasses: false,
        handle: ".pop_top_tit",
        containment: "body",
        drag: function (e,ui) {
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
      $scope.action = function(operatingType,item){
          switch(operatingType){
              case 'checkSingle'://单选
                  item.active = !item.active;
                  var _array = $.grep($scope.pageControl.data,function(n){return n.active == true;});
                  if(_array.length == $scope.pageControl.data.length){
                      $scope.pageControl.checkAll = true;
                  }else{
                      $scope.pageControl.checkAll = false;
                  }
                  break;
              case 'checkAll'://全选
                  if($scope.pageControl.checkAll == false){
                      $scope.pageControl.checkAll = true;
                      $.each($scope.pageControl.data,function(index1,item1){
                          item1.active = true;
                      });
                  }else{
                      $scope.pageControl.checkAll = false;
                      $.each($scope.pageControl.data,function(index1,item1){
                          item1.active = false;
                      });
                  }
                  break;
              case 'addTag'://添加标签
                  $scope.pageControl.promptTitle = '选择标签类型';
                  $scope.pageControl.operatingType = 'addTag';
                  $.each($scope.pageControl.tags,function(index1,item1){item1.active = false;});
                  var _array = _getSelectedMaterialIds();
                  if (_array.length == 0) {
                      messenger.info('请选择要添加标签的素材！');
                      return false;
                  };
                  $(".checkBox").modal('show');
                  break;
              case 'addImgMaterial'://添加素材
                  break;
              case 'batchRemove'://批量删除
                  $scope.pageControl.removeTipText = '确定删除选中的数据';
                  $scope.pageControl.promptTitle = '素材删除';
                  $scope.pageControl.operatingType = 'batchRemove';
                  if(_getSelectedMaterialIds().length == 0){
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
                  $.each(item.tags,function(index3,item3){
                      var _array1 = $.grep($scope.pageControl.tags,function(n){return n.tagName == item3});
                      if(_array1.length == 0){
                          _array.push({tagName:item3});
                      }
                  })
                  $scope.pageControl.editTag = $scope.pageControl.tags.concat(_array);
                  $.each($scope.pageControl.editTag,function(index1,item1){
                      item1.active = false;
                      $.each(item.tags,function(index2,item2){
                          if(item1.tagName == item2){
                              item1.active = true;
                          }
                      });
                  });
                  $(".checkBox").modal('show');
                  break;
              case 'replace'://替换素材
                  $scope.pageControl.currentItem = item;
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
                  $scope.pageControl.operatingType = 'remark';
                  $scope.pageControl.currentItem = item;
                  $scope.pageControl.remark = item.remark;
                  $('.checkBox').modal('show');
                  break;
          }
      }

      //获取选中的素材id集合
      var _getSelectedMaterialIds = function(){
          var _array = [];
          $.each($scope.pageControl.data,function(index,item){
              if(item.active){
                  _array.push(item.materialId);
              }
          });
          return _array;
      }

       //获取选中的标签集合
      var _getSelectedTags = function(edit){
          var _array = [];
          if(!!edit){
              $.each($scope.pageControl.editTag,function(index,item){
                  if(item.active){
                      _array.push(item.tagName);
                  }
              });
          }else{
              $.each($scope.pageControl.tags,function(index,item){
                  if(item.active){
                      _array.push(item.tagName);
                  }
              });
          }
          return _array;
      }


      $scope.checkClick = function(type){
          switch(type){
              case 'editTag':
                  if($scope.pageControl.operatingType == 'addTag'){//添加
                      var _data = {
                          materialIds: _getSelectedMaterialIds(),
                          tags: _getSelectedTags()
                      };
                  }else{//编辑标签
                      var _data = {
                          materialIds: [$scope.pageControl.currentItem.materialId],
                          tags: _getSelectedTags('edit')
                      };
                  }
                  materialListService.editMaterailTag(_data,function(result){
                      if(result.code == 0){
                          messenger.success('添加标签成功！');
                      }else{
                          messenger.error('添加标签失败:' + result.desc);
                      }
                      $scope.done();
                      $scope.pageControl.checkAll = false;
                      $scope.getImgMaterialList();
                  });
                  break;
              case 'remove':
                  if($scope.pageControl.operatingType == 'batchRemove'){
                      var _data = {
                          ids: _getSelectedMaterialIds()
                      }
                  }else{
                      var _data = {
                          ids: [$scope.pageControl.currentItem.materialId]
                      }
                  }
                  materialListService.deleteMaterial(_data,function(result){
                      if(result.code == 0){
                          messenger.success('素材删除成功！');
                      }else{
                          messenger.error('素材删除失败:' + result.desc);
                      }
                      $scope.done();
                      $scope.pageControl.checkAll = false;
                      $scope.getImgMaterialList();
                  });
                  break;
              case 'remark'://备注
                  var opt = {
                      materialId:$scope.pageControl.currentItem.materialId,
                      remark:$scope.pageControl.remark
                  };
                  materialListService.setRemarkSave(opt, function (json) {
                      if (json.code == 0) {
                          messenger.success('编辑成功');
                          $scope.getImgMaterialList();
                          $scope.pageControl.checkAll = false;
                          $scope.done();
                      } else {
                          messenger.error('编辑失败:' + json.desc);
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
        $scope.getImgMaterialList();
      };

      //上传图片
      function bindFn(add,obj){
        var _obj = !!obj ? $(obj): $('.terminalDataList').find("input[name=img]");
        _obj.unbind('change').bind('change',function () {
          var $this = $(this);
          var This = this;
          var formData = new FormData($this.parent()[0]);
          var len = This.files.length;
          if(len > 10){
            messenger.info('单次上传不能超过10张图片');
            return;
          }
          for(var i = 0;i < len;i++){
            if (This.files.item(i).size > 3 * 1024 * 1024) {
              messenger.info('图片大小不超过3M哦');
              $this.val("");
              return;
            }
          }
          formData.append('imgId', !!$scope.pageControl.currentItem.materialId?$scope.pageControl.currentItem.materialId:'');
          formData.append('materialId',  $scope.searchOptions.materialCategoryId);

          var xhr = new XMLHttpRequest();

          //请求error
          xhr.addEventListener("error", function(){
            messenger.info('图片上传失败');
          }, false);
          //请求中断
          xhr.addEventListener("abort",  function(){
            console.log('上传已由用户或浏览器取消删除连接');
          }, false);
          //发送请求
          xhr.open("POST", lanh.materialHost + 'userImg/upload',true);
          xhr.setRequestHeader('ClientType','backmanagesys');
          xhr.setRequestHeader('SessionId',sessionStorage.getItem("session_id"));
          xhr.send(formData);
          xhr.onreadystatechange=function(callback){
            if(xhr.readyState==4){
              if(xhr.status==200){
                var responseText = xhr.responseText;
                var json = $.parseJSON(responseText);
                if(json.code === 0){
                  messenger.success('图片上传成功');
                  $this.val('');
                  $scope.getImgMaterialList();
                }else {
                  messenger.error('图片上传失败：'+json.desc);
                }
              } else {
                messenger.error('图片上传失败：后台无响应');
              }
            }
          }
        });
      }


    }]);
