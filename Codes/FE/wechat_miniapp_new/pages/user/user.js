// pages/my/index.js
const config = require('../../config.js')
const defaultHeadImg = `${config.bosHost}default-head-img.png`;
const {
  toast
} = require('../../utils/util.js');
const userSvr = require("../../services/user-info.js");
const activityService = require('../../services/activity-service.js');
// const tabbar = //require('../../components/tabbar/tabbar.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}, //个人信息
    rewardInfoList: {}, //个人奖励
    rewardId: '' //奖励id
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideLoading();
    this.getPersonalInfo();
    this.rewardInfo();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.hideLoading();
    this.getPersonalInfo();
    this.rewardInfo();
  },

  // 获取员工信息
  getPersonalInfo: function() {
    var self = this;
    activityService.personalInfoQuery({}, (err, res) => {
      if (res.status == 0) {
        self.setData({
          userInfo: res.data,
          rewardId: res.data.emplId || ''
        })
        wx.setStorageSync('userType', res.data.emplId || '')
      } else {
        console.log(err)
        wx.hideLoading();

      }
    })
  },

  //绑定手机
  getPhoneNumber: function (e) {
    var self = this;
    var app = getApp();
    console.log("全局", e)
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      var userInfo = app.globalData.userInfo;
      wx.showLoading({
        title: '绑定中'
      });
      userSvr.bindPhone({
        sessionKey: userInfo.sessionKey,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        type: 0
      }, function (err, res) {
        wx.hideLoading();
        if (!!err) {
          utils.toast.fail({
            title: err.message
          });
          return;
        }
        wx.closeSocket();
        self.onLoad();
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          });
        }, 500);
        wx.$emit('refreshUserBindInfo');
      })
    }
    // else {
    //   wx.navigateTo({
    //     url: '/pages/binding-phone/binding-phone',
    //   })
    // }
  },

  //获取奖励详情
  rewardInfo: function() {
    let self = this;
    let backData = new Promise(function(resolve, reject) {
      activityService.personalInfoQuery({}, (err, res) => {
        if (res.status == 0) {
          resolve(res.data)
        } else {
          reject(res.message);
        }
      })
    })
    backData.then(function(data) {
      activityService.myReward({
        "id": data.emplId
      }, (err, res) => {
        if (res.status == 0) {
          self.setData({
            rewardInfoList: res.data
          })
        } else {
          console.log(err)
        }
      })
    })
  },

  //编辑个人信息
  gotoUserInfoEdit: function(e) {
    wx.navigateTo({
      url: '/pages/user-info-edit/user-info-edit'
    })
  },

  //立即提现跳转
  gotoFastWithdrawal: function(e) {
    wx.navigateTo({
      url: '/pages/cash-withdrawal/cash-withdrawal'
    })
  },

  //提现记录跳转
  gotoWithdrawalRecord(e) {
    wx.navigateTo({
      url: '/pages/cash-withdrawal-record/cash-withdrawal-record'
    })
  },

  //我的奖励跳转
  gotoPrizeList: function(e) {
    wx.navigateTo({
      url: '/pages/user-prizes-list/user-prizes-list',
    })
  },

  //红包跳转 
  gotoRedEnvelopes: function(e) {
    wx.navigateTo({
      url: '/pages/red-envelopes-record/red-envelopes-record'
    })
  },

  //名片夹跳转
  gotoCardList: function(e) {
    wx.navigateTo({
      url: '/pages/business-card-list/business-card-list'
    })
  },

  //私信跳转
  gotoMessenger: function(e) {
    wx.navigateTo({
      url: '/pages/instant-messenger-list/instant-messenger-list',
    })
  },

  //浏览记录跳转
  gotoActivityHistory: function(e) {
    wx.navigateTo({
      url: '/pages/user-activity-history/user-activity-history',
    })
  },
  //意见反馈跳转
  gotoFeedback: function(e) {
    wx.navigateTo({
      url: '/pages/feedback/feedback?phone=' + this.data.userInfo.phone,
    })
  },

});