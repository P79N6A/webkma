// pages/my/index.js
const config = require('../../config.js')
const defaultHeadImg = `${config.bosHost}default-head-img.png`;
const {
  toast
} = require('../../utils/util.js');
const userSvr = require("../../services/user-info.js");
// const tabbar = //require('../../components/tabbar/tabbar.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      avatarUrl: defaultHeadImg,
      phone: '',
      nickName: '微信昵称'
    },
    userBindInfo: {},
    currentPage: 'my'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中...',
    })
    let app = getApp();
    let userInfo = app.globalData.userInfo
    this.setData({
      userInfo: {
        avatarUrl: userInfo.avatarUrl || defaultHeadImg,
        phone: userInfo.data[0].user_mobile || '',
        nickName: userInfo.nickName || '微信昵称'
      },
      userBindInfo: app.globalData.userBindInfo || {}
    });
    // this.tabbarReady();
  },

  feedbackHandler: function() {
    wx.navigateTo({
      url: '/pages/feedback/feedback',
    })
  },
  boundMobile: function(e) {
    if (e.currentTarget.dataset.isphone) {
      wx.navigateTo({
        url: '/pages/my-setup-phone/my-setup-phone',
      })
    }
  },
  myJoinActivity: function() {
    wx.navigateTo({
      url: '/pages/my-join-activity/index',
    })
  },
  myPrizes: function() {
    wx.navigateTo({
      url: '/pages/prizes-list/prizes-list',
    })
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
    let app = getApp();
    // app.checkBindInfo();
    app.getUserInfo()
      .then(data => {
        this.setData({
          "userInfo.phone": data[0].user_mobile || ''
        });
        app.globalData.userInfo.data = data;
      })
      .catch(data => {
        toast.fail({
          title: data.message || '访问未授权',
        })
      })
    wx.hideLoading();
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
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  getPhoneNumber: function(e) {
    var self = this;
    var app = getApp();
    console.log(e);
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      var userInfo = app.globalData.userInfo;
      wx.showLoading({
        title: '正在绑定手机号码，请稍后。。。',
      })
      userSvr.bindPhone({
        sessionKey: userInfo.sessionKey,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        type: 0
      }, function(err, res) {
        wx.hideLoading();
        if (!!err) {
          wx.showToast({
            title: err.message,
            image: '/images/fail.png',
            duration: 2000
          })
          return;
        }
        app.checkBindInfo(true);
        // userSvr.bindInfo({}, (error, result) => {
        //   if (!!error) {
        //     return
        //   }
        //   self.setData({
        //     userBindInfo: result.data
        //   })
        //   app.globalData.userBindInfo = result.data;
        //   self.onShow()
        // })
      })
    } else {
      wx.navigateTo({
        url: '/pages/my-setup-phone/my-setup-phone',
      })
    }
  }
});