(function ($element) {
    $(function () {
        var kid = $element.find(".js-data-value").data("kid"),
        text = $element.find(".js-data-value").data("text"),
        isDesign = location.href.indexOf('/design?') != -1;
        var getManuscriptId = function () {
            var q = {};
            location.href.replace(/([^?&=]+)=([^&]+)/g, (_, k, v) => q[k] = v);
            return q.id;
        }
        //数据处理，超过9999显示1w
        var convertJoinCount  = function(num) {
            num = Number(num);
            if (isNaN(num)) {
            return 0;
            }
            var w = num / 10000;
            w = w.toFixed(2);
            if (w > 99) {
            w = 99;
            }
            if (w >= 1) {
            return w + 'w';
            }
            return num;
        }
        //点赞动画
        var tipsBox = function (options) {
			options = $.extend({
				obj: null,  //jq对象，要在那个html标签上显示
				str: "",  //字符串，要显示的内容;
				startSize: "0.4rem",  //动画开始的文字大小
				endSize: "1.5rem",    //动画结束的文字大小
				interval: 1000,  //动画时间间隔
				color: "red",    //文字颜色
				callback: function () { }    //回调函数
			}, options);
			$(".fabulous_box").append("<span class='num'>" + options.str + "</span>");
            var box = $(".num");  
            console.log("obj",box)
			box.css({
				"position": "absolute",
                "top": -40 + "px",
                "left": 50+'%',
				"z-index": 9999,
				"font-size": options.startSize,
				"line-height": options.endSize,
				"color": options.color
            });
            box.animate({
				"font-size": options.endSize,
				"opacity": "0",
				"top": -100 - parseInt(options.endSize) + "px"
			}, options.interval, function () {
				box.remove();
				options.callback();
            });
            console.log("dong",box.animate())
        }
        //判断是否是编辑界面
        if(!isDesign){
            try{          
                Utils.getToken(function(result){ 
                    var session_id = result.session_id;
                    Utils.isWxMini(function (matched) {
                        var type =  matched ? 'weapp' : (!!Utils.isWX() ? 'wx' : 'pc');
                        if(type=="pc"){
                            return
                        }else{
                            $.ajax({ //初始化获取点赞信息
                                type: "GET",
                                url: (lanh.apiHost || lanh.httpConfig.apiHost).replace(/:\d+/g, '') + "thumbup/getCount?manuscriptId=" + (lanh.kid || getManuscriptId()) + "&session_id=" + session_id,
                                contentType: "application/json",
                                dataType: "json",
                                headers: {session_id: session_id},
                                success: function (result) {
                                    if (result.status == 0) {
                                        var current = result.data.current,
                                        total = result.data.total;
                                        if(current > 0){
                                            $element.find('.show-text').text(convertJoinCount(total)==0?text:'+' + convertJoinCount(total));
                                        }else{
                                            $element.find('.show-text').text(text);
                                        }
                                    }
                                },
                                error: function(){
                                    console.log("失败")
                                }
                            });
                            $element.find('.item').unbind('click').bind('click', function () { //点赞按钮
                                if (!(Utils.getPlatform() !== "pc" || (Utils.getPlatform() === "pc" && Utils.isWX())) && !!Utils.myforwardKey) {
                                    Utils.simpleMsg('尚未进行微信授权，请稍后！');
                                    return false;
                                };
                    
                                var emplId = Utils.getQueryString('rootUserId') || Utils.getQueryString('userId');
                                $.ajax({
                                    type: "POST",
                                    url: (lanh.apiHost || lanh.httpConfig.apiHost).replace(/:\d+/g, '') + "thumbup/add?session_id=" + session_id,
                                    contentType: "application/json",
                                    dataType: "json",
                                    headers: {session_id: session_id},
                                    data: JSON.stringify({
                                        "emplId": emplId,
                                        "manuscriptId": lanh.kid || getManuscriptId(),
                                        "clientType": matched ? 'weapp' : (!!Utils.isWX() ? 'wx' : 'pc'),
                                        "rootUserId": Utils.getQueryString('rootUserId') || Utils.getQueryString('userId')
                                    }),
                                    success: function (result) {
                                        if (result.status == 0) {
                                            if(result.data.isSuccess) {//成功点赞
                                                var total = result.data.total;
                                                $element.find('.show-text').text(convertJoinCount(total)==0?text:'+' + convertJoinCount(total));
                                                tipsBox({
                                                    obj: $('.item'),
                                                    str: "+1",
                                                    callback: function () {
                                                    }
                                                });
                                                //埋点
                                                Utils.buryingPoint({indexType: 'user_click', timeStamp: new Date().getTime(),extType: 'thumbup' });
                                            } else {
                                                Utils.simpleMsg('请勿重复点赞!')
                                            }
                                        }
                                    },
                                    error: function(){
                                        Utils.simpleMsg("已经点过赞了哟!")
                                    }
                                });
                            })
                        }
                    }) 
                })
            }catch(err){
                console.log(err)
            }
        }   
    })
})($("div[id='_panelId_']"));