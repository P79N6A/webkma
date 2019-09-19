(function ($element) {
	(function($){
        var relationId = $("#main_id").val();
        console.log($("#main_id").val());
        var defult = {
            'speed': 100, //初始转动速度
            'manualControl': true, //是否开启手动控制
            'cycle': 50,//转动基本次数：即至少需要转动多少次再进入抽奖环节
            'times': 0,    //转动次数
            'deflutIndex': -1,//默认从那个奖品开始跑
            'target': -1,//目标奖品
            'arr': [0,1,2,4,7,6,5,3],//奖项数组
            'spacing': 10  //每个奖项间距
        };
        $.LuckyDraw = function(){};
        $.LuckyDraw.prototype.init = function(oParent,opt){
            var _this = this;
            this.s = $.extend(defult,opt||{});
            this.wrap = $(oParent);
            _this.promptTextArr = _this.wrap.attr('data-prompttextarr');
            _this.style = _this.wrap.attr('data-style');
            _this.startText = '';
            // 预置容器wrap的样式
            switch(_this.style){
                case '1': 
                    this.wrap.css({
                        'background-color':'#fff6e5',
                        'border-radius':'0 0 10px 10px',
                        'padding': '10px 10px'
                    });
                    _this.s.spacing = 0;
                    break; 
                case '2': 
                    this.wrap.css({
                        'padding': '8%'
                    });
                    _this.startText = '';
                    break;
                case '3': 
                    _this.startText = '立即抽奖';
                    break;
                    
                case '4': 
                    this.wrap.css({
                        'background-color':'#443232',
                        'border-radius':'10px',
                        'border':'5px solid #f5f2d0',
                        'padding': '10px'
                    });
                    break;
                case '5': 
                    this.wrap.css({
                        'border-radius':'10px',
                        'padding': '5%'
                    });
                    _this.s.spacing = 0;
                    break;
                case '6':
                    this.wrap.css({
                        'background-color':'#eef3fa',
                        'border-radius':'10px',
                        'border':'5px solid #fafcfe',
                        'padding': '10px'
                    }); 
                    break;
            }
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
                activePluginType: 1,
                callback: function(){
                    $.ajax({
                        type:'GET',
                        url:lanh.apiHost + "httpserver/kem/activeplugin/loadoptions",
                        data:'relationId='+ relationId +'&activePluginType=1&optionNum=8',
                        contentType: "application/json",
                        async: true,
                        dataType: "json",
                        success:function(result){
                            window.plugin_loadoption = true;
                            if(result.code == 0){
                                // 奖项初始化
                                var prizeArrStr = "";
                                var prizeOptionIdArr = "";
                                $.each(result.data.list,function(index,item){
                                    prizeArrStr += item.optionName + "$";//奖项字符串
                                    prizeOptionIdArr += item.optionId + "$";//奖项id字符串
                                });
                                _this.prizeData = prizeArrStr.split("$");
                                _this.prizeOptionIdArr = prizeOptionIdArr.split("$");
                                // 弹窗信息初始化
                                // 中奖信息采集
                                _this.fromSetting = !!result.data.formSetting ? JSON.parse(result.data.formSetting) : _this.wrap.attr('data-fromSetting');
                                // 活动时间控制
                                _this.isInTime = result.data.drawPrizeTime == 3 ? true:false;
                                _this.cantDrawText = result.data.drawPrizeTime == 1 ? "还没有到抽奖时间哦~":(result.data.drawPrizeTime == 2 ?"来晚了，抽奖结束了哦~":'');
                            }else if(result.code == 3){
                                _this.cantUse = true;
                                _this.cantDrawText = "插件未进行设置,不能抽奖！";
                                _this.prizeData = "未设置$未设置$未设置$未设置$未设置$未设置$未设置$未设置".split("$");
                                _this.prizeOptionIdArr = _this.wrap.attr("data-prizeOptionIdArr").split("$");
                            }
                            if( _this.prizeOptionIdArr.length>8 ){
                                _this.prizeOptionIdArr = _this.prizeOptionIdArr.slice(0,8);
                            }
                            //此处开始请求接口创建奖项模块
                            var wrapW = _this.wrap.width(),
                                wrapH = _this.wrap.height(),
                                divArr = [],
                                w = 0,
                                h = 0,
                                fontsize = 20;

                            w = (wrapW - 2*_this.s.spacing)/3 - 0.4;
                            h = (wrapH - 2*_this.s.spacing)/3 - 0.4;
                            
                            // 字体大小二度控制
                            if( wrapW < 320 ){//针对手机版，以及小宽度插件
                                fontsize = 12;
                            }
                            for(var i=0;i<9;i++){
                                if(i == 0){
                                    divArr.push('<div class="prize" style="width:'+w+'px;height:'+h+'px;line-height:'+(h-6)+'px;border:3px solid transparent;font-size:'+fontsize+'px;box-sizing:border-box;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"></div>');
                                }else if(i < 3 && i != 0){
                                    divArr.push('<div class="prize" style="width:'+w+'px;height:'+h+'px;margin-left:'+_this.s.spacing+'px;line-height:'+(h-6)+'px;border:3px solid transparent;font-size:'+fontsize+'px;box-sizing:border-box;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"></div>');
                                }else if(i == 4){
                                    divArr.push('<div class="start" style="width:'+w+'px;height:'+h+'px;margin-left:'+_this.s.spacing+'px;margin-top:'+_this.s.spacing+'px;line-height:'+(h-6)+'px;border:3px solid transparent;font-size:'+fontsize+'px;box-sizing:border-box;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">'+_this.startText+'</div>');
                                }else if(i==3 || i == 6){
                                    divArr.push('<div class="prize" style="width:'+w+'px;height:'+h+'px;margin-top:'+_this.s.spacing+'px;line-height:'+(h-6)+'px;border:3px solid transparent;font-size:'+fontsize+'px;box-sizing:border-box;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"></div>');
                                }else{
                                    divArr.push('<div class="prize" style="width:'+w+'px;height:'+h+'px;margin-left:'+_this.s.spacing+'px;margin-top:'+_this.s.spacing+'px;line-height:'+(h-6)+'px;border:3px solid transparent;font-size:'+fontsize+'px;box-sizing:border-box;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"></div>');
                                }     
                            }
                            _this.wrap.html(divArr.join(''));
                            _this.prizeArr = $(oParent).find('.prize');
                            _this.startBtn = $(oParent).find('.start');
                            _this.count = _this.prizeArr.length;
                            _this.index = _this.s.deflutIndex;
                            $.each(_this.s.arr,function(index,item){
                                _this.prizeArr.eq(item).html(_this.prizeData[index]);
                            })
                            if(_this.count == 0){
                                return false;
                            }
                            _this.prizeArr.eq(_this.s.arr[_this.index]).addClass('selected');
                            _this.handle();
                            
                        }
                    })
                }
            });  
               
        }
        $.LuckyDraw.prototype.run = function(){
            var index = this.index;
            var count = this.count;
            this.prizeArr.removeClass("selected");
            index += 1;
            if (index>count-1) {
                index = 0;
            };
            this.prizeArr.eq(this.s.arr[index]).addClass("selected");
            this.index=index;
            return false;
        }

        $.LuckyDraw.prototype.handle = function(){
            var _this = this;
            this.isCanClick = true;//是否开启下一次抽奖

            var roll = function roll(){
                _this.s.times += 1;
                _this.run();//第一次调用初始化，因为index初始值为-1
                if (_this.s.times > _this.s.cycle+10 && _this.s.target==_this.index) {
                    clearTimeout(_this.timer);
                    _this.s.target = -1;
                    _this.s.times = 0;
                    _this.s.speed = 100;
                    _this.isCanClick = true;
                    _this.isDone = true;
                }else{
                    if (_this.s.times<_this.s.cycle) {
                        _this.s.speed -= 10;
                    }else if(_this.s.target != -1){
                        if (_this.s.times > _this.s.cycle+10 && ((_this.s.target==0 && _this.index==7) || _this.s.target==_this.index+1)) {
                            _this.s.speed += 110;
                        }else{
                            _this.s.speed += 20;
                        }
                    }
                    if (_this.s.speed<40) {
                        _this.s.speed=40;
                    };
                    _this.timer = setTimeout(roll,_this.s.speed);//循环调用
                }
                return false;
            }

            _this.startBtn.unbind('click').bind('click', function() {
                window.$$name = !!window.luckyPrize ? window.luckyPrize.name : null;
                window.$$phone = !!window.luckyPrize ? window.luckyPrize.phone : null;
                if( !!window.$$name && !!window.$$phone ){//从sessionStorage里取姓名，手机号
                    if(_this.isCanClick == false){
                        return false;
                    }else{
                        _this.isCanClick = false;
                        if(_this.s.manualControl == false){
                            setTimeout(function(){
                                var index = Math.random()*(_this.count)|0;
                                _this.s.target = index;
                            },5000)
                        }else{
                            //此处会请求接口获取后台应得的抽奖数据
                            var $data = {
                                    'relationId': relationId,
                                    'name': window.$$name ,
                                    'phone': window.$$phone
                            }

                            $.ajax({//请求接口,处理抽奖结果
                                url: lanh.apiHost + "httpserver/kem/activeplugin/drawprize",
                                method: "POST",
                                contentType: "application/json",
                                dataType: "json",
                                data: JSON.stringify($data),
                                success: function (result) {
                                    if(result.code != 0 ){
                                        alert(result.desc);
                                        _this.prizeArr.removeClass("selected");
                                        clearTimeout(_this.timer);
                                        clearTimeout(_this.timer1);
                                        window.setTimeout(function(){ _this.isCanClick = true;},3000);
                                        _this.init($element.find('#wrap'),{}); 
                                        return false;
                                    };
                                    var fixErrorIndex = -1;  //补丁变量，防止接口出错
                                    $.each(_this.prizeOptionIdArr,function(index,item){
                                        if( _this.s.target == -1 ){
                                            if( Number(item)<=0 ){//这个操作是为了弥补接口出错而做
                                                fixErrorIndex = index;
                                            }
                                            if(Number(item) == Number(result.data.optionId)){
                                                _this.s.target = index;
                                                fixErrorIndex = -1;
                                            }
                                        }   
                                    });
                                    if(_this.s.target == -1){
                                        _this.s.target = fixErrorIndex;
                                    }  
                                    clearInterval(_this.timer1);
                                    _this.timer1 = setInterval(function(){
                                        if(_this.isCanClick){//抽完奖
                                            debugger;
                                            if(result.data.optionId>0 && fixErrorIndex == -1){//中奖
                                                clearInterval(_this.timer1);
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
                                                        _this.wrap.removeClass('open').addClass('close');
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
                                                            }
                                                        })
                                                    }
                                                });  
                                            }else{//未中奖
                                                var promtClass = $element.find('div').attr('data-promt');
                                                window.alert({
                                                    'class':promtClass
                                                });
                                                clearInterval(_this.timer1);
                                            }

                                            
                                        }
                                    },1000);
                                }

                            });
                        }
                        roll();
                        return false;
                    }                                       
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
            })
        }
    })($);

    $(function () {
		var d1 = new $.LuckyDraw();
        d1.init($element.find('#wrap'),{});   
    });
})($("div[id='_panelId_']"));