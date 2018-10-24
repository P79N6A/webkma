<template>
  <div id="content" tabindex="0" oncontextmenu="return false;" style="min-height:1160px !important;background:#f1f3fc;">
    <div id="content-wrap" style="position: relative;padding-left: 320px;padding-right: 450px;">
      <div id="content-resize-box">
        <div style="overflow:hidden;">
          <div id="container">
            <div class="phone-header"></div>
            <div class="phone-title">
              <div class="col-sm-5 col-padding-clear text-left" style="padding-left:6px;">
                <img src="../../assets/images/design/signal-carrier.png" style="height:7px; margin-top:-2px;" />
                <span>Carrier</span>
                <i class="fa fa-wifi"></i>
              </div>
              <div class="col-sm-2 col-padding-clear text-center">
                <span id="span_dateTime_now"></span>
              </div>
              <div class="col-sm-5 col-padding-clear text-right" style="padding-right:6px;">
                <img src="../../assets/images/design/rotation-lock.png" style="height:12px; margin-top:-2px;" />
                <span>100%</span>
                <img src="../../assets/images/design/battery.png" style="height:7px; margin-top:-2px;" />
              </div>
            </div>
            <div class="phone-body">
              <div class="row table-panel">
                <div id="content-body" class="page-tpl-body" style="height:528px;">
                  <div id="content-body-body" class="edit-panel" style="height:100%;">
                    <div id="content-body-header" style="width:100%;position: absolute;left:0;top:0;"></div>
                  </div>
                </div>
              </div>
            </div>
            <!--<div class="sidebar" style="background:transparent;"></div>-->
          </div>
        </div>
      </div>
       <div class="phone-footer">
        <div id="resizeHandle">
          <span class="heightUp" @click="heightResize('down')"></span>
          <span class="resizeHeight">拖动此处调整屏幕高度</span>
          <span class="heightDown" @click="heightResize('up')"></span>
        </div>
      </div>
    </div>
    <div class="clearfix"></div>
    <input id="main_id" type="hidden" />
  </div>
</template>
<script>
import "libcore";

