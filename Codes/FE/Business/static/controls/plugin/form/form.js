(function ($element) {
    $(function () {
        var validator = function ($row, index) {
            var rowErrMsg = null,
                dataItem = {
                    type: $row.attr("row-type"),
                    category: $row.attr("row-category"),
                    infoType: $row.attr("row-type") + "_" + $row.attr("row-category"),
                    sort: index
                }

            $row.find(".err_msg").text("");

            switch (dataItem.type) {
                case "text":
                    var $el = $row.find("input[type='text'][name]");
                    dataItem.name = $el.attr("name");
                    dataItem.content = $el.val();
                    //验证文本框
                    switch (dataItem.category) {
                        case "name": if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]{1,20}$/.test(dataItem.content)) rowErrMsg = "请正确输入姓名"; break;
                        case "number": if (!/^\d+$/i.test(dataItem.content)) rowErrMsg = "请输入数字"; break;
                        case "phone": 
                            if(!dataItem.content){
                                rowErrMsg = "请正确输入手机号";
                            } else if (!/^((13[0-9])|(14[57])|(15[^4,\D])|(18[0-9])|(17[0-9]))\d{8}$/i.test(dataItem.content)){
                                rowErrMsg = "手机号格式不正确"; 
                            }
                            break;
                        case "email": if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/i.test(dataItem.content)) rowErrMsg = "邮箱格式不正确"; break;
                        case "identitycard": 
                            if (!/(^\d{15}$)|(^\d{17}([0-9]|X)$)/i.test(dataItem.content)) rowErrMsg = "身份证格式不正确";
                            break;
                        default: if (dataItem.content === "") rowErrMsg = "请填写内容"; break;
                    }

                    break;
                case "textarea":
                    var $el = $row.find("textarea[name]");
                    dataItem.name = $el.attr("name");
                    dataItem.content = $el.val();

                    if (dataItem.content === "") rowErrMsg = "请填写内容";
                    break;
                case "radio":
                    var $el = $row.find("i.iconfont.icon-radio-checkded");
                    dataItem.name = $el.attr("name") || $row.find("i.iconfont").attr("name");
                    dataItem.content = [];
                    if ($el.length > 0) {
                        dataItem.content.push({
                            text: $el.attr("value")
                        });
                        if (dataItem.category == "image") {
                            dataItem.content[0].img = $el.parents(".image_option").find("img.option_img").attr("src");
                        }
                    } else {
                        rowErrMsg = "请选择选项";
                    }
                    dataItem.content = JSON.stringify(dataItem.content);
                    break;
                case "checkbox":
                    var $el = $row.find("i.iconfont.icon-checkbox-checked");
                    dataItem.name = $el.attr("name") || $row.find("i.iconfont").attr("name");
                    dataItem.content = [];
                    if ($el.length > 0) {
                        $.each($el.filter(".icon-checkbox-checked"), function (index, _el) {
                            var _$el = $(_el),
                                item = {
                                    text: _$el.attr("value")
                                }
                            if (dataItem.category == "image") {
                                item.img = _$el.parents(".image_option").find("img.option_img").attr("src");
                            }
                            dataItem.content.push(item);
                        })
                    } else {
                        rowErrMsg = "请勾选选项";
                    }
                    dataItem.content = JSON.stringify(dataItem.content);
                    break;
            }

            if (rowErrMsg) $row.find(".err_msg").text(rowErrMsg);

            dataItem.type = dataItem.infoType;
            delete dataItem.infoType;
            delete dataItem.category;

            return dataItem;
        }

        $element.find(".radio").on("click", function (event) {
            var $row = $(this).parents(".form-row[row-type]"),
                $radio_group = $row.find(".iconfont");
            $.each($radio_group, function (i, el) { $(el).removeClass("icon-radio-checkded"); });
            $(this).find(".iconfont").addClass("icon-radio-checkded");

            validator($row);
        });

        $element.find(".checkbox").on("click", function (event) {
            var $checkbox = $(this).find(".iconfont");
            if ($checkbox.hasClass("icon-checkbox-checked")) {
                $checkbox.removeClass("icon-checkbox-checked");
            } else {
                $checkbox.addClass("icon-checkbox-checked");
            }

            validator($(this).parents(".form-row[row-type]"));
        });

        $element.find("input,textarea").on("blur", function (event) {
            if (lanh.platform) return;
            validator($(this).parents(".form-row[row-type]"));
        });

        $element.find(".btn-submit").on("click", function (event) {
            var data = []; 
            
            $.each($element.find(".form-row[row-type]"), function (index, row) {
                data.push(validator($(row), index));
            });

            if ($element.find(".err_msg").text() != "") return;// alert("表单内容尚未填完");

            //post form data
            Utils.getToken(function(result){     
                $.ajax({
                    url: lanh.apiHost.replace(/:\d+/g,'') + "activity/plugin/from/content",
                    type: "POST",
                    contentType: "application/json",
                    dataType: "json",
                    headers: {session_id: result.session_id},
                    data: JSON.stringify({
                        "relationId": lanh.kid,
                        "controlId": $element.attr("id"),
                        "contents": data,
                        "shareId": Utils.getQueryString('as_belong_user') || ''
                    }),
                    success: function (result) {
                        Utils.simpleMsg($element.find("#hid_feedback").val() || "提交成功");

                        //clear data
                        $element.find("input[type='text'][name],textarea[name]").val("");
                        $.each($element.find(".img_radio.active,.img_checkbox.active"), function (i, el) { $(el).removeClass("active") });
                    },
                    error: function (result) {
                        if(result.status == 400){
                            Utils.simpleMsg(JSON.parse(result.responseText).message || '提交失败!');
                        } else{
                            Utils.simpleMsg('提交失败!');
                        }
                    }
                });
            })
            
        });

    })
})($("div[id='_panelId_']"));