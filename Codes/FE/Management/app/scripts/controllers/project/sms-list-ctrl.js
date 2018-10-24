/**
 * @ngdoc function
 * @name managementApp.controller:AddBusinessCtrl
 * @description
 * # AddBusinessCtrl
 * Controller of the managementApp
 */

angular.module('managementApp')
    .controller('SmsListCtrl', ['$scope', '$timeout', 'messenger', '$location', 'smsService',
        function ($scope, $timeout, messenger, $location, smsService) {
            $scope.pageControl = {
                data: [],
                search: '',
                secretKey: $location.search()['secretKey'] || ''
            }

            if(!!$scope.pageControl.secretKey)
            $scope.$root.$emit('reloadLeftMenu', 'activity_management', 1);

            $scope.pagination = {
                pageIndex: 1,
                pageSize: 10,
                total: 0
            }
            function getActivitiyList(callback) {
                var query = {
                    pageIndex: $scope.pagination.pageIndex,
                    pageSize: $scope.pagination.pageSize,
                    identity: "back",
                    secretKey: $scope.pageControl.secretKey,
                    searchStr: $scope.pageControl.search,
                    status: 4
                };
                smsService.getSmsList(query, function (data) {
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
            $scope.recommend = function (data) {
                var rec = {
                    id: data.id,
                    recommend: data.recommend == 1 ? 0 : 1
                };
                activitiyService.recommendActivitiy(rec, function (res) {
                    if (res.status === 0) {
                        $timeout(function () {
                            data.recommend = rec.recommend;
                        })
                    } else {
                        messenger.error(res.message);
                    }
                });
            }
            $scope.enableHandler = function (data) {
                var enable = data.enable === 0 ? 1 : 0;
                activitiyService.enable({
                    id: data.id,
                    enable: enable
                }, function (res) {
                    if (res.status === 0) {
                        $timeout(function () {
                            data.enable = enable;
                        })
                    } else {
                        messenger.error(res.message);
                    }
                });
            }
            $scope.preview = function (data) {
                var url = data.url;
                if (url.indexOf('http://') <= -1) {
                    url = 'http://' + url;
                }
                window.open(url);
            }
        }]);
