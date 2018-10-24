'use strict';

/**
 * @ngdoc function
 * @name managementApp.controller:MaterialTagCtrl
 * @description
 * # MaterialTagCtrl
 * Controller of the managementApp
 */
angular.module('managementApp')
    .controller('MaterialTagCtrl', ['$scope', '$location', 'tagListService', 'messenger', function ($scope, $location, tagListService, messenger) {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];


        $scope.addTag = {
            name: "",
            type: "material"
        };


        $scope.deleteTag = {
            id: 0
        };
        //$scope.selectedTag = {
        //    tagIds: [],
        //    isSelection: false
        //};
        $scope.searchTag = {
            sortby: "",
            search: "",
            sequence: ""
        };

        $scope.sortEnable = true;

        $scope.sortTag = [];

        //新增标签
        $scope.btnAdd = function () {
            if (!$scope.addTag.name) { messenger.error("请输入新的标签名称"); return false; }
            tagListService.addTag($scope.addTag, function (result, status) {
                if (result.status == 0) {
                    messenger.success("添加成功");
                    $scope.addTag.name = '';
                    $scope.getData();
                } else {
                    messenger.error(result.message);
                }
            });
        };

        //删除标签
        $scope.btnDelete = function (tagObj) {
            $scope.deleteTag.id = tagObj.id;
            messenger.confirm("删除标签后不可恢复，确认删除？", function (confirm) {
                if (confirm == true) {
                    tagListService.deleteTag($scope.deleteTag, function (result, status) {
                        if (result.status == 0) {
                            messenger.success("删除成功");
                            $scope.getData();
                        } else {
                            messenger.error("删除失败");
                        }
                    });
                }
            }, $scope);
        };


        //排序搜索
        $scope.btnSearchOrderby = function () {
            $scope.getData();
        }

        //标题搜索
        $scope.btnSearchName = function () {
            $scope.getData();
        }

        //排序
        $scope.btnSort = function () {
            $(".js-btn-sort").hide();
            $(".js-btn-submit").show();
            $(".js-btn-cancel").show();
            $("#sortable .js-sort-css").attr("style", "cursor:all-scroll;border: 1px #36c6d3 dotted;margin-bottom: 20px;");
            $("#sortable .js-btn-action").hide();
            $('#sortable').sortable({
                update: function (event, ui) {
                    $scope.$apply(function () {
                        $scope.sortTag = $('#sortable').sortable('toArray');
                    });
                }
            });
        };
        //保存排序
        $scope.btnSubmit = function () {
            var opt = [];
            var list = $scope.sortTag;
            for (var i = 0; i < list.length; i++) {
                var obj = {
                    id: list[i],
                    sort: list.length - i
                };
                opt.push(obj);
            }
            if (opt.length == 0) return $scope.off();
            tagListService.tagOrder({ data: opt }, function (json) {
                console.log(json);
                if (json.status == 0) {
                    messenger.success("操作成功");
                    $scope.off();
                    $scope.getData();
                } else {
                    messenger.error("操作失败");
                }
            });
        };

        //排序取消
        $scope.btnCancel = function () {
            $scope.off();
            $scope.getData();
        };

        $scope.off = function () {
            $(".js-btn-sort").show();
            $(".js-btn-submit").hide();
            $(".js-btn-cancel").hide();
            try {
                $('#sortable').sortable('destroy');
            } catch (e) {
                $('#sortable');
            }
        };


        var _filterOptions = function () {
            var options = {};
            if (!!$scope.searchTag.sequence) {
                $scope.searchTag.sortby = "total"
            } else {
                $scope.searchTag.sortby = ""
            }
            $.extend(options, $scope.searchTag);
            return angular.copy(options);
        };

        $scope.getData = function () {
            var opts = _filterOptions();
            tagListService.getList(opts, function (result) {
                $scope.data = result;
                $scope.sortEnable = !opts.search
            });
            $scope.sortTag = [];
            $scope.off();
        };

        $scope.getData();

    }]);
