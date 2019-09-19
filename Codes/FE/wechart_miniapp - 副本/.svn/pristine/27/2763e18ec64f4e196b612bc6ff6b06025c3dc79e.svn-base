let
  app = getApp(),
  userSvr = require("../../services/user-info.js"),
  vcodeSvr = require("../../services/validate-code.js"),
  util = require("../../utils/util.js"),
  config = require('../../config.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sessionId: "",

    phone: "",

    vcodeImgSrc: "",
    vcodeImgCode: "",

    vcodeSMSTitle: "获取短信验证码",
    vcodeSMSCode: "",

    action: "unbind",
    submitDisabled: true,
    smsBtnDisabled: false,
    verificationSuccess: 0 //0-未进行验证，1-验证成功，2-验证失败
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      phone: (!!options && options.phone) || ''
    })
  },

  // 点击获取短信验证码
  smsVCode: function() {
    let self = this;
    self.data.verificationSuccess = 0;
    if (self.data.action == "bind" && self.data.phone == '') {
      util.toast.fail({
        title: "请填写手机号码"
      });
      return
    }
    if (!self.data.smsBtnDisabled) {
      self.selectComponent("#jigsawPuzzle").reloadSilder();
    }
  },
  sendSmsCode: function() { //发送短信验证码
    let self = this;
    self.setData({
      smsBtnDisabled: true
    })
    vcodeSvr.smsnoimg({
      phone: self.data.phone,
      //code: self.data.vcodeImgCode,
      identify: self.data.sessionId
    }, (err, res) => {
      if (err) {
        let title = err.message;
        switch (err.status) {
          case 1:
            title = "手机号码错误";
            break;
        }
        return util.toast.fail({
          title: title,
          complete: () => {
            self.setData({
              smsBtnDisabled: false
            })
            //self.refreshVCode()
          }
        });
      }
      wx.showToast({
        title: "验证码发送成功",
        complete: () => {
          let
            seconds = 60,
            hover = setInterval(() => {
              self.data.vcodeSMSTitle = `${seconds}s`;
              seconds--;
              if (seconds <= 0) {
                self.data.vcodeSMSTitle = "获取短信验证码";
                clearInterval(hover);
                self.selectComponent("#jigsawPuzzle").hideSilder();
                self.setData({
                  smsBtnDisabled: false
                })
              }
              self.setData(self.data);
            }, 1000)
        }
      })
    })
  },
  // 解绑手机号
  unbindPhone: function() {
    let self = this;
    if (!self.data.vcodeSMSCode) {
      return util.toast.notify({
        title: "请填写验证码"
      });
    }
    util.showModal({
      title: '解除绑定',
      content: '尊敬的用户，您确定需要和小宝解除绑定吗？',
      success: (res) => {
        if (res.confirm) {
          confirmUnbind();
        }
      }
    })

    function confirmUnbind() {
      (new Promise((resolve, reject) => {
        userSvr.unbindPhone({
          phone: self.data.phone,
          code: self.data.vcodeSMSCode
        }, (err, res) => {
          if (err) return reject(err);
          resolve(res)
          console.log("解绑手机参数", res);
        })
      })).then(res => {
        return self.refreshUserInfo()
      }).then(res => {
        wx.showToast({
          title: "解绑成功"
        });
        var pages = getCurrentPages();
        var prePage = pages[pages.length - 1];
        prePage.onLoad();
        setTimeout(function() {
          wx.navigateBack({
            delta: 1
          });
        }, 500);
        wx.$emit('refreshUserBindInfo');
      }).catch(err => {
        util.toast.fail({
          title: err.message || "解除失败"
        });
      })
    };
  },

  refreshUserInfo: function() {
    let self = this;
    return Promise.all([
      new Promise((resolve, reject) => {
        userSvr.tokenVerify({}, (err, res) => {
          if (err) {
            util.toast.fail({
              title: "信息更新失败"
            });
            return reject(err)
          }
          app.globalData.userInfo.data = res.data.data;
          resolve(res)
        })
      })
    ])
  },

  bindInput: function(event) {
    this.setData({
      [event.target.id]: event.detail.value
    });
    let data = this.data;
    let disabled = true;
    if (!!data.phone && this.data.verificationSuccess == 2 && !!data.vcodeSMSCode) {
      disabled = false;
    }
    this.setData({
      submitDisabled: disabled
    })

  },
  compTouchend: function(eDetail) { //获取滑动验证的结果
    var self = this;
    self.data.verificationSuccess = (eDetail.detail.isPass ? 2 : 1);
    if (self.data.verificationSuccess == 2) { //验证成功
      self.sendSmsCode();
    }
  }
})