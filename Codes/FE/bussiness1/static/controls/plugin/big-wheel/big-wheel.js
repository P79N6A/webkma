(function ($element) {
	(function($){
        var relationId = $("#main_id").val();

        var defult = {
            'color':['#fcf1ef','#ffffff','#ffef3d'],
            'prize':[],
            'rotNum': 15,
            'target': -1
        };
        $.BigWheel = function(){};
        $.BigWheel.prototype.init = function(oParent,opt){
            var _this = this;
            this.s = $.extend(defult,opt||{});
            this.wrap = $(oParent);
            _this.style = _this.wrap.attr('data-style');
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
            
            switch( _this.style ){
                case '1':_this.s.color = ['#fcf1ef','#ffffff','#ddb4a3'];
                    _this.btnPosi = {
                        'x': _this.wrap.width()/2 - _this.wrap.width()/6,
                        'y': _this.wrap.height()/2 - _this.wrap.height()/5-_this.wrap.height()/21,
                        'width': _this.wrap.width()/3,
                        'height': 2*_this.wrap.height()/5
                    }
                    break;
                case '2':_this.s.color = ['#ef3952','#f26175','#ffffff'];
                    _this.btnPosi = {
                        'x': _this.wrap.width()/2 - _this.wrap.width()/6,
                        'y': _this.wrap.height()/2 - _this.wrap.height()/6,
                        'width': _this.wrap.width()/3,
                        'height': _this.wrap.height()/3
                    }
                    break;
                case '3':_this.s.color = ['#f8ecb8','#fffcec','#ff9588'];
                    _this.btnPosi = {
                        'x': _this.wrap.width()/2 - _this.wrap.width()/6,
                        'y': _this.wrap.height()/2 - _this.wrap.height()/5+_this.wrap.height()/60,
                        'width': _this.wrap.width()/3,
                        'height': 11*_this.wrap.height()/30
                    }
                    break;
                case '4':_this.s.color = ['#ffedd7','#fffffd','#e69b7c'];
                    _this.btnPosi = {
                        'x': _this.wrap.width()/2 - _this.wrap.width()/6,
                        'y': _this.wrap.height()/2 - _this.wrap.height()/5-_this.wrap.height()/15,
                        'width': _this.wrap.width()/3,
                        'height': 13*_this.wrap.height()/30
                    }
                    break;
                case '5':_this.s.color = ['#92dad6','#e6f6f5','#c79d85'];
                    _this.btnPosi = {
                        'x': _this.wrap.width()/2 - _this.wrap.width()/6,
                        'y': _this.wrap.height()/2 - _this.wrap.height()/5,
                        'width': _this.wrap.width()/3,
                        'height': 11*_this.wrap.height()/30
                    }
                    break;
                case '6':_this.s.color = ['#f2f2f2','#ffffff','#a9a9a9'];
                    _this.btnPosi = {
                        'x': _this.wrap.width()/2 - _this.wrap.width()/6,
                        'y': _this.wrap.height()/2 - _this.wrap.height()/5-_this.wrap.height()/14,
                        'width': _this.wrap.width()/3,
                        'height': 13*_this.wrap.height()/30
                    }
                    break;
            }
            window['_lotter'].getPluginSetting({
                relationId: relationId,
                activePluginType: 3,
                callback: function(){
                    $.ajax({
                        type:'GET',
                        url:lanh.apiHost + "httpserver/kem/activeplugin/loadoptions",
                        data:'relationId='+ relationId +'&activePluginType=3&optionNumMin=4&isEven=true',
                        contentType: "application/json",
                        async: true,
                        dataType: "json",
                        success:function(result){
                            window.plugin_loadoption = true;
                            if(result.code == 0){
                                // 奖项初始化
                                _this.s.prize = [];
                                _this.prizeOptionIdArr = [];
                                $.each(result.data.list,function(index,item){
                                    _this.s.prize.push(item.optionName);//奖项数组
                                    _this.prizeOptionIdArr.push(item.optionId);//奖项id数组
                                });
                                // 弹窗信息初始化
                                // 中奖信息采集
                                _this.fromSetting = !!result.data.formSetting ? JSON.parse(result.data.formSetting) : _this.wrap.attr('data-fromSetting');
                                // 活动时间控制
                                _this.isInTime = result.data.drawPrizeTime == 3 ? true:false;
                                _this.cantDrawText = result.data.drawPrizeTime == 1 ? "还没有到抽奖时间哦~":(result.data.drawPrizeTime == 2 ?"来晚了，抽奖结束了哦~":'');
                            }else if(result.code == 3){
                                _this.cantUse = true;
                                _this.cantDrawText = "插件未进行设置，不能抽奖！";
                                _this.s.prize = "未设置$未设置$未设置$未设置$未设置$未设置$未设置$未设置".split("$");
                                _this.prizeOptionIdArr = _this.wrap.attr("data-prizeOptionIdArr").split("$");
                            }
                            
                            //此处开始请求接口创建奖项模块;
                            _this.count = _this.s.prize.length;
                            _this.creatPlugin();
                            _this.handle();
                            
                        }
                    })
                }
            });
            
        }
        $.BigWheel.prototype.creatPlugin = function(){
            // 绘制扇区
            var _this = this;
            if(!!_this.wrap.find('#myCanvas')){
                _this.wrap.find('#myCanvas').remove();
            }
            _this.canvas = $('<canvas id="myCanvas">抱歉！浏览器不支持。</canvas>');
            _this.ctx = _this.canvas[0].getContext('2d');
            _this.canvas[0].width = _this.wrap.width();
            _this.canvas[0].height = _this.wrap.height();
            _this.wrap.append(_this.canvas);
            // 位移到圆心，方便绘制
            _this.ctx.translate(_this.wrap.width()/2,_this.wrap.height()/2);
            _this.ctx.arc(0,0,_this.wrap.width()/2, 0, 2*Math.PI, false);
            _this.ctx.clip();
            createCircle();//创建扇区
            fillPrize();
            //扇区
            function createCircle(){
                var startAngle = 0;//扇形的开始弧度
                var endAngle = 0;//扇形的终止弧度
                for (var i = 0; i< _this.s.prize.length; i++){
                    _this.ctx.moveTo(0, 0);
                    startAngle = i*2*Math.PI/_this.count + Math.PI/2;
                    endAngle = startAngle+2*Math.PI/_this.count;
                    _this.ctx.save();
                    _this.ctx.beginPath();
                    _this.ctx.arc(0,0,_this.wrap.width()/2, startAngle, endAngle, false);
                    _this.ctx.lineWidth = _this.wrap.width();
                    if (i%2 == 0) {
                        _this.ctx.strokeStyle =  _this.s.color[0];
                    }else{
                        _this.ctx.strokeStyle =  _this.s.color[1];
                    }
                    _this.ctx.stroke();
                    _this.ctx.restore();
                }

            }
           
            //绘制奖项文字
            function fillPrize(){
                var total = _this.count;
                for(var i=0;i<total;i++){
                    _this.ctx.save();
                    _this.ctx.textAlign='start';
                    _this.ctx.textBaseline='middle';
                    _this.ctx.fillStyle = _this.s.color[2];
                    _this.ctx.beginPath();
                    var step = total%4 == 0? i*2*Math.PI/total+2*Math.PI/(total*2)-Math.PI/2:i*2*Math.PI/total-Math.PI/2+2*Math.PI/(total*2);
                    var pix = _this.wrap.width()/20;
                    _this.ctx.rotate(step);
                    _this.ctx.font = pix + "px Microsoft YaHei";
                    _this.ctx.fillStyle = _this.s.color[2];
                    _this.ctx.fillText(_this.s.prize[i],_this.wrap.width()/4,0,100);
                    _this.ctx.closePath();
                    _this.ctx.restore();

                }
            }

        }

        $.BigWheel.prototype.handle = function(){
            var _this = this;

            this.isCanClick = true;//是否开启下一次抽奖
            _this.canvas2 = _this.wrap.find('#myCanvas2');
            _this.canvas2.unbind('click').bind('click', function() {
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
                                _this.s.target = Math.ceil(index);
                            },5000)
                        }else{
                            //此处会请求接口获取后台应得的抽奖数据
                            var $data = {
                                    'relationId': relationId,
                                    'name': window.$$name,
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
                                        window.setTimeout(function(){ _this.isCanClick = true;},3000);
                                        _this.init($element.find('#wrap'),{}); 
                                        return false;
                                    };
                                    var fixErrorIndex = -1;  //补丁变量，防止接口出错
                                    $.each(_this.prizeOptionIdArr,function(index,item){
                                        if( _this.s.target == -1 ){
                                            if( Number(item)<=0 ){//这个操作是为了弥补接口出错而做
                                                fixErrorIndex = index+1;
                                            }
                                            if(Number(item) == Number(result.data.optionId)){
                                                _this.s.target = index+1;
                                                fixErrorIndex = -1;
                                            }
                                        }   
                                    });
                                    if(_this.s.target == -1){
                                        _this.s.target = fixErrorIndex;
                                    }

                                    _this.angles = -1080-_this.s.target*360/_this.count+360/(2*_this.count);
                                    var degValue = 'rotate('+_this.angles+'deg'+')';
                                    _this.canvas.css('-o-transform',degValue);           //Opera
                                    _this.canvas.css('-ms-transform',degValue);          //IE浏览器
                                    _this.canvas.css('-moz-transform',degValue);         //Firefox
                                    _this.canvas.css('-webkit-transform',degValue);      //Chrome和Safari
                                    _this.canvas.css('transform',degValue);

                                    setTimeout(function(){//抽完奖
                                        if(result.data.optionId>0 && fixErrorIndex == -1){//中奖
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
                                                'hideCallback': function(){
                                                    _this.s.target = -1;  
                                                    _this.isCanClick = true;
                                                    _this.init($element.find('#wrap'),{}); 
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
                                                            _this.s.target = -1;  
                                                            _this.isCanClick = true;
                                                            _this.init($element.find('#wrap'),{}); 
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
                                                    _this.s.target = -1; 
                                                    _this.isCanClick = true; 
                                                }
                                            });
                                        }

                                    },3000);
                    
                                }

                            });
                        }
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
		var d1 = new $.BigWheel();
        d1.init($element.find('#wrap'),{});   
    });
})($("div[id='_panelId_']"));