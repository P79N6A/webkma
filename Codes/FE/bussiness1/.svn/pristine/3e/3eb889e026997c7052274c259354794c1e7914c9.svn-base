(function(global, factory) {
    "use strict";
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = global.document ?
            factory(global, true) :
            function(w) {
                return factory(w);
            };
    } else {
        factory(global);
    }
})(typeof window !== "undefined" ? window : this, function(window) {
    'use strict';
    /*
        浮动工具栏:
            拖动、显示、隐藏、功能集成
    */
    var $toolbar = null,
        _$box,
        $contextMenu,
        //主要用户来控制功能按钮的显示和隐藏（工具栏、右键菜单）
        //为了代码重用，所以增加了一个参数：container，如果不传，其默认值为：$toolbar
        proxy = function(actions, container) {
            if (!!actions && !_.isArray(actions)) actions = actions.split(',');
            if (!container) container = $toolbar;


            var lookup = function(callback) {
                container
                    .find("div[data-fn-type],input[data-fn-type]")
                    .each(function() {
                        var actionName = $(this).data('fn-type');
                        if (!!actions && !!actions.length) {
                            if (actions.indexOf(actionName) >= 0) {
                                callback && callback.call(this, true);
                            }
                        }
                        else {
                            callback && callback.call(this, false);
                        }
                    })
            }

            return {
                enabled: function() {
                    lookup(function() {
                        $(this).removeClass('disabled').addClass('enabled');
                        $(this).removeAttr('disabled');
                    });
                },
                disabled: function() {
                    lookup(function() {
                        $(this).removeClass('enabled').addClass('disabled');
                        $(this).attr('disabled', true);
                    });
                },
                show: function() {
                    lookup(function() {
                        $(this).show();
                    });
                },
                hide: function() {
                    lookup(function() {
                        $(this).hide();
                    });
                }
            }
        },
        //私有方法：
        //现在主要用于处理状态
        //获取状态的回调函数callback为必选参数,
        wrapper = function(name, callback, availableCallback) {
            if (!availableCallback) availableCallback = callback;
            return {
                //是否可见
                visible: function(container) {
                    proxy(name, container)[(callback(container) ? 'show' : 'hide')]();
                },
                //是否可用
                available: function(container) {
                    proxy(name, container)[(availableCallback(container) ? 'enabled' : 'disabled')]();
                }
            }
        },
        //主要用来封装功能按钮的相关功能和逻辑处理
        factory = (function() {
            var currentBox,
                reload = function() {
                    currentBox = Kdo.box.utils.getCurrentBox();
                    _$box = currentBox.$focusBox;

                    setter.size(Kdo.featurer.inputResize.get().size);
                    setter.position(Kdo.featurer.inputResize.get().position);

                    if (!_$box || _$box.length <= 0) {
                        proxy().disabled();
                    }
                    else if (!!_$box && _$box.length > 0) {
                        proxy().enabled();
                    }
                    //复制
                    setter.status.copy.available();
                    setter.status.copyPaste.available();

                    //粘贴
                    setter.status.paste.available();
                    //锁定
                    setter.status.locker.root.available();
                    setter.status.locker.lock.available();
                    setter.status.locker.unlock.available();
                    //共享
                    setter.status.share.root.available();
                    setter.status.share.open.available();
                    setter.status.share.close.available();
                    //对齐方式
                    setter.status.alignPosition.root.available();
                    setter.status.alignPosition.top.available();
                    setter.status.alignPosition.bottom.available();
                    setter.status.alignPosition.left.available();
                    setter.status.alignPosition.right.available();
                    setter.status.alignPosition.center.available();
                    setter.status.alignPosition.middle.available();
                    //对齐大小
                    setter.status.alignSize.available();
                    //层级
                    setter.status.zIndex.root.available();
                    setter.status.zIndex.up.available();
                    setter.status.zIndex.down.available();
                    setter.status.zIndex.top.available();
                    setter.status.zIndex.bottom.available();
                    //上传样式
                    setter.status.uploadStyle.available();
                    //上传组件
                    setter.status.uploadComponent.available();
                    //自适应
                    setter.status.scale.available();
                    //通栏
                    setter.status.stretchFull.visible();
                    setter.status.stretchReal.visible();
                    setter.status.stretchFull.available();
                    setter.status.stretchReal.available();
                    //（文本框）大小输入设置
                    setter.status.inputWidth.available();
                    setter.status.inputHeight.available();
                    //（文本框）位置输入设置
                    setter.status.inputTop.available();
                    setter.status.inputLeft.available();
                    //删除
                    setter.status.del.available();
                    //组合/解组
                    setter.status.group.available();
                    setter.status.ungroup.available();
                    setter.status.uploadGroup.available();
                },
                setter = {
                    status: (function() {
                        return {
                            copy: wrapper('copy', function() { return Kdo.featurer.copied.status().copy; }),
                            paste: wrapper('paste', function() { return Kdo.featurer.copied.status().paste; }),
                            copyPaste: wrapper('copyPaste', function() { return Kdo.featurer.copied.status().copy; }),
                            alignPosition: {
                                root: wrapper('align.position', function() {
                                    var status = Kdo.featurer.align.position.status();
                                    return status.top || status.bottom || status.left || status.right || status.center || status.middle;
                                }),
                                top: wrapper('align.position.top', function() { return Kdo.featurer.align.position.status().top; }),
                                bottom: wrapper('align.position.bottom', function() { return Kdo.featurer.align.position.status().bottom; }),
                                left: wrapper('align.position.left', function() { return Kdo.featurer.align.position.status().left; }),
                                right: wrapper('align.position.right', function() { return Kdo.featurer.align.position.status().right; }),
                                center: wrapper('align.position.center', function() { return Kdo.featurer.align.position.status().center; }),
                                middle: wrapper('align.position.middle', function() { return Kdo.featurer.align.position.status().middle; })
                            },
                            alignSize: wrapper('align.size.attach', function() { return Kdo.featurer.align.size.status(); }),
                            zIndex: {
                                root: wrapper('zIndex', function() {
                                    var status = Kdo.featurer.zIndex.status();
                                    return status.top || status.bottom || status.left || status.right;
                                }),
                                up: wrapper('zIndex.up', function() { return Kdo.featurer.zIndex.status().up; }),
                                down: wrapper('zIndex.down', function() { return Kdo.featurer.zIndex.status().down; }),
                                top: wrapper('zIndex.top', function() { return Kdo.featurer.zIndex.status().top; }),
                                bottom: wrapper('zIndex.bottom', function() { return Kdo.featurer.zIndex.status().bottom; }),
                            },
                            uploadStyle: wrapper('uploadStyle.upload', function() { return Kdo.uploadStyle.status(); }),
                            uploadComponent: wrapper('uploadComponent.upload', function() { return Kdo.uploadComponent.status(); }),
                            locker: {
                                root: wrapper('locker', function() {
                                    var status = Kdo.featurer.locker.status();
                                    return status.lock || status.unlock;
                                }),
                                lock: wrapper('locker.lock', function() {
                                    return Kdo.featurer.locker.status().lock;
                                }),
                                unlock: wrapper('locker.unlock', function() { return Kdo.featurer.locker.status().unlock; })
                            },
                            share: {
                                root: wrapper('share', function() {
                                    var status = Kdo.featurer.share.status();
                                    return status.open || status.close;
                                }),
                                open: wrapper('share.open', function() { return Kdo.featurer.share.status().open; }),
                                close: wrapper('share.close', function() { return Kdo.featurer.share.status().close; })
                            },
                            del: wrapper('del', function() { return Kdo.featurer.deleted.status(); }),
                            scale: wrapper('autoSize.scale', function() { return Kdo.featurer.autoSize.status(); }),
                            stretchFull: wrapper('stretch.full', function(container) {
                                if (!!container) {
                                    //此处主要针对右键菜单特殊逻辑进行控制：
                                    //1、enabled为true时右键菜单需要隐藏，而工具栏是禁用但不能隐藏
                                    //2、[并且]full状态为true时显示
                                    //问题TODO：现在container只会在右键菜单显示时传入，如果今后增加了其他对象，需要修改这里的代码 
                                    return Kdo.featurer.stretch.status().enabled && Kdo.featurer.stretch.status().full;
                                }
                                //此处包含特殊逻辑：
                                //1、默认显示通栏功能（当real状态不为true时就显示）
                                //2、[或者]full状态为true时显示
                                return Kdo.featurer.stretch.status().real !== true || Kdo.featurer.stretch.status().full;
                            }, function() {
                                return Kdo.featurer.stretch.status().enabled;
                            }),
                            stretchReal: wrapper('stretch.real', function(container) {
                                if (!!container) {
                                    //此处主要针对右键菜单特殊逻辑进行控制：
                                    //1、enabled为true时右键菜单需要隐藏，而工具栏是禁用但不能隐藏
                                    //2、并且full状态为true时才显示
                                    //问题TODO：现在container只会在右键菜单显示时传入，如果今后增加了其他对象，需要修改这里的代码 
                                    return Kdo.featurer.stretch.status().enabled && Kdo.featurer.stretch.status().real;
                                }
                                return Kdo.featurer.stretch.status().real;
                            },
                                function() {
                                    return Kdo.featurer.stretch.status().enabled;
                                }),

                            inputWidth: wrapper('size.width', function() { return Kdo.featurer.inputResize.status().width; }),
                            inputHeight: wrapper('size.height', function() { return Kdo.featurer.inputResize.status().height; }),
                            inputTop: wrapper('position.top', function() { return Kdo.featurer.inputResize.status().top; }),
                            inputLeft: wrapper('position.left', function() { return Kdo.featurer.inputResize.status().left; }),

                            //组合/解组
                            group: wrapper('group.group', function() { return Kdo.featurer.group.status().group; }),
                            ungroup: wrapper('group.ungroup', function() { return Kdo.featurer.group.status().ungroup; }),
                            uploadGroup: wrapper('uploadGroup.upload', function() { return Kdo.uploadGroup.status(); }),

                            settingPageBackground: wrapper('settingPageBackground', function() { return !Kdo.box.utils.getCurrentBox().$focusBox.length; }),
                        }
                    })(),
                    size: function(val) {
                        setToolbarActions.call('size', val);
                    },
                    position: function(val) {
                        setToolbarActions.call('position', val);
                    }
                },
                setToolbarActions = function(val) {
                    if (typeof val === 'object') {
                        for (var attrName in val) {
                            $toolbar.find('input[data-fn-type="' + this + '.' + attrName + '"]').val(val[attrName]);
                        }
                    } else {
                        $toolbar.find('input[data-fn-type="' + this + '"]').val(val);
                    }
                },
                //具体功能的调用逻辑，现在支持3级功能调用，如果有更多级的需求，则要改进此方法
                invokeAction = function() {
                    var rootObject = Kdo.featurer,
                        fnName = $(this).data('fn-type'),
                        fnNames = fnName.split('.'),
                        handler;
                    if (!!Kdo[fnNames[0]]) rootObject = Kdo;

                    if (fnNames.length == 2) {
                        if (!!rootObject[fnNames[0]]) {
                            handler = rootObject[fnNames[0]][fnNames[1]];
                        }
                    }
                    else if (fnNames.length == 3) {
                        var firstObj = rootObject[fnNames[0]];
                        if (firstObj && firstObj[fnNames[1]]) {
                            handler = firstObj[fnNames[1]][fnNames[2]];
                        }
                    }
                    else {
                        handler = rootObject[fnName]
                    }

                    if (_.isFunction(handler)) {
                        handler(_$box)
                    }
                };

            return {
                setter: setter,
                reload: reload,
                invoke: invokeAction
            }
        })(),
        toolbarInit = function($target) {
            $.get("/views/templates/framework-toolbar.tpl.html", function(result) {
                $toolbar = $(result);
                $target.append($toolbar);

                $toolbar.draggable({
                    handle: ".module-configuration-top",
                    containment: $target,
                    scroll: false,
                    refreshPositions: true
                });

                $toolbar.find(".module-configuration-top .icon-close").on("click.hidden", function(event) {
                    _hide();
                });

                $toolbar.find("div[data-fn-type]").on("click.fn", function(event) {
                    if (!$(this).hasClass('disabled')) {
                        factory.invoke.call(this, event);
                    }
                });

                $toolbar.find('.compositeMenu').on('click', function(event) {
                    if (!$(this).parent().hasClass('disabled')) {
                        $(event.target).siblings().show();
                    }
                });

                //$toolbar.find('#arrangeMenu,#alignMenu,#lockMenu,#shareMenu').on('mouseleave', function (event) {
                var $toolsDiv = $toolbar.find("div[data-fn-type='zIndex'],div[data-fn-type='align.position'],div[data-fn-type='locker'],div[data-fn-type='share']");
                $toolsDiv.on('mouseleave', function(event) {
                    event.stopPropagation && event.stopPropagation();
                    $toolsDiv.children("div").hide();
                });

                var _trigger = null;
                $toolbar.find('input[data-fn-type]').on('keydown', function() {
                    if (!!_trigger) clearTimeout(_trigger);
                    var currentInput = this;
                    _trigger = setTimeout(function() {
                        var fnName = $(currentInput).data('fn-type');
                        Kdo.featurer.inputResize.update[fnName.split('.')[1]]($(currentInput).val());
                    }, 500);
                });

                factory.reload();
            });
        },
        contextMenuInit = function($target) {
            $contextMenu = $('<div class="lanh-control-toolbar-rightmenu" oncontextmenu="return false;">\
                                <div class="text-center clearfix feature enabled" data-fn-type="copy"><i class="pull-left text-left iconfont icon-copy"></i><span class="pull-left title">复制</span><span class="pull-right desc">Ctrl + C</span></div>\
                                <div class="text-center clearfix feature enabled" data-fn-type="paste"><i class="pull-left text-left iconfont icon-paste"></i><span class="pull-left title">粘贴</span><span class="pull-right desc">Ctrl + V</span></div>\
                                <div data-fn-type="zIndex">\
                                    <div class="text-center clearfix feature enabled" data-fn-type="zIndex.top"><i class="pull-left text-left iconfont icon-zIndex-top"></i><span class="pull-left title">顶层</span><span class="pull-right desc">Shift+Ctrl + [</span></div>\
                                    <div class="text-center clearfix feature enabled" data-fn-type="zIndex.up"><i class="pull-left text-left iconfont icon-zIndex-up"></i><span class="pull-left title">上一层</span><span class="pull-right desc">Ctrl + [</span></div>\
                                    <div class="text-center clearfix feature enabled" data-fn-type="zIndex.down"><i class="pull-left text-left iconfont icon-zIndex-down"></i><span class="pull-left title">下一层</span><span class="pull-right desc">Ctrl + ]</span></div>\
                                    <div class="text-center clearfix feature enabled" data-fn-type="zIndex.bottom"><i class="pull-left text-left iconfont icon-zIndex-bottom"></i><span class="pull-left title">底层</span><span class="pull-right desc">Shift+Ctrl + [</span></div>\
                                </div>\
                                <div class="text-center clearfix feature enabled" data-fn-type="uploadGroup.upload"><i class="pull-left text-left iconfont icon-group"></i><span class="pull-left title">上传组合</span></div>\
                                <div class="text-center clearfix feature enabled" data-fn-type="del"><i class="pull-left text-left iconfont icon-delete"></i><span class="pull-left title">删除</span><span class="pull-right desc">Delete</span></div>\
                            </div>');
            $target.append($contextMenu);

            $contextMenu.find("div[data-fn-type]").on("click.fn", function(event) {
                if (!$(this).hasClass('disabled')) {
                    factory.invoke.call(this, event);
                    Kdo.contextMenu.hide();
                }
            });

            // $.get('/views/templates/design/context-menu_tpl.html', function (result) {
            //     $contextMenu = $(result);
            //     $target.append($contextMenu);

            //     $contextMenu.find("div[data-fn-type]").on("click.fn", function (event) {
            //         if (!$(this).hasClass('disabled')) {
            //             factory.invoke.call(this, event);
            //             Kdo.contextMenu.hide();
            //         }
            //     });
            // });
        };

    //初始化浮动工具栏放到目标区域
    var _init = function($target) {
        //toolbarInit($target);
        contextMenuInit($target);
    }

    var trigger;
    var _refresh = function() {
        if (trigger == null) {
            trigger = setTimeout(function() {
                factory.reload();

                clearTimeout(trigger);
                trigger = null;
            }, 200);
        }
    }

    var _show = function() {
        $toolbar.show();
    }

    var _hide = function() {
        $toolbar.hide();
    }

    //TODO: 全网推暂时用不上工具栏。屏蔽处理。
    //功能统一事件注册，现在主要用于控制功能的状态
    /*Kdo.featurer.copied.on("refreshStatus", function (_status) {
        factory.setter.status.paste.available();
    });

    Kdo.featurer.align.position.on("refreshStatus", function (_status) {
        factory.setter.status.alignPosition.root.available();
        factory.setter.status.alignPosition.top.available();
        factory.setter.status.alignPosition.bottom.available();
        factory.setter.status.alignPosition.left.available();
        factory.setter.status.alignPosition.right.available();
        factory.setter.status.alignPosition.center.available();
        factory.setter.status.alignPosition.middle.available();
    });

    Kdo.featurer.align.size.on("refreshStatus", function (_status) {
        factory.setter.status.alignSize.available();
    });

    Kdo.featurer.zIndex.on("refreshStatus", function (_status) {
        factory.setter.status.zIndex.root.available();
        factory.setter.status.zIndex.up.available();
        factory.setter.status.zIndex.down.available();
        factory.setter.status.zIndex.top.available();
        factory.setter.status.zIndex.bottom.available();
    });

    Kdo.featurer.locker.on("refreshStatus", function (_status) {
        factory.setter.status.locker.root.available();
        factory.setter.status.locker.lock.available();
        factory.setter.status.locker.unlock.available();
    });

    Kdo.featurer.share.on("refreshStatus", function (_status) {
        factory.setter.status.share.root.available();
        factory.setter.status.share.open.available();
        factory.setter.status.share.close.available();
    });

    Kdo.featurer.deleted.on("refreshStatus", function (_status) {
        factory.setter.status.del.available();
    });

    Kdo.featurer.autoSize.on("refreshStatus", function (_status) {
        factory.setter.status.scale.available();
    });

    Kdo.featurer.stretch.on('refreshStatus', function () {
        setter.status.stretchFull.visible();
        setter.status.stretchReal.visible();

        setter.status.stretchFull.available();
        setter.status.stretchReal.available();
    });

    Kdo.featurer.inputResize.on('refreshStatus', function () {
        setter.status.inputWidth.available();
        setter.status.inputHeight.available();

        setter.status.inputTop.available();
        setter.status.inputLeft.available();
    });

    Kdo.uploadStyle.on("refreshStatus", function (_status) {
        factory.setter.status.uploadStyle.available();
    });

    Kdo.uploadComponent.on("refreshStatus", function (_status) {
        factory.setter.status.uploadComponent.available();
    });*/

    //显示右键菜单时的逻辑
    var showContextMenu = function(event, callback) {
        $contextMenu.addClass('on');

        var position = {
            left: event.pageX,
            top: event.pageY,
            offsetLeft: 1,
            offsetTop: 1
        }
        if ((position.left + $contextMenu.width()) > $(window).width()) {
            position.left = position.left - $contextMenu.width();
            position.offsetLeft = -1;
        }
        if ((position.top + $contextMenu.height()) > $(window).height()) {
            position.top = position.top - $contextMenu.height();
            position.offsetTop = -1;
        }

        $contextMenu.css({
            "left": position.left + position.offsetLeft,
            "top": position.top + position.offsetTop - 50,
        });
    }

    window.Kdo = $.extend(true, window.Kdo || {}, {
        toolbar: {
            //TODO: 全网推暂时用不上工具栏。屏蔽处理。
            init: _init,
            //show: _show,
            //hide: _hide,
            //refresh: _refresh
            show: function() { },
            hide: function() { },
            refresh: function() { }
        },
        contextMenu: {
            show: function(event) {
                //复制
                factory.setter.status.copy.visible($contextMenu);
                //粘贴
                factory.setter.status.paste.available($contextMenu);
                //复印
                factory.setter.status.copyPaste.visible($contextMenu);

                //锁定
                factory.setter.status.locker.root.visible($contextMenu);
                factory.setter.status.locker.lock.visible($contextMenu);
                factory.setter.status.locker.unlock.visible($contextMenu);

                //共享
                factory.setter.status.share.root.visible($contextMenu);
                factory.setter.status.share.open.visible($contextMenu);
                factory.setter.status.share.close.visible($contextMenu);

                //层级
                factory.setter.status.zIndex.root.visible($contextMenu);
                factory.setter.status.zIndex.up.available($contextMenu);
                factory.setter.status.zIndex.down.available($contextMenu);
                factory.setter.status.zIndex.top.available($contextMenu);
                factory.setter.status.zIndex.bottom.available($contextMenu);

                //自适应
                factory.setter.status.scale.visible($contextMenu);

                //上传样式
                factory.setter.status.uploadStyle.visible($contextMenu);
                //上传组件
                factory.setter.status.uploadComponent.visible($contextMenu);
                //组合/解组
                factory.setter.status.group.visible($contextMenu);
                factory.setter.status.ungroup.visible($contextMenu);
                factory.setter.status.uploadGroup.visible($contextMenu);
                //删除
                factory.setter.status.del.visible($contextMenu);
                //设置页面背景
                factory.setter.status.settingPageBackground.visible($contextMenu);
                //通栏
                factory.setter.status.stretchFull.visible($contextMenu);
                factory.setter.status.stretchReal.visible($contextMenu);
                //显示右键菜单
                showContextMenu(event);
            },
            hide: function() {
                //使用无效坐标的方式隐藏右键菜单来防止闪烁问题
                if (!!$contextMenu) {
                    $contextMenu.removeClass('on').css({
                        top: '-20000px',
                        left: '-20000px'
                    });
                }
            }
        }
    });
});