let typeSetting = [
    {
        "category": "name",
        "icon": "iconfont icon-geren",
        "title": {
            "text": "姓名",
            "canModify": false,
            "hide": false
        },
        "placeholder": "请输入姓名",
        "require": false,
        "maxLength": {
            "need": false,
            "value": 15
        },
        "minLength": {
            "need": false,
            "value": 1
        }
    },
    {
        "category": "phone",
        "icon": "iconfont icon-sms-marketing-copy",
        "title": {
            "text": "手机",
            "canModify": false,
            "hide": false
        },
        "placeholder": "请输入手机号",
        "checkFormat": true,
        "require": false
    },
    {
        "category": "email",
        "icon": "iconfont icon-form-email",
        "title": {
            "text": "邮箱",
            "canModify": false,
            "hide": false
        },
        "placeholder": "请输入邮箱地址",
        "checkFormat": true,
        "require": false
    },
    {
        "category": "number",
        "icon": "iconfont icon-shuzi",
        "title": {
            "text": "数字",
            "canModify": true,
            "hide": false
        },
        "placeholder": "请输入数字",
        "checkFormat": true,
        "require": false
    },
    {
        "category": "identitycard",
        "icon": "iconfont icon-cardid",
        "title": {
            "text": "身份证",
            "canModify": false,
            "hide": false
        },
        "placeholder": "请输入身份证号码",
        "checkFormat": true,
        "require": false
    },
    {
        "category": "address",
        "icon": "iconfont icon-location",
        "title": {
            "text": "地址",
            "canModify": false,
            "hide": false
        },
        "require": false,
        //地址
        "province": {
            "need": true,
            "value": "",
            "list": []
        },
        "city": {
            "need": true,
            "value": "",
            "list": []
        },
        "district": {
            "need": true,
            "value": "",
            "list": []
        },
        "detailAdress": {
            "need": true,
            "value": ""
        }
    },
    {
        "category": "date",
        "icon": "iconfont icon-date",
        "title": {
            "text": "日期",
            "canModify": false,
            "hide": false
        },
        "placeholder": '请选择日期',
        "dateArr": [],
        "require": false,
        "startTime": {
            "need": false,
            "value": ""
        },
        "endTime": {
            "need": false,
            "value": ""
        }
    },
    {
        "category": "time",
        "icon": "iconfont icon-shijian",
        "title": {
            "text": "时间",
            "canModify": false,
            "hide": false
        },
        "require": false,
        "startTime": {
            "need": false,
            "value": ""
        },
        "endTime": {
            "need": false,
            "value": ""
        }
    },
    {
        "category": "radio-option",
        "icon": "iconfont icon-radio-copy",
        "title": {
            "text": "单项选择",
            "canModify": true,
            "hide": false
        },
        "require": false,
        "option": [
            { "value": "选项1", "dataKey" : "radio-option-0" }, { "value": "选项2", "dataKey" : "radio-option-1" }, { "value": "选项3", "dataKey" : "radio-option-2" }, { "value": "选项4", "dataKey" : "radio-option-3"}
        ],
        "arrangement": { //排列方式
            "type": 'h' //h-横向   v-纵向
        }
    },
    {
        "category": "checkbox-option",
        "icon": "iconfont icon-duoxuan",
        "title": {
            "text": "多项选择",
            "canModify": true,
            "hide": false
        },
        "minNum": {
            "need": true,
            "value": 1
        },
        "maxNum": {
            "need": false,
            "value": 4
        },
        "option": [
            { "value": "选项1", "dataKey" : "checkbox-option-0" }, { "value": "选项2", "dataKey" : "checkbox-option-1" }, { "value": "选项3", "dataKey" : "checkbox-option-2" }, { "value": "选项4", "dataKey" : "checkbox-option-3"}
        ],
        "arrangement": { //排列方式
            "type": 'h' //h-横向   v-纵向
        }
    },
    {
        "category": "single-lines",
        "placeholder": "请输入提示语",
        "icon": "iconfont icon-danhangshuru",
        "title": {
            "text": "单行输入框",
            "canModify": true,
            "hide": false
        },
        "placeholder": "未命名单行文本",
        "require": false,
        "maxLength": {
            "need": false,
            "value": 15
        },
        "minLength": {
            "need": false,
            "value": 1
        }
    },
    {
        "category": "multiple-lines",
        "placeholder": "请输入提示语",
        "icon": "iconfont icon-duohangshuru",
        "title": {
            "text": "多行输入框",
            "canModify": true,
            "hide": false
        },
        "placeholder": "未命名多行文本",
        "require": false,
        "maxLength": {
            "need": false,
            "value": 15
        },
        "minLength": {
            "need": false,
            "value": 1
        }
    },
    {
        "category": "image-radio-option",
        "icon": "iconfont icon-dantu",
        "title": {
            "text": "图片单选",
            "canModify": true,
            "hide": false
        },
        "require": false,
        "option": [
            { "src": "","value": "选项1", "dataKey" : "image-radio-option-0" }, { "src": "","value": "选项2", "dataKey" : "image-radio-option-1" }
        ],
        "arrangement": { //排列方式
            "singleNum": '2' //单行个数
        }
    },
    {
        "category": "image-checkbox-option",
        "icon": "iconfont icon-duotu",
        "title": {
            "text": "图片多选",
            "canModify": true,
            "hide": false
        },
        "minNum": {
            "need": true,
            "value": 1
        },
        "maxNum": {
            "need": false,
            "value": 2
        },
        "option": [
            { "src": "","value": "选项1", "dataKey" : "image-checkbox-option-0" }, { "src": "","value": "选项2", "dataKey" : "image-checkbox-option-1" }
        ],
        "arrangement": { //排列方式
            "singleNum": '2' //单行个数
        }
    },
    {
        "category": "select",
        "icon": "iconfont icon-xiala",
        "title": {
            "text": "下拉框",
            "canModify": true,
            "hide": false
        },
        "option": [
            { "value": "选项1", "dataKey" : "select-0" }, { "value": "选项2", "dataKey" : "select-1" }
        ]
    },
    {
        "category": "upload",
        "icon": "iconfont icon-fujian",
        "title": {
            "text": "图片附件",
            "canModify": true,
            "hide": false
        },
        "minNum": {
            "need": false,
            "value": 1
        },
        "maxNum": {
            "need": true,
            "value": 10
        },
        "imgList": [
        ]
    }
]

export default typeSetting;