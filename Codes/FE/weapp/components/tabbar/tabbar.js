let PubSub = require('../../utils/pubsub.js');

let iconPath = function(icon, curpage) {
  return `/images/${icon}${icon === curpage?'-active':''}.png`;
}

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    currentPage: String,
    userBindInfo: {
      type: Object,
      value: {},
      observer: function(newVal, oldVal, changedPath) {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // userBindInfo: getApp().globalData.userBindInfo,
    // "iconMy": iconPath('my'),
    // "iconHome": iconPath('home'),
    // "iconMarketing": iconPath('marketing')
    showTabbar: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSwitchTab: (e) => {
      let page = e.currentTarget.dataset.page;
      let currPages = getCurrentPages()
      if (!!page && !page.includes(currPages[currPages.length - 1].route)) {
        wx.redirectTo({
          url: page,
        })
      }
    },
  },
  created: function() {
    wx.$on('refreshTabbar', (evt, data) => {
      this.setData({
        userBindInfo: Object.assign({}, data),
        showTabbar: 'show-tabbar'
      });
      if (getCurrentPages()[0].route == "pages/marketing/marketing" && this.data.userBindInfo.businessState != 0) {
        wx.redirectTo({
          url: '/pages/home/home',
        });
      }
    })
    let app = getApp();
    app.checkBindInfo(true);
  },
  ready: function() {

    // let iconPath = (icon)=>{
    //   return `/images/${icon}${icon === this.data.currentPage ? '-active' : ''}.png`;
    // };
    // let page = (this.data.currentPage||'');

    // this.setData({
    //   ["icon" + page.replace(/^./i,(c)=>{return c.toUpperCase();}) ]: iconPath(page, page),
    //     // "iconHome": iconPath('home'),
    //     // "iconMarketing": iconPath('marketing')
    //   }
    // )

  }
})

// module.exports = {
//     onSwitchTab: (e) => {
//       let page = e.currentTarget.dataset.page;
//       let currPages = getCurrentPages()
//       if (!!page && !page.includes(currPages[currPages.length - 1].route)) {
//         wx.redirectTo({
//           url: page,
//         })
//       }
//     },
//   tabbarReady: function () {
//     let iconPath = (icon) => {
//       return `/images/${icon}${icon === this.data.currentPage ? '-active' : ''}.png`;
//     };
//     this.setData({
//       "iconMy": iconPath('my'),
//       "iconHome": iconPath('home'),
//       "iconMarketing": iconPath('marketing')
//     }
//     )
//     PubSub.on('refreshTabbar', (evt, data) => {
//       this.setData({ userBindInfo: Object.assign({}, data) })
//     })
//   }
// }