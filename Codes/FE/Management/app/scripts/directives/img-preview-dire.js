'use strict';

/**
 * @ngdoc directive
 * @name managementApp.directive:imgPreviewDire
 * @description
 * # imgPreviewDire
 */
angular.module('managementApp')
    .directive('imgPreviewDire', ["$http", "$location", "$timeout","$compile", "menuInfoService",
	  function ($http, $location, $timeout,$compile, menuInfoService) {
		return {
		    //templateUrl: "views/templates/directives/material-add-dire_tpl.html",//使用template指定的HTML标记替换指令内容
		    restrict: 'A',//限定指令的应用场景
		    replace: false,//是否完整替换指令dom对象
		    scope: {
			  data: "@imgPreviewDire"
		    },//隔离的作用域
		    link: function postLink($scope, $element, attrs) {//指令操作dom函数
			  var _template = '\
				<div id="{{$id}}" class="modal" tabindex="-1" role="dialog">\
				<div class="modal-dialog" role="document" style="margin-top: 80px;">\
				<div class="modal-content">\
				<div class="img-preview">\
				<i>×</i>\
			  	<img ng-src="{{ data }}"/>\
				</div>\
				</div>\
				</div>\
				</div>';

			  var html = ($compile (_template) ($scope));
			  $element.on("click", function (e) {
				$scope.$apply(function() {//监听数据的变化进行实时对view更新
				    $("body").append (html);
				    var box = $ ("#" + $scope.$id);
				    $ (box).modal ('show');
				    $(box).on('click','.img-preview>i',function (){
					  $(box).modal ('hide');
				    });
				    $ (box).on('hidden.bs.modal', function () {
					  $ (box).remove();
				    });
				});
			  })
		    }
		};
	  }]);
