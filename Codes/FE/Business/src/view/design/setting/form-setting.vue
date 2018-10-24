<template>
  <div class="custom-form-setting">
    <div style="height: calc(100vh - 500px);overflow-x: hidden;" class="scroll-box">
        <form class="form-inline">
            <!-- 表单 -->
            <div id="section_sortable">
                <div class="section"
                     v-for="(row, index) in data.rows"
                     :key="index"
                     :data-key="row.dataKey"
                     @mouseenter="row.hover = true"
                     @mouseleave="row.hover = false">
                    <div style="margin-bottom:10px;">
                        <span class="control-label" v-if="row.type == 'text'">单行文本框</span>
                        <span class="control-label" v-if="row.type == 'textarea'">多行文本框</span>
                        <span class="control-label" v-if="row.type == 'radio' && row.category == 'text'">文字单选组合</span>
                        <span class="control-label" v-if="row.type == 'radio' && row.category == 'image'">图文单选组合</span>
                        <span class="control-label" v-if="row.type == 'checkbox' && row.category == 'text'">文字多选组合</span>
                        <span class="control-label" v-if="row.type == 'checkbox' && row.category == 'image'">图文多选组合</span>
                        <div class="pull-right actions" v-show="row.hover">
                            <div class="action act-drag pull-left"><i class="iconfont icon-move"></i></div>
                            <div class="action act-remove pull-left"><i class="iconfont icon-close" @click="btnRemove(row)"></i></div>
                        </div>
                    </div>
                    <div class="clearfix"></div>

                    <!-- 单行文本框 -->
                    <div v-if="row.type == 'text'">
                        <div class="form-group">
                            <input type="text" class="form-control" placeholder="请输入标题" maxlength="20" style="width:236px;" v-model="row.name">
                        </div>
                        <div class="form-group">
                            <select class="form-control" style="width:105px;border:1px solid #ccc;" v-model="row.category">
                                <option value="default">普通文本</option>
                                <option value="name">姓名</option>
                                <option value="number">纯数字</option>
                                <option value="phone">手机号码</option>
                                <option value="email">邮箱</option>
                                <option value="identitycard">身份证号</option>
                            </select>
                        </div>
                    </div>

                    <!-- 多行文本框 -->
                    <div v-if="row.type == 'textarea'">
                        <div class="form-group">
                            <textarea class="form-control" placeholder="请输入标题" maxlength="40" style="width:344px;" v-model="row.name"></textarea>
                        </div>
                    </div>

                    <!-- 文字/图文 单选/多选组合 -->
                    <div v-if="row.type == 'radio' || row.type == 'checkbox'">
                        <div class="form-group">
                            <input type="text" class="form-control" placeholder="请输入标题" maxlength="40" style="width:344px;margin-bottom:10px;" v-model="row.name">
                        </div>
                        <div v-for="(item, index) in row.options" :key="index" :data-key="item.dataKey" style="margin-bottom: 10px;">
                            <div class="form-group" v-show="row.category == 'text'">
                                <input type="text" class="form-control" maxlength="40" style="width:316px" v-model="item.value">
                            </div>

                            <div class="form-group" v-show="row.category == 'image'">
                                <input type="text" class="form-control" maxlength="40" style="width:283px" v-model="item.value">
                            </div>
                            <div class="form-group text-center" style="position:relative; width:30px; height: 30px;" v-show="row.category == 'image'">
                                <i class="iconfont icon-image icon-image-option" style="font-size:22px;" v-show="!item.img"></i>
                                <img class="icon-image-option" :src="item.img" style="width:30px; height:30px;" v-show="item.img" />
                                <form class="imgUploadForm" enctype="multipart/form-data" style="width: 30px; overflow:hidden;">
                                    <input type="file" class="imgUpload" name="img" @change="uploadImg($event, item, 'img')"/>
                                </form>
                            </div>

                            <div class="form-group text-center" style="position:relative; z-index:2; width:34px; height: 30px;line-height:30px; padding-top:2px;" @click="btnDelOption(row, item)">
                                <i class="iconfont icon-delete-second btn-del-option" style="font-size:22px;"></i>
                            </div>
                        </div>
                        <div>
                            <button type="button" class="btn btn-xs btn-setting white" style="width: 80px;" @click="btnAddOption(row)">
                                <i class="iconfont icon-plus" style="font-size:14px;"></i>
                            </button>
                        </div>
                    </div>

                    <div class="clearfix"></div>
                </div>
            </div>

            <div class="btn-group dropdown">
                <button type="button" class="btn btn-setting dropdown-toggle" style="width: 370px;" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i class="iconfont icon-plus" style="font-size:14px; margin-right: 5px;"></i>新增表单项
                </button>
                <ul class="dropdown-menu" style="width:370px;">
                    <li class="menu-item" @click="btnAdd('text')"><span>单行文本框</span></li>
                    <li class="menu-item" @click="btnAdd('textarea')"><span>多行文本框</span></li>
                    <li class="menu-item" @click="btnAdd('radio','text')"><span>文字单选组合</span></li>
                    <li class="menu-item" @click="btnAdd('radio','image')"><span>图文单选组合</span></li>
                    <li class="menu-item" @click="btnAdd('checkbox','text')"><span>文字多选组合</span></li>
                    <li class="menu-item" @click="btnAdd('checkbox','image')"><span>图文多选组合</span></li>
                </ul>
            </div>

            <!-- 颜色皮肤 -->
            <div style="position:relative;margin-top:30px;">
                <span>提交按钮</span>
                <span style="position:absolute;left:64px;top:14px;display:block;width:304px;height:1px;border-bottom:1px solid #ccc;"></span>
            </div>
            <div class="clearfix"></div>
            <div class="form-row">
                <span class="pull-left title">按钮文字</span>
                <div class="pull-left form-input">
                    <input class="form-control" type="text" maxlength="8" v-model="data.submit.text" style="width:138px;"/>
                </div>

                <div class="pull-right" style="font-size:12px;margin-right:16px;">
                    <i class="pull-left iconfont icon-font-family" style="width:20px;" title="字体颜色"></i>
                    <div class="pull-left chooseColor" title="字体颜色">
                        <input name="fontColor" class="fontColor chooseColor" v-model="data.fontColor" @blur="txtChangeColor('fontColor')"/>
                    </div>
                    <i class="pull-left iconfont icon-font-background-color" style="width:20px; margin-left: 20px;" title="字体背景色"></i>
                    <div class="pull-left chooseColor" title="字体背景色">
                        <input class="backColor chooseColor" name="backColor" v-model="data.backColor" @blur="txtChangeColor('backColor')"/>
                    </div>
                </div>
            </div>
            <div class="clearfix" style="margin-bottom: 10px;"></div>
            <div class="form-row">
                <span class="pull-left title">提交反馈</span>
                <div class="pull-left form-input">
                    <input class="form-control" type="text" maxlength="20" v-model="data.submit.feedback"  style="width:138px;"/>
                </div>
            </div>
            <div class="clearfix" style="margin-bottom: 30px;"></div> <!-- 该margin值为了迁就下拉菜单被遮挡的问题 -->
        </form>
    </div>
    <button class="btn btn-submit blue_bg white" @click="btnSubmit()"> 提  交</button>

