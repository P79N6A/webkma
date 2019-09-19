<template>
  <div class="game-setting scroll-box">
    <!-- 样式 -->
    <div class="section">
        <div class="section-title">样式</div>
        <div class="section-body scroll-box" style="width: 400px;max-height: 260px;height: auto;padding-left: 10px;">
            <div class="style-img" :class="{'active': theme.id == data.theme.id }" v-for="(theme, index) in themeArr" :key="index" @click="switchTheme(theme)">
                <img :src="theme.themeLogo" style="width: 108px;height: 178px;"/>
                <img class="icon-select" src="../../../assets/images/design/h5_selected_icon.png"/>
            </div>
        </div>
    </div>
    <!-- 玩法设置 -->
    <div class="section">
        <div class="section-title">玩法设置</div>
        <div class="section-body" style="width: 403px;height: auto;padding: 0 20px;" v-if="controlConfig.isGame == true">
            <div class="section-row" style="margin-bottom:10px;">
                <label class="pull-left">游戏时长 :</label>
                <div class="form-group input-suffix">
                    <input class="form-control pull-left" type="text" placeholder="输入数字" style="width:100px;padding-right:27px;" v-model="data.controlData.gameTime" @keyup="data.controlData.gameTime=data.controlData.gameTime.replace(/\D/g,'')" @afterpaste="data.controlData.gameTime=data.controlData.gameTime.replace(/\D/g,'')" maxlength="15"/>
                    <span>秒</span>
                </div>
                <label class="pull-left">抽奖间隔 :</label>
                <div class="form-group">
                    <select class="form-control" style="width:99px;border:1px solid #ccc;" v-model="data.intervalDay">
                        <option value="1">1天</option>
                        <option value="2">2天</option>
                        <option value="3">3天</option>
                        <option value="4">4天</option>
                        <option value="5">5天</option>
                        <option value="6">6天</option>
                        <option value="7">7天</option>
                    </select>
                </div>
            </div>
            <p class="section-row">
                <label class="pull-left">抽奖分数线 :</label>
                <input class="form-control pull-left" type="text" placeholder="输入数字" style="width:85px;margin-right:24px;" v-model="data.score" @keyup="data.score=data.score.replace(/\D/g,'')" @afterpaste="data.score=data.score.replace(/\D/g,'')" maxlength="15"/>
                <label class="pull-left">抽奖次数 :</label>
                <input class="form-control pull-left" type="text" placeholder="输入数字" style="width:99px;" v-model="data.intervalDrawTime" @keyup="data.intervalDrawTime=data.intervalDrawTime.replace(/\D/g,'')" @afterpaste="data.intervalDrawTime=data.intervalDrawTime.replace(/\D/g,'')" maxlength="15"/>
            </p>
        </div> 
        <div class="section-body" style="width: 403px;height: auto;padding: 0 20px;" v-if="controlConfig.isGame == false">
            <div class="section-row">
                <label class="pull-left">抽奖次数 :</label>
                <input class="form-control pull-left" type="text" placeholder="输入数字" style="width:100px;margin-right:24px;" v-model="data.intervalDrawTime" @keyup="data.intervalDrawTime=data.intervalDrawTime.replace(/\D/g,'')" @afterpaste="data.intervalDrawTime=data.intervalDrawTime.replace(/\D/g,'')" maxlength="15"/>
                <label class="pull-left">抽奖间隔 :</label>
                <div class="form-group">
                    <select class="form-control" style="width:99px;border:1px solid #ccc;" v-model="data.intervalDay">
                        <option value="1">1天</option>
                        <option value="2">2天</option>
                        <option value="3">3天</option>
                        <option value="4">4天</option>
                        <option value="5">5天</option>
                        <option value="6">6天</option>
                        <option value="7">7天</option>
                    </select>
                </div>
            </div>
        </div>
    </div>
    <!-- 抽奖设置 -->
    <div class="section">
        <div class="section-title">抽奖设置</div>
        <div class="section-body scroll-box" style="width: 403px;height: 260px;padding-left:20px;">
            <div class="section-row" style="margin-bottom: 10px;" v-if="controlConfig.isGame == true">
                <label class="pull-left">抽奖形式 :</label>
                <div class="form-group">
                    <select class="form-control" style="width:290px;border:1px solid #ccc;" v-model="data.controlData.drawStyle">
                        <option value="redEnvelope">红包</option>
                        <option value="golden">砸金蛋</option>
                        <option value="draw">抽签</option>
                    </select>
                </div>
            </div>
            <div class="section-row">
                <label class="pull-left">活动时间 :</label>
                <div class="form-group pull-left" style="width: 292px;">
                    <el-date-picker
                        format="yyyy/MM/dd"
                        size="small"
                        v-model="data.actTime"
                        type="daterange"
                        @change="chooseDate"
                        :default-time="['00:00:00', '23:59:59']"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </div>
            </div>
            <div class="small-title">
                <span>奖项</span>
                <span class="line" style="width: 322px;left:36px;"></span>
            </div>
            <div class="single-prize" v-for="(item, index) in data.prizes" :key="index">
                <div class="prizeImg-wrap">
                    <form class="imgUploadForm" enctype="multipart/form-data">
                        <input type="file" class="imgUpload" name="img" @change="uploadImg($event,item,'icon')"/>
                    </form>
                    <img v-if="!!item.icon" :src="item.icon"/>
                    <i v-if="!item.icon" class="el-icon-plus avatar-uploader-icon"></i>
                    <p class="img-cover">
                        <span v-if="!item.icon">奖品图片</span>
                        <i v-if="!!item.icon" class="el-icon-delete" @click="deleteImg(item, 'icon')"></i>
                    </p>
                </div>
                <div class="prize-form">
                    <p class="section-row" style="margin-bottom:10px;">
                        <input class="form-control pull-left" type="text" style="width:95px;margin-right:10px;" placeholder="一等奖" v-model="item.optionName"/>
                        <input class="form-control pull-left" type="text" style="width:175px;" placeholder="奖品(12个字)" v-model="item.prizeName"/>
                    </p>
                    <div class="section-row">
                        <input class="form-control pull-left" type="text" style="width:95px;margin-right:10px;" placeholder="数量" v-model="item.amount" @keyup="item.amount=item.amount.replace(/\D/g,'')" @afterpaste="item.amount=item.amount.replace(/\D/g,'')"/>
                        <div class="form-group input-suffix" style="margin-right:10px;">
                            <input class="form-control pull-left" type="text" style="width:100px;" placeholder="中奖概率" v-model="item.rate"/>
                            <span>%</span>
                        </div>
                        <span class="empty pull-left black-light" @click="emptyContent(item)">清空</span>
                        <div class="form-group text-center pull-left" style="width:25px; height: 30px; padding-top:2px;margin:0 0 0 10px; cursor:pointer;" @click="removePrize(index)" v-if="!!data.theme && data.theme.awardCount == -1">
                            <i class="iconfont icon-delete-second btn-del-option" style="font-size:16px;color:#cedbeb;"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <button type="button" class="btn btn-xs btn-setting white" style="width: 70px; height: 30px;" @click="addPrize" v-if="!!data.theme && data.theme.awardCount == -1">
                    <i class="iconfont icon-plus" style="font-size:14px;"></i>
                </button>
            </div>
            <!-- 兑奖方式 -->
            <div class="small-title">
                <span>兑奖方式</span>
                <span class="line" style="width: 300px; left: 62px;"></span>
            </div>
            <!-- 线上兑奖 -->
            <div class="option-block">
                <div style="margin:20px 0 10px;">
                    <i class="iconfont icon-checkbox" :class="{'icon-checkbox-checked': onlineRewards}"  @click="onlineRewards = !onlineRewards"></i>
                    <span>线上兑奖</span>
                </div>
                <div v-if="onlineRewards == true">
                    <div class="small-title" style="margin-top:0;">
                        <span>表单信息</span>
                        <span class="font-12 black-light">中奖用户需要提供的信息</span>
                        <span class="line" style="width: 158px; left: 202px;"></span>
                    </div>
                    <div class="section-row" v-for="(singleForm, index) in data.controlData.fromSetting" :key="'form'+index">
                        <input class="form-control pull-left" type="text" style="width:223px;margin-right:10px;" placeholder="输入表单名称" v-model="singleForm.name"/>
                        <div class="form-group pull-left">
                            <select class="form-control" style="width:100px;border:1px solid #ccc;" v-model="singleForm.category">
                                <option value="default">普通文本</option>
                                <option value="name">姓名</option>
                                <option value="number">纯数字</option>
                                <option value="phone">手机号码</option>
                                <option value="email">邮箱</option>
                                <option value="identitycard">身份证号</option>
                            </select>
                        </div>
                        <div class="form-group text-center pull-left" style="width:25px; height: 30px; padding-top:2px;margin-left: 5px; cursor:pointer;" @click="formRemove(index)">
                            <i class="iconfont icon-delete-second btn-del-option" style="font-size:16px;color:#cedbeb;"></i>
                        </div>
                    </div>
                    <div>
                        <button type="button" class="btn btn-xs btn-setting white" style="width: 70px; height: 30px;" @click="formAdd">
                            <i class="iconfont icon-plus" style="font-size:14px;"></i>
                        </button>
                        <div style="display:inline-block;float:right;margin:5px 44px 0 0;" >
                            <div style="display:inline-block;">
                                <el-switch
                                    style="display: block"
                                    v-model="smsFeedback"
                                    active-color="#00bad0"
                                    inactive-color="#bdbdbd">
                                </el-switch>
                            </div>
                            <span>短信反馈</span>
                        </div>
                    </div>
                    <!-- 短信反馈 -->
                    <div class="option-block" style="margin-top:20px;" v-if="!!smsFeedback">
                        <div class="section-row" style="margin-bottom:10px;" v-for="(single, index) in feedBackformList" :key="'Feedbackform'+index"> 
                            <input class="form-control pull-left" type="text" style="width:334px;" placeholder="联系电话" v-model="single.value"/>
                            <div class="form-group text-center pull-left" style="width:25px; height: 30px; padding-top:2px; margin-left:5px; cursor:pointer;" @click="feedbackformRemove(index)">
                                <i class="iconfont icon-delete-second btn-del-option" style="font-size:16px;color:#cedbeb;"></i>
                            </div>
                        </div>
                        <div v-if="feedBackformList.length < 10">
                            <button type="button" class="btn btn-xs btn-setting white" style="width: 70px; height: 30px;" @click="feedbackformAdd">
                                <i class="iconfont icon-plus" style="font-size:14px;"></i>
                            </button>
                        </div> 
                    </div>
                </div>
            </div>
             
            <!-- 线下兑奖 -->
            <div class="option-block">
                <div style="margin:20px 0 10px;">
                    <i class="iconfont icon-checkbox" :class="{'icon-checkbox-checked': offlineRewards}" @click="offlineRewards = !offlineRewards"></i>
                    <span>线下兑奖</span>
                </div>
                <div v-if="!!offlineRewards">
                    <div class="section-row" style="margin-bottom:10px;" v-for="(offlineText, index) in offlineTextList" :key="'offlineText'+index">
                        <input class="form-control pull-left" type="text" style="width:100px;margin-right:10px;" placeholder="标题" v-model="offlineText.title"/>
                        <input class="form-control pull-left" type="text" style="width:224px;" placeholder="内容" v-model="offlineText.value"/>
                        <i class="iconfont icon-delete-second btn-del-option" style="font-size:16px;color:#cedbeb;margin-left: 8px;" @click="removeOfflineText(index)" v-if='index > 0'></i>
                    </div>
                    <div>
                        <button type="button" class="btn btn-xs btn-setting white" style="width: 70px; height: 30px;" @click="offlineTextAdd">
                            <i class="iconfont icon-plus" style="font-size:14px;"></i>
                        </button>
                    </div> 
                </div>
            </div>
            <div class="small-title">
                <span>活动规则</span>
                <span class="line" style="width: 300px; left: 62px;"></span>
            </div>
            <div class="">
                <div class="prizeImg-wrap pull-left">
                    <form class="imgUploadForm" enctype="multipart/form-data">
                        <input type="file" class="imgUpload" name="img" @change="uploadImg($event, data.controlData.qrcode, 'url')"/>
                    </form>
                    <img v-if="!!data.controlData.qrcode && !!data.controlData.qrcode.url" :src="!!data.controlData.qrcode && data.controlData.qrcode.url"/>
                    <i class="el-icon-plus avatar-uploader-icon" v-if="!!data.controlData.qrcode && !data.controlData.qrcode.url"></i>
                    <p class="img-cover">
                        <span class="font-12" v-if="!!data.controlData.qrcode && !data.controlData.qrcode.url">您的二维码</span>
                        <i class="el-icon-delete" v-if="!!data.controlData.qrcode && !!data.controlData.qrcode.url" @click="deleteImg(data.controlData.qrcode, 'url')"></i>
                    </p>
                </div>
                <div class="form-group pull-left">
                    <textarea class="form-control" placeholder="请输入活动规则" maxlength="40" style="width:282px;height:70px;border-radius: 0;" v-model="data.controlData.rule"></textarea>
                </div>
            </div>
        </div>
    </div>
    <div style="margin: 0 0 20px 20px;">
        <button class="btn btn-submit blue_bg white" style="width:371px;height:40px;" @click="btnSubmit"> 提  交</button>
    </div>
  </div>
