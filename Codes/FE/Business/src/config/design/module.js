let moduleConfig = {
    "controls": [
        {
            "key": "controls_text",
            "name": "文字",
            "childs": [
                {
                    "struct": "text",
                    "key": "controls_text_content",
                    "name": "文本",
                    "data": {
                        "context": "双击此处编辑文本"
                    }
                }
            ]
        },
        {
            "key": "controls_image",
            "name": "图片",
            "childs": [
            ]
        },
        {
            "key": "controls_line",
            "name": "线条",
            "childs": [
            ]
        },
        {
            "key": "controls_shape",
            "name": "形状",
            "childs": [
            ]
        },
        {
            "key": "controls_icon",
            "name": "图标",
            "childs": [
            ]
        },
        {
            "key": "controls_commerce",
            "name": "电商",
            "childs": [
            ]
        },
        {
            "key": "controls_festival",
            "name": "节日",
            "childs": [
            ]
        },
        {
            "key": "controls_adsorbent",
            "name": "吸附框",
            "childs": [
                {
                    "struct": "adsorb",
                    "key": "controls_adsorb_001",
                    "name": "吸附框",
                    "style": {
                        "width": "150px",
                        "height": "87px"
                    },
                    "data": {
                        "view": "../assets/images/adsorb_placeholder.svg",
                        "left": "0px",
                        "top": "0px",
                        "width": "150px",
                        "height": "87px",
                        "originalWidth": "100px",
                        "originalHeight": "58px"
                    }
                }
            ]
        },
        {
            "key": "controls_rectangle",
            "name": "常规",
            "childs": [
                {
                    "struct": "div",
                    "key": "controls_rectangle_square",
                    "name": "正方形",
                    "data": {
                        "_chooseColors": ["#3898EC", "#000000"],
                        "borderStyle": "solid"
                    },
                    "style": {
                        "width": "80px",
                        "height": "80px"
                    }
                },
                {
                    "struct": "div",
                    "key": "controls_rectangle_circle",
                    "name": "圆形",
                    "data": {
                        "_chooseColors": ["#3898EC", "#000000"],
                        "borderStyle": "solid",
                        "shapeStyle": "circle"
                    },
                    "style": {
                        "width": "80px",
                        "height": "80px"
                    }
                },
                {
                    "struct": "line",
                    "key": "controls_rectangle_horizontal",
                    "name": "横线",
                    "defaultTemplate": {
                        "html": "/static/controls/line/line_horizontal_tpl.html"
                    },
                    "style": {
                        "width": "200px",
                        "height": "6px"
                    },
                    "data": {
                        "borderStyle": "solid",
                        "borderSize": 1
                    },
                    "resizeHandles": "w,e"
                },
                {
                    "struct": "line",
                    "key": "controls_rectangle_vertical",
                    "name": "竖线",
                    "defaultTemplate": {
                        "html": "/static/controls/line/line_vertical_tpl.html"
                    },
                    "style": {
                        "width": "6px",
                        "height": "200px"
                    },
                    "data": {
                        "borderStyle": "solid",
                        "borderSize": 1
                    },
                    "resizeHandles": "s,n"
                }
            ]
        }
    ],
    "background": [
        {
            "key": "background",
            "name": "背景",
            "childs": [
            ]
        },
        {
            "key": "background_special",
            "name": "专题背景",
            "childs": [
            ]
        },
        {
            "key": "background_head",
            "name": "头部背景",
            "childs": []
        }
    ],
    "group": [
        {
            "key": "group_theme",
            "name": "主题",
            "childs": [
            ]
        },
        {
            "key": "group_title",
            "name": "标题",
            "childs": [
            ]
        },
        {
            "key": "group_content",
            "name": "内容",
            "childs": [
            ]
        },
        {
            "key": "group_button",
            "name": "按钮",
            "childs": [
            ]
        }
    ],
    "plugin": [
        {
            "key": "plugin_forms",
            "name": "表单",
            "childs": [
                {
                    "key": "plugin_form_custom",
                    "name": "表单",
                    "action": "control",
                    "coverPicture": "assets/images/plugin/cover_simple_form.png",
                    "defaultTemplate": {
                        "html": "/static/controls/plugin/form/form.tpl.html",
                        "css": "/static/controls/plugin/form/form.css",
                        "js": "/static/controls/plugin/form/form.js"
                    },
                    "resizeHandles": "w,e",
                    "style": {
                        "width": "320px",
                        "height": "auto"
                    },
                    "data": {
                        "fontColor": "#ffffff",
                        "backColor": "#3898EC",
                        "submit": {
                            "text": "提交",
                            "feedback": "感谢您的填写"
                        },
                        "rows": [
                            {
                                "type": "text",
                                "category": "name",
                                "name": "姓名",
                                "hover": false,
                                "dataKey": "rows0"
                            },
                            {
                                "type": "text",
                                "category": "phone",
                                "name": "手机",
                                "hover": false,
                                "dataKey": "rows1"
                            }
                        ]
                    },
                    "addTools": ["setting", "update"],
                    "setting": {
                        "settingTitle": "输入设置",
                        "settingTemplate": "formSetting",
                        "settingModalSize": "sm"
                    },
                    "singleGroup": "activity",
                    "single": false,
                    "chooseStyleTemplateUrl": "",
                    "pluginType": "form"
                }
            ]
        },
        {
            "key": "plugin_media",
            "name": "音频视频",
            "childs": [
                {
                    "key": "plugin_media_audio",
                    "name": "音乐",
                    "action": "control",
                    "coverPicture": "assets/images/plugin/cover_audio.png",
                    "defaultTemplate": {
                        "html": "/static/controls/plugin/audio/audio.tpl.html",
                        "css": "/static/controls/plugin/audio/audio.css",
                        "js": "/static/controls/plugin/audio/audio.js"
                    },
                    "style": {
                        "width": "1.25rem",
                        "height": "1.25rem"
                    },
                    "data": {
                        "icon": "audio-play",
                        "src": "",
                        "title": "",
                        "autoplay": "autoplay",
                        "loop": "true"
                    },
                    "addTools": ["setting", "update"],
                    "setting": {
                        "settingTitle": "输入设置",
                        "settingTemplate": "audioSetting",
                        "settingModalSize": "sm"
                    },
                    "single": true,
                    "resizeHandles": "none"
                },
                {
                    "key": "plugin_media_video",
                    "name": "视频",
                    "action": "control",
                    "coverPicture": "assets/images/plugin/cover_video.png",
                    "defaultTemplate": {
                        "html": "/static/controls/pc/plugin/video/video.tpl.html",
                        "css": "/static/controls/pc/plugin/video/video.css",
                        "js": "/static/controls/pc/plugin/video/video.js"
                    },
                    "style": {
                        "width": "320px",
                        "height": "180px"
                    },
                    "data": {
                        "_html": ""
                    },
                    "addTools": ["setting", "update"],
                    "setting": {
                        "settingTitle": "输入设置",
                        "settingTemplate": "<video-setting></video-setting>",
                        "settingModalSize": "sm"
                    }
                }
            ]
        },
        {
            "key": "plugin_dynamic",
            "name": "动态获取数据",
            "childs": [
                {
                    "key": "plugin_shop",
                    "name": "商品",
                    "action": "control",
                    "coverPicture": "assets/images/plugin/cover_shop.png",
                    "defaultTemplate": {
                        "html": "/controls/pc/plugin/shop/shop_tpl.html",
                        "css": "/controls/pc/plugin/shop/shop.css",
                        "js": "/controls/pc/plugin/shop/shop.js"
                    },
                    "resizeHandles": "w,e",
                    "style": {
                        "width": "320px",
                        "height": "auto"
                    },
                    "data": {
                        "style": 1,
                        "goodsUuid": ["default", "default", "default"]
                    },
                    "addTools": ["setting", "style-setting", "update"],
                    "styleSetting": {
                        "settingTitle": "样式设置",
                        "settingTemplate": "<shop-style-setting></shop-style-setting>"
                    },
                    "setting": {
                        "settingTitle": "设置",
                        "settingTemplate": "<shop-setting></shop-setting>"
                    },
                    "pluginType": "goods"
                }
            ]
        },
        {
            "key": "plugin_activity",
            "name": "活动",
            "childs": [
                {
                    "key": "plugin_activity_gagaka",
                    "name": "刮刮卡",
                    "action": "control",
                    "coverPicture": "assets/images/plugin/cover_guaguaka.png",
                    "pluginType": "draw",
                    "single": true,
                    "lock":true,
                    "defaultTemplate": {
                        "html": "/static/controls/game/default/tpl.html",
                        "css": "/static/controls/game/default/tpl.css",
                        "js": "/static/controls/game/default/tpl.js"
                    },
                    "style": {
                        "type": "mobile",
                        "width": "320px",
                        "height": "100%"
                    },
                    "data": {
                        "theme": "default",//主题
                        "score": "",  //抽奖分数线
                        "intervalDay": "1", //抽奖间隔
                        "intervalDrawTime": "",  //抽奖次数
                        "actStartTime": "",  //活动开始时间
                        "actEndTime": "",  //活动结束时间
                        "actTime": [],
                        "prizes": [], 
                        "controlData": {//保存模块配置信息
                            "fromSetting":[//表单配置
                                {
                                    "type": "text",
                                    "category": "name",
                                    "name": "姓名",
                                    "value": ""
                                },
                                {
                                    "type": "text",
                                    "category": "phone",
                                    "name": "手机",
                                    "value": ""
                                }
                            ],
                            "gameTime": "",  //游戏时长
                            "drawStyle": "redEnvelope",  //抽奖形式   redEnvelope--红包   golden--砸金蛋    draw--抽签
                            "qrcode": {
                                "url": ""
                            }, //二维码
                            "rule": ""  //活动规则
                        } 
                    },
                    "addTools": ["setting"],
                    "setting": {
                        "settingTitle": "游戏设置",
                        "settingTemplate": "gameSetting",
                        "settingModalSize": "sm"
                    },
                    "styleSetting":{
                        "settingTitle": "主题设置",
                    }
                },
                {
                    "key": "plugin_activity_jiugongge",
                    "name": "九宫格",
                    "action": "control",
                    "coverPicture": "assets/images/plugin/cover_scratchable.png",
                    "pluginType": "draw",
                    "single": true,
                    "lock":true,
                    "defaultTemplate": {
                        "html": "/static/controls/game/default/tpl.html",
                        "css": "/static/controls/game/default/tpl.css",
                        "js": "/static/controls/game/default/tpl.js"
                    },
                    "style": {
                        "type": "mobile",
                        "width": "320px",
                        "height": "100%"
                    },
                    "data": {
                        "theme": "default",//主题
                        "score": "",  //抽奖分数线
                        "intervalDay": "1", //抽奖间隔
                        "intervalDrawTime": "",  //抽奖次数
                        "actStartTime": "",  //活动开始时间
                        "actEndTime": "",  //活动结束时间
                        "actTime": [],
                        "prizes": [], 
                        "controlData": {//保存模块配置信息
                            "fromSetting":[//表单配置
                                {
                                    "type": "text",
                                    "category": "name",
                                    "name": "姓名",
                                    "value": ""
                                },
                                {
                                    "type": "text",
                                    "category": "phone",
                                    "name": "手机",
                                    "value": ""
                                }
                            ],
                            "gameTime": "",  //游戏时长
                            "drawStyle": "redEnvelope",  //抽奖形式   redEnvelope--红包   golden--砸金蛋    draw--抽签
                            "qrcode": {
                                "url": ""
                            }, //二维码
                            "rule": ""  //活动规则
                        } 
                    },
                    "addTools": ["setting"],
                    "setting": {
                        "settingTitle": "游戏设置",
                        "settingTemplate": "gameSetting",
                        "settingModalSize": "sm"
                    },
                    "styleSetting":{
                        "settingTitle": "主题设置",
                    }
                },
                {
                    "key": "plugin_activity_bigwheel",
                    "name": "大转盘",
                    "action": "control",
                    "coverPicture": "assets/images/plugin/cover_dzp.png",
                    "pluginType": "draw",
                    "single": true,
                    "lock":true,
                    "defaultTemplate": {
                        "html": "/static/controls/game/default/tpl.html",
                        "css": "/static/controls/game/default/tpl.css",
                        "js": "/static/controls/game/default/tpl.js"
                    },
                    "style": {
                        "type": "mobile",
                        "width": "320px",
                        "height": "100%"
                    },
                    "data": {
                        "theme": "default",//主题
                        "score": "",  //抽奖分数线
                        "intervalDay": "1", //抽奖间隔
                        "intervalDrawTime": "",  //抽奖次数
                        "actStartTime": "",  //活动开始时间
                        "actEndTime": "",  //活动结束时间
                        "actTime": [],
                        "prizes": [], 
                        "controlData": {//保存模块配置信息
                            "fromSetting":[//表单配置
                                {
                                    "type": "text",
                                    "category": "name",
                                    "name": "姓名",
                                    "value": ""
                                },
                                {
                                    "type": "text",
                                    "category": "phone",
                                    "name": "手机",
                                    "value": ""
                                }
                            ],
                            "gameTime": "",  //游戏时长
                            "drawStyle": "redEnvelope",  //抽奖形式   redEnvelope--红包   golden--砸金蛋    draw--抽签
                            "qrcode": {
                                "url": ""
                            }, //二维码
                            "rule": ""  //活动规则
                        } 
                    },
                    "addTools": ["setting"],
                    "setting": {
                        "settingTitle": "游戏设置",
                        "settingTemplate": "gameSetting",
                        "settingModalSize": "sm"
                    },
                    "styleSetting":{
                        "settingTitle": "主题设置",
                    }
                },
                {
                    "key": "plugin_activity_goldeneggs",
                    "name": "砸金蛋",
                    "action": "control",
                    "coverPicture": "assets/images/plugin/cover_zjd.png",
                    "pluginType": "draw",
                    "single": true,
                    "lock":true,
                    "defaultTemplate": {
                        "html": "/static/controls/game/default/tpl.html",
                        "css": "/static/controls/game/default/tpl.css",
                        "js": "/static/controls/game/default/tpl.js"
                    },
                    "style": {
                        "type": "mobile",
                        "width": "320px",
                        "height": "100%"
                    },
                    "data": {
                        "theme": "default",//主题
                        "score": "",  //抽奖分数线
                        "intervalDay": "1", //抽奖间隔
                        "intervalDrawTime": "",  //抽奖次数
                        "actStartTime": "",  //活动开始时间
                        "actEndTime": "",  //活动结束时间
                        "actTime": [],
                        "prizes": [], 
                        "controlData": {//保存模块配置信息
                            "fromSetting":[//表单配置
                                {
                                    "type": "text",
                                    "category": "name",
                                    "name": "姓名",
                                    "value": ""
                                },
                                {
                                    "type": "text",
                                    "category": "phone",
                                    "name": "手机",
                                    "value": ""
                                }
                            ],
                            "gameTime": "",  //游戏时长
                            "drawStyle": "redEnvelope",  //抽奖形式   redEnvelope--红包   golden--砸金蛋    draw--抽签
                            "qrcode": {
                                "url": ""
                            }, //二维码
                            "rule": ""  //活动规则
                        } 
                    },
                    "addTools": ["setting"],
                    "setting": {
                        "settingTitle": "游戏设置",
                        "settingTemplate": "gameSetting",
                        "settingModalSize": "sm"
                    },
                    "styleSetting":{
                        "settingTitle": "主题设置",
                    }
                },
                {
                    "key": "plugin_activity_luckyeggs",
                    "name": "扭蛋机",
                    "action": "control",
                    "coverPicture": "assets/images/plugin/cover_luckyeggs.png",
                    "pluginType": "draw",
                    "single": true,
                    "lock":true,
                    "defaultTemplate": {
                        "html": "/static/controls/game/default/tpl.html",
                        "css": "/static/controls/game/default/tpl.css",
                        "js": "/static/controls/game/default/tpl.js"
                    },
                    "style": {
                        "type": "mobile",
                        "width": "320px",
                        "height": "100%"
                    },
                    "data": {
                        "theme": "default",//主题
                        "score": "",  //抽奖分数线
                        "intervalDay": "1", //抽奖间隔
                        "intervalDrawTime": "",  //抽奖次数
                        "actStartTime": "",  //活动开始时间
                        "actEndTime": "",  //活动结束时间
                        "actTime": [],
                        "prizes": [], 
                        "controlData": {//保存模块配置信息
                            "fromSetting":[//表单配置
                                {
                                    "type": "text",
                                    "category": "name",
                                    "name": "姓名",
                                    "value": ""
                                },
                                {
                                    "type": "text",
                                    "category": "phone",
                                    "name": "手机",
                                    "value": ""
                                }
                            ],
                            "gameTime": "",  //游戏时长
                            "drawStyle": "redEnvelope",  //抽奖形式   redEnvelope--红包   golden--砸金蛋    draw--抽签
                            "qrcode": {
                                "url": ""
                            }, //二维码
                            "rule": ""  //活动规则
                        } 
                    },
                    "addTools": ["setting"],
                    "setting": {
                        "settingTitle": "游戏设置",
                        "settingTemplate": "gameSetting",
                        "settingModalSize": "sm"
                    },
                    "styleSetting":{
                        "settingTitle": "主题设置",
                    }
                }


            ]
        },
        {
            "key": "plugin_app",
            "name": "应用组件",
            "childs": [
                {
                    "key": "plugin_app_map",
                    "name": "地图",
                    "action": "control",
                    "coverPicture": "assets/images/plugin/map_icon.png",
                    "defaultTemplate": {
                        "html": "/static/controls/plugin/map/third_party_map_tpl.html",
                        "css": "/static/controls/plugin/map/third_party_map.css",
                        "js": "/static/controls/plugin/map/third_party_map.js"
                    },
                    "style": {
                        "width": "320px",
                        "height": "320px"
                    },
                    "data": {
                        "zoom": 16,
                        "name": "",
                        "center": "104.061176,30.577963"
                    },
                    "addTools": ["setting"],
                    "setting": {
                        "settingTitle": "地图设置",
                        "settingTemplate": "aMapSetting",
                        "settingModalSize": "sm"
                    }
                },
                {
                    "key": "plugin_app_qrcode",
                    "name": "二维码",
                    "action": "control",
                    "coverPicture": "assets/images/plugin/cover_qrcode.png",
                    "defaultTemplate": {
                        "html": "/static/controls/plugin/qr-code/qr-code.tpl.html",
                        "css": "/static/controls/plugin/qr-code/qr-code.css",
                        "js": "/static/controls/plugin/qr-code/qr-code.js"
                    },
                    "style": {
                        "width": "176px",
                        "height": "176px"
                    },
                    "data": {
                        "qrcodeUrl": "",
                        "inputUrl": "",
                        "shooseType": "",
                        "H5Name": "",
                        "H5Url": ""
                    },
                    "aspectRatio": true,
                    "addTools": ["setting", "update"],
                    "setting": {
                        "settingTitle": "输入设置",
                        "settingTemplate": "qrcodeSetting",
                        "settingModalSize": "sm"
                    }
                },
                {
                    "key": "plugin_app_countdown",
                    "name": "倒计时",
                    "action": "control",
                    "coverPicture": "assets/images/plugin/count_down_icon.png",
                    "defaultTemplate": {
                        "html": "/controls/pc/plugin/count-down/count_down_app.html",
                        "css": "/controls/pc/plugin/count-down/count_down_app.css",
                        "js": "/controls/pc/plugin/count-down/count_down_app.js"
                    },
                    "style": {
                        "type": "mobile",
                        "width": "300px",
                        "height": "38px"
                    },
                    "data": {
                        "numColor": "#ffffff",
                        "companyColor": "#000000",
                        "bgColor": "#000000",
                        "dateTime": ""
                    },
                    "aspectRatio": true,
                    "addTools": ["setting"],
                    "setting": {
                        "settingTitle": "倒计时设置",
                        "settingTemplate": "<count-down-app-setting></count-down-app-setting>",
                        "settingModalSize": "sm"
                    }
                },
            ]
        }
    ],
    "game": [
        {
            "key": "small_game",
            "name": "小游戏",
            "childs": [
                {
                    "key": "small_game_fallingDown",
                    "name": "接红包",
                    "action": "control",
                    "coverPicture": "assets/images/game/FallingDown.png",
                    "single": true,
                    "pluginType":"game",
                    "lock":true,
                    "defaultTemplate": {
                        "html": "/static/controls/game/default/tpl.html",
                        "css": "/static/controls/game/default/tpl.css",
                        "js": "/static/controls/game/default/tpl.js"
                    },
                    "style": {
                        "type": "mobile",
                        "width": "320px",
                        "height": "100%"
                    },
                    "data": {
                        "theme": "default",//主题
                        "score": "",  //抽奖分数线
                        "intervalDay": "1", //抽奖间隔
                        "intervalDrawTime": "",  //抽奖次数
                        "actStartTime": "",  //活动开始时间
                        "actEndTime": "",  //活动结束时间
                        "actTime": [],
                        "prizes": [], 
                        "controlData": {//保存模块配置信息
                            "fromSetting":[//表单配置
                                {
                                    "type": "text",
                                    "category": "name",
                                    "name": "姓名",
                                    "value": ""
                                },
                                {
                                    "type": "text",
                                    "category": "phone",
                                    "name": "手机",
                                    "value": ""
                                }
                            ],
                            "gameTime": "",  //游戏时长
                            "drawStyle": "redEnvelope",  //抽奖形式   redEnvelope--红包   golden--砸金蛋    draw--抽签
                            "qrcode": {
                                "url": ""
                            }, //二维码
                            "rule": ""  //活动规则
                        } 
                    },
                    "addTools": ["setting"],
                    "setting": {
                        "settingTitle": "游戏设置",
                        "settingTemplate": "gameSetting",
                        "settingModalSize": "sm"
                    },
                    "styleSetting":{
                        "settingTitle": "主题设置",
                    }
                },
                {
                    "key": "small_game_whackAMole",
                    "name": "打地鼠",
                    "action": "control",
                    "coverPicture": "assets/images/game/WhackAMole.png",
                    "single": true,
                    "pluginType":"game",
                    "lock":true,
                    "defaultTemplate": {
                        "html": "/static/controls/game/default/tpl.html",
                        "css": "/static/controls/game/default/tpl.css",
                        "js": "/static/controls/game/default/tpl.js"
                    },
                    "style": {
                        "type": "mobile",
                        "width": "320px",
                        "height": "100%"
                    },
                    "data": {
                        "theme": "default",//主题
                        "score": "",  //抽奖分数线
                        "intervalDay": "1", //抽奖间隔
                        "intervalDrawTime": "",  //抽奖次数
                        "actStartTime": "",  //活动开始时间
                        "actEndTime": "",  //活动结束时间
                        "actTime": [],
                        "prizes": [], 
                        "controlData": {//保存模块配置信息
                            "fromSetting":[//表单配置
                                {
                                    "type": "text",
                                    "category": "name",
                                    "name": "姓名",
                                    "value": ""
                                },
                                {
                                    "type": "text",
                                    "category": "phone",
                                    "name": "手机",
                                    "value": ""
                                }
                            ],
                            "gameTime": "",  //游戏时长
                            "drawStyle": "redEnvelope",  //抽奖形式   redEnvelope--红包   golden--砸金蛋    draw--抽签
                            "qrcode": {
                                "url": ""
                            }, //二维码
                            "rule": ""  //活动规则
                        } 
                    },
                    "addTools": ["setting"],
                    "setting": {
                        "settingTitle": "游戏设置",
                        "settingTemplate": "gameSetting",
                        "settingModalSize": "sm"
                    },
                    "styleSetting":{
                        "settingTitle": "主题设置",
                    }
                },
                {
                    "key": "small_game_fingerGuessing",
                    "name": "猜拳",
                    "action": "control",
                    "coverPicture": "assets/images/game/FingerGuessing.png",
                    "single": true,
                    "pluginType":"game",
                    "lock":true,
                    "defaultTemplate": {
                        "html": "/static/controls/game/default/tpl.html",
                        "css": "/static/controls/game/default/tpl.css",
                        "js": "/static/controls/game/default/tpl.js"
                    },
                    "style": {
                        "type": "mobile",
                        // "width": "320px",
                        // "height": "100%"
                        "top":0,
                        "left":0,
                        "right":0,
                        "bottom":0
                    },
                    "data": {
                        "theme": "default",//主题
                        "score": "",  //抽奖分数线
                        "intervalDay": "1", //抽奖间隔
                        "intervalDrawTime": "",  //抽奖次数
                        "actStartTime": "",  //活动开始时间
                        "actEndTime": "",  //活动结束时间
                        "actTime": [],
                        "prizes": [], 
                        "controlData": {//保存模块配置信息
                            "fromSetting":[//表单配置
                                {
                                    "type": "text",
                                    "category": "name",
                                    "name": "姓名",
                                    "value": ""
                                },
                                {
                                    "type": "text",
                                    "category": "phone",
                                    "name": "手机",
                                    "value": ""
                                }
                            ],
                            "gameTime": "",  //游戏时长
                            "drawStyle": "redEnvelope",  //抽奖形式   redEnvelope--红包   golden--砸金蛋    draw--抽签
                            "qrcode": {
                                "url": ""
                            }, //二维码
                            "rule": ""  //活动规则
                        } 
                    },
                    "addTools": ["setting"],
                    "setting": {
                        "settingTitle": "游戏设置",
                        "settingTemplate": "gameSetting",
                        "settingModalSize": "sm"
                    },
                    "styleSetting":{
                        "settingTitle": "主题设置",
                    }
                },
                {
                    "key": "small_game_fishingJoy",
                    "name": "捕鱼",
                    "action": "control",
                    "coverPicture": "assets/images/game/FishingJoy.png",
                    "single": true,
                    "pluginType":"game",
                    "lock":true,
                    "defaultTemplate": {
                        "html": "/static/controls/game/default/tpl.html",
                        "css": "/static/controls/game/default/tpl.css",
                        "js": "/static/controls/game/default/tpl.js"
                    },
                    "style": {
                        "type": "mobile",
                        "width": "320px",
                        "height": "100%"
                    },
                    "data": {
                        "theme": "default",//主题
                        "score": "",  //抽奖分数线
                        "intervalDay": "1", //抽奖间隔
                        "intervalDrawTime": "",  //抽奖次数
                        "actStartTime": "",  //活动开始时间
                        "actEndTime": "",  //活动结束时间
                        "actTime": [],
                        "prizes": [], 
                        "controlData": {//保存模块配置信息
                            "fromSetting":[//表单配置
                                {
                                    "type": "text",
                                    "category": "name",
                                    "name": "姓名",
                                    "value": ""
                                },
                                {
                                    "type": "text",
                                    "category": "phone",
                                    "name": "手机",
                                    "value": ""
                                }
                            ],
                            "gameTime": "",  //游戏时长
                            "drawStyle": "redEnvelope",  //抽奖形式   redEnvelope--红包   golden--砸金蛋    draw--抽签
                            "qrcode": {
                                "url": ""
                            }, //二维码
                            "rule": ""  //活动规则
                        } 
                    },
                    "addTools": ["setting"],
                    "setting": {
                        "settingTitle": "游戏设置",
                        "settingTemplate": "gameSetting",
                        "settingModalSize": "sm"
                    },
                    "styleSetting":{
                        "settingTitle": "主题设置",
                    }
                },
                {
                    "struct":"game",
                    "key": "small_game_musicalTalent",
                    "name": "击鼓",
                    "coverPicture": "assets/images/game/MusicalTalent.png",
                    "pluginType":"game",
                    "data": {
                        "theme": "default",//主题
                        "score": "",  //抽奖分数线
                        "intervalDay": "1", //抽奖间隔
                        "intervalDrawTime": "",  //抽奖次数
                        "actStartTime": "",  //活动开始时间
                        "actEndTime": "",  //活动结束时间
                        "actTime": [],
                        "prizes": [], 
                        "controlData": {//保存模块配置信息
                            "fromSetting":[//表单配置
                                {
                                    "type": "text",
                                    "category": "name",
                                    "name": "姓名",
                                    "value": ""
                                },
                                {
                                    "type": "text",
                                    "category": "phone",
                                    "name": "手机",
                                    "value": ""
                                }
                            ],
                            "gameTime": "",  //游戏时长
                            "drawStyle": "redEnvelope",  //抽奖形式   redEnvelope--红包   golden--砸金蛋    draw--抽签
                            "qrcode": {
                                "url": ""
                            }, //二维码
                            "rule": ""  //活动规则
                        } 
                    }
                }
            ]
        }
    ]
}

export default moduleConfig