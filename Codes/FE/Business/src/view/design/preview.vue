<template>
    <div class="preview-body">
        <div class="design">
            <div class="mobile-container">
                <div class="title-nav">
                </div>
                <div class="mobile-content">
                    <div class="pageeditor-mobile pull-left">
                        <div id="content" tabindex="0" style="margin-top:0px; text-align:right;">
                            <div class="preview-content">
                                <!-- 手机预览元素 START-->
                                <div id="container" style="width:320px; position:relative;">
                                    <div class="phone-header"></div>
                                    <div class="phone-title">
                                        <div class="col-sm-5 col-padding-clear text-left" style="padding-left:6px;">
                                            <img src="../../assets/images/design/signal-carrier.png" style="height:7px; margin-top:-2px;" />
                                            <span>Carrier</span>
                                            <i class="fa fa-wifi"></i>
                                        </div>
                                        <div class="col-sm-2 col-padding-clear text-center">
                                            <span id="span_dateTime_now">12:00</span>
                                        </div>
                                        <div class="col-sm-5 col-padding-clear text-right" style="padding-right:6px;">
                                            <img src="../../assets/images/design/rotation-lock.png" style="height:12px; margin-top:-2px;" />
                                            <span>100%</span>
                                            <img src="../../assets/images/design/battery.png" style="height:7px; margin-top:-2px;" />
                                        </div>
                                    </div>
                                    <div class="phone-body" style="height: 528px;">
                                        <div class="row table-panel" style="width:320px;">
                                            <div id="content-body" class="page-tpl-body" style="z-index:1;height: 532px;">
                                                <div id="content-body-body" class="edit-panel" style="height: 100%; overflow:hidden;">
                                                    <iframe id="iframe-body" style="width:320px; height:100%; border:0px none;" scrolling="no" :src="windowHref"></iframe>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="phone-footer" style="width:320px; left: 0px; margin-left: 0px;">
                                        <div id="resizeHandle"></div>
                                    </div>
                                </div>
                                <!-- 手机预览元素 END-->
                            </div>

                        </div>
                    </div>
                    <!-- 右侧信息栏 START-->
                    <div class="mobile-share-info pull-left">
                        <div class="qrcode_div" id="qrcode_image" style="background-size: 220px; background-position: center; background-repeat: no-repeat;"
                            :style="{backgroundImage: 'url('+ (mpCode || '/static/images/logo-white.png')+')'}">
                        </div>
                        <div class="des">使用微信扫描上方的小程序码预览该活动</div>
                        <div class="title-download">下载二维码</div>
                        <div class="btn-download">
                            <div class="col-md-4">
                                <button type="button" @click="downloadMpCode(256)">小（256px）</button>
                            </div>
                            <div class="col-md-4">
                                <button type="button" @click="downloadMpCode(512)">中（512px）</button>
                            </div>
                            <div class="col-md-4">
                                <button type="button" @click="downloadMpCode(1024)">大（1024px）</button>
                            </div>
                        </div>
                        <iframe id="iframe-download" style="display:none;" src=""></iframe>
                    </div>
                </div>
                <!-- 右侧信息栏 END-->
            </div>
        </div>
    </div>
</template>
<script>
import api from "api";
import IScroll from "../../../bower_components/iscroll/build/iscroll";
import httpConfig from '../../config/http'

export default {
  name: "preview",
  components: {},
  data() {
    return {
      windowHref: "",
      mpCode: "",
      scroller: null
    };
  },
  mounted() {
    var self = this;
    self.windowHref = "http://" + self.$route.query.url;
    // self.scroller = new IScroll($("#content-body-body")[0], {
    //   scrollX: false,
    //   scrollY: true,
    //   scrollbars: "custom",
    //   mouseWheel: true,
    //   click: true,
    //   preventDefault: false,
    //   interactiveScrollbars: true
    // });
    // window.scroller = self.scroller;
    self.getMpCode();
  },
  methods: {
    getMpCode() {
      var self = this;
      api.request(
        "getManuscriptInfo",
        { id: self.$route.query.url.split(".")[0] },
        result => {
          if (result.status == 0) {
            self.mpCode = result.data.codeUrl;
            // var data = JSON.parse(result.data.content),
            //   pageConfig = JSON.parse(data.pages[0].config),
            //   pageHeight = parseFloat(pageConfig.style.height);
            // $("#iframe-body").height(pageHeight);
            // 滚动条刷新
            // self.scroller.refresh();
            // setTimeout(() => {
            //   var $scrollbar = $(
            //     ".iScrollVerticalScrollbar.iScrollLoneScrollbar"
            //   );
            //   if (pageHeight > 528) {
            //     $scrollbar.show();
            //   } else {
            //     $scrollbar.hide();
            //   }
            // });
          }
        }
      );
    },
    downloadMpCode(size) {
      var self = this;
      var iframeDownload = $("#iframe-download")[0];
      iframeDownload.src = `${httpConfig.apiHost}manuscript/wxqrcode/download?id=${self.$route.query.url.split(".")[0]}&width=${size}`
    }
  }
};
</script>

<style>
@import url("../../style/design.css");

.iScrollHorizontalScrollbar {
  position: absolute;
  z-index: 9999;
  height: 16px;
  left: 2px;
  right: 2px;
  bottom: 2px;
  overflow: hidden;
  display: none;
}

.iScrollHorizontalScrollbar.iScrollBothScrollbars {
  right: 18px;
}

.iScrollVerticalScrollbar {
  position: absolute;
  z-index: 9999;
  width: 20px;
  bottom: 2px;
  top: 2px;
  right: -50px;
  overflow: hidden;
  border-radius: 10px;
  -webkit-box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.24);
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.24);
}

.iScrollVerticalScrollbar.iScrollBothScrollbars {
  bottom: 18px;
}

.iScrollIndicator {
  position: absolute;
  background: #e9e9e9;
  border-width: 1px;
  border-style: solid;
  border-color: #e9e9e9 #c9d4df #c9d4df #e9e9e9;
  border-radius: 10px;
}

.iScrollHorizontalScrollbar .iScrollIndicator {
  height: 100%;
  background: -moz-linear-gradient(left, #e9e9e9 0%, #c9d4df 100%);
  background: -webkit-linear-gradient(left, #e9e9e9 0%, #c9d4df 100%);
  background: -o-linear-gradient(left, #e9e9e9 0%, #c9d4df 100%);
  background: -ms-linear-gradient(left, #e9e9e9 0%, #c9d4df 100%);
  background: linear-gradient(to right, #e9e9e9 0%, #c9d4df 100%);
}

.iScrollVerticalScrollbar .iScrollIndicator {
  width: 100%;
  background: -moz-linear-gradient(top, #e9e9e9 0%, #c9d4df 100%);
  background: -webkit-linear-gradient(top, #e9e9e9 0%, #c9d4df 100%);
  background: -o-linear-gradient(top, #e9e9e9 0%, #c9d4df 100%);
  background: -ms-linear-gradient(top, #e9e9e9 0%, #c9d4df 100%);
  background: linear-gradient(to bottom, #e9e9e9 0%, #c9d4df 100%);
}
</style>
