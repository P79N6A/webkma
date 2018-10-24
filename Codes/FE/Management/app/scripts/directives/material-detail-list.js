'use strict';

/**
 * @ngdoc directive
 * @name managementApp.directive:materialDetailList
 * @description
 * # materialDetailList
 */
angular.module('managementApp')
    .directive('materialDetailList', ["$http", "$location","$compile", "materialListService",'messenger','$timeout',
	  function ($http, $location,$compile, materialListService,messenger,$timeout) {
		return {
		    templateUrl: "views/templates/directives/material-detail_tpl.html",//使用template指定的HTML标记替换指令内容
		    restrict: 'EA',//限定指令的应用场景
		    replace: true,//是否完整替换指令dom对象
		    scope: false,//隔离的作用域
		    link: function postLink($scope, $element, attrs) {//指令操作dom函数
          $scope.paginationDetail = {//分页
            pageSize: 18,
            startCount: 0,
            pageIndex: 1,
            totalCount: 0
          };
          $scope.getDetailList = function (){
            $scope.option = {
              orderType: 1,//排序方式 1:最近 2：最远 Integer
              imgName: '',//图片名称   String
              startCount: $scope.paginationDetail.startCount,//开始条数 不可为null   Integer
              pageSize: $scope.paginationDetail.pageSize ,//取用条数 不可为null  Integer
              materialId: $scope.materialObj.material_id // 素材类型 如果为空 则为用户素材 如果不为空 则为公共素材  Integer
            };
            var array = [];
            if (!!$scope.option) {
              for (var _key in $scope.option) {
                array.push(_key + "=" + encodeURIComponent($scope.option[_key]));
              }
              $scope.option = "?" + array.join("&");
            }
            materialListService.getMaterialDetailList($scope.option,function(json){
              if(json.code === 0){
                if(json.data.totalCount > 0){
                  $.each(json.data.list, function (i, item) {
                    item["isActive"] = false;
                  });
                  $scope.paginationDetail.totalCount = json.data.totalCount;
                }
                $scope.imgList = json.data.list;
                $scope.isEdit = false;
                $scope.romoveTit = '批量删除';
              }else{
                messenger.error('获取失败:'+json.desc);
              }
            });
          };

          $scope.backingOut = function (){
            $scope.type = 'list';
            $scope.getData();
          };
          //分页
          $scope.flipPageDetail = function () {
            var str_count = (parseInt($scope.paginationDetail.pageIndex) - 1) * $scope.paginationDetail.pageSize;
            $scope.paginationDetail.startCount = str_count;
            $scope.getDetailList();
          };
          //批量管理
          $scope.manamgeImg = function () {
            $scope.isEdit = !$scope.isEdit;
            if(!$scope.isEdit){
              $scope.chooseImg(false);
              $scope.romoveTit = '批量删除';
            }else {
              $scope.romoveTit = '退出管理';
            }
          };

          //批量管理-选择图片
          $scope.chooseImg = function (item) {
            if ($scope.isEdit) {
              item.isActive = !item.isActive;
            }
            if (!$scope.isEdit) {
              $.each($scope.imgList, function (i, itemData) {
                itemData.isActive = false;
              });
              //item.isActive = true;
            }
          };

          //删除图片操作
          $scope.deleteImage = {
            Data: []
          };
          $scope.removeImgList = function(){
            $.each($scope.imgList, function (i, itemData) {
              if (itemData.isActive) {
                $scope.deleteImage.Data.push({ "imgId": itemData.imgId });
              }
            });
            if ($scope.deleteImage.Data.length == 0) {
              messenger.info('请选择删除的图片');
              return;
            }
            materialListService.deleteImg($scope.deleteImage, function (result, status) {
              if (result.code == 0) {
                messenger.success('删除成功');
                $scope.getDetailList();
                $scope.deleteImage.Data = [];
              } else {
                messenger.info('删除失败');
              }
            });
          };

          //上传图片
          $element.find("input[name=img]").change(function () {
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
            $scope.uploadtype = true;
            $scope.schedule_btxt = '上传中...';
            formData.append('materialId', $scope.materialObj.material_id);
            formData.append('terminalType', $scope.materialObj.terminal_type);
            var xhr = new XMLHttpRequest();


            //上传中设置上传的百分比
            xhr.upload.addEventListener("progress", function(evt){
              if (evt.lengthComputable) {
                var percentComplete = Math.round(evt.loaded * 100 / evt.total);
                $(".schedule_box .schedule").css({'width': percentComplete+'%'});
              }else {
                console.log('无法计算');
              }
            }, false);
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
                    $this.val("");
                    $scope.schedule_btxt = '上传完成';
                    $scope.getDetailList();
                    $timeout(function(){
                      $scope.uploadtype = false;
                    },1500);
                  }else {
                    messenger.error('图片上传失败：'+json.desc);
                  }
                } else {
                  messenger.error('图片上传失败：后台无相应');
                  //console.log("HTTP的响应码：" + xhr.status + ",响应码的文本信息：" + xhr.statusText);
                }
              }
            }
          });
        }
		};
	  }]);
