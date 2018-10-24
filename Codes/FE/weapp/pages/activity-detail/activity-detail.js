// pages/activity-detail/activity-detail.js

let activityService = require('../../services/activity-service.js'),
  config = require('../../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    businessUrl: '',
    activityUrl: '',
    id: '',
    active: true,
    message: '加载中...',
    iconType: 'waiting',
    analysisObj: {
      as_type: 'scan_access'
    },
    activityInfo: {},
    as_id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let {
      title,
      id,
      activityUrl
    } = options;

    var self = this;
    self.data.analysisObj.as_belong_module = options.id;
    self.data.analysisObj.as_belong_user = !!options.as_belong_user ? options.as_belong_user : '';
    self.data.analysisObj.as_user = getApp().globalData.userInfo.data[0].user_uuid;

    activityService.activityInfo(id, (err, res) => {
      if (!!err) {
        return;
      }
      if (res.status !== 0) {
        this.setData({
          active: false,
          iconType: 'warn',
          message: res.message
        })
        return;
      }

      let userInfo = getApp().globalData.userInfo || {};
      self.data.activityUrl = res.data.url;
      self.data.businessUrl = self.data.activityUrl + (self.data.activityUrl.indexOf('?') > -1 ? '&' : '?') + 'session_id=' + userInfo.session_id + '&id=' + res.data.relationId + '&secret_key=' + config.secretKey + '&as_belong_user=' + self.data.analysisObj.as_belong_user;

      this.setData({
        activityInfo: res.data,
        businessUrl: self.data.businessUrl,
        active: true
      });

      self.data.analysisObj.as_belong_id = res.data.businessInfo.businessId;

      wx.getLocation({
        type: 'wgs84',
        success: function(res_loca) {
          self.data.analysisObj.as_lat = res_loca.latitude;
          self.data.analysisObj.as_lon = res_loca.longitude;
        },
        complete: function() {
          //统计接口
          activityService.analysisSave(self.data.analysisObj, function(err, result) {
            if (!!err) {
              return;
            }
            if (result.status !== 0) {
              console.log(result.message);
              return
            }
            self.data.as_id = result.data.id;
          })
        }
      })

    })

    wx.setNavigationBarTitle({
      title: title || '活动中心',
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
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    wx.pauseVoice();
    console.log("webviewpage on hide");

    var self = this;
    activityService.analysisSave({
      as_id: self.data.as_id
    }, function(err, res) {
      if (res.status != 0) {
        console.log(res.message);
      }
    })
  },
  onMessageHandler: function(e) {
    console.log(e);
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
    var self = this;
    let data = self.data.activityInfo,
      analysisObj = self.data.analysisObj;

    return {
      title: data.name,
      path: `/pages/index/index?target=` + encodeURIComponent(`/pages/activity-detail/activity-detail?activityUrl=${self.data.activityUrl}&title=${data.name}&id=${data.relationId}&as_belong_user=${analysisObj.as_belong_user}`),
      imageUrl: data.cover
    }
  }

})