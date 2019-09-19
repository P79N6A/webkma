var httpConfig = require("../../src/config/http");
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
    //缓存数据对象
    var _cache = {
        dataMenus: null,
        pageTemplate: null,
        flipAnimation: {},
        singlePageTemplate:
            '<div class="page-content swiper-wrapper" style?="{{pageFullStyle}}">\
                    <div class="swiper-slide" style?="{{pageStyle}}">\
                        {{body_controls}} {{body_controls_stretch}}\
                    </div>\
            </div>\
            <div class="swiper-scrollbar"></div>',
        multiplePageTemplate:
            '<div class="swiper-slide" data-page="{{pageIndex}}">\
                <div class="swiper-container" style?="{{pageFullStyle}}">\
                    <div class="page-content swiper-wrapper" style?="{{pageStyle}}">\
                        <div class="swiper-slide">\
                            {{body_controls}} {{body_controls_stretch}}\
                        </div>\
                    </div>\
                    <div class="swiper-scrollbar"></div>\
                </div>\
            </div>',
        multiplePageWapper: '<div class="swiper-wrapper">{{multiplePageWapper}}</div><div id="flip-arrow" class="arrow" ></div>'
    }
    // 小游戏测试备份
    /*<div class="swiper-slide" data-page="2">\
        <div class="swiper-container">\
            <div class="page-content swiper-wrapper" style="width:100%;height:100vh">\
                <div class="swiper-slide">\
                <!-- <iframe src="http://192.168.1.15:10000/fishingjoy/index.html" style="border:none;width:100%;height:100%;"></iframe> -->\
                <canvas id="GameCanvas" oncontextmenu="event.preventDefault()" tabindex="0"></canvas>\
                <div id="splash">\
                  <div class="progress-bar stripes">\
                    <span style="width: 0%"></span>\
                  </div>\
                </div>\
                <script src="/public/games/compatibility/babel-polyfill-master/browser-polyfill.js" charset="utf-8"></script>\
                <script src="/public/games/compatibility/main.js" charset="utf-8"></script>\
                <script src="/public/games/fishingjoy/src/settings.6c28f.js" charset="utf-8"></script>\
                <script src="/public/games/fishingjoy/main.c707d.js" charset="utf-8"></script>\
                <script type="text/javascript">\
                  (function () {\
                    if (typeof VConsole !== "undefined") {\
                        window.vConsole = new VConsole();\
                    }\
                    var splash = document.getElementById("splash");\
                    splash.style.display = "block";\
                    var cocos2d = document.createElement("script");\
                    cocos2d.async = true;\
                    cocos2d.src = window._CCSettings.debug ? "/public/games/fishingjoy/cocos2d-js.js" : "/public/games/fishingjoy/cocos2d-js-min.4ab69.js";\
                    var engineLoaded = function () {\
                      document.body.removeChild(cocos2d);\
                      cocos2d.removeEventListener("load", engineLoaded, false);\
                      window.boot();\
                    };\
                    cocos2d.addEventListener("load", engineLoaded, false);\
                    document.body.appendChild(cocos2d);\
                  })();\
                </script>\
                </div>\
            </div>\
            <!-- <div class="swiper-scrollbar"></div> -->\
        </div>\
    </div>
    */
    //获取页面模板并预加载菜单数据
    var _getDataPage = function (flip) {
        flip = flip || 'singlePage'
        var tasks = [
            new Promise(function (reslove, reject) {
                if (!_cache.pageTemplate) {
                    var _templateUrl = "/static/h5-page-master.html";
                    $.get(_templateUrl + "?buts=" + Date.now(), function (result) {
                        _cache.pageTemplate = result;
                        reslove({ pageTemplate: _cache.pageTemplate });
                    }).fail(function (err) {
                        reject(err);
                    });
                } else {
                    reslove({ pageTemplate: _cache.pageTemplate });
                }
            }),
            new Promise(function (reslove, reject) {
                if (!_cache.flipAnimation[flip]) {
                    var _templateUrl = "/static/flipAnimation/" + flip + ".js";
                    $.get(_templateUrl + "?buts=" + Date.now(), function (result) {
                        _cache.flipAnimation[flip] = result;
                        reslove({ flipAnimation: result });
                    }, 'text').fail(function (err) {
                        reject(err);
                    });
                } else {
                    reslove({ flipAnimation: _cache.flipAnimation[flip] });
                }
            }),
        ];
        return Promise.all(tasks);
    }

    //生成页面文件内容
    var _page = function (pageFileNumber) {
        /*
            1. 页面模板（承载模块的模板）
            2. 生成模块加载于此模板中
            3. 计算rem (mobile流程)
            3. 输出页面
        */
        var isMutilePage = Kdo.data.pages.length > 1;
        return _getDataPage(!!isMutilePage ? 'multiplePage' : 'singlePage').then(function (asyncResult) {
            var result = asyncResult[0],
                flipAnimation = asyncResult[1].flipAnimation;
            var fileResult = [],
                siteConfig = Kdo.data.config.site.get(),
                platform = "mobile";
            fileResult = Kdo.data.pages.map(function (p) {
                return { "number": p.number, "context": "" };
            });
            //执行编译模板页面，并整体执行数据返回。
            var tasks = [];
            fileResult.forEach(function (file) {
                tasks.push(new Promise(function (reslove, reject) {
                    _buildPageTemplate(file, !!isMutilePage ? _cache.multiplePageTemplate : _cache.singlePageTemplate, function (err, ret) {
                        if (!!err) {
                            return reject(err);
                        } else {
                            reslove(ret);
                        }
                    });
                }))
            });
            return Promise.all(tasks)
                .then(function (results) {
                    var _placeHolders = {}; //缓存每个页面的code对象，用于替换完guid后还原。
                    var jsJoin = [], cssJoin = [], dataConfig = [], htmlJoin = [];
                    //抓取每个页面的js和css,合并到对应容器中
                    _.each(fileResult, function (file, idx) {
                        //提取非HTML代码并设置占位符
                        var _self_placeHolders = _placeHolders[file.number] = {
                            dataConfig: file.context.match(/<!--\s*dataConfig[\s\S]*?-->/gi),
                            css: file.context.match(/<style(([\s\S])*?)<\/style>/gi) || [],
                            js: _.filter(file.context.match(/<script(([\s\S])*?)<\/script>/gi) || [], function (item) { return !/^<script[\s\S]*?src=[\s\S]*?>+?/i.test(item) }),
                            cssJoin: [],
                            jsJoin: []
                        };
                        //合并styles标签和script中的内容（某些浏览器解析力不够，需要合并优化）
                        _.each(_self_placeHolders.css, function (css) {
                            // _self_placeHolders.cssJoin.push(css.replace(/<style[\s\S]*?>/, "").replace(/<\/style>/, ""));
                            cssJoin.push(css.replace(/<style[\s\S]*?>/, "").replace(/<\/style>/, ""));
                            file.context = file.context.replace(css, "");
                        });
                        _.each(_self_placeHolders.js, function (js) {
                            if (!!js.match(/type=\"text\/javascript\"/)) {//排除svg中的模板代码 wang 
                                // _self_placeHolders.jsJoin.push(js.replace(/<script[\s\S]*?>/, "").replace(/<\/script>/, ""));
                                jsJoin.push(js.replace(/<script[\s\S]*?>/, "").replace(/<\/script>/, ""));
                                file.context = file.context.replace(js, "");
                            }
                        });
                        _.each(_self_placeHolders.dataConfig, function (cfg) {
                            dataConfig.push(cfg);
                            file.context = file.context.replace(cfg, "")
                        });
                        file.context = file.context.replace('{{pageIndex}}', idx)
                        htmlJoin.push(file.context);
                    });

                    var content = htmlJoin.join('\n');
                    if (!!isMutilePage) {
                        content = _cache.multiplePageWapper.replace('{{multiplePageWapper}}', content);
                    }
                    var _pageTemplate = result.pageTemplate;
                    _pageTemplate = _pageTemplate.replace('{{pageContent}}', content);
                    _pageTemplate = _pageTemplate.replace('{{dataConfig}}', dataConfig.join('\n'));
                    _pageTemplate = _pageTemplate.replace("{{css_join}}", "<style>" + cssJoin.join("\n") + "</style>");
                    _pageTemplate = _pageTemplate.replace("{{js_join}}", "<script type=\"text/javascript\">" + flipAnimation + (';\n') + jsJoin.join("\n") + "</script>");

                    // 组装逻辑多页到物理页面中
                    //替换版权信息 提升到上层进行处理
                    _pageTemplate = _pageTemplate.replace("{{log_img}}", /*lanh.imageHost + */'public/images/right_logo.png');
                    _pageTemplate = _pageTemplate.replace("{{case_url}}", 'http://' + window.location.host + '/#/case');
                    //替换main_id到模板中(模板唯一标示) 需要提取到上层进行处理
                    _pageTemplate = _pageTemplate.replace(/{{main_id}}/g, $("#main_id").val());

                    return _pageTemplate;
                })
                .then(function (pageTemplate) {
                    // 嵌入fontface字体文件引用
                    return new Promise(function (resolve, reject) {
                        let textConvert = document.createElement("div");
                        $.ajax({
                            url: httpConfig.default.msFontHost + "generate/simple_file_path",
                            method: "POST",
                            data: {
                                "fonts": Kdo.data.controls.all().filter(function (item) { return item.struct === "text" }).map(function (item) {
                                    textConvert.innerHTML = item.data.context;
                                    return {
                                        "name": item.inner.style["font-family"],
                                        "content": textConvert.innerText
                                    }
                                })
                            },
                            success: function (response, status, readyState) {
                                resolve(pageTemplate.replace("{{css_simple_fontface_link}}", response.code != 200 ? "" :
                                    "<style type='text/css'>" + response.data.map(function (link) {
                                        return "@font-face { font-family: '" + link.name.substr(0, link.name.indexOf("_")) + "'; src: url('" + link.link + "?t=" + Date.now() + "') format('truetype'); }";
                                    }).join("\r\n") + "</style>"
                                ));
                            },
                            error: function () {
                                console.error("文字模块字体提取失败");
                                resolve(pageTemplate.replace("{{css_simple_fontface_link}}", ""));
                            }
                        });
                    });
                })
                .catch(function (err) {
                    console.error(err);
                    return err;
                });

            //编译模板页面的函数（编译模块和样式，不包含替换Guid和数据）
            function _buildPageTemplate(file, pageTpl, cb) {
                var pageControls,
                    pageConfig,
                    _pageTemplate = pageTpl; //Kdo.utils.copy(result.pageTemplate);
                if (!file.number) {
                    //file.number为空则获取当前页面的数据
                    pageConfig = Kdo.data.config.page.get();
                    pageControls = Kdo.data.controls.all();
                } else {
                    //file.number不为空则获取对应页面的数据
                    var pageData = $.grep(Kdo.data.pages, function (item) { return item.number == file.number })[0];
                    pageConfig = _.isString(pageData.config) ? JSON.parse(pageData.config) : (pageData.config || {});
                    pageControls = _.isString(pageData.data) ? JSON.parse(pageData.data) : (pageData.data || []);
                    //如果不是活动详情页面，则关联site级模块（全局、共享）
                    if (pageConfig.pageType != "activitydetail") {
                        var _siteControls = Kdo.utils.copy(Kdo.data.site.controls);
                        //如果页面不支持共享模块，则过滤共享模块，只保留全局模块。
                        if (pageConfig.supportShareControls == "false") {
                            _siteControls = _.filter(_siteControls, function (control) { return control.share != true });
                        }
                        pageControls = pageControls.concat(_siteControls);
                    }
                }

                //通栏与非通栏模块分开build
                _pageTemplate = _pageTemplate.replace("{{body_controls}}", Kdo.page.create.build(_.filter(pageControls, function (item) { return !item.stretch }), pageConfig, platform).join(""));
                _pageTemplate = _pageTemplate.replace("{{body_controls_stretch}}", Kdo.page.create.build(_.filter(pageControls, function (item) { return !!item.stretch }), pageConfig, platform).join(""));

                //设置页面样式
                var _buildStyle = function (style) {
                    var array = [],
                        radix = 32; //转换rem的基数值，采用flexible方式。。
                    for (var key in style) {
                        // 宽度固定位flexible的10rem
                        if (key != "width") {
                            if (platform == "mobile" && /^-?[0-9]+([.][0-9]+){0,1}px$/.test(style[key]) || _.indexOf(["width", "height", "left", "top"], key) != -1) {
                                array.push(key + ":" + (parseFloat(style[key]) / radix) + "rem");
                            } else {
                                if (key == "background-image") {
                                    array.push(key + ":" + "url(" + style[key] + ")");
                                } else {
                                    array.push(key + ":" + style[key]);
                                }
                            }
                        }
                    }
                    return array;
                }
                _pageTemplate = _pageTemplate.replace("{{pageFullStyle}}", pageConfig.style["background-color"] ? "background-color:" + pageConfig.style["background-color"] : "");
                _pageTemplate = _pageTemplate.replace("{{pageStyle}}", _buildStyle(pageConfig.style).join(";"));
                _pageTemplate = _pageTemplate.replace("{{headerStyle}}", !pageConfig.header ? "" : _buildStyle($.extend(pageConfig.header.style, { height: pageConfig.style.height })).join(";"));
                _pageTemplate = _pageTemplate.replace(/(\s+style\?\s*=)/ig, ' style=');

                file.context = _pageTemplate;
                cb(null);
            }
        });

    }

    $.extend(true, window.Kdo, {
        page: {
            release: {
                page: _page
            }
        }
    });
});