</div>
</template>

<script>
import api from "api";
import eventBus from '../../../utils/eventBus.js';
import defaultImg from '../../../assets/images/design/default_image.png';
export default {
    name: 'form-setting',
    data() {
        return {
            data: {
                fontColor: "#ffffff",
                backColor: "#3898EC",
                submit: {
                    "text": "提交",
                    "feedback": "感谢您的填写"
                },
                rows: [
                    {
                        "type": "text",
                        "category": "name",
                        "name": "姓名",
                        "dataKey": "rows0",
                        "hover": false
                    },
                    {
                        "type": "text",
                        "category": "phone",
                        "name": "手机",
                        "dataKey": "rows1",
                        "hover": false
                    }
                ]
            },
            uploading: null,
            controlConfig: {data: ''}
        }
    },
    created(){
        eventBus.$on("settingRefresh", this.init);
    },
    beforeDestroy(){
      eventBus.$off('settingRefresh');
    },
    mounted(){
        this.init();
    },
    methods: {
        init(){
            let self = this;
            let _currentBox = Kdo.box.utils.getCurrentBox(),
                _$box = _currentBox.$focusSingleBox;
            if (_currentBox.focusLevel == "single") {
                let _controlConfigs = Kdo.data.controls.get(Kdo.box.utils.getBoxControlId(_$box));
                if (_controlConfigs.length > 0) self.controlConfig = _controlConfigs[0];

            }

            self.data = Object.assign({}, self.controlConfig.data);
            
            //执行排序事件绑定
            self.sortByHandle();
            
            self.init_color();
   
        },
        //生成对象Key,key唯一
        creatDataKey (type) {
            let self = this,
            optionsLength = 0;
            if(type == 'row') return 'rows' + self.data.rows.length;
            _.each(self.data.rows, function(item){
                if(!!item.options) optionsLength += item.options.length;
            });
            return 'options' + optionsLength;
        },
        //初始化颜色选择器
        init_color(){
            var self = this;
            var _init_color = function ($el, key) {
                $el.spectrum({
                    allowEmpty: true,
                    color: self.data[key],
                    showInput: true,
                    showPalette: true,
                    showSelectionPalette: false,
                    showAlpha: false,
                    showButtons: false,
                    maxPaletteSize: 10,
                    preferredFormat: "hex",
                    localStorageKey: "spectrum.demo",
                    move: function (color) {
                        self.data[key] = color ? color.toHexString() : "none";
                    },
                    beforeShow: function () {
                    },
                    hide: function (color) {
                       self.txtChangeColor(key, color);
                　　},
                    palette: $.spectrum.customOptions.palette
                });
            }
            _init_color($("input.fontColor"), "fontColor");
            _init_color($("input.backColor"), "backColor");    
        }, 
        txtChangeColor (key, color) {
            var self = this;
            var hexColor = "transparent";
    　　　　 if(color) {
    　　　　　　hexColor = color.toHexString();
    　　　　 }
            self.data[key] = hexColor;
        }, 
        //添加表单项
        btnAdd(type, category) {
            var self = this;
            var row = {
                "type": type,
                "category": category || "default",
                "name": "",
                "hover": false,
                "dataKey": self.creatDataKey('row')
            }
            if (type == "radio" || type == "checkbox") {
                row["options"] = [
                    { "value": "选项A", "dataKey": self.creatDataKey('option')+'0' },
                    { "value": "选项B", "dataKey": self.creatDataKey('option')+'1' }
                ];
                if (category == "image") {
                    _.each(row["options"], function (item,index) {
                        item["img"] = defaultImg;
                    });
                }
            }

            this.data.rows.push(row);
        },
        //删除表单项
        btnRemove (item) {
            var self = this;
            this.data.rows = _.filter(self.data.rows, function (row) { return row.dataKey != item.dataKey });
        },
        //添加radio/checkbox选项
        btnAddOption (row) {
            var opt = {
                "value": ""
            }
            if (row.type == "radio" || row.type == "checkbox") {
                if (row.category == "image") {
                    opt["img"] = defaultImg; 
                    opt["dataKey"] = this.creatDataKey('option')
                }
            }

            row.options.push(opt);
        },
        //删除radio/checkbox选项
        btnDelOption (row, opt) {
            row.options = _.filter(row.options, function (item) { return item.dataKey != opt.dataKey });
        },
        //表单项排序功能
        sortByHandle () {
            var self = this;
            var $el = $("#section_sortable");
            $el.sortable({
                axis: "y",
                handle: ".act-drag",
                stop: function (event, ui) {
                    Kdo.events.on();
                },
                sort: function (event, ui) {
                    Kdo.events.off("mouse");
                },
                update: function (event, ui) {
                    var rows = [];
                    $.each($el.children(".section"), function (i, el) {
                        rows.push(_.findWhere(self.data.rows, { dataKey: $(el).attr("data-key") }));
                    });
                    self.data.rows = rows;
                }
            });
        },
        uploadImg(event, item, type){
            var file = event.currentTarget.files[0];
            if (!file || item.uploading) return;
            if (!/^image\/.+$/i.test(event.currentTarget.files[0].type)) {
                Kdo.utils.notification.error("请选择图片文件");
            }

            var formData = new FormData($(event.currentTarget).parent()[0]);
            // 加锁
            item.uploading = true;
            api.request("uploadFiles", formData, result => {
                if (result.status == 0) {
                    item[type] = result.data[0].file;
                } else {
                    Kdo.utils.notification.error("图片上传失败！");
                }
                // 解锁
                delete item.uploading;
            });
        },
        //保存设置
        btnSubmit () {
            let self = this;
            this.data.fontColor = $("input[name=fontColor]").val();
            this.data.backColor = $("input[name=backColor]").val();

            let tempRows = [], go = true;
            self.data.rows.forEach((item, index) => {
                if(!item.name){
                    Kdo.utils.notification.error('表单标题不能为空哦！');
                    go = false;
                }
                tempRows.push({
                    type: item.category + '_' + item.type,
                    name: item.name,
                    sort: index
                });
            })

            if(!go) return false;

            let _data = {
                relationId: self.$route.query.id,
                controlId: self.controlConfig.controlId,
                fromSetting: tempRows
            };
            // 获取最新控件对象
            self.controlConfig = Kdo.box.utils.getControlConfigById(self.controlConfig.controlId);
            api.request("saveFormSetting", _data, result => {
                if (result.status == 0) {
                    Kdo.utils.notification.success('设置成功！');
                    self.controlConfig.data = Object.assign({}, self.data);

                    Kdo.data.controls.update(self.controlConfig);
                    //操作记录
                    Kdo.featurer.actionLogs.log();
                    //刷新选中模块
                    Kdo.box.utils.refresh();
                } else {
                    Kdo.utils.notification.error(result.message);
                }
            });
            
        },
        // message    
    }
}
</script>

