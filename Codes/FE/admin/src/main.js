import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Elementui from 'element-ui'
import Underscore from 'underscore'
import '../bower_components/jquery/dist/jquery'
import '../bower_components/jquery-ui/jquery-ui'
// import '../bower_components/qrcodejs/qrcode'
import './utils/timeFormdate.js'
import './utils/message.js'

import '../node_modules/element-ui/lib/theme-chalk/index.css'
import "./styles/element-ui-custom.css";
import "./styles/base.css";
// import "../bower_components/qrcodejs/qrcode"


Vue.use(Elementui)
window._ = Underscore;

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
$(function () {
  $.get('/preview1.html', function (data) {
    $("body").append(data);
  })
})