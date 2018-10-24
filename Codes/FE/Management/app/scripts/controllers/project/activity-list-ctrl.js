/**
 * @ngdoc function
 * @name managementApp.controller:AddBusinessCtrl
 * @description
 * # AddBusinessCtrl
 * Controller of the managementApp
 */

angular.module('managementApp')
    .controller('ActivityListCtrl', ['$rootScope', '$scope', '$timeout', 'messenger', '$location', 'activitiyService',
        function ($rootScope, $scope, $timeout, messenger, $location, activitiyService) {
            $scope.pageControl = {
                data: [],
                search: '',
                businessId: $location.search()['businessId'] || '',
                orderBy: [{'createTime': 'desc'}],
                totalShare: '', //按分享数排序
                totalVisitor: '', //按访客数排序
                totalAccess: '' //按访问数排序
            }

            $scope.pagination = {
                pageIndex: 1,
                pageSize: 10,
                total: 0
            }
            //活动禁用，对应滑动开关map
            $scope.stateOpt = {active: 1, inactive: 0};
            //推荐，对应滑动开关map
            $scope.recommendOpt = {active: 1, inactive: 0};

            function getActivitiyList(callback) {
                var query = {
                    pageIndex: $scope.pagination.pageIndex,
                    pageSize: $scope.pagination.pageSize,
                    nameSearch: $scope.pageControl.search,
                    businessId: $scope.pageControl.businessId,
                    orderBy: $scope.pageControl.orderBy
                };
                activitiyService.getActivitiyList(query, function (data) {
                    $scope.pageControl.data = data.list;
                    $scope.pagination.total = data.total;
                    callback && callback();
                });
            }

            // 分页切换
            $scope.$on("BusinessListCtrlflip", function (e, pageIndex, callback) {//所在地选取
                $scope.pagination.pageIndex = pageIndex || $scope.pagination.pageIndex;
                getActivitiyList(callback);
            });
            //初始加载数据
            getActivitiyList();
            
            $scope.searchActivities = function () {
                $scope.pagination.pageIndex = 1;
                getActivitiyList();
            }
            //推荐
            $scope.recommend = function (data) {
                var rec= {
                    id: data.id,
                    recommend: data.recommend
                };
                activitiyService.recommendActivitiy(rec, function (res) {
                    if (res.status === 0) {
                        messenger.success('操作成功！');
                        getActivitiyList();
                    } else {
                        messenger.error(res.message);
                    }
                });
            }

            //禁用、启用
            $scope.enableHandler = function (data) {
                activitiyService.enable({
                    id: data.id,
                    enable: data.enable
                }, function (res) {
                    if (res.status === 0) {
                        messenger.success('操作成功！');
                        getActivitiyList();
                    } else {
                        messenger.error(res.message);
                    }
                });
            }

            // 预览
            $scope.preview = function (data) {
                var url = data.url;
                // if (!/http[s]?:\/\//i.test(url)) url = 'http://' + url;
                let previewUrl = lanh.previewHost+ encodeURIComponent( url);
                console.log('previewHost:'+previewUrl);
                // window.open(previewUrl);
                lanh.utils.createPreviewWindow(data.url,data.id);
            }

            //活动作品添加排序值
            $scope.addSortNum = function(data, event){
                if(!!event && event.keyCode != 13){
                    data.sort = data.sort.replace(/\D/g,'');
                    return false;
                } 
                var rec= {
                    id: data.id,
                    sort: data.sort
                };
                if(!/^\d{1,}$/.test(rec.sort)){
                    messenger.error('请输入0~1000之间的数字！');
                    return false;
                }else if(rec.sort > 1000 || rec.sort < 0){
                    messenger.error('请输入0~1000之间的数字！');
                    return false;
                } 
                activitiyService.sort(rec, function (res) {
                    if (res.status === 0) {
                        messenger.success('操作成功！');
                        getActivitiyList();
                    } else {
                        messenger.error(res.message);
                    }
                });
            }

            //slide开关响应方法
            $rootScope.slideCallback = function(type, item){
                $scope[type](item);
            }

            // 按累计分享数、累计访客数、累计访问数排序
            $scope.orderBy = function(key, value) {
                $scope.pageControl[key] = value;
                $scope.pageControl.orderBy = $.grep($scope.pageControl.orderBy, function(n){ return Object.keys(n)[0] != key; });
                
                var obj = {};
                obj[key] = value;
                $scope.pageControl.orderBy.push(obj);
                getActivitiyList();
            }
        }]);
