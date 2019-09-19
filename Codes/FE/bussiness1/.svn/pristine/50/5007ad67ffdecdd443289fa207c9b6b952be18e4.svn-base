(function (win, $element) {
    var Utils = win.Utils;
    if (!!Utils && !!Utils.on) {
        // 初始iframe对象
        var controlId = '_panelId_',
            relationId = win.lanh.kid || '',
            themePath = $element.children("div").data('themePath'),
            iframeTpl = $element.find("script[type='javascript/html']").html(),
            viewPort = Utils.getViewport();

        // 重置窗口大小
        setTimeout(function () {
            $("body").append($("<div>").attr("id", "statWindowHeight").css({ "bottom": "0", "position": "fixed" }));
            viewPort['height'] = document.getElementById("statWindowHeight").offsetTop;
            $element.closest('.page-content').css(viewPort);
        }, 300);
        $element.parents(".swiper-slide").css({ "height": "100%", "min-height": "100%" });
        // 插件配置信息
        Utils.pluginConfig['_panelId_'] = (function () {
            return __pluginData__;
        })();
        Utils.getToken(function (token) {
            iframeTpl = iframeTpl.replace('about:blank', themePath + '?relationId=' + relationId + '&controlId=' + controlId + '&sessionId=' + token.session_id);
            pluginInit();
        })

        // 注册插件退出事件
        Utils.on('game_quit', function (evt, data) {
            // 处理抽奖的后续逻辑
            $element.find("iframe[class='frame-container']").remove();
            $element.find('.cover').show();
        });
        // 游戏正常结束事件
        Utils.on('game_over', function (evt, data) {
            // 处理抽奖的后续逻辑
            Utils.emit('draw_prize', {
                type: 'draw_prize',
                relationId: relationId,
                controlId: controlId,
                data: data
            });
        });
        // 抽奖正常结束事件
        Utils.on('draw_over', function (evt, data) {
            Utils.emit('draw_end', {
                controlId: controlId,
                data: data.prize
            });
        });
        function pluginInit() {
            // 启动插件，开始游戏等
            $element.find('.cover').on('click', function () {
                var $el = $(this);
                if (!Utils.isSupport()) return false;
                start();
                function start() {
                    $el.hide();
                    var $iframe = $(iframeTpl);
                    // 游戏初始化完成事件
                    Utils.on('init_over', function (evt, data) {
                        Utils.emit('game_init', {
                            contentWindow: $iframe[0].contentWindow,
                            data: {
                                relationId: relationId,
                                controlId: controlId,
                                gameTime: Utils.pluginConfig[controlId].controlData.gameTime
                            }
                        });
                        Utils.emit("game_enter", {});
                        $element.find('.game-quit').show();
                    });
                    $iframe.insertBefore($el);
                }
            });
        }
    }
})(window, $("div[id='_panelId_']"));