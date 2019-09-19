import Vue from 'vue';
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

    var _$propertybar = $('<div >\
                                <div class="property-group">\
                                    <div class="property-group-title">设置</div>\
                                    <div class="property-group-body setting-div">\
                                        <div class="item-row" data-range-type="font-toolbar">\
                                            <div id="font-family" data-type="font-family" data-parent="font" class="pull-left column"><span class="title">字体</span><select></select></div>\
                                            <div id="font-size" data-type="font-size"  data-parent="font" class="pull-left column"  style="margin-left:10px;width:100px;position: relative;"><select class="fontsize-select"></select><input id="txt-font-size" name="font-size" class="fontsizeInput"></div>\
                                            <div id="font-color" data-type="font-color" data-parent="font" class="pull-left column font-color-div" title="字体颜色"><span class="title pull-left"><i class="iconfont icon-font-family"></i></span><div class="pull-left"><input id="txt-font-color" class="color-wrap fontColor" readonly></input></div><div class="chooseColor pull-left"><input class="font-color" /></div></div>\
                                            <div id="font-background-color" data-type="font-background-color" data-parent="font" class="pull-left column font-color-div" title="背景颜色" style="margin-left:17px;"><span class="title pull-left"><i class="iconfont icon-font-background-color"></i></span><div class="pull-left"><input  id="txt-back-color" class="color-wrap fontBackgroundColor" readonly></input></div><div class="chooseColor pull-left"><input class="font-background-color" /></div></div>\
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
        _controlConfig = null;


    //初始化，设置浮动条所在区域
    var _init = function () {

        // 初始化动画相关功能
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
                    Kdo.featurer.texteditor.fontBold();
                    break;
                case "font-italic"://字体--斜体
                    Kdo.featurer.texteditor.fontItalic();
                    break;
                case "font-underline"://字体--下划线
                    Kdo.featurer.texteditor.fontUnderline();
                    break;
                case "font-justifyleft"://字体--左对齐
                    Kdo.featurer.texteditor.fontJustifyLeft();
                    break;
                case "font-justifycenter"://字体--居中
                    Kdo.featurer.texteditor.fontJustifyCenter();
                    break;
                case "font-justifyright"://字体--右对齐
                    Kdo.featurer.texteditor.fontJustifyRight();
                    break;
                case "font-strikethrough"://字体--删除线
                    Kdo.featurer.texteditor.fontStrikeThrough();
                    break;
                case "font-removeformat"://字体--撤销样式
                    Kdo.featurer.texteditor.fontRemoveFormat();
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
    };

    var _loadTools = function (_controlConfig) {
        // debugger
        //根据模块JSON中的addTools属性判断工具栏中的功能块是否显示
        $.each(_$propertybar.find("div[data-type]"), function (index, el) {
            var _$el = $(el);
            if (_.findIndex(Kdo.menus.getToolbar(_controlConfig), function (key) { return key == _$el.data("type") }) != -1) {
                _$el.show();
                eventBus.$emit('componentItemGet', "")
                // debugger
                if (_$el.data("type") == "opacity") {
                    Kdo.settings.opacity.load();
                    _$propertybar.find("#opacity").html(Kdo.settings.opacity.html());
                    Kdo.settings.opacity.render();
                }
                if (_$el.data("type") == "link") {
                    Kdo.settings.link.load();
                    _$propertybar.find("#link").html(Kdo.settings.link.html(true));
                    Kdo.settings.link.render();
                }
                if (_$el.data("type") == "setting") {
                    eventBus.$emit('componentItemGet', _controlConfig.setting.settingTemplate)
                    // if (!!_controlConfig.setting.settingTemplate) {
                    //     _$propertybar.find("#setting").html(_controlConfig.setting.settingTemplate);
                    // } else {
                    //     $.get(_controlConfig.setting.settingTemplateUrl, function (result) {
                    //         _$propertybar.find("#setting").html(result);
                    //     })
                    // }
                }
                if (_$el.data("type") == "style-setting") {
                    if (!!_controlConfig.styleSetting.settingTemplate) {
                        _$propertybar.find("#style-setting").html(_controlConfig.styleSetting.settingTemplate);
                    } else {
                        $.get(_controlConfig.styleSetting.settingTemplateUrl, function (result) {
                            _$propertybar.find("#style-setting").html(result);
                        })
                    }
                }
            } else {
                _$el.hide();
            }
        });

        _$propertybar.find("div.item-row[data-range-type='font-toolbar']").hide();

        //_$topbar元素是否显示
        var _topbarShow = function (type) {
            if ($.inArray(type, Kdo.menus.getToolbar(_controlConfig)) != -1) {
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
        // debugger
        // 销毁前一个属性面板的必要操作
        if (_$target) {
            Kdo.settings.chooseColors.destroy();
        }
        // 设置新的目标元素
        _$target = $($target);
        if (_$target.length == 0) {
            _hide();
            return;
        }
        //--------加载工具栏功能块 START--------
        //获取当前选中模块的JSON
        var _currentBox = Kdo.box.utils.getCurrentBox(),
            _$box = _currentBox.$focusSingleBox;
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
            Kdo.settings.chooseColors.load();
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

    //显示字体编辑属性栏
    var _show_fontMenu = function () {
        _$propertybar.find("div.item-row[data-range-type!='font-toolbar']").hide();
        _$propertybar.find("div.item-row[data-range-type='font-toolbar']").show();
        $.each(_$propertybar.find("div[data-parent=font]"), function (index, el) {
            var _$el = $(el);
            switch (_$el.data("type")) {
                case "font-family":
                    _$el.off("click.propertybar");
                    _$el.find("select").html("");
                    _$el.find("select").append(_option_fontFamily());
                    _$el.find("select").on("change", function () {
                        Kdo.featurer.texteditor.fontName(this.value);
                    })
                    break;
                case "font-size":
                    _$el.off("click.propertybar");
                    _$el.find("select").html("");
                    _$el.find("select").append(_option_fontSize());
                    _$el.find("input").val(_$el.find("select").val());

                    _$el.find("select").on("change", function () {
                        _$el.find("input").val(this.value);
                        Kdo.featurer.texteditor.fontSize(this.value);
                    })

                    _$el.find("input").off("focus").on("focus", function () {
                        Kdo.utils.documentRange.lastRange = Kdo.utils.documentRange.createRange();
                    })

                    _$el.find("input").off("blur").on("blur", function () {
                        var value = this.value;
                        if ((/^\d{2}$/.test(value) || /^\d{2}(px)/.test(value)) && Kdo.utils.documentRange.lastRange) {
                            if (value.indexOf("px") == -1) {
                                value = value + "px";
                                this.value = value;
                            }

                            Kdo.utils.documentRange.addRange(Kdo.utils.documentRange.lastRange);
                            Kdo.featurer.texteditor.fontSize(value);
                        }
                        //_$el.find("input").off("blur");
                    });
                    break;
                case "font-color":
                    _choose_fontColor("font-color");
                    break;
                case "font-background-color":
                    _choose_fontColor("font-background-color");
                    break;
            }
            _$el.show();
        });

        //颜色值转换  兼容ie
        var _colorConversion = function (colorValue) {
            //这里就是将BGR转换成RGB的代码了
            colorValue = ((colorValue & 0x0000ff) << 16) | (colorValue & 0x00ff00) | ((colorValue & 0xff0000) >>> 16);
            //将十进制RGB转换成十六进制RGB
            colorValue = colorValue.toString(16);
            //这里是给十六进制值RGB前面添加必要的前缀
            return "#000000".slice(0, 7 - colorValue.length) + colorValue;
        }

        //颜色监听暂时采用这种方式
        var _spectrumColorsListen = function () {
            var status = Kdo.featurer.texteditor.status(),
                _$fontColor = _$propertybar.find("#font-color input[class='font-color']"),
                _$backColor = _$propertybar.find("#font-background-color input[class='font-background-color']");
            if (/^[0-9]*$/.test(status.foreColor)) {//兼容ie
                status.foreColor = _colorConversion(status.foreColor);
            }
            if (/^[0-9]*$/.test(status.backColor)) {//兼容ie
                status.backColor = _colorConversion(status.backColor);
            }
            _$fontColor.spectrum("set", status.foreColor);
            _$backColor.spectrum("set", status.backColor);
            _$propertybar.find("#font-color input[id='txt-font-color']").val(_$fontColor.spectrum("get").toHexString());
            _$propertybar.find("#font-background-color input[id='txt-back-color']").val(_$backColor.spectrum("get").toHexString());
        }
        $(".design_text_editor").off("mouseup keyup").on("mouseup keyup", _spectrumColorsListen)
        //执行一次初始化监听
        _spectrumColorsListen();

        //监听文本编辑器当前值并赋予toolbar
        listenEditorStatus();
    }

    //监听文本编辑器当前值并赋予toolbar
    var listenEditorStatus = (function () {
        var _timer = null,
            _listenEditorStatus = function () {
                if (!!_timer) clearInterval(_timer);
                _timer = setInterval(function () {
                    //焦点在该元素之上时，不执行后续更新状态流程。
                    if (_$propertybar.find("#txt-font-size").is(":focus")) return;
                    //文字未选中，不执行后续
                    if (!document.getSelection().focusNode) return;
                    var status = Kdo.featurer.texteditor.status();
                    _$propertybar.find("#font-family>select")[0].value = (_fontEditorOptions.fontFamily[status.fontName] || _fontEditorOptions.fontFamily["微软雅黑"]).val;   //默认“微软雅黑”字体
                    if (_$propertybar.find("#font-size>select")[0].value != status.fontSize) {
                        _$propertybar.find("#font-size>select")[0].value = status.fontSize;
                        _$propertybar.find("#font-size>input")[0].value = status.fontSize;
                    }
                    status.fontBold ? _$propertybar.find("#font-bold").addClass("active") : _$propertybar.find("#font-bold").removeClass("active");
                    status.fontItalic ? _$propertybar.find("#font-italic").addClass("active") : _$propertybar.find("#font-italic").removeClass("active");
                    status.fontUnderline ? _$propertybar.find("#font-underline").addClass("active") : _$propertybar.find("#font-underline").removeClass("active");
                    status.fontJustifyLeft ? _$propertybar.find("#font-justifyleft").addClass("active") : _$propertybar.find("#font-justifyleft").removeClass("active");
                    status.fontJustifyCenter ? _$propertybar.find("#font-justifycenter").addClass("active") : _$propertybar.find("#font-justifycenter").removeClass("active");
                    status.fontJustifyRight ? _$propertybar.find("#font-justifyright").addClass("active") : _$propertybar.find("#font-justifyright").removeClass("active");
                    status.fontStrikeThrough ? _$propertybar.find("#font-strikethrough").addClass("active") : _$propertybar.find("#font-strikethrough").removeClass("active");
                }, 500);
            }
        return _listenEditorStatus;
    })();

    //文字编辑器配置项
    var _fontEditorOptions = {
        fontSize: ["12px", "14px", "16px", "18px", "24px", "32px", "48px"],
        fontFamily: {
            "黑体": { val: "黑体" },
            "微软雅黑": { val: "微软雅黑", selected: true },
            "宋体": { val: "宋体" },
            "楷体": { val: "楷体" },
            "Helvetica": { val: "Helvetica" },
            "楷体": { val: "楷体" },
            "幼圆": { val: "幼圆" },
            // "思源黑体": { val: "思源黑体" }      // 非系统字体包，暂不考虑加入可选范围
        }
    }

    //显示字体fontSize选项
    var _option_fontSize = function () {
        var fontSizeHtml = "";
        $.each(_fontEditorOptions.fontSize, function (i, item) {
            fontSizeHtml += "<option value=" + item + ">" + item + "</option>";
        })
        return fontSizeHtml;
    }

    //显示字体fontFamily选项
    var _option_fontFamily = function () {
        var fontFamilyHtml = "";
        $.each(_fontEditorOptions.fontFamily, function (key, option) {
            fontFamilyHtml += "<option value=" + option.val + " " + (option.selected ? "selected='selected'" : "") + ">" + key + "</option>";
        })
        return fontFamilyHtml;
    }

    var _choose_fontColor = function (colorType) {
        $("." + colorType).spectrum({
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
            containerClassName: "full-spectrum",
            beforeShow: function () {
                //收回工具栏
                //Kdo.floatbar.actions_child_hide();
            },
            show: function () {
                var lastRangeColor = null;
                $(".sp-container .sp-input").off("focus").on("focus", function () {
                    lastRangeColor = Kdo.utils.documentRange.createRange();
                })

                $(".sp-container .sp-input").off("blur").on("blur", function () {
                    var value = this.value;
                    if (lastRangeColor) {
                        Kdo.utils.documentRange.addRange(lastRangeColor);
                        switch (colorType) {
                            case "font-color":
                                Kdo.featurer.texteditor.foreColor(value);
                                break;
                            case "font-background-color":
                                Kdo.featurer.texteditor.backColor(value);
                                break;
                        }
                    }
                    $(".sp-container .sp-input").off("blur");
                });
            },
            move: function (color) {
                switch (colorType) {
                    case "font-color":
                        Kdo.featurer.texteditor.foreColor(color.toHexString());
                        _$propertybar.find(".fontColor").val(color.toHexString());
                        break;
                    case "font-background-color":
                        Kdo.featurer.texteditor.backColor(color.toHexString());
                        _$propertybar.find(".fontBackgroundColor").val(color.toHexString());
                        break;
                }
            },
            palette: $.spectrum.customOptions.palette
        });

        //针对在文字编辑器事件触发顺序的关系，对mousedown做了禁用处理。（处理选色会丢失焦点的问题）
        $(".sp-palette-container").off("mousedown.choose-color").on("mousedown.choose-color", function (event) { return false; });
        $(".sp-initial").off("mousedown.choose-color").on("mousedown.choose-color", function (event) { return false; });
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
            refresh: _refresh,
        }
    });
});