!function (global) {
    var globalCache = {
        readyFuncs: [],
        destroyFuncs: [],
        flipFuncs: []
    },
        emptyFn = function () { },
        userAgent = navigator.userAgent;

    global.Utils = {
        pluginConfig: {},
        apiConfig: '',
        secret_key: 'e00a05cf37305a22ba10fec428b4ab01',
        shopHost: 'https://kshoptest-wap.tuixb.cn/' || 'https://kshop-wap.tuixb.cn/',
        getPlatform: function getPlatform() {
            var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
            var flag = "pc";
            for (var v = 0, len = Agents.length; v < len; v++) {
                if (userAgent.indexOf(Agents[v]) > 0) {
                    flag = "mobile";
                    break;
                }
            }
            return flag;
        },
        isWX: function isWX() {
            if (/(micromessenger)\/([\w\.]+)/i.test(userAgent) && !/miniprogram/i.test(userAgent)) {
                return true;
            }
            return false;
        },
        isMiniprogram: function isMiniprogram() {
            if (/(micromessenger)\/([\w\.]+)/i.test(userAgent) && /miniprogram/i.test(userAgent)) {
                return true; 
            }
            return;
        },
        isWxMini: function isWxMini(cb) {//判断是否是小程序环境
            if (userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger') {
                wx.miniProgram.getEnv(function (res) {
                    if (res.miniprogram) {
                        !!cb && cb(true);
                    } else {
                        !!cb && cb(false);
                    }
                })
            } else {
                !!cb && cb(false);
            }
        },
        isSupport: function () {
            var NV = {}
                , UA = navigator.userAgent.toLowerCase()
                , flag = true
                , self = this;
            function toNum(a) {
                var a = a.toString();
                var c = a.split('.');
                var num_place = ["", "0", "00", "000", "0000"], r = num_place.reverse();
                for (var i = 0; i < c.length; i++) {
                    var len = c[i].length;
                    c[i] = r[len] + c[i];
                }
                var res = c.join('');
                return res;
            }
            try {
                NV.name = !-[1,] ? 'ie' :
                    (UA.indexOf("firefox") > 0) ? 'firefox' :
                        (UA.indexOf("chrome") > 0) ? 'chrome' :
                            window.opera ? 'opera' :
                                window.openDatabase ? 'safari' :
                                    'unkonw';
            } catch (e) { };

            if (NV.name == 'safari' && self.getPlatform() == 'pc') {
                var version = userAgent.match(/Version\/(\d+(.\d+)*)/)[1];
                if (toNum(version) <= toNum('6.2.8')) {
                    flag = false;
                    layer.open({
                        content: '您当前的Safari浏览器版本暂不支持访问该游戏'
                        , style: 'width: 8rem'
                        , btn: '我知道了'
                    });
                }
            }
            return flag;
        },
        checkCssAnimation: function checkCssAnimation() {
            var styles = document.createElement('div').style;
            var animations = ['animation', 'webkitAnimation', "msAnimation", 'MozAnimation', '-moz-animation', '-webkit-animation'];
            for (var i = 0, len = animations.length; i < len; i++) {
                if (animations[i] in styles) {
                    return true;
                }
            }
            return false;
        },
        getQueryString: function getQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = location.search.substr(1).match(reg); //匹配目标参数
            if (r != null) {
                var ret = r[2];
                try {
                    ret = decodeURIComponent(ret);
                } catch (e) {
                    ret = unescape(ret);
                }
                return ret;
            }
            return null; //返回参数值
        },
        getViewport: function getViewport() {
            var height = window.innerHeight,
                width = window.innerWidth;
            if (isNaN(height)) {
                if (document.compatMode == "CSS1Compat") {
                    width = document.documentElement.clientWidth;
                    height = document.documentElement.clientHeight;
                } else {
                    width = document.body.clientWidth;
                    height = document.body.clientHeight;
                }
            }
            return {
                height: height,
                width: width
            }
        },
        getToken: getToken,
        getShareId: function () {
            return this.shareId;
        },
        createScript: function createScript(url, cb) {
            if (!!url) {
                var $script = $('<script/>');
                $script.one('load', cb || emptyFn);
                $script.attr('src', url);
                $('body').append($script);
            }
        },
        bind: function bind(ctx, fn) {
            if (!!fn.bind) {
                return fn.bind(ctx);
            }
            return function () { var args = [].slice.call(arguments); return fn.apply(ctx, args); }
        },
        ready: function (cb, ctx) {
            onOrEmit('readyFuncs', cb, ctx);
        },
        destroy: function destroy(cb, ctx) {
            onOrEmit('destroyFuncs', cb, ctx);
        },
        flip: function (cb, ctx) {
            onOrEmit('flipFuncs', cb, ctx);
        },
        on: function (message, handler) {
            PubSub.subscribe(message, handler);
        },
        off: function (value) {
            PubSub.unsubscribe(value);
        },
        emit: function (message, data) {
            PubSub.publish(message, data);
        },
        getTemplate: function (data, id) {//获取模板内容
            var reg1 = new RegExp('<script\\s+id="' + id + '"[^>]*?>[\\s\\S]*?<\\/script>', 'gi');
            return data.match(reg1)[0].replace(/<script[^>]*?>/, '').replace(/<\/script>/gi, '');
        },
        simpleMsg: function (errText, cb) {//msg提示框
            if (!errText && !!cb) cb(false);
            var msgObj = $('#msg-model');
            msgObj.find('span').html(errText);
            msgObj.show();
            this.bindAnim(msgObj, 'bounceInDown');
            this.$setTimeout = setTimeout(function () {
                msgObj.hide();
                clearTimeout(this.$setTimeout);
            }, 2000);
            !!cb && cb(false);
        },
        loading: function (text) {
            var text = text || '加载中'
                , self = this;
            self.loadingBox = layer.open({
                type: 2
                , shadeClose: false
                , content: text
            });
        },
        confim: function (config) {
            this.confimBox = layer.open({
                content: config.text
                , btn: config.btnArr
                , yes: function (index) {
                    !!config.cb1 && config.cb1();
                }, no: function () {
                    !!config.cb2 && config.cb2();
                }
            });
        },
        dateString: function (str) {//日期转换
            if (!str) {
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
        formValidation: function (objArr, cb) {//简易表单验证
            var self = this,
                i = 0,
                len = objArr.length;
            var regObj = {
                'phone': /^1[0-9]{10}$/,
                'number': /^\d+$/i,
                'email': /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/,
                'identitycard': /(^\d{15}$)|(^\d{17}([0-9]|X)$)/i
            };
            for (i; i < len; i++) {
                var type = objArr[i].type ? objArr[i].type : '',
                    value = !!objArr[i].value ? objArr[i].value : '',
                    reg = !!objArr[i].reg ? objArr[i].reg : '',
                    minLength = !!objArr[i].minLength ? objArr[i].minLength : '',
                    maxLength = !!objArr[i].maxLength ? objArr[i].maxLength : '',
                    maxValue = typeof (objArr[i].maxValue) == 'number' ? objArr[i].maxValue : '',
                    maxValueErr = !!objArr[i].maxValueErr ? objArr[i].maxValueErr : '',
                    emptyErr = !!objArr[i].emptyErr ? objArr[i].emptyErr : '',
                    regErr = !!objArr[i].regErr ? objArr[i].regErr : '',
                    lengthErr = !!objArr[i].lengthErr ? objArr[i].lengthErr : '';

                if (!!type) {
                    switch (type) {
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

                if (value == '' || value == null) {//为空
                    self.simpleMsg(emptyErr, cb);
                    return false;
                } else if (!!reg && !reg.test(value)) {
                    self.simpleMsg(regErr, cb);
                    return false;
                } else if ((!!maxLength && value.length > maxLength) || (!!minLength && value.length < minLength)) {
                    self.simpleMsg(lengthErr, cb);
                    return false;
                } else if (typeof (objArr[i].maxValue) == 'number' && maxValue < value) {
                    self.simpleMsg(maxValueErr, cb);
                    return false;
                }
            }
            cb(true);
        },
        bindAnim: function (obj, x, callback) { //obj--要加动画的对象  x--动画类型，对应annimate.css里面的动画类型  callback--动画完毕的回调
            $(obj).addClass(x + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                $(this).removeClass(x + ' animated');
                !!callback && callback();
            });
        },
        postMessage: function (controlId, msgType) {//向游戏iframe传递消息
            $('#' + controlId).find('.frame-container')[0].contentWindow.postMessage({
                controlId: controlId,
                relationId: lanh.kid,
                type: msgType
            }, '*')
        },
        openActivityReadme: function (controlId, config) {//弹出活动说明
            var self = this,
                key = Utils.pluginConfig[controlId].theme.theme || 'default';

            self.loading('获取活动说明内容，请稍后');
            Promise.all([
                new Promise(function (resolve, rej) {
                    $.get("/public/layer/theme/" + key + "/tpl.html", function (data) {
                        resolve(self.getTemplate(data, 'activity-readme'));
                    });
                }),
                new Promise(function (resolve, rej) {//请求接口获取数据
                    Utils.getToken(function (result) {
                        $.ajax({
                            url: lanh.apiHost.replace(/:\d+/g, '') + "activity/plugin/prize?relationId=" + lanh.kid + "&controlId=" + controlId + "&session_id=" + result.session_id,
                            type: "GET",
                            contentType: "application/json",
                            dataType: "json",
                            headers: { session_id: result.session_id },
                            success: function (result) {
                                result.data.prizes = result.data.prizes.sort(function (a, b) { return a.sort - b.sort; })
                                resolve(result.data);
                            },
                            error: function (result) {
                                if (result.status == 400) {
                                    Utils.simpleMsg(JSON.parse(result.responseText).message || '获取数据失败!');
                                } else {
                                    Utils.simpleMsg('获取数据失败!');
                                }
                                rej();
                            }
                        });
                    })
                })])
                .then(function (results) {
                    layer.close(self.loadingBox);
                    //组装数据，替换模板变量
                    var myPrizeTpl = results[1].prizes.map(function (item, index) {
                        return '<p class="text-left medium-font">' + item.optionName + '：' + item.prizeName + '</p>';
                    }).join('');
                    var activityTimeTpl = '<p class="text-left medium-font">' + Utils.pluginConfig[controlId].actStartTime + ' - ' + Utils.pluginConfig[controlId].actEndTime + '</p>';
                    var ruleTpl = !!Utils.pluginConfig[controlId].controlData.rule ? '<p class="readme-tag tag-bg medium-font">活动规则</p><div class="cont-row"><p class="text-left medium-font" style="word-break: break-all;">' + Utils.pluginConfig[controlId].controlData.rule + '</p></div>' : '';
                    var tpl = results[0].replace('${myPrize}', myPrizeTpl).replace('${activityTime}', activityTimeTpl).replace('${rule}', ruleTpl);

                    layer.open({
                        type: 0,
                        anim: false,
                        title: ['<img style="width: auto;height: 1rem; vertical-align: middle;" src="/public/images/h5/activity-readme.png"/>', "height: 1.28rem;line-height: 1.28rem; background-color: rgba(0, 204, 153, 0.3); color:#fff; background-image: url('/public/images/h5/activity-readme-bg.png');background-size:100% 100%;"],
                        content: tpl,
                        className: "layer-activity-readme",
                        shade: 'background-color: rgba(0,0,0,.6)',
                        shadeClose: false,
                        success: function (elem) {
                            var $closeBtn = $(elem).find('#close-btn');
                            var eventType = self.getPlatform() == "pc" ? 'click' : 'touchend';
                            self.bindAnim($('.layer-activity-readme'), 'bounceInDown');
                            $closeBtn.on(eventType, function () {
                                self.bindAnim($('.layer-activity-readme'), 'bounceOutUp', function () {
                                    layer.closeAll();
                                });
                            });
                        }
                    })
                }).catch(function () {
                    layer.close(self.loadingBox);
                });
        },
        openQrcode: function (controlId, config) {//弹出关注二维码
            var self = this,
                key = Utils.pluginConfig[controlId].theme.theme || 'default';

            new Promise(function (resolve, rej) {
                $.get("/public/layer/theme/" + key + "/tpl.html", function (data) {
                    resolve(self.getTemplate(data, 'qrcode'));
                });
            }).then(function (result) {
                //组装数据，替换模板变量
                var tpl = result.replace('${qrcode}', Utils.pluginConfig[controlId].controlData.qrcode.url);

                layer.open({
                    type: 0,
                    anim: false,
                    content: tpl,
                    className: "layer-qrcode",
                    shade: 'background-color: rgba(0,0,0,.6)',
                    shadeClose: false,
                    scrollbar: false,
                    success: function (elem) {
                        var $goBackBtn = $(elem).find('#goBack');
                        var eventType = self.getPlatform() == "pc" ? 'click' : 'touchend';
                        self.bindAnim($('.layer-qrcode'), 'bounceInDown');
                        $goBackBtn.on(eventType, function () {
                            layer.closeAll();
                            self.postMessage(controlId, 'game_reset');
                        })
                    }
                })
            }).catch(function () { });
        },
        openSwitchCashPrize: function (controlId, config) {//弹出选择兑奖方式弹窗
            var self = this,
                key = Utils.pluginConfig[controlId].theme.theme || 'default',
                controlData = Utils.pluginConfig[controlId].controlData;

            if (!controlData.newAttribute.onlineRewards || !controlData.newAttribute.offlineRewards) {
                if (!!controlData.newAttribute.onlineRewards) { //线上兑奖
                    self.onlineCashPrize(controlId, config);
                    return false;
                } else {//线下兑奖
                    self.offlineCashPrize(controlId, config);
                    return false;
                }
            }
            new Promise(function (resolve, rej) {
                $.get("/public/layer/theme/" + key + "/tpl.html", function (data) {
                    resolve(self.getTemplate(data, !!config.icon ? 'switch-cash-prize_hasprizeImg' : 'switch-cash-prize'));
                });
            }).then(function (result) {
                //组装数据，替换模板变量
                var tpl = result.replace('${optionName}', config.optionName)
                    .replace('${prize}', config.prizeName)
                    .replace('${prizeImg}', !!config.icon ? '<p style="height:2rem;"><img id="prizeImg" src="' + config.icon + '" style="width:2rem;height:2rem;"/></p>' : '')
                    .replace('${formContent}', controlData.fromSetting.map(function (item, index) {
                        return '<p>' +
                            '<label class="mediau-font">' + item.name + '：</label>' +
                            '<input class="mediau-font" id="' + item.id + '" type="text" autocomplete="off"/>' +
                            '</p>';
                    }).join(''))
                    .replace('${offlineInfo}', controlData.newAttribute.offlineTextList.map(function (item, index) {
                        return '<p>' +
                            '<label class="medium-font">' + item.title + '：</label>' +
                            '<span class="medium-font">' + item.value + '</span>' +
                            '</p>';
                    }).join(''));

                layer.open({
                    type: 0,
                    anim: false,
                    content: tpl,
                    className: "layer-winning",
                    shade: 'background-color: rgba(0,0,0,.6)',
                    shadeClose: false,
                    scrollbar: false,
                    success: function (elem) {
                        var $goBackBtn = $(elem).find('#goBack');
                        var $submitBtn = $(elem).find('#submit');
                        var $typeSwitch = $(elem).find('.type-switch');
                        var $formContent = $(elem).find('.form-content');
                        var cashType = 'online';
                        var eventType = self.getPlatform() == "pc" ? 'click' : 'touchend';

                        $($formContent.get(0)).show();
                        self.bindAnim($('.layer-winning'), 'bounceInDown');
                        $typeSwitch.on(eventType, function (e) {
                            if (!$(this).attr('data-type')) return false;
                            cashType = $(this).attr('data-type');
                            $formContent.hide();
                            $typeSwitch.find('.iconfont').removeClass('icon-radio-checkded');
                            $(this).find('.iconfont').addClass('icon-radio-checkded');
                            $(elem).find('#form-content-' + $(this).attr('data-type')).show();
                        });
                        $goBackBtn.on(eventType, function () {
                            layer.closeAll();
                            self.postMessage(controlId, 'game_reset');
                        });
                        $submitBtn.on(eventType, function () {
                            switch (cashType) {
                                case 'online':
                                    var arr = [];
                                    $.each(controlData.fromSetting, function (index, item) {
                                        var _obj = {
                                            'type': item.category,
                                            'value': $(elem).find('#' + item.id).val(),
                                            'emptyErr': '请填写' + item.name,
                                            'regErr': '请输入正确的' + item.name
                                        }
                                        if (item.category == 'name') {
                                            _obj['maxLength'] = 20;
                                            _obj['lengthErr'] = item.name + '不能超过20个字符';
                                            _obj['isName'] = true;
                                        } else if (item.category == 'phone') {
                                            _obj['isPhone'] = true;
                                        } else {
                                            _obj['maxLength'] = 100;
                                            _obj['lengthErr'] = item.name + '不能超过100个字符';
                                        }
                                        arr.push(_obj);
                                    });
                                    self.formValidation(arr, function (tag) {
                                        if (!tag) return false;
                                        var formData = [];
                                        $.each(controlData.fromSetting, function (index, item) {
                                            formData.push({
                                                name: item.name,
                                                sort: item.sort,
                                                type: item.type + '_' + item.category,
                                                content: $(elem).find('#' + item.id).val()
                                            })
                                        });
                                        // 提交表单
                                        self.loading('正在提交表单信息，请稍后');
                                        function formSubmit() {
                                            Utils.getToken(function (result) {
                                                Utils.isWxMini(function (matched) {
                                                    $.ajax({
                                                        url: lanh.apiHost.replace(/:\d+/g, '') + "activity/plugin/from/content?session_id=" + result.session_id,
                                                        type: "POST",
                                                        contentType: "application/json",
                                                        dataType: "json",
                                                        headers: { session_id: result.session_id },
                                                        data: JSON.stringify({
                                                            "relationId": lanh.kid,
                                                            "controlId": controlId,
                                                            "contents": formData,
                                                            "shareId": Utils.getQueryString('as_belong_user') || '',
                                                            "isWeapp": matched ? 'weapp' : (!!self.isWX() ? 'wx' : 'pc'),
                                                            "forwardKey": Utils.myforwardKey,
                                                            "rootUserId": (Utils.myrootUserId || Utils.getQueryString('rootUserId') || Utils.getQueryString('userId')),
                                                            "extType": "game"
                                                        }),
                                                        success: function (result) {
                                                            layer.close(self.loadingBox);
                                                            if (result.data == 1 || result.data == 200) {
                                                                self.openMyPrize(controlId)
                                                            } else if (result.data == 101) {
                                                                self.simpleMsg('手机号已被使用');
                                                            } else {
                                                                self.simpleMsg('操作失败，请重试。code:' + result.data);
                                                            }
                                                        },
                                                        error: function (result) {
                                                            layer.close(self.loadingBox);
                                                            self.confim({
                                                                text: '提交表单失败，重新提交？',
                                                                btnArr: ['重新提交', '返回首页'],
                                                                cb1: function () {
                                                                    formSubmit();
                                                                },
                                                                cb2: function () {
                                                                    layer.closeAll();
                                                                    self.postMessage(controlId, 'game_reset');
                                                                }
                                                            })
                                                        }
                                                    });
                                                })
                                            })
                                        }
                                        formSubmit();
                                    })
                                    break;
                                case 'offline':
                                    self.loading('切换兑奖方式中，请稍后');
                                    Utils.getToken(function (result) {
                                        $.ajax({
                                            url: lanh.apiHost.replace(/:\d+/g, '') + "activity/plugin/change/usercashtype/offline?session_id=" + result.session_id,
                                            type: "POST",
                                            contentType: "application/json",
                                            dataType: "json",
                                            headers: { session_id: result.session_id },
                                            data: JSON.stringify({
                                                "id": config.id
                                            }),
                                            success: function (result) {
                                                layer.close(self.loadingBox);
                                                if (result.data == 200) {
                                                    self.offlineCashPrize(controlId, config);
                                                } else {
                                                    self.simpleMsg('操作失败，请重试。code:' + result.data);
                                                }
                                            },
                                            error: function (result) {
                                                layer.close(self.loadingBox);
                                                self.simpleMsg('兑奖方式切换失败');
                                            }
                                        });
                                    })
                                    break;
                            }
                        })

                    }
                })
            }).catch(function () { });
        },
        onlineCashPrize: function (controlId, config) {//弹出线上兑奖弹窗
            var self = this,
                key = Utils.pluginConfig[controlId].theme.theme || 'default',
                controlData = Utils.pluginConfig[controlId].controlData;

            new Promise(function (resolve, rej) {
                $.get("/public/layer/theme/" + key + "/tpl.html", function (data) {
                    resolve(self.getTemplate(data, !!config.icon ? 'online-cash-prize_hasprizeImg' : 'online-cash-prize'));
                });
            }).then(function (result) {
                //组装数据，替换模板变量
                var tpl = result.replace('${optionName}', config.optionName)
                    .replace('${prize}', config.prizeName)
                    .replace('${prizeImg}', !!config.icon ? '<p style="height:2rem;"><img id="prizeImg" src="' + config.icon + '" style="width:2rem;height:2rem;"/></p>' : '')
                    .replace('${formContent}', controlData.fromSetting.map(function (item, index) {
                        return '<p>' +
                            '<label class="mediau-font">' + item.name + '：</label>' +
                            '<input class="mediau-font" id="' + item.id + '" type="text" autocomplete="off"/>' +
                            '</p>';
                    }).join(''));

                layer.open({
                    type: 0,
                    anim: false,
                    content: tpl,
                    className: "layer-winning",
                    shade: 'background-color: rgba(0,0,0,.6)',
                    shadeClose: false,
                    scrollbar: false,
                    success: function (elem) {
                        var $goBackBtn = $(elem).find('#goBack');
                        var $submitBtn = $(elem).find('#submit');
                        var eventType = self.getPlatform() == "pc" ? 'click' : 'touchend';

                        self.bindAnim($('.layer-winning'), 'bounceInDown');
                        $goBackBtn.on(eventType, function () {
                            layer.closeAll();
                            self.postMessage(controlId, 'game_reset');
                        });
                        $submitBtn.on(eventType, function () {
                            var arr = [];
                            $.each(controlData.fromSetting, function (index, item) {
                                var _obj = {
                                    'type': item.category,
                                    'value': $(elem).find('#' + item.id).val(),
                                    'emptyErr': '请填写' + item.name,
                                    'regErr': '请输入正确的' + item.name
                                }
                                if (item.category == 'name') {
                                    _obj['maxLength'] = 20;
                                    _obj['lengthErr'] = item.name + '不能超过20个字符';
                                    _obj['isName'] = true;
                                } else if (item.category == 'phone') {
                                    _obj['isPhone'] = true;
                                } else {
                                    _obj['maxLength'] = 100;
                                    _obj['lengthErr'] = item.name + '不能超过100个字符';
                                }
                                arr.push(_obj);
                            });
                            self.formValidation(arr, function (tag) {
                                if (!tag) return false;
                                var formData = [];
                                $.each(controlData.fromSetting, function (index, item) {
                                    formData.push({
                                        name: item.name,
                                        sort: item.sort,
                                        type: item.type + '_' + item.category,
                                        content: $(elem).find('#' + item.id).val()
                                    })
                                });
                                // 提交表单
                                self.loading('正在提交表单信息，请稍后');
                                function formSubmit() {
                                    Utils.getToken(function (result) {
                                        Utils.isWxMini(function (matched) {
                                            $.ajax({
                                                url: lanh.apiHost.replace(/:\d+/g, '') + "activity/plugin/from/content?session_id=" + result.session_id,
                                                type: "POST",
                                                contentType: "application/json",
                                                dataType: "json",
                                                headers: { session_id: result.session_id },
                                                data: JSON.stringify({
                                                    "relationId": lanh.kid,
                                                    "controlId": controlId,
                                                    "contents": formData,
                                                    "shareId": Utils.getQueryString('as_belong_user') || '',
                                                    "isWeapp": matched ? 'weapp' : (!!self.isWX() ? 'wx' : 'pc'),
                                                    "forwardKey": Utils.myforwardKey,
                                                    "rootUserId": (Utils.myrootUserId || Utils.getQueryString('rootUserId') || Utils.getQueryString('userId')),
                                                    "extType": "game"
                                                }),
                                                success: function (result) {
                                                    layer.close(self.loadingBox);
                                                    if (result.data == 1 || result.data == 200) {
                                                        self.openMyPrize(controlId);
                                                    } else if (result.data == 101) {
                                                        self.simpleMsg('手机号已被使用');
                                                    } else {
                                                        self.simpleMsg('操作失败，请重试。code:' + result.data);
                                                    }
                                                },
                                                error: function (result) {
                                                    layer.close(self.loadingBox);
                                                    self.confim({
                                                        text: '提交表单失败，重新提交？',
                                                        btnArr: ['重新提交', '返回首页'],
                                                        cb1: function () {
                                                            formSubmit();
                                                        },
                                                        cb2: function () {
                                                            layer.closeAll();
                                                            self.postMessage(controlId, 'game_reset');
                                                        }
                                                    })
                                                }
                                            });
                                        })
                                       
                                    })
                                }
                                formSubmit();
                            })
                        });

                    }
                })
            }).catch(function () { });
        },
        offlineCashPrize: function (controlId, config) {//弹出线下兑奖弹窗
            var self = this,
                key = Utils.pluginConfig[controlId].theme.theme || 'default',
                controlData = Utils.pluginConfig[controlId].controlData;

            self.loading('正在生成兑奖二维码，请稍后');
            function creatQrcode() {
                Promise.all([
                    new Promise(function (resolve, rej) {
                        $.get("/public/layer/theme/" + key + "/tpl.html", function (data) {
                            resolve(self.getTemplate(data, !!config.icon ? 'offline-cash-prize_hasprizeImg' : 'offline-cash-prize'));
                        });
                    }),
                    new Promise(function (resolve, rej) {//请求接口获取数据
                        // 生成二维码
                        Utils.getToken(function (result) {
                            $.ajax({
                                url: lanh.apiHost.replace(/:\d+/g, '') + "manuscript/wxqrcode/get?session_id=" + result.session_id,
                                type: "POST",
                                contentType: "application/json",
                                dataType: "json",
                                headers: { session_id: result.session_id },
                                data: JSON.stringify({
                                    "page": "pages/index/index",
                                    "scene": "act=offineCashPrize&id=" + config.id
                                }),
                                success: function (result) {
                                    resolve(result.data.file);
                                },
                                error: function (result) {
                                    if (result.status == 400) {
                                        Utils.simpleMsg('生成二维码失败!');
                                    } else {
                                        Utils.simpleMsg('生成二维码失败!');
                                    }
                                    rej();
                                }
                            });
                        })
                    })
                ]).then(function (results) {
                    layer.close(self.loadingBox);
                    //组装数据，替换模板变量
                    var focusTpl = !!Utils.pluginConfig[controlId].controlData.qrcode.url ? '<div class="winning-btn-wrap" style="margin-top:0rem;"><span id="goBack" class="winning-btn medium-font" style="margin-right: 0.5rem;">返回首页</span><span id="focus" class="winning-btn medium-font">关注我们</span></div>' : '<div class="winning-btn-wrap" style="margin-top:0rem;"><span id="goBack" class="winning-btn medium-font">返回首页</span></div>';
                    var tpl = results[0].replace('${optionName}', config.optionName)
                        .replace('${prize}', config.prizeName)
                        .replace('${prizeImg}', !!config.icon ? '<p style="height:2rem;"><img id="prizeImg" src="' + config.icon + '" style="width:2rem;height:2rem;"/></p>' : '')
                        .replace('${logStatus}', !config.exchangeState ? '<p class="medium-font" style="color:#fe4429;">出示二维码兑奖</p>' : '<p class="medium-font" style="color:#fe4429;">奖品已兑换</p><p class="small-font" style="color:#fe4429;">(' + config.exchangetime + ')</p>')
                        .replace('${formContent}', controlData.newAttribute.offlineTextList.map(function (item, index) {
                            return '<p>' +
                                '<label class="medium-font">' + item.title + '：</label>' +
                                '<span class="medium-font">' + item.value + '</span>' +
                                '</p>';
                        }).join(''))
                        .replace('${focus}', focusTpl)
                        .replace('${qrcode}', '<img src="' + results[1] + '" style="width:2.933rem;height:2.933rem;vertical-align: middle;"/>');

                    layer.open({
                        type: 0,
                        anim: false,
                        content: tpl,
                        className: "layer-winning",
                        shade: 'background-color: rgba(0,0,0,.6)',
                        shadeClose: false,
                        scrollbar: false,
                        success: function (elem) {
                            var $goBackBtn = $(elem).find('#goBack');
                            var $focusBtn = $(elem).find('#focus');
                            var eventType = self.getPlatform() == "pc" ? 'click' : 'touchend';

                            self.bindAnim($('.layer-winning'), 'bounceInDown');
                            $focusBtn.on(eventType, function () {
                                self.openQrcode(controlId);
                            });
                            $goBackBtn.on(eventType, function () {
                                layer.closeAll();
                                self.postMessage(controlId, 'game_reset');
                            });
                        }
                    })
                }).catch(function () {
                    self.confim({
                        text: '生成兑奖二维码失败，重新生成？',
                        btnArr: ['重新生成', '返回首页'],
                        cb1: function () {
                            creatQrcode();
                        },
                        cb2: function () {
                            layer.closeAll();
                            self.postMessage(controlId, 'game_reset');
                        }
                    })
                });
            }
            creatQrcode();

        },
        openOnlineInfo: function (controlId, config) {//弹出线上兑奖信息弹窗
            var self = this,
                key = Utils.pluginConfig[controlId].theme.theme || 'default';

            new Promise(function (resolve, rej) {
                $.get("/public/layer/theme/" + key + "/tpl.html", function (data) {
                    resolve(self.getTemplate(data, !!config.icon ? 'online-Info_hasprizeImg' : 'online-Info'));
                });
            }).then(function (result) {
                //组装数据，替换模板变量
                var focusTpl = !!Utils.pluginConfig[controlId].controlData.qrcode.url ? '<div class="winning-btn-wrap" style="margin-top:0rem;"><span id="goBack" class="winning-btn medium-font" style="margin-right: 0.5rem;">返回首页</span><span id="focus" class="winning-btn medium-font">关注我们</span></div>' : '<div class="winning-btn-wrap" style="margin-top:0rem;"><span id="goBack" class="winning-btn medium-font">返回首页</span></div>';
                var tpl = result.replace('${optionName}', config.optionName)
                    .replace('${prize}', config.prizeName)
                    .replace('${prizeImg}', !!config.icon ? '<p style="height:2rem;"><img id="prizeImg" src="' + config.icon + '" style="width:2rem;height:2rem;"/></p>' : '')
                    .replace('${logStatus}', config.isProvide == 1 ? '<p class="mini-font">奖品已寄出 ' + config.provideTime + '</p>' : '<p class="mini-font">奖品未寄出</p>')
                    .replace('${focus}', focusTpl)
                    .replace('${formContent}', config.formArr.map(function (item, index) {
                        return '<p>' +
                            '<label class="mediau-font">' + item.name + '：</label>' +
                            '<span class="medium-font">' + item.content + '</span>' +
                            '</p>'
                    }).join(''));

                layer.open({
                    type: 0,
                    anim: false,
                    content: tpl,
                    className: "layer-winning",
                    shade: 'background-color: rgba(0,0,0,.6)',
                    shadeClose: false,
                    scrollbar: false,
                    success: function (elem) {
                        var $goBackBtn = $(elem).find('#goBack');
                        var $focusBtn = $(elem).find('#focus');
                        var eventType = self.getPlatform() == "pc" ? 'click' : 'touchend';

                        self.bindAnim($('.layer-winning'), 'bounceInDown');
                        $focusBtn.on(eventType, function () {
                            self.openQrcode(controlId);
                        });
                        $goBackBtn.on(eventType, function () {
                            layer.closeAll();
                            self.postMessage(controlId, 'game_reset');
                        });
                    }
                })
            }).catch(function () { });
        },
        openNotWinning: function (controlId, config) {//弹出未中奖
            var self = this,
                key = Utils.pluginConfig[controlId].theme.theme || 'default';

            new Promise(function (resolve, rej) {
                $.get("/public/layer/theme/" + key + "/tpl.html", function (data) {
                    resolve(self.getTemplate(data, 'not-winning'));
                });
            }).then(function (result) {
                //组装数据，替换模板变量
                var focusTpl = !!Utils.pluginConfig[controlId].controlData.qrcode.url ? '<span id="goBack" class="winning-btn medium-font" style="margin-right: 0.5rem;">再来一次</span><span id="focus" class="winning-btn medium-font">关注我们</span>' : '<span id="goBack" class="winning-btn medium-font">再来一次</span>';
                var tpl = result.replace('${focus}', focusTpl);

                layer.open({
                    type: 0,
                    anim: false,
                    content: tpl,
                    className: "layer-winning",
                    shade: 'background-color: rgba(0,0,0,.6)',
                    shadeClose: false,
                    scrollbar: false,
                    success: function (elem) {
                        var $goBackBtn = $(elem).find('#goBack');
                        var $focusBtn = $(elem).find('#focus');
                        var eventType = self.getPlatform() == "pc" ? 'click' : 'touchend';
                        self.bindAnim($('.layer-winning'), 'bounceInDown');

                        $goBackBtn.on(eventType, function () {
                            layer.closeAll();
                            self.postMessage(controlId, 'game_restart');
                        });
                        $focusBtn.on(eventType, function () {
                            self.openQrcode(controlId);
                        });
                    }
                })
            })
        },
        openNoWinningInfo: function (controlId, config) {//弹出没有抽奖信息弹窗
            var self = this,
                key = Utils.pluginConfig[controlId].theme.theme || 'default';

            new Promise(function (resolve, rej) {
                $.get("/public/layer/theme/" + key + "/tpl.html", function (data) {
                    resolve(self.getTemplate(data, 'no-winning-info'));
                });
            }).then(function (result) {
                //组装数据，替换模板变量
                var focusTpl = !!Utils.pluginConfig[controlId].controlData.qrcode.url ? '<span id="goBack" class="winning-btn medium-font" style="margin-right: 0.5rem;">返回首页</span><span id="focus" class="winning-btn medium-font">关注我们</span>' : '<span id="goBack" class="winning-btn medium-font">返回首页</span>';
                var tpl = result.replace('${focus}', focusTpl).replace('${face}', config.face);

                layer.open({
                    type: 0,
                    anim: false,
                    content: tpl,
                    className: "layer-winning",
                    shade: 'background-color: rgba(0,0,0,.6)',
                    shadeClose: false,
                    scrollbar: false,
                    success: function (elem) {
                        var $goBackBtn = $(elem).find('#goBack');
                        var $focusBtn = $(elem).find('#focus');
                        var eventType = self.getPlatform() == "pc" ? 'click' : 'touchend';
                        self.bindAnim($('.layer-winning'), 'bounceInDown');
                        $goBackBtn.on(eventType, function () {
                            layer.closeAll();
                            self.postMessage(controlId, 'game_reset');
                        });
                        $focusBtn.on(eventType, function () {
                            self.openQrcode(controlId);
                        });
                    }
                })
            })
        },
        openMyPrize: function (controlId) {//弹出我的奖品
            var self = this;
            self.loading('查询我的奖品信息，请稍后');
            new Promise(function (resolve, rej) {
                Utils.getToken(function (result) {
                    $.ajax({
                        url: lanh.apiHost.replace(/:\d+/g, '') + "activity/plugin/drawprize/log?relationId=" + lanh.kid + "&controlId=" + controlId + "&session_id=" + result.session_id,
                        type: "GET",
                        contentType: "application/json",
                        dataType: "json",
                        headers: { session_id: result.session_id },
                        success: function (result) {
                            resolve(result.data);
                        },
                        error: function (result) {
                            if (result.status == 400) {
                                Utils.simpleMsg(JSON.parse(result.responseText).message || '获取数据失败!');
                            } else {
                                Utils.simpleMsg('获取数据失败!');
                            }
                            rej();
                        }
                    });
                })
            }).then(function (result) {
                layer.close(self.loadingBox);
                if (!!result.log && result.log.state == 1) {//中奖
                    if (!!result.log.userCashType) {//选择了兑奖类型
                        switch (result.log.userCashType) {
                            case 1: //线上
                                self.openOnlineInfo(controlId, { prizeName: result.log.prizeName, icon: result.log.icon, optionName: result.log.optionName, formArr: result.content, exchangeState: result.log.exchangeState, exchangetime: self.dateString(result.log.exchangetime), isProvide: result.log.isProvide, provideTime: !!result.log.provideTime ? self.dateString(result.log.provideTime) : '' });
                                break;
                            case 2: //线下
                                self.offlineCashPrize(controlId, { prizeName: result.log.prizeName, icon: result.log.icon, optionName: result.log.optionName, exchangeState: result.log.exchangeState, exchangetime: self.dateString(result.log.exchangetime), id: result.log.id, isProvide: result.log.isProvide, provideTime: !!result.log.provideTime ? self.dateString(result.log.provideTime) : '' });
                                break;
                            default: ;
                        }
                    } else {
                        self.openSwitchCashPrize(controlId, { prizeName: result.log.prizeName, icon: result.log.icon, optionName: result.log.optionName, exchangeState: result.log.exchangeState, exchangetime: self.dateString(result.log.exchangetime), id: result.log.id });
                    }
                } else {//没有中奖信息
                    self.openNoWinningInfo(controlId, { face: result.face || '/public/images/h5/default-face.png' });
                }
            }).catch(function () {
                layer.close(self.loadingBox);
            });
        },
        smashGoldEgg: function (controlId) {//弹出砸金蛋
            var self = this,
                key = Utils.pluginConfig[controlId].theme.theme || 'default';

            Promise.all([
                new Promise(function (resolve, rej) {
                    $.get("/public/layer/theme/" + key + "/smash-gold-eggs.html", function (data) {
                        resolve(self.getTemplate(data, 'smashGoldEgg'));
                    });
                }),
            ]).then(function (results) {
                layer.open({
                    type: 0,
                    anim: false,
                    content: results[0],
                    shadeClose: false,
                    scrollbar: false,
                    className: "layer-smashGoldEggs",
                    shade: 'background-color: rgba(0,0,0,.6)',
                    success: function (elem) {
                        var eventType = self.getPlatform() == "pc" ? 'click' : 'touchend';
                        var _lock = false;
                        $(elem).find('.closeBtn').on(eventType, function (e) {
                            layer.closeAll();
                        })
                        $(elem).find('.hammer').on(eventType, function (e) {
                            // 点击加锁
                            if (_lock) return false;
                            _lock = true;
                            self.goDrawPrize(controlId, function (result) {
                                $(elem).find('.smashGoldEgg-bg').addClass("smashing");
                                setTimeout(function () {
                                    $(elem).find('.smashGoldEgg-bg').removeClass("smashing");
                                    $(elem).find('.smashGoldEgg-bg').addClass("smashed");
                                    setTimeout(function () {
                                        $(elem).find('.smashGoldEgg-bg').addClass("finished");
                                        //解锁
                                        _lock = false;
                                        self.emit('draw_end', {
                                            controlId: controlId,
                                            data: result
                                        });
                                    }, 800);
                                }, 800);
                            });
                        })
                    }
                })
            })
        },
        dismantRedEnvekopes: function (controlId) {//拆红包
            var self = this,
                key = Utils.pluginConfig[controlId].theme.theme || 'default';

            Promise.all([
                new Promise(function (resolve, rej) {
                    $.get("/public/layer/theme/" + key + "/dismant-red-envelopes.html", function (data) {
                        resolve(self.getTemplate(data, 'dismantRedEnvelopes'));
                    });
                })
            ]).then(function (results) {
                layer.open({
                    type: 0,
                    anim: false,
                    content: results[0],
                    className: "layer-dismantRedEnvelopes",
                    shadeClose: false,
                    scrollbar: false,
                    shade: 'background-color: rgba(0,0,0,.6)',
                    success: function (elem) {
                        var eventType = self.getPlatform() == "pc" ? 'click' : 'touchend';
                        var _lock = false;
                        $(elem).find('.redEnvelopes').on(eventType, function (e) {
                            var _this = this;
                            //点击加锁
                            if (_lock) return false;
                            _lock = true;
                            self.goDrawPrize(controlId, function (result) {
                                $(_this).attr('src', '/public/images/dismant-red-envelopes/redEnvelopes2.png');
                                if (!!self._setTimeout) clearTimeout(self._setTimeout);
                                self._setTimeout = setTimeout(function () {
                                    _lock = false;//解锁
                                    self.emit('draw_end', {
                                        controlId: controlId,
                                        data: result
                                    });
                                }, 1000);
                            });
                        })
                        $(elem).find('.closeBtn').on(eventType, function (e) {
                            layer.closeAll();
                        })
                    }
                })
            })

        },
        drawAnimation: function (controlId, config) {//抽签动画
            var self = this,
                key = Utils.pluginConfig[controlId].theme.theme || 'default';

            new Promise(function (resolve, rej) {
                $.get("/public/layer/theme/" + key + "/draw.html", function (data) {
                    resolve(self.getTemplate(data, 'draw'));
                });
            }).then(function (result) {
                layer.open({
                    type: 0,
                    anim: false,
                    content: result,
                    className: "layer-draw",
                    shade: 'background-color: rgba(0,0,0,.6)',
                    shadeClose: false,
                    scrollbar: false,
                    success: function (elem) {
                        var $startBtn = $(elem).find('#start');
                        var $closeBtn = $(elem).find('.closeBtn');
                        var eventType = self.getPlatform() == "pc" ? 'click' : 'touchend';
                        var _lock = false;
                        self.bindAnim($('.draw'), 'bounceInDown');
                        $startBtn.on(eventType, function () {
                            $startBtn.parent().addClass('start');
                            // 点击加锁
                            if (_lock) return false;
                            _lock = true;
                            self.goDrawPrize(controlId, function (result) {
                                if (!!self._setTimeout) clearTimeout(self._setTimeout);
                                self._setTimeout = setTimeout(function () {
                                    _lock = false;//解锁
                                    self.emit('draw_end', {
                                        controlId: controlId,
                                        data: result
                                    });
                                }, 1000);
                            });
                        });
                        $closeBtn.on(eventType, function () {
                            self.bindAnim($('.draw'), 'bounceOutUp', function () {
                                layer.closeAll();
                            });
                        })
                    }
                })
            })
        },
        openGameRank: function (controlId, callback) {//弹出游戏排行
            var self = this,
                key = Utils.pluginConfig[controlId].theme.theme || 'default';
            var rank1 = '', rank2 = '';
            self.loading('获取游戏排行榜数据，请稍后');
            Promise.all([
                new Promise(function (resolve, rej) {
                    $.get("/public/layer/theme/" + key + "/game-ranks.html", function (data) {
                        rank1 = self.getTemplate(data, 'rank1');
                        rank2 = self.getTemplate(data, 'rank2');
                        resolve(self.getTemplate(data, 'gameRankings'));
                    });
                }),
                new Promise(function (resolve, rej) {//请求接口获取数据
                    if(!!Utils.getQueryString('preview')){
                        var mock = {
                            userFace: '/public/images/h5/default-face.png',
                            rank: !!self.previewScore ? 1 : -1,
                            list: !!self.previewScore ? [{
                                userFace: '/public/images/h5/default-face.png',
                                userNickname: '商家预览',
                                score: self.previewScore
                            }] : []
                        };
                        resolve(mock);
                    } else {
                        Utils.getToken(function (result) {
                            $.ajax({
                                url: lanh.apiHost.replace(/:\d+/g, '') + "activity/plugin/score/list?session_id=" + result.session_id,
                                type: "GET",
                                contentType: "application/json",
                                dataType: "json",
                                headers: { session_id: result.session_id },
                                data: {
                                    "relationId": lanh.kid,
                                    "controlId": controlId,
                                    "pageIndex": 1,
                                    "pageSize": 100
                                },
                                success: function (result) {
                                    resolve(result.data);
                                },
                                error: function (result) {
                                    if (result.status == 400) {
                                        Utils.simpleMsg(JSON.parse(result.responseText).message || '获取数据失败!');
                                    } else {
                                        Utils.simpleMsg('获取数据失败!');
                                    }
                                    rej();
                                }
                            });
                        })
                    }
                })
            ]).then(function (results) {
                var rankContent = '';
                layer.close(self.loadingBox);
                if (results[1].list.length > 0) {
                    results[1].list.forEach(function (item, index) {
                        if (index < 3) {
                            rankContent += rank1.replace('{imgRank}', index == 0 ? 'first' : (index == 1 ? 'second' : 'third'))
                                .replace('{faceImg}', item.userFace)
                                .replace('{nickName}', item.userNickname)
                                .replace('{score}', item.score)
                        } else {
                            rankContent += rank2.replace('{rank}', index + 1)
                                .replace('{faceImg}', item.userFace)
                                .replace('{nickName}', item.userNickname)
                                .replace('{score}', item.score)
                        }
                    })
                } else {
                    rankContent = "<tr><td colspan='4'>暂无排名</td></tr>"
                }
                var tpl = results[0].replace('{myselfRank}', results[1].rank != -1 ? '当前排名: 第' + results[1].rank + '名' : '当前排名: 暂无')
                    .replace('{myselfFace}', results[1].userFace)
                    .replace('{rankContent}', rankContent);
                layer.open({
                    type: 0,
                    anim: false,
                    content: tpl,
                    shadeClose: false,
                    scrollbar: false,
                    className: "layer-gameRankings",
                    shade: 'background-color: rgba(0,0,0,.6)',
                    success: function (elem) {
                        var eventType = self.getPlatform() == "pc" ? 'click' : 'touchend';
                        $(elem).find('.closeBtn').on(eventType, function (e) {
                            if (!!callback) {
                                self.bindAnim($('.layer-gameRankings'), 'fadeOut');
                                callback();
                            } else {
                                layer.closeAll();
                            }
                        })
                    }
                })
            }).catch(function () {
                layer.close(self.loadingBox);
            });
        },
        goDrawPrize: function (controlId, cb) {//去抽奖
            var self = this;
            this.loading('正在抽奖，请稍后');
            Utils.getToken(function (result) {
                Utils.isWxMini(function (matched) {
                    $.ajax({
                        url: lanh.apiHost.replace(/:\d+/g, '') + "activity/plugin/drawprize?session_id=" + result.session_id,
                        type: "POST",
                        contentType: "application/json",
                        dataType: "json",
                        headers: { session_id: result.session_id },
                        data: JSON.stringify({
                            "relationId": lanh.kid,
                            "controlId": controlId,
                            "rootUserId": Utils.getQueryString('rootUserId') || Utils.getQueryString('userId'),
                            "myforwardKey": self.myforwardKey,
                            "isWeapp": matched ? 'weapp' : (!!self.isWX() ? 'wx' : 'pc')
                        }),
                        success: function (result) {
                            layer.close(self.loadingBox);
                            !!cb && cb(result.data);
                        },
                        error: function (result) {
                            if (result.status == 400) {
                                Utils.simpleMsg(JSON.parse(result.responseText).message);
                            }
                            layer.close(self.loadingBox);
                        }
                    });
                })
            })
        },
        openchanllengeResult: function (config, cacelAnimation) {//弹出挑战结果
            var controlId = config.controlId;
            var score = config.data.gameScore;
            var tplName = '', key = '', tpl = '', self = this;
            key = Utils.pluginConfig[controlId].theme.theme || 'default';

            if (score >= Utils.pluginConfig[controlId].score) {//挑战成功
                tplName = "challenge-suc";
            } else {
                tplName = "challenge-fail";
            }

            self.loading('上传游戏积分中，请稍后');

            function uploadPoints() {
                new Promise(function (resolve, rej) {
                    if(self.getPlatform() == 'pc'){ 
                        resolve(true); 
                    } else {
                        Utils.getToken(function (result) {
                            $.ajax({
                                url: lanh.apiHost.replace(/:\d+/g, '') + "activity/plugin/score?session_id=" + result.session_id,
                                type: "POST",
                                contentType: "application/json",
                                dataType: "json",
                                headers: { session_id: result.session_id },
                                data: JSON.stringify({
                                    "relationId": lanh.kid,
                                    "controlId": config.controlId,
                                    "score": score
                                }),
                                success: function (result1) {
                                    resolve(true);
                                },
                                error: function (result2) {
                                    rej();
                                },
                                complete: function (xhr, status) { }
                            });
                        })
                    }
                }).then(function (result) {
                    layer.close(self.loadingBox);
                    self.loading('获取最佳排名数据，请稍后');
                    function getBestRank() {
                        Promise.all([
                            new Promise(function (resolve, rej) {
                                $.get("/public/layer/theme/" + key + "/tpl.html", function (data) {
                                    resolve(self.getTemplate(data, tplName));
                                });
                            }),
                            new Promise(function (resolve, rej) {//请求接口获取数据
                                if(!!Utils.getQueryString('preview')){
                                    self.previewScore = score;
                                    resolve({
                                        rankPer: 100,
                                        bestScore: score,
                                        bestRank: '1',
                                        intervalDrawTime: Utils.pluginConfig[controlId].intervalDrawTime,
                                        isWin: false
                                    });
                                } else {
                                    Utils.getToken(function (result) {
                                        $.ajax({
                                            url: lanh.apiHost.replace(/:\d+/g, '') + "activity/plugin/user/rank?relationId=" + lanh.kid + "&controlId=" + controlId + "&session_id=" + result.session_id,
                                            type: "GET",
                                            contentType: "application/json",
                                            dataType: "json",
                                            headers: { session_id: result.session_id },
                                            success: function (result) {
                                                resolve(result.data);
                                            },
                                            error: function (result) {
                                                if (result.status == 400) {
                                                    Utils.simpleMsg(JSON.parse(result.responseText).message || '获取数据失败!');
                                                } else {
                                                    Utils.simpleMsg('获取数据失败!');
                                                }
                                                rej();
                                            }
                                        });
                                    })
                                }
                            })
                        ]).then(function (results) {
                            layer.close(self.loadingBox);
                            switch (tplName) {
                                case 'challenge-suc'://挑战成功
                                    tpl = results[0].replace('${score}', score)
                                        .replace('${bitNum}', results[1].rankPer)
                                        .replace('${bestScores}', results[1].bestScore)
                                        .replace('${bestRank}', results[1].bestRank)
                                        .replace('${face}', results[1].face || '/public/images/h5/default-face.png')
                                        .replace('${leftNum}', (!!results[1].isWin ? '' : '<p class="small-font" style="top:9.7rem;color:#0ca3b0;">今日还有' + results[1].intervalDrawTime + '次抽奖机会</p>'))
                                        .replace('${bigBtn}', (!!results[1].isWin ? '<span id="my-prize" class="button big-font">查看奖品</span>' : (results[1].intervalDrawTime > 0 ? '<span id="goDraw" class="button big-font">赶紧去抽奖</span>' : '<span class="button big-font disabeld">赶紧去抽奖</span>')));
                                    break;
                                case 'challenge-fail'://挑战失败
                                    tpl = results[0].replace('${score}', score)
                                        .replace('${needScore}', Utils.pluginConfig[controlId].score)
                                        .replace('${bestScores}', results[1].bestScore)
                                        .replace('${bestRank}', results[1].bestRank)
                                        .replace('${face}', results[1].face || '/public/images/h5/default-face.png')
                                    break;
                                default: ;
                            }

                            layer.open({
                                type: 0,
                                anim: false,
                                content: tpl,
                                className: "layer-draw",
                                shade: 'background-color: rgba(0,0,0,.6)',
                                shadeClose: false,
                                scrollbar: false,
                                success: function (elem) {
                                    var $rankBtn = $(elem).find('#rank'),
                                        $restartBtn = $(elem).find('#restart'),
                                        $goBackBtn = $(elem).find('#goBack'),
                                        $myPrizeBtn = $(elem).find('#my-prize'),
                                        $goDrawBtn = $(elem).find('#goDraw');

                                    var eventType = self.getPlatform() == "pc" ? 'click' : 'touchend';

                                    if (!cacelAnimation) self.bindAnim($('.challenge-suc'), 'bounceInDown');

                                    $restartBtn.on(eventType, function () {//再玩一次
                                        layer.closeAll();
                                        self.postMessage(controlId, 'game_restart');
                                    });
                                    $goBackBtn.on(eventType, function () {//返回首页
                                        layer.closeAll();
                                        self.postMessage(controlId, 'game_reset');
                                    });
                                    $myPrizeBtn.on(eventType, function () {//查看奖品
                                        self.openMyPrize(controlId);
                                    });
                                    $goDrawBtn.on(eventType, function () {//去抽奖
                                        layer.closeAll();
                                        // 判断动画形式，调用相应的动画
                                        switch (Utils.pluginConfig[controlId].controlData.drawStyle) {
                                            case 'redEnvelope': //红包
                                                self.dismantRedEnvekopes(controlId);
                                                break;
                                            case 'golden': //金蛋
                                                self.smashGoldEgg(controlId);
                                                break;
                                            case 'draw': //抽签
                                                self.drawAnimation(controlId);
                                                break;
                                        }
                                    });
                                    $rankBtn.on(eventType, function () {//打开排行榜
                                        self.openGameRank(controlId, function () {
                                            self.openchanllengeResult(config, true);
                                        });
                                    });
                                }
                            })
                        }).catch(function () {
                            layer.close(self.loadingBox);
                            self.confim({
                                text: '获取最佳排名数据失败，重新获取？',
                                btnArr: ['重新获取', '返回首页'],
                                cb1: function () {
                                    layer.close(self.confimBox);
                                    getBestRank();
                                },
                                cb2: function () {
                                    layer.closeAll();
                                    self.postMessage(controlId, 'game_reset');
                                }
                            })
                        });
                    }
                    getBestRank();
                }).catch(function () {
                    layer.close(self.loadingBox);
                    self.confim({
                        text: '上传积分失败，重新上传？',
                        btnArr: ['重新上传', '返回首页'],
                        cb1: function () {
                            layer.close(self.confimBox);
                            uploadPoints();
                        },
                        cb2: function () {
                            layer.closeAll();
                            self.postMessage(controlId, 'game_reset');
                        }
                    })
                })
            }

            uploadPoints();
        },
        getProvinceList: function (cb) {//获取省份数据列表
            var self = this;
            var params = "&secret_key=" + self.secret_key;
            Utils.getToken(function (result) {
                $.ajax({
                    url: lanh.msHost.replace(/:\d+/g, '') + "api/identify_service/v1/divisions/provinces?session_id=" + result.session_id + params,
                    type: "GET",
                    contentType: "application/json",
                    dataType: "json",
                    headers: { session_id: result.session_id },
                    data: {},
                    success: function (result) {
                        if (result.status == 0) {
                            !!cb && cb(result.data);
                        } else {
                            Utils.simpleMsg('获取省份数据列表失败');
                        }
                    },
                    error: function (result) {
                        Utils.simpleMsg('获取省份数据列表失败!');
                    }
                });
            })
        },
        getCityList: function (id, cb) {//获取城市数据列表
            var self = this;
            var params = "&secret_key=" + self.secret_key +"&province_code=" + id;
            Utils.getToken(function (result) {
                $.ajax({
                    url: lanh.msHost.replace(/:\d+/g, '') + "api/identify_service/v1/divisions/cities?session_id=" + result.session_id + params,
                    type: "GET",
                    contentType: "application/json",
                    dataType: "json",
                    headers: { session_id: result.session_id },
                    data: {},
                    success: function (result) {
                        if (result.status == 0) {
                            !!cb && cb(result.data);
                        } else {
                            Utils.simpleMsg('获取城市数据列表失败');
                        }
                    },
                    error: function (result) {
                        Utils.simpleMsg('获取城市数据列表失败!');
                    }
                });
            })
        },
        getAreasList: function (id, cb) {//获取区域数据列表
            var self = this;
            var params = "&secret_key=" + self.secret_key + "&city_code=" + id;
            Utils.getToken(function (result) {
                $.ajax({
                    url: lanh.msHost.replace(/:\d+/g, '') + "api/identify_service/v1/divisions/areas?session_id=" + result.session_id + params,
                    type: "GET",
                    contentType: "application/json",
                    dataType: "json",
                    headers: { session_id: result.session_id },
                    data: {},
                    success: function (result) {
                        if (result.status == 0) {
                            !!cb && cb(result.data);
                        } else {
                            Utils.simpleMsg('获取区域数据列表失败');
                        }
                    },
                    error: function (result) {
                        Utils.simpleMsg('获取区域数据列表失败!');
                    }
                });
            })
        },
        fileUpload: function (formdata, cb) {//图片上传
            var self = this;
            var params = "&secret_key=" + self.secret_key;
            Utils.getToken(function (result) {
                $.ajax({
                    url: lanh.msHost.replace(/:\d+/g, '') + "api/assets_service/v1/assets/upload?session_id=" + result.session_id + params,
                    type: "POST",
                    contentType: false,
                    processData: false,
                    dataType: "json",
                    headers: { session_id: result.session_id },
                    data: formdata,
                    success: function (result) {
                        if (result.status == 0) {
                            !!cb && cb(result.data[0].file);
                        } else {
                            Utils.simpleMsg('文件上传失败');
                        }
                    },
                    error: function (result) {
                        Utils.simpleMsg('文件上传失败!');
                    }
                });
            })
        },
        buryingPoint: function(param){//埋点
            var self = this;
            Utils.isWxMini(function (matched) {
                var option = $.extend({
                    "forwardKey": self.myforwardKey,
                    "relationId": lanh.kid,
                    "rootUserId": (Utils.myrootUserId || Utils.getQueryString('rootUserId') || Utils.getQueryString('userId')),
                    "clientType": (!!matched ? 'weapp' : (!!Utils.isWX() ? 'wx' : 'pc'))
                }, param);
                Utils.getToken(function (result) {
                    $.ajax({
                        url: lanh.apiHost.replace(/:\d+/g, '') + "relationship/behavior/gather?session_id=" + result.session_id,
                        type: "POST",
                        contentType: "application/json",
                        dataType: "json",
                        headers: { session_id: result.session_id },
                        data: JSON.stringify(option),
                        success: function (result) {
                            // self.simpleMsg('埋点成功!');
                        },
                        error: function (result) {
                            // self.simpleMsg(result.message);
                        }
                    });
                })
            })
        },
        openRedpack: function (config) {//弹出红包界面
            var self = this,
                key = 'default',
                redPacketInfo = config.redPacketInfo;

            new Promise(function (resolve, rej) {
                $.get("/public/layer/theme/" + key + "/redpack.html", function (data) {
                    resolve(self.getTemplate(data, 'redpack-open'));
                });
            }).then(function (result) {
                //组装数据，替换模板变量
                var tpl = result.replace('${bussinessHead}', redPacketInfo.b_logo)
                    .replace('${bussinessName}', redPacketInfo.b_name)
                    .replace('${title}', redPacketInfo.red_packet_title)
                    .replace('${content}', redPacketInfo.red_packet_content);

                layer.open({
                    type: 0,
                    anim: false,
                    content: tpl,
                    className: "layer-winning",
                    shade: 'background-color: rgba(0,0,0,.6)',
                    shadeClose: false,
                    scrollbar: false,
                    success: function (elem) {
                        var $openBtn = $(elem).find('#open');
                        var $closeBtn = $(elem).find('#close');
                        var eventType = self.getPlatform() == "pc" ? 'click' : 'touchend';
                        var isOpening = false; //点击加锁

                        self.bindAnim($('.redpack-wrap'), 'bounceInDown');
                        $openBtn.on(eventType, function () {
                            if(isOpening) return false;
                            isOpening = true;
                            Utils.getToken(function (result) {
                                $.ajax({
                                    url: lanh.apiHost.replace(/:\d+/g, '') + "award/redpacket/open?session_id=" + result.session_id,
                                    type: "POST",
                                    contentType: "application/json",
                                    dataType: "json",
                                    headers: { session_id: result.session_id },
                                    data: JSON.stringify({
                                        main_id: Utils.awardRedPacket,
                                        rootUserId: (Utils.getQueryString('rootUserId') || Utils.getQueryString('userId'))
                                    }),
                                    success: function (result) {
                                        if (result.status == 0) {//已打开
                                            Utils.emit('getRedpackInfo', true);
                                        } else {
                                            Utils.simpleMsg('红包打开失败，status:'+result.status);
                                        }
                                        isOpening = false;
                                    },
                                    error: function (err) {
                                        Utils.simpleMsg('红包打开失败');
                                        isOpening = false;
                                    }
                                });
                            })
                        });
                        $closeBtn.on(eventType, function (e) {
                            e.stopPropagation();
                            e.preventDefault();
                            layer.closeAll();
                            Utils.redpackOpening = false;
                        });
                    }
                })
            }).catch(function () { });
        },
        forwardRedpack: function (config) {//弹出转发红包界面
            var self = this,
                key = 'default',
                redPacketInfo = config.redPacketInfo;

            new Promise(function (resolve, rej) {
                $.get("/public/layer/theme/" + key + "/redpack.html", function (data) {
                    resolve(self.getTemplate(data, 'redpack-forward'));
                });
            }).then(function (result) {
                if(redPacketInfo.target_visitor < config.relation.length) config.relation = config.relation.slice(0, redPacketInfo.target_visitor);
                //组装数据，替换模板变量
                var original_relation_length = config.relation.length;
                var arr_data = [], concat_arr = [], headImg_width = '';
                
                //根据需要达成的人数，补齐头像
                if(redPacketInfo.target_visitor > config.relation.length && config.relation.length < 8) { 
                    var len = redPacketInfo.target_visitor > 8 ? 8 : redPacketInfo.target_visitor;
                    for(var i=0; i < (len - config.relation.length); i+=1){
                        arr_data.push({
                            wx_face: '/public/images/redpack/head_replace.png'
                        });
                    }
                }

                concat_arr = config.relation.concat(arr_data);
                headImg_width = (concat_arr.length * 58 + 14 + (redPacketInfo.target_visitor > 8 ? 27 : 0)) / 75;
                
                //根据数据替换头像模板
                var headArr = concat_arr.map(function (item, index) {
                    return '<img class="headimg" src="'+ item.wx_face +'" style="z-index: '+ ( 10 - index )+';left:'+ (0.773333 * index) +'rem;">'
                })
                // 需要达成的人数 > 8, 添加 ...
                redPacketInfo.target_visitor > 8 && headArr.push('<span style="position: absolute; left: 6.5rem;top: 0.1rem; color: #fff;">...</span>');

                var tpl = result.replace('${original_money}', config.money)
                    .replace('${target_visitor}', redPacketInfo.target_visitor)
                    .replace('${reach_lenth}', original_relation_length)
                    .replace('${headImg_width}', headImg_width + 'rem')
                    .replace('${cuntTime}', (redPacketInfo.receive_num == redPacketInfo.red_packet_num ? '红包已派完' : (config.activeState == 3 ? '活动已结束' : '')))
                    .replace('${headImgArr}', headArr.join(''));

                layer.open({
                    type: 0,
                    anim: false,
                    content: tpl,
                    className: "layer-winning",
                    shade: 'background-color: rgba(0,0,0,.6)',
                    shadeClose: false,
                    scrollbar: false,
                    success: function (elem) {
                        var $closeBtn = $(elem).find('#close');
                        var $cuntTime = $(elem).find('#cuntTime');
                        var _timer = null;
                        var leftTime = config.remain_time;
                        var eventType = self.getPlatform() == "pc" ? 'click' : 'touchend';
                        self.bindAnim($('.redpack-wrap'), 'bounceInDown');

                        function checkTime(i){ //将0-9的数字前面加上0，例1变为01 
                            return (i<10 ? "0" + i : i);
                        }
                        function leftTimer(time){ 
                            leftTime = time; //计算剩余的毫秒数 
                            var days = parseInt(leftTime / 1000 / 60 / 60 / 24 , 10); //计算剩余的天数 
                            var hours = parseInt(leftTime / 1000 / 60 / 60 % 24 , 10); //计算剩余的小时 
                            var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟 
                            var seconds = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数 
                            days = checkTime(days); 
                            hours = checkTime(hours); 
                            minutes = checkTime(minutes); 
                            seconds = checkTime(seconds); 
                            $cuntTime.text(days+"天" + hours+"小时" + minutes+"分"+seconds+"秒");  
                        } 

                        //红包没领完 && 活动没结束
                        if(redPacketInfo.receive_num != redPacketInfo.red_packet_num && config.activeState != 3) { 
                            leftTimer(leftTime);
                            _timer = setInterval(function(){
                                leftTimer(leftTime - 1000);
                            }, 1000); 
                        }
                        
                        $closeBtn.on(eventType, function (e) {
                            e.stopPropagation();
                            e.preventDefault();
                            layer.closeAll();
                            !!_timer && clearInterval(_timer);
                            Utils.redpackOpening = false;
                        });
                    }
                })
            }).catch(function () { });
        },
        reachRedpack: function (config) {//弹出红包领取成功界面
            var self = this,
                key = 'default',
                redPacketInfo = config.redPacketInfo;

            Utils.isWxMini(function (matched) {
                new Promise(function (resolve, rej) {
                    $.get("/public/layer/theme/" + key + "/redpack.html", function (data) {
                        resolve(self.getTemplate(data, !!matched ? 'redpack-reach' : 'redpack-reach-wx'));
                    });
                }).then(function (result) {
                    if(redPacketInfo.target_visitor < config.relation.length) config.relation = config.relation.slice(0, redPacketInfo.target_visitor);
                    var headImg_width = (config.relation.length * 58 + 14 + (config.relation.length > 8 ? 27 : 0)) / 75;
                    
                    //根据数据替换头像模板
                    var headArr = config.relation.map(function (item, index) {
                        return '<img class="headimg" src="'+ item.wx_face +'" style="z-index: '+ ( 10 - index )+';left:'+ (0.773333 * index) +'rem;">'
                    })
                    // 人数 > 8, 添加 ...
                    headArr.length > 8 && headArr.push('<span style="position: absolute; left: 6.5rem;top: 0.1rem; color: #fff;">...</span>');
    
                    var tpl = result.replace('${red_packet_premoney}', config.money)
                        .replace('${target_visitor}', redPacketInfo.target_visitor)
                        .replace('${reach_lenth}', config.relation.length)
                        .replace('${headImg_width}', headImg_width + 'rem')
                        .replace('${is_finish}', config.activeState == 3 ? '<p style="top: 7.32rem;font-size: 0.373rem;">活动已结束</p>' : '')
                        .replace('${headImgArr}', headArr.join(''));
    
                    layer.open({
                        type: 0,
                        anim: false,
                        content: tpl,
                        className: "layer-winning",
                        shade: 'background-color: rgba(0,0,0,.6)',
                        shadeClose: false,
                        scrollbar: false,
                        success: function (elem) {
                            var $closeBtn = $(elem).find('#close');
                            var $gotoMini = $(elem).find('#gotoMini');
                            var eventType = self.getPlatform() == "pc" ? 'click' : 'touchend';
                            self.bindAnim($('.redpack-wrap'), 'bounceInDown');

                            $closeBtn.on(eventType, function (e) {
                                e.stopPropagation();
                                e.preventDefault();
                                layer.closeAll();
                                Utils.redpackOpening = false;
                            });
    
                            $gotoMini.on(eventType, function (e) {//跳转到小程序我的页面
                                layer.closeAll();
                                e.stopPropagation();
                                e.preventDefault();
                                Utils.redpackOpening = false;
                                wx.miniProgram.reLaunch({ url: '/pages/user/user' });
                            });
                        }
                    })
                }).catch(function () { });
            })
            
        }
        // almostRedpack: function (config) {//弹出转发红包界面
        //     var self = this,
        //         key = 'default';

        //     new Promise(function (resolve, rej) {
        //         $.get("/public/layer/theme/" + key + "/redpack.html", function (data) {
        //             resolve(self.getTemplate(data, 'redpack-almost'));
        //         });
        //     }).then(function (result) {

        //         layer.open({
        //             type: 0,
        //             anim: false,
        //             content: result,
        //             className: "layer-winning",
        //             shade: 'background-color: rgba(0,0,0,.6)',
        //             shadeClose: false,
        //             scrollbar: false,
        //             success: function (elem) {
        //             }
        //         })
        //     }).catch(function () { });
        // },
    }

    if(!Utils.getQueryString('userId')){
        Utils.layerIndex = layer.open({ type: 2 });
    };
    
    function getToken(cb) {
        var session_id = Utils.getQueryString('session_id') || sessionStorage.getItem('session_id') || '',
            uuidReg = /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i;
        // if (Utils.isWX() && (!session_id || !uuidReg.test(session_id))) {
            // console.log('调用微信授权获取用户信息');
            // // 默认正式环境地址
            // var host = 'api-kpaas.cloudmarkee.com';
            // // 临访域名都访问测试环境的地址
            // if (/^(http[s]?:\/\/[w]{0,3}\.?)?[0-9]*\.(pc|wap)/i.test(location.href)) {
            //     host = 'api.kpaas.biaoxiaoxu.cn';
            // }
            // Utils.loading(lanh.msHost);
            // location.href = 'http://api.kpaas.biaoxiaoxu.cn/api/identify_service/v1/openauth/wx_authorize?secret_key=e00a05cf37305a22ba10fec428b4ab01&redirect_uri=' + encodeURIComponent(location.href);
            // return;
        // }
        uuidReg.lastIndex = 0; // 重置 regex 的下次匹配位置
        var copy = (window.extend || $.extend);
        var token = copy(true, {
            userId: '00000000-0000-0000-0000-000000010001',
            phoneNumber: '18900010001',
            nickName: 'kma mock user',
            id: '',
            session_id: ''
        }, (!!session_id && uuidReg.test(session_id) ? {
            userId: Utils.getQueryString('userId'),
            phoneNumber: Utils.getQueryString('phoneNumber'),
            nickName: Utils.getQueryString('nickName'),
            id: Utils.getQueryString('id'),
            session_id: session_id
        } : {}));
        globalCache.token = copy(true, {}, token);
        return cb && cb(token);
    }
    function onOrEmit(type, cb, ctx) {
        var handlers = globalCache[type];
        if (cb === true) {
            var fns = handlers,
                len = fns.length;
            for (; len--;) {
                try {
                    fns[len]();
                } catch (e) {
                    console.error(e);
                }
            }
        } else if (typeof cb === 'function') {
            handlers.push(Utils.bind(ctx, cb) || emptyFn);
        }
    }
}(window || this);
// 统一处理软键盘弹出遮挡输入框问题
if (Utils.getPlatform() != "pc") {
    var _layer = $(".layui-m-layercont");
    window.addEventListener("focusin", function (evt) {
        var event = evt || window.evt;
        var _target = event.target;
        if ($(_target).attr('id') != 'form_0') {
            _layer.css("margin-top", "-6rem");
        }
    });
    window.addEventListener("focusout", function (evt) {
        var event = evt || window.evt;
        var _target = event.target;
        if ($(_target).attr('id') != 'form_0') {
            _layer.css("margin-top", "0");
        }
    });
}
window.onload = function(e) {     
　　Utils.accessStartTime = new Date().getTime();
};
Utils.on('reportTime', function(){//上报浏览时长
    var _reportTimer = null;
    _reportTimer = setInterval(function(){
        var nowTime = new Date().getTime();
        var time = (nowTime - Utils.accessStartTime) / 1000;
        Utils.buryingPoint({ indexType: 'user_report_time',timeLength: time, timeStamp: Utils.accessStartTime });
    }, 5000);
}); 
window.addEventListener("message", function receiveMessage(evt) {
    var data = evt.data;
    !!data ? typeof evt.data === 'string' ? JSON.parse(data) : data : {};
    if (data.type === 'flip') {
        return Utils.emit('flip', data.pageIndex);
    }
    return Utils.emit(data.type, data);
}, false);
Utils.on('game_init', function (evt, params) {
    console.log(data);
    var data = params.data || {},
        contentWindow = params.contentWindow;
    data.type = 'game_init';
    
    if ($('.swiper-slide').length > 1) {
        $('#flip-arrow').hide();
    }
    Utils.isWxMini(function (matched) {
        data.shareId = Utils.getQueryString('rootUserId') || Utils.getQueryString('userId');
        data.isWeapp =  matched ? 'weapp' : (!!Utils.isWX() ? 'wx' : 'pc');
        data.forwardKey = Utils.myforwardKey;
        !!contentWindow && contentWindow.postMessage(data, '*');
    })
    
});

Utils.on('draw_prize', function (evt, params) {//游戏结束,弹出挑战结果
    Utils.openchanllengeResult(params);
});
Utils.on('draw_end', function (evt, config) {//抽奖结束
    switch (config.data.code) {
        case 1: //用户正在参与抽奖
        case 4: //奖品数量不足
        case 8: //未抽到
            Utils.openNotWinning(config.controlId);
            break;//未中奖
        case 5: //抽奖次数已用完
            Utils.simpleMsg("您今天的抽奖次数已用完，下次好运。");
            break;
        case 6: //中奖次数已用完
            Utils.simpleMsg("您已经领取过奖品，点击我的奖品查看。");
            break;
        case 10: //不在活动时间
            Utils.simpleMsg("活动未开始或已结束，请注意查看说明。");
            break;
        case 200: //中奖
            Utils.buryingPoint({indexType: 'user_click', timeStamp: new Date().getTime(),extType: 'award' });   
            Utils.openSwitchCashPrize(config.controlId, { prizeName: config.data.prizeName, optionName: config.data.optionName, icon: config.data.icon, id: config.data.id || '' });
            break;
        default:
            Utils.simpleMsg("服务端发生异常，小宝正火速解决。");
            break;
    }
});
Utils.on('my_prize', function (evt, data) {//我的奖品
    Utils.openMyPrize(data.controlId);
});
Utils.on('game_info', function (evt, data) {//游戏说明
    Utils.openActivityReadme(data.controlId);
});
Utils.on('game_rank', function (evt, data) {//排行榜
    Utils.openGameRank(data.controlId);
});
// 注册插件退出事件
Utils.on('game_quit', function (evt, data) {
    if ($('.swiper-slide').length > 1) {
        $('#flip-arrow').show();
    }
});
$(function () {
    // 如果不支持css动画就显示二维码，提示用户扫码预览
    if (!Utils.checkCssAnimation()) {
        //"../MidWay/public/bower_components/qrcodejs/qrcode.min.js"
        return Utils.createScript("/public/dist/qrcode.min.js", function () {
            $('#page-qrcode').show();
            new QRCode(document.getElementById("qrcode-panel"), {
                text: location.href,
                width: 200,
                height: 200,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H 
            });
            // if(!Utils.getQueryString('userId')){
            //     layer.close(Utils.layerIndex);
            // }
            
        })
    }
    

    // 动态加载微信 jssdk
    Utils.isWxMini(function (matched) {
        var url = location.href;
        var eventType = Utils.getPlatform() == "pc" ? 'click' : 'touchend';
        //如果是预约页则跳过授权相关逻辑
        if(!!Utils.getQueryString('index')) return false;

        new Promise(function(resolve, reject) {
            Utils.getToken(function (result) {
                $.ajax({
                    url: lanh.apiHost.replace(/:\d+/g, '') + 'manuscript/detail?id=' + lanh.kid + '&session_id=' + result.session_id ,
                    method: 'get',
                    dataType: 'json',
                    headers: { session_id: result.session_id },
                    success: function (data, status, xhr) {
                        resolve(data.data);
                    },
                    error: function (err, xhr) {
                        reject('获取活动详情失败：err'+JSON.stringify(err));
                    }
                })
            })
        }).then(function(data){
            // 缓存h5链接，预约时用
            Utils.h5Url = data.url;
            //缓存红包id
            Utils.awardRedPacket = data.awardRedPacket;
            if(!matched){//h5
                sessionStorage.setItem('session_id', data.session_id);
                sessionStorage.setItem('acitivityName', data.name);
                Utils.goodsCount = data.goodsNumber;
                //海报类型屏蔽右上角分享
                // if(data.manuscriptType == 2 && !Utils.getQueryString('preview') && !!WeixinJSBridge) {  WeixinJSBridge.call('hideOptionMenu');  }
                //不是已发布活动 || pc端模拟预览 || 类型为海报，不走以下微信授权流程
                if(data.type != 3 || !!Utils.getQueryString('preview') || data.manuscriptType == 2){ return false; }
                if(!Utils.isWX() || !Utils.getQueryString('userId')){ //未授权，去授权
                    
                    Utils.getToken(function (result) {
                        new Promise(function(resolve, rej){
                            $.ajax({//获取授权需要的数据
                                url: lanh.msHost.replace(/:\d+/g, '') + "api/identify_service/v1/openauth/wx_authorize?secret_key=" +  Utils.secret_key,
                                type: "POST",
                                contentType: "application/json",
                                dataType: "json",
                                data: {},
                                success: function (res) {
                                    resolve(res.data);
                                },
                                error: function (err) {
                                    rej();
                                }
                            })
                        }).then(function(authorizeData){
                            var msHost = (location.href.indexOf('tuixb.cn') != -1 ? 'https:' : 'http:' ) + lanh.msHost;
                            function authorize() {
                                window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+authorizeData.appid+'&redirect_uri='+encodeURIComponent(msHost.replace(/:\d+/g, '') + '/api/identify_service/v1/openauth/wx_callback?secret_key='+Utils.secret_key+'&returnUrl='+encodeURIComponent(url))+'&response_type=code&scope=snsapi_userinfo&state='+authorizeData.state+'#wechat_redirect';
                                // window.location.href = lanh.msHost.replace(/:\d+/g, '') +"api/identify_service/v1/openauth/wx_authorize?secret_key=" + Utils.secret_key+ "&redirect_uri=" + encodeURIComponent(url);                 
                            }
                            var $mask = $('\
                            <div style="position:absolute;top:0;left:0;width:100%;height:100vh;line-height:100vh;text-align:center;background-color:rgba(0,0,0,.5);z-index:2;">\
                                <button id="btn" style="width:4rem;height:1.5rem;border-radius:1.5rem;line-height:1.5rem;border:none;outline:none;color:#fff;background-color:#00bad0;font-size:0.5rem;">授权登陆</button>\
                            </div>');
                            authorize();
                            setTimeout(function(){
                                $("body").append($mask);
                            },3000);
                            $mask.find('#btn').on(eventType, function(){
                                authorize();
                            });
                        }).catch(function(){
                            Utils.simpleMsg('获取appid失败，没法授权');
                        })
                    });
                } else {
                    new Promise(function(resolve, reject) {
                        Utils.getToken(function (result) {
                            $.ajax({//获取自己的forwardKey，埋点需要
                                url: lanh.apiHost.replace(/:\d+/g, '') + "relationship/query/forwardKey?session_id=" + result.session_id,
                                type: "POST",
                                contentType: "application/json",
                                dataType: "json",
                                headers: { session_id: result.session_id },
                                data: JSON.stringify({
                                    clientType: "wx",
                                    rootUserId: (Utils.getQueryString('rootUserId') || Utils.getQueryString('userId')),
                                    forwardKey: Utils.getQueryString('forwardKey') || '', // 上级转发key
                                    relationId: lanh.kid, // 活动id
                                    sourceType: 0   	//来源 0:活动，1：名片,
                                }),
                                success: function (result) {
                                    if(result.status == 0) {
                                        Utils.myforwardKey = result.data.forwardKey;
                                        Utils.myrootUserId = result.data.rootUserId;
                                        resolve(result.data);
                                    }
                                },
                                error: function (result) {
                                    Utils.simpleMsg(result.message);
                                    reject();
                                }
                            });
                        })
                    }).then(function(myforwardKey) {
                        // 浏览活动埋点
                        Utils.buryingPoint({indexType: 'user_browse', timeStamp: Utils.accessStartTime });
                        
                        // 初始化预约相关逻辑
                        !Utils.getQueryString('index') && Utils.emit('initAppointment');

                        //配置js-sdk
                        Utils.getToken(function (result) {
                            $.ajax({
                                url: lanh.msHost.replace(/:\d+/g, '') + "api/identify_service/v1/openplatform/get_js_config?session_id=" + result.session_id + "&secret_key=" + Utils.secret_key + "&url=" + encodeURIComponent(url),
                                type: "GET",
                                contentType: "application/json",
                                dataType: "json",
                                headers: { session_id: result.session_id },
                                data: {},
                                success: function (result1) {
                                    if (result1.status == 0) {
                                        wx.config({
                                            debug: false,
                                            appId: result1.data.appId, // 必填，公众号的唯一标识
                                            timestamp: result1.data.timestamp, // 必填，生成签名的时间戳
                                            nonceStr: result1.data.nonceStr, // 必填，生成签名的随机串
                                            signature: result1.data.signature,// 必填，签名
                                            jsApiList: ["onMenuShareAppMessage","onMenuShareTimeline"] // 必填，需要使用的JS接口列表
                                        }); 
                                        
                                        var shareUrl = data.url + '?rootUserId='+ (Utils.myrootUserId || Utils.getQueryString('rootUserId') || Utils.getQueryString('userId')) +'&forwardKey=' + Utils.myforwardKey;  
                                        shareUrl = data.manuscriptType == 3 ? window.location.href.split('?')[0] + '?id=' + lanh.kid + '&rootUserId='+ (Utils.myrootUserId || Utils.getQueryString('rootUserId') || Utils.getQueryString('userId')) +'&forwardKey=' + Utils.myforwardKey : shareUrl;
                                        
                                        wx.ready(function () {
                                            wx.onMenuShareAppMessage({ 
                                                title: data.name || '未命名稿件', // 分享标题
                                                desc: data.description || '', // 分享描述
                                                link: shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                                                imgUrl: data.cover + '@c_1,w_320,h_320', // 分享图标
                                                success: function () {
                                                    Utils.buryingPoint({indexType: 'user_forward', timeStamp: new Date().getTime()});
                                                },
                                                fail: function(err){
                                                    // Utils.loading('设置失败');
                                                }
                                            });
                                            wx.onMenuShareTimeline({
                                                title: data.name || '未命名稿件', // 分享标题
                                                desc: data.description || '', // 分享描述
                                                link: shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                                                imgUrl: data.cover + '@c_1,w_320,h_320', // 分享图标
                                                success: function () {
                                                    Utils.buryingPoint({indexType: 'user_forward', timeStamp: new Date().getTime()});
                                                },
                                                fail: function(err){
                                                    // Utils.loading('设置失败');
                                                }
                                            });
                                        })
                                        wx.error(function (res) {
                                            console.log('微信验证失败。');
                                            console.error(res);
                                        });

                                        //有红包
                                        if(!!data.awardRedPacket){ 
                                            Utils.emit('getRedpackInfo'); 
                                        } else {
                                            Utils.emit('initFastNav'); 
                                        }
                                    }
                                },
                                error: function (result) {
                                    self.simpleMsg('获取jsconfig失败，status:' + result.status);
                                }
                            })
                        })

                        //上报时长
                        Utils.emit('reportTime'); 
                    }).catch(function(){ }); 

                }
            } else {
                //有红包
                if(!!data.awardRedPacket){ 
                    Utils.emit('getRedpackInfo'); 
                } else {
                    Utils.emit('initFastNav'); 
                }
                //获取forwardKey
                Utils.getToken(function (result) {
                    $.ajax({
                        url: lanh.apiHost.replace(/:\d+/g, '') + "relationship/query/forwardKey?session_id=" + result.session_id,
                        type: "POST",
                        contentType: "application/json",
                        dataType: "json",
                        headers: { session_id: result.session_id },
                        data: JSON.stringify({
                            clientType: "wx",
                            rootUserId: (Utils.getQueryString('rootUserId') || Utils.getQueryString('userId')),
                            forwardKey: Utils.getQueryString('forwardKey') || '', // 上级转发key
                            relationId: lanh.kid, // 活动id
                            sourceType: 0   	//来源 0:活动，1：名片,
                        }),
                        success: function (result) {
                            if(result.status == 0) {
                                Utils.myforwardKey = result.data.forwardKey;
                                Utils.myrootUserId = result.data.rootUserId;
                                // 初始化预约相关逻辑
                                !Utils.getQueryString('index') && Utils.emit('initAppointment');
                            }
                        },
                        error: function (result) {
                            Utils.simpleMsg(result.message);
                        }
                    });
                })
            }
        }).catch(function(err){
            Utils.simpleMsg(err);
        });  
        
                        
    });
    
    // 以下是获取红包详情接口
    Utils.on('getRedpackInfo', function(evt, step){
        if(!!Utils.getQueryString('index')) return false;
        new Promise(function(resolve, reject) {
            Utils.getToken(function (result) {
                $.ajax({
                    url: lanh.apiHost.replace(/:\d+/g, '') + 'award/redpacket/info?session_id=' + result.session_id ,
                    type: "POST",
                    contentType: "application/json",
                    dataType: "json",
                    headers: { session_id: result.session_id },
                    data: JSON.stringify({
                        main_id: Utils.awardRedPacket
                    }), 
                    success: function (data, status, xhr) {
                        resolve(data.data);
                    },
                    error: function (err, xhr) {
                        reject('获取红包详情失败：err'+JSON.stringify(err));
                    }
                })
            })
        }).then(function(res){
            if(res.canOpen == 0) {
                Utils.emit('initFastNav');
                return false;
            };
            if(res.open == 0) {//未打开
                Utils.openRedpack(res);
            } else if(step){
                if(res.issue_status == 0 || res.issue_status == 2){//未完成
                    Utils.forwardRedpack(res);
                } else {//已完成
                    Utils.reachRedpack(res);
                }
            }
            //初始化快件菜单
            Utils.emit('initFastNav', 'redpack');
        }).catch(function(err){
            Utils.simpleMsg('获取红包详情失败：err'+JSON.stringify(err));
        })
    })

    // 以下是初始化预约插件的相关逻辑代码
    Utils.on('initAppointment', function() {
        if(!!Utils.getQueryString('index')) return false;
        new Promise(function(resolve, reject) {
            Utils.getToken(function (result) {
                $.ajax({
                    url: lanh.apiHost.replace(/:\d+/g, '') + "activity/plugin/getAppointmentByRelationId?session_id=" + result.session_id + "&relationId=" + lanh.kid,
                    type: "GET",
                    contentType: "application/json",
                    dataType: "json",
                    headers: { session_id: result.session_id },
                    data: {},
                    success: function (data) {
                        resolve(data.data);
                    },
                    error: function (err) {
                        reject('获取预约设置失败：err'+JSON.stringify(err));
                    }
                })
            })
        }).then(function(res){
            if(!!res) {
                $.get("/public/layer/theme/default/appointment.html", function (data) {
                    var tpl = Utils.getTemplate(data, res.data.length > 1 ? 'appointment-btn-double' : 'appointment-btn-single');

                    tpl = tpl.replace('${btn1Bg}', res.data[0].btnStyle.bg)
                            .replace('${btn1Color}', res.data[0].btnStyle.color)
                            .replace('${btn1Text}', res.data[0].button_name) 
                            .replace('${btn2Bg}', res.data[1].btnStyle.bg)
                            .replace('${btn2Color}', res.data[1].btnStyle.color)
                            .replace('${btn2Text}', res.data[1].button_name) 
                    
                    var _appointMenu = $("<div #appoint-menu></div>");

                    _appointMenu.html(tpl);
                    $("body").append(_appointMenu);

                    // 绑定按钮事件
                    var eventType = Utils.getPlatform() == "pc" ? 'click' : 'touchend';
                    var _appointBtn1 = _appointMenu.find('#appointBtn1'),
                        _appointBtn2 = _appointMenu.find('#appointBtn2');
                    
                    Utils.isWxMini(function (matched) {     //----   获取客户端类型方法 
                        var clientType = matched ? 'weapp' : (!!Utils.isWX() ? 'wx' : 'pc');
                        var _param = [
                            'rootUserId=' + (Utils.myrootUserId || Utils.getQueryString('rootUserId') || Utils.getQueryString('userId')),
                            'id=' + lanh.kid,
                            'clientType=' + clientType,
                            'forwardKey=' + Utils.myforwardKey,
                            'session_id=' + (Utils.getQueryString('session_id') || sessionStorage.getItem('session_id')),
                            'userId=' + Utils.getQueryString('userId'),
                            'returnUrl=' + encodeURIComponent(location.href)
                        ];

                        _appointBtn1.on(eventType, function(e){
                            e.stopPropagation();
                            _param.push('index=0');
                            var _path = Utils.h5Url.replace('//','$').split('/')[0].replace('$','//') + '/appointment?' + _param.join('&');
                            window.location.href = _path;
                        })

                        _appointBtn2.on(eventType, function(e){
                            e.stopPropagation();
                            _param.push('index=1');
                            var _path = Utils.h5Url.replace('//','$').split('/')[0].replace('$','//') + '/appointment?' + _param.join('&');
                            window.location.href = _path;
                        })
                    })
                    
                });
            }
        }).catch(function(err){
            Utils.simpleMsg(err);
        })
    });


    return init();
    function init() {
        var inited = false;
        $('#page-panel').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            if (!!inited) {
                return;
            }
            inited = true;
            // 注册逻辑页面init和changed事件
            Utils.on('pageinit', pageChanged);
            Utils.on('pagechanged', pageChanged);
            Utils.ready(true);
            // if(!Utils.getQueryString('userId')){
            //     layer.close(Utils.layerIndex);
            // }
            function pageChanged(evt, data) {
                var dt = $.extend(true, { type: 'pagination' }, data);
                // 在浏览器模拟预览时通知父窗口更新pagination
                if (!!parent) {
                    parent.postMessage(dt, '*');
                }
            }
        }).show();
        setTimeout(function () {
            $('#page-panel').addClass('animated fadeIn');
            if(!Utils.getQueryString('userId')){
                $('#layui-m-layer' + Utils.layerIndex).addClass('animated fadeOut');
            }
        }, 100)
        if (Utils.getPlatform() === "pc" && !document.referrer) {
            $("html").css({ "background-color": "rgb(137, 150, 160)" });
        } else {
            var viewport = Utils.getViewport();
            $('#page-panel').css({ height: viewport.height, width: viewport.width })
        }

        // 添加快速导航
        // Utils.isWxMini(function (matched) {
        //     var eventType = Utils.getPlatform() == "pc" ? 'click' : 'touchend';
        //     if (matched) {
        //         switch (Utils.getQueryString('view')) {
        //             case "task":
        //                 // 我的任务-底部栏
        //                 (function () {
        //                     new Promise(function(resolve, reject) {
        //                         Utils.getToken(function (result) {
        //                             $.ajax({
        //                                 url: lanh.apiHost.replace(/:\d+/g, '') + 'manuscript/detail?id=' + lanh.kid + '&session_id=' + result.session_id ,
        //                                 method: 'get',
        //                                 dataType: 'json',
        //                                 headers: { session_id: result.session_id },
        //                                 success: function (data, status, xhr) {
        //                                     resolve(data.data);
        //                                 },
        //                                 error: function (err, xhr) {
        //                                     rej('获取活动详情失败：err'+JSON.stringify(err));
        //                                 }
        //                             })
        //                         })
        //                     }).then(function(data){
        //                         if(data.manuscriptType == 2) {
        //                             var $extensionNav = $('\
        //                                 <div id="extensionNav">\
        //                                     <div id="normal-menus" class="menus-bar">\
        //                                         <div id="btnShare" class="column-button" style="width: 90vw; margin-left: 5vw;margin-right: 5vw;">\
        //                                             <img style="width:0.5rem; height:0.5rem; margin-right:0.2rem;" src="/public/images/h5/icon_share.png">\
        //                                             <div class="big-font"> 分享 </div>\
        //                                         </div>\
        //                                     </div>\
        //                                 </div>');
        //                         } else {
        //                             var $extensionNav = $('\
        //                             <div id="extensionNav">\
        //                                 <div id="normal-menus" class="menus-bar">\
        //                                     <div id="btnShare" class="column-button" style="width: 40vw; margin-left: 5vw;">\
        //                                         <img style="width:0.5rem; height:0.5rem; margin-right:0.2rem;" src="/public/images/h5/icon_share.png">\
        //                                         <div class="big-font"> 分享 </div>\
        //                                     </div>\
        //                                     <div class="column-button" style="width: 10vw;">\
        //                                         <div style="width:1px; height:90%; border-right: 1px solid #fff;"></div>\
        //                                     </div>\
        //                                     <div id="btnCharts" class="column-button" style="width: 40vw; margin-right: 5vw;">\
        //                                         <img style="width:0.5rem; height:0.5rem; margin-right:0.2rem;" src="/public/images/h5/icon_charts.png">\
        //                                         <div class="big-font"> 查看数据 </div>\
        //                                     </div>\
        //                                 </div>\
        //                             </div>');
        //                         }
        //                         $("body").append($extensionNav);
        //                         $extensionNav.find("#btnShare").on(eventType, function (e) {
        //                             wx.miniProgram.navigateTo({ url: '/pages/extension-task-share/extension-task-share?id=' + Utils.getQueryString('id') });
        //                             e.stopPropagation();
        //                         });
        //                         $extensionNav.find("#btnCharts").on(eventType, function (e) {
        //                             wx.miniProgram.navigateTo({ url: '/pages/extension-task-charts/extension-task-charts?id=' + Utils.getQueryString('id') });
        //                             e.stopPropagation();
        //                         });
        //                     })
                            
        //                 })();
        //                 break;
        //             default: ;
        //         }
        //     }
        // });
        // Utils.almostRedpack() 
        //快件菜单初始化
        Utils.on('initFastNav', function(evt, redpack){
            if(!!Utils.getQueryString('index')) return false;
            var tplArr = !!redpack ? ["<div id='toRedpackLog'><img src='/public/images/fast-nav-redpack.png' /><div>红包</div></div>"] : [];

            Utils.isWxMini(function (matched) {
                if(matched) tplArr.push("<div id='jumpIndex'><img src='/public/images/fast-nav-index.png' /><div>首页</div></div>");
                (function () {
                    var $fastNav = $("#fastNav");
                    new Promise(function (resolve, rej) {
                        $.get("/public/layer/theme/default/fast-nav.html", function (data) {
                            resolve(Utils.getTemplate(data, 'fast-nav'));
                        });
                    }).then(function(result){
                        var tpl = result.replace('${fast-nav}', tplArr.join(''))
                                  .replace('${single-style}', tplArr.length == 0 ? 'height: 1.33rem !important;padding: 0.24rem 0 !important;' : '');
                        $fastNav.html(tpl);

                        $fastNav.on('click','#jumpIndex', function (e) {//首页
                            e.stopPropagation();
                            wx.miniProgram.reLaunch({ url: '/pages/overview/overview' });
                        });
                        
                        $fastNav.on('click', '#toRedpackLog', function (e) {//红包
                            if(Utils.redpackOpening) return false;
                            e.stopPropagation();
                            Utils.redpackOpening = true;
                            Utils.emit('getRedpackInfo', true);
                        });
                        
                        $fastNav.on('click', '#toShare', function (e) {//分享
                            e.stopPropagation();
                            if(matched) {
                                wx.miniProgram.navigateTo({ url: '/pages/extension-task-share/extension-task-share?id=' + Utils.getQueryString('id') + '&rootUserId=' + (Utils.myrootUserId || Utils.getQueryString('rootUserId')) + '&forwardKey=' + Utils.getQueryString('forwardKey') });
                            } else {
                                new Promise(function (resolve, rej) {
                                    $.get("/public/layer/theme/default/redpack.html", function (data) {
                                        resolve(Utils.getTemplate(data, 'share-layer'));
                                    });
                                }).then(function(result){
                                    layer.open({
                                        type: 0,
                                        anim: false,
                                        content: result,
                                        className: "layer-winning",
                                        shade: 'background-color: rgba(0,0,0,.6)',
                                        shadeClose: true,
                                        scrollbar: false
                                    })
                                })
                                
                            }
                        });
                        
                    })
                    
                })();
            })
        })
    }
});