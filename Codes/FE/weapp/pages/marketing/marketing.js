// pages/marketing/marketing.js
const config =require('../../config.js');
const utils = require('../../utils/util.js'),
  activityService = require('../../services/activity-service.js');
let self;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    overview:{},//员工基本信息
    taskList:[],
    total: 0,
    pageIndex: 1,//分页页码
    pageSize:8,//一页显示几个数据
    loadingOpj: {
      more: 0,//是否有下一页
      loadingText: ''
    },
    userBindInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })
    self=this;
    this.loadPageData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  loadMore:function(){
    
  },
  onTapEvent:function(evt){
    let data = evt.detail;
    wx.navigateTo({
      url: `/pages/activity-management/activity-management?id=${data.id}`,
    })
  },
  counter:0,
  coverError:function(e){
    this.counter++;
    if (this.counter>10){
      return console.log(`设置默认封面出错，检测文件是否存在.${config.defaultCover}`);
    }
    self.data.overview.businessCover = config.defaultCover;
    this.setData({
      overview: self.data.overview
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    self.data.pageIndex = 1;
    self.loadPageData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!!self.data.loadingOpj.more) {
      self.data.pageIndex++;
      self.activityList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  loadPageData:function(){
    let userBindInfo = getApp().globalData.userBindInfo;
    if (userBindInfo.businessState == 0) {
      activityService.infomerge({ employeeId: userBindInfo.employeeId }, (erro, res) => {
        if (res.status == 0) {
          let overview = res.data;
          overview.totalShare = utils.convertCount(overview.totalShare);
          overview.totalVisitor = utils.convertCount(overview.totalVisitor);
          overview.totalAccess = utils.convertCount(overview.totalAccess);
          res.data.totalAccess = utils.convertCount(res.data.totalAccess);
          res.data.totalShare = utils.convertCount(res.data.totalShare);
          res.data.totalVisitor = utils.convertCount(res.data.totalVisitor);
          self.setData({
            overview: overview
          })
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
    self.activityList();
    self.setData({
      userBindInfo: userBindInfo
    })
  },
  activityList:function(){
    wx.showNavigationBarLoading();
    self.data.loadingOpj.loadingText = '加载中...';
    self.setData({ loadingOpj: self.data.loadingOpj });
    activityService.promotionActivities({
      pageIndex: self.data.pageIndex,
      pageSize: self.data.pageSize
    }, (err, res) => {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
      if (res.status == 0) {
        self.data.total = res.data.total;
        if(self.data.pageIndex===1){
          self.data.taskList=[];
        } 
        for (let i = 0; i < res.data.list.length; i++) {
          res.data.list[i].totalJoin = utils.convertJoinCount(res.data.list[i].totalJoin);
          res.data.list[i].publishDate = utils.convertPublishDate(res.data.list[i].publishDate);
          self.data.taskList.push(res.data.list[i]);
        }
        self.data.loadingOpj.more = (self.data.pageIndex * self.data.pageSize) < self.data.total ? 1 : 0;
        self.data.loadingOpj.loadingText = self.data.total>0?((self.data.pageIndex * self.data.pageSize) < self.data.total ? '' : '已经到底部了'):'';
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
  }
})