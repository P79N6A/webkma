<template>
  <div class="design">
    <!-- Header -->
    <div class="col-sm-12 header">
      <!-- Logo -->
      <!--<a ng-href="{{hrefUrl}}">-->
      <div class="pull-left logo"></div>
      <!--<i class="iconfont icon-logo"></i>-->
      <!--</a>-->
      <header-features @takePhoto="takePhoto()" />
      <div class="clearfix"></div>
    </div>
    <!-- Header -->
    <div class="clearfix"></div>
    <!-- Left Menu -->
    <left-menu class="left-menu"></left-menu>

    <!-- Mobile Rigt Editor -->
    <div class="pageeditor-mobile">
      <editor :appointment="role != '2' ? true : false"/>
    </div>
    <!--propertybar-->
    <div class="propertybar">
      <div class="property-head">
        <span>{{componentItem == 'gameSetting'?'游戏设置':'属性'}}</span>
      </div>
      <div class="property-body">
        <div class="property-group" :style="{'margin-top': (componentItem != 'appointmentSetting' ? '-80px' : '0px !important')}">
          <div class="property-group-body" :class="{'game-padding': componentItem == 'gameSetting' || componentItem == 'formSetting' || componentItem == 'voteSetting', 'clear-padding': componentItem == 'appointmentSetting'}">
            <div id="setting" data-type="setting" class="column">
              <div :is="componentItem"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--topbar-->
    <div class="topbar">
      <div class="topbar-head">
        <span>工具</span>
      </div>
      <div class="sidebar" style="background:transparent;"></div>

      <div class="topbar-body"></div>
    </div>
    
    <!--pager 活动类型为海报，将不展示多页-->
    <pager v-show="$route.query.manuscriptType!=2" :pages="pages" :current-page="currentPage" @on-load-page="onloadPageControls" @add-page="addPage"
      @remove-page="removePage" @sort-page="sortPage" @restore-page="restorePage" @copy-page="copyPage" />
    <div style="position:fixed;width:100%;height:100%;left:0px;top:0px;z-index:-1" id="bg"></div>
  </div>
</template>
<script>
import api from "api";
import headerFeatures from "./header";
import leftMenu from "./left-menu";
import editor from "./editor";
import "../../axios/left-menu.js";
import { createStyle } from '../../utils';
import pager from './pager';
import eventBus from '../../utils/eventBus.js'


import formSetting from './setting/form-setting';
import gameSetting from './setting/game-setting';
import qrcodeSetting from './setting/qrcode-setting';
import audioSetting from './setting/audio-setting';
import aMapSetting from './setting/amap-setting';
import videoSetting from './setting/video-setting';
import countdownSetting from './setting/count-down-setting';
import goodsSetting from './setting/goods-setting';
import callSetting from './setting/call-setting';
import fabulousSetting from './setting/fabulous-setting';
import voteSetting from './setting/vote-setting';
import appointmentSetting from './setting/appointment-setting';