export default {
  name: "designEditor",
  data: function() {
    return {
      pageSize: {},
      bodyHeight: 0
    };
  },
  methods: {
    heightResize(type) {
      var $element = $("#content");
      var defautSize = {
        width: 320,
        "min-height": 528,
        height: 528
      };
      var self = this
      //点击上下调整页面高度
      self.bodyHeight = $element.find("#content-body-body").height();
      var _minHeight = defautSize["min-height"];
      switch (type) {
        case "up":
          self.bodyHeight += 200;
          break;
        case "down":
          if (self.bodyHeight <= _minHeight) {
            return false;
            break;
          } else {
            if (self.bodyHeight - 200 < _minHeight) {
              self.bodyHeight = 200 + _minHeight;
            }
          }
          self.bodyHeight -= 200;
          break;
      }
      // resiseHeight 时只需要设置 content-body 的高度。
      // $element.find("#content-body-body").height(self.bodyHeight + "px");
      // $element.find("#phone-body").height(self.bodyHeight + "px");
      // $element.find("#content-resize-box").height(self.bodyHeight + 136 + "px");
      // $element.find("#content-wrap").height(self.bodyHeight + 136 + "px");
      self.pageSize.height = self.bodyHeight + "px";
      Kdo.data.config.page.set({
        style: self.pageSize
      });
    }
  },
  mounted() {
    var self = this;
    var $element = $("#content");

    Kdo.container.init({
      $background: $element.find("#container"), //设置编辑区域的背景DOM元素（背景、通栏）
      $body: $element.find("#content-body-body") //设置编辑区域的主体DOM元素
    });

    var defautSize = {
      width: 320,
      "min-height": 528,
      height: 528
    };

    var _pageHeight = defautSize.height;
    self.pageSize = {};

    //------------------------页面配置文件的设置和加载 START------------------------
    Kdo.data.config.site.on("reload", function(siteConfig) {
      //console.log(siteConfig.config);
    });
    Kdo.data.config.page.on("reload", function(pageConfig) {
      //设置页面背景属性
      var background = {
        "background-color": "",
        "background-image": "",
        //"background-position": "",
        "background-repeat": "",
        "background-size": ""
      };
      if (!!pageConfig.style) {
        background["background-color"] =
          pageConfig.style["background-color"] || "";
        background["background-image"] = !!pageConfig.style["background-image"]
          ? "url(" + pageConfig.style["background-image"] + ")"
          : "";
        //background["background-position"] = pageConfig.style["background-position"] || "";
        background["background-repeat"] =
          pageConfig.style["background-repeat"] || "";
        background["background-size"] =
          pageConfig.style["background-size"] || "";

        //设置页面大小
        self.pageSize.width =
          pageConfig.style.width != null ? pageConfig.style.width : "320px";
        self.pageSize.height =
          pageConfig.style.height != null
            ? pageConfig.style.height
            : _pageHeight + "px";
      }

      Kdo.container.$body().css(background);

      //设置页面头部背景区域样式
      if (!!pageConfig.header && !!pageConfig.header.style) {
        $element.find("#content-body-header").css({
          "background-image":
          "url(" + pageConfig.header.style["background-image"] + ")" || "",
          "background-repeat":
          pageConfig.header.style["background-repeat"] || "",
          "background-size": pageConfig.header.style["background-size"] || "",
          height: self.pageSize.height || ""
        });
      }

      if (!!self.pageSize) {
        $element
          .find("#content-body")
          .css({ width: parseFloat(self.pageSize.width || 0) + "px" });
        $element
          .find("#content-body")
          .css({ height: parseFloat(self.pageSize.height || 0) + "px" });
      }

      // todo?
      //   $rootScope.$broadcast(
      //     "setting-background-color",
      //     background["background-color"]
      //   );

      //渲染页面
      Kdo.container
        .$background()
        .find(".box.single,.box.group")
        .remove();
      //Kdo.floatbar.hide();
      Kdo.propertybar.hide();
      Kdo.page.create.repair(Kdo.data.controls.all());
      //加载模块的组合形态
      Kdo.featurer.group.repair();
    });
    //------------------------页面配置文件的设置和加载 END------------------------

    Kdo.data.config.page.set({
      style: {
        width: defautSize.width + "px",
        height: defautSize.height + "px"
      }
    });

    //------------------------画布功能、事件注册 START------------------------
    //selectable功能
    Kdo.featurer.selectable($element);

    //页面级resizable功能
    $element.find("#content-resize-box").resizable({
      autoHide: false,
      handles: "s",
      minHeight: defautSize["min-height"] + 106,
      resize: function(event, ui) {
        var height = ui.helper.height();
        // 拖动时只设置 content-body 的高度就可以满足需求
        // $element.find("#content-wrap").height(ui.helper.height());
        // $element.find("#content-body-body").height(ui.helper.height() - 106);
        // $element.find(".phone-body").height(ui.helper.height() - 106);
        $element
          .find("#content-body")
          .css({ height: (height - 106) + "px" });
        $element
          .find(".resizeHeight")
          .html("高度 : " + (height - 106));
      },
      stop: function(event, ui) {
        // $scope.$apply(function() {
        self.pageSize.height = ui.helper.height() - 106 + "px";
        Kdo.data.config.page.set({
          style: self.pageSize
        });
        // });
        // 只需要设置 content-body 的高度就可以满足需求
        // $element.find("#content-body-body").height(ui.helper.height() - 106);
        // $element.find(".phone-body").height(ui.helper.height() - 106);
        self.bodyHeight = $element.find("#content-body-body").height();
        $element.find(".resizeHeight").html("拖动此处调整屏幕高度");
        ui.helper.height('auto');
        $element.find("#content-resize-box").css({'width':'100%','height':'auto'});
        //staff();  //reload标尺
      }
    });

    //mouseup、mousedown事件
    Kdo.events.init($element);

    //注册拖拽创建模块的接收区域
    Kdo.page.create.drop(Kdo.container.$body());

    //全局操作盒子(Box)
    Kdo.box.init($element);

    //注册工具栏
    Kdo.toolbar.init($element);

    //注册模块浮动工具条
    //Kdo.floatbar.init(Kdo.container.$body());
    Kdo.propertybar.init(Kdo.container.$body());

    //注册文字编辑器
    Kdo.settings.font.init(Kdo.container.$body());
    //------------------------画布功能、事件注册 END------------------------

    //------------------------其它功能 START------------------------
    // $element.css({ "min-height": ($(window).height() - 50) + "px" });
    // $scope.tpl_status = {
    //   dateTime: Date.now()
    // };
    //实时获取当前时间
    // setInterval(function() {
    //   $scope.$apply(function() {
    //     $scope.tpl_status.dateTime = Date.now();
    //   });
    // }, 1000);

    // $element.find("#main_id").val($location.search()["templateId"]);
    //------------------------其它功能 END------------------------
  }
};
</script>
