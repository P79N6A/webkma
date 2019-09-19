const
  config = require('../config.js'),
  request = require('../utils/request.js');

module.exports = {
  getCardList: function (query,cb) {
    request.get({
      url: `${config.apiHost}/business-cards?status=${query.status}&name=${query.name}&type=${query.type}&pageIndex=${query.pageIndex}&pageSize=${query.pageSize}`,
      success: (res) => {
        cb(null,res.data);
      },
      fail: (res) => {
        cb(res);
      }
    })
  },
  //保存名片
  saveCard: function (data, callback) {
    callback = callback || function () { };
    let session_id = getApp().globalData.userInfo.session_id
    request.post({
      url: `${config.apiHost}/business-cards?session_id=${session_id}`,
      data: data,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  //查询他人名片详情
  getCardInfo: function (options, callback) {
    request.get({
      url: `${config.apiHost}/business-cards/detail?id=${options.id}`,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  //处理名片请求
  exchangeCard: function (data, callback) {
    callback = callback || function () { };
    let session_id = getApp().globalData.userInfo.session_id
    request.put({
      url: `${config.apiHost}/business-cards?session_id=${session_id}&status=${data.status}&id=${data.id}`,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  //获取最近推广内容
  getRecentProList: function (options, cb) {
    request.get({
      url: `${config.apiHost}/business-cards/share/list?cardUserId=${options.cardUserId}&cardBusinessId=${options.cardBusinessId}&pageIndex=${options.pageIndex}&pageSize=${options.pageSize}`,
      success: (res) => {
        cb(null, res.data);
      },
      fail: (res) => {
        cb(res);
      }
    });
  },
  //自定义配置保存
  saveCustomConfig: function (data, callback) {
    callback = callback || function () { };
    let session_id = getApp().globalData.userInfo.session_id
    request.post({
      url: `${config.apiHost}/custom/config/save?session_id=${session_id}`,
      data: data,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  //自定义配置查询
  getCustomConfig: function (options, callback) {
    request.get({
      url: `${config.apiHost}/custom/config/get?id=${options.id}`,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  //查看他人名片，然后发起交换名片请求
  exchangeRequst: function (data, callback) {
    callback = callback || function () { };
    let session_id = getApp().globalData.userInfo.session_id
    request.post({
      url: `${config.apiHost}/business-cards/exchange?session_id=${session_id}`,
      data: data,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  }

}