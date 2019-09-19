(function ($element) {
    $(function () {
        var _$audio = $element.find("#audio"),
            $icon = $element.find("div[icon]"),
            icons = {
                "play": "audio-play",
                "paused": "audio-pause"
            };

        var hasSource = function () {
            return (/htt(p|ps):\/\/.+\.(mp3|wma|cda|wav|ra|mid|ogg|ape|flac|acc)/g.test(_$audio[0].src))
        }

        var _toggleMedia = function (event) {
            if (!hasSource()) return;
            _$audio[0].paused ? _$audio[0].play() : _$audio[0].pause();
            event.preventDefault();
        }

        //播放图标
        var _playMedia_icon = function () {
            $icon.attr("icon", icons["play"]);
            $icon.removeClass(icons["play"]).addClass(icons["paused"]);
        }
        //暂停图标
        var _pauseMedia_icon = function () {
            $icon.attr("icon", icons["paused"]);
            $icon.removeClass(icons["paused"]).addClass(icons["play"]);
        }
        _$audio[0].addEventListener("play", _playMedia_icon);
        _$audio[0].addEventListener("pause", _pauseMedia_icon);

        $element.find(".aduio-icon").unbind("click tap").bind("click tap", _toggleMedia);

        // 监听隐藏事件
        (function () {
            // 各种浏览器兼容
            var hidden, state, visibilityChange;
            if (typeof document.hidden !== "undefined") {
                hidden = "hidden";
                visibilityChange = "visibilitychange";
                state = "visibilityState";
            } else if (typeof document.mozHidden !== "undefined") {
                hidden = "mozHidden";
                visibilityChange = "mozvisibilitychange";
                state = "mozVisibilityState";
            } else if (typeof document.msHidden !== "undefined") {
                hidden = "msHidden";
                visibilityChange = "msvisibilitychange";
                state = "msVisibilityState";
            } else if (typeof document.webkitHidden !== "undefined") {
                hidden = "webkitHidden";
                visibilityChange = "webkitvisibilitychange";
                state = "webkitVisibilityState";
            }
            var autoPause = false;
            // 添加监听器，在title里显示状态变化
            document.addEventListener(visibilityChange, function () {
                if (document[hidden] && !_$audio[0].paused) {
                    _$audio[0].pause();
                    autoPause = true;
                } else if (autoPause) {
                    _$audio[0].play();
                    autoPause = false;
                }
            }, false);
            if (window.Utils && window.Utils.on) {
                var autoPauseForGame = false;
                window.Utils.on('game_enter', function (evt, data) {
                    autoPauseForGame = !_$audio[0].paused;
                    _$audio[0].pause();
                });
                // 注册插件退出事件
                window.Utils.on('game_quit', function (evt, data) {
                    if (autoPauseForGame) {
                        _$audio[0].play();
                    }
                });
            }
        })();
        if (_$audio.data("autoplay")) {
            setTimeout(function () {
                try { _$audio[0].play(); } catch (err) { console.error(err) };
                if (window.wx) {
                    // 兼容微信自动播放
                    wx.config({});
                    wx.ready(function () { _$audio[0].play(); });
                }
            }, 500);
        }
    });
})($("div[id='_panelId_']"));