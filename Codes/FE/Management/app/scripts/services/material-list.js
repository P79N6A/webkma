'use strict';

/**
 * @ngdoc service
 * @name managementApp.templateListService
 * @description
 * # templateListService
 * Service in the managementApp.
 */
angular.module('managementApp')
  .service('materialListService', ["$rootScope", "$http", function ($rootScope, $http) {
      var self = this;


      //获取素材类型列表
      self.getMaterialClassList = function (options, callback) {
          $http.get(lanh.kmaApiHost + 'class/search' + options, '').success(function (json) {
            callback(json);
          });
      };

      //获取素材列表
      self.getMaterialList = function (options, callback) {
          $http.get(lanh.kmaApiHost + 'material/search' + options, '').success(function (json) {
              callback(json);
          });
      };

      //保存素材
      self.saveMaterail = function (options, callback) {
          $http.post(lanh.kmaApiHost + "material/save", options).success(function (result) {
              callback(result);
          });
      };

      //编辑素材
      self.updateMaterial = function (options, callback) {
          $http.post(lanh.kmaApiHost + 'material/update', options).success(function (json) {
              callback(json);
          });
      };

      //获取素材某个类型下的列表
      self.getMaterialDetailList = function (options, callback) {
          $http.get(lanh.apiHost + 'userImg/search'+options,'').success(function (json) {
              callback(json);
          });
      };

      //上传素材
      self.uploadImg = function (options, callback) {
          $.ajax({
              url: lanh.materialHost + 'userImg/upload',
              type: 'POST',
              data: options,
              dataType: 'JSON',
              cache: false,
              contentType: false,
              processData: false,
              ClientType: 'backmanagesys',
              success: function (result, status) {
                  callback(result, status);
              },
              error: function (returndata) {
              }
          });
      };

      //创建素材分类
      self.addMaterialType = function (options, callback) {
          $http.post(lanh.apiHost + 'material/addMaterialType', options).success(function (json) {
              callback(json);
          });
      };
      //启用/删除/禁用素材类型
      self.shelfMaterialType = function (options, callback) {
          $http.post(lanh.apiHost + 'material/shelfMaterialType', options).success(function (json) {
              callback(json);
          });
      };
      //删除图片
      self.deleteImg = function (options, callback) {
          $http.post(lanh.apiHost + "userImg/delete", options).success(function (result) {
              callback(result);
          });
      };

      //编辑素材关键词(单个操作)
      self.setKeyWord = function (options, callback) {
          $http.post(lanh.apiHost + "material/setkeyword", options).success(function (result) {
              callback(result);
          });
      };

      //编辑素材关键词(批量操作)
      self.setListKeyWord = function (options, callback) {
          $http.post(lanh.apiHost + "material/setmaterialskeyword", options).success(function (result) {
              callback(result);
          });
      };

      //删除素材(批量操作)
      self.deleteMaterial = function (options, callback) {
          $http.post(lanh.kmaApiHost + "material/delete", options).success(function (result) {
              callback(result);
          });
      };

      ///批量分类
      self.setMaterialType = function (options, callback) {
          $http.post(lanh.apiHost + "material/setmaterialtype", options).success(function (result) {
              callback(result);
          });
      };

      //编辑素材备注信息
      self.setRemarkSave = function (options, callback) {
          $http.post(lanh.apiHost + "material/setremark", options).success(function (result) {
              callback(result);
          });
      };

      //保存svg素材信息
      self.saveSvgData = function (options, callback) {
          $http.get(lanh.apiHost + "material/savesvg?"+options,'').success(function (result) {
              callback(result);
          });
      };

      //获取素材标签
      self.getMaterialTagList = function (options, callback) {
          var array = [],opt = '';
          if (!!options) {
            for (var _key in options) {
              array.push(_key + "=" + encodeURIComponent(options[_key]));
            }
            opt = "?" + array.join("&");
          }
          $http.get(lanh.apiHost + 'tag/search'+opt).success(function (json) {
              callback(json);
          });
      };

      //编辑素材标签
      self.editMaterailTag = function (options, callback) {
          $http.post(lanh.apiHost + "material/savetag", options).success(function (result) {
              callback(result);
          });
      };

      //获取H5模板分类
      self.getListByTypeListSrv = function (options, callback) {
          $http.post(lanh.apiHost + "syscode/getListByType", {'type':'MANUSCRIPT_CLASS'}).success(function (result) {
              callback(result);
          });
      };
  }]);
