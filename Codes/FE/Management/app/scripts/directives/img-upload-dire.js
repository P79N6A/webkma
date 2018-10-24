'use strict';

/**
 * @ngdoc directive
 * @name managementApp.directive:imgPreviewDire
 * @description
 * # imgPreviewDire
 */
angular.module('managementApp')
	.directive('imgUploadDire', ["$http", "$location", "$timeout", "$compile", "menuInfoService", "messenger",
		function ($http, $location, $timeout, $compile, menuInfoService, messenger) {
			var uploadId = 0;
			return {
				restrict: 'EA',//限定指令的应用场景
				replace: false,//是否完整替换指令dom对象
				scope: {
					multiple: "@multiple",
					model: "=model",
					imageType: "@imageType",
					fileSize: "@fileSize"
				},//隔离的作用域
				link: function postLink($scope, $element, attrs) {//指令操作dom函数
					var multiple = attrs.multiple === 'true';
					var id = 'upload-dire-' + (++uploadId);
					var _template = '\
				<label for="'+ id + '" style="opacity: 0;position: absolute;top: 0;right: 0;bottom: 0;left: 0;display: block;width: 100%;height: 100%;z-index:9; background: rgba(0,0,0,0) ;  "> \
					<input id="'+ id + '" style="display: block;width:0;height:0;" type="file" ' + (!!multiple ? "multiple=\"multiple\"" : "") + ' accept="image/*" /> \
				</label>';
					var $html = $(_template);
					var imageTypes = (attrs.imageType || '').toLowerCase();
					var fileSize = 10 * 1024 * 1024;
					var mt = String(attrs.fileSize).match(/^([\d\.]+)([^\d\.]*)$/i);
					var sizeBit = '10M';
					if (!!mt) {
						var bit = mt[2].toLowerCase();
						if (bit === 'm' || bit === 'mb') {
							fileSize = mt[1] * 1024 * 1024;
							sizeBit = mt[0];
						} else if (bit === 'kb' || bit === 'k') {
							fileSize = mt[1] * 1024;
							sizeBit = mt[0];
						}
					}
					$html.on('change', function (e) {
						var files = e.target.files,
							len = files.length;
						if (len<=0){
							return messenger.error('未选择任何文件');
						}
							var fd = new FormData();
						for (var i = 0; i < len; i++) {
							var file = files[i];
							if (!!imageTypes && imageTypes.indexOf(file.type.replace('image/', ''))<0) {
								return messenger.error('只支持 ' + imageTypes + ' 等格式文件');
							}
							if (fileSize >= 0 && fileSize < file.size) {
								return messenger.error('文件大小不能超过 ' + sizeBit);
							}
							fd.append(id, file, file.name)
						}
						$http({
							method: "POST",
							url: lanh.assets_upload,
							headers: { 'Content-Type': undefined },
							data: fd
						}).success(function (res) {
							if (!res || res.status !== 0) {
								return messenger.error('上传失败');
							}
							if (!!multiple) {
								$scope.model = res.data.map(function(f){return  f.file});
							} else {
								$scope.model = res.data[0].file;
							}

						}).error(function () {
							messenger.error('上传失败');
						});

					})
					$element.append($html);
				}
			};
		}]);
