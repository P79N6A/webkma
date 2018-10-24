const activityService = require('../../services/activity-service.js'),
  utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    total: 0,
    pageIndex:1,
    pageSize:6,
    prizeList:[],
    loadingOpj: {
      more: 0,//是否有下一页
      loadingText: ''
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self=this;
    self.getPrizeList();
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
    self.getPrizeList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!!self.data.loadingOpj.more) {
      self.data.pageIndex++;
      self.getPrizeList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  getPrizeList:function(){
    var self=this;
    wx.showNavigationBarLoading();
    self.data.loadingOpj.loadingText = '加载中...';
    self.setData({ loadingOpj: self.data.loadingOpj });
    activityService.getPrizeList({
      pageIndex: self.data.pageIndex,
      pageSize: self.data.pageSize},function(err,res){
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        if (res.status == 0){
          self.data.total = res.data.total;
          if (self.data.pageIndex === 1) {
            self.data.taskList = [];
          };
          res.data.list.forEach(function(val,i){
            val.createtime = utils.dateString(val.createtime,'/');
            self.data.prizeList.push(val);
          })
          self.data.loadingOpj.more = self.data.pageIndex * self.data.pageSize < self.data.total ? 1 : 0;
          self.data.loadingOpj.loadingText = self.data.total > 0 ? (self.data.pageIndex * self.data.pageSize < self.data.total ? '' : '已经到底部了') : '';
          self.setData({
            prizeList: self.data.prizeList,
            loadingOpj: self.data.loadingOpj
          })
        }else{
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
  prizesDetail:function(e){
    wx.navigateTo({
      url: `/pages/prizes-detail/prizes-detail?relationid=${e.currentTarget.dataset.relationid}&controlid=${e.currentTarget.dataset.controlid}`,
    })
  }
})