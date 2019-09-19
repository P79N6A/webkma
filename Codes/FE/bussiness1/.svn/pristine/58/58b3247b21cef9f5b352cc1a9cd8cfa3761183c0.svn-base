(function ($element) {
    $(function () {
        var datas = !!$element.find('.form').attr('data-rows') ? JSON.parse($element.find('.form').attr('data-rows')) : '';
        var controlId = $element.find('.form').attr('data-controlId') || '';
        var provinceNodeArr = $element.find(".province");
        var cityNodeArr = $element.find(".city");
        var districtNodeArr = $element.find(".district");
        var dateNodeArr = $element.find(".date");
        var time_hourNodeArr = $element.find(".time_hour");
        var time_minitesNodeArr = $element.find(".time_minites");
        var selectNodeArr = $element.find('.select');
        

        //地址拼接处理
        function adrressDataProcess(data) {
            var optionArr = [];
            $.each(data, function(index, item){
                optionArr.push('<option value="'+item.code+':'+item.name+'">'+item.name+'</option>');
            });
            return optionArr;
        }
        //根据index过滤出node对象
        function _filterNode(nodeArr, index) {
            return $($.grep(nodeArr, function(node){ return $(node).attr('index') == index; })[0]);
        }
        // 地址初始化
        try{
            if(provinceNodeArr.length > 0){
                Utils.getProvinceList(function(data){
                    provinceNodeArr.html(adrressDataProcess(data));
                    provinceNodeArr.attr('select-province', data[0].name);

                    if(cityNodeArr.length > 0){
                        Utils.getCityList(data[0].code, function(data1){
                            cityNodeArr.html(adrressDataProcess(data1));
                            cityNodeArr.attr('select-city', data1[0].name);
                            
                            if(districtNodeArr.length > 0){
                                Utils.getAreasList(data1[0].code, function(data2){
                                    districtNodeArr.html(adrressDataProcess(data2));
                                    districtNodeArr.attr('select-district', data2[0].name);
                                })
                            }    
                        })
                    }
                })
            };
        }catch(err){

        }
        if(provinceNodeArr.length > 0 ){
            provinceNodeArr.on('change', function(){
                var $el = $(this);
                var index = $el.attr('index');
                var tempArr = $el.val().split(':');
                var cityNode = _filterNode(cityNodeArr, index);
                var districtNode = _filterNode(districtNodeArr, index);
                if(!!cityNode) {
                    Utils.getCityList(tempArr[0], function(data){
                        cityNode.html(adrressDataProcess(data));
                        cityNode.attr('select-city', data[0].name);

                        Utils.getAreasList(data[0].code, function(data1){
                            districtNode.html(adrressDataProcess(data1));
                            districtNode.attr('select-district', data1[0].name);
                        })
                    })
                    $el.attr('select-province', tempArr[1]);
                }
                if(!!districtNode) districtNode.html('');
            });
        }
        
        if(cityNodeArr.length > 0){
            cityNodeArr.on('change', function(){
                var $el = $(this);
                var index = $el.attr('index');
                var tempArr = $el.val().split(':');
                var districtNode = _filterNode(districtNodeArr, index);
                if(!!districtNode) {
                    Utils.getAreasList(tempArr[0], function(data){
                        districtNode.html(adrressDataProcess(data));
                        districtNode.attr('select-district', data[0].name);
                    })
                    $el.attr('select-city', tempArr[1]);
                }
            });
        }

        if(districtNodeArr.length > 0){
            districtNodeArr.on('change', function(){
                var $el = $(this);
                var tempArr = $el.val().split(':');
                $el.attr('select-district', tempArr[1]);
            });
        }

        // 时间下拉选项初始化
        (function(){
            var _init = function(num){
                var optionArr = [];
                for(var i=0; i<num; i+=1){
                    var str = i < 10 ? '0'+i: i;
                    optionArr.push('<option value="'+str+'">'+str+'</option>');
                }
                return optionArr;
            }
            var timeChangeProcess = function(obj, type){
                obj.on('change',function(){
                    var $el = $(this);
                    $el.attr(type, $el.val());
                })
            }
            if(time_hourNodeArr.length > 0) {
                time_hourNodeArr.html(_init(24)).attr('time_hour','00');
                time_minitesNodeArr.html(_init(60)).attr('time_minites','00');
                timeChangeProcess(time_hourNodeArr,'time_hour');
                timeChangeProcess(time_minitesNodeArr,'time_minites');
            }     
        })();

        // 下拉框初始化
        (function(){
            if(selectNodeArr.length >0){
                $.each(selectNodeArr, function(index, item){
                    var $el = $(this);
                    var index = $el.attr('index');
                    $el.attr('value', datas[index].option[0].value);
                });
            }
        })();

        // 图片上传方法绑定
        function bindUpload(){                
            var imgUploadNodeArr = $element.find(".imgUpload");
            var deleteIconNodeArr = $element.find(".el-upload__tip");
            imgUploadNodeArr.unbind('change').bind('change', function(){
                var $el = $(this);
                var index = $el.attr('index');
                var optionIndex = $el.attr('optionIndex');
                var uploading = $el.attr('uploading');
                var imgList = $el.parents('.imgList');
                var listLength = imgList.attr('imglistLength');
                var maxLength = imgList.attr('maxLength');
                if(this.files.length == 0 || uploading) return;
                //判断文件类型是否合格
                if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(this.files[0].name)) {
                    Utils.simpleMsg('只能上传图片噢！');
                    $el.val("");
                    return false;
                }
                if (this.files[0].size > 10*1024*1024) {
                    Utils.simpleMsg('文件大小不能超过10M！');
                    $el.val("");
                    return false;
                }
            
                var formData = new FormData($el.parents('.imgUploadForm')[0]);
                $el.attr('uploading', true);
                Utils.fileUpload(formData, function(file){
                    $el.removeAttr('uploading');

                    if(!!optionIndex){
                        $el.parents('.imgUploadForm').siblings('.avatar').attr('src', file);
                    } else {
                        var tempIndex = parseInt(listLength) + 1;
                        var strObj = $('<div class="upload-wrap img-wrap"></div>');
                        strObj.html('<form class="imgUploadForm" enctype="multipart/form-data" style="width: 100%; overflow:hidden;">'+
                                        '<input class="imgUpload" type="file" name="fileName" index="'+index+'" optionIndex="'+tempIndex+'"/>'+
                                    '</form>'+
                                    '<img class="avatar"/>'+
                                    '<span class="el-upload__tip text-center"><i class="iconfont icon-delete"></i></span>');
                        
                        $el.parents('.upload-wrap').before(strObj);
                        strObj.children('.avatar').attr('src', file);
                        imgList.attr('imglistLength', tempIndex).css('width', ((tempIndex+1) * 2.8178) + 'rem');
                        if(tempIndex >= parseInt(maxLength)){
                            $el.parents('.plus-upload').remove();
                        }
                    }
                    $el.val('');
                    bindUpload();
                })
            });
            deleteIconNodeArr.unbind('click').bind('click', function(){
                var $el = $(this);
                var imgWrap = $el.parents('.upload-wrap');
                var imgList = $el.parents('.imgList');
                var listLength = imgList.attr('imglistLength');
                var maxLength = imgList.attr('maxLength');
                var index = $el.attr('index');
                var plusUpload = imgList.find('.plus-upload');

                imgWrap.remove();
                if(plusUpload.length <= 0 && !!maxLength && (parseInt(maxLength) > parseInt(listLength) - 1)){
                    var strObj = $('<div class="upload-wrap plus-upload"></div>');
                    strObj.html('<form class="imgUploadForm" enctype="multipart/form-data" style="width: 30px; overflow:hidden;">'+
                        '<input class="imgUpload" type="file" name="fileName" index="'+index+'"/>'+
                    '</form>'+
                    '<i class="iconfont icon-plus"></i>');
                    imgList.find('.clearfix').before(strObj);
                    bindUpload();
                }
                imgList.attr('imglistLength', (parseInt(listLength) - 1)).css('width', (parseInt(listLength) * 2.8178) + 'rem');
            })
        }

        try{
            bindUpload();
        }catch(err){

        }

        var validator = function ($row, index) {
            var rowErrMsg = null,
                simpleMsgErr = null,
                dataItem = {
                    type: $row.attr("row-category"),
                    sort: index
                }
            $row.find(".err_msg").text("");
            switch (dataItem.type) {
                case "name":
                case "single-lines":
                case "multiple-lines":
                case "phone":
                case "email":
                case "number":
                case "identitycard":
                    var $el = $row.find(".form-input");
                    var regArr = {
                        number: /^\d+$/i,
                        phone: /^1[0-9]{10}$/,
                        email: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/i,
                        identitycard: /(^\d{15}$)|(^\d{17}([0-9]|X)$)/i
                    };
                    dataItem.name = (!!datas && datas[index].title.text) || '姓名';
                    dataItem.content = $el.val();

                    if(!!datas && datas[index].require && !dataItem.content){
                        rowErrMsg = "不能为空噢！";
                    }else if(!!datas && !!dataItem.content && !!datas[index].minLength && datas[index].minLength.need && dataItem.content.length < parseInt(datas[index].minLength.value)){
                        rowErrMsg = "最少需要"+datas[index].minLength.value+"个字符！";
                    }else if(!!datas && !!dataItem.content && !!datas[index].maxLength && datas[index].maxLength.need && dataItem.content.length > parseInt(datas[index].maxLength.value)){
                        rowErrMsg = "不能超过"+datas[index].maxLength.value+"个字符！";
                    }else if(!!datas && !!dataItem.content && datas[index].checkFormat && !regArr[dataItem.type].test(dataItem.content)) {
                        rowErrMsg = "格式不正确！";
                    }
                    
                    if (rowErrMsg){
                        $el.addClass('error');
                        simpleMsgErr = dataItem.name + rowErrMsg;
                    } else {
                        $el.removeClass('error');
                    } 
                    break;
                case "address":
                    var province = $row.find(".province");
                    var city = $row.find(".city");
                    var district = $row.find(".district");
                    var detail = $row.find(".form-input");

                    if(!!province){
                        if(!province.attr('select-province')){
                            rowErrMsg = "请选择省份！";
                            province.addClass('error');
                        } else {
                            province.removeClass('error');
                        }
                    }
                    if(!!city){
                        if(!city.attr('select-city')){
                            rowErrMsg = "请选择城市！";
                            city.addClass('error');
                        } else {
                            city.removeClass('error');
                        }
                    }
                    if(!!district){
                        if(!district.attr('select-district')){
                            rowErrMsg = "请选择区域！";
                            district.addClass('error');
                        } else {
                            district.removeClass('error');
                        }
                    }
                    if(!rowErrMsg){
                        dataItem.name = datas[index].title.text;
                        dataItem.content = (!!province ? province.attr('select-province') : '') + (!!city ? city.attr('select-city') : '') + (!!district ? district.attr('select-district') : '');
                        if(datas[index].detailAdress.need){
                            if(datas[index].require && !detail.val()){
                                rowErrMsg = "请输入详细地址！";
                                simpleMsgErr = "请输入表单项"+ dataItem.name +"的详细地址！";
                                detail.addClass('error');
                            } else if(!!detail.val()){
                                dataItem.content += detail.val();
                                detail.removeClass('error');
                            } 
                        }
                    } 
                    break;
                case "date":
                    dataItem.name = datas[index].title.text;
                    dataItem.content = $row.find('.date').val();
                    if(datas[index].require && !dataItem.content){
                        rowErrMsg = "请选择日期！";
                        simpleMsgErr = "请输入表单项"+ dataItem.name +"的日期！";
                        $row.find('.date').addClass('error');
                    } else {
                        $row.find('.date').removeClass('error');
                        rowErrMsg = "";
                        simpleMsgErr = "";
                    }
                    break;
                case "time":
                    var hour = $row.find(".time_hour");
                    var minites = $row.find(".time_minites");
                    dataItem.name = datas[index].title.text;
                    dataItem.content = hour.val()+":"+minites.val();
                    break;
                case "radio-option":
                case "image-radio-option":
                    var $el = $row.find("i.iconfont.icon-radio-checkded");
                    dataItem.name = datas[index].title.text;
                    dataItem.content = [];
                    if ($el.length > 0) {
                        dataItem.content.push({
                            text: $el.attr("name")
                        });
                        if (dataItem.type == "image-radio-option") {
                            dataItem.content[0].img = $el.parents(".image_option").find("img.option_img").attr("src");
                        }
                    } else {
                        if(datas[index].require){
                            rowErrMsg = "请选择选项";
                            simpleMsgErr = "请选择"+ dataItem.name +"的选项！";
                        }
                    }
                    dataItem.content = JSON.stringify(dataItem.content);
                    break;
                case "checkbox-option":
                case "image-checkbox-option":
                    var $el = $row.find("i.iconfont.icon-checkbox-checked");
                    dataItem.name = datas[index].title.text;
                    dataItem.content = [];
                    if ($el.length > 0) {
                        $.each($el.filter(".icon-checkbox-checked"), function (index, _el) {
                            var _$el = $(_el),
                                item = {
                                    text: _$el.attr("name")
                                }
                            if (dataItem.type == "image-checkbox-option") {
                                item.img = _$el.parents(".image_option").find("img.option_img").attr("src");
                            }
                            dataItem.content.push(item);
                        })
                    }
                    if(datas[index].minNum.need && parseInt(datas[index].minNum.value) > dataItem.content.length){
                        rowErrMsg = "至少勾选" + datas[index].minNum.value + "项";
                        simpleMsgErr = "表单项"+ dataItem.name + rowErrMsg;
                    }
                    if(datas[index].maxNum.need && parseInt(datas[index].maxNum.value) < dataItem.content.length){
                        rowErrMsg = "至多勾选" + datas[index].maxNum.value + "项";
                        simpleMsgErr = "表单项"+ dataItem.name + rowErrMsg;
                    }
                    dataItem.content = JSON.stringify(dataItem.content);
                break;
                case "select":
                    dataItem.name = datas[index].title.text;
                    dataItem.content = $row.find('.select').val();
                    break;
                case "upload":
                    var $el = $row.find('.avatar');
                    dataItem.name = datas[index].title.text;
                    dataItem.content = [];
                    if($el.length > 0){
                        $.each($el, function(index, item){
                            dataItem.content.push({'img': $(item).attr('src')});
                        })
                    }
                    if(datas[index].minNum.need && $el.length < datas[index].minNum.value){
                        rowErrMsg = "最少上传"+datas[index].minNum.value+"张";
                        simpleMsgErr = "表单项"+ dataItem.name + rowErrMsg;
                    }
                    dataItem.content = JSON.stringify(dataItem.content);
                    break;
            }

            if (rowErrMsg){
                $row.find(".err_msg").text(rowErrMsg);
                $row.attr('errorTip', rowErrMsg).attr('simpleMsgErr', simpleMsgErr);
            } else {
                $row.removeAttr('errorTip').removeAttr('simpleMsgErr');
            }

            dataItem['type'] = 'text_' + dataItem.type;
            return dataItem;
        }


        // 日期插件初始化
        try{
            (function(){
                if(dateNodeArr.length > 0){
                    $.each(dateNodeArr, function(index, item){
                        var This = $(item);
                        var minDate = This.attr('starttime') || '1900-1-1';
                        var maxDate = This.attr('endtime') || '2099-1-1';
                        console.log('mindate:'+ minDate);
                        console.log('maxDate:'+ maxDate);
                        $('#date_'+ controlId + This.attr('index')).mdater({
                            minDate : new Date(minDate.split('-')[0], parseInt(minDate.split('-')[1]) -1 , minDate.split('-')[2]),
                            maxDate : new Date(maxDate.split('-')[0], parseInt(maxDate.split('-')[1]) -1, maxDate.split('-')[2]),
                            done: function(){
                                var $row = This.parents(".form-row[row-category]");
                                validator($row, parseInt($row.attr('index')));
                            }
                        });
                    }) 
                }
            })();
        }catch(err){

        }

        $element.find(".radio").on("click", function (event) {
            var $row = $(this).parents(".form-row[row-category]"),
                $radio_group = $row.find(".iconfont");
            $.each($radio_group, function (i, el) { $(el).removeClass("icon-radio-checkded"); });
            $(this).find(".iconfont").addClass("icon-radio-checkded");

            validator($row, parseInt($row.attr('index')));
        });

        $element.find(".checkbox").on("click", function (event) {
            var $el = $(this);
            var $checkbox = $el.find(".iconfont");
            if ($checkbox.hasClass("icon-checkbox-checked")) {
                $checkbox.removeClass("icon-checkbox-checked");
            } else {
                $checkbox.addClass("icon-checkbox-checked");
            }

            validator($el.parents(".form-row[row-category]"), parseInt($el.parents(".form-row[row-category]").attr('index')));
        });

        try{
            if(!!Utils){
                $element.find('.form-input').on('blur', function(event){
                    if (lanh.platform) return;
                    validator($(this).parents(".form-row[row-category]"), parseInt($(this).attr('index')));
                });
            }
        }catch(err){

        }
        

        $element.find(".btn-submit").on("click", function (event) {      
            var data = [], _go = true, _tipgo = true;
            $.each($element.find(".form-row[row-category]"), function (index, row) {
                var dataIndex = parseInt($(row).attr('index'));
                data.push(validator($(row), index));
                if(_go && !!$(row).attr('errorTip')){
                    _go = false;
                }
                if(_tipgo && !!datas && datas[dataIndex].title.hide && !!$(row).attr('simpleMsgErr')){
                    _tipgo = false;
                    Utils.simpleMsg($(row).attr('simpleMsgErr'));
                }
            });

            if (!_go) return false;// alert("表单内容尚未填完");
            Utils.loading('正在提交表单中，请稍后');
            //post form data
            Utils.getToken(function(result){   
                Utils.isWxMini(function (matched) {
                    $.ajax({
                        url: lanh.apiHost.replace(/:\d+/g,'') + "activity/plugin/from/content?session_id=" + result.session_id,
                        type: "POST",
                        contentType: "application/json",
                        dataType: "json",
                        headers: {session_id: result.session_id},
                        data: JSON.stringify({
                            "relationId": lanh.kid,
                            "controlId": $element.attr("id"),
                            "contents": data,
                            "rootUserId": (Utils.myrootUserId || Utils.getQueryString('rootUserId') || Utils.getQueryString('userId')),
                            "forwardKey": Utils.myforwardKey,
                            "isWeapp": matched ? 'weapp' : (!!Utils.isWX() ? 'wx' : 'pc'),
                            "extType": "form"
                        }),
                        success: function (result) {
                            if(result.data == 1 || result.data == 200){
                                Utils.simpleMsg($element.find("#hid_feedback").val() || "提交成功");
                                //clear data
                                $element.find("input[type='text'][name],textarea[name]").val("").removeClass('error');
                                $.each($element.find(".icon-radio-checkded"), function (i, el) { $(el).removeClass("icon-radio-checkded"); });
                                $.each($element.find(".icon-checkbox-checked"), function (i, el) { $(el).removeClass("icon-checkbox-checked"); });
                                $.each($element.find(".imgList"), function(i, el){
                                    var $el = $(el);
                                    var listLength = $el.attr('imglistLength');
                                    var maxLength = $el.attr('maxLength');
                                    var imgWrap = $el.find('.img-wrap');
                                    var index = $el.attr('index');
                                    var plusUpload = $el.find('.plus-upload');

                                    imgWrap.remove();
                                    if(plusUpload.length <= 0){
                                        var strObj = $('<div class="upload-wrap plus-upload"></div>');
                                        strObj.html('<form class="imgUploadForm" enctype="multipart/form-data" style="width: 30px; overflow:hidden;">'+
                                            '<input class="imgUpload" type="file" name="fileName" index="'+index+'"/>'+
                                        '</form>'+
                                        '<i class="iconfont icon-plus"></i>');
                                        $el.find('.clearfix').before(strObj);
                                        bindUpload();
                                    }
                                    $el.attr('imglistLength', 0).css('width', (1 * 2.8178) + 'rem');
                                })
                            } else if(result.data == 101){
                                Utils.simpleMsg('手机号已被使用');
                            } else if(result.data == 3){
                                Utils.simpleMsg('不能重复提交');
                            } else {
                                Utils.simpleMsg('操作失败，请重试');
                            }
                            layer.close(Utils.loadingBox);
                        },
                        error: function (result) {
                            if(result.status == 400){
                                Utils.simpleMsg(JSON.parse(result.responseText).message || '提交失败!');
                            } else{
                                Utils.simpleMsg('提交失败!');
                            }
                            layer.close(Utils.loadingBox);
                        }
                    });
                }) 
            })
        });
    })
})($("div[id='_panelId_']"));