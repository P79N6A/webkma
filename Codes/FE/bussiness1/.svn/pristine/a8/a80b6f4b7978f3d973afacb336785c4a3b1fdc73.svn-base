(function ($element) {
    $(function () {
        var voteObj = $element.find('.vote');
        var numArr = $element.find('.vote-num');
        var btnArr = $element.find('.submit');
        var voteAfterBtn = !!voteObj.attr('data-afterbtn') ? JSON.parse(voteObj.attr('data-afterbtn')) : '';
        var isDesign = location.href.indexOf('/design?') != -1;
        var controlId = $element.attr('id') || voteObj.attr('data-controlId');

        var _init = function(mock){
            if(!mock.isVote){
                btnArr.attr('voted', true);
            } else {
                btnArr.removeAttr('voted');
            }
            $.each(mock.voteList, function(index, item){
                numArr.eq(index).text(item.voteNum);
                if(!mock.isVote && item.status == 1){ //不可投票，保留上次状态
                    btnArr.eq(index).text(voteAfterBtn.text).css({
                        'background-color': voteAfterBtn.bg,
                        'color': voteAfterBtn.color
                    });
                }
            });
            voteObj.show();
        }
        function queryStatus(){
            if(!isDesign){//请求接口查询状态
                try{
                    Utils.getToken(function(result){
                        Utils.isWxMini(function (matched) {
                            var clientType = matched ? 'weapp' : (!!Utils.isWX() ? 'wx' : 'pc');
                            $.ajax({
                                type: "GET",
                                url: lanh.apiHost.replace(/:\d+/g, '') + "activity/plugin/vote/status?session_id=" + result.session_id + "&relationId="+ lanh.kid +"&controlId=" + controlId + "&clientType=" + clientType,
                                contentType: "application/json",
                                dataType: "json",
                                headers: {session_id: result.session_id},
                                success: function (result1) {
                                    if (result1.status == 0) {
                                        _init(result1.data);
                                    }
                                }
                            });
                        });
                    })
                }catch(err){
                    console.log(err)
                }
                
                
            } else {
                voteObj.show();
            }
        }
        queryStatus();

        btnArr.unbind('click').bind('click', function(){
            var self = this;
            try {
                if (!(Utils.getPlatform() !== "pc" || (Utils.getPlatform() === "pc" && Utils.isWX())) && !!Utils.myforwardKey){
                    Utils.simpleMsg('尚未进行微信授权，请稍后！');
                    return false;                    
                }
                if($(this).attr('voted')){
                    Utils.simpleMsg('您已投票！');
                    return false;
                } 
                
                Utils.getToken(function(result){
                    Utils.isWxMini(function (matched) {
                        $.ajax({
                            type: "POST",
                            url: lanh.apiHost.replace(/:\d+/g, '') + "activity/plugin/vote?session_id=" + result.session_id,
                            contentType: "application/json",
                            dataType: "json",
                            headers: {session_id: result.session_id},
                            data:  JSON.stringify({
                                "relationId": lanh.kid,
                                "controlId": controlId,
                                "sort": $(self).attr('data-index'),
                                "shareId": Utils.getQueryString('rootUserId') || '',
                                "clientType": matched ? 'weapp' : (!!Utils.isWX() ? 'wx' : 'pc'),
                                "rootUserId": Utils.getQueryString('rootUserId') || Utils.getQueryString('userId')
                            }),
                            success: function (result1) {
                                if (result1.status == 0) {
                                    Utils.simpleMsg('投票成功！');                                             
                                    queryStatus();
                                    Utils.buryingPoint({indexType: 'user_click', timeStamp: new Date().getTime(),extType: 'vote' });                                                                 
                                } else {
                                    Utils.simpleMsg(result1.message);
                                }
                            },
                            error: function(err){
                                Utils.simpleMsg(JSON.parse(err.responseText).message);
                            }
                        });
                    })
                })
            } catch (err) {
    
            }
           
        })
        
        
    })
})($("div[id='_panelId_']"));