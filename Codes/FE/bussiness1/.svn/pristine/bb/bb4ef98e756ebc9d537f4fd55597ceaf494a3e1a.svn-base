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
                        "backColor": "#01bacf",
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
                    "pluginType": "form",
                    "selected": true
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
                    "resizeHandles": "none",
                    "selected": true
                },
                {
                    "key": "plugin_media_video",
                    "name": "视频",
                    "action": "control",
                    "coverPicture": "assets/images/plugin/cover_video.png",
                    "defaultTemplate": {
                        "html": "/static/controls/plugin/video/video.tpl.html",
                        "css": "/static/controls/plugin/video/video.css",
                        "js": "/static/controls/plugin/video/video.js"
                    },
                    "style": {
                        "width": "10rem",
                        "height": "5.625rem"
                    },
                    "data": {
                        "html": ""
                    },
                    "addTools": ["setting", "update"],
                    "setting": {
                        "settingTitle": "输入设置",
                        "settingTemplate": "videoSetting",
                        "settingModalSize": "sm"
                    },
                    "resizeHandles": "none",
                    "selected": true
                }
            ]
        },
        {
            "key": "plugin_dynamic",
            "name": "动态获取数据",
            "childs": [
                {
                    "key": "plugin_goods",
                    "name": "商品",
                    "action": "control",
                    "coverPicture": "assets/images/plugin/cover_goods.png",
                    "defaultTemplate": {
                        "html": "/static/controls/plugin/goods/goods_tpl.html",
                        "css": "/static/controls/plugin/goods/goods.css",
                        "js": "/static/controls/plugin/goods/goods.js"
                    },
                    "resizeHandles": "w,e",
                    "style": {
                        "width": "10rem",
                        "height": "auto"
                    },
                    "data": {
                        "style": 1,
                        "goodsInfo": {
                            "id": "",
                            "kid": "",
                            "title": "宝贝名称读取商城后台内容两排展示超过两排不全直接截断",
                            "image": "http://resource.tuixb.cn/tuixiaobao/common/goods_default_pic.png",
                            "price": "99999.00"
                        },
                        "backgroundColor": "",
                        "titleColor": "#000",
                        "priceColor": "#dc4437",
                        "btnConfig": {
                            "btnText": "立即购买",
                            "btnColor": "#fff",
                            "btnBColor": "#f56c6c"
                        }
                    },
                    "addTools": ["setting",  "update"],
                    "setting": {
                        "settingTitle": "商品设置",
                        "settingTemplate": "goodsSetting",
                        "settingModalSize": "sm"
                    },
                    "styleSetting": {
                        "settingTitle": "主题设置",
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
                    "lock": true,
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
                            "fromSetting": [//表单配置
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
                    "styleSetting": {
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
                    "lock": true,
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
                            "fromSetting": [//表单配置
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
                    "styleSetting": {
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
                    "lock": true,
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
                            "fromSetting": [//表单配置
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
                    "styleSetting": {
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
                    "lock": true,
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
                            "fromSetting": [//表单配置
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
                    "styleSetting": {
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
                    "lock": true,
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
                            "fromSetting": [//表单配置
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
                    "styleSetting": {
                        "settingTitle": "主题设置",
                    }
                },
                {
                    "key": "plugin_activity_redpack",
                    "name": "拆红包",
                    "action": "control",
                    "coverPicture": "assets/images/plugin/cover_chb.png",
                    "pluginType": "draw",
                    "single": true,
                    "lock": true,
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
                            "fromSetting": [//表单配置
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
                    "styleSetting": {
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
                    },
                    "selected": true
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
                        "html": "/static/controls/plugin/count-down/count_down_app.html",
                        "css": "/static/controls/plugin/count-down/count_down_app.css",
                        "js": "/static/controls/plugin/count-down/count_down_app.js"
                    },
                    "style": {
                        "width": "9.375rem",
                        "height": "1.1875rem"
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
                        "settingTemplate": "countdownSetting",
                        "settingModalSize": "sm"
                    },
                    "selected": true
                },
                {
                    "key": "plugin_app_call",
                    "name": "拨号",
                    "action": "control",
                    "coverPicture": "assets/images/plugin/cover_call.png",
                    "single": true,
                    "pluginType": "call",
                    "defaultTemplate": {
                        "html": "/static/controls/plugin/call/call_app.html",
                        "css": "/static/controls/plugin/call/call_app.css",
                        "js": "/static/controls/plugin/call/call_app.js"
                    },
                    "style": {
                        "width": "5.625rem", 
                        "height": "1.875rem"
                    },
                    "inner": {
                        "style": {
                        }
                    },
                    "data": {
                        "style": 1,
                        "callNum": "",
                        "callText": "拨打电话",
                        "color": "#FFFFFF",
                        "iconColor": "#cfdbe7",
                        "backgroundColor": "#cfdbe7"
                    },
                    "aspectRatio": true,
                    "addTools": ["setting","update","opacity"],
                    "setting": {
                        "settingTitle": "拨号设置",
                        "settingTemplate": "callSetting",
                        "settingModalSize": "sm"
                    },
                    "selected": true
                },
                {
                    "key": "plugin_app_fabulous",
                    "name": "点赞",
                    "action": "control",
                    "coverPicture": "assets/images/plugin/cover_fabulous.png",
                    "single": true,
                    "defaultTemplate": {
                        "html": "/static/controls/plugin/fabulous/fabulous_app.html",
                        "css": "/static/controls/plugin/fabulous/fabulous_app.css",
                        "js": "/static/controls/plugin/fabulous/fabulous_app.js"
                    },
                    "style": {
                        "width": "5.625rem", 
                        "height": "1.875rem"
                    },
                    "inner": {
                        "style": {
                        }
                    },
                    "data": {
                        "kid": "",
                        "style": 1,
                        "fabulousText": "送花",
                        "color": "#FFFFFF",
                        "iconColor": "#cfdbe7",
                        "backgroundColor": "#cfdbe7"
                    },
                    "aspectRatio": true,
                    "addTools": ["setting","update","opacity"],
                    "setting": {
                        "settingTitle": "点赞设置",
                        "settingTemplate": "fabulousSetting",
                        "settingModalSize": "sm"
                    },
                    "selected": true
                },
                {
                    "key": "plugin_app_vote",
                    "name": "投票插件",
                    "action": "control",
                    "single": true,
                    "coverPicture": "assets/images/plugin/cover_vote.png",
                    "defaultTemplate": {
                        "html": "/static/controls/plugin/vote/vote.tpl.html",
                        "css": "/static/controls/plugin/vote/vote.css",
                        "js": "/static/controls/plugin/vote/vote.js"
                    },
                    "style": {
                        "width": "5rem",
                        "height": "auto"
                    },
                    "data": {
                        "selectStyle": "style1",
                        "voteBeforeBtn": {
                            "text": "投票",
                            "color": "#ffffff",
                            "bg": "#FF6060"
                        },
                        "voteAfterBtn": {
                            "text": "谢谢支持",
                            "color": "#ffffff",
                            "bg": "#D9D7D8"
                        },
                        "dateArr": [],
                        "settingData": {
                            "itemList": [
                                {
                                    "title": "投票项1",
                                    "image": "http://resource.tuixb.cn/tuixiaobao/common/goods_default_pic.png",
                                    "num": "票数",
                                    "numColor": "#A6A6A7",
                                    "titleColor": "#333333"
                                }
                            ],
                            "voteLimit": "2",
                            "startTime": "",
                            "endTime": ""
                        }
                    },
                    "resizeHandles": "w,e",
                    "addTools": ["setting"],
                    "setting": {
                        "settingTitle": "投票插件设置",
                        "settingTemplate": "voteSetting",
                        "settingModalSize": "sm"
                    },
                    "selected": true,
                    "pluginType": "vote"
                }
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
                    "pluginType": "game",
                    "lock": true,
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
                            "fromSetting": [//表单配置
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
                    "styleSetting": {
                        "settingTitle": "主题设置",
                    }
                },
                {
                    "key": "small_game_whackAMole",
                    "name": "打地鼠",
                    "action": "control",
                    "coverPicture": "assets/images/game/WhackAMole.png",
                    "single": true,
                    "pluginType": "game",
                    "lock": true,
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
                            "fromSetting": [//表单配置
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
                    "styleSetting": {
                        "settingTitle": "主题设置",
                    }
                },
                {
                    "key": "small_game_fingerGuessing",
                    "name": "猜拳",
                    "action": "control",
                    "coverPicture": "assets/images/game/FingerGuessing.png",
                    "single": true,
                    "pluginType": "game",
                    "lock": true,
                    "defaultTemplate": {
                        "html": "/static/controls/game/default/tpl.html",
                        "css": "/static/controls/game/default/tpl.css",
                        "js": "/static/controls/game/default/tpl.js"
                    },
                    "style": {
                        "type": "mobile",
                        // "width": "320px",
                        // "height": "100%"
                        "top": 0,
                        "left": 0,
                        "right": 0,
                        "bottom": 0
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
                            "fromSetting": [//表单配置
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
                    "styleSetting": {
                        "settingTitle": "主题设置",
                    }
                },
                {
                    "key": "small_game_fishingJoy",
                    "name": "捕鱼",
                    "action": "control",
                    "coverPicture": "assets/images/game/FishingJoy.png",
                    "single": true,
                    "pluginType": "game",
                    "lock": true,
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
                            "fromSetting": [//表单配置
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
                    "styleSetting": {
                        "settingTitle": "主题设置",
                    }
                },
                {
                    "struct": "game",
                    "key": "small_game_musicalTalent",
                    "name": "击鼓",
                    "coverPicture": "assets/images/game/MusicalTalent.png",
                    "pluginType": "game",
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
                            "fromSetting": [//表单配置
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