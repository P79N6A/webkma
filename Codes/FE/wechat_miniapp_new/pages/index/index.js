let
  app = getApp(),
  userSvr = require("../../services/user-info.js"),
  config = require('../../config.js'),
  util = require("../../utils/util.js");
let webim = require("../../vendor/timsdk/webim_wx.min.js");
global.webim = webim;
// let a = require("../home/home.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    targetRoute: "",
    authSettingUserInfo: true,
    isNetwork: true,
    pathRoute: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 检查是否存在新版本
    wx.getUpdateManager().onCheckForUpdate(function(res) {
      if (res.hasUpdate) { //如果有新版本
        // 小程序有新版本，会主动触发下载操作（无需开发者触发）
        wx.getUpdateManager().onUpdateReady(function() { //当新版本下载完成，会进行回调
          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          wx.getUpdateManager().applyUpdate();
        })
        // 小程序有新版本，会主动触发下载操作（无需开发者触发）
        wx.getUpdateManager().onUpdateFailed(function() { //当新版本下载失败，会进行回调
          wx.showModal({
            title: '提示',
            content: '检查到有新版本，但下载失败，请检查网络设置',
            showCancel: false,
          })
        })
      }
    });

    let self = this,
      params = {
        act: null,
        id: null
      };
    if (options.scene) {
      decodeURIComponent(options.scene).split("&").forEach(node => {
        let item = node.split("=");
        params[item[0]] = item[1];
      });
    }

    switch (params.act) {
      case "h5": // H5活动
        if (!!params.id) {
          self.data.targetRoute = "/pages/activity-detail/activity-detail?id=" + params.id + "&origin=qrcode";
        } else if (!!params.profile_key) {
          self.data.targetRoute = "/pages/activity-detail/activity-detail?profile_key=" + params.profile_key + "&origin=qrcode";
        }
        break;
      case "offineCashPrize": // 线下兑奖
        self.data.targetRoute = "/pages/offine-cash-prize/offine-cash-prize?id=" + params.id;
        break;
      case "card": // 名片
        self.data.targetRoute = "/pages/card-detail/card-detail?id=" + params.id + "&origin=qrcode";
        break;
      case "article": // 文章
        self.data.targetRoute = "/pages/article-detail/article-detail?id=" + params.id + "&origin=qrcode";
        break;
      default:
        // self.data.targetRoute = options.target ? decodeURIComponent(options.target) : "/pages/user/user"
        break;
    }
    self.setData({
      pathRoute: options
    })
    console.log("options", options)
    wx.$on('_refleshUserInfo', function(e) {
      self.updateGlobalUserInfo();
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // debugger
    let self = this;
    wx.getNetworkType({
      success(res) {
        // debugger
        const networkType = res.networkType
        if (networkType == "none") {
          self.setData({
            isNetwork: false,
            authSettingUserInfo: false
          })
        } else {
          self.setData({
            isNetwork: true,
            authSettingUserInfo: true
          })
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
        }
      }
    });

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
    let self = this,
      tabPageArr = [
        '/pages/overview/overview',
        '/pages/customer/customer',
        '/pages/tasks/tasks',
        '/pages/user/user'
      ];

    self.getUserInfo().then((userInfo) => {
      wx.hideLoading();

      self.data.targetRoute = self.data.pathRoute.target ? decodeURIComponent(self.data.pathRoute.target) : (userInfo.businessId == null ? "/pages/user/user" : "/pages/overview/overview")

      function jump() {
        if (tabPageArr.indexOf(self.data.targetRoute) != -1) {
          wx.switchTab({
            url: self.data.targetRoute,
          })
        } else {
          wx.redirectTo({
            url: self.data.targetRoute
          })
        }
      }
      //登录腾讯IM
      if (self.data.targetRoute.indexOf('/pages/instant-messenger-list/instant-messenger-list') != -1) { //私信列表,则先登录腾讯IM在做跳转
        self.webimLogin(userInfo, () => {
          setTimeout(function() { //为了获取到私信记录webim.MsgStore.sessMap()，延迟加载列表页
            jump();
          }, 500)

        });
      } else {
        self.webimLogin(userInfo);
        jump();
      }

    }).catch((err) => {
      wx.hideLoading();
      let msgTitle = "登录失败";
      switch (err.errMsg) {
        case "request:fail Connection timed out":
          msgTitle = "网络连接超时";
          break;
      }
      util.toast.fail({
        title: msgTitle
      });
      console.error(err);
      self.data.authSettingUserInfo = false;
      self.setData(self.data);
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
          lang: 'zh_CN',
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
          console.log(app.globalData.userInfo);
          resolve(app.globalData.userInfo);
        });
      });
    }).then((userInfo) => {
      return new Promise((resolve, reject) => {
        userSvr.personalInfoQuery({}, (err, res) => {
          if (res.status == 0) {
            app.globalData.userInfo = Object.assign({}, app.globalData.userInfo, res.data);
            app.globalData.commonInfo = {
              emplId: res.data.emplId,
              isManager: res.data.isManager,
              businessId: res.data.businessId,
              userId: res.data.userId
            }
            wx.setStorage({
              key: 'isManager',
              data: res.data.isManager,
            })
            return resolve(app.globalData.userInfo);
          }
        });
      });
    });
  },
  webimLogin: function(userInfo, callback) {
    let _this = this;
    let loginInfo = {
        sdkAppID: config.sdkAppID,
        accountType: config.accountType,
        identifier: userInfo.data[0].user_uuid, //'im_user_kma_01', //userInfo.data[0].user_uuid,
        userSig: userInfo.imsign //'eJxNjk1TgzAURf8L24q*JIQEdwgdpLS21XaYdsNQCCVFAWlk*jH*dykjo9tz7nv3XrXV9O0*TpLqq1SROtdCe9RAu*uxTEWpZCZFc4MGNyxiYp1klOsGMnd6zJmhs9QydiyxOAD5vYvrWqZRrCLSpP-eHdMi6lXHkAGALCB4kOJUy0ZEcab6NoIQdJHBtqI5yqrsBAZkIujsn1Ty47YaUUoQRYThoU-uOzwbbxx-6aCFtBkJNgcXFTM88YLAZK9Heljb84LgMJ98wtR52q5H7t7P7ZdquS1X3pkWoNiFF8-0EjKz9R94*J5LNx*d5mrRQt56Y*37B9wsXGs_' //userInfo.imsign
      },
      listeners = { //监听事件
        "onMsgNotify": function(newMsgList) {
          // debugger
          wx.$emit('onMsgNotify', newMsgList);
          wx.$emit('unReadMsg')
          wx.$emit('getRecentContactList')
        }, //监听新消息(私聊，普通群(非直播聊天室)消息，全员推送消息)事件，必填 
      },
      options = {
        isLogOn: false
      }
    // debugger 
    webim.login(
      loginInfo, listeners, options,
      function(resp) {
        _this.setProfilePortrait({
          user_nickname: userInfo.data[0].user_nickname,
          user_face: userInfo.data[0].user_face
        })
        wx.$emit('unReadMsg');
        !!callback && callback();
      },
      function(err) {
        console.log(err.ErrorInfo);
        console.log("--------------------------------");
      }
    );
  },
  //设置个人资料
  setProfilePortrait: function(userInfo) {
    var profile_item = [{
        "Tag": "Tag_Profile_IM_Nick",
        "Value": userInfo.user_nickname
      },
      {
        "Tag": "Tag_Profile_IM_Image",
        "Value": userInfo.user_face
      }
    ];
    var options = {
      'ProfileItem': profile_item
    };

    webim.setProfilePortrait(
      options,
      function(resp) {},
      function(err) {
        console.log(err.ErrorInfo);
      }
    );
  },
  repalyPage: function() {
    wx.switchTab({
      url: '/pages/overview/overview'
    });
    // getCurrentPages()[getCurrentPages().length - 1].onLoad()
  },
  updateGlobalUserInfo: function() {
    userSvr.personalInfoQuery({}, (err, res) => {
      if (res.status == 0) {
        app.globalData.userInfo = Object.assign({}, app.globalData.userInfo, res.data);
        app.globalData.commonInfo = {
          emplId: res.data.emplId,
          isManager: res.data.isManager,
          businessId: res.data.businessId,
          userId: res.data.userId
        }
        wx.setStorage({
          key: 'isManager',
          data: res.data.isManager,
        })
      }
    });
  }
})