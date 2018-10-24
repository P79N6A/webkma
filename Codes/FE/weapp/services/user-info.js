const
  config = require('../config.js'),
  request = require('../utils/request.js');

module.exports = {
  // 用户授权登录
  login: (options, callback) => {
    var self=this;
    callback = callback || function() {};
    request.post({
      url: `${config.apiGateway}api/identify_service/v1/openauth/weapp_authorize?secret_key=${config.secretKey}&client_type=weapp`,
      data: Object.assign({}, options),
      success: (res) => {
        let data = res.data;
        // 登录结果代码
        if (data.status != 0) {
          return callback(data);
        }
        // 正常值返回
        callback(null, data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  tokenVerify: (options, callback) => {
    callback = callback || function () { };
    request.get({
      url: `${config.apiGateway}api/identify_service/v1/user/token_verify?secret_key=${config.secretKey}&client_type=weapp`,
      success: (res) => {
        let data = res.data;
        // 登录结果代码
        if (data.status != 0) return callback(data);
        // 正常值返回
        callback(null, data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  // 绑定手机
  bindPhone: (options, callback) => {
    callback = callback || function() {};
    request.post({
      url: `${config.apiHost}/user/bind/phone`,
      data: Object.assign({}, options),
      success: (res) => {
        let data = res.data;
        // 登录结果代码
        if (data.status != 0) return callback(data);
        // 正常值返回
        callback(null, data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  unbindPhone: (options, callback) => {
    callback = callback || function() {};
    request.post({
      url: `${config.apiHost}/user/unbind/phone`,
      data: Object.assign({}, options),
      success: (res) => {
        let data = res.data;
        // 登录结果代码
        if (data.status != 0) return callback(data);
        // 正常值返回
        callback(null, data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  getUserInfo:function(){
    return new Promise((resolve,reject)=>{
      request.get({
        url: `${config.apiGateway}api/identify_service/v1/user/get_userinfo?secret_key=${config.secretKey}`,
        success: (res) => {
          let data = res.data;
          // 登录结果代码
          if (data.status != 0) return reject(data);
          // 正常值返回
          resolve(data.data);
        },
        fail: (res) => {
          reject(res);
        }
      })
    })
  },
  //用户绑定状态
  bindInfo: function (options, callback) {
    callback = callback || function () { };
    request.get({
      url: `${config.apiHost}/user/bind/info?secret_key=${config.secretKey}&client_type=weapp`,
      data: options,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  }
}