</template>

<script>
import api from "api";
import eventBus from '../../../utils/eventBus.js';
import slideBtn from "../../../components/slide-btn";
export default {
    name: 'game-setting',
    components: {
        slideBtn
    },
    data() {
        return {
            data: {
                theme: "",
                prizes: [],
                controlData: {
                    fromSetting: [],
                    gameTime: "",
                    drawStyle: "",  
                    qrcode: {
                        url: ""
                    }, 
                    rule: "",
                    newAttribute: {
                        smsFeedback: true, //短信反馈开关
                        onlineRewards: true, //线上兑奖
                        offlineRewards: true, //线下兑奖 
                        feedBackformList: [],
                        offlineTextList: [] //线下兑奖输入文字列表
                    }
                }
            },
            prize: {
                "optionName": "",
                "prizeName": "",
                "amount": "",
                "rate": "",
                "icon": ""
            },
            form:{
                "type": "text",
                "category": "default",
                "name": "普通文本",
                "value": ""
            },
            feedBackform: {
                "type": "text",
                "category": "phone",
                "name": "联系电话",
                "value": ""
            },
            offlineTextItem: {
                "title": "",
                "value": ""
            },
            themeArr: [],
            smsFeedback: false, //短信反馈开关
            feedBackformList: [],
            onlineRewards: true, //线上兑奖
            offlineRewards: true, //线下兑奖 
            offlineTextList: [{
                "title": "",
                "value": ""
            }], //线下兑奖输入文字列表           
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
            //判断类型
            self.controlConfig.isGame = self.controlConfig.key.indexOf('small_game') != -1 ? true : false;

            //配置增加1.3属性及数据
            if(!self.controlConfig.data.controlData.newAttribute) {
                self.controlConfig.data.controlData.newAttribute = {
                    smsFeedback: false, //短信反馈开关
                    onlineRewards: true, //线上兑奖
                    offlineRewards: true, //线下兑奖 
                    feedBackformList: [{ //联系电话列表
                        "type": "text",
                        "category": "phone",
                        "name": "联系电话",
                        "value": ""
                    },{ 
                        "type": "text",
                        "category": "phone",
                        "name": "联系电话",
                        "value": ""
                    }],
                    offlineTextList: [{ //线下兑奖输入文字
                        "title": "",
                        "value": ""
                    }]
                }
            }
            self.getGameThemeList(() => {
                if(typeof self.controlConfig.data.theme == 'string'){
                    self.controlConfig.data.theme = self.themeArr.filter((item) => {
                        return item.theme == self.controlConfig.data.theme;
                    })[0];
                }

                self.data = Object.assign({}, self.controlConfig.data);
                self.data.actStartTime = !!self.data.actStartTime ? self.data.actStartTime : window.timeFormdate(new Date()).split(' ')[0] + ' 00:00:00';
                self.data.actEndTime = !!self.data.actEndTime ? self.data.actEndTime : window.timeFormdate(new Date()).split(' ')[0] + ' 23:59:59';
                self.data.actTime = [self.data.actStartTime, self.data.actEndTime];
                if(self.data.prizes.length == 0) self.initPrizeArr(self.controlConfig.data.theme.awardCount);

                self.smsFeedback = self.data.controlData.newAttribute.smsFeedback;
                self.feedBackformList = self.data.controlData.newAttribute.feedBackformList;
                self.onlineRewards = self.data.controlData.newAttribute.onlineRewards;
                self.offlineRewards = self.data.controlData.newAttribute.offlineRewards;
                self.offlineTextList = self.data.controlData.newAttribute.offlineTextList;
            });
             
        },
        //获取主题列表
        getGameThemeList(cb){
            let self = this;
            api.request("getGameThemeList", {pluginKey: self.controlConfig.key, pageIndex: 1, pageSize: 100}, result => {
                if (result.status == 0) {
                    self.themeArr = result.data.list;
                } else {
                    Kdo.utils.notification.error(result.message);
                }
                !!cb && cb();
            });
        },
        // 切换主题
        switchTheme (theme){
            let self = this;
            this.data.theme = theme;
            self.data.prizes = [];
            self.initPrizeArr(theme.awardCount);
        },
        //初始化奖项数组
        initPrizeArr(num){
            let self = this;
            if(num == -1){
                self.data.prizes.push(Object.assign({}, this.prize));
            } else {
                for(let i=0; i<num; i++){
                    self.data.prizes.push({
                        "optionName": "奖项"+(i+1),
                        "prizeName": "美国"+(i+1)+"日游",
                        "amount": "9999",
                        "rate": "10",
                        "icon": ""
                    })
                }
            }
        },
        //新增奖项
        addPrize(){
            this.data.prizes.push(Object.assign({}, this.prize));
        },
        //清空奖项
        emptyContent(item){
            item["optionName"] = "";
            item["prizeName"] = "";
            item["amount"] = "";
            item["rate"] = "";
            item["icon"] = "";
        },
        //删除奖项
        removePrize(index){
            this.data.prizes.splice(index, 1);
        },
        //新增表单项
        formAdd(){
            this.data.controlData.fromSetting.push(Object.assign({},this.form));
        },
        //表单项删除
        formRemove(index){
            this.data.controlData.fromSetting.splice(index, 1);
        },
        //选择时间
        chooseDate(){
            let self = this;
            this.data.actStartTime = !!self.data.actTime ? window.timeFormdate(self.data.actTime[0]) : '';
            this.data.actEndTime = !!self.data.actTime ? window.timeFormdate(self.data.actTime[1]) : '';
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
        // 表单验证
        formValidation(){
            let self = this;
            if(!self.data.controlData.gameTime && self.controlConfig.isGame){
                Kdo.utils.notification.error("请输入游戏时长！");
                return false;
            } else if(parseInt(self.data.controlData.gameTime) > 1200){
                Kdo.utils.notification.error("游戏时长范围为1~1200！");
                return false;
            }
            if(!self.data.score && self.controlConfig.isGame){
                Kdo.utils.notification.error("请输入游戏抽奖分数线！");
                return false;
            }
            if(!self.data.intervalDrawTime){
                Kdo.utils.notification.error("请输入游戏抽奖次数！");
                return false;
            }else if(!/^\+?[1-9]\d*$/.test(self.data.intervalDrawTime)){
                Kdo.utils.notification.error("游戏抽奖次数为不小于1的正整数！");
                return false;
            }

            if( !this.checkPrize() )return false;
            
            var _go = true;
            if(!!self.onlineRewards){//线上兑奖
                $.each(self.data.controlData.fromSetting,function(index, item){
                    if(!item.name && _go){
                        Kdo.utils.notification.error('中奖信息的表单名称不能为空哦！');
                        _go = false;
                    } else if(item.name.length > 4 && _go){
                        Kdo.utils.notification.error('中奖信息的表单名称最大长度为4位字符哦！');
                        _go = false;
                    }
                });
                if(self.data.controlData.fromSetting.length == 0 && _go){
                    Kdo.utils.notification.error('至少需要添加一条中奖信息的表单噢！');
                    _go = false;
                }
                if(!!self.smsFeedback && _go){//短信反馈
                    var obj = {};
                    if(self.feedBackformList.length < 1 && _go){
                        Kdo.utils.notification.error('至少需要填写一个短信反馈的手机号码！');
                        _go = false;
                    } else if(_go){
                        $.each(self.feedBackformList,function(index, item){
                            if(!item.value && _go){
                                Kdo.utils.notification.error('短信反馈第'+(index+1)+'项,手机号码不能为空！');
                                _go = false;
                            } else if(!/^1[0-9]{10}$/.test(item.value) && _go){
                                Kdo.utils.notification.error('短信反馈第'+(index+1)+'项,手机号码格式不正确！');
                                _go = false;
                            }
                            if(!obj[item.value] && _go){
                                obj[item.value] = 1;
                            } else if(_go){
                                Kdo.utils.notification.error('短信反馈第'+(index+1)+'项,手机号码重复,请仔细检查！');
                                _go = false;
                            }
                        });
                    }
                }
            }

            if(!!self.offlineRewards && _go){//线下兑奖
                $.each(self.offlineTextList,function(index, item){
                    if(!item.title && _go){
                        Kdo.utils.notification.error('线下兑奖第'+(index+1)+'个表单项标题不能为空！');
                        _go = false;
                    } else if(item.title.length > 4 && _go){
                        Kdo.utils.notification.error('线下兑奖第'+(index+1)+'个表单项标题不能超过4个字符！');
                        _go = false;
                    }
                    if(!item.value && _go){
                        Kdo.utils.notification.error('线下兑奖第'+(index+1)+'个表单项内容不能为空！');
                        _go = false;
                    } else if(item.value.length > 34 && _go){
                        Kdo.utils.notification.error('线下兑奖第'+(index+1)+'个表单项内容不能超过35个字符！');
                        _go = false;
                    }
                });
            }
            
            if(!self.onlineRewards && !self.offlineRewards && _go){
                Kdo.utils.notification.error('至少选择一种兑奖方式！');
                _go = false;
            }
            if(!_go) return false;

            return true;
        },
        checkPrize () {//奖项验证
            let totalRate = 0,
                isCanSubmit = true,
                self = this;

            self.finalPrizes = $.grep(self.data.prizes,function(n){ return n.optionName != '';});
            
            if(self.finalPrizes.length < 1 ){
                Kdo.utils.notification.error('最少设置一条奖项内容！');
	  			return false;
            }

            $.each(self.data.prizes, function (index, item) {
                if(!(item.optionName == '' && item.prizeName == '' && item.amount == '' && item.rate == '') && isCanSubmit){
                    if (item.optionName == '' && isCanSubmit) {
                        Kdo.utils.notification.error('第' + (index + 1) + '条奖项，奖项名称不能为空！');
                        isCanSubmit = false;
                        return false;
                    } else if (item.optionName.length > 12 && isCanSubmit) {
                        Kdo.utils.notification.error('第' + (index + 1) + '条奖项，奖项名称限制不超过12个字！');
                        isCanSubmit = false;
                        return false;
                    }
                    if (item.prizeName == '' && isCanSubmit) {
                        Kdo.utils.notification.error('第' + (index + 1) + '条奖项，奖品不能为空！');
                        isCanSubmit = false;
                        return false;
                    } else if (item.prizeName.length > 12 && isCanSubmit) {
                        Kdo.utils.notification.error('第' + (index + 1) + '条奖项，奖品限制不超过12个字！');
                        isCanSubmit = false;
                        return false;
                    }
                    if (Number(item.amount) > 0 && !/\./.test(item.amount)) {
                    } else if(isCanSubmit){
                        Kdo.utils.notification.error('第' + (index + 1) + '条奖项，奖品数量必须为正整数！');
                        isCanSubmit = false;
                        return false;
                    }
                    if(!item.rate && isCanSubmit && isCanSubmit){
                        Kdo.utils.notification.error('第' + (index + 1) + '条奖项，中奖率不能为空！');
                        isCanSubmit = false;
                        return false;
                    } else if((!/^((\d{1,2}(\.\d{1,2})?)|100|100.00)$/.test(item.rate) || parseFloat(item.rate) <= 0) && isCanSubmit){
                        Kdo.utils.notification.error('中奖率为大于0小于等于100，且小数点后最多只能有2位的数！');
                        isCanSubmit = false;
                        return false;
                    }

                    totalRate += parseInt(item.rate);
                }
            });
            
            if (totalRate > 100 && isCanSubmit) {
                Kdo.utils.notification.error('所有奖项中奖率之和不能超过100%！');
                isCanSubmit = false;
                return false;
            } else if( self.finalPrizes.length < self.data.theme.awardCount && totalRate == 100 && isCanSubmit){
                Kdo.utils.notification.error('奖项未设满时中奖率之和应小于100%！');
                isCanSubmit = false;
                return false;
            } else if( self.finalPrizes.length == self.data.theme.awardCount && totalRate != 100 && isCanSubmit){
                Kdo.utils.notification.error('奖项设满时中奖率之和应等于100%！');
                isCanSubmit = false;
                return false;
            }
            return isCanSubmit;
        },
        //保存设置
        btnSubmit () {
            let self = this,
            _data = {};

            
            if(!self.submitting && !self.formValidation()){
                return false;
            }

            self.finalPrizes.forEach((item, index) => {
                item.sort = index+1;
            })

            let tempRows = [];
            self.data.controlData.fromSetting.forEach((item, index) => {
                tempRows.push({
                    type: item.category + '_' + item.type,
                    name: item.name,
                    sort: index
                });
            }) 

            let phoneList = [];
            if(self.onlineRewards && self.smsFeedback){
                self.feedBackformList.forEach((item, index) => {
                    phoneList.push(item.value)
                })
            }

            // 数据组装
            _data = {
                relationId: self.$route.query.id,
                controlId: self.controlConfig.controlId,
                activePluginType: 2,
                prizes: self.finalPrizes,
                intervalDrawTime: self.data.intervalDrawTime,//每人抽奖次数
                intervalDay: self.data.intervalDay, //每人抽奖间隔
                actStartTime: self.data.actStartTime,
                actEndTime: self.data.actEndTime,
                score: self.data.score, //抽奖游戏积分限制
                fromSetting: self.onlineRewards ? tempRows : null,
                cashType: (self.onlineRewards && self.offlineRewards) ? 3 : (self.onlineRewards ? 1 : 2),
                businessContact: self.offlineRewards ? JSON.stringify(self.offlineTextList) : null,
                smsFeedback: phoneList.length > 0 ? phoneList : null
            }
            self.submitting = true;
            api.request("savePluginSetting", _data, result => {
                if (result.status == 0) {
                   Kdo.utils.notification.success('设置成功！');

                    $.each(self.data.controlData.fromSetting, function(index, item){
                        item.id = 'form_' + index;
                        item.sort = index;
                    })
                    
                    self.data.controlData.newAttribute.smsFeedback = self.smsFeedback;
                    self.data.controlData.newAttribute.onlineRewards = self.onlineRewards;
                    self.data.controlData.newAttribute.offlineRewards = self.offlineRewards;
                    self.data.controlData.newAttribute.feedBackformList = self.onlineRewards && self.smsFeedback ? self.feedBackformList : [Object.assign({},self.feedBackform),Object.assign({},self.feedBackform)];
                    self.data.controlData.newAttribute.offlineTextList = self.offlineRewards ? self.offlineTextList : [Object.assign({},self.offlineTextItem)];
                    self.controlConfig.data = self.data;

                    
                    Kdo.data.controls.update(self.controlConfig);
                    //操作记录
                    Kdo.featurer.actionLogs.log();
                    //刷新选中模块
                    Kdo.box.utils.refresh();
                } else {
                    Kdo.utils.notification.error(result.message);
                }
                self.submitting = false;
            });
            
        },
        //线下兑奖表单删除
        removeOfflineText (index) {
            this.offlineTextList.splice(index, 1);
        },
        //线下兑奖添加
        offlineTextAdd (){
            this.offlineTextList.push(Object.assign({},this.offlineTextItem));
        },
        //短信反馈表单增加
        feedbackformAdd (){
            this.feedBackformList.push(Object.assign({},this.feedBackform));
        },
        //短信反馈表单删除
        feedbackformRemove (index){
           this.feedBackformList.splice(index, 1);
        }    
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
    overflow-x: hidden;
}
    .game-setting .section {
        width:100%;
        height: auto;
    }
        .section .section-title {
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
            margin: 20px 0;
        }
            .style-img {
                position: relative;
                display: inline-block;
                margin: 0 0 10px 10px;
                width: 110px;
                height: 180px;
                cursor: pointer;
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
            }
            .section-body label {
                width: auto;
                float: left;
                font-weight: normal;
                margin-right: 5px;
            } 
            .small-title {
                position: relative;
                margin: 30px 0 20px; 
            } 
            .small-title .line {
                height: 1px;
                display: block;
                position: absolute;
                top: 14px;
                border-bottom: 1px solid #dcdfe6;
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
                margin-right: 10px;
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
                width:100px;
                height:30px;
                margin: 0 24px 0 0;
                float: left;
            }
            .game-setting .input-suffix span {
                position: absolute;
                right: 5px;
                top: 0;
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
</style>