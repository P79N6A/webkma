(function ($element) {
    (function ($) {
        var simpleFormHeight = $element.parent().outerHeight();

        $element.find(".form-row").css("margin-bottom", (simpleFormHeight * 0.0666666) / 12 + "rem");
        $element.find(".form-input").css("height", (simpleFormHeight * 0.2) / 12 + "rem");
        //$element.find(".form-row").css("margin-bottom", (simpleFormHeight * 0.0666666) + "px");
        //$element.find(".form-input").css("height", (simpleFormHeight * 0.2) + "px");

        //判断浏览器是否支持placeholder属性
        supportPlaceholder = 'placeholder' in document.createElement('input'),

        placeholder = function (input) {
            var text = input.attr('placeholder'),
            defaultValue = input.defaultValue;

            if (!defaultValue) {
                input.val(text).addClass("phcolor");
            }

            input.focus(function () {
                if (input.val() == text) {
                    $(this).val("");
                }
            });

            input.blur(function () {
                if (input.val() == "") {
                    $(this).val(text).addClass("grey_light");
                }
            });

            //输入的字符不为灰色
            input.keydown(function () {
                $(this).removeClass("grey_light");
            });
        };

        //当浏览器不支持placeholder属性时，调用placeholder函数
        if (!supportPlaceholder) {
            $('input').each(function () {
                text = $(this).attr("placeholder");
                if ($(this).attr("type") == "text") {
                    placeholder($(this));
                }
            });
        }


        $element.find(".btn-submit").click(function () {
            var nameStr = $element.find("input[name=name]").val();
            var phoneStr = $element.find("input[name=phone]").val();
            var emailStr = $element.find("input[name=email]").val();

            if ($.trim(nameStr).length == 0 || $.trim(nameStr).length > 20) {
                alert("请输入1-20个字的姓名");
                return false;
            }
            if (!/^1\d{10}$/.test(phoneStr)) {
                alert("请输入正确的手机号码");
                return false;
            }
            if (!/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(emailStr)) {
                alert("请输入正确的邮箱");
                return false;
            }

            var obj = {
                "name": nameStr,
                "phone": phoneStr,
                "email": emailStr,
                "relationId": $("#main_id").val()
            }

            $.ajax({
                url: lanh.apiHost + "httpserver/kem/formplugin/submit",
                method: "POST",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify(obj),
                success: function (result) {
                    if (result.code == 0) {
                        alert("提交成功");
                        $element.find("input[name=name]").val("");
                        $element.find("input[name=phone]").val("");
                        $element.find("input[name=email]").val("");
                    } else if (result.code == 3) {
                        alert(result.desc);
                        return false;
                    }
                    else {
                        alert("提交失败");
                        return false;
                    }
                },
                error: function (result) {
                }
            });

        });
    })($)
})($("div[id='_panelId_']"));