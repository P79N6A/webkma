'use strict';

/**
 * @ngdoc service
 * @name managementApp.collectiontradeService
 * @description
 * # collectiontradeService
 * Service in the managementApp.
 */
angular.module('managementApp')
  .service('collectiontradeService', ["$http", function ($http) {
      var self = this;
      //获取采集的行业列表
      self.getTradeList = function (options, callback) {
        $http.get(lanh.apiHost + 'collectiontype/loadcollectiontype?'+options).success(function (json){
              callback(json);
        });
      };

      //获取采集任务列表
      self.getCollectionTaskList = function (options, callback) {
        $http.get(lanh.apiHost + 'CrawlerRule/listTask?'+options).success(function (json){
              callback(json);
        });
      };

      //采集任务添加
      self.addCollectionTask = function (options, callback) {
        $http.post(lanh.apiHost + 'CrawlerRule/saveTask',options).success(function (json){
              callback(json);
        });
      };

      //采集任务删除
      self.removeCollectionTask = function (options, callback) {
        $http.post(lanh.apiHost + 'CrawlerRule/removeTask',options).success(function (json){
              callback(json);
        });
      };

      //采集任务编辑
      self.updateCollectionTask = function (options, callback) {
        $http.post(lanh.apiHost + 'CrawlerRule/updateTask',options).success(function (json){
              callback(json);
        });
      };

      //添加一级行业
      self.addOneTrade = function (options, callback) {
        $http.post(lanh.apiHost + 'collectiontype/saveIndustryOne',options).success(function (json){
              callback(json);
        });
      };

      //添加二级行业
      self.addTwoTrade = function (options, callback) {
        $http.post(lanh.apiHost + 'collectiontype/saveIndustryTwo',options).success(function (json){
              callback(json);
        });
      };

      //添加二级行业
      self.removeTrade = function (options, callback) {
        $http.post(lanh.apiHost + 'collectiontype/remove',options).success(function (json){
              callback(json);
        });
      };

      //获取后台的城市列表
      self.getCityList = function (options,callback) {
        $http.get(lanh.apiHost + 'CrawlerArea/getArea?keyWord='+options).success(function (json){
              callback(json);
        });
      };

      //修改城市数据
      self.updateCityList = function (options, callback) {
        $http.post(lanh.apiHost + 'CrawlerArea/saveAreas',options).success(function (json){
              callback(json);
        });
      };
  }]);
