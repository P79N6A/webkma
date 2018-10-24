(function ($element) {
    (function($){
        var relationId = $("#main_id").val();

        var defult = {
            'hP':[{'originL':'67.7083%','originT':'19.01234%','L':'56.25%','T':'31.67%'},
                  {'originL':'72.5%','originT':'15.77846%','L':'68.9583%','T':'21.86311%'},
                  {'originL':'64.7916%','originT':'0%','L':'56.0416%','T':'6.17283%'},
                  {'originL':'69.54887%','originT':'0%','L':'66.7293%','T':'12.285714%'},
                  {'originL':'66.66666%','originT':'0%','L':'59.72222%','T':'10%'}]
        };
        $.HitGoldenEggs = function(){};
        $.HitGoldenEggs.prototype.init = function(oParent,opt){
            var _this = this;
            _this.s = $.extend(defult,opt||{});
            this.wrap = $(oParent);
            _this.style = Number(_this.wrap.attr('data-style'));
            this.handleEvent();
            //默认数据
            _this.fromSetting = {
                signup: [
                    {
                      "type": "text",
                      "category": "default",
                      "name": "姓名",
                      "fixed": true
                    },
                    {
                      "type": "text",
                      "category": "phone",
                      "name": "手机",
                      "fixed": true
                    }
                ],
                auction: [
                    {
                      "type": "text",
                      "category": "default",
                      "name": "姓名",
                      "fixed": true
                    },
                    {
                      "type": "text",
                      "category": "phone",
                      "name": "手机",
                      "fixed": true
                    }
                ],
                signupfontColor: "#ffffff",
                signupbackColor: "#3898EC",
                signupText: "提交",
                AuctionfontColor: "#ffffff",
                AuctionbackColor: "#3898EC",
                AuctionText: "提交"
            };
            window['_lotter'].getPluginSetting({
                relationId: relationId,
                activePluginType: 4,
                callback: function(){
                    $.ajax({
                        type:'GET',
                        url:lanh.apiHost + "httpserver/kem/activeplugin/loadoptions",
                        data:'relationId='+ relationId +'&activePluginType=4',
                        contentType: "application/json",
                        async: true,
                        dataType: "json",
                        success:function(result){
                            if(result.code == 0){
                                // 弹窗信息初始化
                                // 中奖信息采集
                                _this.fromSetting = !!result.data.formSetting ? JSON.parse(result.data.formSetting) : _this.wrap.attr('data-fromSetting');
                                
                                _this.isInTime = result.data.drawPrizeTime == 3 ? true:false;
                                _this.cantDrawText = result.data.drawPrizeTime == 1 ? "还没有到抽奖时间哦~":(result.data.drawPrizeTime == 2 ?"来晚了，抽奖结束了哦~":'');
                            }else if(result.code == 3){
                                _this.cantUse = true;
                                _this.cantDrawText = "插件未进行设置，不能抽奖！";
                            }    
                        }
                    })
                }
            });
        }
         $.HitGoldenEggs.prototype.handleEvent = function(){
            var _this = this;
            _this.hammer = _this.wrap.find('.hammer');
            _this.eggWrap = _this.wrap.find('.egg-wrap');
            _this.canClick = true;
            function run(){
                if(_this.canClick == false){
                    return false;
                }
                window.$$name = !!window.luckyPrize ? window.luckyPrize.name : null;
                window.$$phone = !!window.luckyPrize ? window.luckyPrize.phone : null;
                if( !!$$name && !!$$phone ){//从sessionStorage里取姓名，手机号
                     var $data = {
                                    'relationId': relationId,
                                    'name': window.$$name,
                                    'phone': window.$$phone
                                }
                    _this.canClick = false;
                    $.ajax({//请求接口,处理刮奖结果
                        url: lanh.apiHost + "httpserver/kem/activeplugin/drawprize",
                        method: "POST",
                        contentType: "application/json",
                        dataType: "json",
                        data: JSON.stringify($data),
                        success: function (result) {
                            if(result.code != 0 ){
                                alert(result.desc);
                                _this.init($element.find('#wrap'),{});
                                window.setTimeout(function(){ _this.canClick = true;},3000);
                                _this.eggWrap.removeClass('open').addClass('close');
                                return false;
                            }

                            $(_this.hammer).animate({'left':_this.s.hP[_this.style-1].L,'top':_this.s.hP[_this.style-1].T},300,function(){
                                _this.eggWrap.removeClass('close').addClass('open');
                                $(_this.hammer).animate({'left':_this.s.hP[_this.style-1].originL,'top':_this.s.hP[_this.style-1].originT},300,function(){
                                    if(result.data.optionId>0){//中奖
                                        var promtClass = $element.find('div').attr('data-promt');
                                        var $pcPrizeArr = [{'type':'optionName','name':'奖 项','val':result.data.optionName},
                                                           {'type':'prizeName','name':'奖 品','val':result.data.prizeName},
                                                           {'type':'prizeNo','name':'兑 奖 码','val':result.data.prizeNo}];

                                        if(!!result.data.merchangePhone){
                                            $pcPrizeArr.push({'type':'merchangePhone','name':'商家电话','val':result.data.merchangePhone});
                                        }

                                        window.alert({
                                            'class':promtClass,
                                            'prize': result.data.optionName,
                                            'pcPrizeArr': $pcPrizeArr,
                                            'hideCallback':function(){
                                                _this.init($element.find('#wrap'),{});
                                                _this.canClick = true;
                                                _this.eggWrap.removeClass('open').addClass('close');
                                            },
                                            'callback':function($alert){
                                                $alert.hide();
                                                window._lotter.submitprizeinfo({
                                                    manuscriptId: relationId,
                                                    promtClass: promtClass,
                                                    fromSetting: _this.fromSetting,
                                                    $pcPrizeArr: $pcPrizeArr,
                                                    initDataName: window.$$name,
                                                    initDataPhone: window.$$phone,
                                                    promptHideFn:function(){
                                                        _this.init($element.find('#wrap'),{});
                                                        _this.canClick = true;
                                                        _this.eggWrap.removeClass('open').addClass('close');
                                                    }
                                                })
                                            }
                                        });
                                    }else{//未中奖
                                        var promtClass = $element.find('div').attr('data-promt');
                                        window.alert({
                                            'class':promtClass,
                                            'callback':function(){
                                                _this.init($element.find('#wrap'),{});
                                                _this.canClick = true;
                                                _this.eggWrap.removeClass('open').addClass('close');
                                            }
                                        });
                                    }
                                });
                            })     
                        }
                    });
                }else{
                    if(_this.isInTime == false || _this.cantUse == true){//不在活动时间
                        alert(_this.cantDrawText);
                        return false;
                    }
                    var promtClass = $element.find('div').attr('data-promt');
                    window._lotter.saveuserinfo({
                        manuscriptId: relationId,
                        promtClass: promtClass,
                        fromSetting: _this.fromSetting
                    })
                }
            }
            _this.hammer.unbind('click').bind('click',function(){run();});
            _this.eggWrap.unbind('click').bind('click',function(){run();});
        }
        
    })($);
    
    $(function () {
        var d1 = new $.HitGoldenEggs();
        d1.init($element.find('#wrap'),{});   
    });
})($("div[id='_panelId_']"));