export default {
  components: { editor, leftMenu, headerFeatures, pager, formSetting, gameSetting, qrcodeSetting, audioSetting, aMapSetting, videoSetting, countdownSetting, goodsSetting, callSetting, fabulousSetting, voteSetting, appointmentSetting },
  data() {
    return {
      role: localStorage.role,
      pages: [],
      currentPage: {},
      componentItem: "",
      takePhotoPageIndex: 0
    }
  },
  created() {
    eventBus.$on('componentItemGet', (item) => {
      this.componentItem = item;
      if (item) eventBus.$emit('settingRefresh');
      if (item != 'appointmentSetting') eventBus.$emit('appointReflesh');
      // $(".property-group-body.setting-div").hide();
    });
  },
  methods: {
    addPage(page) {
      let newPage = page || Kdo.data.page.newPage();
      let curPage = { number: newPage.number }
      Kdo.data.pages.push(newPage);
      this.pages.push(curPage);
      this.onloadPageControls(curPage.number);
    },
    restorePage() {
      let page = Kdo.data.removedPages.pop();
      if (!!page) {
        this.addPage(page);
      }
    },
    removePage(page) {
      let idx = Kdo.data.pages.findIndex(p => p.number === page.number);
      this.pages.splice(idx, 1);
      let rmpage = Kdo.data.pages.splice(idx, 1);
      Kdo.data.removedPages.push(rmpage[0]);
      let len = Kdo.data.pages.length;
      if (len <= 0) {
        return this.addPage();
      }
      if (idx <= 0) {
        idx = 0;
      } else {
        idx--;
      }
      this.onloadPageControls(idx);
    },
    copyPage(page) {
      if (Kdo.data.page.controls.find(control => { return ["draw", "game", "vote"].includes(control.pluginType) })) {
        return this.$alert('包含小游戏、抽奖插件或投票插件的页面，不允许被复制。');
      }
      let srcPage = Kdo.page.temp.getData();  //Kdo.data.pages.find(p => p.number === page.number);
      srcPage.data = srcPage.data.filter(control => { return !control.single });
      srcPage.data.forEach((control) => { control.controlId = "control_" + uuid.v4(); });
      let np = Kdo.data.page.newPage();
      let newPage = $.extend(true, {}, srcPage, { number: np.number, config: { number: np.config.number } });
      this.addPage(newPage);
    },
    sortPage(sortResult) {
      Kdo.data.page.sort(sortResult);
      this.pages = Kdo.data.pages.map(p => ({ number: p.number }));
    },
    takePhoto() {
      var self = this;
      self.takePhotoPageIndex = self.currentPage.number;
      self.onloadPageControls(0);
      setTimeout(() => {
        self.onloadPageControls(self.takePhotoPageIndex);
      });
    },
    onloadPageControls(pageIndex) {
      if (Number.isNaN(Number(pageIndex))) {
        pageIndex = Kdo.data.pages.findIndex(p => p.number === pageIndex);
      }

      // 页面切换之前先对上一页数据进行保存
      Kdo.data.page.save();
      //清除页面对象
      Kdo.data.page.controls = [];
      Kdo.data.config.page.clear();
      //清楚logs操作对象
      Kdo.featurer.actionLogs.clear();
      //获取页面数据
      var pageData = Kdo.data.pages[pageIndex];
      this.currentPage = { number: pageData.number };
      pageData.config = (!!pageData.config ? _.isString(pageData.config) ? JSON.parse(pageData.config) : pageData.config : {});
      pageData.data = !!pageData.data ? _.isString(pageData.data) ? JSON.parse(pageData.data) : pageData.data : [];
      //设置页面配置
      Kdo.data.config.page.set(pageData.config);
      //设置页面模块
      Kdo.data.controls.set(pageData.data);
      //渲染页面
      //Kdo.container.$background().find(".box:not(.temp)").remove();
      //隐藏工具条
      //Kdo.floatbar.hide();
      Kdo.propertybar.hide();
      Kdo.page.create.repair(Kdo.data.controls.all());
      //加载模块的组合形态
      Kdo.featurer.group.repair();
      //重置页面临时保存(重置页面数据对象)
      Kdo.page.temp.init(pageData.number);
      //操作记录
      Kdo.featurer.actionLogs.log();
      //刷新工具栏状态
      //Kdo.toolbar.refresh();
      // 触发左侧菜单刷新事件
      eventBus.$emit('left-menu.refresh');
    }
  },
  mounted() {
    createStyle('./bower_components/animate.css/animate.min.css');
    createStyle('./static/fonts/index.css');
    var self = this;
    if (!!self.$route.query.id) {
      Kdo.data.config.site.set({ templateNumber: self.$route.query.id });
      // lanh.utils.templateId.set($self.$router.search().id);
    }

    //为每一个页面文件设置所需属性
    var _initPageConfig = function (pages, args) {
      _.each(pages, function (page) {
        var _defaultSize = Kdo.data.page.defaultSize;
        var _config = {
          style: {
            width: _defaultSize.width + "px"
          }
          ,
          number: page.number
        };
        let originalCfg = !!page.config ? _.isString(page.config) ? JSON.parse(page.config) : page.config : {};
        page.config = $.extend(true, originalCfg, _config);
        // 清除htmlData
        page.htmlData = void 0;
        //如果没有设置过高度，则设置默认高度。
        if (!page.config.style.height) {
          page.config.style["height"] = _defaultSize.height + "px";
        }
      });
    };

    //过滤更新pages（目前opacity）添加商品设置id功能  mars 19.5.21
    var _updateControls = function (pages) {
      if (!pages) {
        return false;
      }
      let _goodsIds = [];
      if (!!self.$route.query.goodsIds) {
        _goodsIds = self.$route.query.goodsIds.split(',')
      }
      $.each(pages, function (i, page) {
        if (!page.data) {
          return;
        }
        var controls = _.isString(page.data) ? JSON.parse(page.data) : page.data;
        $.each(controls, function (i, control) {
          if (!control.inner) {
            control.inner = { style: {} };
          }
          if (!!control.style["opacity"]) {
            control.inner.style["opacity"] = control.style["opacity"];
            delete control.style["opacity"];
          }

          if (control.key == "plugin_goods" && !control.data.goodsInfo.id && _goodsIds.length > 0) {
            let _goodsId = _goodsIds.shift();
            control.data.goodsInfo.id = _goodsId;
            control.data.goodsInfo.kid = (self.$route.query.kid || '');
          }
        });
        page.data = controls;
      });
      return pages;
    };



    var _callback = function (result, status) {
      // 状态判断放在接口读取处
      /*if (result.code != 0 && result.code != 34 && result.code != -10) {
        Kdo.utils.messenger.error(result.desc);
        return;
      } else if (result.code == 34) {
        Kdo.utils.messenger.error("无法找到该模板，编辑窗口将关闭！");
        setTimeout(function() {
          window.opener = null;
          window.close();
        }, 5000);
        return;
      } else if (result.code == -10) {
        //   todo: 什么业务？
        // $location.path("/no-jurisdiction");
      }*/
      //   todo
      //   $scope.$root.$broadcast("design.template_manuscriptInfo", result);

      //过滤更新pages
      result.pages = _updateControls(result.pages);
      //设置稿件配置
      Kdo.data.config.site.set(
        $.extend(!!result.config ? _.isString(result.config) ? JSON.parse(result.config) : result.config : {}, {
          templateNumber: Kdo.data.config.site.get().templateNumber
        })
      );
      //设置全局模块
      Kdo.data.controls.set(!!result.data ? _.isString(result.data) ? JSON.parse(result.data) : result.data : []);
      //设置页面数据集
      Kdo.data.pages = result.pages || [Kdo.data.page.newPage()]; // 没有 page 处理默认page
      //为每一个页面文件设置所需属性
      _initPageConfig(Kdo.data.pages);
      //加载页面元素的流程(目前只有唯一页面)
      self.onloadPageControls(0);
    };

    // 获取稿件数据
    api.request(
      "getManuscriptInfo",
      { id: Kdo.data.config.site.get().templateNumber },
      result => {
        if (result.status == 0) {
          // try {
            let content = result.data.content;
            if (!!content) {
              content = JSON.parse(result.data.content);
            }
            // 对没有pageid的页面做兼容处理
            content = content || {};
            let pages = result.data.pages;
            if (_.isString(pages)) {
              pages = JSON.parse(pages);
            } else {
              pages = content.pages;
            }
            if (!_.isArray(pages) || pages.length <= 0) {
              pages = [Kdo.data.page.newPage()]
            }
            self.pages = [];
            content.pages = pages.map(p => {
              if (!p.number) {
                p.number = Kdo.utils.uuid();
              }
              self.pages.push({
                number: p.number
              });
              return p;
            })
            if (self.pages.length > 0) {
              self.currentPage = self.pages[0];
            }
            _callback(content || {});
          // } catch (err) {
          //   Kdo.utils.messenger.error("模板加载失败");
          //   _callback({});
          // }
        } else {
        }
      }
    );
  }
};
</script>
<style>
@import "../../style/design.css";
@import "../../style/kdo_base_box.css";
@import "../../style/text_editor.css";
</style>

