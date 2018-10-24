//初始化 page 代理
require('./utils/PageProxy.js')
const util = require('./utils/util.js');
const userSvr = require("./services/user-info.js");
const PubSub = require('./utils/pubsub.js');

Object.defineProperties(wx, {
  "$on": {
    get() {
      return PubSub.subscribe;
    }
  },
  "$emit": {
    get() {
      return PubSub.publish;
    }
  }
})

const globalData = {};
let logining = false;
let getUserTasks = [];
let launched = false;
//app.js
App({
  onLaunch: function() {
    // this.checkAuthorize();
    wx.$on('refreshUserBindInfo', () => {
      this.globalData.userBindInfo = null;
      this.checkBindInfo();
    });
  },
  // checkAuthorize: function () {
  //   wx.getSetting({
  //     success: res => {
  //       if (!!res.authSetting['scope.userInfo']) {
  //         this.getUserInfo().catch((err) => {
  //           util.toast.fail({
  //             title: "登录失败"
  //           });
  //           console.log(err)
  //         });
  //       } else {
  //         console.log('authSetting')
  //         setTimeout(function(){
  //           wx.redirectTo({
  //             url: '/pages/login/login',
  //           })
  //         },100);
  //       }
  //     }
  //   });
  // },
  // getUserInfo:function(){
  //   let self =this;
  //   if (!!self.globalData.userInfo){
  //     return Promise.resolve(self.globalData.userInfo);
  //     }
  //     return new Promise((resolve,reject)=>{
  //       getUserTasks.push({
  //         resolve: resolve,
  //         reject: reject
  //       });
  //       if(!!logining){
  //         return ;
  //       }
  //       logining = true;
  //       // 获取用户信息
  //       return login()
  //       .then(userInfo=>{
  //         getUserTasks.forEach(t=>{
  //           t.resolve(userInfo);
  //         })
  //         clear();
  //       })
  //       .catch(err=>{
  //         getUserTasks.forEach(t => {
  //           t.reject(err);
  //         })
  //         clear();
  //       });
  //       function clear(){
  //         getUserTasks=[];
  //         logining =false;
  //       }
  //       function login() {
  //         return new Promise((resolve, reject) => {
  //             wx.login({
  //               success: resolve,
  //               fail: reject
  //             }); // 获取临时code
  //           }).then((data) => {
  //             // 根据临时code获取token
  //             return new Promise((resolve, reject) => {
  //               //再次对权限进行检测
  //               wx.getSetting({
  //                 success: res => {
  //                   if (!!res.authSetting['scope.userInfo']) {
  //                     wx.getUserInfo({
  //                       withCredentials: true,
  //                       success: res => {
  //                         data.info = {
  //                           encryptedData: res.encryptedData,
  //                           iv: res.iv,
  //                           signature: res.signature
  //                         }
  //                         data.userInfo = Object.assign({}, res.userInfo);
  //                         resolve(data);
  //                       },
  //                       fail: res => {
  //                         reject(res);
  //                       }
  //                     });
  //                   } else {
  //                       wx.redirectTo({
  //                         url: '/pages/login/login',
  //                         complete:function(){
  //                           clear();
  //                         }
  //                       });
  //                   }
  //                 }
  //               });
  //             })
  //           }).then((data) => {
  //             // return console.log(data.code);
  //             // 根据临时code获取token
  //             return new Promise((resolve, reject) => {
  //               userSvr.login({
  //                 code: data.code,
  //                 encryptedData: data.info.encryptedData,
  //                 iv: data.info.iv
  //               }, (err, result) => {
  //                 if (err) return reject(err);
  //                 if (result.status===0){
  //                   let userInfo = Object.assign(data.userInfo, result.data);
  //                   self.globalData.userInfo = userInfo;
  //                   resolve(userInfo);
  //                 }else{
  //                   console.log(result.message);
  //                   wx.showToast({
  //                     title: '登录失败',
  //                     complete:function(){
  //                       reject(result.message);
  //                     }
  //                   });
  //                 }
  //                 logining = false;
  //               });
  //             })
  //           })
  //       }
  //     }); 
  // },
  onShow: function() {
    console.log("app on show");
    if (launched) this.checkBindInfo(true);
    launched = true;
  },
  getUserInfo: function() {
    return userSvr.getUserInfo();
  },
  checkBindInfo: function(need) {
    //用户绑定状态
    return new Promise((resolve, reject) => {
      let app = getApp();
      if (!!need || !app.globalData.userBindInfo) {
        userSvr.bindInfo({}, (err, res) => {
          if (err) return reject(err);
          if (res.status !== 0) return reject(res.message);
          let app = getApp();
          app.globalData.userBindInfo = Object.assign({}, res.data);
          wx.$emit('refreshTabbar', app.globalData.userBindInfo);
          resolve(app.globalData.userBindInfo);
        })
      } else {
        wx.$emit('refreshTabbar', app.globalData.userBindInfo);
        resolve(app.globalData.userBindInfo);
        // setTimeout(() => {
        //   wx.$emit('refreshTabbar', app.globalData.userBindInfo);
        //   resolve(app.globalData.userBindInfo);
        // }, 100);
      }
    })
  },
  globalData: {}
})