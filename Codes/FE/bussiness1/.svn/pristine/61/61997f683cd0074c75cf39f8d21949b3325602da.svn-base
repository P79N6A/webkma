<template>
  <div class="goods-setting">
    <div class="clearfix">
      <div class="col-md-6 type">
        <div class="col-md-6 type-item" :class="controlData.style==1?'on':''" @click="controlData.style = 1;wrapW='10rem'">
          <img class="pic" src="../../../assets/images/plugin/goods/goods-setting-p01.png" />
          <img class="icon" src="../../../assets/images/cash-recharge-icon.png" />
        </div>
        <div class="col-md-6 type-item" :class="controlData.style==2?'on':''" @click="controlData.style = 2;wrapW='5rem'">
          <img class="pic" src="../../../assets/images/plugin/goods/goods-setting-p02.png" />
          <img class="icon" src="../../../assets/images/cash-recharge-icon.png" />
        </div>
      </div>
      <div class="col-md-6" style="margin-top: 26px;">
        <div class="pull-left" style="margin-right: 10px;">底色</div>
        <div class="pull-left chooseColor" title="模块背景色">
          <input class="goodsBackgroundColor chooseColor" name="goodsBackgroundColor" v-model="controlData.backgroundColor"
            @blur="txtChangeColor('backgroundColor')">
        </div>
      </div>
    </div>
    <div class="goods">
      <div class="title">
        <span>商 品</span>
        <div></div>
      </div>
      <div class="info">
        <div class="goods-pic">
          <form class="imgUploadForm" enctype="multipart/form-data">
            <input type="file" class="imgUpload" name="img" @change="uploadImg($event)" :disabled="role!='2'" />
          </form>
          <img v-if="!!goodsInfo.image" :src="goodsInfo.image" width="70" height="70" />
          <i v-if="!goodsInfo.image" class="el-icon-plus avatar-uploader-icon"></i>
          <p class="img-cover" v-if="role=='2'">
            <i class="el-icon-delete" @click="goodsInfo.image=''"></i>
          </p>
        </div>
        <div class="goods-form">
          <div class="section-row">
            <input class="form-control pull-left" type="text" style="width: 253px;height: 28px;border-radius: 0;"
              placeholder="商品名称" v-model="goodsInfo.title" :disabled="role!='2'" />
            <div class="pull-left chooseColor" title="字体颜色">
              <input class="titleColor chooseColor" name="titleColor" v-model="controlData.titleColor" @blur="txtChangeColor('titleColor')">
            </div>
          </div>
          <div class="section-row">
            <input class="form-control pull-left" type="text" style="width: 253px;height: 28px;border-radius: 0;"
              placeholder="商品价格" v-model="goodsInfo.price" :disabled="role!='2'" />
            <div class="pull-left chooseColor" title="字体颜色">
              <input class="priceColor chooseColor" name="priceColor" v-model="controlData.priceColor" @blur="txtChangeColor('priceColor')">
            </div>
          </div>
          <div class="section-row">
            <input class="form-control pull-left" type="text" style="width:136px;border-radius: 0;border: 0;text-align: center;height: 30px;line-height: 30px;"
              maxlength="6" v-model="controlData.btnConfig.btnText" :style="'background-color:' +controlData.btnConfig.btnBColor+';color:'+controlData.btnConfig.btnColor+';'" />
            <div class="pull-right" style="font-size:12px;">
              <i class="pull-left iconfont icon-font-family" style="width:20px;" title="字体颜色"></i>
              <div class="pull-left chooseColor" title="字体颜色">
                <input name="fontColor" class="fontColor chooseColor" v-model="controlData.btnConfig.btnColor" @blur="txtChangeColor('fontColor')">
              </div>
              <i class="pull-left iconfont icon-font-background-color" style="width:20px; margin-left: 20px;margin-right:10px;"
                title="字体背景色"></i>
              <div class="pull-left chooseColor" title="字体背景色">
                <input class="backColor chooseColor" name="backColor" v-model="controlData.btnConfig.btnBColor" @blur="txtChangeColor('backColor')">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button class="btn btn-submit blue_bg white" @click="saveSetting()">提 交</button>
  </div>
</template>
<script>
import api from 'api'
import eventBus from '../../../utils/eventBus.js'

