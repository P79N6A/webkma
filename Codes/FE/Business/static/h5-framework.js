
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
            if (!errText) cb(false);
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
        formValidation: function (objArr, cb) {//简易表单验证
            var self = this,
                i = 0,
                len = objArr.length;
            var regObj = {
                'phone': /^(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/,
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
                    return;
                } else if (!!reg && !reg.test(value)) {
                    self.simpleMsg(regErr, cb);
                    return;
                } else if ((!!maxLength && value.length > maxLength) || (!!minLength && value.length < minLength)) {
                    self.simpleMsg(lengthErr, cb);
                    return;
                } else if (typeof (objArr[i].maxValue) == 'number' && maxValue < value) {
                    self.simpleMsg(maxValueErr, cb);
                    return;
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

            Promise.all([
                new Promise(function (resolve, rej) {
                    $.get("/public/layer/theme/" + key + "/tpl.html", function (data) {
                        resolve(self.getTemplate(data, 'activity-readme'));
                    });
                }),
                new Promise(function (resolve, rej) {//请求接口获取数据
                    Utils.getToken(function (result) {
                        $.ajax({
                            url: lanh.apiHost + "activity/plugin/prize?relationId=" + lanh.kid + "&controlId=" + controlId,
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
                            }
                        });
                    })
                })])
                .then(function (results) {
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
                }).catch(function () { });
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
                    success: function (elem) {
                        self.bindAnim($('.layer-qrcode'), 'bounceInDown');
                    }
                })
            }).catch(function () { });
        },
        openWinningForm: function (controlId, config) {//弹出中奖表单
            var self = this,
                key = Utils.pluginConfig[controlId].theme.theme || 'default',
                fromSetting = Utils.pluginConfig[controlId].controlData.fromSetting;

            Promise.all([
                new Promise(function (resolve, rej) {
                    $.get("/public/layer/theme/" + key + "/tpl.html", function (data) {
                        resolve(self.getTemplate(data, 'winning-form'));
                    });
                }),
                new Promise(function (resolve, rej) {//请求接口获取数据
                    resolve(0);
                })])
                .then(function (results) {
                    //组装数据，替换模板变量
                    var tpl = results[0].replace('${prize}', config.prize).replace('${formContent}', fromSetting.map(function (item, index) {
                        return '<p>' +
                            '<label class="small-font">' + item.name + '：</label>' +
                            '<input id="' + item.id + '" type="text"/>' +
                            '</p>';
                    }).join(''));

                    layer.open({
                        type: 0,
                        anim: false,
                        content: tpl,
                        className: "layer-winning",
                        shade: 'background-color: rgba(0,0,0,.6)',
                        shadeClose: false,
                        success: function (elem) {
                            var $goBackBtn = $(elem).find('#goBack');
                            var $submitBtn = $(elem).find('#submit');
                            var eventType = self.getPlatform() == "pc" ? 'click' : 'touchend';
                            var $iframe = $(elem).parents('.frame-container');
                            self.bindAnim($('.layer-winning'), 'bounceInDown');
                            $goBackBtn.on(eventType, function () {
                                layer.closeAll();
                                self.postMessage(controlId, 'game_reset');
                            });
                            $submitBtn.on(eventType, function () {
                                var arr = [];
                                $.each(fromSetting, function (index, item) {
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
                                    $.each(fromSetting, function (index, item) {
                                        item.type = item.type + '_' + item.category;
                                        item.content = $(elem).find('#' + item.id).val();
                                        delete item.id;
                                        delete item.value;
                                    });
                                    // 提交表单
                                    Utils.getToken(function (result) {
                                        $.ajax({
                                            url: lanh.apiHost + "activity/plugin/from/content",
                                            type: "POST",
                                            contentType: "application/json",
                                            dataType: "json",
                                            headers: { session_id: result.session_id },
                                            data: JSON.stringify({
                                                "relationId": lanh.kid,
                                                "controlId": controlId,
                                                "contents": fromSetting,
                                                "shareId": Utils.getQueryString('as_belong_user') || ''
                                            }),
                                            success: function (result) {
                                                self.openWinningInfo(controlId, { prize: config.prize, formArr: fromSetting });
                                            },
                                            error: function (result) {
                                                if (result.status == 400) {
                                                    Utils.simpleMsg(JSON.parse(result.responseText).message || '提交失败!');
                                                } else {
                                                    Utils.simpleMsg('提交失败!');
                                                }
                                            }
                                        });
                                    })

                                })
                            });
                        }
                    })
                }).catch(function () { });
        },
        openWinningInfo: function (controlId, config) {//弹出中奖信息
            var self = this,
                key = Utils.pluginConfig[controlId].theme.theme || 'default';

            new Promise(function (resolve, rej) {
                $.get("/public/layer/theme/" + key + "/tpl.html", function (data) {
                    resolve(self.getTemplate(data, 'winning-info'));
                });
            }).then(function (result) {
                //组装数据，替换模板变量
                var focusTpl = !!Utils.pluginConfig[controlId].controlData.qrcode.url ? '<div class="winning-btn-wrap" style="margin-top:0.65rem;"><button id="goBack" class="winning-btn medium-font" style="margin-right: 0.5rem;">返回首页</button><button id="focus" class="winning-btn medium-font">关注我们</button></div>' : '<div class="winning-btn-wrap" style="margin-top:0.65rem;"><button id="goBack" class="winning-btn medium-font">返回首页</button></div>';
                var tpl = result.replace('${prize}', config.prize).replace('${formContent}', config.formArr.map(function (item, index) {
                    return '<p>' +
                        '<label class="small-font">' + item.name + '：</label>' +
                        '<span class="small-font">' + item.content + '</span>' +
                        '</p>';
                }).join('')).replace('${focus}', focusTpl);

                layer.open({
                    type: 0,
                    anim: false,
                    content: tpl,
                    className: "layer-winning",
                    shade: 'background-color: rgba(0,0,0,.6)',
                    shadeClose: !!focusTpl ? false : true,
                    success: function (elem) {
                        var $focusBtn = $(elem).find('#focus');
                        var $goBackBtn = $(elem).find('#goBack');
                        var eventType = self.getPlatform() == "pc" ? 'click' : 'touchend';
                        self.bindAnim($('.layer-winning'), 'bounceInDown');
                        $focusBtn.on(eventType, function () {
                            self.openQrcode(controlId);
                        });
                        $goBackBtn.on(eventType, function () {
                            layer.closeAll();
                            self.postMessage(controlId, 'game_reset');
                        })
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
                var focusTpl = !!Utils.pluginConfig[controlId].controlData.qrcode.url ? '<button id="goBack" class="winning-btn medium-font" style="margin-right: 0.5rem;">再来一次</button><button id="focus" class="winning-btn medium-font">关注我们</button>' : '<button id="goBack" class="winning-btn medium-font">再来一次</button>';
                var tpl = result.replace('${focus}', focusTpl);

                layer.open({
                    type: 0,
                    anim: false,
                    content: tpl,
                    className: "layer-winning",
                    shade: 'background-color: rgba(0,0,0,.6)',
                    shadeClose: false,
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
                var focusTpl = !!Utils.pluginConfig[controlId].controlData.qrcode.url ? '<button id="goBack" class="winning-btn medium-font" style="margin-right: 0.5rem;">返回首页</button><button id="focus" class="winning-btn medium-font">关注我们</button>' : '<button id="goBack" class="winning-btn medium-font">返回首页</button>';
                var tpl = result.replace('${focus}', focusTpl).replace('${face}', config.face);

                layer.open({
                    type: 0,
                    anim: false,
                    content: tpl,
                    className: "layer-winning",
                    shade: 'background-color: rgba(0,0,0,.6)',
                    shadeClose: false,
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
            new Promise(function (resolve, rej) {
                Utils.getToken(function (result) {
                    $.ajax({
                        // 'c88694a8-0871-4597-b006-2a2f96f187f2' || 
                        // url: lanh.apiHost + "activity/plugin/drawprize/log?relationId=11001180921000000001&controlId=control_d4d5a5cd-0bf2-49dc-ad56-72780694b633",
                        url: lanh.apiHost + "activity/plugin/drawprize/log?relationId=" + lanh.kid + "&controlId=" + controlId,
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
                        }
                    });
                })
            }).then(function (result) {
                if (!!result.log) {//中奖
                    if (!!result.content) {//填写过表单
                        self.openWinningInfo(controlId, { prize: result.log.prizeName, formArr: result.content });
                    } else {//未填表单
                        self.openWinningForm(controlId, { prize: result.log.prizeName });
                    }
                } else {//没有中奖信息
                    self.openNoWinningInfo(controlId, { face: result.face || '/public/images/h5/default-face.png' });
                }
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
                    className: "layer-smashGoldEggs",
                    shade: 'background-color: rgba(0,0,0,.6)',
                    success: function (elem) {
                        var eventType = self.getPlatform() == "pc" ? 'click' : 'touchend';
                        $(elem).find('.closeBtn').on(eventType, function (e) {
                            layer.closeAll();
                        })
                        $(elem).find('.hammer').on(eventType, function (e) {
                            self.goDrawPrize(controlId, function (result) {
                                $(elem).find('.smashGoldEgg-bg').addClass("smashing");
                                setTimeout(function () {
                                    $(elem).find('.smashGoldEgg-bg').removeClass("smashing");
                                    $(elem).find('.smashGoldEgg-bg').addClass("smashed");
                                    setTimeout(function () {
                                        $(elem).find('.smashGoldEgg-bg').addClass("finished");
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
                    shade: 'background-color: rgba(0,0,0,.6)',
                    success: function (elem) {
                        var eventType = self.getPlatform() == "pc" ? 'click' : 'touchend';
                        $(elem).find('.redEnvelopes').on(eventType, function (e) {
                            var _this = this;
                            self.goDrawPrize(controlId, function (result) {
                                $(_this).attr('src', '/public/images/dismant-red-envelopes/redEnvelopes2.png');
                                if (!!self._setTimeout) clearTimeout(self._setTimeout);
                                self._setTimeout = setTimeout(function () {
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
                    success: function (elem) {
                        var $startBtn = $(elem).find('#start');
                        var $closeBtn = $(elem).find('.closeBtn');
                        var eventType = self.getPlatform() == "pc" ? 'click' : 'touchend';
                        self.bindAnim($('.draw'), 'bounceInDown');
                        $startBtn.on(eventType, function () {
                            $startBtn.parent().addClass('start');
                            self.goDrawPrize(controlId, function (result) {
                                if (!!self._setTimeout) clearTimeout(self._setTimeout);
                                self._setTimeout = setTimeout(function () {
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
            Promise.all([
                new Promise(function (resolve, rej) {
                    $.get("/public/layer/theme/" + key + "/game-ranks.html", function (data) {
                        rank1 = self.getTemplate(data, 'rank1');
                        rank2 = self.getTemplate(data, 'rank2');
                        resolve(self.getTemplate(data, 'gameRankings'));
                    });
                }),
                new Promise(function (resolve, rej) {//请求接口获取数据
                    Utils.getToken(function (result) {
                        $.ajax({
                            url: lanh.apiHost + "activity/plugin/score/list",
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
                            }
                        });
                    })
                })
            ]).then(function (results) {
                var rankContent = '';
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
                var tpl = results[0].replace('{myselfRank}', results[1].rank)
                    .replace('{myselfFace}', results[1].userFace)
                    .replace('{rankContent}', rankContent);
                layer.open({
                    type: 0,
                    anim: false,
                    content: tpl,
                    shadeClose: false,
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
            }).catch(function () { });
        },
        goDrawPrize: function (controlId, cb) {//去抽奖
            Utils.getToken(function (result) {
                $.ajax({
                    url: lanh.apiHost + "activity/plugin/drawprize",
                    type: "POST",
                    contentType: "application/json",
                    dataType: "json",
                    headers: { session_id: result.session_id },
                    data: JSON.stringify({
                        "relationId": lanh.kid,
                        "controlId": controlId
                    }),
                    success: function (result) {
                        !!cb && cb(result.data);
                    },
                    error: function (result) {
                        if (result.status == 400) {
                            Utils.simpleMsg(JSON.parse(result.responseText).message);
                        }
                    }
                });
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

            new Promise(function (resolve, rej) {
                Utils.getToken(function (result) {
                    $.ajax({
                        url: lanh.apiHost + "activity/plugin/score",
                        type: "POST",
                        contentType: "application/json",
                        dataType: "json",
                        headers: { session_id: result.session_id },
                        data: JSON.stringify({
                            "relationId": lanh.kid,
                            "controlId": config.controlId,
                            "score": score
                        }),
                        success: function (result) {
                            resolve(true);
                        },
                        error: function (result) {
                            if (result.status == 400) {
                                Utils.simpleMsg(JSON.parse(result.responseText).message);
                            }
                        }
                    });
                })
            }).then(function (result) {
                Promise.all([
                    new Promise(function (resolve, rej) {
                        $.get("/public/layer/theme/" + key + "/tpl.html", function (data) {
                            resolve(self.getTemplate(data, tplName));
                        });
                    }),
                    new Promise(function (resolve, rej) {//请求接口获取数据
                        Utils.getToken(function (result) {
                            $.ajax({
                                url: lanh.apiHost + "activity/plugin/user/rank?relationId=" + lanh.kid + "&controlId=" + controlId,
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
                                }
                            });
                        })
                    })
                ]).then(function (results) {
                    switch (tplName) {
                        case 'challenge-suc'://挑战成功
                            tpl = results[0].replace('${score}', score)
                                .replace('${bitNum}', results[1].rankPer)
                                .replace('${bestScores}', results[1].bestScore)
                                .replace('${bestRank}', results[1].bestRank)
                                .replace('${leftNum}', (!!results[1].isWin ? '' : '<p class="small-font" style="top:9.7rem;color:#0ca3b0;">今日还有' + results[1].intervalDrawTime + '次抽奖机会</p>'))
                                .replace('${bigBtn}', (!!results[1].isWin ? '<button id="my-prize" class="big-font">查看奖品</button>' : (results[1].intervalDrawTime > 0 ? '<button id="goDraw" class="big-font">赶紧去抽奖</button>' : '<button class="big-font disabeld">赶紧去抽奖</button>')));
                            break;
                        case 'challenge-fail'://挑战失败
                            tpl = results[0].replace('${score}', score)
                                .replace('${needScore}', Utils.pluginConfig[controlId].score)
                                .replace('${bestScores}', results[1].bestScore)
                                .replace('${bestRank}', results[1].bestRank)
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
                        success: function (elem) {
                            var $rankBtn = $(elem).find('#rank'),
                                $restartBtn = $(elem).find('#restart'),
                                $goBackBtn = $(elem).find('#goBack'),
                                $myPrizeBtn = $(elem).find('#my-prize'),
                                $goDrawBtn = $(elem).find('#goDraw');

                            var eventType = self.getPlatform() == "pc" ? 'click' : 'touchend';

                            if (!cacelAnimation) self.bindAnim($('.challenge-suc-bg'), 'bounceInDown');

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
                });

            }).catch(function () { })
        }

    }
    Utils.layerIndex = layer.open({ type: 2 });
    function getToken(cb) {
        if (!!globalCache.token) {
            return cb && cb(globalCache.token);
        }
        var session_id = Utils.getQueryString('session_id'),
            uuidReg = /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i;
        if (Utils.isWX() && (!session_id || !uuidReg.test(session_id))) {
            console.log('调用微信授权获取用户信息');
            // 默认正式环境地址
            var host = 'api-kpaas.cloudmarkee.com';
            // 临访域名都访问测试环境的地址
            if (/^(http[s]?:\/\/[w]{0,3}\.?)?[0-9]*\.(pc|wap)/i.test(location.href)) {
                host = 'api.kpaas.biaoxiaoxu.cn';
            }
            location.href = 'http://' + host + '/api/identify_service/v1/openauth/wx_authorize?secret_key=e00a05cf37305a22ba10fec428b4ab01&redirect_uri=' + encodeURIComponent(location.href);
            return;
        }
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
if (Utils.getPlatform() == "pc") {
    var _layer = document.querySelector(".layui-m-layer");
    var _body = document.querySelector("body");
    window.addEventListener("focusin", function () {
        var event = event || window.event;
        var _target = event.target;
        // Utils.simpleMsg(_target.offsetTop+'---'+ _target.clientHeight + '---'+_body.scrollTop);
        _layer.style.top = (-_target.offsetTop + _body.scrollTop + _target.clientHeight) + "px";
    });
    window.addEventListener("focusout", function () {
        _layer.style.top = "0px";
    });
}
window.addEventListener("message", function receiveMessage(evt) {
    var data = evt.data;
    !!data ? typeof evt.data === 'string' ? JSON.parse(data) : data : {};
    if (data.type === 'flip') {
        return Utils.emit('flip', data.pageIndex);
    }
    return Utils.emit(data.type, data);
    // if (data.type==='game_quit'){
    //      return Utils.emit('game_quit', data);
    // }
    // if (data.type==='my_prize'){
    //     return Utils.emit('my_prize', data);
    // }
}, false);
Utils.on('game_init', function (evt, params) {
    console.log(data);
    var data = params.data || {},
        contentWindow = params.contentWindow;
    data.type = 'game_init';
    !!contentWindow && contentWindow.postMessage(data, '*');
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
            Utils.openWinningForm(config.controlId, { prize: config.data.prizeName });
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
            layer.close(Utils.layerIndex);
        })
    }
    // 动态加载微信 jssdk
    if (Utils.isWX()) {
        var url = location.href;
        var sessionId = Utils.getQueryString('session_id');
        if (!sessionId) {
            // 未授权进行微信授权
            Utils.getToken(function (token) {
                console.log(token);
            });
        } else {
            console.log('已经授权');
        }
        // 暂时未注册公众号，微信中只能用mock用户预览
        //alert('暂时未注册公众号，微信中只能用mock用户预览');
        // 因为要涉及服务端签名。需要特殊处理
        /*return Utils.createScript('https://res.wx.qq.com/open/js/jweixin-1.2.0.js', function () {
            wx.ready(function () {
                console.log('触发页面初始化');
                init();
            });
            wx.error(function (res) {
                console.log('微信验证失败。');
                console.error(res);
            });
            wx.config({
                debug: false,
                appId: '', // 必填，公众号的唯一标识
                timestamp: Date.now(), // 必填，生成签名的时间戳
                nonceStr: '', // 必填，生成签名的随机串
                signature: '',// 必填，签名
                jsApiList: [] // 必填，需要使用的JS接口列表
            });
        });*/
    } else if (Utils.isMiniprogram()) {
        Utils.createScript('https://res.wx.qq.com/open/js/jweixin-1.3.2.js');
    }
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
            layer.close(Utils.layerIndex);
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
            $('#layui-m-layer' + Utils.layerIndex).addClass('animated fadeOut');
        }, 100)
        if (Utils.getPlatform() === "pc" && !document.referrer) {
            $("html").css({ "background-color": "rgb(137, 150, 160)" });
        } else {
            var viewport = Utils.getViewport();
            $('#page-panel').css({ height: viewport.height, width: viewport.width })
        }
        // 添加快速导航
        var $fastNav = $("#fastNav");
        if (Utils.getPlatform() == "pc") {
            $fastNav.hide();
        }
        var eventType = Utils.getPlatform() == "pc" ? 'click' : 'touchend';
        $fastNav.find(".btn-isOpen").on(eventType, function (e) {
            if ($fastNav.find(".btn-nav").css("margin-right") == "0rem") {
                $fastNav.find(".btn-nav").css({ "margin-right": "-2.8rem" });
                $(this).css({ " background-image": "url(/public/images/open.png)" })
            } else {
                $fastNav.find(".btn-nav").css({ "margin-right": "0rem" });
                $(this).css({ " background-image": "url(/public/images/takeup.png)" })
            }
        })
        $fastNav.find(".btn-index").on(eventType, function (e) {
            wx.miniProgram.reLaunch({ url: '/pages/home/home' });
            e.stopPropagation()
        })
        $fastNav.find(".btn-my").on(eventType, function (e) {
            wx.miniProgram.reLaunch({ url: '/pages/my/index' });
            e.stopPropagation();
        })
    }
});