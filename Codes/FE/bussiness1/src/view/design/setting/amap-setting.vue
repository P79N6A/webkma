<template>
<div class="map-setting" style="min-height:500px;">
    <div class="line_div">
        地址：
        <div class="address_box">
            <input class="address_txt" id="address_txt" type="text" style="width: 100%;"/>
        </div>
    </div>
    <div class="line_div">
        缩放：
        <button class="map-setting_btn" :class="{'off':controlConfig.data.zoom == '18'}" @click="setSettingZoomFn(true)">+</button>
        <button class="map-setting_btn" :class="{'off':controlConfig.data.zoom == '3'}" @click="setSettingZoomFn(false)">-</button>
    </div>
</div>
</template>

<script>
import eventBus from '../../../utils/eventBus.js'

export default {
  name: "amap-setting",
  data() {
    return {
      controlConfig: { data: {} }
    };
  },
  mounted() {
      this.init();
  },
  created(){
    eventBus.$on("settingRefresh", this.init);
  },
  beforeDestroy(){
      eventBus.$off('settingRefresh');
  },
  methods: {
    getBox(){
      var self = this,
        _currentBox = Kdo.box.utils.getCurrentBox(),
        _$box = _currentBox.$focusSingleBox;
        self.controlConfig = null;
        if (_currentBox.focusLevel == "single") {
            var _controlConfigs = Kdo.data.controls.get(Kdo.box.utils.getBoxControlId(_$box));
            if (!!_controlConfigs && _controlConfigs.length > 0){
                self.controlConfig = _controlConfigs[0];
            }
        }
    },
    init() {
      var self = this;
        //输入提示
        var autocomplete = new AMap.Autocomplete({input: "address_txt"});
        AMap.event.addListener(autocomplete, "select", function(data){
            self.getBox();
            self.controlConfig.data.center = data.poi.location.lng + "," + data.poi.location.lat;
            self.controlConfig.data.name = data.poi.name;
            
            Kdo.data.controls.update(self.controlConfig);
            //操作记录
            Kdo.featurer.actionLogs.log();
            //刷新选中模块
            Kdo.box.utils.refresh();
        });
        self.getBox();
        $("#address_txt").val(self.controlConfig.data.name);
    },
    setSettingZoomFn(type) {
        var self = this;
        self.getBox();
        if (self.controlConfig.data.zoom == 18 && type || self.controlConfig.data.zoom == 3 && !type) return;
        if (type) {
            self.controlConfig.data.zoom += 1;
        } else {
            self.controlConfig.data.zoom -= 1;
        }
        Kdo.data.controls.update(self.controlConfig);
        //操作记录
        Kdo.featurer.actionLogs.log();
        //刷新选中模块
        Kdo.box.utils.refresh();
    },

    //选择地址
    checkAddressFn(item, event) {
      var self = this;
      self.getBox();
      if (!!event && event.keyCode != 13) return;
      if (!item.location) return;

      self.controlConfig.data.center = item.location.lng + "," + item.location.lat;
      self.controlConfig.data.name = item.name;
      Kdo.data.controls.update(self.controlConfig);
      //操作记录
      Kdo.featurer.actionLogs.log();
      //刷新选中模块
      Kdo.box.utils.refresh();
    }
  }
};
</script>

<style scoped>
.line_div {
  line-height: 35px;
  margin-bottom: 15px;
}

.address_box {
  margin-left: 5px;
  display: inline-block;
  height: 35px;
  width: 290px;
  position: relative;
  border: 1px solid #dcdfe6;
}

.map-setting_btn {
  width: 26px;
  height: 26px;
  display: inline-block;
  margin: 0px 5px;
  background: #60667c;
  color: #fff;
  font: normal 25px/26px "Microsoft YaHei";
}

.map-setting_btn.off {
  background: #d1dde8 !important;
}
</style>
