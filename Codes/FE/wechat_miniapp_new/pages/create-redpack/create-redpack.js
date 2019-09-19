const
  activityService = require('../../services/activity-service.js'),
  utils = require('../../utils/util.js'),
  articleService = require("../../services/article.js"),
  utilStatistics = require("../../services/statistics-service.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    relationId: '', 
    from_user: '',
    from_company: '',
    shareObj: {
      title: '很高兴认识你，这是我的名片，小小心意，请惠存',
      imageUrl: ''
    },
    h5Info: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    this.data.from_user = options.from_user || "";
    this.data.from_company = options.from_company || "";
    this.data.redpackId = options.redpackId || "";
    self.data.userInfo = getApp().globalData.userInfo;

    new Promise((resolve, rej) => {
      let option = {
        relationId: self.data.userInfo.businessId,
        rootUserId: self.data.userInfo.userId,
        forwardKey: '',
        sourceType: 1,
        clientType: 'weapp'
      };
      activityService.getforwardKey(option, (err, res) => {//获取转发者forwardkey
        if (!!res && res.status == 0) {
          self.data.forwardKey = res.data.forwardKey;
          self.data.timeStamp = new Date().getTime();
        }
        resolve(null);
      });
    }).then(() => {
      wx.setNavigationBarTitle({
        title: '名片'
      });
      this.createCardCover();
    }).catch(() => {}) 
    wx.hideShareMenu();
  },
  // 生成名片红包分享封面
  createCardCover: function () {
    let self = this;
    new Promise((resolve, reject) => {
      // 获取个人信息
      activityService.personalInfoQuery({}, (err, res) => {
        if (res.status == 0) {
          self.data.userInfo = res.data;
          resolve(self.data.userInfo);
        } else {
          reject();
        }
      })
    }).then((userData) => {
      return new Promise((resolve, rej) => {
        if (!!userData.face) {
          wx.getImageInfo({
            src: userData.face,
            success: resolve,
            fail: rej
          })
        } else {
          resolve({ path: '../../images/icon-defaultPhoto.png' });
        }
      });
    }).then((result) => {
      const ctx = wx.createCanvasContext('card_canvas');
      ctx.drawImage(result.path, 60, 76, 90, 90);
      ctx.drawImage('../../images/share-cover.png', 0, -20, 420, 330);
      ctx.drawImage('../../images/redpack-share.png', 0, 0, 420, 330);

      utils.fillTextFn(ctx, self.data.userInfo.name || '姓名', 14, '#000000', 170, 90, 120);
      utils.fillTextFn(ctx, self.data.userInfo.job || '暂无职位', 12, '#000000', 170, 125, 160);

      ctx.draw(true, function () {
        wx.canvasToTempFilePath({
          fileType: "png",
          width: 420,
          height: 330,
          destWidth: 420 * 750 / wx.getSystemInfoSync().windowWidth,
          destHeight: 330 * 750 / wx.getSystemInfoSync().windowWidth,
          canvasId: 'card_canvas',
          success: (res) => {
            self.setData({
              'shareObj.imageUrl': res.tempFilePath
            })
          },
          fail: self.errMessage
        })
      });
    }).catch(() => { })
  },
  errMessage: function(){
    utils.toast.fail({
      title: "生成封面图片失败"
    });
  },
  // 分享
  onShareAppMessage: function (e) {
    let self = this;

    this.data.shareObj.path = `/pages/index/index?target=` + encodeURIComponent(`/pages/bussiness-card-detail/bussiness-card-detail?redpackId=${this.data.redpackId}&origin=share&from_user=${self.data.userInfo.userId}&from_company=${self.data.userInfo.businessId}&rootUserId${self.data.userInfo.userId}&forwardKey=${self.data.forwardKey}&timeStamp=${self.data.timeStamp}`);

    // 分享名片
    activityService.behaviorRecord({
      "forwardKey": self.data.forwardKey,
      "relationId": self.data.userInfo.businessId,
      "rootUserId": self.data.userInfo.userId,
      "clientType": "weapp",
      "indexType": "bussiness_card",
      "timeStamp": self.data.timeStamp,
      "extType": "share"
    });

    return self.data.shareObj;
  }

})