'use strict';

/**
 * @ngdoc function
 * @name managementApp.controller:SysConfigCtrl
 * @description
 * # TagListCtrl
 * Controller of the managementApp
 */
angular.module('managementApp')
  .controller('SysConfigCtrl', ["$scope", "sysConfigService","messenger",
      function ($scope, sysConfigService, messenger) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];

          //頁面數據
          $scope.data = [
            {
                "id": '',
                "sys_key": "app_id",
                "sys_value": "",
                "describe": "app_id",
                "type": 1,
                "config_id_type": "syswx",
                "isDelete": 0
            },
            {
                "id": '',
                "sys_key": "app_secret",
                "sys_value": "",
                "describe": "app_secret",
                "type": 1,
                "config_id_type": "syswx",
                "isDelete": 0
            }
          ]

          //獲取配置
          $scope.getSysConfig = function(){
            sysConfigService.getConfig(function( result ){
              if( result.length > 0 ){
                $scope.data = result;
              }
            })
          }
          $scope.getSysConfig();
          
          //保存小程序配置
          $scope.saveSetting = function(){
            sysConfigService.saveConfig($scope.data, function( result ){
              if(result.status == 0){
                messenger.success('保存成功!');
                $scope.getSysConfig();
              }
            })
          }

      }]);
