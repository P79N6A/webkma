// pages/extension-task-detail/extension-task-detail.js
const
  activityService = require('../../services/activity-service.js'),
  utilStatistics = require("../../utils/statistics.js"),
  config = require('../../config.js');

let self;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    pageStatus: '',
    message: '加载中...',
    businessUrl: '',
    h5Info: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    self = this;
    self.data.id = options.id;
    self.data.hideShare = options.hideShare || '';
    self.loadPage();
    wx.hideShareMenu();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    wx.pauseVoice();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let
      h5Info = self.data.h5Info,
      userInfo = getApp().globalData.userInfo;

    if (h5Info && userInfo) {
      activityService.analysisSave({
        as_type: 'scan_share',
        as_belong_module: h5Info.relationId,
        as_belong_user: userInfo.data[0].user_uuid,
        as_belong_id: h5Info.businessInfo.businessId
      });

  //用户埋点--分享活动
      utilStatistics.behaviorRecord({ type: "be_share_manu", targetUser: '', targetClass: '', userClass: h5Info.businessInfo.businessId, manuscriptId: h5Info.relationId, comment: "分享活动", action: "分享", goodsCount: h5Info.goodsNumber }, () => { });
    }
    return h5Info ? {
      title: h5Info.name || "活动中心",
      path: `/pages/index/index?target=` + encodeURIComponent(`/pages/activity-detail/activity-detail?id=${h5Info.relationId}&as_belong_user=${userInfo.data[0].user_uuid || ''}`),
      imageUrl: h5Info.cover
    } : {
      title: "推小宝",
      path: `pages/index/index`
    }
  },

  onMessageHandler: function(e) {
    debugger
  },

  loadPage: function() {
    let userInfo = getApp().globalData.userInfo;
    if (!userInfo) return;

    activityService.activityInfo(self.data.id, (err, res) => {
      if (err) {
        return self.setData({
          pageStatus: "error-network",
          message: err.message
        });
      }
      if (res.status !== 0) {
        return self.setData({
          pageStatus: "error-data",
          message: res.message
        });
      }

      wx.setNavigationBarTitle({
        title: res.data.name
      });

      let url = res.data.url,
        params = [
          `session_id=${userInfo.session_id}`,
          `id=${res.data.relationId}`,
          `secret_key=${config.secretKey}`,
          `as_belong_user=${userInfo.data[0].user_uuid}`,
          `forwardingUser=${userInfo.data[0].user_uuid}`,
          `userId=${userInfo.data[0].user_uuid}`,
          `activityName=${res.data.name}`,
          `version=2.0`,
          (!self.data.hideShare ? "view=task" : "")
        ];
      url = res.data.manuscriptType == 3 ? res.data.url.replace('//', '$').split('/')[0].replace('$', '//') + '/article?id=' + res.data.relationId : url;
      self.setData({
        pageStatus: "",
        businessUrl: url + (url.indexOf('?') > -1 ? '&' : '?') + params.join("&") + "#wechat_redirect",
        h5Info: res.data
      });
    });
  }
})