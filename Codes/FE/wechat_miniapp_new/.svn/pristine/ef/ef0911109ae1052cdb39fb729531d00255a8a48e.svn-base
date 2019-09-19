// pages/red-envelopes-record/red-envelopes-record.js
const config = require('../../config.js'),
  utils = require('../../utils/util.js'),
  activityService = require('../../services/activity-service.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeNavTab: "receivedData", //tab切换
    imgSrc: '', //用户头像
    name: '', //用户姓名
    receiveList: [], //收到的红包数据
    receiveStat:{}, //收到的红包金额数量
    sendList: [], //发出的红包数据
    sendStat: {}, //发出的红包金额数量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu(); //隐藏右上角转发
  },
  //获取上级页面数据
  superior: function () {
    var self = this;
    var pages = getCurrentPages();
    var prePage = pages[pages.length - 2];
    self.setData({
      imgSrc: prePage.data.rewardInfoList.face,
      name: prePage.data.rewardInfoList.name
    })
  },
  //tab切换
  navbarTabChange: function (e) {
    let self = this;
    self.setData({
      activeNavTab: e.detail.key
    });
    if (self.data.activeNavTab == 'receivedData'){
      self.getPacketReceive();
    } else if (self.data.activeNavTab == 'issueData'){
      self.getPacketSend();
    }
  }, 
  // 收到的红包记录 
  getPacketReceive: function(){
    wx.showNavigationBarLoading();
    activityService.getPacketReceive({}, (err, res) => {
      var self = this;
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
      wx.hideLoading();
      if (res.status == 0) {
        if (res.data.list.length>0){
          res.data.list.forEach(item=>{
            switch(item.type){
              case 1:
                item.typeName ="任务奖励"
                break;
              case 2:
                item.typeName = "红包裂变奖励"
                break;
              case 3:
                item.typeName = "名片红包"
                break;
              case 4:
                item.typeName = "单人红包奖励"
                break;
            }
          })
        }
        for (var i= 0; i<res.data.list.length;i++) {
          res.data.list[i].createTime = res.data.list[i].createTime.replace(/-/g, '/')
        }
        self.setData({
          receiveList: res.data.list, 
          receiveStat: res.data.stat, 
        })
      } else {
        utils.toast.fail({
          title: "获取个人信息失败"
        });
      }
    })
  },
  // 发出的红包记录
  getPacketSend: function(){
    var self = this;
    wx.showNavigationBarLoading();
    activityService.getPacketSend({}, (err, res) => {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
      wx.hideLoading();
      if (res.status == 0) {
        for (var i = 0; i < res.data.list.length; i++) {
          res.data.list[i].createTime = res.data.list[i].createTime.replace(/-/g, '/')
        }
        self.setData({
          sendList: res.data.list, 
          sendStat: res.data.stat
        })
        // console.log("发出", res.data)
      } else {
        utils.toast.fail({
          title: "获取个人信息失败"
        });
      }
    })
  },


  //跳转红包详情 active
  toRecordInfo:function (e){
    wx.navigateTo({
      url: '/pages/red-envelopes-detail/red-envelopes-detail?active=' + e.currentTarget.dataset.active + '&id=' + e.currentTarget.dataset.id + '&sendstate=' + e.currentTarget.dataset.sendstate + '&hideFastNav=true'
    })
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
    this.superior();
    this.getPacketReceive();
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
    if (this.data.activeNavTab == "receivedData"){
      this.getPacketReceive();
    } else if (this.data.activeNavTab == "issueData"){
      this.getPacketSend();
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})