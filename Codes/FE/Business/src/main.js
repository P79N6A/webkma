// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
// 到入jquery模块
import jquery from 'jquery';
window.$ = jquery; // 全局暴露出jquery对象
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from './axios'
import store from './vuex/store'


import './utils/formValidation'
import './utils/timeFormdate'
import './utils/formValidation'
import './utils/mScroll'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-25d0c7/index.css'
Vue.use(ElementUI)

import "../bower_components/jquery-ui/jquery-ui";
import "../bower_components/bootstrap/dist/js/bootstrap.min.js";
// import "../bower_components/bootstrap-colorpicker/js/bootstrap-colorpicker.min.js";

import uuid from "../bower_components/node-uuid/uuid.js";
import artTemplate from "../bower_components/art-template/art-template.js";
import underscore from "../bower_components/underscore/underscore-min.js";
import spectrum from "../bower_components/spectrum/spectrum.js";
import domtoimage from "../bower_components/dom-to-image/src/dom-to-image.js";
//安装公共组件和指令
import CommonComponent from "components";
Vue.use(CommonComponent);
import directives from "./directives";
Vue.use(directives);

window.uuid = uuid;
window.template = artTemplate;
window._ = underscore;
window.domtoimage = domtoimage;

// 导入样式
import "../bower_components/bootstrap/dist/css/bootstrap.css";
// import "../bower_components/bootstrap-colorpicker/css/bootstrap-colorpicker.min.css";
import "./style/element-ui-custom.css";
import "./style/base.css";
import "../bower_components/spectrum/spectrum.css";
import "../bower_components/jquery-ui/themes/smoothness/jquery-ui.css"

// import "./style/main.css"
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  axios,
  store,
  components: { App },
  template: '<App/>',
  created() {
    //----------配置spectrum插件 START----------
    $.spectrum.customOptions = {
      palette: [["#000", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"],
      ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"],
      ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"],
      ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"],
      ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"],
      ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"],
      ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"],
      ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]]
    }
    //----------配置spectrum插件 END----------

    window.lanh = {}
    $.extend(true, window.lanh, { platform: "design" })
  }
});

// 手工动态加载预览组件
$(function () {
  $.get('./static/preview.html', function (data) {
    $("body").append(data);
  })
})



