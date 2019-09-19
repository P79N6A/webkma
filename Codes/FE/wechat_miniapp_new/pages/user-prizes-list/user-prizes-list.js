const activityService = require('../../services/activity-service.js'),
  utils = require('../../utils/util.js');
let self;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    total: 0,
    pageIndex: 1,
    pageSize: 8,
    prizeList: [],
    loadingOpj: {
      more: 0, //是否有下一页
      loadingText: ''
    },
    tipStatus: "loading"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu(); //隐藏右上角转发
    self = this;
    wx.showLoading({
      title: '加载中',
    });
    self.getPrizeList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    self.data.pageIndex = 1;
    self.getPrizeList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (!!self.data.loadingOpj.more) {
      self.data.pageIndex++;
      self.getPrizeList();
    }
  },

  getPrizeList: function() {
    wx.showNavigationBarLoading();
    self.data.loadingOpj.isLoading = true;
    self.data.loadingOpj.loadingText = "加载中";
    self.setData({
      loadingOpj: self.data.loadingOpj
    });
    activityService.getPrizeList({
      pageIndex: self.data.pageIndex,
      pageSize: self.data.pageSize
    }, function(err, res) {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
      wx.hideLoading();
      self.data.loadingOpj.isLoading = false;
      if (res.status == 0) {
        self.data.total = res.data.total;
        if (self.data.pageIndex === 1) {
          self.data.prizeList = [];
        };
        res.data.list.forEach(function(val, i) {
          val.createtime = utils.dateString(val.createtime, '/');
          self.data.prizeList.push(val);
        })
        self.data.loadingOpj.more = self.data.pageIndex * self.data.pageSize < self.data.total ? 1 : 0;
        self.data.loadingOpj.loadingText = self.data.total > 0 ? (self.data.pageIndex * self.data.pageSize < self.data.total ? '' : '这是我的底线了') : '';
        self.data.tipStatus = self.data.prizeList.length == 0 ? "empty" : "";
      } else {
        self.data.loadingOpj.loadingText = '';
        self.data.tipStatus = "error-network";
      }
      self.setData({
        total: self.data.total,
        prizeList: self.data.prizeList,
        tipStatus: self.data.tipStatus,
        loadingOpj: self.data.loadingOpj
      });
    })
  },
  prizesDetail: function(e) {
    wx.navigateTo({
      url: `/pages/user-prizes-detail/user-prizes-detail?relationid=${e.currentTarget.dataset.relationid}&controlid=${e.currentTarget.dataset.controlid}`,
    })
  }
})