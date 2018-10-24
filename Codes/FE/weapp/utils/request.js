let
  app = getApp(),
  config = require('../config.js');

let req = (options) => {
  let header = options.header || {}
  header["content-type"] = "application/json"; // 默认值
  let userInfo = getApp().globalData.userInfo
  if (userInfo) {
    header["session_id"] = userInfo.session_id;
    header["secret_key"] = config.secretKey;
  }

  wx.request({
    url: options.url,
    data: options.data || {},
    header: header,
    method: options.method,
    dataType: options.dataType,
    responseType: options.responseType,
    success: (res) => {
      options.success && options.success(res)
    },
    fail: (res) => {
      options.fail && options.fail(res)
    },
    complete: (res) => {
      options.complete && options.complete(res)
    }
  })
}

module.exports = {
  get: (options) => {
    options.method = "GET";
    req(options)
  },
  post: (options) => {
    options.method = "POST";
    req(options)
  },
  put: (options) => {
    options.method = "PUT";
    req(options)
  }
};