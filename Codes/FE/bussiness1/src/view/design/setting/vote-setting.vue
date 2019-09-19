<template>
  <div class="vote-setting scroll-box" :class="!!isie ? 'isie': ''">
    <div style="overflow:hidden;"  v-if="!!data">
        <!-- 样式 -->
        <div class="section">
            <div class="section-body" style="max-height: 260px;height: auto;">
                <div class="style-img" :class="{'active': selectStyle == theme.key }" v-for="(theme, index) in styleList" :key="index" @click="switchStyle(theme.key)">
                    <img :src="theme.src" style="width: 78px;height: 78px;"/>
                    <img class="icon-select" src="../../../assets/images/design/h5_selected_icon.png"/>
                </div>
            </div>
        </div>
        <div class="small-title">
            <span style="font-size:14px;margin-right:5px;color:#333;">投票设置</span><span>投票结束后以下信息不可更改</span>
            <span class="line" style="width: 120px; left: 251px;"></span>
        </div>
        <!-- 选项 -->
        <div class="section">
            <div class="single-prize" v-for="(item, index) in data.settingData.itemList" :key="index">
                <div class="prizeImg-wrap" v-if="selectStyle == 'style1' || selectStyle == 'style2'">
                    <form class="imgUploadForm" enctype="multipart/form-data">
                        <input type="file" class="imgUpload" name="img" @change="uploadImg($event,item,'image')"/>
                    </form>
                    <img v-if="!!item.image" :src="item.image"/>
                    <i v-if="!item.image" class="el-icon-plus avatar-uploader-icon"></i>
                    <p class="img-cover">
                        <span v-if="!item.image">选项图片</span>
                        <i v-if="!!item.image" class="el-icon-delete" @click="deleteImg(item, 'image')"></i>
                    </p>
                </div>
                <div class="prizeImg-wrap" v-if="selectStyle == 'style3'">
                    <p style="width: 50px;margin:16px auto;line-height: 1.625;font-size:12px;color:#a6a6a6;">此样式不支持图片</p>
                </div>
                <div class="prize-form">
                    <div class="section-row" style="margin-bottom:10px;">
                        <div class="form-group input-suffix" style="margin-right:10px;">
                            <input class="form-control pull-left" type="text" style="width:253px;" placeholder="请输入选项内容" v-model="item.title"/>
                            <span class="pull-left chooseColor title-color" title="字体颜色">
                                <input :id="createDynamicId(item, 'titleColor')" name="titleColor" class="titleColor chooseColor" :dataKey="item.key" v-model="item.titleColor">
                            </span>
                        </div>
                    </div>
                    <div class="section-row">
                        <div class="form-group pull-left" style="margin-right:10px;">
                            <span class="pull-left" style="margin-right:20px;">票数文字颜色</span>
                        </div>
                        <span class="pull-left chooseColor">
                            <input :id="createDynamicId(item, 'numColor')" name="numColor" class="numColor chooseColor" :dataKey="item.key" v-model="item.numColor">
                        </span>
                        <div class="form-group text-center pull-right" style="width:22px;height:30px;margin:2px 0 0 5px; cursor:pointer;" @click="deleteOption(index)" v-if="data.settingData.itemList.length > 1">
                            <i class="iconfont icon-delete" style="font-size:16px;color:#cedbeb;"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div style="border-bottom:1px solid #dcdfe6;padding-bottom: 22px;margin-bottom: 22px;" v-show="selectStyle != 'style4'">
            <button type="button" class="btn btn-xs btn-setting white" style="width: 112px; height: 26px;background-color: #C3D4E8;color: #fff;font-size: 14px;" @click="addOption">
                <i class="iconfont icon-plus" style="font-size: 12px;color:#fff;margin-right: 1px;"></i>添加投票项
            </button>
        </div>
        <div class="section-row">
            <span class="pull-left" style="margin-right: 10px;">投票按钮 : </span>
            <input class="form-control pull-left" type="text" style="width:136px;border-radius: 0;border: 0;text-align: center;height: 30px;line-height: 30px;"
              maxlength="6" v-model="data.voteBeforeBtn.text" :style="'background-color:' +data.voteBeforeBtn.bg+';color:'+data.voteBeforeBtn.color+';'" />
            <div class="pull-right" style="font-size:12px;">
                <i class="pull-left iconfont icon-font-family" style="width:20px;" title="字体颜色"></i>
                <div class="pull-left chooseColor" title="字体颜色">
                    <input name="beforColor" class="beforColor chooseColor" v-model="data.voteBeforeBtn.color">
                </div>
                <i class="pull-left iconfont icon-font-background-color" style="width:20px; margin-left: 20px;margin-right:10px;"
                    title="字体背景色"></i>
                <div class="pull-left chooseColor" title="字体背景色">
                    <input class="beforBg chooseColor" name="beforBg" v-model="data.voteBeforeBtn.bg">
                </div>
            </div>
        </div>
        <div class="section-row" style="margin:10px 0;">
            <span class="pull-left" style="margin-right: 10px;">已投按钮 : </span>
            <input class="form-control pull-left" type="text" style="width:136px;border-radius: 0;border: 0;text-align: center;height: 30px;line-height: 30px;"
              maxlength="6" v-model="data.voteAfterBtn.text" :style="'background-color:' +data.voteAfterBtn.bg+';color:'+data.voteAfterBtn.color+';'" />
            <div class="pull-right" style="font-size:12px;">
                <i class="pull-left iconfont icon-font-family" style="width:20px;" title="字体颜色"></i>
                <div class="pull-left chooseColor" title="字体颜色">
                    <input name="afterColor" class="afterColor chooseColor" v-model="data.voteAfterBtn.color">
                </div>
                <i class="pull-left iconfont icon-font-background-color" style="width:20px; margin-left: 20px;margin-right:10px;"
                    title="字体背景色"></i>
                <div class="pull-left chooseColor" title="字体背景色">
                    <input class="afterBg chooseColor" name="afterBg" v-model="data.voteAfterBtn.bg">
                </div>
            </div>
        </div>
        <div class="section-row">
            <span class="pull-left" style="margin-right: 10px;">投票限制 : </span>
            <div class="form-row">
                <div class="form-group pull-left" style="margin-right: 20px;">
                    <i class="icon pull-left iconfont" :class="data.settingData.voteLimit == '1' ? 'icon-radio-checkded':'icon-radio'"
                    @click="data.settingData.voteLimit = '1';" style="margin-right: 5px;"></i>
                    <span class="pull-left">每天投一次</span>
                </div> 
                <div class="form-group pull-left">
                    <i class="icon pull-left iconfont" :class="data.settingData.voteLimit == '2' ? 'icon-radio-checkded':'icon-radio'"
                    @click="data.settingData.voteLimit = '2';" style="margin-right: 5px;"></i> 
                    <span class="pull-left">只投一次</span>
                </div> 
                <div class="clearfix"></div>
            </div>
        </div>
        <div class="section-row" style="margin:10px 0;">
            <span class="pull-left" style="margin-right: 10px;">活动时间 : </span>
            <div class="form-group pull-left" style="width: 296px;">
                <el-date-picker
                format="yyyy/MM/dd"
                size="small"
                type="daterange"
                v-model="data.dateArr"
                @change="chooseDate()"
                :default-time="['00:00:00', '23:59:59']"
                range-separator="至"
                start-placeholder="起始日期(含)"
                end-placeholder="结束日期(含)"
                ></el-date-picker>
            </div>
        </div>
        <button class="btn btn-submit blue_bg white" @click="btnSubmit">提 交</button>
    </div>
  </div>
