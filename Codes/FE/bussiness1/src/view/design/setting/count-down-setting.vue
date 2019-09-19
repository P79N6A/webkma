<template>
    <div class="countdown-setting">
        <div class="title">倒计时</div>
        <div class="line_div">
            数字
        <div class="address_box">
            <input class="address_txt" id="numColor_input" disabled="disabled" v-model="data.numColor" type="text" style="width: 80px;"/>
            <div class="color_box"  id="numColor" :style="{'background-color': data.numColor}"></div>
        </div>
        </div>
        <div class="line_div">
            单位
        <div class="address_box">
            <input class="address_txt" id="companyColor_input" disabled="disabled" v-model="data.companyColor" type="text" style="width: 80px;"/>
            <div class="color_box"  id="companyColor" :style="{'background-color': data.companyColor}"></div>
        </div>
        </div>
        <div class="line_div">
            背景
            <div class="address_box">
            <input class="address_txt" id="bgColor_input" disabled="disabled" v-model="data.bgColor" type="text" style="width: 80px;"/>
            <div class="color_box" id="bgColor" :style="{'background-color':data.bgColor}"></div>
            </div>
        </div>
        <div class="line_div">
            日期
            <div class="address_box">               
                <el-date-picker
                    class="data-picker"
                    v-model="data.dateTime"
                    type="datetime"
                    @change="dataTimePickerFn"
                    placeholder="选择日期时间"
                    :picker-options="pickerOptions0"
                    default-time="12:00:00">
                    </el-date-picker>
            </div>
        </div>
    </div>
</template>
<script>
import api from 'api'
import eventBus from '../../../utils/eventBus.js'

export default {
    name: 'count-down-setting',
    data() {
        return {
            data: {
                "numColor": "#ffffff",
                "companyColor": "#000000",
                "bgColor": "#000000",
                "dateTime": ""
            },
            controlConfig: null,
            pickerOptions0: {
                disabledDate(time) {
                    return time.getTime() < Date.now();
                }
            }  
        }
    },
    computed: {
    },
    mounted() {
        this.init();
    },
    beforeDestroy(){
        eventBus.$off('settingRefresh');
    },
    methods: {
        init(){
            var _currentBox = Kdo.box.utils.getCurrentBox(),
            _$box = _currentBox.$focusSingleBox;

            if (_currentBox.focusLevel == "single") {
                var _controlConfigs = Kdo.data.controls.get(Kdo.box.utils.getBoxControlId(_$box));
                if (_controlConfigs.length > 0) {
                    this.controlConfig = _controlConfigs[0];
                }
            }

            this.data = this.controlConfig.data;
            this.init_color_selector('numColor');
            this.init_color_selector('companyColor');
            this.init_color_selector('bgColor');
        },
        init_color_selector(type){
            let self = this;
            $("#"+type).spectrum({
                allowEmpty: true,
                color: self.data[type],
                showInput: true,
                showPalette: true,
                showSelectionPalette: false,
                showAlpha: false,
                showButtons: false,
                maxPaletteSize: 10,
                preferredFormat: "hex",
                hideAfterPaletteSelect: true,
                localStorageKey: "spectrum.demo",
                move: function (color) {
                    var _color = type == 'numColor' ? '#ffffff' : '#000000';
                    if (!!color) {
                        _color = color.toHexString();
                    }
                    self.data[type] = _color;
                    self.setSettingColorFn();
                },
                change: function (color) {
                    var _color = type == 'numColor' ? '#ffffff' : '#000000';
                    if (!!color) {
                        _color = color.toHexString();
                    }
                    self.data[type] = _color;
                    self.setSettingColorFn();
                },
                beforeShow: function () {
                },
                palette: $.spectrum.customOptions.palette
            });
        },
        dataTimePickerFn(val){
            let self = this;
            if (!!val) {
              self.data.dateTime = window.timeFormdate(val);
              self.controlConfig.data.dateTime = window.timeFormdate(val);
              self.setSettingColorFn();
            }

        },
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
            Kdo.data.controls.update(self.controlConfig);
            //操作记录
            Kdo.featurer.actionLogs.log();
            //刷新选中模块
            Kdo.box.utils.refresh();
        }
    }
}
</script>
<style>
.countdown-setting>.title{
      line-height: 26px;
      height: 26px;
      margin: 10px 0;
    }
    .countdown-setting .line_div{
      line-height: 30px;
      margin-bottom: 20px;
    }
    .countdown-setting .address_box{
      margin-left: 10px;
      float: right;
      height: 30px;
      width: 310px;
      position: relative;
    }
    .countdown-setting .address_box>input{
      float: left;
    }
    .countdown-setting .address_box>.color_box{
      width: 30px;
      height: 30px;
      border:2px solid #89ABC7;
      float: left;
    }
    .design .propertybar .property-body .countdown-setting  input{
        height: 30px;
        line-height: 30px;
    }
    .design .propertybar .property-body .countdown-setting .el-date-editor.el-input{
        width: 300px;
    }
    .design .propertybar .property-body .countdown-setting input.el-input__inner{
        width: 300px;
        padding-left: 30px !important;
    }
    .design .propertybar .property-body .countdown-setting .el-input__icon{
        margin-top: -5px;
        font-size: 16px;
    }
    .design .propertybar .property-body .countdown-setting .el-date-editor .el-icon-circle-close{
        color: rgb(206, 219, 235) !important;
    }
</style>

