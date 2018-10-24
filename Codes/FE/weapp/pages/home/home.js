//index.js
//获取应用实例
const config = require('../../config.js'),
  utils = require('../../utils/util.js'),
  activityService = require('../../services/activity-service.js');
// const tabbar = {};//require('../../components/tabbar/tabbar.js');
let self;
Page(Object.assign({
  data: {
    imgSrc: config.bosHost,
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    taskList: [],
    total: 0,
    pageIndex: 1, //分页页码
    pageSize: 8, //一页显示几个数据
    loadingOpj: {
      more: 0, //是否有下一页
      loadingText: ''
    },
    currentPage: 'home',
    userBindInfo: {}

  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    wx.showLoading({
      title: '加载中...',
    })
    self = this;
    // app.getUserInfo()
    // .then(data=>{
    //   this.setData({
    //     userInfo: data,
    //     hasUserInfo: true
    //   })
    // }).catch(err=>{
    //   console.log(err)
    // })

    // self.setData({
    //   userBindInfo: getApp().globalData.userBindInfo
    // });
  },
  onShow: function() {
    self.data.pageIndex = 1;
    self.activityList();
    // getApp().checkBindInfo();
  },
  onTapEvent: function(evt) {
    let detail = evt.detail;
    wx.navigateTo({
      url: `/pages/activity-detail/activity-detail?activityUrl=${detail.cover}&title=${detail.name}&id=${detail.id}&t=${Date.now()}`,
    })
  },
  activityList: function() {
    wx.showNavigationBarLoading();
    self.data.loadingOpj.loadingText = '加载中...';
    self.setData({
      loadingOpj: self.data.loadingOpj
    });
    activityService.activityList({
      "pageIndex": self.data.pageIndex,
      "pageSize": self.data.pageSize
    }, (err, res) => {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
      if (res.status == 0) {
        self.data.total = res.data.total;
        if (self.data.pageIndex === 1) {
          self.data.taskList = [];
        };

        for (let i = 0; i < res.data.list.length; i++) {
          res.data.list[i].totalJoin = utils.convertJoinCount(res.data.list[i].totalJoin);
          res.data.list[i].publishDate = utils.convertPublishDate(res.data.list[i].publishDate);
          self.data.taskList.push(res.data.list[i]);
        }
        self.data.loadingOpj.more = self.data.pageIndex * self.data.pageSize < self.data.total ? 1 : 0;
        self.data.loadingOpj.loadingText = self.data.total > 0 ? (self.data.pageIndex * self.data.pageSize < self.data.total ? '' : '已经到底部了') : '';
        self.setData({
          taskList: self.data.taskList,
          loadingOpj: self.data.loadingOpj
        })
      } else {
        self.data.loadingOpj.loadingText = '';
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
        self.setData({
          loadingOpj: self.data.loadingOpj
        })
      }
      wx.hideLoading();
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (!!self.data.loadingOpj.more) {
      self.data.pageIndex++;
      self.activityList();
    }
  },
  onPullDownRefresh: function() {
    self.data.pageIndex = 1;
    self.activityList();
  }
}));