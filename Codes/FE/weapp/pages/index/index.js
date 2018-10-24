let
  app = getApp(),
  userSvr = require("../../services/user-info.js"),
  util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    targetRoute: "",
    authSettingUserInfo: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let self = this;
    self.data.targetRoute = (!!options.target && decodeURIComponent(options.target)) || "/pages/home/home"
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let self = this;
    wx.getSetting({
      success: res => {
        self.data.authSettingUserInfo = !!res.authSetting['scope.userInfo']
        self.setData(self.data);
        // 自动登录并进入目标页
        if (self.data.authSettingUserInfo) {
          self.enterRoute();
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let self = this;

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

  btnLogin: function(event) {
    let self = this;
    if (!event.detail.userInfo) {
      return util.toast.fail({
        title: "授权后才能登录"
      });
    }
    wx.showLoading({
      title: '获取登录信息',
      mask: true
    });
    self.enterRoute();
  },

  enterRoute: function() {
    let self = this;
    self.getUserInfo().then((userInfo) => {
      wx.hideLoading();

      wx.redirectTo({
        url: self.data.targetRoute
      });
    }).catch((err) => {
      wx.hideLoading();
      util.toast.fail({
        title: "登录失败"
      });
      console.error(err);
    });
  },

  getUserInfo: function() {
    return new Promise((resolve, reject) => {
      // 获取临时code
      wx.login({
        success: resolve,
        fail: reject
      })
    }).then((data) => {
      // 根据临时code获取token
      return new Promise((resolve, reject) => {
        wx.getUserInfo({
          withCredentials: true,
          success: res => {
            data.info = {
              encryptedData: res.encryptedData,
              iv: res.iv,
              signature: res.signature
            }
            data.userInfo = res.userInfo;
            resolve(data);
          },
          fail: res => {
            reject(res);
          }
        })
      })
    }).then((data) => {
      // 根据临时code获取token
      return new Promise((resolve, reject) => {
        userSvr.login({
          code: data.code,
          encryptedData: data.info.encryptedData,
          iv: data.info.iv
        }, (err, result) => {
          if (err) return reject(err);
          if (result.status !== 0) return reject(result.message);
          app.globalData.userInfo = Object.assign({}, data.userInfo, result.data);
          resolve(app.globalData.userInfo);
        });
      })
      // .then((data)=>{
      //   return app.checkBindInfo(true);
      // })
    });
  }
})