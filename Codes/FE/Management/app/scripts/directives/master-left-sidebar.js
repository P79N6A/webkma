'use strict';

/**
 * @ngdoc directive
 * @name managementApp.directive:masterLeftSidebar
 * @description
 * # masterLeftSidebar
 */
angular.module('managementApp')
  .directive('masterLeftSidebar', ["$http", "$location", "$timeout", "menuInfoService",
      function ($http, $location, $timeout, menuInfoService) {
          return {
              templateUrl: "views/templates/master/left-sidebar_tpl.html",
              restrict: 'E',
              replace: true,
              scope: true,
              link: function postLink($scope, $element, attrs) {
                  $scope.menus = menuInfoService.getMenus();

                  var $path = window.location.href.indexOf('/project/material-library?search') != -1 ? '/project/material' : $location.path();
                  $scope.currentMenu = menuInfoService.getMenuInfo($path).menu;
                  

                  $scope.btnChangeRouter = function (menu) {
                      if (!menu.url) return;
                      $scope.currentMenu = menu;
                      if (!menu.search) {
                          $location.search({});
                      } else {
                          $location.search(menu.search);
                      }
                      $location.path(menu.url);
                  }

                  //延迟执行左边菜单的JS绑定
                  $timeout(Layout.initSidebar);

                  var _openMenu = function(firstLoad){
                    //第一次加载菜单默认展开选中菜单
                    $timeout(function () {
                        $element.find('.parent-Item').removeClass("active open");
                        $element.find('.sub-menu').hide();
                        $element.find('.arrow').removeClass("open");
                        $.each($element.find("li.active.open").parents("*"), function (index, el) {
                            if ($(el).hasClass("page-sidebar-wrapper")) {
                                return false;
                            } else if (el.tagName == "LI") {
                                $(el).addClass("active open");
                                $(el).find('.sub-menu').show();
                                $(el).find('.arrow').addClass("open");
                            }
                        });
                    })
                  }
                  _openMenu();

                  $scope.$root.$on('reloadLeftMenu', function(event, key, index){

                      var tempMenu = null;
                      $.each($scope.menus, function(index, item){
                          if(item.key == key) tempMenu = item;
                      })
                      
                      if(typeof index === 'number'){
                        $scope.currentMenu = tempMenu.childs[index];
                      } else {
                        $scope.currentMenu = tempMenu;
                      }
                      
                      _openMenu();
                  });
              }
          };
      }]);
