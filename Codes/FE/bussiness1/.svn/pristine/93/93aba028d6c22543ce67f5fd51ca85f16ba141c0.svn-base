/*
    函数库，用于存放公共、通用的函数。
*/
(function (global, factory) {
    "use strict";
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = global.document ?
            factory(global, true) :
            function (w) {
                return factory(w);
            };
    } else {
        factory(global);
    }
})(typeof window !== "undefined" ? window : this, function (window) {
    'use strict';

    //文字选中，用于编辑界面文字模块 START
    var agent = {
        isW3CRangeSupport: !!document.createRange
    };

    var WrappedRange = function (sc, so, ec, eo) {
        this.sc = sc;
        this.so = so;
        this.ec = ec;
        this.eo = eo;

        var nativeRange = function () {
            if (agent.isW3CRangeSupport) {
                var w3cRange = document.createRange();
                w3cRange.setStart(sc, so);
                w3cRange.setEnd(ec, eo);
                return w3cRange;
            } else {
                var textRange = pointToTextRange({
                    node: sc,
                    offset: so
                });
                textRange.setEndPoint('EndToEnd', pointToTextRange({
                    node: ec,
                    offset: eo
                }));
                return textRange;
            }
        };

        this.select = function () {
            var nativeRng = nativeRange();
            if (agent.isW3CRangeSupport) {
                var selection = document.getSelection();
                if (selection.rangeCount > 0) {
                    selection.removeAllRanges();
                }
                selection.addRange(nativeRng);
            } else {
                nativeRng.select();
            }
            return this;
        };
    };

    var _createRange = function () {
        var selection = document.getSelection();
        var sc, so, ec, eo;
        var nativeRng = selection.getRangeAt(0);
        sc = nativeRng.startContainer;
        so = nativeRng.startOffset;
        ec = nativeRng.endContainer;
        eo = nativeRng.endOffset;

        return new WrappedRange(sc, so, ec, eo);
    }

    var _addRange = function (lastRange) {
        lastRange.select();
    }
    //文字选中，用于编辑界面文字模块 END

    var _arrayFn = {};
    //换位: 改变数组中“指向数据”的顺序；array: 数组对象；target: 目标对象；index: 指定换位索引值（根据当前位置计算向前向后多少位）
    _arrayFn.transposition = function (array, target, index) {
        //过滤对象中的$$hashKey
        var _filter = function (obj) {
            var _obj = {};
            for (var key in obj) {
                if (key != "$$hashKey") {
                    _obj[key] = obj[key];
                }
            }
            return _obj;
        }
        var _array = Kdo.utils.copy(array);
        for (var i = 0; i < _array.length; i++) {
            if (_.isEqual(_filter(_array[i]), _filter(target))) {
                var temp = Kdo.utils.copy(_array[i + index]);
                _array[i + index] = Kdo.utils.copy(target);
                _array[i] = temp;
                break;
            }
        }
        return _array;
    }

    _arrayFn.removeTree = function (array, number) {
        var _array = Kdo.utils.copy(array), removeArray = [], removeNumber = null;

        var _filter = function () {
            for (var j = 0; j < _array.length; j++) {
                if (_array[j].parentNumber === removeNumber || removeArray.indexOf(_array[j].parentNumber) !== -1) {
                    removeArray.push(_array[j].number);
                    _array.splice($.inArray(_array[i], _array), 1);
                    _filter();
                }
            }
        }

        for (var i = 0; i < _array.length; i++) {
            if (_array[i].number == number) {
                removeNumber = _array[i].number;
                _array.splice($.inArray(_array[i], _array), 1);
                _filter();
            }
        }
        return _array;
    }

    var _regExp = {};

    _regExp.file = {
        //匹配文本中所有的guid文件全名(guid.suffix)
        fullNameByGuid: function (context) {
            var result = [],
                regExp = new RegExp(lanh.regExp.guid + "\.[a-z0-9A-Z]+", "ig");
            if (!!context) result = context.match(regExp) || [];
            return result;
        }
    }

    //验证浏览器版本
    var _browserVersion = {
        //判断是否Chrome45版本以上内核浏览器
        isChrome: !(navigator.userAgent.indexOf("Chrome") == -1 || navigator.userAgent.substr(navigator.userAgent.indexOf("Chrome") + 7, 2) < 45),
        //判断是否为Firefox浏览器
        isFirefox: navigator.userAgent.indexOf("Firefox") != -1,
        //判断是否为ie浏览器
        isIE: (!!window.ActiveXObject || "ActiveXObject" in window),
        //判断是否为ie11以下浏览器
        isIEBelow11: window.navigator.userAgent.indexOf("MSIE") >= 1
    };

    var byteToHex = [];
    for (var i = 0; i < 256; ++i) {
        byteToHex[i] = (i + 0x100).toString(16).substr(1);
    }
    function bytesToUuid(buf, offset) {
        var i = offset || 0;
        var bth = byteToHex;
        // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
        return ([bth[buf[i++]], bth[buf[i++]],
        bth[buf[i++]], bth[buf[i++]], '-',
        bth[buf[i++]], bth[buf[i++]], '-',
        bth[buf[i++]], bth[buf[i++]], '-',
        bth[buf[i++]], bth[buf[i++]], '-',
        bth[buf[i++]], bth[buf[i++]],
        bth[buf[i++]], bth[buf[i++]],
        bth[buf[i++]], bth[buf[i++]]]).join('');
    }
    $.extend(true, window.Kdo, {
        utils: {
            copy: function (obj) { return JSON.parse(JSON.stringify(obj)) },
            array: _arrayFn,
            regExp: _regExp,
            uuid: function () {
                var rnds = new Array(16);
                return bytesToUuid(mathRNG())
                function mathRNG() {
                    for (var i = 0, r; i < 16; i++) {
                        if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
                        rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
                    }
                    return rnds;
                };
            },
            url: {
                //获取url中的参数
                queryString: function (name) {
                    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
                    var r = window.location.href.substr(window.location.href.indexOf("?") + 1).match(reg);  //匹配目标参数
                    if (r != null) return unescape(r[2]); return null; //返回参数值
                },
                //与业务紧密挂钩的函数：获取当前url类型（内链、外链、关闭）
                getUrlType: function (url) {
                    var guid = !!url ? url.match(RegExp(lanh.regExp.guid, "ig")) : null,
                        hrefType = "";
                    if (guid == lanh.guid.shop) {
                        //商铺链接
                        hrefType = "shoplink"
                    } else if (!!guid) {
                        //栏目或文章或活动专题
                        hrefType = "inlink";
                    } else if (!!url && /^http[s]?:\/\//i.test(url)) {
                        //外链
                        hrefType = "outlink";
                    } else {
                        //关闭
                        hrefType = "close";
                    }
                    return hrefType;
                }
            },
            browserVersion: _browserVersion,
            // 原Kdo.utils
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
            getQueryString: function (name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
                //var r = window.location.search.substr(1).match(reg);
                var _hash = window.location.hash;
                var r = _hash.substr(_hash.indexOf("?") + 1).match(reg);
                if (r != null) return r[2];
                return null;
            },
            actionAddition: function (arg1, arg2) {//加法精度计算
                var r1, r2, m;
                try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
                try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
                m = Math.pow(10, Math.max(r1, r2))
                return (arg1 * m + arg2 * m) / m
            },
            actionSubtraction: function (arg1, arg2) {//减法精度计算
                var r1, r2, m, n;
                try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
                try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
                m = Math.pow(10, Math.max(r1, r2));
                n = (r1 >= r2) ? r1 : r2;
                return ((arg1 * m - arg2 * m) / m).toFixed(n);
            },
            actionMultiplication: function (arg1, arg2) {//乘法精度计算
                var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
                try { m += s1.split(".")[1].length } catch (e) { }
                try { m += s2.split(".")[1].length } catch (e) { }
                return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
            },
            actionDivision: function (arg1, arg2) {//除法精度计算
                var t1 = 0, t2 = 0, r1, r2;
                try { t1 = arg1.toString().split(".")[1].length } catch (e) { }
                try { t2 = arg2.toString().split(".")[1].length } catch (e) { }
                r1 = Number(arg1.toString().replace(".", ""))
                r2 = Number(arg2.toString().replace(".", ""))
                return (r1 / r2) * Math.pow(10, t2 - t1);
            },
            //获取当前稿件类型(模板、专题、推广）
            getRelationType: function (relationId) {
                var _type = "";
                if (!relationId) { return _type; }
                if (relationId.startsWith("1001")) {
                    _type = "template";  //模板
                } else if (relationId.startsWith("1002")) {
                    _type = "special";   //专题
                } else if (relationId.startsWith("1003")) {
                    _type = "extension"; //推广
                }
                return _type;
            },
            asyncOpenWindow: function (callback) {
                var _window = window.open('/static/loading.html');
                callback && callback(_window);
            },
            permission: function (module) {//用户权限
                var userType = sessionStorage.getItem('userType');
                if (!userType) { return false; }
                var userPermission = "";
                switch (userType) {
                    case "1"://普通用户
                        userPermission = "ordinary";
                        break;
                    case "2"://设计师
                        userPermission = "design";
                        break;
                }
                var status = false;
                if (lanh.permission[userPermission][module]) {
                    status = true;
                }
                return status;
            },
            DataLazyLoad: function (element, callback, area) {
                if ($(document).height() <= $(window).height()) {
                    $("body").css('min-height', $(window).height() + 100 + 'px');
                }
                element = !!element ? element : document;//绑定滚动事件的元素
                area = !!area ? area : window;//限定区域
                $(element).unbind('mousewheel').bind('mousewheel', function (event, delta) {
                    var dir = delta > 0 ? false : true;
                    if (dir) {
                        if (element != document) {
                            if (Math.abs($(this).find(".mCSB_container").height()) <= Math.abs(parseFloat($(this).find(".mCSB_container").css('top'))) + 465) {
                                callback($(this));
                            }
                        }
                        if ($(this).scrollTop() + $(area).height() + 20 >= $(element).height() && $(this).scrollTop() > 20) {
                            callback($(this));
                        }
                    }
                })
            },
            templateId: {
                set: function (templateId) {
                    sessionStorage.setItem('templateId', templateId);
                    $("#main_id").val(templateId);//将templateId放进main_id，用于抽奖插件用
                    Kdo.data.config.site.set({ "templateNumber": templateId });
                },
                get: function () {
                    return sessionStorage.getItem('templateId');
                }
            },
            isPayUser: {//是否为付费会员
                set: function (isPayUser) {
                    sessionStorage.setItem('isPayUser', isPayUser);
                },
                get: function () {
                    return sessionStorage.getItem('isPayUser');
                }
            },
            dateString: function (str) {
                var date = !!str ? new Date(str) : new Date();
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
            requestState: function (data) {
                if (data.code == 2 || data.code == 5) {
                    return false;
                } else {
                    return true;
                }
            },
            documentRange: {
                createRange: _createRange,
                addRange: _addRange
            }
        }
    });
});