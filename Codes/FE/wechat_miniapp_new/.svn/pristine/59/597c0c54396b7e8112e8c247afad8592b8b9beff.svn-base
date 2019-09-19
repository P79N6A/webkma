const
  activityService = require('../../services/activity-service.js'),
  utils = require('../../utils/util.js');

let self;
Page({

  data: { 
    id: "",
    h5Info: null
  },

  onLoad: function(options) {
    self = this;
    self.data.id = options.id || '';
    self.data.userId = getApp().globalData.userInfo.data[0].user_uuid;
    self.data.forwardKey = options.forwardKey || '';
    self.data.rootUserId = options.rootUserId || '';
    wx.showLoading({
      title: '数据加载中'
    });
    wx.hideShareMenu();
  },

  onShow: function() {
    let self = this;
    new Promise((resolve, reject) => {
      let option = {
        forwardKey: self.data.forwardKey, //上级forwardKey
        relationId: self.data.id,
        rootUserId: self.data.rootUserId || self.data.userId,
        sourceType: 0,
        clientType: 'weapp'
      };
      activityService.getforwardKey(option, (err, res) => {
        if (!!res && res.status == 0) {
          self.data.myforwardKey = res.data.forwardKey;
          self.data.rootUserId = res.data.rootUserId;
          self.data.timeStamp = new Date().getTime();
        }
        resolve(null);
      });
    }).then((result) => {
      this.getActivityInfo();
    }).catch(() => {
      utils.toast.fail({
        title: "获取分享key失败"
      });
    })  
    
  },

  getActivityInfo: function(){
    let self = this;
    activityService.activityInfo(self.data.id, (err, res) => {
      if (err) return self.errMessage(err);
      if (res.status !== 0) return self.errMessage(res.message);
      wx.setNavigationBarTitle({
        title: res.data.name
      });
      self.setData({
        h5Info: res.data
      });
      wx.hideLoading();
    });
  },
  
  onShareAppMessage: function(e) {
    let self = this,
      h5Info = self.data.h5Info,
      userInfo = getApp().globalData.userInfo,
      rootUserId = (self.data.rootUserId || userInfo.data[0].user_uuid),
      shareObj = null;

    switch (true) {
      case h5Info.manuscriptType != 2: //活动
        shareObj = {
          title: h5Info.name,
          path: `/pages/index/index?target=` + encodeURIComponent(`/pages/activity-detail/activity-detail?activityUrl=${h5Info.url}&title=${h5Info.name}&id=${h5Info.relationId}&rootUserId=${rootUserId}&forwardingUser=${userInfo.data[0].user_uuid}&goodsCount=${h5Info.goodsNumber}&timeStamp=${self.data.timeStamp}&forwardKey=${self.data.myforwardKey}`),
          imageUrl: h5Info.cover || null
        }

        break;
      default: //海报
        shareObj = {
          title: h5Info.name,
          path: `/pages/index/index?target=` + encodeURIComponent(`/pages/post-img/post-img?id=${h5Info.relationId}&from_user=${userInfo.data[0].user_uuid}&from_company=${h5Info.businessInfo.businessId}&timeStamp=${self.data.timeStamp}&rootUserId=${rootUserId}&forwardKey=${self.data.myforwardKey}`),
          imageUrl: h5Info.cover || null
        };
    }
    // 分享数+1
    activityService.behaviorRecord({
      "forwardKey": self.data.myforwardKey,
      "relationId": self.data.id,
      "rootUserId": self.data.rootUserId || self.data.userId,
      "clientType": "weapp",
      "indexType": "user_forward",
      "timeStamp": self.data.timeStamp
    });
    return shareObj;
  },

  errMessage: function(err) {
    wx.hideLoading();
    utils.toast.fail({
      title: err
    });
  },

  btnMoments: function(evt) {
    let param = `id=${this.data.id}&type=${evt.currentTarget.dataset.type}&rootUserId=${this.data.rootUserId}&forwardKey=${this.data.forwardKey}`;
    wx.navigateTo({
      url: `/pages/extension-task-share-cover/extension-task-share-cover?${param}`,
    })
  },

  copyLink: function () {//复制链接
    let self = this, _data = '', _share_url = this.data.h5Info.url;
    _share_url = self.data.h5Info.manuscriptType == 3 ? _share_url.replace('//', '$').split('/')[0].replace('$', '//') + '/article?id=' + self.data.h5Info.id : _share_url;
    _share_url = `${_share_url}?rootUserId=${self.data.rootUserId || self.data.userId}&forwardKey=${self.data.myforwardKey}`;

    switch (true) {
      case self.data.h5Info.goodsNumber == 0: //活动
        _data = `【${self.data.h5Info.name}】${_share_url} 这里有一个好活动分享给你，请查收哦~`;
        break;
      case self.data.h5Info.goodsNumber > 0: //产品
        _data = `【${self.data.h5Info.name}】${_share_url} 悄悄告诉你，这些商品正在搞活动~`;
        break;
    }
    wx.setClipboardData({
      data: `${_data}`,
      success(res) {
        wx.getClipboardData({
          success(res) {
          }
        })
      }
    })
  }
})