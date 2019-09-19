<template>
	<div class="game-setting">
		<div class="section-title">设置</div>
        <div class="scroll-box" style="height: calc(100vh - 140px);">
            <div class="small-title" style="margin: 13px;">
                <span>样式</span>
                <span class="line" style="width: 350px;left:36px;"></span>
            </div>
            <!-- 样式 -->
            <div class="section">
                <div class="section-body" style="width: 400px;height: auto;padding-left: 13px;">
                    <div class="style-img" :class="{'active': theme.key == appointSetting.style }" v-for="(theme, index) in themeArr" :key="index" @click="switchTheme(theme)">
                        <img :src="theme.image" style="width: 82px;height: 128px;"/>
                        <img class="icon-select" src="../../../assets/images/design/h5_selected_icon.png"/>
                    </div>
                </div>
            </div>
            <div class="small-title" style="margin: 13px;">
                <span>悬浮框设置</span>
                <span class="tip">以下设置内容悬浮在您活动页面底部</span>
                <span class="line" style="width: 115px;left: 270px;"></span>
            </div>
            <div class="appoint-section-wrap" v-for="(param, index) in appointSetting.data" :key="index">
                <div class="appoint-section-title" @click="param.spread = !param.spread;">
                    <span>预约按钮{{index+1}}</span>
                    <i class="iconfont pull-right black-light" :class="param.spread ? 'icon-zhankai1':'icon-arrow-right-copy'"></i>
                </div>
                <div class="appoint-section-content" v-show="param.spread">
                    <div class="section">
                        <div class="section-row" style="padding-left: 30px;">
                            <label class="pull-left">预约标题</label>
                            <input class="form-control pull-left" type="text" placeholder="请输入内容" style="width:292px;" v-model="param.button_title" maxlength="20"/>
                        </div>
                        <div class="section-row" style="padding-left: 30px;">
                            <label class="pull-left">预约按钮</label>
                            <input class="form-control pull-left" type="text" style="width:138px;border-radius: 0;border: 0;text-align: center;height: 30px;line-height: 30px;"
                            maxlength="6" v-model="param.button_name" :style="'background-color:' +param.btnStyle.bg+';color:'+param.btnStyle.color+';'"/>
                            <div class="pull-left" style="font-size:12px;margin-left: 11px;">
                                <i class="pull-left iconfont icon-font-family" style="width:20px;" title="字体颜色"></i>
                                <div class="pull-left chooseColor" title="字体颜色">
                                    <input :id="createDynamicId(index, 'color')" name="fontColor" class="fontColor chooseColor" v-model="param.btnStyle.color">
                                </div>
                                <i class="pull-left iconfont icon-font-background-color" style="width:20px; margin-left: 20px;margin-right:10px;"
                                title="字体背景色"></i>
                                <div class="pull-left chooseColor" title="字体背景色">
                                    <input :id="createDynamicId(index, 'bg')" class="backColor chooseColor" name="backColor" v-model="param.btnStyle.bg"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="small-title" style="margin: 13px;">
                        <span>预约页设置</span>
                        <span class="tip">以下设置内容隶属于预约页面</span>
                        <span class="line" style="width: 139px;left: 235px;"></span>
                    </div>
                    <div class="section">
                        <div class="section-row">
                            <label class="pull-left">标题</label>
                            <input class="form-control pull-left" type="text" placeholder="请输入内容" style="width: 337px;" v-model="param.title" maxlength="32"/>
                        </div>
                        <div class="section-row">
                            <label class="pull-left">说明</label>
                            <input class="form-control pull-left" type="text" placeholder="请输入内容" style="width: 337px;" v-model="param.remark" maxlength="100"/>
                        </div>
                    </div>
                    <div class="small-title" style="margin: 13px;">
                        <span>预约表单 : </span>
                        <span class="tip" style="margin-left: 5px;">最多添加5项</span>
                    </div>
                    <div class="form-section">
                        <div class="section-row" v-for="(item, index1) in param.fromSetting" :key="index1">
                            <div v-if="item.type == 'name_text'">
                                <input class="form-control pull-left" type="text" placeholder="姓名" style="width: 179px;" v-model="item.name" readonly/>
                            </div>
                            <div v-else-if="item.type == 'phone_text'">
                                <input class="form-control pull-left" type="text" placeholder="手机" style="width: 179px;" v-model="item.name" readonly/>
                                <div style="display:inline-block;float:left;margin-left: 11px;font-size: 12px;" >
                                    <span>是否验证</span> 
                                    <div style="display:inline-block;">
                                        <el-switch
                                            style="display: block"
                                            v-model="param.is_code_slide"
                                            active-color="#00bad0"
                                            inactive-color="#bdbdbd">
                                        </el-switch>
                                    </div>
                                    
                                </div>
                            </div>
                            <div v-else>
                                <input class="form-control pull-left" type="text" placeholder="请输入显示在框内的提示语，例如：您的姓名" style="width: 260px;" v-model="item.name"/>
                                <span class="pull-left" style="margin:0 10px 0 6px;font-size: 12px;" @click="item.isRequire = !item.isRequire;">
                                    <i
                                    class="icon pull-left iconfont"
                                    :class="item.isRequire? 'icon-radio-checkded':'icon-radio'"
                                    ></i>
                                    必填
                                </span>
                                <div
                                    class="form-group text-center pull-left"
                                    style="width:22px;height:30px;margin:2px 0 0 5px; cursor:pointer;"
                                >
                                    <i class="iconfont icon-delete" style="font-size:16px;color:#cedbeb;" @click="formRemove(index, index1)"></i>
                                </div>
                            </div>
                        </div>
                        <div class="section-row" v-if="param.fromSetting.length<4">
                            <button type="button" class="btn btn-xs btn-setting white" style="width: 112px; height: 26px;" @click="formAdd(index)">
                                <i class="iconfont icon-plus" style="font-size:13px;"></i>
                                添加表单项
                            </button>
                        </div>
                    </div>
                    <div class="small-title" style="margin: 13px;">
                        <span>预约支付</span>
                        <div style="display:inline-block;">
                            <el-switch
                                style="display: block"
                                v-model="param.is_code_slide"
                                active-color="#00bad0"
                                inactive-color="#bdbdbd">
                            </el-switch>
                        </div>
                    </div>
                    <div class="section" v-if="param.is_code_slide">
                        <div class="small-title" style="margin: 13px;">
                            <span>预约商品</span>
                            <span class="line" style="width: 310px;left: 62px;"></span>
                        </div>
                        <div class="section-row">
                            <label class="pull-left">商品信息</label>
                            <div class="section-row--input pull-left">
                                <el-input
                                    type="text"
                                    placeholder="请输入商品名称"
                                    v-model="param.goods_name"
                                    maxlength="40"
                                    show-word-limit
                                    >
                                </el-input>
                            </div>
                            
                        </div>
                        <div class="section-row section-row--input" style="margin-left: 79px;">
                            <el-input
                                type="text"
                                placeholder="请输入商品描述"
                                v-model="param.goods_remark"
                                maxlength="120"
                                show-word-limit
                                >
                            </el-input>
                        </div>
                        <div class="section-row" style="margin-left: 79px; height: 70px;padding-left: 0;">
                            <div class="prizeImg-wrap" style="margin: 0 0;">
                                <form class="imgUploadForm" enctype="multipart/form-data">
                                    <input type="file" class="imgUpload" name="img" @change="uploadImg($event,param,'goods_img')"/>
                                </form>
                                <img v-if="!!param.goods_img" :src="param.goods_img"/>
                                <i v-if="!param.goods_img"  class="el-icon-plus avatar-uploader-icon"></i>
                                <p class="img-cover">
                                    <span v-if="!param.goods_img">奖品图片</span>
                                    <i v-if="!!param.goods_img" class="el-icon-delete" @click="deleteImg(param, 'goods_img')"></i>
                                </p>
                            </div>
                            <div class="pull-left" style="width: 243px;">
                                <div class="section-row">
                                    <label class="pull-left">价格</label>
                                    <input class="form-control pull-left" type="text" placeholder="请输入内容" style="width: 188px;" v-model="param.goods_price"/>
                                </div>
                                <div class="section-row">
                                    <label class="pull-left">原价</label>
                                    <input class="form-control pull-left" type="text" placeholder="请输入内容" style="width: 188px;" v-model="param.goods_original_price"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="small-title" style="margin: 13px;">
                        <span>预约成功提示</span>
                        <span class="tip">以下内容会在预约成功页呈现</span>
                        <span class="line" style="width: 126px;left: 247px;"></span>
                    </div>
                    <div class="section">
                        <div class="section-row" style="width: 388px; height: 70px; overflow: hidden;">
                            <el-input
                                type="textarea"
                                placeholder="请输入内容"
                                v-model="param.success_conten"
                                maxlength="500"
                                show-word-limit
                                >
                            </el-input>
                        </div>
                    </div>
                    <div class="section-row" style="height: 80px;">
                        <span class="pull-left">客户二维码</span>
                        <div class="prizeImg-wrap">
                            <form class="imgUploadForm" enctype="multipart/form-data">
                                <input type="file" class="imgUpload" name="img" @change="uploadImg($event,param,'customer_service_code')"/>
                            </form>
                            <img v-if="!!param.customer_service_code" :src="param.customer_service_code"/>
                            <i v-if="!param.customer_service_code"  class="el-icon-plus avatar-uploader-icon"></i>
                            <p class="img-cover">
                                <span v-if="!param.customer_service_code">二维码</span>
                                <i v-if="!!param.customer_service_code" class="el-icon-delete" @click="deleteImg(param, 'customer_service_code')"></i>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
           
            <div style="margin: 0 0 20px 20px;">
                <button class="btn btn-submit blue_bg white" style="width:371px;height:40px;" @click="btnSubmit"> 提  交</button>
            </div>
        </div>
  </div>
