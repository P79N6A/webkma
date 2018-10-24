'use strict';
/**
 * @ngdoc overview
 * @name managementApp
 * @description
 * # managementApp
 *
 * Main module of the application.
 */
angular
  .module('managementApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap'
  ])
  .config(function ($routeProvider) {
      $routeProvider
        .when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
        })
        .when('/project/business-list', {
            templateUrl: 'views/project/business-list.html',
            controller: 'BusinessListCtrl'
        })
        
        .when('/project/add-business', {
            templateUrl: 'views/project/member-management.html',
            controller: 'AddBusinessCtrl'
        })
        .when('/project/business-detail', {
            templateUrl: 'views/project/member-management.html',
            controller: 'AddBusinessCtrl'
        })
        .when('/project/designer-management', {
            templateUrl: 'views/project/designer-management.html',
            controller: 'DesignerManagementCtrl'
        })
        .when('/project/designer-list', {
            templateUrl: 'views/project/designer-list.html',
            controller: 'DesignerListCtrl'
        })
        .when('/project/activity-list', {
            templateUrl: 'views/project/activity-list.html',
            controller: 'ActivityListCtrl'
        })
        //.when('/project/material-image', {
        //    templateUrl: 'views/project/material-image.html',
        //    controller: 'MaterialImageCtrl'
        //})
        //.when('/project/material-shap', {
        //    templateUrl: 'views/project/material-shap.html',
        //    controller: 'MaterialShapCtrl'
        //})
        //.when('/project/material-text', {
        //    templateUrl: 'views/project/material-text.html',
        //    controller: 'MaterialTextCtrl'
        //})
        .when('/project/material-list', {
            templateUrl: 'views/project/material-list.html',
            controller: 'MaterialListCtrl'
        })
        .when('/project/material-tag', {
            templateUrl: 'views/project/material-tag.html',
            controller: 'MaterialTagCtrl'
        })
        .when('/project/question-feedback', {
            templateUrl: 'views/project/question-feedback_tpl.html',
            controller: 'FeedbackCtrl'
        })
        .when('/project/sys-config', {
            templateUrl: 'views/project/sys-config.html',
            controller: 'SysConfigCtrl'
        })
        .when('/project/template-list', {
            templateUrl: 'views/project/template-list.html',
            controller: 'TemplateListCtrl'
          })
        .when('/project/sms-list', {
            templateUrl: 'views/project/sms-list.html',
            controller: 'SmsListCtrl'
          })
        .when('/project/template-sms-list', {
            templateUrl: 'views/project/template-sms-list.html',
            controller: 'TemplateSmsListCtrl'
            })
        .when('/project/template-promotion-list', {
              templateUrl: 'views/project/template-promotion-list.html',
              controller: 'TemplatePromotionListCtrl'
        })
        .when('/project/template-promotion-detail', {
            templateUrl: 'views/project/template-promotion-detail.html',
              controller: 'TemplatePromotionDetailCtrl'
          })
        .when('/project/moments-adv-data-list', {
            templateUrl: 'views/project/moments-adv-data-list.html',
            controller: 'momentsAdvDataListCtrl'
        })
        .when('/project/moments-adv-data-edit', {
            templateUrl: 'views/project/moments-adv-data-edit.html',
            controller: 'momentsAdvDataEditCtrl'
        })
        .when('/project/wxsubscription-account-list', {
            templateUrl: 'views/project/wxsubscription-account-list.html',
            controller: 'WxsubscriptionAccountList'
          })
        .otherwise({
            redirectTo: '/'
        });
  }).run(["$rootScope", "$location", "userInfoService", function ($rootScope, $location, userInfoService) {
    //   var params = $location.search();
    //   if ($location.path().indexOf("login-seo") != -1) {//排除seo登录页面 mars 17.8.15
    //       $rootScope.loginSeo = true;
    //   } else if (params.partner_id && params.sign && params.timestamp) {   //partner role
    //       console.log("hello partner");
    //   } else {  //admin role
    //       userInfoService.getUserInfo(function (data) {
    //           if (!!data) {
    //               $rootScope.userInfo = data;
    //           }
    //       });
    //   }
  }]);

//rewrite angular - ui.bootstrap.pagination default config  by Dyllon.
angular.module('ui.bootstrap.pagination').run(["uibPaginationConfig", function (uibPaginationConfig) {
    uibPaginationConfig.firstText = '首页';
    uibPaginationConfig.previousText = '上一页';
    uibPaginationConfig.nextText = '下一页';
    uibPaginationConfig.lastText = '尾页';
}]);