</template>
<script>
import api from 'api'
import eventBus from '../../../utils/eventBus.js'
import styleImg1 from '../../../assets/images/plugin/vote/style1.png'
import styleImg2 from '../../../assets/images/plugin/vote/style2.png'
import styleImg3 from '../../../assets/images/plugin/vote/style3.png'
// import styleImg4 from '../../../assets/images/plugin/vote/style4.png'

export default {
  name: 'vote-setting',
  components: {},
  data() {
    return {
      isie: false,
      selectStyle: 'style1',
      styleList: [ 
        { key: 'style1', src: styleImg1},
        { key: 'style2', src: styleImg2},
        { key: 'style3', src: styleImg3}
      ],
      siginleItem: {
        "title": "投票项",
        "image": "http://resource.tuixb.cn/tuixiaobao/common/goods_default_pic.png",
        "num": "票数",
        "numColor": "#A6A6A7",
        "titleColor": "#333333"
      },
      controlConfig: null,
      data: {
            "selectStyle": "style1",
            "voteBeforeBtn": {},
            "voteAfterBtn": {},
            "dateArr": [],
            "settingData": {
                "itemList": [],
                "voteLimit": "",
                "startTime": "",
                "endTime": ""
            }
        }
    }
  },
  computed: {
  },
  created() {
    console.log('投票插件设置');
    this.isIE() && (this.isie = true);
    eventBus.$on("settingRefresh", this.init);
  },
  mounted() {
      this.init();
  },
  beforeDestroy() {
    eventBus.$off('settingRefresh');
  },
  methods: {
    init(){
        let self = this;
        let _currentBox = Kdo.box.utils.getCurrentBox(),
            _$box = _currentBox.$focusSingleBox;
        if (_currentBox.focusLevel == "single") {
            let _controlConfigs = Kdo.data.controls.get(
            Kdo.box.utils.getBoxControlId(_$box)
            );
            if (_controlConfigs.length > 0) self.controlConfig = _controlConfigs[0];
        }

        self.data = Object.assign({}, self.controlConfig.data);
        self.data.settingData.startTime = !!self.data.settingData.startTime ? self.data.settingData.startTime  : window.timeFormdate(new Date()).split(' ')[0] + ' 00:00:00';
        self.data.settingData.endTime = !!self.data.settingData.endTime ? self.data.settingData.endTime : window.timeFormdate(new Date()).split(' ')[0] + ' 23:59:59';
        self.data.dateArr = [self.data.settingData.startTime, self.data.settingData.endTime];
        self.selectStyle = self.data.selectStyle;
        _.each(self.data.settingData.itemList, (item) => {
            item.key = self.creatOnlyKey();
        });

        setTimeout(() => {
            this.init_color();
        });
        
    },
    isIE() { //ie?
        if (!!window.ActiveXObject || "ActiveXObject" in window)
        return true;
        else
        return false;
    },

    //为每个选项创建一个唯一的key，目的是为了做颜色选择器初始化
    creatOnlyKey(){
        return Math.random().toString(36).substr(3, 10);
    },
    //动态创建id
    createDynamicId(item, type){
        return type +'_'+ item.key;
    },
    // 切换样式
    switchStyle(key) {
        let self = this;
        this.selectStyle = key;
        setTimeout(() => {
            this.init_color();
        })
    },
    //选择时间
    chooseDate() {
      let self = this;
      self.data.settingData.startTime = !!self.data.dateArr
        ? window.timeFormdate(self.data.dateArr[0]).split(' ')[0].replace(/\//g,'-')
        : "";
      self.data.settingData.endTime = !!self.data.dateArr
        ? window.timeFormdate(self.data.dateArr[1]).split(' ')[0].replace(/\//g,'-')
        : "";
    },
    uploadImg(event, item, type){
        var file = event.currentTarget.files[0];
        if (!file || item.uploading) return;
        if (!/^.*\.(?:png|jpg|gif|jpeg)$/i.test(event.currentTarget.files[0].name)) {
            Kdo.utils.notification.error("请选择图片文件");
            return false;
        }
        if (file.size > 5 * 1024 * 1024) {
            Kdo.utils.notification.error("图片文件大小不能超过5M噢");
            return false;
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
     //删除投票项
    deleteOption(index){
        this.data.settingData.itemList.splice(index, 1);
        setTimeout(() => {
            this.init_color();  
        })
    },
    //添加投票项
    addOption(){
        let self = this, obj = JSON.parse(JSON.stringify(self.siginleItem)), _time = this.isIE() ? 50 : 0;
        
        obj.key = this.creatOnlyKey();
        obj.title = obj.title + (this.data.settingData.itemList.length + 1);
        this.data.settingData.itemList.push(obj);
        setTimeout(() => {
            self.init_color(true)($("#titleColor_"+obj.key), "titleColor");
            self.init_color(true)($("#numColor_"+obj.key), "numColor");
        }, _time)
        
    },
    //根据选项key返回选项索引
    getItemIndex(key){
        let len = this.data.settingData.itemList.length, i = 0, index;
        for( ;i<len; i++){
            if(key == this.data.settingData.itemList[i].key){
                index = i;
                break;
            } 
        }
        return index;
    },
    //初始化颜色选择器
    init_color(addOption) {
      var self = this;
      var _init_color = function($el, category, key) {
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
          move: function(color) {
            var dataKey = $(this).attr('dataKey');
            if(!!dataKey){
                self.data.settingData.itemList[self.getItemIndex(dataKey)][category] == color ? color.toHexString() : "none";
            } else {
                self.data[category][key] = color ? color.toHexString() : "none";
            }
          },
          beforeShow: function() {},
          hide: function(color) {
            var dataKey = $(this).attr('dataKey');
            if(!!dataKey){
                self.txtChangeColor(self.data.settingData.itemList[self.getItemIndex(dataKey)], category, color);
            } else {
                self.txtChangeColor(self.data[category], key, color);
            }
          },
          palette: $.spectrum.customOptions.palette
        });
      };
      if(arguments.length > 0) return _init_color;
      _init_color($("input.beforColor"), "voteBeforeBtn", "color");
      _init_color($("input.beforBg"), "voteBeforeBtn", "bg");
      _init_color($("input.afterColor"), "voteAfterBtn", "color");
      _init_color($("input.afterBg"), "voteAfterBtn", "bg");
      _.each(self.data.settingData.itemList, (item,index) => {
          _init_color($("#titleColor_"+item.key), "titleColor");
          _init_color($("#numColor_"+item.key), "numColor");  
      })

    },
    txtChangeColor(obj, key, color) {
      var self = this;
      var hexColor = "transparent";
      if (color) {
        hexColor = color.toHexString();
      }
      obj[key] = hexColor;
    },
     //保存设置
    btnSubmit() {
      let self = this, _data = {}, _go = true, tempRows = [];
      if(self.isSubmitting) return false;
    
      //数据校验
      _.each(self.data.settingData.itemList, (item, index) => {
        if(!!_go && !item.title){
            Kdo.utils.notification.error(
                "第" + (index + 1) + "项选项内容不能为空哦！"
            );
            _go = false;
        } else if(!!_go && item.title.length > 30){
            Kdo.utils.notification.error(
                "第" + (index + 1) + "项选项内容不能超过30个字符哦！"
            );
            _go = false;
        }
        if(!!_go && !item.image && (self.selectStyle == 'style1' || self.selectStyle == 'style2')){
            Kdo.utils.notification.error(
                "第" + (index + 1) + "项选项图片不能为空哦！"
            );
            _go = false;
        }
        tempRows.push({
            title: item.title,           
            image: item.image,
            sort: index
        });
      });

      if(!!_go && !self.data.voteBeforeBtn.text) {
            Kdo.utils.notification.error(
                "请输入投票按钮文字！"
            );
            _go = false;
      }
      if(!!_go && !self.data.voteAfterBtn.text) {
            Kdo.utils.notification.error(
                "请输入已投按钮文字！"
            );
            _go = false;
       }
       if(!!_go && (!self.data.settingData.startTime || !self.data.settingData.endTime)) {
            Kdo.utils.notification.error(
                "请选择活动时间！"
            );
            _go = false;
       }

        if(!_go) return false;

        _data = {
            relationId: self.$route.query.id,
            voteSettingList: [
                {
                    controlId: self.controlConfig.controlId,              
                    voteLimit: self.data.settingData.voteLimit,           //投票限制  1：每天投一次   2：只投一次
                    startTime: self.data.settingData.startTime,          //活动开始时间
                    endTime: self.data.settingData.endTime,            //活动结束时间
                    voteSetting: tempRows
                }
            ]
        } 
    
        self.isSubmitting = true;
        api.request("saveVoteSetting", _data, result => {
            if (result.status == 0) {
                Kdo.utils.notification.success("设置成功！");
                // 获取最新控件对象
                self.controlConfig = Kdo.box.utils.getControlConfigById(
                    self.controlConfig.controlId
                );
                self.data.voteAfterBtnStr = JSON.stringify(self.data.voteAfterBtn);
                self.data.controlId = self.controlConfig.controlId;
                self.controlConfig.data = Object.assign({}, self.data);

                self.controlConfig.data.selectStyle = self.selectStyle;
                switch(self.selectStyle){
                    case 'style1': 
                        self.controlConfig.style.width = self.data.settingData.itemList.length > 1 ? '10rem' : '5rem';
                        break;
                    case 'style2':
                    case 'style3': 
                        self.controlConfig.style.width = '10rem';
                        break;
                }

                console.log(self.controlConfig.data)
                //操作记录
                Kdo.featurer.actionLogs.log();

                Kdo.page.create.load(
                    self.controlConfig,
                    function(config) {
                        Kdo.data.controls.update(self.controlConfig);
                        Kdo.box.utils.refresh();
                    },
                    true
                );
            } else {
                Kdo.utils.notification.error(result.message);
            }
            self.isSubmitting = false;
        });
    }
    
  }
} 
</script>
<style scoped>
.vote-setting {
    height: calc(100vh - 370px);
    overflow-x: hidden;
    margin-top: -70px;
    padding: 0 16px 0 21px;
}
.vote-setting .chooseColor {
  margin: 0 !important;
}
.vote-setting .chooseColor.title-color {
  width: 30px !important;
  height: 30px !important;
}
.vote-setting >>> .chooseColor .sp-replacer {
  margin-bottom: 7px !important;
}
.vote-setting >>> .chooseColor .sp-preview {
    height:18px !important;
}
.vote-setting >>> .chooseColor.title-color .sp-preview {
    width: 20px !important;
    height:20px !important;
}
.vote-setting >>> .chooseColor.title-color .sp-replacer {
    margin-bottom: 2px !important;
}
.vote-setting .el-date-editor--daterange.el-input__inner {
  width: 296px;
}
.vote-setting .el-range-editor--small .el-range-input {
  width: 90px !important;
}
.vote-setting >>> .el-date-editor--daterange .el-range__close-icon {
  color: #c0c4cc;
}
 .vote-setting .section {
        width:100%;
        height: auto;
    }
        .section .section-body {
            margin: 27px 0 0;
        }
            .style-img {
                position: relative;
                display: inline-block;
                margin-right: 17px;
                width: 80px;
                height: 80px;
                cursor: pointer;
            }
            .style-img:last-child {
              margin-right: 0;
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
        .small-title {
            position: relative;
            margin: 20px 0; 
            color: #dcdfe6;
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
            .section-row {
                height: 30px;
                line-height: 30px;
            }
            .prize-form {
                float: left;
                width: 290px;
            }
            .isie.vote-setting .prize-form {
                width: 262px !important;
            }
            .vote-setting .input-suffix {
                position:relative;
                width: 296px;
                height:30px;
                /* margin: 0 24px 0 0; */
                float: left;
            }
            .isie.vote-setting .input-suffix {
                width: 262px !important;
            }
            .vote-setting .input-suffix span {
                position: absolute;
                right: 5px;
                top: 0;
                z-index: 1;
            }
            .vote-setting .color_box{
                width: 30px;
                height: 30px;
                border:2px solid #89ABC7;
            }
            .vote-setting .iconfont.icon-wrong:hover,
            .vote-setting .iconfont.icon-delete:hover {
                color: #ff595a !important;
            }
            .vote-setting  .form-group {
                margin: 0;
            }
.vote-setting .icon-radio {
  color: #c7c9d5 !important;
}
.vote-setting .icon-radio-checkded{
  color: #00b5d1 !important;
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

.vote-setting .btn-submit {
  background-color: #00bad0;
  width: 370px;
  height: 40px;
  margin: 14px 0 0 0px;
}

.vote-setting .btn-submit,
.vote-setting .btn-submit.white i,
.vote-setting .btn-submit:hover,
.vote-setting .btn-submit:focus {
  color: #fff;
}
</style>

