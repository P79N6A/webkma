(function ($element) {
	(function($){
        var relationId = $("#main_id").val();

        var defult = {
            'prize':'谢谢参与',
            'callback':function(){console.log('end')}
        };
        $.Guaguale = function(){};
        $.Guaguale.prototype.init = function(oParent,opt){
            var _this = this;
            defult = $.extend(defult,opt||{});
            this.wrap = $(oParent);
            this.creatCoating();//创建涂层
            //默认数据，主要提供给以前的线上抽奖模块使用
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
                activePluginType: 2,
                callback: function(){
                    $.ajax({
                        type:'GET',
                        url:lanh.apiHost + "httpserver/kem/activeplugin/loadoptions",
                        data:'relationId='+ relationId +'&activePluginType=2',
                        contentType: "application/json",
                        async: true,
                        dataType: "json",
                        success:function(result){
                            window.plugin_loadoption = true;
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
        $.Guaguale.prototype.creatCoating = function(){

            var _this = this;
            _this.$canvas = $('<canvas width="'+(this.wrap.width()+1)+'" hight="'+this.wrap.height()+'" ></canvas>');
            _this.$canvas.css({
                position:'absolute',
                top:0,
                left:0
            })
            _this.$canvas[0].width = this.wrap.width();
            _this.$canvas[0].height = this.wrap.height();
            _this.wrap.append(_this.$canvas);
            _this.ctx = _this.$canvas[0].getContext('2d');

            var objImg = new Image();
            objImg.src = _this.wrap.attr('data-coating');
            objImg.onload = function(){
                _this.ctx.drawImage(objImg,0 ,0,_this.wrap.width(),_this.wrap.height());
                _this.handleEvent();//绑定事件
            }

        }
        $.Guaguale.prototype.handleEvent = function(){
            var _this = this;
            _this.mousedown = false;
            _this.timer = null;
            _this.isDone = false;//是否刮完奖

            var downFn = function(e){
                e.preventDefault();
                window.$$name = !!window.luckyPrize ? window.luckyPrize.name : null;
                window.$$phone = !!window.luckyPrize ? window.luckyPrize.phone : null;
                if( !!window.$$name && !!window.$$phone ){//从sessionStorage里取姓名，手机号
                    _this.wrap.find('.text').html('奖品正在飞奔而来…');
                    if(_this.isDone == true){
                        return false;
                    }
                    _this.mousedown=true;
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
            var upFn = function(e){
                e.preventDefault();
                _this.mousedown=false;
            }
            var moveFn = function(e){
                var bBtn = true;
                e.preventDefault();
                if(_this.mousedown) {
                    if(_this.isBreak == true){
                        return false;
                    }
                    if(e.changedTouches){
                        e=e.changedTouches[e.changedTouches.length-1];
                    }

                    var x = e.pageX - _this.$canvas.offset().left || 0,
                        y = e.pageY - _this.$canvas.offset().top || 0;
                    with(_this.ctx) {
                        _this.ctx.beginPath();
                        _this.ctx.lineWidth = 40;
                        _this.ctx.lineCap = 'round';
                        //代码注释：绘制擦除轨迹。
                        if(bBtn){
                            bBtn = false;
                            _this.ctx.moveTo(x,y);
                            _this.ctx.lineTo(x+1,y+1);
                        }else{
                            _this.ctx.lineTo(x,y);
                        }
                        
                        _this.ctx.stroke();
                        _this.ctx.closePath();
                    }
                    moveEnd();
                }
            }
            var moveEnd = function(){
                var dataImg = _this.ctx.getImageData(0,0,_this.$canvas[0].width,_this.$canvas[0].height);
                var allPx = dataImg.width * dataImg.height;
                var iNum = 0;
                _this.isDone = false;
                for(var i=0;i<allPx;i++){
                    if(dataImg.data[i*4+3] == 0){
                        iNum++;
                    }
                }
                if( iNum > allPx/4 ){
                    var $data = {
                                    'relationId': relationId,
                                    'name': window.$$name,
                                    'phone': window.$$phone
                                }
                    if(_this.mousedown == true && _this.isDone == false){
                        _this.mousedown = false;
                        $.ajax({//请求接口,处理刮奖结果
                            url: lanh.apiHost + "httpserver/kem/activeplugin/drawprize",
                            method: "POST",
                            contentType: "application/json",
                            dataType: "json",
                            data: JSON.stringify($data),
                            success: function (result) {
                                if(result.code != 0 ){
                                    alert(result.desc);
                                    _this.$canvas.remove();
                                    _this.init($element.find('#wrap'),{});
                                    return false;
                                }

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
                                        'hideCallback': function(){ 
                                            _this.$canvas.remove();
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
                                                    _this.$canvas.remove();
                                                    _this.init($element.find('#wrap'),{});
                                                }
                                            })
                                        }
                                    });
                                    _this.isDone = true;
                                }else{//未中奖
                                    var promtClass = $element.find('div').attr('data-promt');
                                    window.alert({
                                        'class':promtClass,
                                        'callback':function(){
                                            _this.$canvas.remove();
                                            _this.init($element.find('#wrap'),{});
                                        }
                                    });
                                    _this.isDone = true;
                                }
                                      
                            }
                        });
                    }
                    
                    defult.callback && defult.callback();
                }
            }
            _this.ctx.globalCompositeOperation = 'destination-out';

            _this.$canvas[0].addEventListener('touchstart', downFn);
            _this.$canvas[0].addEventListener('touchend', upFn);
            _this.$canvas[0].addEventListener('touchmove', moveFn);
            _this.$canvas[0].addEventListener('mousedown', downFn);
            _this.$canvas[0].addEventListener('mouseup', upFn);
            _this.$canvas[0].addEventListener('mousemove', moveFn);
        }
    })($);
    
    $(function () {
		var d1 = new $.Guaguale();
        d1.init($element.find('#wrap'),{});   
    });
})($("div[id='_panelId_']"));