<style>
.custom-form-setting {
    width: 406px;
    padding-left: 20px;
    margin-top: -50px;
}

.custom-form-setting .title {
    width: 70px;
    text-align: right;
}

.custom-form-setting .color-input {
    width: 65px !important;
}

.custom-form-setting .form-row {
    padding-bottom: 10px;
}

.custom-form-setting .btn-submit {
    background-color: #00bad0;
    width: 370px;
    height: 40px;
    margin: 30px 0 0 0px;
}

    .custom-form-setting .btn-submit,
    .custom-form-setting .btn-submit.white i,
    .custom-form-setting .btn-submit:hover,
    .custom-form-setting .btn-submit:focus {
        color: #fff;
    }

.custom-form-setting .btn-setting {
    margin-top: 10px;
    background-color: #c3d4e8;
}

    .custom-form-setting .btn-setting.white,
    .custom-form-setting .btn-setting.white i,
    .custom-form-setting .btn-setting.white:hover,
    .custom-form-setting .btn-setting.white:focus {
        color: #fff;
    }

    .custom-form-setting .btn-setting,
    .custom-form-setting .btn-setting i,
    .custom-form-setting .btn-setting:hover,
    .custom-form-setting .btn-setting:focus {
        color: #2C3D4F;
    }


.custom-form-setting .section {
    width: 370px;
    border: 1px #ccd0d9 solid;
    padding-left: 12px;
    padding-bottom: 12px;
}

    .custom-form-setting .section + .section {
        margin-top: 10px;
    }

    .custom-form-setting .section .actions .action {
        width: 30px;
        height: 30px;
        text-align: center;
    }

        .custom-form-setting .section .actions .action.act-drag {
            cursor: move;
        }

            .custom-form-setting .section .actions .action.act-drag i {
                color: #c3d4e8;
            }

        .custom-form-setting .section .actions .action.act-remove {
            background-color: #c3d4e8;
            cursor: pointer;
        }

            .custom-form-setting .section .actions .action.act-remove i {
                color: #fff;
            }

    .custom-form-setting .section .icon-image-option {
        cursor: pointer;
    }

    .custom-form-setting .section .icon-image-option,
    .custom-form-setting .section .btn-del-option {
        color: #cbd2da;
    }

        .custom-form-setting .section .btn-del-option:hover {
            color: #DC4437;
        }

    .custom-form-setting .section.ui-sortable-helper {
        background-color: #e3eaf4;
    }

        .custom-form-setting .section.ui-sortable-helper .actions .action.act-drag {
            background-color: #c3d4e8;
        }

            .custom-form-setting .section.ui-sortable-helper .actions .action.act-drag i {
                color: #1c374a;
            }

.custom-form-setting .dropdown-menu {
}

    .custom-form-setting .dropdown-menu .menu-item {
        padding: 0px 12px;
    }

        .custom-form-setting .dropdown-menu .menu-item:hover {
            background-color: #c3d4e8;
        }
.custom-form-setting .imgUpload {
    position:absolute;
    width:30px !important;
    height:30px !important;
    display:block;
    top:0px;
    left:0px;
    opacity:0;
    padding-left: 0 !important;
    filter:alpha(opacity=0);
}
.design .propertybar .property-body .custom-form-setting input {
    height: 30px;
    line-height: 30px;
    line-height: 1.628 \9;
    border-radius: 0;
    box-shadow: none;
    padding: 2px 0 0 5px \9;
    vertical-align: middle;
}
.ie11 .design .propertybar .property-body .custom-form-setting input {
    line-height: 15px;
}
.design .propertybar .property-body .custom-form-setting select {
    height: 30px;
    border-radius: 0;
}
.design .propertybar #setting div.column .chooseColor {
    height: 27px !important;
}
    </style>