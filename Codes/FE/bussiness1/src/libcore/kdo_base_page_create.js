import api from "api";
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
    /*
        创建模块到页面的功能:
            1. 保存页面对象
            2. 编译模板ArtTemplate
    */
    var $canvs = null;  //初始化时，传入的box作用域。

    //设置接受创建模块的区域
    var _dropCreate = function ($element) {
        $canvs = $element;
        var _dropTo = null;
        $canvs.droppable({
            accept: "div.ui-draggable.ui-draggable-handle[data-key]",
            tolerance: "pointer",
            drop: function (event, ui) {
                var self = this,
                    _$ui = $(ui.helper),
                    controlKey = _$ui.data('key');
                if (!_$ui.hasClass("drop")) return;
                switch (_$ui.data("type")) {
                    case "background":
                    case "control":
                    default:        //普通模块直接创建
                        if (Kdo.data.controls.existsGameControlInPage()) {
                            return Kdo.utils.messenger.alert('包含小游戏或抽奖插件的页面，不允许再包含其他素材。');
                        }
                        var dataItem = _getControlConfig(controlKey),
                            existSingleControl = Kdo.data.controls.existsSingleControl(controlKey);
                        if (dataItem.single == true && existSingleControl) {
                            let isCurrentPage = Kdo.data.pages[existSingleControl.pageIndex].number == Kdo.data.config.page.get().number;
                            return Kdo.utils.messenger.alert(`${dataItem.name}已经存在<span class="alert-red">${isCurrentPage ? "当前页" : `第${existSingleControl.pageIndex + 1}页`}</span>，该素材不可创建多个。`);
                        }
                        _addControl(_getControlConfig(controlKey), {
                            "left": (ui.offset.left - $(self).offset().left) + "px",
                            "top": (ui.offset.top - $(self).offset().top) + "px"
                        }, function (_$box, controlConfig) {
                            //选中当前创建的模块
                            Kdo.box.single.enter(_$box);
                            //操作记录
                            Kdo.featurer.actionLogs.log();
                        });
                        break;
                    case "group":   //模块分类为组合时，从后台读取组合模块数据
                        Kdo.service.materialGroup.getGroupInfo(controlKey, function (result) {
                            if (!!result && !!result.data) {
                                var _controlConfigs = JSON.parse(result.data),
                                    _startIndex = 0,
                                    _newGroupId = Kdo.featurer.group.newGroupId();
                                //对组合模块的单模块做层级排序
                                _controlConfigs = _.sortBy(_controlConfigs, function (item) { return parseFloat(item["style"]["z-index"]) });
                                var tasks = []
                                _controlConfigs.forEach(function (_controlConfig, cb) {
                                    tasks.push(new Promise(function (resolve, reject) {
                                        _controlConfig.groupId = _newGroupId;
                                        _addControl(_controlConfig, {
                                            "left": _controlConfig.style.left,
                                            "top": _controlConfig.style.top
                                        }, function (_$box, controlConfig) {
                                            if (_startIndex == 0) _startIndex = controlConfig["style"]["z-index"];
                                            controlConfig["style"]["z-index"] = _.findIndex(_controlConfigs, function (item) { return item.controlId == _controlConfig.controlId }) + _startIndex;
                                            Kdo.data.controls.update(controlConfig);
                                            _$box.css({ "z-index": controlConfig["style"]["z-index"] });
                                            resolve(null);
                                        });
                                    }));
                                })
                                Promise.all(tasks)
                                    .then(function (err) {
                                        //进行组合恢复操作
                                        Kdo.featurer.group.repair(_newGroupId);
                                        //获取组合模块
                                        var _$group = Kdo.container.$background().find("#" + _newGroupId);
                                        //将组合改变到拖拽位置
                                        _$group.css({
                                            "left": (ui.offset.left - $(self).offset().left) + "px",
                                            "top": (ui.offset.top - $(self).offset().top) + "px"
                                        });

                                        //修改组合中模块left、top
                                        var _controls = _.filter(Kdo.data.controls.all(), { groupId: _newGroupId });
                                        $.each(_controls, function (i, item) {
                                            item.style.left = (Kdo.box.utils.getBoxElement(item.controlId).offset().left - $(self).offset().left) + "px";
                                            item.style.top = (Kdo.box.utils.getBoxElement(item.controlId).offset().top - $(self).offset().top) + "px";
                                            Kdo.data.controls.update(item);
                                        })
                                        //选中当前创建的组合模块
                                        Kdo.box.temp.enter(_$group);
                                        //操作记录
                                        Kdo.featurer.actionLogs.log();
                                    })
                                    .catch(function (err) {
                                        console.error(err);
                                    });
                            }
                        });
                        break;
                    case "game":
                    case "draw":
                        var dataItem = _getControlConfig(controlKey),
                            existGameControl = Kdo.data.controls.existsGameControl(controlKey);
                        if (existGameControl) {
                            let isCurrentPage = Kdo.data.pages[existGameControl.pageIndex].number == Kdo.data.config.page.get().number;
                            return Kdo.utils.messenger.alert(`营销活动只能包含一个小游戏或抽奖插件，如需更换请删除旧的插件。${isCurrentPage ? "" : `该插件存在于<span class="alert-red">第${existGameControl.pageIndex + 1}页</span>。`}`);
                        } else {
                            Kdo.utils.messenger.confirm('添加小游戏或抽奖插件，会替换当前页面已经存在的素材，确定添加？', function (ok) {
                                if (!ok) return;
                                // 先清空页面控件
                                var ctrls = Kdo.data.page.controls;
                                for (var i = 0, len = ctrls.length; i < len; i++) {
                                    var _$box = Kdo.box.utils.getBoxElement(ctrls[i].controlId);
                                    Kdo.box.single.enter(_$box);
                                    Kdo.featurer.del();
                                }
                                //重置页面高度
                                Kdo.data.config.page.set({
                                    style: { width: '320px', height: '615px', 'min-height': '615px' }
                                });

                                // 添加游戏和互动插件
                                _addControl(dataItem, {
                                    "left": "0px",
                                    "top": "0px",
                                    "right": "0px",
                                    "bottom": "0px",
                                    "height": '100%',
                                    "width": '320px'
                                }, function (_$box, controlConfig) {
                                    //选中当前创建的模块
                                    Kdo.box.single.enter(_$box);
                                    //操作记录
                                    Kdo.featurer.actionLogs.log();
                                });
                            })
                        }
                        break;
                }
            }
        });
    }

    //根据key获取模块的配置
    var _getControlConfig = function (key) {
        return Kdo.menus.getMenuInfo(key);
        // return Kdo.menus.getMenuInfo(key, Kdo.utils.url.queryString("webType"));    //根据页面参数判断类型（PC or Mobile）
    }

    //创建一个模块；
    //position传递{left: "1px", top: "1px" }作为模块初始创建出来的坐标
    //callback作为完成整个模块的加载后的回调函数（目前应用于组合模块创建完模块后回调）
    var _addControl = function (_controlConfig, position, callback) {
        //判断独立模块是否已存在页面中，single为true，则只允许模块在页面中出现一次。
        //判断该模块是否存在独立模块组中，并且已有同类模块存在页面，singleGroup为true，则值允许该类模块在页面中出现一次。

        //获取当前模块是否是“独立模块(single:true)”或“独立模块组(singleGroup:"xx")”模块；如果是则不允许重复创建多个。
        var _existsControlsForSingle = !!_controlConfig.single ? Kdo.data.controls.getKeys(_controlConfig.key) : [],
            _existsControlsForSingleGroup = !!_controlConfig.singleGroup ? Kdo.data.controls.getBySingleGroup(_controlConfig.singleGroup) : [];
        if (_existsControlsForSingle.length > 0 || _existsControlsForSingleGroup.length > 0) {
            //return之前，选中该模块
            var _$selectedControls = null;
            $.each(_existsControlsForSingle.concat(_existsControlsForSingleGroup), function (i, control) {
                var _$box = $("div[id='" + control.controlId + "']").parents(".box:first");
                _$selectedControls = _$selectedControls == null ? _$box : _$selectedControls.add(_$box);
            });
            Kdo.box.temp.enter($(_$selectedControls));
            return;
        }

        // Excuse me??? 业务代码在这里判断？
        // if (_controlConfig.key == "plugin_shop") {//如果为商品模块，要进行验证
        //     if (!!window.shopDisableMessage) {
        //         return;
        //     }
        // }

        _loadControl(window.Kdo.utils.copy(_controlConfig), function (controlConfig) {
            var _$box = _compile(controlConfig);
            if (!!_$box) {
                //异步处理动态数据
                //_buildDataConfigs(_$box);

                //计算等比例高宽
                _calculateAspectRatio(controlConfig, function () {
                    //计算position
                    controlConfig.style = $.extend(true, controlConfig.style, position);
                    //绑定style配置
                    _setStyles(_$box, controlConfig);
                    //放置box到目标区域
                    Kdo.container.get(controlConfig).append(_$box);
                    //保存模块对象到页面对象中
                    Kdo.data.controls.set(controlConfig);
                    //绑定box功能
                    Kdo.box.single.binder(_$box);
                    //绑定吸附框的行为(如果是吸附框则会绑定相关行为)
                    Kdo.settings.adsorb.binder(_$box);
                    //触发回调函数
                    if (!!callback) callback(_$box, controlConfig);
                });
            }
        });
    }

    //粘贴一个模块到指定区域
    var _pasteControl = function (controlConfigs, target) {
        var _$boxes = null,
            _groupByControls = _.groupBy(controlConfigs, function (controlConfig) { return controlConfig.groupId });
        for (var key in _groupByControls) {
            //如果是组合模块（即key不为空），生成一个新的groupId。
            var _newGroupId = (key == "undefined" || key == "null") ? null : Kdo.featurer.group.newGroupId();

            //对组合模块的单模块做层级排序
            _groupByControls[key] = _.sortBy(_groupByControls[key], function (item) { return parseFloat(item["style"]["z-index"]) });

            $.each(_groupByControls[key], function (i, _controlConfig) {
                _controlConfig.groupId = _newGroupId;
                var _$box = _compile(_controlConfig);
                if (!!_$box) {
                    //异步处理动态数据
                    //_buildDataConfigs(_$box);
                    //绑定style配置
                    _setStyles(_$box, _controlConfig);
                    //放置box到目标区域
                    $(target).append(_$box);
                    //保存模块对象到页面对象中
                    Kdo.data.controls.set(_controlConfig);
                    //绑定box功能
                    Kdo.box.single.binder(_$box);
                    //绑定吸附框的行为(如果是吸附框则会绑定相关行为)
                    Kdo.settings.adsorb.binder(_$box);
                    //收集粘贴出来的single box（非组合模块） 
                    if (key == "undefined" || key == "null") _$boxes = !!_$boxes ? _$boxes.add(_$box) : _$box;
                }
            });
            if (key != "undefined" && key != "null") {
                //进行组合恢复操作
                Kdo.featurer.group.repair(_.pluck(_groupByControls[key], "controlId"));
                var _$box = $("#" + _newGroupId);
                _$boxes = !!_$boxes ? _$boxes.add(_$box) : _$box;
            }
        }
        //选中当前创建的模块
        Kdo.box.temp.enter($(_$boxes));
        //操作记录
        Kdo.featurer.actionLogs.log();
    }

    //恢复一个模块到指定区域(不记录操作，不set到pageControls上)
    var _repairControl = function (controlConfigs) {
        controlConfigs = _.isArray(controlConfigs) ? controlConfigs : [controlConfigs];
        if (controlConfigs.length > 0) {
            $.each(controlConfigs, function (i, _controlConfig) {

                var _$box = _compile(_controlConfig, { isRepair: true });

                if (!!_$box) {
                    //异步处理动态数据
                    //_buildDataConfigs(_$box);
                    //设置等比例高宽(通栏状态不设置)
                    _setAspectRatio(_controlConfig, _controlConfig.orginalSize);
                    //绑定style配置
                    _setStyles(_$box, _controlConfig);
               
                        //绑定box功能
                        Kdo.box.single.binder(_$box);
                   
                    //绑定吸附框的行为(如果是吸附框则会绑定相关行为)
                    try{
                    Kdo.settings.adsorb.binder(_$box);
                } catch (err) {
                    console.log("1");
                }
                    //吸附框刷新修复内层模块大小
                    try{
                    Kdo.settings.adsorb.repairSize(_$box);
                } catch (err) {
                    console.log("2");
                }
                    //放置box到目标区域
                    try {
                        // debugger
                    Kdo.container.get(_controlConfig).append(_$box);
                } catch (err) {
                    console.log("3");
                }
                }
            });
        }
    }

    //转义特殊字符
    var _replaceTemplateEscape = function (template) {
        if (!!template) {
            return template.replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&amp;/g, "&");
        }

    }

    //编译模块，并返回模块的代码
    //options.releaseType: "pc" or "mobile" or null。如果不为null，则去掉模块提示tip等元素；如果为mobile，还需要替换style的px为rem；
    var _buildControl = function (controlConfigs, pageConfig, releaseType) {
        controlConfigs = _.isArray(controlConfigs) ? controlConfigs : [controlConfigs];
        var templates = [];
        $.each(controlConfigs, function (i, _controlConfig) {
            var _$box = _compile(_controlConfig, { isRepair: true, releaseType: releaseType, buildDataConfig: false, pageConfig: pageConfig });
            if (!!_$box) {
                // 附加动画属性
                _attachAnimation(_$box, _controlConfig, !!releaseType);
                //绑定style配置
                _setStyles(_$box, _controlConfig, { releaseType: releaseType });
                templates.push(_replaceTemplateEscape(_$box.prop("outerHTML")));
            }
        });
        return templates;
    }

    function _attachAnimation($box, controlConfig, isRelease) {
        var ani = $.extend(true, {}, controlConfig.animation || {});
        if (!isRelease || !ani.effect) {
            return;
        }
        delete ani.originalEffect;
        for (var key in ani) {
            if (ani.hasOwnProperty(key)) {
                var prop = ani[key];
                $box.children("div[id^='control_']").attr('swiper-animate-' + key, prop);
            }
        }
        $box.children("div[id^='control_']").addClass('ani');
    }

    //编译模块，并返回模块的HTML代码（即不包含Box壳子）
    //options.releaseType: "pc" or "mobile" or null。如果不为null，则去掉模块提示tip等元素；如果为mobile，还需要替换style的px为rem；
    var _buildControlHTML = function (controlConfigs, pageConfig, releaseType) {
        controlConfigs = _.isArray(controlConfigs) ? controlConfigs : [controlConfigs];
        var templates = [];
        $.each(controlConfigs, function (i, _controlConfig) {
            var _$box = _compile(_controlConfig, { isRepair: true, releaseType: releaseType, buildDataConfig: false, pageConfig: pageConfig });
            if (!!_$box) {
                //绑定style配置
                _setStyles(_$box, _controlConfig, { releaseType: releaseType });
                templates.push(_replaceTemplateEscape(_$box.children("div[id^='control_']").prop("outerHTML")));
            }
        });
        return templates;
    }

    //根据模块配置，获取配置中的内容。（加载模块内容）
    var _loadControl = function (controlConfig, callback, isForceUpdate) {
        var defaultTemplate = controlConfig.defaultTemplate || {};
        var theme = controlConfig.data.theme || '';
        var _template = {
            //previewImg: defaultTemplate.previewImg || lanh.filePath.design + '/images/no_image.jpg',
            html: "",
            css: "",
            js: "",
            theme: {}
        }
        var _callback = function () {
            if (controlConfig.template.html !== null && controlConfig.template.css !== null && controlConfig.template.js !== null && ((!!theme && controlConfig.data.theme != null) || !theme)) {
                Kdo.menus.setCacheMenu(controlConfig.key, "mobile"/*Kdo.utils.url.queryString("webType")*/, controlConfig.template);
                //如果是全局控件，则直接返回一个controlId作为key。
                if (controlConfig.global == true) { controlConfig.controlId = "control_" + controlConfig.key; }
                callback(controlConfig);
            }
        }

        if (!controlConfig.template || isForceUpdate) {
            controlConfig.template = _template;
            var timespan = "?timespan=" + Date.now();
            if (!!defaultTemplate.html) {
                controlConfig.template.html = null;
                $.ajax({
                    global: false, url: defaultTemplate.html + timespan, dataType: "text",
                    success: function (result) {
                        if (controlConfig.struct == "svg" && $(result).length > 0 && $(result)[0].type == "application/json") {
                            var svgData = JSON.parse($($(result)[0]).html());
                            $.extend(controlConfig, svgData);
                        }
                        controlConfig.template.html = result;
                        _callback();
                    }
                });
            }
            if (!!defaultTemplate.css) {
                controlConfig.template.css = null;
                $.ajax({ global: false, url: defaultTemplate.css + timespan, dataType: "text", success: function (result) { controlConfig.template.css = result; _callback(); } });
            }
            if (!!defaultTemplate.js) {
                controlConfig.template.js = null;
                $.ajax({ global: false, url: defaultTemplate.js + timespan, dataType: "text", success: function (result) { controlConfig.template.js = result; _callback(); } });
            }
            if (!!theme) {
                controlConfig.data.theme = null;
                var options = {
                    pluginKey: controlConfig.key,
                    theme: 'default'
                }
                api.request('getPluginThemeDetail', options, result => {
                    if (result.status == 0) {
                        controlConfig.data.theme = result.data;
                    } else {
                        Kdo.utils.messenger.error(result.message);
                    }
                    _callback();
                });
            }
        }
        _callback();
    }

    //编译模块为Dom，并生成一个Box。
    //options.isRepair如果为true，则不会替换controlId和zIndex的值
    //options.releaseType: "pc" or "mobile" or null。如果不为null，则去掉模块提示tip等元素；如果为mobile，还需要替换style的px为rem；
    //options.pageConfig 如果是编译其它页面(预览&发布时候会用到),需要传递该对象获取对应页面的数据.
    var _compile = function (controlConfig, options) {
        options = options || {};

        var _boxTemplate = '<div class="box single ui-widget-content">{{operation}}</div>',
            _boxInnerTemplate = '<span class="module-top-tip">{{name}}</span><div class="module_border cover"></div><div class="module_border top"></div><div class="module_border right"></div><div class="module_border bottom"></div><div class="module_border left"></div><div class="rotate" style="position: absolute;z-index: 10089;display:none;bottom:-24px;"><i class="iconfont icon-rotate blue" style="width:19px;height:19px;"></i><span></span></div>',
            _controlTemplate = '<style>{{css_context}}</style><div style="width:100%;height:100%;">{{html_context}}</div><script type="text/javascript">{{js_context}}</script>',
            _isRelease = !!options.releaseType;

        //如果不是release操作，则需要加上操作对应用到的dom元素。
        _boxTemplate = _boxTemplate.replace("{{operation}}", _isRelease ? "" : _boxInnerTemplate);

        //如果isRepair为空（则为新建）。如果是新建，也不会对模块为全局(global)并且ID已存在的模块进行设置新的ID。
        if (!options.isRepair && !(controlConfig.global == true && !!controlConfig.controlId)) {
            controlConfig.controlId = "control_" + uuid.v4();
        }

        var _templateData = window.Kdo.utils.copy(controlConfig.data);
        //根据当前模块判断，如果是全局模块（global: true），则需要根据所属页面获取data中对应的数据对象。
        if (controlConfig.global == true) {
            if (!!_templateData["all"]) {
                //如果data对象里有all，则优先获取all。
                _templateData = _templateData["all"];
            } else {
                //获取当前页面类型的数据对象
                var _pageType = Kdo.data.config.page.get().pageType;
                if (!!options.pageConfig && !!options.pageConfig.pageType) {
                    _pageType = options.pageConfig.pageType;
                }
                _templateData = _templateData[_pageType] || { "_visible": "hide" }; //如果数据不存在，则赋予不显示的默认值（因mobile版的headerbar增加该逻辑） Added by Dyllon
            }
        }

        //组织模板数据，增加临时属性（文件路径）
        //_templateData = $.extend(_templateData, { filePath: !options.releaseType ? lanh.filePath.design : lanh.filePath.midway });
        _templateData = $.extend(_templateData, { filePath: "", _isRelease: _isRelease });  //为了保持一致性，暂时输出""

        //固定属性：控制模块是否render
        if (_templateData._visible === "hide") return "";

        //使用{{{ }}}解析静态数据
        template.config("openTag", "{{{");
        template.config("closeTag", "}}}");
        // if(!_isRelease&&!!_templateData.theme){
        //     _templateData.theme.themePath=void 0;
        // }
        var _pluginData = $.extend(true, {}, controlConfig.data, { controlId: controlConfig.controlId }),
            _$box = $(_boxTemplate.replace("{{name}}", controlConfig.name)),
            _$control = $(_controlTemplate.replace("{{html_context}}", template.compile(controlConfig.template.html)({
                data: _templateData, status: { stretch: controlConfig.stretch },
                // 插件增加主题信息
                // themePath: controlConfig.key + '/' + (controlConfig.data.theme || 'default'),
                // pluginUrl: !!options.releaseType ? '//0.wap.pre.kma.biaoxiaoxu.cn/static/games/fallingdown/index.html' : 'about:blank'
            })) //用artTemplate模板引擎绑定数据
                .replace("{{css_context}}", controlConfig.template.css)
                .replace("{{js_context}}", !!_isRelease ? (controlConfig.template.js || '').replace(/__pluginData__/g, JSON.stringify(_pluginData)) : controlConfig.template.js)
                .replace(/_panelId_/g, controlConfig.controlId));

        // _$control.each(function (idx, _el) {
        //     if (_el.tagName == "DIV") {
        //         $(_el).children().attr("id", controlConfig.controlId);
        //     } else {
        //         $(_el).attr("id", controlConfig.controlId);
        //     }
        // });
        _$control.attr("id", controlConfig.controlId);
        //如果当前模块是一个组合模块的元素，则需要对dom元素添加groupid作为标识。
        if (!!controlConfig.groupId) _$control.attr("groupId", controlConfig.groupId);
        //如果当前模块是一个吸附框的元素，则需要在box上添加吸附框的标识。
        if (controlConfig.struct == "image") _$box.attr("data-adsorb", "allow");
        _$box.append(_$control);

        //旋转按钮图标位置
        Kdo.featurer.rotate.buttonPostion(_$box, controlConfig);

        //当发布mobile时，将吸附框inner的width、height转换为rem
        if (options.releaseType == "mobile" && controlConfig.struct == "adsorb") {
            Kdo.settings.adsorb.convertData(_$box, controlConfig);
        }

        if (options.buildDataConfig !== false) _buildDataConfigs(_$box);

        //设置box基本样式
        controlConfig.style = $.extend(true, controlConfig.style, {
            "position": "absolute",
            "min-width": "3px",
            "min-height": "3px"
        });
        //计算z-index (如果zindex没有设置过，会强制设置一次）
        if (!options.isRepair || !controlConfig.style["z-index"]) {
            controlConfig.style["z-index"] = Kdo.featurer.zIndex.getMax(!!controlConfig.global ? "global" : "normal") + 1;
        }

        return _$box;
    }

    //处理DataConfig动态数据配置，并渲染模块
    var _buildDataConfigs = function (_$box) {
        //获取data config数据配置对象
        var _getDataConfig = function (tpl) {
            if (!!Kdo.$menu_guid) {
                //设置页面的菜单GUID，替换模块中配置了<%menu_guid%>的参数值（用于Mock Data）
                tpl = tpl.replace(/<%menu_guid%>/g, Kdo.$menu_guid.val());
            }
            var regexp = /<!--\s*DataConfig[\s\S]*?-->/g,
                configSections = tpl.match(regexp),
                dataConfig = [];
            if (!!configSections) {
                _.each(configSections, function (section) {
                    var str = !!section.match(/\[[\s\S]*\]/) ? section.match(/\[[\s\S]*\]/)[0] : null;
                    var configs = JSON.parse(str);
                    if (configs && configs.length > 0) {
                        _.each(configs, function (cfg) {
                            dataConfig.push(cfg);
                        });
                    }
                });
            }
            return dataConfig;
        }

        //处理data config配置对象，并获取数据整体返回结果集。
        var _getData = function (dataConfigs, callback) {
            var count = 0, _data = {};
            _.each(dataConfigs, function (cfg) {
                //build mock data（用于Mock Data）
                var _queryString = [],
                    _postData = {},
                    _isEmpty = _.isEmpty(cfg);
                if (!cfg.mockData) cfg.mockData = {};
                //mock query string对象
                _.each(cfg.queryString, function (item) {
                    if (item.indexOf("<%=") == -1) {
                        _queryString.push(item);
                    } else {
                        var _val = item.substring(item.indexOf("<%="));
                        _queryString.push(item.replace(_val, cfg.mockData[_val] || ""));
                    }
                });
                //mock post data对象
                for (var key in cfg.postData) {
                    if (cfg.postData[key].indexOf("<%=") == -1) {
                        _postData[key] = cfg.postData[key];
                    } else {
                        _postData[key] = cfg.mockData[cfg.postData[key]];
                    }
                }
                var _complete = function () {
                    count++;
                    if (count >= dataConfigs.length) callback(_data);
                }
                if (!_isEmpty) {
                    $.ajax({
                        url: lanh.apiHost + cfg.path + "?" + _queryString.join("&"),
                        method: cfg.method,
                        dataType: "json",
                        data: _postData,
                        async: false,
                        success: function (result) {
                            _data[cfg.objName] = result;
                        },
                        complete: _complete
                    });
                } else {
                    _complete();
                }
            });
            if (count >= dataConfigs.length) callback(_data);
        }

        //执行数据查询，并重新渲染模板(HTML & JavaScript)
        _getData(_getDataConfig(_$box.html()), function (data) {
            //使用{{ }}解析动态数据
            template.config("openTag", "{{");
            template.config("closeTag", "}}");
            //------------build _$box START------------
            var _script = _$box.children("script[id^='control_']").prop("outerHTML"),
                _template = _$box.find("div[id^='control_']>div").prop("outerHTML");
            // _template = _$box.children("div[id^='control_']").prop("outerHTML");
            _template = _replaceTemplateEscape(_template);
            _template = template.compile(_template)(data);
            _$box.find("div[id^='control_']>div,script[id^='control_']").remove();
            _$box.find("div[id^='control_']").append(_template);
            _$box.append(_script);
            //------------build _$box END------------

            //恢复默认解析静态数据的标记
            template.config("openTag", "{{{");
            template.config("closeTag", "}}}");
        });
    }

    //模块样式设置函数
    //options.releaseType: "pc" or "mobile" or null。如果为mobile，需要替换style的px为rem；
    var _setStyles = function (box, controlConfig, options) {
        options = options || {};
        var radix = 32; //转换rem的基数值，采用flexible方式。(注：样式值已为rem的则不进行转换)
        var stylesForBox = window.Kdo.utils.copy(controlConfig.style),
            stylesForInner = !!controlConfig.inner ? window.Kdo.utils.copy(controlConfig.inner.style) : {};

        var convertRem = function (val) {
            if (/^-?[0-9]+([.][0-9]+){0,1}px$/.test(val) || ((_.indexOf(["width", "height", "left", "top"], key) != -1) && val.toString().indexOf("rem") == -1)) {
                //stylesForBox[key].indexOf("rem") == -1 兼容老数据width和height有数字的情况 mars  17.7.3
                val = val.indexOf('%') > -1 ? val : ((parseFloat(val) / radix) + "rem");
            }
            return val;
        }
        //遍历样式属性做特殊逻辑控制。
        for (var key in stylesForBox) {
            switch (key) {
                //以下样式放于box中的div上
                case "opacity"://兼容老版opacity
                    stylesForInner[key] = stylesForBox[key];
                    delete stylesForBox[key];
                    break;
                default:
                    //如果传递releaseType为mobile,则将style中的像素值(px)转换为(rem)值
                    if (options.releaseType == "mobile") {
                        stylesForBox[key] = convertRem(stylesForBox[key]);
                    }
                    break;
            }
        }
        for (var key in stylesForInner) {
            //如果传递releaseType为mobile,则将style中的像素值(px)转换为(rem)值
            if (options.releaseType == "mobile") {
                stylesForInner[key] = convertRem(stylesForInner[key]);
            }
        }
        //如果不为空，则走发布页面流程。
        if (!!options.releaseType) {
            //如果模块是fixed状态，则在发布页面时，需将position属性设置为fixed。
            if (!!controlConfig.fixed) stylesForBox["position"] = "fixed";
        }
        $(box).css(stylesForBox);
        //根据模块结构来决定内层样式应该设置的DOM元素
        switch (controlConfig.struct) {
            case "adsorb":
                $(box).children("div[id^='control_']").find("#inner_body").css(stylesForInner);
                break;
            case "text":
                if (options.releaseType == "mobile") {
                    var fontSizeArray = $(box).children("div[id^='control_']").html().match(/font-size: ?-?[0-9]+([.][0-9]+){0,1}px/ig);
                    _.each(fontSizeArray, function (item) {
                        var val = item.match(/-?[0-9]+([.][0-9]+){0,1}px$/i);
                        if (!!val) {
                            // 如果字体要使用flexible的dpr设置，这里需要将radix固定位12px(1dpr=12px)，并将rem单位改为em集成至body元素。
                            $(box).children("div[id^='control_']").html($(box).children("div[id^='control_']").html().replace(RegExp(item, "ig"), "font-size: {0}rem".replace("{0}", parseFloat(val[0]) / radix)));
                        }
                    });
                }
                $(box).children("div[id^='control_']").children("div").css(stylesForInner);
                break;
            default:
                $(box).children("div[id^='control_']").children("div").css(stylesForInner);
                break;
        }
        //模块如果是通栏状态，则宽度设置为100%
        if (controlConfig.stretch == true) {
            $(box).css({
                "width": "100%",
                "left": "0px"
                //"margin-top": "50px"//
            });

            //如果是通栏并且是PC版，则固定z-index为0。
            //if (Kdo.utils.url.queryString("webType").toLowerCase() == "web") {
            //    $(box).css({ "z-index": 0 });
            //}
        }
    }

    //计算等比例高宽并对模块进行高宽设置(通栏状态除外)
    var _calculateAspectRatio = function (controlConfig, callback) {
        //获取图片和svg的宽高
        new Promise(function (resolve, reject) {
            if (controlConfig.aspectRatio) {
                var _orginalSize = { width: 0, height: 0 }
                switch (controlConfig.struct) {
                    case "image":
                        var _img = new Image();
                        _img.onload = function () {
                            _orginalSize.width = _img.width;
                            _orginalSize.height = _img.height;
                            _img.onload = null;
                            resolve(_orginalSize);
                        }
                        if (!!controlConfig.global) {
                            _img.src = controlConfig.data.all.src;
                        } else {
                            _img.src = controlConfig.data.src;
                        }
                        break;
                    case "svg":
                        resolve(null);
                        //svg暂时手工计算
                        //var _svg = _$box.find("svg")[0];
                        //_orginalSize.width = _svg.viewBox.baseVal.width;
                        //_orginalSize.height = _svg.viewBox.baseVal.height;
                        //cb(null, _orginalSize);
                        break;
                    default:
                        resolve(null);
                        break;
                }
            } else {
                resolve(null);
            }
        })
            .then(
                //计算模块显示的比例
                function (orginalSize) {
                    if (!!orginalSize) {
                        controlConfig.orginalSize = orginalSize;
                        //设置等比例高宽(通栏状态不设置)
                        _setAspectRatio(controlConfig, controlConfig.orginalSize);
                    }
                    return Promise.resolve(null);
                })
            .then(function () { callback(); })
            .catch(function (err) {
                console.error(err);
                callback();
            })
    }

    //设置等比例高宽(通栏状态不设置)
    var _setAspectRatio = function (controlConfig, orginalSize) {
        //如果是通栏模式，则不计算宽度和高度
        if (!!orginalSize && !controlConfig.stretch) {
            var x = parseFloat(controlConfig.style.width) / orginalSize.width;
            controlConfig.style.width = (orginalSize.width * x) + "px";
            controlConfig.style.height = (orginalSize.height * x) + "px";
        }
    }

    window.Kdo = $.extend(true, window.Kdo, {
        page: {
            create: {
                drop: _dropCreate,
                add: _addControl,
                paste: _pasteControl,
                repair: _repairControl,
                build: _buildControl,
                buildHTML: _buildControlHTML,
                load: _loadControl,
                buildDataConfigs: _buildDataConfigs,
                getControlConfig: _getControlConfig,
                calculateAspectRatio: _calculateAspectRatio
            }
        }
    });
});