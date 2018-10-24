'use strict';

/**
 * @ngdoc directive
 * @name managementApp.directive:checkBoxModal
 * @description
 * # checkBoxModal
 */
angular.module('managementApp')
	.directive('materialAddDire', ["$http", "$location", "$compile", 'messenger', '$timeout', 'materialListService',
		function ($http, $location, $compile, messenger, $timeout, materialListService) {
			return {
				templateUrl: "views/templates/directives/material-add-dire_tpl.html",//使用template指定的HTML标记替换指令内容
				restrict: 'E',//限定指令的应用场景
				replace: true,//是否完整替换指令dom对象
				scope: false,//隔离的作用域
				link: function postLink($scope, $element, attrs) {//指令操作dom函数

					/*************   弹出层相关DOM属性设置和事件绑定   ***************/
					$(".materialAddDire,.svg_modal_box").draggable({
						addClasses: false,
						handle: ".pop_top_tit",
						containment: "body",
						drag: function () {
							$('.materialAddDire').css('overflow', 'hidden');
						},
						stop: function () {
							$('.materialAddDire').css('height', 'auto');
						}
					});

					$scope.addFireTitle = '添加';
					//关闭弹窗
					$scope.closeDom = function (name) {
						if (name == 'materialAddDire') {
							//console.log('关闭弹窗');
							$scope.tpl_materialList = [];
						}
						$('.' + name).modal('hide');
					};

					//打开添加svg的弹窗
					$scope.svg_show = function (item) {
						//初始化SVG素材属性
						$scope.svgObjList = {
							source: {
								id: '未选择文件',
								downUrl: ''//下载路径:material/downloadmaterial
							},
							template: {
								id: '未选择文件',
								downUrl: ''//下载路径:material/downloadmaterial
							}
						};
						if (!!item) {
							$scope.editSvgData = item;
							$scope.materialRemark = angular.copy(item);
							$scope.svgObjList.source.id = item.mtrSourceName;
							$scope.svgObjList.source.downUrl = lanh.kpaasApiHost + "api/assets_service/v1/assets/download?asset=" + item.mtrSource.replace(/^http[s]?:\/\/[^\/]+\//i, "") + "&name=" + item.mtrSourceName;
							$scope.svgObjList.template.id = item.mtrTemplateName;
							$scope.svgObjList.template.downUrl = lanh.kpaasApiHost + "api/assets_service/v1/assets/download?asset=" + item.mtrTemplate.replace(/^http[s]?:\/\/[^\/]+\//i, "") + "&name=" + item.mtrTemplateName;
							$scope.editSvgData.type = 'edit';
							$scope.addFireTitle = '替换';
						} else {
							$scope.editSvgData = {
								type: 'add'
							};
							$scope.addFireTitle = '添加';
						}
						$('.svg_modal_box').modal('show');
					};

					$scope.showMateDom = function (item) {
						// $scope.thisMateType = 'img';
						if (!!item) {//模板素材弹窗逻辑
							$scope.materal_tpl = item;
							$scope.materialObj = {
								materialTypeId: 'tpl_materList'
							};
							$scope.getTplMateList();
						}
						$('.materialAddDire').modal('show');

					};
					/*************   弹出层相关DOM属性设置和事件绑定 END  ***************/


					/*************   当为模板素材的时候的业务处理操作  ***************/
					$scope.getTplMateList = function () {
						var opt = {
							templateId: $scope.materal_tpl.templateId,
							pageSize: 500,
							startCount: 0,
							materialType: $scope.thisMateType == 'img' ? 1 : 2
						};
						var array = [];
						if (!!opt) {
							for (var _key in opt) {
								array.push(_key + "=" + encodeURIComponent(opt[_key]));
							}
							opt = "?" + array.join("&");
						}
						materialListService.getMaterialList(opt, function (json) {
							if (json.code == 0) {
								var list = json.data.list;
								for (var i = 0; i < list.length; i++) {
									switch (list[i].materialType) {
										case 1:
											list[i]['materialTypeName'] = 'img';
											break;
										case 2:
											list[i]['materialTypeName'] = 'svg';
											break;
										case 3:
											list[i]['materialTypeName'] = '组合';
											break;
									}
								}
								$scope.tpl_materialList = list;
							}
						});
					};

					//模板素材列表中删除素材按钮事件
					$scope.delMaterial = function (item) {
						$('.del_material_box').fadeIn(200);
						$('.del_material_box_bg').fadeIn(200);
						$scope.delMaterialData = [item.materialId];
					};
					//关闭删除确认弹窗
					$scope.deloffFn = function () {
						$('.del_material_box').fadeOut(200);
						$('.del_material_box_bg').fadeOut(200);
					};
					//删除素材操作确认
					$scope.delOneSureFn = function () {
						var opt = {
							ids: $scope.delMaterialData
						};
						materialListService.deleteMaterial(opt, function (json) {
							if (json.code == 0) {
								messenger.success('删除成功');
								$scope.getTplMateList();
								$scope.deloffFn();
								$('.del_material_box').modal('hide');
							} else {
								messenger.error('操作失败:' + json.desc);
							}
						});
					};
					/*************   当为模板素材的时候的业务处理操作 ＥＮＤ  ***************/

					$scope.thisMateType = 'img';
					//选择类型
					$scope.addMateType = function (type) {
						$scope.thisMateType = type;
						if ($scope.materialObj.materialTypeId == 'tpl_materList') {
							$scope.getTplMateList();
						}
					};
					$scope.AddMateData = '';
					$scope.addMateBtn = function (type) {
						$scope.thisMateType = type;
					};


					//上传图片
					$element.find("input[name=img]").change(function () {
						var $this = $(this);
						var This = this;
						var formData = new FormData($this.parent()[0]);
						var len = This.files.length;
						if (len > 10) {
							messenger.info('单次上传不能超过10张图片');
							return;
						}
						for (var i = 0; i < len; i++) {
							if (This.files.item(i).size > 3 * 1024 * 1024) {
								messenger.info('图片大小不超过3M哦');
								$this.val("");
								return;
							}
						}
						$scope.uploadtype = true;
						$scope.schedule_btxt = '上传中...';
						if ($scope.materialObj.materialTypeId != false) {//false为素材库
							if ($scope.materialObj.materialTypeId == 'tpl_materList') {//tpl_materList是模板素材,添加模板ID
								formData.append('manuscriptId', $scope.materal_tpl.templateId);
								formData.append('terminalType', '');
							} else {//否则是分类素材
								formData.append('terminalType', $scope.materialObj.terminal_type);
								formData.append('materialId', $scope.materialObj.materialTypeId);
							}
						} else {
							formData.append('terminalType', $scope.materialObj.terminal_type);
						}
						formData.append('type', " ");

						var xhr = new XMLHttpRequest();


						//上传中设置上传的百分比
						xhr.upload.addEventListener("progress", function (evt) {
							if (evt.lengthComputable) {
								var percentComplete = Math.round(evt.loaded * 100 / evt.total);
								$(".schedule_box .schedule").css({ 'width': percentComplete + '%' });
							} else {
								console.log('无法计算');
							}
						}, false);
						//请求error
						xhr.addEventListener("error", function () {
							messenger.info('图片上传失败');
						}, false);
						//请求中断
						xhr.addEventListener("abort", function () {
							console.log('上传已由用户或浏览器取消删除连接');
						}, false);
						//发送请求
						xhr.open("POST", lanh.materialHost + 'userImg/upload', true);
						xhr.setRequestHeader('ClientType', 'backmanagesys');
						xhr.setRequestHeader('SessionId', sessionStorage.getItem("session_id"));
						xhr.send(formData);
						xhr.onreadystatechange = function (callback) {
							if (xhr.readyState == 4) {
								if (xhr.status == 200) {
									var responseText = xhr.responseText;
									var json = $.parseJSON(responseText);
									if (json.code == 0) {
										if ($scope.materialObj.materialTypeId == 'tpl_materList') {
											messenger.success('图片上传成功');
											$this.val('');
											$scope.getTplMateList();
										} else {
											messenger.success('图片上传成功');
											$scope.schedule_btxt = '上传完成';
											$this.val('');
											$scope.getImgMaterialList();
											$timeout(function () {
												$scope.uploadtype = false;
											}, 1500);
										}

									} else {
										messenger.error('图片上传失败：' + json.desc);
									}
								} else {
									messenger.error('图片上传失败：后台无响应');
									//console.log("HTTP的响应码：" + xhr.status + ",响应码的文本信息：" + xhr.statusText);
								}
							}
						}
					});

					//上传svg 素材
					$element.find("input[name=fileName]").change(function () {
						var $this = $(this);
						var This = this;
						var formData = new FormData($this.parent()[0]);
						console.log(formData);
						var len = 0;
						try {
							len = This.files.length;
						} catch (e) {
							len = 0;
						}
						if (len <= 0) {
							return;
						}
						//if (len > 10) {
						//    messenger.info('单次上传不能超过10张svg');
						//    return;
						//}
						if (len > 1) {
							messenger.info('单次上传不能超过1张svg');
							return;
						}
						for (var i = 0; i < len; i++) {
							if (This.files.item(i).size > 3 * 1024 * 1024) {
								messenger.info('svg大小不超过3M哦');
								$this.val("");
								return;
							}
						}
						$scope.uploadtype = true;
						$scope.schedule_btxt = '上传中...';
						//if ($scope.materialObj.materialTypeId != false) {//false为素材库
						//    if ($scope.materialObj.materialTypeId == 'tpl_materList') {//tpl_materList是模板素材,添加模板ID
						//        formData.append('manuscriptId', $scope.materal_tpl.templateId);
						//    } else {//否则是分类素材
						//        formData.append('materialTypeId', $scope.materialObj.materialTypeId);
						//    }
						//}
						//if ($this.data('type') == 0) {
						//    if ($scope.svgObjList.template.id != '未选择文件') {
						//        formData.append('materialId', $scope.svgObjList.template.id);
						//    }
						//}
						//if ($this.data('type') == 1) {
						//    formData.append('materialId', ($scope.svgObjList.source.id == '未选择文件' ? '' : $scope.svgObjList.source.id));
						//}

						//if ($scope.editSvgData.type == 'edit') {   //素材库编辑svg素材
						//    formData.append('materialId', $scope.editSvgData.materialId);
						//    formData.append('type', $this.data('type'));
						//} else {
						//    formData.append('materialTypeId', $scope.searchOptions.materialCategoryId);
						//    formData.append('type', $this.data('type'));
						//}
						var xhr = new XMLHttpRequest();
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
										messenger.success('svg上传成功');
										$scope.schedule_btxt = '上传完成';
										// $scope.getImgMaterialList();
										$this.val('');
										$scope.$apply(function () {
											if ($this.data('type') == 0) {//源文件
												$scope.svgObjList.source.id = json.data[0].title;
												$scope.svgObjList.source.downUrl = lanh.kpaasApiHost + "api/assets_service/v1/assets/download?asset=" + json.data[0].file + "&name=" + json.data[0].title;
												$scope.svgObjList.source.file = json.data[0].file
											}
											else if ($this.data('type') == 1) {//模板文件
												$scope.svgObjList.template.id = json.data[0].title;
												$scope.svgObjList.template.downUrl = lanh.kpaasApiHost + "api/assets_service/v1/assets/download?asset=" + json.data[0].file + "&name=" + json.data[0].title;
												$scope.svgObjList.template.file = json.data[0].file
											}
										});
										//$timeout(function(){
										//  $scope.uploadtype = false;
										//},1500);
									} else {
										messenger.error('svg上传失败：' + json.desc);
									}
								} else {
									messenger.error('svg上传失败：后台无响应');
									//console.log("HTTP的响应码：" + xhr.status + ",响应码的文本信息：" + xhr.statusText);
								}
							}
						}
					});

					//确定保存SVG素材

					$scope.svgEditSure = function () {
						if ($scope.svgObjList.source.id == undefined && $scope.editSvgData.materialId == undefined) {
							messenger.error('svg保存失败：未上传SVG源文件或数据读取失败');
							return;
						}
						var opt = '';
						if ($scope.editSvgData.type == 'edit') {
							opt = 'materialId=' + $scope.editSvgData.materialId;
						} else {
							opt = 'materialId=' + ($scope.svgObjList.source.id == '未选择文件' ? '' : $scope.svgObjList.source.id);
						}

						if ($scope.editSvgData.type == 'edit') {
							var opt = {
								mtrId: $scope.pageControl.currentItem.mtrId,
								mtrRemark: $scope.pageControl.mtrRemark,
								mtrSource: $scope.svgObjList.source.file,
								mtrTemplate: $scope.svgObjList.template.file,
								mtrSourceName: $scope.svgObjList.source.id,
								mtrTemplateName: $scope.svgObjList.template.id
							};
							$scope.updateMaterial(opt)
						} else {
							var _data = {
								mtrSource: $scope.svgObjList.source.file,
								mtrTemplate: $scope.svgObjList.template.file,
								mtrSourceName: $scope.svgObjList.source.id,
								mtrTemplateName: $scope.svgObjList.template.id,
								mtrClass: $scope.materialCategoryKey,
								mtrType: $scope.materialType
							}

							$scope.addMaterial(_data);
						}
						$('.svg_modal_box').modal('hide');
						//materialListService.saveSvgData(opt, function (json) {
						//    if (json.code == 0) {
						//        $('.svg_modal_box').modal('hide');
						//        if ($scope.editSvgData.type == 'edit') {
						//            $scope.checkClick('remark');
						//        } else if ($scope.materialObj.materialTypeId == 'tpl_materList') {
						//            messenger.success('svg保存成功');
						//            $scope.getTplMateList();
						//        } else {
						//            messenger.success('svg保存成功');
						//            $scope.getImgMaterialList();
						//        }
						//    } else {
						//        messenger.error('svg保存失败：' + json.desc);
						//    }
						//})
					};
				}
			};

		}]);
