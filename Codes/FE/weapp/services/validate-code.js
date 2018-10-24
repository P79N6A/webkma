const
  app = getApp(),
  config = require('../config.js'),
  request = require('../utils/request.js');

module.exports = {
  // 短信验证码
  sms: (options, callback) => {
    callback = callback || function() {};
    request.post({
      url: `${config.apiGateway}api/communication_server/v1/sms/sendcode`,
      data: options,
      success: (res) => {
        let data = res.data;
        // 登录结果代码
        if (data.status != 0) return callback(data);
        // 正常值返回
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  smsnoimg: (options, callback) => {
    callback = callback || function () { };
    request.post({
      url: `${config.apiGateway}api/communication_server/v1/sms/sendcodenoimg`,
      data: options,
      success: (res) => {
        let data = res.data;
        // 登录结果代码
        if (data.status != 0) return callback(data);
        // 正常值返回
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },

}