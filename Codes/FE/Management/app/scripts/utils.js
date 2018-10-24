(function () {
    $(function () {
        $.extend(true, window.lanh || {}, {
            utils: {
                getJsonString: function (url) {
                    var theRequest = new Object();
                    var strs = url.split("&");
                    for (var i = 0; i < strs.length; i++) {
                        theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
                    }
                    return JSON.stringify(theRequest);
                },
                parseParam: function (param) {
                    var array = [];
                    for (var _key in param) {
                        array.push(_key + "=" + encodeURIComponent(param[_key]));
                    }
                    return array.join("&");
                },
                dateString: function (str){
                    if(!str){
                        return '';
                    }
                    var date = new Date(str);
                    var seperator1 = "-";
                    var year = date.getFullYear();
                    var month = date.getMonth() + 1;
                    var strDate = date.getDate();
                    var time = (date.toTimeString()).split(' ')[0];
                    if (month >= 1 && month <= 9) {
                        month = "0" + month;
                    }
                    if (strDate >= 0 && strDate <= 9) {
                        strDate = "0" + strDate;
                    }
                    var currentdate = year + seperator1 + month + seperator1 + strDate
                        + " " + time;
                    return currentdate;
                },
                open: function (url,callback) {
                    if (!url) {
                        url = '/#/preview';
                    }
                    var _window = window.open(url);
                    callback == undefined?null:callback(_window);
                },
                createPreviewWindow:function(url,id){
                    // 手工动态加载预览组件
                    if($('#tpl-preview-component').length<=0){
                        $(function(){
                            $.get('./preview.html',function(data){
                                $("body").append(data);
                                openPreviewWindow(lanh.kmaApiHost,url,id);
                            })
                        })
                    }else{
                        openPreviewWindow(lanh.kmaApiHost,url,id);
                    }
                }
            } 
        });
    })
})();