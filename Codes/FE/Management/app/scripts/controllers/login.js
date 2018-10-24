'use strict';

/**
 * @ngdoc function
 * @name managementApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the managementApp
 */
angular.module('managementApp')
    .controller('LoginCtrl', ["$scope", "$timeout", "userInfoService", "messenger",
        function ($scope, $timeout, userInfoService, messenger) {
            this.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];

            $scope.data = {
                username: "",
                loginPwd: "",
                remember: false
            };

            if (!!localStorage.getItem('rememberName')) {
                $scope.data.remember = true;
                $scope.data.username = localStorage.getItem('rememberName');
            }

            //登录表单验证函数
            var handleLogin = function () {
                $('.login-form').validate({
                    errorElement: 'span', //default input error message container
                    errorClass: 'help-block', // default input error message class
                    focusInvalid: false, // do not focus the last invalid input
                    rules: {
                        username: { required: true },
                        password: { required: true },
                        remember: { required: false }
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
                            userInfoService.login({
                                user_account: $scope.data.username,
                                user_password: $scope.data.loginPwd
                            }, function (result) {
                                if (!!result) {
                                    sessionStorage.setItem('session_id', result.data.session_id);
                                    messenger.success("登录成功");
                                    if ($scope.data.remember) {
                                        localStorage.setItem('rememberName', $scope.data.username);
                                        $scope.data.loginPwd = "";
                                    } else {
                                        $scope.data.username = "";
                                        $scope.data.loginPwd = "";
                                        localStorage.removeItem('rememberName');
                                    }
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

            //注册表单验证函数
            var handleRegister = function () {

                function format(state) {
                    if (!state.id) { return state.text; }
                    var $state = $(
                        '<span><img src="../assets/global/img/flags/' + state.element.value.toLowerCase() + '.png" class="img-flag" /> ' + state.text + '</span>'
                    );

                    return $state;
                }

                if (jQuery().select2 && $('#country_list').size() > 0) {
                    $("#country_list").select2({
                        placeholder: '<i class="fa fa-map-marker"></i>&nbsp;Select a Country',
                        templateResult: format,
                        templateSelection: format,
                        width: 'auto',
                        escapeMarkup: function (m) {
                            return m;
                        }
                    });


                    $('#country_list').change(function () {
                        $('.register-form').validate().element($(this)); //revalidate the chosen dropdown value and show error or success message for the input
                    });
                }


                $('.register-form').validate({
                    errorElement: 'span', //default input error message container
                    errorClass: 'help-block', // default input error message class
                    focusInvalid: false, // do not focus the last invalid input
                    ignore: "",
                    rules: {

                        fullname: {
                            required: true
                        },
                        email: {
                            required: true,
                            email: true
                        },
                        address: {
                            required: true
                        },
                        city: {
                            required: true
                        },
                        country: {
                            required: true
                        },

                        username: {
                            required: true
                        },
                        password: {
                            required: true
                        },
                        rpassword: {
                            equalTo: "#register_password"
                        },

                        tnc: {
                            required: true
                        }
                    },

                    messages: { // custom messages for radio buttons and checkboxes
                        tnc: {
                            required: "Please accept TNC first."
                        }
                    },

                    invalidHandler: function (event, validator) { //display error alert on form submit

                    },

                    highlight: function (element) { // hightlight error inputs
                        $(element)
                            .closest('.form-group').addClass('has-error'); // set error class to the control group
                    },

                    success: function (label) {
                        label.closest('.form-group').removeClass('has-error');
                        label.remove();
                    },

                    errorPlacement: function (error, element) {
                        if (element.attr("name") == "tnc") { // insert checkbox errors after the container
                            error.insertAfter($('#register_tnc_error'));
                        } else if (element.closest('.input-icon').size() === 1) {
                            error.insertAfter(element.closest('.input-icon'));
                        } else {
                            error.insertAfter(element);
                        }
                    },

                    submitHandler: function (form) {
                        $scope.$apply(function () {
                            //userInfoService.register($scope.data, function (result) {
                            //    if (!!result) {
                            //        messenger.success("注册成功");
                            //    } else {
                            //        messenger.error("注册失败");
                            //    }
                            //});
                            //注册成功，并登录。
                        });
                    }
                });

                $('.register-form input').keypress(function (e) {
                    if (e.which == 13) {
                        if ($('.register-form').validate().form()) {
                            $('.register-form').submit();
                        }
                        return false;
                    }
                });

                jQuery('#register-btn').click(function () {
                    jQuery('.login-form').hide();
                    jQuery('.register-form').show();
                });

                jQuery('#register-back-btn').click(function () {
                    jQuery('.login-form').show();
                    jQuery('.register-form').hide();
                });
            };

            //执行登录页面初始化函数
            handleLogin();
            handleRegister();


            //// init background slide images
            //$.backstretch([
            //    "/images/login/bg_1.jpg",
            //    "/images/login/bg_2.jpg",
            //    "/images/login/bg_3.jpg",
            //    "/images/login/bg_4.jpg"
            //], {
            //    fade: 1000,
            //    duration: 8000
            //});
        }]);
