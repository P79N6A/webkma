(function () {
    window.lanh = window.lanh || {};
    $.extend(true, window.lanh, {
        utils: {
            getPlatform: function getPlatform() {
                var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
                var flag = "pc";
                var userAgent = navigator.userAgent;
                for (var v = 0, len = Agents.length; v < len; v++) {
                    if (userAgent.indexOf(Agents[v]) > 0) {
                        flag = "mobile";
                        break;
                    }
                }
                return flag;
            },
            //获取模板内容
            getTemplate: function(data, id){
                var reg1 = new RegExp('<script\\s+id="'+id+'"[^>]*?>[\\s\\S]*?<\\/script>','gi');

                return data.match(reg1)[0].replace(/<script[^>]*?>/,'').replace(/<\/script>/gi,'');
            },
            simpleMsg: function( errText, cb ){
                if(!errText) cb(false);
                var msgObj = $('#msg-model');
                msgObj.find('span').html(errText);
                msgObj.show();
                this.bindAnim(msgObj, 'bounceInDown');
                this.$setTimeout = setTimeout(function(){
                    msgObj.hide();
                    clearTimeout(this.$setTimeout);
                }, 2000);
                cb(false);
            },
            formValidation: function(objArr, cb){
                var self = this;
                var regObj = {
                    'phone': /^(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/,
                    'number': /^\d+$/i,
                    'email': /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/,
                    'identitycard': /(^\d{15}$)|(^\d{17}([0-9]|X)$)/i
                };
                for (var item of objArr) {
                    let type = item.type ? item.type : '',
                    value = !!item.value ? item.value : '',
                    reg = !!item.reg ? item.reg : '',
                    minLength = !!item.minLength ? item.minLength : '',
                    maxLength = !!item.maxLength ? item.maxLength : '',
                    maxValue = typeof (item.maxValue) == 'number' ? item.maxValue : '',
                    maxValueErr = !!item.maxValueErr ? item.maxValueErr : '',
                    emptyErr = !!item.emptyErr ? item.emptyErr : '',
                    regErr = !!item.regErr ? item.regErr : '',
                    lengthErr = !!item.lengthErr ? item.lengthErr : '';
                
                    if( !!type ){
                      switch ( type ) {
                        case 'phone':
                          reg = regObj.phone;
                        break;
                        case 'number':
                          reg = regObj.number;
                        break;
                        case 'email': 
                          reg = regObj.email;
                        break;
                        case 'identitycard': 
                          reg = regObj.identitycard;
                        break;
                      }
                    }
                
                    if ( value == '' || value == null ){//为空
                      self.simpleMsg( emptyErr, cb );
                      return;
                    } else if ( !!reg && !reg.test(value) ) {
                      self.simpleMsg( regErr, cb );
                      return;
                    } else if ((!!maxLength && value.length > maxLength) || (!!minLength && value.length < minLength)){
                      self.simpleMsg( lengthErr, cb );
                      return;
                    } else if (typeof (item.maxValue) == 'number' && maxValue < value ) {
                      self.simpleMsg(maxValueErr, cb);
                      return;
                    }
                }
                cb(true);
            },
            bindAnim: function(obj, x, callback){ //obj--要加动画的对象  x--动画类型，对应annimate.css里面的动画类型  callback--动画完毕的回调
                $(obj).addClass(x + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                    $(this).removeClass(x + ' animated');
                    !!callback && callback();
                });
            },
            openActivityReadme: function(key, config){//弹出活动说明
                var self = this;
                key = key || 'default';
    
                Promise.all([
                    new Promise(function(resolve, rej) {
                        $.get("../../../static/template/theme/default/tpl.html", function(data){
                            resolve(self.getTemplate(data, 'activity-readme'));
                        });
                    }), 
                    new Promise(function(resolve, rej) {//请求接口获取数据
                        resolve(0);
                    })
                ]).then(function(results){
                    layer.open({
                        type: 0,
                        anim: false,
                        title: ['<img style="width: auto;height: 1rem; vertical-align: middle;" src="../MidWay/public/images/h5/activity-readme.png"/>', "height: 1.28rem;line-height: 1.28rem; background-color: rgba(0, 204, 153, 0.3); color:#fff; background-image: url('../MidWay/public/images/h5/activity-readme-bg.png');background-size:100% 100%;"],
                        content: results[0],
                        className: "layer-activity-readme",
                        shade: 'background-color: rgba(0,0,0,.6)',
                        shadeClose: false,
                        success: function(elem){
                            var $closeBtn = $(elem).find('#close-btn');
                            var eventType = self.getPlatform() == "pc" ? 'click' : 'touchend';
                            self.bindAnim($('.layer-activity-readme'), 'bounceInDown');
                            $closeBtn.on(eventType, function() {
                                self.bindAnim($('.layer-activity-readme'), 'bounceOutUp', function(){
                                    layer.closeAll();
                                });
                            });
                        }
                    })
                }).catch(function(){});
            },
            openQrcode: function(key, config) {//弹出关注二维码
                var self = this;
                key = key || 'default';
    
                Promise.all([
                    new Promise(function(resolve, rej) {
                        $.get("../../../static/template/theme/default/tpl.html", function(data){
                            resolve(self.getTemplate(data, 'qrcode'));
                        });
                    }), 
                    new Promise(function(resolve, rej) {//请求接口获取数据
                        resolve(0);
                    })
                ]).then(function(results){
                    layer.open({
                        type: 0,
                        anim: false,
                        content: results[0],
                        className: "layer-qrcode",
                        shade: 'background-color: rgba(0,0,0,.6)',
                        success: function(elem){
                            self.bindAnim($('.layer-qrcode'), 'bounceInDown');
                        } 
                    })
                }).catch(function(){});
            },
            openWinningForm: function(key, config){
                var self = this,
                $wrap = $('#templates');
                config = {
                    prize: '超级无敌大冰箱一台14字',
                    formArr: [
                        {id: 'name', category: 'name', name: '收件人', fixed: true, value: ''},
                        {id: 'phone', category: 'phone', name: '电话号码', fixed: true, value: ''},
                        {id: 'adress', category: 'default', name: '地址', value: ''}
                    ],
                    goback: function(){}
                }
                Promise.all([
                    new Promise(function(resolve, rej) {
                        $.get("../../../static/template/theme/default/tpl.html", function(data){
                            resolve(self.getTemplate(data, 'winning-form'));
                        });
                    }), 
                    new Promise(function(resolve, rej) {//请求接口获取数据
                        resolve(0);
                    })])
                .then(function(results){
                    //组装数据，替换模板变量
                    var tpl = results[0].replace('${prize}', config.prize).replace('${formContent}', config.formArr.map(function (item, index) {
                        return `<p>
                                    <label class="small-font">${item.name}：</label>
                                    <input id="${item.id}" type="text" value="${item.value}"/>
                                </p>`;
                    }).join(''));

                    layer.open({
                        type: 0,
                        anim: false,
                        content: tpl,
                        className: "layer-winning",
                        shade: 'background-color: rgba(0,0,0,.6)',
                        shadeClose: false,
                        success: function(elem){
                            var $goBackBtn = $(elem).find('#goBack');
                            var $submitBtn = $(elem).find('#submit');
                            var eventType = self.getPlatform() == "pc" ? 'click' : 'touchend';
                            self.bindAnim($('.layer-winning'), 'bounceInDown');
                            $goBackBtn.on(eventType, function() {
                                self.bindAnim($('.layer-activity-readme'), 'bounceOutUp', function(){
                                    layer.closeAll();
                                });
                            });
                            $submitBtn.on(eventType, function() {
                                var arr = [];
                                $.each(config.formArr, function(index, item){
                                    var _obj = {
                                        'type': item.category,
                                        'value': $(elem).find('#' + item.id).val(),
                                        'emptyErr':'请填写' + item.name,
                                        'infoType': 'text_' + item.category,
                                        'infoName': item.name,
                                        'regErr':'请输入正确的' + item.name
                                    }
                                    if(item.category == 'name' && item.fixed){
                                        _obj['maxLength'] = 20;
                                        _obj['lengthErr'] = item.name + '不能超过20个字符';
                                        _obj['isName'] = true;
                                    }else if(item.category == 'phone' && item.fixed){
                                        _obj['isPhone'] = true;
                                    }else{
                                        _obj['maxLength'] = 100;
                                        _obj['lengthErr'] = item.name + '不能超过100个字符';
                                    }
                                    arr.push(_obj);
                                });
                                self.formValidation(arr, function(tag){
                                    if(!tag) return false;
                                    
                                })
                            });
                        }
                    })
                }).catch(function(){});
            },
            openWinningInfo: function(key, config){
                var self = this;
                config = {
                    prize: '超级无敌大冰箱一台14字',
                    formArr: [
                        {id: 'name', category: 'name', name: '收件人', fixed: true, value: '爱德华'},
                        {id: 'phone', category: 'phone', name: '电话号码', fixed: true, value: '13222222222'},
                        {id: 'adress', category: 'default', name: '地址', value: '广东省深圳市市中心西峰路埃德尔广场B座901室'}
                    ],
                    goback: function(){}
                }
                Promise.all([
                    new Promise(function(resolve, rej) {
                        $.get("../../../static/template/theme/default/tpl.html", function(data){
                            resolve(self.getTemplate(data, 'winning-info'));
                        });
                    }), 
                    new Promise(function(resolve, rej) {//请求接口获取数据
                        resolve(0);
                    })
                ]).then(function(results){
                    //组装数据，替换模板变量
                    var tpl = results[0].replace('${prize}', config.prize).replace('${formContent}', config.formArr.map(function (item, index) {
                        return '<p>'+
                                    '<label class="small-font">'+item.name+'：</label>'+
                                    '<span class="small-font">'+item.value+'</span>'+
                                '</p>';
                    }).join(''));
                    
                    layer.open({
                        type: 0,
                        anim: false,
                        content: tpl,
                        className: "layer-winning",
                        shade: 'background-color: rgba(0,0,0,.6)',
                        shadeClose: false,
                        success: function(elem){
                            var $focusBtn = $(elem).find('#focus');
                            var eventType = self.getPlatform() == "pc" ? 'click' : 'touchend';
                            self.bindAnim($('.layer-winning'), 'bounceInDown');
                            $focusBtn.on(eventType, function() {
                                self.openQrcode('');
                            });
                        }
                    })
                }).catch(function(){});
            },
            openNotWinning: function(key, config){//弹出未中奖
                var self = this;
                new Promise(function(resolve, rej) {
                    $.get("../../../static/template/theme/default/tpl.html", function(data){
                        resolve(self.getTemplate(data, 'not-winning'));
                    });
                }).then(function(result){
                    layer.open({
                        type: 0,
                        anim: false,
                        content: result,
                        className: "layer-winning",
                        shade: 'background-color: rgba(0,0,0,.6)',
                        shadeClose: false,
                        success: function(elem){
                            var $focusBtn = $(elem).find('#focus');
                            var eventType = self.getPlatform() == "pc" ? 'click' : 'touchend';
                            self.bindAnim($('.layer-winning'), 'bounceInDown');
                            $focusBtn.on(eventType, function() {
                                self.openQrcode('');
                            });
                        }
                    })
                })
            },
            // drawAnimation: function(key, config){//抽签动画
            //     var self = this;
            //     new Promise(function(resolve, rej) {
            //         $.get("../../../static/template/theme/default/tpl.html", function(data){
            //             resolve(self.getTemplate(data, 'draw'));
            //         });
            //     }).then(function(result){
            //         layer.open({
            //             type: 0,
            //             anim: false,
            //             content: result,
            //             className: "layer-draw",
            //             shade: 'background-color: rgba(0,0,0,.6)',
            //             shadeClose: false,
            //             success: function(elem){
            //                 var $startBtn = $(elem).find('#start');
            //                 var $closeBtn = $(elem).find('.closeBtn');
            //                 var eventType = self.getPlatform() == "pc" ? 'click' : 'touchend';
            //                 self.bindAnim($('.draw'), 'bounceInDown');
            //                 $startBtn.on(eventType, function() {
            //                     $startBtn.parent().addClass('start');
            //                 });
            //                 $closeBtn.on(eventType, function() {
            //                     self.bindAnim($('.draw'), 'bounceOutUp', function(){
            //                         layer.closeAll();
            //                     });
            //                 })
            //             }
            //         })
            //     })
            // },
            drawAnimation: function(key, config){//抽签动画
                var self = this;
                new Promise(function(resolve, rej) {
                    $.get("../../../static/template/theme/default/tpl.html", function(data){
                        resolve(self.getTemplate(data, 'challenge-suc'));
                    });
                }).then(function(result){
                    var tpl
                    layer.open({
                        type: 0,
                        anim: false,
                        content: result,
                        className: "layer-draw",
                        shade: 'background-color: rgba(0,0,0,.6)',
                        shadeClose: false,
                        success: function(elem){
                            // var $startBtn = $(elem).find('#start');
                            // var $closeBtn = $(elem).find('.closeBtn');
                            // var eventType = self.getPlatform() == "pc" ? 'click' : 'touchend';
                            // self.bindAnim($('.draw'), 'bounceInDown');
                            // $startBtn.on(eventType, function() {
                            //     $startBtn.parent().addClass('start');
                            // });
                            // $closeBtn.on(eventType, function() {
                            //     self.bindAnim($('.draw'), 'bounceOutUp', function(){
                            //         layer.closeAll();
                            //     });
                            // })
                        }
                    })
                })
            }
        }
    });
})();