</template>
<script>
import api from "api";
import eventBus from '../../../utils/eventBus.js';
export default {
    name: 'appointment-setting' ,
	data() {
		return {
			param: {
				button_title: '', //按钮标题
				button_name: '按钮文字', //按钮名称
				title: '', //预约页标题
				remark: '', //预约页说明
				is_code_slide: true, //是否需要验证码
				is_pay_slide: true, //是否预约支付
				fromSetting: [//表单
                    {"type": "name_text","name": "姓名","sort": 0},
                    {"type": "phone_text","name": "手机","sort": 1},
                    {"type": "default_text","name": "普通文本","sort": 2, "isRequire": true}
                ], 
				goods_name: '', //商品
				goods_remark: '', //商品描述
				goods_price: '', //商品价格
				goods_original_price: '', //商品原价
				goods_img: '', //商品图片
				success_conten: '', //预约成功内容
				customer_service_code: '', //客户二维码
                btnStyle: {
                    color: '#ffffff',
                    bg: 'rgba(0,186,208,1)'
                },
                spread: false
			},
			themeArr: [
				{'key': 'style1', image: 'https://resource.tuixb.cn/beta/00000000-0000-0000-0000-000000000000/KMA/miniapp/apointment_style1.png'},
				{'key': 'style2', image: 'https://resource.tuixb.cn/beta/00000000-0000-0000-0000-000000000000/KMA/miniapp/apointment_style2.png'}
            ],
            appointSetting: {
                bussinessId: '', //商家id
                style: 'style1', //样式
                data: []
            }
		}
	},
	mounted () {
		this.init();
	},
	methods: {
        init() {//初始化，调取接口获取之前的设置，没有设置就默认成样式一
            let self = this, appointmentControlids = [];
            new Promise((resolve, reject) => {
                api.request('getAppointmentByRelationId', {relationId: self.$route.query.id}, result => {
                    if (result.status == 0) {
                        if(!!result.data) {
                            _.each(result.data.data, (item) => {
                                item.is_pay_slide = item.is_pay == 2 ? true : false;
                                item.is_code_slide = item.is_code == 2 ? true : false;
                                appointmentControlids.push(item.controlId);
                            })
                        }
                        self.appointSetting = result.data || self.appointSetting;
                        console.log(JSON.stringify(self.appointSetting));
                        //触发事件，把预约按钮的controlId传至发布页
                        eventBus.$emit('refleshAppointmentControlId', appointmentControlids);
                        resolve(null);
                    } else {
                        reject(new Error(result.message));
                    }
                });
            }).then((result) => {
                if(self.appointSetting.data.length == 0) self.appointSetting.data.push(JSON.parse(JSON.stringify(self.param)));
                self.appointSetting.data.forEach((item, index) => {
                    if(self.appointSetting.style == `style${index + 1}`) {
                        item.spread = true;
                    } else {
                        item.spread = false;
                    }
                });
                setTimeout(() => {
                    self.init_color();
                });
            }).catch((err) => {
                Kdo.utils.messenger.error(err);
            })
            
        },
        switchTheme(theme) {
            let self = this;
            if(theme.key == 'style2' && this.appointSetting.data.length < 2) this.appointSetting.data.push(JSON.parse(JSON.stringify(self.param)));
            if(theme.key == 'style1' && this.appointSetting.data.length == 2) this.appointSetting.data.pop();
            setTimeout(() => {
                this.init_color();
            });
            this.appointSetting.style = theme.key;
        },
        //动态创建id
        createDynamicId(index, type){
            return type +'_'+ index;
        },
        //初始化颜色选择器
        init_color() {
            var self = this;
            var _init_color = function($el, key, _index) {
                $el.spectrum({
                allowEmpty: true,
                color: self.appointSetting.data[_index].btnStyle[key],
                showInput: true,
                showPalette: true,
                showSelectionPalette: false,
                showAlpha: false,
                showButtons: false,
                maxPaletteSize: 10,
                preferredFormat: "hex",
                localStorageKey: "spectrum.demo",
                move: function(color) {
                    self.appointSetting.data[_index].btnStyle[key] = color ? color.toHexString() : "none";
                },
                beforeShow: function() {},
                hide: function(color) {
                    self.txtChangeColor(key, color, _index);
                },
                palette: $.spectrum.customOptions.palette
                });
            };
            _.each(self.appointSetting.data, (item,index) => {
                _init_color($("#color_"+index), "color", index);
                _init_color($("#bg_"+index), "bg", index);  
            })
        },
        txtChangeColor(key, color, _index) {
            var self = this;
            var hexColor = "transparent";
            if (color) {
                hexColor = color.toHexString();
            }
            self.appointSetting.data[_index].btnStyle[key] = hexColor;
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
        //删除图片
        deleteImg(item, type){
            item[type] = '';
        },
        //新增表单项
        formAdd(index){
            let self = this;
            let item = {"type": "default_text","name": "普通文本","sort": self.appointSetting.data[index].fromSetting.length, "isRequire": true };
            this.appointSetting.data[index].fromSetting.push(Object.assign({}, item));
        },
        //表单项删除
        formRemove(index, index1){
            this.appointSetting.data[index].fromSetting.splice(index1, 1);
        },
        // 表单验证
        formValidation(){
            let self = this, data = this.appointSetting.data;

            var _go = true;
            $.each(data, function(index, item){
                if(_go) {
                    if(!item.button_title && _go){
                        Kdo.utils.notification.error(`预约按钮${index + 1}的预约标题不能为空哦！`);
                        _go = false;
                    } else if(item.button_title.length > 20 && _go){
                        Kdo.utils.notification.error(`预约按钮${index + 1}的预约标题最大长度为20位字符哦！`);
                        _go = false;
                    }

                    if(!item.button_name && _go){
                        Kdo.utils.notification.error(`预约按钮${index + 1}的按钮文字不能为空哦！`);
                        _go = false;
                    } else if(item.button_name.length > 6 && _go){
                        Kdo.utils.notification.error(`预约按钮${index + 1}的按钮文字最大长度为6位字符哦！`);
                        _go = false;
                    }

                    if(!item.title && _go){
                        Kdo.utils.notification.error(`预约按钮${index + 1}的预约页标题不能为空哦！`);
                        _go = false;
                    } else if(item.title.length > 32 && _go){
                        Kdo.utils.notification.error(`预约按钮${index + 1}的预约页标题最大长度为32位字符哦！`);
                        _go = false;
                    }

                    if(!item.remark && _go){
                        Kdo.utils.notification.error(`预约按钮${index + 1}的预约页说明不能为空哦！`);
                        _go = false;
                    } else if(item.remark.length > 100 && _go){
                        Kdo.utils.notification.error(`预约按钮${index + 1}的预约页标题最大长度为100位字符哦！`);
                        _go = false;
                    }

                    for(var i=2; i<item.fromSetting.length; i+=1) {
                        if(!item.fromSetting[i].name && _go){
                            Kdo.utils.notification.error(`预约按钮${index + 1}的预约表单第${i+1}项不能为空哦！`);
                            _go = false;
                        } else if(item.fromSetting[i].name.length > 15 && _go){
                            Kdo.utils.notification.error(`预约按钮${index + 1}的预约表单第${i+1}项最大长度为15位字符哦！`);
                            _go = false;
                        } 
                    }
                    
                    if(item.is_pay) {//需要预约支付
                        if(!item.goods_name && _go){
                            Kdo.utils.notification.error(`预约按钮${index + 1}的商品名称不能为空哦！`);
                            _go = false;
                        }
                        if(!item.goods_remark && _go){
                            Kdo.utils.notification.error(`预约按钮${index + 1}的商品描述不能为空哦！`);
                            _go = false;
                        }
                        if(!item.goods_price && _go){
                            Kdo.utils.notification.error(`预约按钮${index + 1}的商品价格不能为空哦！`);
                            _go = false;
                        }
                        if(!item.goods_original_price && _go){
                            Kdo.utils.notification.error(`预约按钮${index + 1}的商品原价不能为空哦！`);
                            _go = false;
                        }
                        if(!item.goods_img && _go){
                            Kdo.utils.notification.error(`预约按钮${index + 1}的商品图片不能为空哦！`);
                            _go = false;
                        }
                    }

                    if(!item.success_conten && _go){
                        Kdo.utils.notification.error(`预约按钮${index + 1}的预约成功提示不能为空哦！`);
                        _go = false;
                    } else if(item.success_conten.length > 100 && _go){
                        Kdo.utils.notification.error(`预约按钮${index + 1}的预约页标题最大长度为100位字符哦！`);
                        _go = false;
                    }
                }
            });

            
            if(!_go) return false;

            return true;
        },
        //随机生成controlId
        createControlId(len) {
            return 'control_' + Math.random().toString(36).substr(3, len);
        },
        //保存设置
        btnSubmit () {
            let self = this,
            _data = {}, controlIds = [];

            if(!self.submitting && !self.formValidation()){
                return false;
            }

            // 数据组装
            _data = {
               relationId: self.$route.query.id,
               business_id: localStorage.businessId,
               style: self.appointSetting.style,
               data: self.appointSetting.data
            }

            _.each(_data.data, (item) => {
                item.controlId = self.createControlId(15);
                controlIds.push(item.controlId);
                item.is_pay = item.is_pay_slide ? 2 : 1;
                item.is_code = item.is_code_slide ? 2 : 1;
            });

            self.submitting = true;
            api.request("saveAppointment", _data, result => {
                if (result.status == 0) {
                   Kdo.utils.notification.success('设置成功！');
                   //触发事件，把预约按钮的controlId传至发布页
                   eventBus.$emit('refleshAppointmentControlId', controlIds);
                } else {
                    Kdo.utils.notification.error(result.message);
                }
                self.submitting = false;
            });
            
        },
	}

}
</script>
<style scoped>
.el-range-editor--small.el-input__inner{
    width: 292px !important;
}
.design .propertybar .el-date-editor--small .el-range__close-icon{
    color: #c0c4cc !important;
    font-size: 16px !important;
}
.design .property-group-body{
    padding:0;
}
.game-setting {
    height: calc(100vh - 100px);
    overflow: hidden;
}
    .game-setting .section {
        width:100%;
        height: auto;
    }
        .section-title {
            padding-left: 20px;
            height: 40px;
            line-height: 40px;
            background-color: #cfdbe7;
        }
        .section-title i {
            font-size: 16px;
            margin: 12px 10px 0;
            cursor: pointer;
        }
        .section .section-body {
            margin: 17px 0;
        }
            .style-img {
                position: relative;
                display: inline-block;
                margin-right: 20px;
                width: 84px;
                height: 130px;
                cursor: pointer;
                border: 1px solid transparent;
            }
            .style-img .icon-select{
                display: none;
            }
            .style-img.active {
                border: 1px solid #00BAD0;
            }
            .style-img.active .icon-select{
                position: absolute;
                bottom: 0;
                right: 0;
                display: block;
            }
            .section-row {
                height: 30px;
                line-height: 30px;
                padding-left: 13px;
                margin-bottom: 9px;
            }
            .section-row label {
                width: auto;
                float: left;
                font-weight: normal;
                margin-right: 10px;
            } 
            .small-title {
                position: relative;
                margin: 30px 0 20px; 
                color:rgba(60,74,85,1);
                font-size: 14px;
            } 
            .small-title .tip {
                color:rgba(177,191,205,1);
                font-size: 12px;
            }
            .small-title .line {
                height: 1px;
                display: block;
                position: absolute;
                top: 14px;
                border-bottom: 1px solid #dcdfe6;
            }
            .form-section {
                width: 380px;
                height: auto;
                margin: 0 auto;
                box-sizing: border-box;
            }
            .form-section .section-row {
                padding-left: 4px;
                box-sizing: border-box;
            }
            .single-prize {
                overflow: hidden;
                margin-bottom: 15px;
            }
            .prizeImg-wrap {
                position: relative;
                width: 70px;
                height: 70px;
                line-height: 60px;
                text-align: center;
                float: left;
                border: 1px dotted #dcdfe6;
                border-radius: 5px;
                margin-left: 10px;
                margin-top: 5px;
            }
            .prizeImg-wrap img {
                width: 100%;
                height: 100%;
            }
            .prizeImg-wrap i {
                color: #c8d1d8;
                cursor: pointer;
            }
            .prizeImg-wrap .img-cover{
                width: 100%;
                height: 30px;
                line-height: 30px;
                position: absolute;
                bottom: 0;
                z-index: 1;
                text-align: center;
                background-color: rgba(0,0,0,.3);
            }
            .prizeImg-wrap .img-cover{
                color: #fff; 
            }
            .prizeImg-wrap .imgUpload {
                position:absolute;
                width: 70px !important;
                height: 40px !important;
                display:block;
                top:0px;
                left:0px;
                opacity:0;
                filter:alpha(opacity=0);
            }
            .prize-form {
                float: left;
                width: 280px;
            }

            .section-row .empty:hover,.section-row .btn-del-option:hover {
                color: #ff8480 !important;
            }
            .game-setting .btn-submit,
            .game-setting .btn-submit.white i,
            .game-setting .btn-submit:hover,
            .game-setting .btn-submit:focus {
                color: #fff;
            }

            .game-setting .btn-setting {
                margin-top: 5px;
                background-color: #c3d4e8;
            }

            .game-setting .btn-setting.white,
            .game-setting .btn-setting.white i,
            .game-setting .btn-setting.white:hover,
            .game-setting .btn-setting.white:focus {
                color: #fff;
            }

            .game-setting .btn-setting,
            .game-setting .btn-setting i,
            .game-setting .btn-setting:hover,
            .game-setting .btn-setting:focus {
                color: #2C3D4F;
            }

            .game-setting .blue_bg {
                background-color: #00bad0;
            }
            .game-setting .input-suffix {
                position:relative;
                width: 100%;
                height:70px;
                margin: 0 24px 0 0;
                float: left;
            }
            .game-setting .input-suffix span {
                position: absolute;
                right: 23px;
                bottom: 0;
                z-index: 1;
            }
            .game-setting .iconfont.icon-checkbox{
                float: left;
                margin: 1px 5px 0 0;
            }
            .game-setting .icon-checkbox{
                color: #cfdbe6;
            }
            .game-setting .icon-checkbox-checked{
                color: #00bad0;
            }

            .game-setting .iconfont.icon-wrong {
                position: absolute;
                left: 320px;
                top: 1px;
                font-size: 14px;
                color: #becfd9 !important;
                cursor: pointer;
            }
            .game-setting .iconfont.icon-wrong:hover,
            .game-setting .icon-delete:hover {
                color: #ff595a !important;
            }
            .game-setting .icon-radio {
                color: #c7c9d5 !important;
            }
            .game-setting .icon-radio-checkded{
                color: #00b5d1 !important;
            }
            .game-setting .icon-radio,
            .game-setting .icon-radio-checkded {
                font-size: 14px !important;
                margin: 2px 3px 0 6px;
            }
            .game-setting >>> .el-textarea__inner {
                height: 70px;
                padding: 6px 9px 15px;
                border-radius: 0;
                border-color: #ccc;
            }
            .game-setting >>> .el-textarea .el-input__count {
                bottom: 1px;
                right: 10px;
                width: 96%;
                height: 20px;
                line-height: 15px;
                text-align: right;
                box-sizing: border-box;
            }
            .section-row--input {
                width: 308px;
                padding: 0;
            }
            .game-setting .section-row--input >>> .el-input__inner {
                width: 308px ;
                height: 30px ;
                line-height: 30px ;
                background-color: #fff;
                border-radius: 0;
                border-color: #ccc;
            }
            .game-setting .section-row--input >>> .el-input__suffix {
                height: 28px;
                line-height: 28px;
                right: 2px;
                top: 1px;
            }  
            .game-setting .section-row--input >>> .el-input__inner:focus {
                background-color: #fff;
                border-color: rgb(66, 159, 255);
            } 
            .game-setting .appoint-section-wrap {
                width: 401px;
                height: auto;
                padding-left: 3px;
                background-color: #f1f3fc;
                -webkit-box-sizing: border-box;
                box-sizing: border-box;
                margin-bottom: 10px;
            }
            .game-setting .appoint-section-title {
                background-color: #ffffff;
                height: 30px;
                line-height: 30px;
                padding-left: 5px;
                margin-bottom: 10px;
                cursor: pointer;
            }
            .game-setting .black-light {
                font-size: 16px !important;
                color: #bec0cd !important;
            }
.design .propertybar .property-body input {
    height: 30px;
    line-height: 30px;
    line-height: 1.628 \0;
    border-radius: 0;
    box-shadow: none;
    padding: 2px 0 0 5px \0;
    vertical-align: middle;
}
.ie11 .design .propertybar .property-body input {
    line-height: 15px;
}
.design .propertybar .property-body select {
    height: 30px;
    border-radius: 0;
    box-shadow: none;
}
.design .propertybar .property-body div.column .chooseColor {
    margin-top: 0;
}
</style>

