<template>
  <div class="fabulous-setting">
    <div class="fabulous-type">
      <div class="type-item" :class="data.style==1?'show-current-box':''" @click="data.style = 1; data.fabulousText = '送花'; setSettingColorFn()">
        <img src="../../../assets/images/plugin/fabulous/fabulous-setting-p1.png">
        <img class="icon" src="../../../assets/images/cash-recharge-icon.png" />
      </div>
      <div class="type-item margin18" :class="data.style==2?'show-current-box':''" @click="data.style = 2;data.fabulousText = '喜欢'; setSettingColorFn();">
        <img src="../../../assets/images/plugin/fabulous/fabulous-setting-p2.png">
        <img class="icon" src="../../../assets/images/cash-recharge-icon.png" />
      </div>
      <div class="type-item" :class="data.style==3?'show-current-box':''" @click="data.style = 3; data.fabulousText = '赞'; setSettingColorFn()">
        <img src="../../../assets/images/plugin/fabulous/fabulous-setting-p3.png">
        <img class="icon" src="../../../assets/images/cash-recharge-icon.png" />
      </div>
    </div>
    <div class="set-title">
      <span class="font-13">设置</span>
      <span class="line"></span>
    </div>
    <div class="section-row">
      <div class="pull-left">样式设置 :&nbsp;</div>
      <div>
        <input class="form-control pull-left" type="text" style="width:136px;border-radius: 0;border: 0;text-align: center;height: 30px;line-height: 30px;"
        maxlength="4" v-model="data.fabulousText" @blur="setSettingColorFn()" :style="'background-color:' +data.backgroundColor+';color:'+data.color+';'" />
        <div class="pull-left" style="font-size:12px;">
          <i class="pull-left iconfont icon-font-family" style="width:20px;" title="字体颜色"></i>
          <div class="pull-left chooseColor" title="字体颜色">
            <input name="fontColor" class="fontColor chooseColor" v-model="data.color" @blur="txtChangeColor('fontColor')">
          </div>
          <i class="pull-left iconfont icon-font-background-color" style="width:20px; margin-left: 20px;margin-right:10px;"
            title="字体背景色"></i>
          <div class="pull-left chooseColor" title="字体背景色">
            <input class="backColor chooseColor" name="backColor" v-model="data.backgroundColor" @blur="txtChangeColor('backColor')">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from 'api'
import eventBus from '../../../utils/eventBus.js'

export default {
  name: 'fabulous-setting',
  components: {},
  data() {
    return {
      data: {
          "style": 1,
          "fabulousText": "送花",
          "color": "#FFFFFF",
          "iconColor": "#cfdbe7",
          "backgroundColor": "#cfdbe7"
      },
      controlConfig: null
    }
  },
  mounted() {
    this.init()
  },
  // beforeDestroy(){
  //   eventBus.$off('settingRefresh');
  // },
  methods: {
    //初始化配置
    init(cb) {
      var self = this;
      var _currentBox = Kdo.box.utils.getCurrentBox(),
        _$box = _currentBox.$focusSingleBox;
      if (_currentBox.focusLevel == "single") {
        var _controlConfigs = Kdo.data.controls.get(Kdo.box.utils.getBoxControlId(_$box));
        if (_controlConfigs.length > 0) {
          this.controlConfig = _controlConfigs[0];
          !!cb && cb
        }
      }
      this.data = this.controlConfig.data;
      self.init_color();
    },
    //初始化颜色选择器
    init_color() {
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
            self.setSettingColorFn();
          },
          hide: function(color) {
            self.txtChangeColor(key, color);
          },
          beforeShow: function () { },
          palette: $.spectrum.customOptions.palette
        });
      }; 
      _init_color($("input.fontColor"), "color");
      _init_color($("input.backColor"), "backgroundColor");
    },
    txtChangeColor(key, color) {
      var self = this;
      var hexColor = "transparent";
      if (color) {
        hexColor = color.toHexString();
      }
      self.data[key] = hexColor;
    },
    //更新模板数据
    setSettingColorFn() {
      var self = this;
      var _currentBox = Kdo.box.utils.getCurrentBox(),
      _$box = _currentBox.$focusSingleBox;

      if (_currentBox.focusLevel == "single") {
          var _controlConfigs = Kdo.data.controls.get(Kdo.box.utils.getBoxControlId(_$box));
          if (_controlConfigs.length > 0) {
              this.controlConfig = _controlConfigs[0];
          }
      }
      this.controlConfig.data = this.data;
      //更新数据
      Kdo.data.controls.update(self.controlConfig);
      //操作记录
      Kdo.featurer.actionLogs.log();
      //刷新选中模块
      Kdo.box.utils.refresh();
    }
  }
} 
</script>
<style scoped>
  .margin18{
    margin: 0 18px;
  }
  .hide{
    display: none;
  }
  .property-body .item-row{
    position: absolute!important;
    top: 453px;
    left: 48px;
  }
  .fabulous-setting{
    margin-top: 17px;
  }
  .fabulous-setting .fabulous-type{
    height: 72px;
    padding: 15px 0px 20px 12px;
  }
  .fabulous-setting .fabulous-type div{
    float: left;
    position: relative;
  }
  .fabulous-setting .fabulous-type .type-item{
    border: 3px solid #FFFFFF;
    padding: 1px;
  }
  .fabulous-setting .fabulous-type .type-item.show-current-box{
    position: relative;
    border-color: #00BBD1;
  }
  .fabulous-setting .fabulous-type .type-item .icon{
    display: none;
  }
  .fabulous-setting .fabulous-type .type-item.show-current-box .icon{
    display: block;
    position: absolute;
    bottom: 0;
    right: 0;
  }
  .fabulous-setting .set-title{
    margin-bottom: 18px;
    }
  .fabulous-setting .set-title .line{
    display: inline-block;
    width: 336px;
    height: 1px;
    background-color: #dbe2e8;
    position: relative;
    top: -4px;
    left: 5px;
  }
  .fabulous-setting .section-row {
    height: 30px;
    line-height: 30px;
    margin-bottom: 15px;
  }
  .fabulous-setting .section-row .form-control{
    margin-right: 16px;
  }
  .fabulous-setting .section-row .form-control:focus {
    box-shadow: none;
  }
</style>

