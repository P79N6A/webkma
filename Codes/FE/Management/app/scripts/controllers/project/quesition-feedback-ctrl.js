'use strict';
/**
 * @ngdoc function
 * @name managementApp.controller:FeedbackCtrl
 * @description
 * # FeedbackCtrl
 * Controller of the managementApp
 */

angular.module('managementApp')
  .controller('FeedbackCtrl', ['$scope', 'feedbackService', 'messenger','$location','$route','$timeout',
    function ($scope, feedbackService, messenger,$location,$route,$timeout) {
      $scope.pagination = {
          pageIndex:1,
          startCount:0,
          pageSize:10,
          totalCount:0
      };
      
      $scope.key_word = '';
      $scope.prompt = {
          currentItem:'',
          content:''
      }

      $scope.data = [];
      //获取反馈列表
      $scope.getFeedbackList = function (callback){
        // 数据组装
        var param = {
            key_word : $scope.key_word,
            pageSize : $scope.pagination.pageSize,
            pageIndex: $scope.pagination.pageIndex
        };

        feedbackService.getFeedbackList( param , function(json){
          if(json.status === 0){
            var data  = json.data;           
            $scope.data = data.list||[];
            $scope.pagination.totalCount = data.total;
            $scope.pagination.pageIndex = data.pageIndex;
            $scope.pagination.pageSize = data.pageSize;
            $scope.$broadcast("FeedbackflipupdateTotalcount",$scope.pagination.totalCount);  
          }else {
            messenger.error(json.message);
          }
          !!callback && callback();
        })
      };

      $scope.getFeedbackList();

      // 分页切换
      $scope.$on("Feedbackflip",function(e,pageIndex,callback){//所在地选取
          $scope.pagination.pageIndex = !!pageIndex ? pageIndex : $scope.pagination.pageIndex;
          var str_count = (parseInt($scope.pagination.pageIndex) - 1) * $scope.pagination.pageSize;
          $scope.pagination.startCount = str_count;
          $scope.getFeedbackList(callback);
      });

      $scope.search = function(){
          $scope.pagination.pageIndex = 1;
          $scope.getFeedbackList();
      }  

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
        $scope.prompt = {
            currentItem:'',
            content:''
        }
        $scope.getFeedbackList();
      };
      /*----------------------------------弹窗设置----end--------------------------------------*/
      /*----------------------------------弹窗业务逻辑------------------------------------------*/
      $scope.queryContent = function (item){//查看反馈内容详情
          $scope.prompt.currentItem = item;
          feedbackService.loadFeedbackDetail( item.id , function(json){
              if(json.code === 0){
                $('#feedback-box').html(json.data.content);
                $(".checkBox").modal('show');
              }else {
                messenger.error(json.desc);
              }
          })
      }
    }]);
