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
    // var effects = {
    //     'Attention Seekers': ['bounce', 'flash', 'pulse', 'rubberBand', 'shake', 'swing', 'tada', 'wobble', 'jello'],
    //     'Bouncing Entrances': ['bounceIn', 'bounceInDown', 'bounceInLeft', 'bounceInRight', 'bounceInUp'],
    //     'Bouncing Exits': ['bounceOut', 'bounceOutDown', 'bounceOutLeft', 'bounceOutRight', 'bounceOutUp'],
    //     'Fading Entrances': ['fadeIn', 'fadeInDown', 'fadeInDownBig', 'fadeInLeft', 'fadeInLeftBig', 'fadeInRight', 'fadeInRightBig', 'fadeInUp', 'fadeInUpBig'],
    //     'Fading Exits': ['fadeOut', 'fadeOutDown', 'fadeOutDownBig', 'fadeOutLeft', 'fadeOutLeftBig', 'fadeOutRight', 'fadeOutRightBig', 'fadeOutUp', 'fadeOutUpBig'],
    //     'Flippers': ['flip', 'flipInX', 'flipInY', 'flipOutX', 'flipOutY'],
    //     'Lightspeed': ['lightSpeedIn', 'lightSpeedOut'],
    //     'Rotating Entrances': ['rotateIn', 'rotateInDownLeft', 'rotateInDownRight', 'rotateInUpLeft', 'rotateInUpRight'],
    //     'Rotating Exits': ['rotateOut', 'rotateOutDownLeft', 'rotateOutDownRight', 'rotateOutUpLeft', 'rotateOutUpRight'],
    //     'Sliding Entrances': ['slideInUp', 'slideInDown', 'slideInLeft', 'slideInRight'],
    //     'Sliding Exits': ['slideOutUp', 'slideOutDown', 'slideOutLeft', 'slideOutRight'],
    //     'Zoom Entrances': ['zoomIn', 'zoomInDown', 'zoomInLeft', 'zoomInRight', 'zoomInUp'],
    //     'Zoom Exits': ['zoomOut', 'zoomOutDown', 'zoomOutLeft', 'zoomOutRight', 'zoomOutUp'],
    //     'Specials': ['hinge', 'jackInTheBox', 'rollIn', 'rollOut']
    // }
    var effects = [
        { key: "Attention Seekers", title: "牵引", childs: [{ key: "bounce", title: "跳动" }, { key: "flash", title: "闪动" }, { key: "pulse", title: "缩放" }, { key: "rubberBand", title: "弹性" }, { key: "shake", title: "摇头" }, { key: "swing", title: "摇晃" }, { key: "tada", title: "惯性摇晃" }, { key: "wobble", title: "剧烈摇头" }, { key: "jello", title: "Q弹" }] },
        { key: "Bouncing Entrances", title: "进入", childs: [{ key: "bounceIn", title: "中心弹入" }, { key: "bounceInDown", title: "上方弹入" }, { key: "bounceInLeft", title: "左边弹入" }, { key: "bounceInRight", title: "右边弹入" }, { key: "bounceInUp", title: "下方弹入" }] },
        { key: "Bouncing Exits", title: "退出", childs: [{ key: "bounceOut", title: "中心弹出" }, { key: "bounceOutDown", title: "向下弹出" }, { key: "bounceOutLeft", title: "向左弹出" }, { key: "bounceOutRight", title: "向右弹出" }, { key: "bounceOutUp", title: "向上弹出" }] },
        { key: "Fading Entrances", title: "淡入", childs: [{ key: "fadeIn", title: "中心淡入" }, { key: "fadeInDown", title: "向下淡入" }, { key: "fadeInDownBig", title: "向下快速淡入" }, { key: "fadeInLeft", title: "向右淡入" }, { key: "fadeInLeftBig", title: "向右快速淡入" }, { key: "fadeInRight", title: "向左淡入" }, { key: "fadeInRightBig", title: "向左快速淡入" }, { key: "fadeInUp", title: "向上淡入" }, { key: "fadeInUpBig", title: "向上快速淡入" }] },
        { key: "Fading Exits", title: "淡出", childs: [{ key: "fadeOut", title: "中心淡出" }, { key: "fadeOutDown", title: "向下淡出" }, { key: "fadeOutDownBig", title: "向下快速淡出" }, { key: "fadeOutLeft", title: "向左淡出" }, { key: "fadeOutLeftBig", title: "向左快速淡出" }, { key: "fadeOutRight", title: "向右淡出" }, { key: "fadeOutRightBig", title: "向右快速淡出" }, { key: "fadeOutUp", title: "向上淡出" }, { key: "fadeOutUpBig", title: "向上快速淡出" }] },
        { key: "Flippers", title: "翻转", childs: [{ key: "flip", title: "原地翻转" }, { key: "flipInX", title: "X轴翻转" }, { key: "flipInY", title: "Y轴翻转" }, { key: "flipOutX", title: "X轴翻出" }, { key: "flipOutY", title: "Y轴翻出" }] },
        { key: "Lightspeed", title: "光速", childs: [{ key: "lightSpeedIn", title: "光速右进" }, { key: "lightSpeedOut", title: "光速右出" }] },
        { key: "Rotating Entrances", title: "旋转淡入", childs: [{ key: "rotateIn", title: "旋转淡入" }, { key: "rotateInDownLeft", title: "左上旋入" }, { key: "rotateInDownRight", title: "右上旋入" }, { key: "rotateInUpLeft", title: "左下旋入" }, { key: "rotateInUpRight", title: "右下旋入" }] },
        { key: "Rotating Exits", title: "旋转淡出", childs: [{ key: "rotateOut", title: "旋转淡出" }, { key: "rotateOutDownLeft", title: "左下旋出" }, { key: "rotateOutDownRight", title: "右下旋出" }, { key: "rotateOutUpLeft", title: "左上旋出" }, { key: "rotateOutUpRight", title: "右上旋出" }] },
        { key: "Sliding Entrances", title: "移入", childs: [{ key: "slideInUp", title: "下方移入" }, { key: "slideInDown", title: "上方移入" }, { key: "slideInLeft", title: "左侧移入" }, { key: "slideInRight", title: "右侧移入" }] },
        { key: "Sliding Exits", title: "移出", childs: [{ key: "slideOutUp", title: "向上移出" }, { key: "slideOutDown", title: "向下移出" }, { key: "slideOutLeft", title: "向左移出" }, { key: "slideOutRight", title: "向右移出" }] },
        { key: "Zoom Entrances", title: "弹入", childs: [{ key: "zoomIn", title: "中心弹入" }, { key: "zoomInDown", title: "向下弹入" }, { key: "zoomInLeft", title: "左边弹入" }, { key: "zoomInRight", title: "右边弹入" }, { key: "zoomInUp", title: "向上弹入" }] },
        { key: "Zoom Exits", title: "弹出", childs: [{ key: "zoomOut", title: "中心弹出" }, { key: "zoomOutDown", title: "向下弹出" }, { key: "zoomOutLeft", title: "左边弹出" }, { key: "zoomOutRight", title: "右边弹出" }, { key: "zoomOutUp", title: "向上弹出" }] },
        { key: "Specials", title: "其他", childs: [{ key: "hinge", title: "脱钩掉落" }, { key: "jackInTheBox", title: "缩放旋入" }, { key: "rollIn", title: "风吹来" }, { key: "rollOut", title: "风吹走" }] }
    ]
    var _animationTpl = '<div class="property-group">\
    <div class="property-group-title">动画</div>\
    <div class="property-group-body prop-animation" data-animation="choose-animation">\
        <div class="column-row"  >\
        <div class="design-selector">\
        <select data-ani-prop="effect" id="choose-animation">\
        </select>\
        <div class="design-selector-value">\
            添加动画\
        </div>\
        </div>\
        <button class="el-button el-button--default el-button--small btn-play" data-ani-play="true"><i class="el-icon-caret-right" ></i><span>播放动画</span></button>\
        <button class="el-button el-button--danger el-button--small" data-ani-reset="true"><span>重置</span></button>\
        </div>\
        <div class="el-row column-row">\
            <div class="el-col el-col-12" style="padding: 0;">\
                <span style="margin-right:10px;">时长</span><div min="0.1" max="10" step="0.1" precision="1" change="durationChange" data-ani-prop="duration"></div>\
            </div>\
            <div class="el-col el-col-12">\
                <span style="margin-right:10px;">延时</span><div min="0" max="10" step="0.1" precision="1" change="delayChange" data-ani-prop="delay"></div>\
            </div>\
        </div>\
        <div class="el-row column-row">\
            <div class="el-col el-col-12" style="padding: 0;">\
                <span style="margin-right:10px;">循环</span><select class="normal-select" data-ani-prop="iteration">\
                <option value="">1次</option>\
                <option value="2">2次</option>\
                <option value="3">3次</option>\
                <option value="4">4次</option>\
                <option value="5">5次</option>\
                <option value="6">6次</option>\
                <option value="7">7次</option>\
                <option value="8">8次</option>\
                <option value="9">9次</option>\
                <option value="10">10次</option>\
            </select>\
            </div>\
            <div class="el-col el-col-12">\
            <label role="checkbox" class="el-checkbox" style="padding-top:5px;"><span class="el-checkbox__input"><input type="checkbox" data-ani-prop="infinite" aria-hidden="true" class="el-checkbox__original" value=""/><span class="el-checkbox__inner"></span></span><span class="el-checkbox__label">循环播放</span></label>\
            </div>\
        </div>\
    </div>\
</div>';
    var $panel,
        defaultAni = {
            effect: '',
            iteration: '',
            delay: '',
            duration: ''
        },
        components = {
            duration: null,
            delay: null
        },
        animationConfig = $.extend({}, defaultAni);

    function _init(container) {
        var $container = $(container);
        if ($container.find('#choose-animation').length > 0) {
            initEvent();
            return;
        }
        // 生成动画相关html片段
        var selectTpl = ['<option value="">添加动画</option>'];
        for (let index = 0; index < effects.length; index++) {
            var group = effects[index],
                groupTpls = [];
            for (var i = 0, len = group.childs.length; i < len; i++) {
                var anim = group.childs[i];
                groupTpls.push('<option value="' + anim.key + '">' + anim.title + '</option>')
            }
            selectTpl.push('<optgroup label="' + group.title + '">' + groupTpls.join('\n') + '</optgroup>')
        }
        $container.prepend(_animationTpl);
        $container.find('#choose-animation').append(selectTpl.join('\n'));

        var $duration = $container.find("div[data-ani-prop='duration']");
        components.duration = Kdo.components.inputNumber.init($duration, { value: 1 });
        $duration.on('durationChange', (event, data) => {
            animationConfig.duration = data.value;
            _setAnimation(animationConfig);
            _play();
        });

        var $delay = $container.find("div[data-ani-prop='delay']");
        components.delay = Kdo.components.inputNumber.init($delay, { value: 0 });
        $delay.on('delayChange', (event, data) => {
            animationConfig.delay = data.value;
            _setAnimation(animationConfig);
            _play();
        });

        return initEvent();
        function initEvent() {
            $container.find('.design-selector select').off('change.animation').on('change.animation', function () {
                var $el = $(this),
                    value = $el.val(),
                    title = "添加动画";
                for (var i = 0; i < effects.length; i++) {
                    var groupItems = effects[i].childs;
                    for (var j = 0; j < groupItems.length; j++) {
                        if (groupItems[j].key == value) {
                            title = groupItems[j].title;
                        }
                    }
                }
                $el.next('.design-selector-value').html(title);
            });
            $panel = $container.find('[data-animation="choose-animation"]');
            $panel.off('change.animation', '[data-ani-prop]').on('change.animation', '[data-ani-prop]', function () {
                var $el = $(this),
                    prop = $el.data('aniProp');
                    var boxs = Kdo.box.utils.getCurrentBox();
                    boxs.$focusSingleBox.each(function (idx, el) {
                        var $el = $(el).children("div[id^='control_']");
                        $el.removeClass('animated ' + animationConfig.effect);
                    })
                switch (prop) {
                    case "infinite":
                        if ($el.is(':checked')) {
                            $panel.find('[data-ani-prop="iteration"]').val('').prop('disabled', true);
                            animationConfig.iteration = 'infinite';
                        } else {
                            animationConfig.iteration = '';
                            $panel.find('[data-ani-prop="iteration"]').prop('disabled', false);
                        }
                        break;
                    case "iteration":
                    case "effect":
                        animationConfig[prop] = $el.val();
                        break;
                }
                _setAnimation(animationConfig);
                _play();
            }).off('click.animation', '[data-ani-reset],[data-ani-play]').on('click.animation', '[data-ani-reset],[data-ani-play]', function () {
                var $this = $(this);
                if (!!$this.data('aniReset')) {
                    $panel.find('[data-ani-prop]').each(function (idx, el) {
                        switch ($(el).attr("data-ani-prop")) {
                            case "iteration":
                                $(el).val("");
                                break;
                            case "duration":
                                components.duration.setValue(1);
                                break;
                            case "delay":
                                components.delay.setValue(0);
                                break;
                        }
                    });
                    $panel.find('[data-ani-prop="iteration"]').prop('disabled', false);
                    $panel.find('[data-ani-prop="infinite"]').prop('checked', false);

                    $panel.find('[data-ani-prop="effect"]').val("");
                    $panel.find("[data-ani-prop='effect']>option[value='']").attr("selected", true);
                    $panel.find('[data-ani-prop="effect"]+.design-selector-value').html('添加动画');
                    animationConfig = $.extend({}, defaultAni);
                    //先停止动画在清除动画属性
                    _cleanAnimation();
                    _setAnimation(animationConfig);
                } else if (!!$this.data('aniPlay')) {
                    _play();
                }
            })
        }
    }

    function _loadData(controlConfig, isDestroy) {
        // var ctrls = Kdo.data.controls.getFocus();
        // for (var i = 0, len = ctrls.length; i < len; i++) {
        //     var ctrl = ctrls[i],
        var animation = (!!controlConfig && controlConfig.animation) || $.extend({}, defaultAni);
        for (var key in animation) {
            var val = animation[key];
            switch (key) {
                case "iteration":
                    if (val === 'infinite') {
                        $panel.find('[data-ani-prop="iteration"]').val('').prop('disabled', true);
                        $panel.find('[data-ani-prop="infinite"]').prop('checked', true);
                    } else {
                        $panel.find('[data-ani-prop="iteration"]').val(val).prop('disabled', false);
                        $panel.find('[data-ani-prop="infinite"]').prop('checked', false);
                    }
                    break;
                case "infinite":
                    break;
                case "duration":
                    components.duration.setValue(val || 1);
                    break;
                case "delay":
                    components.delay.setValue(val || 0);
                    break;
            }
        }
        if (!!isDestroy) {
            _cleanAnimation();
            $panel.closest('.property-group').hide();
        } else {
            var title = "添加动画";
            for (var i = 0; i < effects.length; i++) {
                var groupItems = effects[i].childs;
                for (var j = 0; j < groupItems.length; j++) {
                    if (groupItems[j].key == animation['effect']) {
                        title = groupItems[j].title;
                    }
                }
            }
            $panel.find('[data-ani-prop="effect"]').val(animation['effect'] || "");
            $panel.find("[data-ani-prop='effect']>option[value='" + (animation['effect'] || "") + "']").attr("selected", true);
            $panel.find('[data-ani-prop="effect"]+.design-selector-value').html(title);
            $panel.closest('.property-group').show();
            animationConfig = animation;
        }
        // }
    }
    function _setAnimation(animation) {
        if (!animation) {
            animation = null;
        }
        var ctrls = Kdo.data.controls.getFocus();
        for (var i = 0, len = ctrls.length; i < len; i++) {
            var originalVal = ctrls[i].animation;
            if (!!animation) {
                ctrls[i].animation = $.extend(true, {}, originalVal || defaultAni, {
                    delay: animation.delay ? parseFloat(animation.delay) + "s" : null,
                    duration: animation.duration ? parseFloat(animation.duration) + "s" : null,
                    iteration: animation.iteration || null,
                    effect: animation.effect || null
                });
                console.log("set animation: ", ctrls[i].animation);
            }
            else {
                ctrls[i].animation = null;
            }
            Kdo.data.controls.set(ctrls[i]);
        }
    }
    function _destroy() {
        _loadData(null, true);
    }
    function _play() {
        // 先停止动画再
        _cleanAnimation();
        if (!!animationConfig && !!animationConfig.effect) {
            var boxs = Kdo.box.utils.getCurrentBox();
            var props = {};
            props['animation-delay'] = parseFloat(animationConfig.delay || 0) + "s";
            props['-webkit-animation-delay'] = parseFloat(animationConfig.delay || 0) + "s";
            props['animation-duration'] = parseFloat(animationConfig.duration || 1) + "s";
            props['-webkit-animation-duration'] = parseFloat(animationConfig.duration || 1) + "s";
            props['animation-iteration-count'] = animationConfig.iteration;
            props['-webkit-animation-iteration-count'] = animationConfig.iteration;
            var originalEffect = animationConfig.originalEffect || '';
            animationConfig.originalEffect = animationConfig.effect;
            boxs.$focusSingleBox.each(function (idx, el) {
                var $el = $(el).children("div[id^='control_']");
                $el.css(props).addClass('animated ' + animationConfig.effect).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                    // 动画结束后移除动画
                    _cleanAnimation($el);
                });
            })
        }
    }
    function _cleanAnimation($el) {
        if (!!$el) {
            return clean($el);
        }
        var boxs = Kdo.box.utils.getCurrentBox();
        boxs.$focusSingleBox.each(function (idx, el) {
            var $el = $(el);
            clean($el);
        });
        function clean($el) {
            $el.removeClass('animated ani ' + animationConfig.effect + ' ' + animationConfig.originalEffect || '').css({
                'animation-duration': '',
                '-webkit-animation-duration': '',
                'animation-delay': '',
                '-webkit-animation-delay': '',
                'animation-iteration-count': '',
                '-webkit-animation-iteration-count': ''
            });
        }
    }
    $.extend(true, window.Kdo, {
        animation: {
            init: _init,
            loadData: _loadData,
            setAnimation: _setAnimation,
            play: _play,
            destroy: _destroy
        }
    });
});