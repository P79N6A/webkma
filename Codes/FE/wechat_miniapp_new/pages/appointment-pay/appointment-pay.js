// pages/red-envelopes-card/red-envelopes-card.js
let
  app = getApp(),
  config = require('../../config.js'),
  activityService = require('../../services/activity-service.js'),
  utils = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    appointmentData: {},
    showSucc: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    self = this;
    self.setData({
      rootUserId: options.rootUserId || '',
      id: options.id || '',
      clientType: 'weapp',
      forwardKey: options.forwardKey || '',
      session_id: options.session_id || '',
      userId: options.userId || '',
      totalFee: options.totalFee || '',
      formData: decodeURIComponent(options.formData) || '',
      index: options.index || '', //预约按钮序号
      controlId: options.controlId || ''
    });
    this.initPay();
    this.getAppointmentConfig(); 
  },
  //调起支付
  initPay: function() {
    let self = this;
    new Promise((resolve, reject) => {
      activityService.payInfo({
        productId: 'kma',
        totalFee: self.data.totalFee
      }, (err, res) => {
        if (res.status == 0) {
          self.setData({
            prepayId: res.data.data.prepayId,
            orderId: res.data.orderId
          })
          resolve(res.data.data.prepayId)
        } else {
          reject()
        }
      })
    }).then((result) => {
      return new Promise((resolve, reject) => {
        var appId = config.appId,
          timeStamp = (new Date()).getTime(),
          nonceStr = self.generateNonceString(),
          packStr = 'prepay_id=' + result;

        activityService.generateSign(JSON.stringify({
          "appId": appId,
          "timeStamp": timeStamp,
          "nonceStr": nonceStr,
          "package": packStr,
          "signType": "MD5"
        }), function (err, res) {
          if (res.status == 0) {
            resolve({
              sign: res.data.data,
              time: timeStamp,
              nonceStr: nonceStr,
              packStr: packStr
            });
          }
        })
      })
    }).then((json) => {
      //发起微信支付
      return new Promise((res, rej) => {
        wx.requestPayment({
          'timeStamp': json.timeStr,
          'nonceStr': json.nonceStr,
          'package': json.packStr,
          'signType': 'MD5',
          'paySign': json.sign,
          'success': function (res) {
            utils.toast.fail({
              title: "支付成功"
            });
            res(null);
          },
          'fail': function (res) {
            utils.toast.fail({
              title: "支付失败"
            });
          }
        });
      })
      
    }).then((result) => {
      let self = this;
      activityService.formSubmit({
        "relationId": self.data.id,
        "controlId": self.data.controlId,
        "contents": self.data.formData,
        "isWeapp": 'weapp',
        "forwardKey": self.data.forwardKey,
        "rootUserId": self.data.rootUserId,
        "extType": "appointment"
      }, (err, res) => {
        if (res.status == 0) {
          self.setData({
            showSucc: true
          })
        } else {
          utils.toast.fail({
            title: "表单提交成功"
          });
        }
      })
    })
  },
  // 生成随机数
  generateNonceString: function () {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var length_1 = 16;
    var noceStr = '';
    var maxPos = chars.length;
    while (length_1--)
      noceStr += chars[Math.random() * maxPos | 0];
    return noceStr;
  },
  //获取预约配置
  getAppointmentConfig: function() {
    let self = this;
    activityService.getAppointmentConfig({
      relationId: self.data.id
    }, (err, res) => {
      if (res.status == 0) {
        self.setData({
          appointmentData: res.data[self.data.index]
        })
      } else {
        utils.toast.fail({
          title: "获取预约配置失败"
        });
      }
    })
  }
  
})