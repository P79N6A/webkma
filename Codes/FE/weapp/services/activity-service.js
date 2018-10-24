const
  config = require('../config.js'),
  request = require('../utils/request.js');

module.exports = {
  // 用户授权登录
  myMerketingActivities: (options, callback) => {
    callback = callback || function () { };
    request.post({
      url: `${config.apiHost}api/identify_service/v1/openauth/weapp_authorize?secret_key=${config.secretKey}&client_type=weapp`,
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
  activityList:(options, callback)=>{
    callback = callback || function () { };
    request.get({ 
      url: `${config.apiHost}/manuscript/recommend/activities?secret_key=${config.secretKey}&client_type=weapp`,
      data: options,
      success:(res)=>{
        callback(null,res.data);
      },
      fail: (res) => {
        callback(res);
      }
      })
  },
  //获取员工信息
  infomerge: function (options, callback){
    callback = callback || function () { };
    request.get({
      url: `${config.apiHost}/user/infomerge?secret_key=${config.secretKey}&client_type=weapp`,
      data: options,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  // 获取用户推广的活动列表
  promotionActivities: function (options, callback) {
    callback = callback || function () { };
    request.get({
      url: `${config.apiHost}/manuscript/promotion/activities?secret_key=${config.secretKey}&client_type=weapp`,
      data: options,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  // 获取用户参与的活动列表
  joinActivities: function (options, callback) {
    callback = callback || function () { };
    request.get({
      url: `${config.apiHost}/manuscript/join/activities?secret_key=${config.secretKey}&client_type=weapp`,
      data: options,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  //获取活动详情
  activityDetail: function (options, callback) {
    callback = callback || function () { };
    request.get({
      url: `${config.apiHost}/manuscript/detail?secret_key=${config.secretKey}&client_type=weapp`,
      data: options,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },

  // 活动详情业务获取活动信息
  activityInfo: function (id, callback) {
    callback = callback || function () { };
    request.get({
      url: `${config.apiHost}/manuscript/detail/release?id=${id}`,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  //统计分析服务 - 记录
  analysisSave: function (options, callback){
    callback = callback || function () { };
    options.secret_key = config.secretKey;
    request.post({
      url: `${config.apiGateway}api/analysis_service/v1/analysis/save?client_type=weapp`,
      data: Object.assign({}, options),
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  getPrizeList: function (data, callback) {
    callback = callback || function () { };
    request.get({
      url: `${config.apiHost}/activity/plugin/drawprizedata`,
      data: data,
      success: (res) => {
        callback(null, res.data);
      },
      fail: (res) => {
        callback(res);
      }
    })
  },
  getPrizeDetail: function (data, callback){
    callback = callback || function () { };
    request.get({
      url: `${config.apiHost}/activity/plugin/form/content`,
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


