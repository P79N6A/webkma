// pages/my/index.js
const config = require('../../config.js')
const utils = require('../../utils/util.js');
const activityService = require('../../services/activity-service.js');

let self =this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskList:[],
    total: 0,
    pageIndex: 1,//分页页码
    pageSize: 6,//一页显示几个数据
    loadingOpj: {
      more: 0,//是否有下一页
      loadingText: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    self = this;
    wx.hideShareMenu(); //隐藏右上角转发
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.data.pageIndex=1;
    this.activityList();
  },
  onTapEvent: function (evt) {
    let detail = evt.detail;

    wx.navigateTo({
      url: `/pages/activity-detail/activity-detail?activityUrl=${detail.url}&title=${detail.sourceName}&id=${detail.id}&as_belong_user=${getApp().globalData.userInfo.data[0].user_uuid}`,
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function(evt) {
    self.data.pageIndex=1;
    self.activityList();
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  activityList: function () {
    wx.showNavigationBarLoading();
    self.data.loadingOpj.isLoading = true;
    self.data.loadingOpj.loadingText = "加载中";
    self.setData({
      loadingOpj: self.data.loadingOpj
    });
    activityService.joinActivities({
      "pageIndex": self.data.pageIndex,
      "pageSize": self.data.pageSize
    }, (err, res) => {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
      wx.hideLoading();
      self.data.loadingOpj.isLoading = false;
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
          taskList: self.data.taskList
        })
      } else {
        self.data.loadingOpj.loadingText = '';
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        });
      }
      self.setData({
        loadingOpj: self.data.loadingOpj
      });
    })
  }
})