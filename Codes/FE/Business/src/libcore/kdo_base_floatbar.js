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
        浮动条——用于模块的辅助工具条。显示在模块上方，随Box移动。
    */
    //<div id="font-toolbar" data-type="font-toolbar" class="pull-left column"><div class="note-toolbar panel-heading"></div></div>\
    /*
    <div id="link" data-type="link" class="pull-left column">链接</div>\
        <div id="group" data-type="group" class="pull-left column" data-toggle="tooltip" data-placement="bottom" title="组合"><i class="iconfont icon-group"></i></div>\
        <div id="ungroup" data-type="ungroup" class="pull-left column" data-toggle="tooltip" data-placement="bottom" title="解组"><i class="iconfont icon-ungroup"></i></div>\
        <div id="lock"  data-type="lock" class="pull-left column" data-toggle="tooltip" data-placement="bottom" title="锁定"><i class="iconfont icon-lock"></i></div>\
        <div id="unlock" data-type="unlock" class="pull-left column" data-toggle="tooltip" data-placement="bottom" title="解锁"><i class="iconfont icon-on-lock"></i></div>\
    */
    var _$floatbar = $('<div class="lanh-control-toolbar-setting white_bg">\
                                    <div id="actions">\
                                        <div id="actions-menu" class="actions-menu">\
                                            <div id="font-toolbar" data-type="font-toolbar" class="pull-left column">编辑文字</div>\
                                            <div id="font-family" data-type="font-family" data-parent="font" class="pull-left column"><select></select></div>\
                                            <div id="font-size" data-type="font-size"  data-parent="font" class="pull-left column"><select></select><input name="font-size" class="fontsizeInput"></div>\
                                            <div id="font-color" data-type="font-color" data-parent="font" class="pull-left column" data-toggle="tooltip" data-placement="bottom" title="字体颜色"><div class="pull-left choose-color"><input class="font-color" /></div></div>\
                                            <div id="font-background-color" data-type="font-background-color" data-parent="font" class="pull-left column" data-toggle="tooltip" data-placement="bottom" title="背景颜色"><div class="pull-left choose-color"><input class="font-background-color" /></div></div>\
                                            <div id="font-bold" data-type="font-bold" data-parent="font" class="pull-left column" data-toggle="tooltip" data-placement="bottom" title="加粗"><div class="img-icon"><i class="fa fa-bold"></i></div></div>\
                                            <div id="font-italic" data-type="font-italic" data-parent="font" class="pull-left column" data-toggle="tooltip" data-placement="bottom" title="斜体"><div class="img-icon"><i class="fa fa-italic"></i></div></div>\
                                            <div id="font-underline" data-type="font-underline" data-parent="font" class="pull-left column" data-toggle="tooltip" data-placement="bottom" title="下划线"><div class="img-icon"><i class="fa fa-underline"></i></div></div>\
                                            <div id="font-justifyleft" data-type="font-justifyleft" data-parent="font" class="pull-left column" data-toggle="tooltip" data-placement="bottom" title="左对齐"><div class="img-icon"><i class="fa fa-align-left"></i></div></div>\
                                            <div id="font-justifycenter" data-type="font-justifycenter" data-parent="font" class="pull-left column" data-toggle="tooltip" data-placement="bottom" title="居中"><div class="img-icon"><i class="fa fa-align-center"></i></div></div>\
                                            <div id="font-justifyright" data-type="font-justifyright" data-parent="font" class="pull-left column" data-toggle="tooltip" data-placement="bottom" title="右对齐"><div class="img-icon"><i class="fa fa-align-right"></i></div></div>\
                                            <div id="font-strikethrough" data-type="font-strikethrough" data-parent="font" class="pull-left column" data-toggle="tooltip" data-placement="bottom" title="删除线"><div class="img-icon"><i class="fa fa-strikethrough"></i></div></div>\
                                            <div id="font-removeformat" data-type="font-removeformat" data-parent="font" class="pull-left column" data-toggle="tooltip" data-placement="bottom" title="清除样式"><div class="img-icon"><i class="fa fa-eraser"></i></div></div>\
                                            <div id="choose-colors" data-type="choose-colors" class="pull-left column"></div>\
                                            <div id="choose-image" data-type="choose-image" class="pull-left column"><div class="img-icon"><i class="iconfont icon-picture"></i></div></div>\
                                            <div id="link" data-type="link" class="pull-left column">链接</div>\
                                            <div id="border-size" data-type="border-size" class="pull-left column">线宽</div>\
                                            <div id="opacity" data-type="opacity" class="pull-left column">透明度</div>\
                                            <div id="horizontal-transform" data-type="horizontal-transform" class="pull-left column">水平翻转</div>\
                                            <div id="vertical-transform" data-type="vertical-transform" class="pull-left column">垂直翻转</div>\
                                            <div id="stretch-full" data-type="stretch-full" class="pull-left column">通栏</div>\
                                            <div id="stretch-real" data-type="stretch-real" class="pull-left column">取消通栏</div>\
                                            <div id="setting" data-type="setting" class="pull-left column">设置</div>\
                                            <div id="style-setting" data-type="style-setting" class="pull-left column">样式</div>\
                                            <div id="border-style" data-type="border-style" class="pull-left column" data-toggle="tooltip" data-placement="bottom" title="边框">\
                                                <div class="img-icon"><i class="iconfont icon-borderstyle"></i></div>\
                                                <div style="width:100%;height:10px;background-color:#fff;position: absolute;top: 30px;display:none;"></div>\
                                                <div style="width:100px;height:100px;background-color:#fff;position: absolute;top: 36px;border-radius: 0 0 10px 10px;box-shadow: 1px 1px 3px #797979;display:none;"></div>\
                                            </div>\
                                            <div id="alignposition" data-type="alignposition" class="pull-left column">对齐</div>\
                                            <div id="group" data-type="group" class="pull-left column">组合</div>\
                                            <div id="ungroup" data-type="ungroup" class="pull-left column">解组</div>\
                                            <div id="lock"  data-type="lock" class="pull-left column">锁定</div>\
                                            <div id="unlock" data-type="unlock" class="pull-left column">解锁</div>\
                                            <div id="update" data-type="update" class="pull-left column">更新</div>\
                                        </div>\
                                        <div id="actions-child" class="actions-child" style="display:none;"></div>\
                                    </div>\
                                    <div id="position"  style="display:none;">\
                                        <div class="column"></div>\
                                    </div>\
                                    <div id="title"  style="display:none;">\
                                        <div class="actions-menu-title">\
                                            <div class="title-header">\
                                            </div>\
                                            <div class="title-content">\
                                            </div>\
                                        </div>\
                                    </div>\
                                </div>');

    var _$element = null,    //floatbar所在元素
        _$target = null,    //attach的目标元素
        _controlConfig = null;

    //初始化，设置浮动条所在区域
    var _init = function ($element) {
        if (!!$element) {
            _$element = $element;
        }

        _$floatbar.css({
            "position": "absolute",
            "top": "0px",
            "left": "0px",
            "z-index": "10091",
            //"width": "90px",     //根据功能块的数量调整
            "height": "36px"
        });
        _$element.append(_$floatbar);

        _hide();

        _$floatbar.off("mouseenter.floatbar").on("mouseenter.floatbar", function (event) {
            //关闭页面全局事件
            Kdo.events.off("mouse");
        }).off("mouseleave.floatbar").on("mouseleave.floatbar", function (event) {
            //恢复原本的事件
            Kdo.events.on("mouse");
        });

        $("[data-toggle='tooltip']").tooltip();


        //注册功能按钮点击事件
        _$floatbar.find("div[data-type]").off("click.floatbar").on("click.floatbar", function (event) {
            var $target = $(event.currentTarget);
            if ($target.hasClass("on")) { _actions_child_hide(); }
            else {
                _actions_child_hide();
                switch ($target.data("type")) {
                    case "font-toolbar":            //字体
                        //字体编辑器
                        Kdo.settings.open("data");
                        break;
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
                    case "choose-image":            //选择图片
                        window.Kdo.utils.modalBox.init({
                            template: "<image-gallery  type='singleSelect'></image-gallery>",
                            headerTitle: "替换图片"
                        });
                        break;
                    case "link":                    //选择链接
                        Kdo.settings.link.load();
                        _actions_child_show($(this), Kdo.settings.link.html(true));
                        Kdo.settings.link.render();
                        break;
                    case "opacity":                 //透明度
                        Kdo.settings.opacity.load();
                        _actions_child_show($(this), Kdo.settings.opacity.html());
                        Kdo.settings.opacity.render();
                        break;
                    case "border-size":                 //线宽
                        Kdo.settings.borderSize.load();
                        _actions_child_show($(this), Kdo.settings.borderSize.html());
                        Kdo.settings.borderSize.render();
                        break;
                    case "border-style":                 //边框
                        Kdo.settings.border.load();
                        _actions_child_show($(this), Kdo.settings.border.html());
                        _$floatbar.css("height", "130px");
                        Kdo.settings.border.render();
                        break;
                    case "alignposition":                 //对齐
                        Kdo.settings.alignposition.load();
                        _actions_child_show($(this), Kdo.settings.alignposition.html());
                        $("[data-toggle='tooltip']").tooltip();
                        Kdo.settings.alignposition.render();
                        break;
                    case "horizontal-transform":    //水平翻转
                        Kdo.featurer.transform.transformForHorizontal();
                        break;
                    case "vertical-transform":      //垂直翻转
                        Kdo.featurer.transform.transformForVertical();
                        break;
                    case "stretch-full":         //通栏
                        Kdo.featurer.stretch.full();
                        break;
                    case "stretch-real":         //取消通栏
                        Kdo.featurer.stretch.real();
                        break;
                    case "lock":         //锁定
                        Kdo.featurer.locker.lock();
                        break;
                    case "unlock":         //取消锁定
                        Kdo.featurer.locker.unlock();
                        break;
                    case "group":         //组合
                        Kdo.featurer.group.group();
                        break;
                    case "ungroup":     //解组
                        Kdo.featurer.group.ungroup();
                        break;
                    case "setting":      //设置
                        window.Kdo.utils.modalBox.init({
                            headerTitle: _controlConfig.setting.settingTitle || "设置",
                            template: _controlConfig.setting.settingTemplate || "",
                            templateUrl: _controlConfig.setting.settingTemplateUrl || "",
                            size: _controlConfig.setting.settingModalSize || ""
                        }, 'setting_activity');
                        break;
                    case "style-setting":      //样式
                        window.Kdo.utils.modalBox.init({
                            headerTitle: _controlConfig.styleSetting.settingTitle || "样式",
                            template: _controlConfig.styleSetting.settingTemplate || "",
                            templateUrl: _controlConfig.styleSetting.settingTemplateUrl || "",
                            size: _controlConfig.styleSetting.settingModalSize || ""
                        });
                        break;
                    case "update":                 //更新
                        Kdo.settings.update.load();
                        Kdo.settings.update.render();
                        break;
                }
            }
        });
    };

    //展开工具栏
    var _actions_child_show = function (_$action, _child_html) {
        _$action.addClass("on");
        _$action.siblings().removeClass("on");

        _$floatbar.find("#actions-child").html(_child_html);
        _$floatbar.find("#actions-child").show();

        _$action.parent().children().css("border-bottom", "");
        _$action.siblings().css("border-bottom", "1px solid #eaeff1");
        _$floatbar.css("height", "80px");
        _$floatbar.css("min-width", "240px");
    }

    //收回工具栏
    var _actions_child_hide = function () {
        _$floatbar.find(".actions-menu>div").removeClass("on");
        _$floatbar.find(".actions-menu>div").css("border-bottom", "");
        _$floatbar.find("#actions-child").hide();
        _$floatbar.css("height", "36px");
        _$floatbar.css("min-width", "0px");
    }

    //监听元素变动
    var _observer = null;
    try {
        _observer = new MutationObserver(function (mutationRecords) {
            if (_$floatbar.is(":visible")) {
                var _array = _.filter(mutationRecords, function (item) { return $(item.target).hasClass("box") });
                if (_array.length > 0) {
                    _actions_child_hide();
                    _update_position();

                    //切换浮动工具条显示为坐标
                    Kdo.floatbar.toggle("position");
                } else {
                    //切换浮动工具条显示为功能按钮
                    Kdo.floatbar.toggle("actions");
                }
            }
        });
    } catch (e) {

    }

    //设置浮动条附加到哪个元素上(目前是设置到某个Box)
    var _attach = function ($target, options) {
        //已attach元素与即将attach元素如果不同，则隐藏child功能
        if (!!_$target && _$target[0] != $($target)[0]) _actions_child_hide();
        _$target = $($target);
        if (_$target.length == 0) {
            _hide();
            return;
        }
        _$floatbar.find("[class^='chooseColors']").spectrum("hide");
        _update_position();

        //--------加载工具栏功能块 START--------
        //获取当前选中模块的JSON
        var _$actions_menu = _$floatbar.find("#actions > #actions-menu"),
            _currentBox = Kdo.box.utils.getCurrentBox(),
            _$box = _currentBox.$focusSingleBox;
        _controlConfig = null;
        switch (_currentBox.focusLevel) {
            case "single":
                var _controlConfigs = Kdo.data.controls.get(Kdo.box.utils.getBoxControlId(_$box));
                if (_controlConfigs.length > 0) _controlConfig = _controlConfigs[0];
                break;
            case "group":
                _controlConfig = {
                    addTools: ["lock", "alignposition", "ungroup"]
                }
                break;
            case "temp":
                _controlConfig = {
                    addTools: ["lock", "alignposition", "group"]
                }
                break;
            default:
                return;
        }

        //根据模块JSON中的addTools属性判断工具栏中的功能块是否显示
        $.each(_$actions_menu.find("div[data-type]"), function (index, el) {
            var _$el = $(el);
            _.findIndex(Kdo.menus.getToolbar(_controlConfig), function (key) { return key == _$el.data("type") }) != -1 ? _$el.show() : _$el.hide();
        });

        //设计师没有设置外链权限
        //if (_$actions_menu.find("div[data-type='link']").length > 0 && !Kdo.utils.permission("link")) {
        //    _$actions_menu.find("div[data-type='link']").remove();
        //}

        //普通用户没有模块更新权限
        //if (_$actions_menu.find("div[data-type='update']").length > 0 && !Kdo.utils.permission("updateControl")) {
        //    _$actions_menu.find("div[data-type='update']").remove();
        //}

        //设计师没有设置外链权限
        if (_.findIndex(Kdo.menus.getToolbar(_controlConfig), function (key) { return key == "link" }) != -1 && Kdo.utils.permission("link")) {
            _$actions_menu.find("div[data-type='link']").show();
        } else {
            _$actions_menu.find("div[data-type='link']").hide();
        }

        //普通用户没有模块更新权限
        if (Kdo.utils.permission("updateControl")) {
            _$actions_menu.find("div[data-type='update']").show();
        } else {
            _$actions_menu.find("div[data-type='update']").hide();
        }

        //加载颜色选择器
        if (_$actions_menu.find("div[data-type='choose-colors']").css("display") == "block") {
            Kdo.settings.chooseColors.load();
            _$actions_menu.find("#choose-colors").html(Kdo.settings.chooseColors.html());
            Kdo.settings.chooseColors.render();
        }

        //加载通栏功能状态
        var _stretch = Kdo.featurer.stretch.status();
        _$actions_menu.find("#stretch-full").hide();
        _$actions_menu.find("#stretch-real").hide();
        if (_stretch.enabled) {
            if (_stretch.full) _$actions_menu.find("#stretch-full").show();
            if (_stretch.real) _$actions_menu.find("#stretch-real").show();
        }

        //加载锁定功能状态
        var _locker = Kdo.featurer.locker.status();
        _$actions_menu.find("#lock").hide();
        _$actions_menu.find("#unlock").hide();
        if (_locker.lock) _$actions_menu.find("#lock").show();
        if (_locker.unlock) _$actions_menu.find("#unlock").show();

        //加载组合功能状态
        var _group = Kdo.featurer.group.status();
        _$actions_menu.find("#group").hide();
        _$actions_menu.find("#ungroup").hide();
        if (_group.group) _$actions_menu.find("#group").show();
        if (_group.ungroup) _$actions_menu.find("#ungroup").show();
        //--------加载工具栏功能块 END--------

        if (options.show) {
            _show();
        }
    }

    //工具条超出可视范围处理
    var _positionLeft = function () {
        var barLeftPosition = $(".lanh-control-toolbar-setting").offset().left + $(".lanh-control-toolbar-setting").outerWidth();
        var browserWidth = document.body.clientWidth;
        var positionLeft = 0;
        if (barLeftPosition > browserWidth) {
            positionLeft = parseInt(_$floatbar.css("left")) - (barLeftPosition - browserWidth);
        } else {
            positionLeft = parseInt(_$floatbar.css("left"));
        }
        return positionLeft;
    }

    //显示浮动条
    var _show = function () {
        _$floatbar.show();
        _$floatbar.find("div[data-type]:visible:first").css({ "border-left": "0" });
        _floatbar_width();

        ////工具条超出可视范围处理
        //var barLeftPosition = $(".lanh-control-toolbar-setting").offset().left + $(".lanh-control-toolbar-setting").outerWidth();
        //var browserWidth = document.body.clientWidth;
        //var positionLeft = 0;
        //if (barLeftPosition > browserWidth) {
        //    positionLeft = parseInt(_$floatbar.css("left")) - (barLeftPosition - browserWidth);
        //} else {
        //    positionLeft = parseInt(_$floatbar.css("left"));
        //}

        var positionLeft = _positionLeft();
        _$floatbar.css({
            "left": positionLeft + "px"
        });

        _observer.disconnect();
        _observer.observe(_$target[0], {
            subtree: true,
            attributes: true,
            attributeFilter: ['style']
        });
    }

    //隐藏浮动条
    var _hide = function () {
        _$floatbar.hide();
        _observer.disconnect();
        _$target = null;
    }

    //切换显示
    var _toggle = function (type) {
        _$floatbar.children("#actions").hide();
        _$floatbar.children("#position").hide();
        switch (type) {
            case "actions":
                _$floatbar.children("#actions").show();
                _floatbar_width();
                break;
            case "position":
                _$floatbar.children("#position").show();
                //工具条默认宽度
                _$floatbar.css({ "width": "120px" });
                break;
        }
    }

    //工具条默认宽度
    var _floatbar_width = function () {
        //debugger;
        _$floatbar.css({ "width": "200px" });
        var _width = 0;
        $.each(_$floatbar.find("div[data-type]:visible"), function (index, el) {
            _width += $(el).outerWidth();
        });
        _width += parseInt(_$floatbar.css("padding-left"));
        _width += parseInt(_$floatbar.css("padding-right"));

        _$floatbar.css({ "width": _width });
    }

    //改变浮动条位置的函数
    var _update_position = function () {
        //_$floatbar.find("[class^='chooseColors']").spectrum("hide");
        var position = _$target.position();
        var _currentBox = Kdo.box.utils.getCurrentBox(),
            _$box = _currentBox.$focusSingleBox;
        var controlConfig = Kdo.data.controls.get(Kdo.box.utils.getBoxControlId(_$box))[0];

        //旋转到170-180时，工具条上调12px
        var rotateTop = 0;
        if (_$box.hasClass("single") && !!controlConfig && !!controlConfig.style && !!controlConfig.style.transform) {
            var angle = 0;
            var arrayAngle = controlConfig.style.transform.match(/[0-9\.]+(?=deg)/g);
            if (!!arrayAngle && arrayAngle.length > 0) {
                angle = parseFloat(arrayAngle[0]);
            }

            if (angle > 170 && angle < 190) {
                rotateTop = 12;
            }
        }

        _$floatbar.css({
            "top": (position.top - 36 - 5 - 25 - rotateTop) + "px",//25为调高工具条高度，v1.3，mars
            "left": (position.left) + "px"
        });
        var _boxPosition = Kdo.featurer.inputResize.get();
        _$floatbar.children("#position").find(".column").text("X: {0}  Y: {1}".replace("{0}", _boxPosition.position.left).replace("{1}", _boxPosition.position.top));   //改为和toolbar显示的一致
    }

    //显示字体编辑工具条
    var _show_fontMenu = function () {
        var _$actions_menu = _$floatbar.find("#actions > #actions-menu");
        _$actions_menu.children("div").hide();
        $.each(_$actions_menu.find("div[data-parent=font]"), function (index, el) {
            var _$el = $(el);
            switch (_$el.data("type")) {
                case "font-family":
                    _$el.off("click.floatbar");
                    _$el.find("select").html("");
                    _$el.find("select").append(_option_fontFamily());
                    _$el.find("select").on("change", function () {
                        Kdo.featurer.texteditor.fontName(this.value);
                    })
                    break;
                case "font-size":
                    _$el.off("click.floatbar");
                    _$el.find("select").html("");
                    _$el.find("select").append(_option_fontSize());
                    _$el.find("select").on("change", function () {
                        _$el.find("input").val(this.value);
                        Kdo.featurer.texteditor.fontSize(this.value);
                    })
                    //var lastRange = null;

                    _$el.find("input").off("focus").on("focus", function () {
                        lanh.documentRange.lastRange = lanh.documentRange.createRange();
                    })

                    _$el.find("input").off("blur").on("blur", function () {
                        var value = this.value;
                        if ((/^\d{2}$/.test(value) || /^\d{2}(px)/.test(value)) && lanh.documentRange.lastRange) {
                            if (value.indexOf("px") == -1) {
                                value = value + "px";
                                this.value = value;
                            }

                            lanh.documentRange.addRange(lanh.documentRange.lastRange);
                            Kdo.featurer.texteditor.fontSize(value);
                        }
                        _$el.find("input").off("blur");
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
        _floatbar_width();

        var positionLeft = _positionLeft();
        _$floatbar.css({
            "left": positionLeft + "px"
        });

        //颜色监听暂时采用这种方式
        $(".design_text_editor").on("mouseup keyup", function () {
            var status = Kdo.featurer.texteditor.status();
            _$floatbar.find("#font-color input[class='font-color']").spectrum("set", status.foreColor);
            _$floatbar.find("#font-background-color input[class='font-background-color']").spectrum("set", status.backColor);
        })

        listenEditorStatus();
    }

    //监听文本编辑器当前值并赋予toolbar
    var listenEditorStatus = (function () {
        var _timer = null,
            _listenEditorStatus = function () {
                if (!!_timer) clearInterval(_timer);
                _timer = setInterval(function () {
                    var status = Kdo.featurer.texteditor.status();
                    _$floatbar.find("#font-family>select")[0].value = status.fontName;
                    _$floatbar.find("#font-size>select")[0].value = status.fontSize;

                    status.fontBold ? _$floatbar.find("#font-bold").addClass("blue") : _$floatbar.find("#font-bold").removeClass("blue");
                    status.fontItalic ? _$floatbar.find("#font-italic").addClass("blue") : _$floatbar.find("#font-italic").removeClass("blue");
                    status.fontUnderline ? _$floatbar.find("#font-underline").addClass("blue") : _$floatbar.find("#font-underline").removeClass("blue");
                    status.fontJustifyLeft ? _$floatbar.find("#font-justifyleft").addClass("blue") : _$floatbar.find("#font-justifyleft").removeClass("blue");
                    status.fontJustifyCenter ? _$floatbar.find("#font-justifycenter").addClass("blue") : _$floatbar.find("#font-justifycenter").removeClass("blue");
                    status.fontJustifyRight ? _$floatbar.find("#font-justifyright").addClass("blue") : _$floatbar.find("#font-justifyright").removeClass("blue");
                    status.fontStrikeThrough ? _$floatbar.find("#font-strikethrough").addClass("blue") : _$floatbar.find("#font-strikethrough").removeClass("blue");
                }, 500);
            }
        return _listenEditorStatus;
    })();

    //显示字体fontSize选项
    var _option_fontSize = function () {
        var options = ["12px", "14px", "16px", "18px", "24px", "32px", "48px"];
        var fontSizeHtml = "";
        $.each(options, function (i, item) {
            fontSizeHtml += "<option value=" + item + ">" + item + "</option>";
        })
        return fontSizeHtml;
    }

    //显示字体fontFamily选项
    var _option_fontFamily = function () {
        var options = {
            "黑体": "黑体",
            "微软雅黑": "微软雅黑",
            "宋体": "宋体",
            "Helvetica": "Helvetica"
        }
        var fontFamilyHtml = "";
        $.each(options, function (key, val) {
            fontFamilyHtml += "<option value=" + val + ">" + key + "</option>";
        })
        return fontFamilyHtml;
    }

    var _choose_fontColor = function (colorType) {
        $("." + colorType).spectrum({
            allowEmpty: true,
            color: "#fff",
            showInput: true,
            showPalette: true,
            //showInitial: true,
            showSelectionPalette: false,
            showAlpha: false,
            showButtons: true,
            cancelText: "",
            maxPaletteSize: 10,
            preferredFormat: "hex",
            localStorageKey: "spectrum.demo",
            containerClassName: "full-spectrum",
            beforeShow: function () {
                //收回工具栏
                Kdo.floatbar.actions_child_hide();
            },
            show: function () {
                var lastRangeColor = null;
                $(".sp-container .sp-input").off("focus").on("focus", function () {
                    lastRangeColor = lanh.documentRange.createRange();
                })

                $(".sp-container .sp-input").off("blur").on("blur", function () {
                    var value = this.value;
                    if (lastRangeColor) {
                        lanh.documentRange.addRange(lastRangeColor);
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
                        Kdo.featurer.texteditor.foreColor(color);
                        break;
                    case "font-background-color":
                        Kdo.featurer.texteditor.backColor(color);
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
        floatbar: {
            init: _init,
            attach: _attach,
            show: _show,
            hide: _hide,
            toggle: _toggle,
            actions_child_hide: _actions_child_hide,
            show_fontMenu: _show_fontMenu,
            refresh: _refresh
        }
    });
});
