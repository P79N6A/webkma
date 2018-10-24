﻿import Vue from 'vue';
import eventBus from '../utils/eventBus.js'
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
        属性栏
    */
    var _$propertybar = $('<div>\
                                <div id="setting-div" class="property-group">\
                                    <div class="property-group-title">设置</div>\
                                    <div class="property-group-body setting-div">\
                                        <div class="item-row" data-range-type="font-toolbar">\
                                            <div id="font-family" data-type="font-family" data-parent="font" class="pull-left column"><span class="title">字体</span><select class="normal-select" style="width:122px; padding-left:10px;"></select></div>\
                                            <div id="font-size" data-type="font-size" data-parent="font" class="pull-left column" style="margin-left:24px;width:174px;position: relative;"><span class="title">字号</span><div id="fontSize" min="12" max="150" step="1" precision="0" change="fontSizeChange"></div></div>\
                                            <div class="clearfix"></div>\
                                            <div style="margin-top: 15px;">\
                                                <div id="font-color" data-type="font-color" data-parent="font" class="pull-left column font-color-div" title="字体颜色"><span class="title pull-left"><i class="iconfont icon-font-family"></i></span><div class="chooseColor pull-left"><input class="font-color" /></div></div>\
                                                <div id="font-background-color" data-type="font-background-color" data-parent="font" class="pull-left column font-color-div" title="背景颜色" style="margin-left:17px;"><span class="title pull-left"><i class="iconfont icon-font-background-color"></i></span><div class="chooseColor pull-left"><input class="font-background-color" /></div></div>\
                                                <div id="font-line-height" data-type="font-line-height" data-parent="font" class="pull-left column" style="margin-left:56px;"><span class="title">行高</span><div id="fontLineHeight" min="0" max="3" step="0.1" precision="1" change="fontLineHeightChange"></div></div>\
                                            </div>\
                                            <div class="clearfix"></div>\
                                        </div>\
                                        <div class="item-row" data-range-type="font-toolbar">\
                                            <div id="font-bold" data-type="font-bold" data-parent="font" class="pull-left icon-column" title="加粗"><i class="iconfont icon-font-bold"></i></div>\
                                            <div id="font-italic" data-type="font-italic" data-parent="font" class="pull-left icon-column" title="斜体"><i class="iconfont icon-font-italic"></i></div>\
                                            <div id="font-underline" data-type="font-underline" data-parent="font" class="pull-left icon-column" title="下划线"><i class="iconfont icon-font-underline"></i></div>\
                                            <div id="font-strikethrough" data-type="font-strikethrough" data-parent="font" class="pull-left icon-column" title="删除线"><i class="iconfont icon-font-strikethrough"></i></div>\
                                            <div id="font-justifyleft" data-type="font-justifyleft" data-parent="font" class="pull-left icon-column" title="左对齐"><i class="iconfont icon-font-left"></i></div>\
                                            <div id="font-justifycenter" data-type="font-justifycenter" data-parent="font" class="pull-left icon-column" title="居中"><i class="iconfont icon-font-center"></i></div>\
                                            <div id="font-justifyright" data-type="font-justifyright" data-parent="font" class="pull-left icon-column" title="右对齐"><i class="iconfont icon-font-right"></i></div>\
                                            <div id="font-removeformat" data-type="font-removeformat" data-parent="font" class="pull-left icon-column" title="清除样式"><i class="iconfont icon-clear-style"></i></div>\
                                            <div class="clearfix"></div>\
                                        </div>\
                                        <div class="item-row"  data-type="choose-colors"><div id="choose-colors" data-type="choose-colors" class="column"></div></div>\
                                        <div class="item-row" data-type="border-style"><div id="border-style" data-type="border-style" class="column"></div></div>\
                                        <div class="item-row" data-type="opacity"><div id="opacity" data-type="opacity" class="column"></div></div>\
                                        <div class="item-row" data-type="link"><div id="link" data-type="link" class="column"></div></div>\
                                        <div id="style-setting" data-type="style-setting" class=""></div>\
                                        <div id="setting" data-type="setting" class="column"></div>\
                                    </div>\
                                </div>\
                           </div>');
    //   <div id="setting" data-type="setting" class="column"></div>\
    var _$topbar = $('<div>\
                          <div id="align-top" data-type="align-top"  title="顶部对齐" class="pull-left column"><i class="iconfont icon-justify-top"></i></div>\
                          <div id="bottom-alignment" data-type="bottom-alignment" title="底部对齐" class="pull-left column"><i class="iconfont icon-justify-bottom"></i></div>\
                          <div id="left-justified" data-type="left-justified" title="左对齐" class="pull-left column"><i class="iconfont icon-justify-left"></i></div>\
                          <div id="align-right" data-type="align-right" title="右对齐" class="pull-left column"><i class="iconfont icon-justify-right"></i></div>\
                          <div id="page-center" data-type="page-center" title="页面水平居中" class="pull-left column"><i class="iconfont icon-page-center"></i></div>\
                          <div id="horizontal-transform" data-type="horizontal-transform" title="水平翻转" class="pull-left column"><i class="iconfont icon-horizontal-transform"></i></div>\
                          <div id="vertical-transform" data-type="vertical-transform" title="垂直翻转" class="pull-left column"><i class="iconfont icon-vertical-transform"></i></div>\
                          <div id="copy" data-type="copy" title="复制" class="pull-left column"><i class="iconfont icon-copy"></i></div>\
                          <div id="paste" data-type="paste" title="粘贴" class="pull-left column"><i class="iconfont icon-paste"></i></div>\
                          <div id="zIndex-top" data-type="zIndex-top" title="顶层" class="pull-left column"><i class="iconfont icon-zIndex-top"></i></div>\
                          <div id="zIndex-up" data-type="zIndex-up" title="上一层" class="pull-left column"><i class="iconfont icon-zIndex-up"></i></div>\
                          <div id="zIndex-down" data-type="zIndex-down" title="下一层" class="pull-left column"><i class="iconfont icon-zIndex-down"></i></div>\
                          <div id="zIndex-bottom" data-type="zIndex-bottom" title="底层" class="pull-left column"><i class="iconfont icon-zIndex-bottom"></i></div>\
                          <div id="group" data-type="group" title="组合" class="pull-left column"><i class="iconfont icon-group-group"></i></div>\
                          <div id="ungroup" data-type="ungroup" title="解组" class="pull-left column"><i class=" iconfont icon-group-ungroup"></i></div>\
                          <div id="upload-group" data-type="upload-group" title="上传组合" class="pull-left column"><i class=" iconfont icon-upload-group"></i></div>\
                          <div id="lock"  data-type="lock" title="锁定" class="pull-left column"><i class="iconfont icon-lock"></i></div>\
                          <div id="unlock" data-type="unlock" title="解锁" class="pull-left column"><i class="iconfont icon-unlock"></i></div>\
                          <div id="update" data-type="update" title="更新" class="pull-left column"><i class="iconfont icon-update"></i></div>\
                      </div>');

    var _$sidebar = $('<div>\
                         <div id="previous-step" data-type="previous-step"  title="撤销（Ctrl+Z）" class="side-column"><i class="iconfont icon-previous-step"></i></div>\
                         <div id="next-step" data-type="next-step"  title="恢复（Ctrl+Y）" class="side-column"><i class="iconfont icon-next-step"></i></div>\
                       </div>');

    var _$target = null,    //attach的目标元素
        _controlConfig = null,
        inputNumbers = {};


    //初始化，设置浮动条所在区域
    var _init = function () {
        //初始化动画
        Kdo.animation.init(_$propertybar);
        $(".design .propertybar .property-body").prepend(_$propertybar);
        $(".design .topbar .topbar-body").append(_$topbar);
        $(".design .sidebar").append(_$sidebar);

        _hide();

        _$propertybar.off("mouseenter.propertybar").on("mouseenter.propertybar", function (event) {
            //关闭页面全局事件
            Kdo.events.off("mouse");
        }).off("mouseleave.propertybar").on("mouseleave.propertybar", function (event) {
            //恢复原本的事件
            Kdo.events.on("mouse");
        });

        //阻止mousedown事件冒泡，避免编辑区光标丢失。
        _$propertybar.off("mousedown.propertybar").on("mousedown.propertybar", function (event) {
            //排除部分冲突标签
            switch (event.target.tagName) {
                case "SELECT":
                case "INPUT":
                case "TEXTAREA":
                    break;
                default:
                    return false;
            }
        });

        //注册功能按钮点击事件
        _$propertybar.find("div[data-type]").off("click.propertybar").on("click.propertybar", function (event) {
            var $target = $(event.currentTarget);
            switch ($target.data("type")) {
                case "font-bold"://字体--加粗
                    Kdo.featurer.fonteditor.fontBold(_controlConfig.inner.style["font-weight"] != "bold");
                    break;
                case "font-italic"://字体--斜体
                    Kdo.featurer.fonteditor.fontItalic(_controlConfig.inner.style["font-style"] != "italic");
                    break;
                case "font-underline"://字体--下划线
                    Kdo.featurer.fonteditor.fontTextDecoration(_controlConfig.inner.style["text-decoration"] != "underline" ? "underline" : "normal");
                    break;
                case "font-justifyleft"://字体--左对齐
                    Kdo.featurer.fonteditor.fontTextAlign("left");
                    break;
                case "font-justifycenter"://字体--居中
                    Kdo.featurer.fonteditor.fontTextAlign("center");
                    break;
                case "font-justifyright"://字体--右对齐
                    Kdo.featurer.fonteditor.fontTextAlign("right");
                    break;
                case "font-strikethrough"://字体--删除线
                    Kdo.featurer.fonteditor.fontTextDecoration(_controlConfig.inner.style["text-decoration"] != "line-through" ? "line-through" : "normal");
                    break;
                case "font-removeformat"://字体--撤销样式
                    Kdo.featurer.fonteditor.fontRemoveFormat();
                    break;
            }
        });

        _$topbar.find("div[data-type]").off("click.topbar").on("click.topbar", function (event) {
            var $target = $(event.currentTarget);
            switch ($target.data("type")) {
                case "align-top":            //顶部对齐
                    Kdo.featurer.align.position.top();
                    break;
                case "bottom-alignment":            //底部对齐
                    Kdo.featurer.align.position.bottom();
                    break;
                case "left-justified":            //左对齐
                    Kdo.featurer.align.position.left();
                    break;
                case "align-right":            //右对齐
                    Kdo.featurer.align.position.right();
                    break;
                case "page-center":            //页面居中
                    Kdo.featurer.align.position.center("page");
                    break;
                case "horizontal-transform":    //水平翻转
                    Kdo.featurer.transform.transformForHorizontal();
                    break;
                case "vertical-transform":      //垂直翻转
                    Kdo.featurer.transform.transformForVertical();
                    break;
                case "copy":         //复制
                    Kdo.featurer.copy();
                    break;
                case "paste":         //粘贴
                    Kdo.featurer.paste();
                    break;
                case "zIndex-top":         //顶层
                    Kdo.featurer.zIndex.top();
                    break;
                case "zIndex-up":         //上一层
                    Kdo.featurer.zIndex.up();
                    break;
                case "zIndex-down":         //下一层
                    Kdo.featurer.zIndex.down();
                    break;
                case "zIndex-bottom":         //底层
                    Kdo.featurer.zIndex.bottom();
                    break;
                case "group":         //组合
                    Kdo.featurer.group.group();
                    break;
                case "ungroup":     //解组
                    Kdo.featurer.group.ungroup();
                    break;
                case "upload-group":     //上传组合
                    Kdo.uploadGroup.upload();
                    break;
                case "lock":         //锁定
                    Kdo.featurer.locker.lock();
                    break;
                case "unlock":         //取消锁定
                    Kdo.featurer.locker.unlock();
                    break;
                case "update":            //更新
                    Kdo.settings.update.load();
                    Kdo.settings.update.render();
                    break;
            }
        });

        _$sidebar.find("div[data-type]").off("click.sidebar").on("click.sidebar", function (event) {
            var $target = $(event.currentTarget);
            switch ($target.data("type")) {
                case "previous-step":            //上一步
                    Kdo.featurer.actionLogs.undo();
                    break;
                case "next-step":            //下一步
                    Kdo.featurer.actionLogs.redo();
                    break;
            }
        });

        // 初始化加载字体选项
        _initFontMenu();
    };

    var _loadTools = function (_controlConfig) {
        //根据模块JSON中的addTools属性判断工具栏中的功能块是否显示
        var _controlTools = Kdo.menus.getToolbar(_controlConfig);
        $.each(_$propertybar.find("div[data-type]"), function (index, el) {
            var _$el = $(el);
            if (_.findIndex(_controlTools, function (key) { return key == _$el.data("type") }) != -1) {
                _$el.show();
                eventBus.$emit('componentItemGet', "");
                _$propertybar.find('#setting-div').show();
                switch (_$el.data("type")) {
                    case "opacity":
                        Kdo.settings.opacity.load(_controlConfig.controlId);
                        _$propertybar.find("#opacity").html(Kdo.settings.opacity.html());
                        Kdo.settings.opacity.render();
                        break;
                    case "link":
                        Kdo.settings.link.load(_controlConfig.controlId);
                        _$propertybar.find("#link").html(Kdo.settings.link.html(true));
                        Kdo.settings.link.render();
                        break;
                    case "setting":
                        eventBus.$emit('componentItemGet', _controlConfig.setting.settingTemplate)
                        // if (!!_controlConfig.setting.settingTemplate) {
                        //     _$propertybar.find("#setting").html(_controlConfig.setting.settingTemplate);
                        // } else {
                        //     $.get(_controlConfig.setting.settingTemplateUrl, function (result) {
                        //         _$propertybar.find("#setting").html(result);
                        //     })
                        // }
                        if(_controlConfig.pluginType == 'game' || _controlConfig.pluginType == 'draw'){
                            Kdo.animation.destroy(); 
                            _$propertybar.find('#setting-div').hide();
                        }
                        break;
                    case "style-setting":
                        if (!!_controlConfig.styleSetting.settingTemplate) {
                            _$propertybar.find("#style-setting").html(_controlConfig.styleSetting.settingTemplate);
                        } else {
                            $.get(_controlConfig.styleSetting.settingTemplateUrl, function (result) {
                                _$propertybar.find("#style-setting").html(result);
                            })
                        }
                        break;
                    case "border-size":
                        Kdo.settings.borderSize.load(_controlConfig.controlId);
                        var $el = Kdo.settings.borderSize.html();
                        _$propertybar.find("#border-size").html(Kdo.settings.borderSize.html($el));
                        Kdo.settings.borderSize.render($el);
                        break;
                    case "border-style":
                        Kdo.settings.border.load(_controlConfig.controlId);
                        var $el = Kdo.settings.border.html();
                        _$propertybar.find("#border-style").html($el);
                        Kdo.settings.border.render($el);
                        break;
                }

            } else {
                _$el.hide();
            }
        });

        // 字体包含多个data-type，这里做特殊处理。
        if (_.findIndex(_controlTools, function (key) { return key == "font-toolbar" }) != -1) {
            _$propertybar.find("div.item-row[data-range-type='font-toolbar']").show();
            _$propertybar.find("div[data-parent='font']").show();
            _reloadFontOptions();
        } else {
            _$propertybar.find("div.item-row[data-range-type='font-toolbar']").hide();
            _$propertybar.find("div[data-parent='font']").hide();
        }

        //_$topbar元素是否显示
        var _topbarShow = function (type) {
            if ($.inArray(type, _controlTools) != -1) {
                _$topbar.find("div[data-type='" + type + "']").show();
            } else {
                _$topbar.find("div[data-type='" + type + "']").hide();
            }
        }

        _topbarShow("horizontal-transform");
        _topbarShow("vertical-transform");
    }


    //设置浮动条附加到哪个元素上(目前是设置到某个Box)
    var _attach = function ($target, options) {
        var _currentBox = Kdo.box.utils.getCurrentBox();
        // 判断前后两个对象相同
        var isEqual = _$target && $target && _$target.find("div[id^='control_']").attr("id") == $target.find("div[id^='control_']").attr("id");
        if (!isEqual || _currentBox.focusLevel != "single") {
            // 销毁前一个属性面板的必要操作
            Kdo.settings.chooseColors.destroy();
            // 设置新的目标元素
            _$target = $($target);
            if (_$target.length == 0) return _hide();

            //--------加载工具栏功能块 START--------
            //获取当前选中模块的JSON
            var _$box = _currentBox.$focusSingleBox;
            _controlConfig = null;
            switch (_currentBox.focusLevel) {
                case "single":
                    var _controlConfigs = Kdo.data.controls.get(Kdo.box.utils.getBoxControlId(_$box));
                    if (_controlConfigs.length > 0) _controlConfig = _controlConfigs[0];
                    Kdo.animation.loadData(_controlConfig);
                    break;
                case "group":
                    _controlConfig = {
                        addTools: ["lock", "alignposition", "ungroup"]
                    }
                    Kdo.animation.destroy();
                    break;
                case "temp":
                    _controlConfig = {
                        addTools: ["lock", "alignposition", "group"]
                    }
                    Kdo.animation.destroy();
                    break;
                default:
                    return;
            }

            // if (!!_controlConfig.setting) {
            //     $(".design .property-body").css("width", "400px");
            // } else {
            //     $(".design .property-body").css("width", "320px");
            // }

            _loadTools(_controlConfig);


            //普通用户没有模块更新权限
            if (Kdo.utils.permission("updateControl")) {
                _$topbar.find("div[data-type='update']").show();
            } else {
                _$topbar.find("div[data-type='update']").hide();
            }
            //普通用户没有上传组合权限
            if (Kdo.utils.permission("uploadGroup")) {
                _$topbar.find("div[data-type='upload-group']").show();
            } else {
                _$topbar.find("div[data-type='upload-group']").hide();
            }

            //加载颜色选择器
            if (_$propertybar.find("div[data-type='choose-colors']").css("display") == "block") {
                Kdo.settings.chooseColors.load(_controlConfig.controlId);
                _$propertybar.find("#choose-colors").html(Kdo.settings.chooseColors.html());
                Kdo.settings.chooseColors.render();
            }

            //状态操作
            var statusToggle = function (status, type, $type) {
                if (!$type) $type = type;
                var statusType = false;
                if (!!type) {
                    statusType = status[type];
                } else {
                    statusType = status;
                }
                if (!statusType) {
                    _$topbar.find("#" + $type + " i").addClass("disabled");
                } else {
                    _$topbar.find("#" + $type + " i").removeClass("disabled");
                }
            }

            var refreshStatus = {
                zIndex: function (_status) {
                    statusToggle(_status, "top", "zIndex-top");
                    statusToggle(_status, "bottom", "zIndex-bottom");
                    statusToggle(_status, "up", "zIndex-up");
                    statusToggle(_status, "down", "zIndex-down");
                },
                copied: function (_status) {
                    statusToggle(_status, "copy");
                    statusToggle(_status, "paste");
                },
                group: function (_status) {
                    _$topbar.find("#group").hide();
                    _$topbar.find("#ungroup").hide();
                    if (_status.group) _$topbar.find("#group").show();
                    if (_status.ungroup) _$topbar.find("#ungroup").show();
                },
                locker: function (_status) {
                    _$topbar.find("#lock").hide();
                    _$topbar.find("#unlock").hide();
                    if (_status.lock) _$topbar.find("#lock").show();
                    if (_status.unlock) _$topbar.find("#unlock").show();
                },
                uploadGroup: function (_status) {
                    statusToggle(_status, "", "upload-group");
                    if (!_status) {
                        _$topbar.find("#upload-group").off("click.topbar");
                    } else {
                        _$topbar.find("#upload-group").off("click.topbar").on("click.topbar", function () {
                            Kdo.uploadGroup.upload();
                        });
                    }
                }
            }

            //层级功能状态控制
            refreshStatus.zIndex(Kdo.featurer.zIndex.status());
            Kdo.featurer.zIndex.on("refreshStatus", refreshStatus.zIndex);

            //复制功能状态控制
            refreshStatus.copied(Kdo.featurer.copied.status());
            Kdo.featurer.copied.on("refreshStatus", refreshStatus.copied);

            //组合功能状态控制
            refreshStatus.group(Kdo.featurer.group.status());

            //上传组合功能状态控制
            refreshStatus.uploadGroup(Kdo.uploadGroup.status());

            //锁定功能状态控制
            refreshStatus.locker(Kdo.featurer.locker.status());

            //--------加载工具栏功能块 END--------
        } else {
            _controlConfig = Kdo.box.utils.getControlConfigById(_controlConfig.controlId);
        }
        // 数据重新加载
        if (_.findIndex(Kdo.menus.getToolbar(_controlConfig), function (key) { return key == "font-toolbar" }) != -1) {
            _reloadFontOptions();
        }
        if (options.show) {
            _show();
        }
    }

    //显示浮动条
    var _show = function () {
        _$topbar.show();
        _$propertybar.show();
    }

    //隐藏浮动条
    var _hide = function () {
        _$topbar.hide();
        _$propertybar.hide();
        eventBus.$emit('componentItemGet', "")
        _$target = null;
    }

    // 字体区域加载设定
    var _initFontMenu = function () {
        $.each(_$propertybar.find("div[data-parent=font]"), function (index, el) {
            var _$el = $(el);
            switch (_$el.data("type")) {
                case "font-family":
                    _$el.find("select").html(_option_fontFamily());
                    _$el.find("select").on("change", function () {
                        Kdo.featurer.fonteditor.fontName(this.value);
                    });
                    break;
                case "font-size":
                    inputNumbers.fontSize = Kdo.components.inputNumber.init(_$el.find("div#fontSize"), { value: 12 });
                    _$el.find("div#fontSize").on("fontSizeChange", function (event, data) {
                        Kdo.featurer.fonteditor.fontSize(data.value + "px");
                    });
                    break;
                case "font-line-height":
                    inputNumbers.fontLineHeight = Kdo.components.inputNumber.init(_$el.find("div#fontLineHeight"), { value: 1.5 });
                    _$el.find("div#fontLineHeight").on("fontLineHeightChange", function (event, data) {
                        Kdo.featurer.fonteditor.lineHeight(data.value);
                    });
                    break;
                case "font-color":
                    _choose_fontColor("font-color");
                    break;
                case "font-background-color":
                    _choose_fontColor("font-background-color");
                    break;
            }
        });
    }
    var _reloadFontOptions = function () {
        if (_controlConfig) {
            Kdo.featurer.fonteditor.load(_controlConfig.controlId);
            $.each(_$propertybar.find("div[data-parent=font]"), function (index, el) {
                var _$el = $(el);
                switch (_$el.data("type")) {
                    case "font-family":
                        _$el.find("select").val(_controlConfig.inner.style["font-family"]);
                        _$el.find("select>option[value='" + _controlConfig.inner.style["font-family"] + "']").attr("selected", true);
                        break;
                    case "font-size":
                        inputNumbers.fontSize.setValue(_controlConfig.inner.style["font-size"]);
                        break;
                    case "font-line-height":
                        inputNumbers.fontLineHeight.setValue(_controlConfig.inner.style["line-height"]);
                        break;
                    case "font-color":
                        var _$specturm = _$el.find("input[class='font-color']");
                        _$specturm.spectrum("set", _controlConfig.inner.style["color"]);
                        // _$el.find("input[id='txt-font-color']").val(_$specturm.spectrum("get").toHexString());
                        break;
                    case "font-background-color":
                        var _$specturm = _$el.find("input[class='font-background-color']");
                        _$specturm.spectrum("set", _controlConfig.inner.style["background-color"]);
                        // _$el.find("input[id='txt-back-color']").val(_controlConfig.inner.style["background-color"] == "rgba(0, 0, 0, 0)" ? "透明" : _$specturm.spectrum("get").toHexString());
                        break;
                    case "font-bold":
                        _controlConfig.inner.style["font-weight"] == "bold" ? _$el.addClass("active") : _$el.removeClass("active");
                        break;
                    case "font-italic":
                        _controlConfig.inner.style["font-style"] == "italic" ? _$el.addClass("active") : _$el.removeClass("active");
                        break;
                    case "font-underline":
                        _controlConfig.inner.style["text-decoration"] == "underline" ? _$el.addClass("active") : _$el.removeClass("active");
                        break;
                    case "font-strikethrough":
                        _controlConfig.inner.style["text-decoration"] == "line-through" ? _$el.addClass("active") : _$el.removeClass("active");
                        break;
                    case "font-justifyleft":
                        _controlConfig.inner.style["text-align"] == "left" ? _$el.addClass("active") : _$el.removeClass("active");
                        break;
                    case "font-justifycenter":
                        _controlConfig.inner.style["text-align"] == "center" ? _$el.addClass("active") : _$el.removeClass("active");
                        break;
                    case "font-justifyright":
                        _controlConfig.inner.style["text-align"] == "right" ? _$el.addClass("active") : _$el.removeClass("active");
                        break;
                }
            });
        }
    }

    //显示字体编辑属性栏
    var _show_fontMenu = function () {
        _$propertybar.find("div.item-row[data-range-type='font-toolbar']").show();
    }
    // 隐藏字体编辑属性栏
    var _hide_fontMenu = function () {
        _$propertybar.find("div.item-row[data-range-type='font-toolbar']").hide();
    }

    //文字编辑器配置项
    var _fontEditorOptions = {
        fontSize: ["12px", "14px", "16px", "18px", "24px", "32px", "48px"],
        fontFamily: {
            "黑体": { val: "SimHei" },
            "微软雅黑": { val: "'Microsoft YaHei'" },
            "宋体": { val: "SimSun" },
            "楷体": { val: "KaiTi" },
            "Helvetica": { val: "Helvetica" },
            "幼圆": { val: "YouYuan" },
            // "思源黑体": { val: "思源黑体" }      // 非系统字体包，暂不考虑加入可选范围
        }
    }

    //显示字体fontFamily选项
    var _option_fontFamily = function () {
        var fontFamilyHtml = "";
        $.each(_fontEditorOptions.fontFamily, function (key, option) {
            fontFamilyHtml += "<option value=" + option.val + ">" + key + "</option>";
        });
        return fontFamilyHtml;
    }

    var _choose_fontColor = function (colorType) {
        var spectrum = $("." + colorType).spectrum({
            allowEmpty: true,
            color: "#fff",
            showInput: true,
            showPalette: true,
            showSelectionPalette: false,
            showAlpha: false,
            showButtons: false,
            maxPaletteSize: 10,
            preferredFormat: "hex",
            localStorageKey: "spectrum.demo",
            containerClassName: "full-spectrum-font-editor",
            beforeShow: function () {
                //收回工具栏
                //Kdo.floatbar.actions_child_hide();
            },
            show: function () {
                $(".sp-container .sp-input").off("blur").on("blur", function () {
                    var value = this.value;
                    switch (colorType) {
                        case "font-color":
                            Kdo.featurer.fonteditor.foreColor(value);
                            break;
                        case "font-background-color":
                            Kdo.featurer.fonteditor.backColor(value);
                            break;
                    }
                    $(".sp-container .sp-input").off("blur");
                });
            },
            move: function (color) {
                // var _$control = Kdo.box.utils.getCurrentBox().$focusSingleBox.find("div[id^='control_']");
                switch (colorType) {
                    case "font-color":
                        // _$control.css({ "color": color ? color.toHexString() : "#000000" });
                        Kdo.featurer.fonteditor.foreColor(color ? color.toHexString() : "#000000");
                        _$propertybar.find(".fontColor").val(color ? color.toHexString() : "#000000");
                        break;
                    case "font-background-color":
                        // _$control.css({ "background-color": color ? color.toHexString() : "rgba(0, 0, 0, 0)" });
                        Kdo.featurer.fonteditor.backColor(color ? color.toHexString() : "rgba(0, 0, 0, 0)");
                        _$propertybar.find(".fontBackgroundColor").val(color ? color.toHexString() : "透明");
                        break;
                }
            },
            change: function (color) {
                switch (colorType) {
                    case "font-color":
                        Kdo.featurer.fonteditor.foreColor(color ? color.toHexString() : "#000000");
                        _$propertybar.find(".fontColor").val(color ? color.toHexString() : "#000000");
                        break;
                    case "font-background-color":
                        Kdo.featurer.fonteditor.backColor(color ? color.toHexString() : "rgba(0, 0, 0, 0)");
                        _$propertybar.find(".fontBackgroundColor").val(color ? color.toHexString() : "透明");
                        break;
                }
            },
            palette: $.spectrum.customOptions.palette
        });

        //针对在文字编辑器事件触发顺序的关系，对mousedown做了禁用处理。（处理选色会丢失焦点的问题）
        $(".sp-palette-container").off("mousedown.choose-color").on("mousedown.choose-color", function (event) { return false; });
        $(".sp-initial").off("mousedown.choose-color").on("mousedown.choose-color", function (event) { return false; });
        return spectrum;
    }

    //显示刷新工具条
    var _refresh = function () {
        if (!!_$target) _attach(_$target, { show: true });
    }

    $.extend(true, window.Kdo, {
        propertybar: {
            init: _init,
            attach: _attach,
            //show: _show,
            hide: _hide,
            show_fontMenu: _show_fontMenu,
            hide_fontMenu: _hide_fontMenu,
            hide: _hide,
            refresh: _refresh,
        }
    });
});