export default {
  name: 'goods-setting',
  components: {},
  data() {
    return {
      html: '',
      wrapW: '',
      controlConfig: null,
      controlData: null,
      goodsInfo: {
        id: "",
        title: "",
        image: "",
        price: ""
      },
      role: "",
      isInitArr: [],
      kid: ""
    }
  },
  computed: {
  },
  created() {
    this.init();
    eventBus.$on("settingRefresh", this.init);
  },
  mounted() {
    // this.init();
    this.init_color();
    eventBus.$on("settingRefresh", this.init_color);
  },
  beforeDestroy() {
    eventBus.$off('settingRefresh');
  },
  methods: {
    init_all() {
      this.init(this.init_color());
    },
    init(cb) {
      var self = this;
      this.kid = this.$route.query.kid || "";
      this.role = localStorage.role;//1：商家；2：设计师
      var _currentBox = Kdo.box.utils.getCurrentBox(),
        _$box = _currentBox.$focusSingleBox;
      if (_currentBox.focusLevel == "single") {
        var _controlConfigs = Kdo.data.controls.get(Kdo.box.utils.getBoxControlId(_$box));
        if (_controlConfigs.length > 0) {
          this.controlConfig = _controlConfigs[0];

          this.controlData = this.controlConfig.data;
          this.wrapW = this.controlConfig.style.width;

          if (!this.controlConfig.data.goodsInfo.id) {
            this.goodsInfo = this.controlConfig.data.goodsInfo;
          } else {
            this.kid = this.goodsInfo.kid = this.controlConfig.data.goodsInfo.kid;
            if(self.isInitArr.length > 0){
              var isInit = _.filter(self.isInitArr, (n) => { return n.key == Kdo.box.utils.getBoxControlId(_$box);});
            } else {
              var isInit = [];
            }

            if(isInit.length == 0){
              this.getGoodsInfo((cb) => {
                this.isInitArr.push({
                  key: Kdo.box.utils.getBoxControlId(_$box),
                  goodsId: this.controlData.goodsInfo.id,
                  goodsInfo: {
                    id: self.controlData.goodsInfo.id,
                    title: cb.goods_name,
                    price: cb.goods_price,
                    image: cb.goods_original_img_small,
                    kid: self.kid
                  }
                });
                this.saveSetting(true);
              })
            } else {
              this.goodsInfo = isInit[0].goodsInfo;
            }
            
           
          }
          console.log('init');
          // debugger
          !!cb && cb
        }
      }
    },
    getGoodsInfo(cb) {
      let _this = this;
      api.request('getGoodsInfo', { goodsIds: _this.controlConfig.data.goodsInfo.id, manuscriptId: _this.$route.query.id, kid:_this.kid })
        .then(function (result) {
          if (result.status == 0 && result.data.goodsList.length == 1) {
            cb(result.data.goodsList[0]);
          } else {
            _this.$message.error(result.message)
          }
        })
        .catch(function (error) {
          _this.$message.error(error.message);
        });
    },
    uploadImg(event) {
      let _this = this;
      var file = event.currentTarget.files[0];
      if (!file) return;
      if (!/^image\/.+$/i.test(event.currentTarget.files[0].type)) {
        Kdo.utils.notification.error("请选择图片文件");
      }

      var formData = new FormData($(event.currentTarget).parent()[0]);
      // 加锁
      // item.uploading = true;
      api.request("uploadFiles", formData, result => {
        if (result.status == 0) {
          _this.goodsInfo.image = result.data[0].file;
        } else {
          Kdo.utils.notification.error("图片上传失败！");
        }
        // 解锁
        // delete item.uploading;
      });
    },
    saveSetting(init) {
      var self = this;
      var _currentBox = Kdo.box.utils.getCurrentBox(),
        _$box = _currentBox.$focusSingleBox;
      if (_currentBox.focusLevel == "single") {
        var _controlConfigs = Kdo.data.controls.get(Kdo.box.utils.getBoxControlId(_$box));
        if (_controlConfigs.length > 0) {
          this.controlConfig = _controlConfigs[0];
        }
      }

      this.controlData.btnConfig.btnColor = $("input[name=fontColor]").val();
      this.controlData.btnConfig.btnBColor = $("input[name=backColor]").val();

      if(self.isInitArr.length > 0){
          var selecrControl = _.filter(self.isInitArr, (n) => { return n.key == Kdo.box.utils.getBoxControlId(_$box);});
          if(selecrControl.length == 0) return false;
          this.goodsInfo = selecrControl[0].goodsInfo;
        }
        if (!this.goodsInfo.title) {
          Kdo.utils.notification.error("请填写商品名称！");
          return false;
        } else if (!this.goodsInfo.price) {
          Kdo.utils.notification.error("请填写商品价格！");
          return false;
        } else if (!this.controlData.btnConfig.btnText) {
          Kdo.utils.notification.error("请填写按钮文案！");
          return false;
        } else if (!this.goodsInfo.image) {
          Kdo.utils.notification.error("请上传商品图片！");
          return false;
        }

        this.controlData.goodsInfo = this.goodsInfo;
        this.controlConfig.data = this.controlData;
        this.controlConfig.style.width = this.wrapW;

        Kdo.data.controls.update(this.controlConfig);
        Kdo.featurer.actionLogs.log();
        !init && Kdo.box.utils.refresh();
        !init && Kdo.utils.notification.success("设置成功！");
      
    },
    init_color() {
      var self = this;
      var _init_color = function ($el, key) {
        let _color = key.indexOf("btn") != -1 ? self.controlData.btnConfig[key] : self.controlData[key];
        $el.spectrum({
          allowEmpty: true,
          color: _color,
          showInput: true,
          showPalette: true,
          showSelectionPalette: false,
          showAlpha: false,
          showButtons: false,
          maxPaletteSize: 10,
          preferredFormat: "hex",
          localStorageKey: "spectrum.demo",
          move: function (color) {
            key.indexOf("btn") != -1 ? self.controlData.btnConfig[key] : self.controlData[key] = color ? color.toHexString() : "none";
          },
          beforeShow: function () { },
          hide: function (color) {
            self.txtChangeColor(key, color);
          },
          palette: $.spectrum.customOptions.palette
        });
      };
      _init_color($("input.goodsBackgroundColor"), "backgroundColor");
      _init_color($("input.titleColor"), "titleColor");
      _init_color($("input.priceColor"), "priceColor");
      _init_color($("input.fontColor"), "btnColor");
      _init_color($("input.backColor"), "btnBColor");
    },
    txtChangeColor(key, color) {
      var self = this;
      var hexColor = "transparent";
      if (color) {
        hexColor = color.toHexString();
      }
      self.controlData.btnConfig[key] = hexColor;
    },
  }
} 
</script>
<style scoped>
.goods-setting .chooseColor {
  margin: 0 !important;
  height: 28px !important;
}
.goods-setting .chooseColor .sp-replacer {
  margin-bottom: 5px !important;
}
.goods-setting .goods {
  margin-top: 40px;
}
.goods-setting .goods .title {
  height: 35px;
  position: relative;
}
.goods-setting .goods .title > span {
  position: absolute;
  top: -14px;
  width: 38px;
  background-color: #fff;
}
.goods-setting .goods .title > div {
  border-top: 1px #dedede solid;
}
.goods-setting .goods .info .goods-pic {
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
.goods-setting .goods .info .goods-pic img {
  width: 100%;
  height: 100%;
}
.goods-setting .goods .info .goods-pic i {
  color: #c8d1d8;
  cursor: pointer;
}
.goods-setting .goods .info .goods-pic .img-cover {
  width: 100%;
  height: 30px;
  line-height: 30px;
  position: absolute;
  bottom: 0;
  z-index: 1;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.3);
}
.goods-setting .goods .info .goods-pic .img-cover {
  color: #fff;
}
.goods-setting .goods .info .goods-pic .imgUpload {
  position: absolute;
  width: 70px !important;
  height: 40px !important;
  display: block;
  top: 0px;
  left: 0px;
  opacity: 0;
  filter: alpha(opacity=0);
}
.goods-setting .goods .info .goods-form {
  float: left;
  width: 280px;
}
.goods-setting .goods .info .goods-form .section-row {
  height: 30px;
  line-height: 30px;
  margin-bottom: 10px;
}

.goods-setting {
  margin-top: 10px;
}
.goods-setting .type {
  padding: 0;
}
.goods-setting .type .type-item {
  padding: 0;
}
.goods-setting .type .type-item .pic {
  border: 2px #fff solid;
}
.goods-setting .type .type-item .icon {
  display: none;
}
.goods-setting .type .type-item.on .pic {
  border-color: #00bad0;
}
.goods-setting .type .type-item.on .icon {
  display: block;
  position: absolute;
  bottom: 2px;
  right: 12px;
}
.goods-setting .btn-submit {
  background-color: #00bad0;
  width: 370px;
  height: 40px;
  margin: 30px 0 0 0px;
  position: fixed;
  bottom: 0;
  right: 31px;
  margin-bottom: 30px;
}
.goods-setting .btn-submit,
.goods-setting .btn-submit.white i,
.goods-setting .btn-submit:hover,
.goods-setting .btn-submit:focus {
  color: #fff;
}
</style>

