let structConfig = {
    "text": {
        "struct": "text",
        "name": "文字",
        "action": "control",
        "defaultTemplate": {
            "html": "/static/controls/text/text_tpl.html",
            "css": "/static/controls/text/text.css",
            "js": "/static/controls/text/text.js"
        },
        "style": {
            "width": "320px",
            "height": "35px"
        },
        "inner": {
            "style": {
                "font-family": "Microsoft YaHei",
                "font-size": "24px",
                "color": "#000000",
                "background-color": "rgba(0, 0, 0, 0)",
                "font-weight": "normal",
                "font-style": "normal",
                "text-align": "center",
                "text-decoration": "normal",
                "line-height": "1.5"
            }
        },
        "data": {
            "context": ""
        },
        "addTools": ["font-toolbar", "link", "opacity", "lock", "alignposition", "update"]
    },
    "image": {
        "struct": "image",
        "name": "图片",
        "action": "control",
        "defaultTemplate": {
            "html": "/static/controls/image/image_tpl.html",
            "css": "",
            "js": "/static/controls/image/image.js"
        },
        "style": {
            "width": "150px",
            "height": "150px"
        },
        "inner": {
            "style": {}
        },
        "data": { "src": "" },
        "addTools": ["choose-image", "link", "opacity", "horizontal-transform", "vertical-transform", "stretch", "lock", "alignposition", "update"],
        "aspectRatio": true
    },
    "svg": {
        "struct": "svg",
        "name": "SVG",
        "action": "control",
        "defaultTemplate": {
            "html": "",
            "css": "",
            "js": ""
        },
        "style": {
            "width": "150px",
            "height": "50px"
        },
        "inner": {
            "style": {}
        },
        "data": {
            "_chooseColors": []
        },
        "resourceSrc": "",
        "addTools": ["choose-colors", "link", "opacity", "horizontal-transform", "vertical-transform", "lock", "alignposition", "update"],
        "aspectRatio": true
    },
    "div": {
        "struct": "div",
        "name": "DIV",
        "action": "control",
        "defaultTemplate": {
            "html": "/static/controls/div/div_tpl.html",
            "css": "/static/controls/div/div.css",
            "js": "/static/controls/div/div.js"
        },
        "inner": {
            "style": {}
        },
        "data": {
            "_chooseColors": [""],
            "borderWidth": "0px"
        },
        "addTools": ["choose-colors", "border-style", "opacity", "lock", "alignposition", "update"]
    },
    "line": {
        "struct": "line",
        "name": "线条",
        "action": "control",
        "inner": {
            "style": {}
        },
        "data": {
            "_chooseColors": ["#3898EC"]
        },
        "addTools": ["choose-colors", "opacity", "lock", "alignposition", "border-size", "update"]
    },
    "adsorb": {
        "struct": "adsorb",
        "name": "吸附框",
        "action": "control",
        "defaultTemplate": {
            "html": "/static/controls/adsorb/adsorb_tpl.html",
            "css": "",
            "js": ""
        },
        "style": {
            "width": "150px",
            "height": "150px"
        },
        "inner": {
            "style": {}
        },
        "data": {
            "view": "",
            "left": "0px",
            "top": "0px",
            "width": "auto",
            "height": "auto",
            "originalWidth": "auto",
            "originalHeight": "auto"
        },
        "addTools": ["choose-image", "link", "opacity", "horizontal-transform", "vertical-transform", "lock", "alignposition", "update"]
    },
    "game": {
        "struct": "game",
        "name": "游戏",
        "action": "control",
        "defaultTemplate": {
            "html": "/static/controls/game/default/tpl.html",
            "css": "/static/controls/game/default/tpl.css",
            "js": "/static/controls/game/default/tpl.js"
        },
        "single": true,
        "lock": true,
        "style": {
            "top": 0,
            "left": 0,
            "right": 0,
            "bottom": 0
        },
        "data": {
        },
        "addTools": ["setting"],
        "setting": {
            "settingTitle": "游戏设置",
            "settingTemplate": "gameSetting",
            "settingModalSize": "sm"
        },
    },
}

export default structConfig