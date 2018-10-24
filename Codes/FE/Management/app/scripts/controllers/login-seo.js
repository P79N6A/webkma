'use strict';

/**
 * @ngdoc function
 * @name managementApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the managementApp
 */
angular.module('managementApp')
  .controller('LoginSeoCtrl', ["$scope", "$timeout", "userInfoService", "messenger", "$location",
function ($scope, $timeout, userInfoService, messenger, $location) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.data = {
        username: "",
        loginPwd: ""
    };


    //登录表单验证函数
    var handleLogin = function () {
        $('.login-form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                username: { required: true },
                password: { required: true }
            },

            messages: {
                username: { required: "用户名不能为空" },
                password: { required: "密码不能为空" }
            },

            invalidHandler: function (event, validator) { //display error alert on form submit
                $('.alert-danger', $('.login-form')).show();
            },

            highlight: function (element) { // hightlight error inputs
                $(element).closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            success: function (label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },

            errorPlacement: function (error, element) {
                error.insertAfter(element.closest('.input-icon'));
            },

            submitHandler: function (form) {
                $scope.$apply(function () {
                    var obj = {
                        identify: $scope.data.username,
                        loginPwd: $scope.data.loginPwd
                    };

                    userInfoService.loginSeo(obj, function (result) {
                        if (!!result) {
                            //debugger
                            //$location.url(result.data.match(/^http[s]?:\/\//i) ? result.data : "http://" + result.data);
                            window.location.href = result.data.match(/^http[s]?:\/\//i) ? result.data : "http://" + result.data;
                        } else {
                            messenger.error("用户名或密码错误");
                        }
                    });
                });
            }
        });


        $('.login-form input').keypress(function (e) {
            if (e.which == 13) {
                if ($('.login-form').validate().form()) {
                    $('.login-form').submit();
                }
                return false;
            }
        });
    };

    //执行登录页面初始化函数
    handleLogin();
}]);
