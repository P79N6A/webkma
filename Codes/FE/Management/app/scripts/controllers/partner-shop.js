'use strict';

/**
 * @ngdoc function
 * @name managementApp.controller:PartnerShopCtrl
 * @description
 * # PartnerShopCtrl
 * Controller of the managementApp
 */
angular.module('managementApp')
  .controller('PartnerShopCtrl', ["$scope", "$location", "partnerService",
      function ($scope, $location, partnerService) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];

          $scope.tpl_status = {
              access: ""    //页面访问权限
          }

          //兼容
          $(window).trigger('resize');

          //--------- 验证KEY的有效性 ---------
          //return $scope.tpl_status.access = "valid";   //test

          var key = $location.search().key;
          if (!!key) {
              partnerService.validBackendShopUrl({ key: key }, function (result) {
                  $scope.tpl_status.access = result.message == "success" && result.data ? "valid" : "invalid";
              });
          } else {
              $scope.tpl_status.access = "error";
          }
      }
  ]);
