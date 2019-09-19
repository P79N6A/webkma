//app.js

const PubSub = require('./utils/pubsub.js');

// 事件模块支持
Object.defineProperties(wx, {
  "$on": {
    get() {
      return PubSub.subscribe;
    }
  },
  "$emit": {
    get() {
      return PubSub.publish;
    }
  }
})

App({
  onLaunch: function() {
  },

  onShow: function(options) {
    if (!this.globalData.userInfo) {
      const
        // 登录授权页面地址
        authLoginPath = 'pages/index/index',
        // 定义重定向页面地址
        redirectPath = `/${options.path || 'pages/overview/overview'}`;
      if (options.path == authLoginPath) return;

      // 参数序列化
      let queryArray = [];
      for (let key in options.query) {
        queryArray.push(key + "=" + options.query[key]);
      }
      // 重定向到登录授权页
      wx.redirectTo({
        url: `/${authLoginPath}?target=${encodeURIComponent(`${redirectPath}?${queryArray.join("&")}`)}`
      });
    }
  },

  globalData: {
    userInfo: null
  }
});